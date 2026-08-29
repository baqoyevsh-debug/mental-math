import type { DigitMode, Operation, TargetCategory, Category } from "../core/types";
import { classifyStep } from "../difficulty/classify";

export interface CandidateStep {
  value: number;
  sign: 1 | -1;
  newTotal: number;
  category: Category;
}

function digitRange(mode: DigitMode): { min: number; max: number } {
  return mode === 1 ? { min: 1, max: 9 } : { min: 10, max: 99 };
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
  const { min, max } = digitRange(digitMode);
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
  const { min, max } = digitRange(digitMode);
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

  // Amaliyotdagi o'qituvchilar bilan tekshirilgach ma'lum bo'ldiki, misoldagi
  // HAR BIR qadam qat'iy ravishda tanlangan kategoriyaga mos kelishi shart
  // emas — kategoriya faqat afzal qilingan texnika, majburiy talab emas.
  // Shu bois avval mos kategoriya + takrorsiz, keyin mos kategoriya +
  // takror bilan, so'ng (agar chindan ham imkonsiz bo'lsa) kategoriyasiz
  // variant qidiriladi — bu istalgan ustun soni (hatto 10 tagacha) uchun
  // ham misol generatsiya qilinishini kafolatlaydi.
  return (
    findMatch(false, true) ??
    findMatch(true, true) ??
    findMatch(false, false) ??
    findMatch(true, false)
  );
}
