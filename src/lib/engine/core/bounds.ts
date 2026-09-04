import type { DigitMode } from "./types";

export function digitRangeFor(mode: DigitMode): { min: number; max: number } {
  if (mode === 1) return { min: 1, max: 9 };
  if (mode === 2) return { min: 10, max: 99 };
  return { min: 100, max: 999 };
}

/**
 * "Oddiy" — bolalar hali hech qanday o'nlik o'tishini (carry) bilmaydigan eng
 * boshlang'ich bosqich, shuning uchun bu yerda javob (va oraliq natija)
 * tanlangan xonalar sonidan HECH QACHON chiqmasligi kerak — aks holda,
 * masalan, 1 xonali sonlar bilan mashq qilayotgan bolaga 2 xonali javob
 * chiqib qoladi, bu hali 2 xonali sonlarni bilmagan kichik o'quvchi uchun
 * qiyinchilik tug'diradi.
 *
 * "Katta do'st" va "Aralash do'st" esa aynan shu o'tishni (10 dan oshishni)
 * o'rgatish uchun mo'ljallangan — ularda javob bir xona kattaroq bo'lishi
 * texnikaning o'ziga xos, majburiy xususiyati (aks holda bu kategoriyalar
 * umuman generatsiya qilinolmay qoladi).
 */
export function totalMaxFor(mode: DigitMode, isOddiyOnly: boolean): number {
  const singleClassMax = mode === 1 ? 9 : mode === 2 ? 99 : 999;
  if (isOddiyOnly) return singleClassMax;
  return singleClassMax * 10 + 9;
}
