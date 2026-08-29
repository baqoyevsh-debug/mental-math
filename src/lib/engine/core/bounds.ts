import type { DigitMode } from "./types";

export function digitRangeFor(mode: DigitMode): { min: number; max: number } {
  if (mode === 1) return { min: 1, max: 9 };
  if (mode === 2) return { min: 10, max: 99 };
  return { min: 100, max: 999 };
}

/** Har bir sonning o'zidan bir tartib katta — bir necha sonni qo'shganda ham
 * oraliq natija shu chegaradan oshmasligi kerak. */
export function totalMaxFor(mode: DigitMode): number {
  if (mode === 1) return 99;
  if (mode === 2) return 999;
  return 9999;
}
