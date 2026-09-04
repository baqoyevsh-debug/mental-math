import type { GenerationSettings, GeneratedExample, StepInfo, Term } from "../core/types";
import { totalMaxFor } from "../core/bounds";
import { pickFirstNumber, pickNextStep } from "../generators/candidates";

const MAX_BACKTRACKS = 5000;

export function buildExample(
  settings: GenerationSettings,
  rng: () => number = Math.random,
): GeneratedExample {
  const totalMax = totalMaxFor(settings.digitMode, settings.targetCategory === "ODDIY");
  const terms: Term[] = [];
  const steps: StepInfo[] = [];
  const excludedAtPosition: Set<string>[] = [];
  let total = 0;
  let backtracks = 0;

  while (terms.length < settings.columnCount) {
    const pos = terms.length;
    if (!excludedAtPosition[pos]) excludedAtPosition[pos] = new Set<string>();

    if (pos === 0) {
      const value = pickFirstNumber(settings.digitMode, excludedAtPosition[0], rng);
      if (value === null) {
        throw new Error(
          "Misol generatsiya qilinmadi: berilgan sozlamalar uchun yechim topilmadi.",
        );
      }
      terms.push({ value, sign: 1 });
      total = value;
      continue;
    }

    const previousValue = terms[pos - 1].value;
    const result = pickNextStep(
      total,
      previousValue,
      settings.targetCategory,
      settings.digitMode,
      settings.operation,
      totalMax,
      excludedAtPosition[pos],
      rng,
    );

    if (result) {
      terms.push({ value: result.value, sign: result.sign });
      steps.push({
        term: { value: result.value, sign: result.sign },
        category: result.category,
        totalAfter: result.newTotal,
      });
      total = result.newTotal;
      continue;
    }

    // Joriy pozitsiyada hech qanday mos son topilmadi — oldingi pozitsiyaga
    // qaytib, u yerda boshqa son tanlanadi (o'sha son shu yerda ishlamasligi
    // aniqlandi, shuning uchun u pozitsiyada qora ro'yxatga qo'shiladi).
    backtracks++;
    if (backtracks > MAX_BACKTRACKS) {
      throw new Error(
        "Misol generatsiya qilinmadi: berilgan sozlamalar uchun yechim topilmadi.",
      );
    }

    excludedAtPosition[pos] = new Set<string>();

    const removedPos = pos - 1;
    const removed = terms.pop()!;
    if (removedPos >= 1) steps.pop();
    total -= removed.sign * removed.value;
    excludedAtPosition[removedPos].add(`${removed.sign}:${removed.value}`);
  }

  return { terms, steps, answer: total };
}
