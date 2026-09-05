const STORAGE_PREFIX = "mentalMathUz:seen:";
const MAX_HISTORY_PER_CATEGORY = 5000;

function storageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

function readHistory(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(key));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeHistory(key: string, history: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(key), JSON.stringify(history));
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
 * Bitta sozlamalar kombinatsiyasi (kategoriya+xonalar+ustun+amal) uchun
 * "ko'rilgan misollar" tarixini bir marta xotiraga o'qiydi (localStorage'ni
 * har safar qayta o'qimaslik uchun) va sessiya oxirida `flush()` bilan
 * diskka yozadi.
 */
export function openCategoryHistory(key: string): CategoryHistory {
  const order = readHistory(key);
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
      writeHistory(key, order);
      dirty = false;
    },
  };
}
