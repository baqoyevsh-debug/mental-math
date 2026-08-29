import type { Category } from "../core/types";

function classifyAdditionDigit(c: number, d: number): Category {
  const lower = c % 5;
  const upper = c >= 5 ? 1 : 0;

  if (d <= 4) {
    if (lower + d <= 4) return "ODDIY";
    if (c + d <= 9) return "KICHIK_DUST";
    if (lower >= 5 - d) return "KATTA_DUST";
    return "ARALASH_DUST";
  }

  if (d === 5) {
    return upper === 0 ? "ODDIY" : "KATTA_DUST";
  }

  if (c + d <= 9) return "ODDIY";
  if (lower >= 10 - d) return "KATTA_DUST";
  return "ARALASH_DUST";
}

function classifySubtractionDigit(c: number, d: number): Category {
  const lower = c % 5;
  const upper = c >= 5 ? 1 : 0;

  if (d <= 4) {
    if (lower >= d) return "ODDIY";
    if (c >= d) return "KICHIK_DUST";
    return "KATTA_DUST";
  }

  if (d === 5) {
    return upper === 1 ? "ODDIY" : "KATTA_DUST";
  }

  if (c >= d) return "ODDIY";
  if (lower < d - 5) return "KATTA_DUST";
  return "ARALASH_DUST";
}

/**
 * Abakus ustuni bo'yicha bitta raqamli qadamni tasniflaydi.
 * c — joriy sonning birlar xonasi (0-9), d — qo'shiladigan/ayiriladigan raqam (1-9).
 */
export function classifyDigit(c: number, d: number, isAddition: boolean): Category {
  if (c < 0 || c > 9) throw new Error("c must be a single digit (0-9)");
  if (d < 1 || d > 9) throw new Error("d must be between 1 and 9");
  return isAddition ? classifyAdditionDigit(c, d) : classifySubtractionDigit(c, d);
}

/**
 * currentTotal ga delta ni qo'shish/ayirish qadamini tasniflaydi.
 * Tasnif faqat birlar xonasi kesishuviga asoslanadi; delta ning o'nlar (va undan
 * yuqori) xonasi to'g'ridan-to'g'ri, tasnifsiz qo'shiladi.
 */
export function classifyStep(currentTotal: number, delta: number, isAddition: boolean): Category {
  const d = Math.abs(delta) % 10;
  if (d === 0) return "ODDIY";
  const c = ((currentTotal % 10) + 10) % 10;
  return classifyDigit(c, d, isAddition);
}
