import type { DigitMode, Operation, TargetCategory, Category } from "../core/types";
import { digitRangeFor } from "../core/bounds";
import { classifyStep } from "../difficulty/classify";

export interface CandidateStep {
  value: number;
  sign: 1 | -1;
  newTotal: number;
  category: Category;
}

function shuffle<T>(items: T[], rng: () => number): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickFirstNumber(
  digitMode: DigitMode,
  excluded: Set<string>,
  rng: () => number,
): number | null {
  const { min, max } = digitRangeFor(digitMode);
  const values: number[] = [];
  for (let value = min; value <= max; value++) {
    if (!excluded.has(String(value))) values.push(value);
  }
  if (values.length === 0) return null;
  const shuffled = shuffle(values, rng);
  return shuffled[0];
}

export function pickNextStep(
  currentTotal: number,
  previousValue: number,
  target: TargetCategory,
  digitMode: DigitMode,
  operation: Operation,
  totalMax: number,
  excluded: Set<string>,
  rng: () => number,
): CandidateStep | null {
  const { min, max } = digitRangeFor(digitMode);
  const signs: (1 | -1)[] = operation === "ADD_ONLY" ? [1] : [1, -1];

  const pool: { value: number; sign: 1 | -1 }[] = [];
  for (const sign of signs) {
    for (let value = min; value <= max; value++) {
      pool.push({ value, sign });
    }
  }

  const shuffled = shuffle(pool, rng);

  function findMatch(allowRepeat: boolean, requireCategory: boolean): CandidateStep | null {
    for (const candidate of shuffled) {
      const key = `${candidate.sign}:${candidate.value}`;
      if (excluded.has(key)) continue;
      if (!allowRepeat && candidate.value === previousValue) continue;

      const newTotal = currentTotal + candidate.sign * candidate.value;
      if (newTotal < 0 || newTotal > totalMax) continue;

      const category = classifyStep(currentTotal, candidate.value, candidate.sign === 1);
      if (requireCategory && target !== "ARALASH_HAMMASI" && category !== target) continue;

      return { value: candidate.value, sign: candidate.sign, newTotal, category };
    }
    return null;
  }

  // "Oddiy" — bolalar hali hech qanday formula (kichik/katta do'st texnikasi)
  // bilmaydigan eng boshlang'ich bosqich, shuning uchun bu yerda kategoriya
  // qat'iy talab: formula talab qiladigan qadam HECH QACHON sizib chiqmasligi
  // kerak (mos qadam topilmasa, misolning o'zi qaytadan quriladi).
  //
  // Boshqa kategoriyalarda (Kichik/Katta/Aralash do'st) esa amaliyotdagi
  // o'qituvchilar bilan tekshirilgach ma'lum bo'ldiki, HAR BIR qadam qat'iy
  // mos kelishi shart emas — shu bois ular uchun kategoriyasiz variantga ham
  // (oxirgi chora sifatida) tushish mumkin, bu istalgan ustun soni uchun ham
  // misol generatsiya qilinishini kafolatlaydi.
  if (target === "ODDIY") {
    return findMatch(false, true) ?? findMatch(true, true);
  }

  return (
    findMatch(false, true) ??
    findMatch(true, true) ??
    findMatch(false, false) ??
    findMatch(true, false)
  );
}
