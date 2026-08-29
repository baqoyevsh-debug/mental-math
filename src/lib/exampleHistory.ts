import type { GeneratedExample, TargetCategory } from "@/lib/engine";

const STORAGE_PREFIX = "mentalMathUz:seen:";
const MAX_HISTORY_PER_CATEGORY = 5000;

function storageKey(category: TargetCategory): string {
  return `${STORAGE_PREFIX}${category}`;
}

export function fingerprintExample(example: GeneratedExample): string {
  return example.terms.map((term) => `${term.sign > 0 ? "+" : "-"}${term.value}`).join(",");
}

function readHistory(category: TargetCategory): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(category));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeHistory(category: TargetCategory, history: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(category), JSON.stringify(history));
  } catch {
    // Xotira to'lib qolgan yoki localStorage yopiq bo'lishi mumkin — bunday
    // holatda shunchaki tarix saqlanmaydi, misollar generatsiyasiga
    // ta'sir qilmaydi.
  }
}

export interface CategoryHistory {
  has(fingerprint: string): boolean;
  add(fingerprint: string): void;
  flush(): void;
}

/**
 * Bitta kategoriya uchun "ko'rilgan misollar" tarixini bir marta xotiraga
 * o'qiydi (localStorage'ni har safar qayta o'qimaslik uchun) va sessiya
 * oxirida `flush()` bilan diskka yozadi.
 */
export function openCategoryHistory(category: TargetCategory): CategoryHistory {
  const order = readHistory(category);
  const seen = new Set(order);
  let dirty = false;

  return {
    has(fingerprint) {
      return seen.has(fingerprint);
    },
    add(fingerprint) {
      if (seen.has(fingerprint)) return;
      seen.add(fingerprint);
      order.push(fingerprint);
      dirty = true;
    },
    flush() {
      if (!dirty) return;
      if (order.length > MAX_HISTORY_PER_CATEGORY) {
        const overflow = order.length - MAX_HISTORY_PER_CATEGORY;
        const evicted = order.splice(0, overflow);
        for (const fingerprint of evicted) seen.delete(fingerprint);
      }
      writeHistory(category, order);
      dirty = false;
    },
  };
}
