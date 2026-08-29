import type { GeneratedExample, GenerationSettings } from "../core/types";
import { totalMaxFor } from "../core/bounds";
import { classifyStep } from "../difficulty/classify";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  /** Nechta qadam tanlangan kategoriyaga mos kelmadi (kategoriya — afzallik,
   * qat'iy talab emas, shuning uchun bu xato hisoblanmaydi). */
  categoryMismatches: number;
}

export function validateExample(
  example: GeneratedExample,
  settings: GenerationSettings,
): ValidationResult {
  const errors: string[] = [];
  const totalMax = totalMaxFor(settings.digitMode);
  let categoryMismatches = 0;

  if (example.terms.length !== settings.columnCount) {
    errors.push(
      `Ustunlar soni mos emas: kutilgan ${settings.columnCount}, olingan ${example.terms.length}`,
    );
  }

  let total = 0;
  for (let i = 0; i < example.terms.length; i++) {
    const term = example.terms[i];

    if (i === 0 && term.sign !== 1) {
      errors.push("Birinchi son ishorasi + bo'lishi kerak");
    }

    const before = total;
    total += term.sign * term.value;

    if (total < 0) {
      errors.push(`Oraliq natija manfiy: pozitsiya ${i} (${total})`);
    }
    if (total > totalMax) {
      errors.push(`Oraliq natija chegaradan oshdi: pozitsiya ${i} (${total} > ${totalMax})`);
    }

    if (i > 0) {
      const category = classifyStep(before, term.value, term.sign === 1);
      if (settings.targetCategory !== "ARALASH_HAMMASI" && category !== settings.targetCategory) {
        categoryMismatches++;
      }
    }
  }

  if (total !== example.answer) {
    errors.push(`Javob noto'g'ri: kutilgan ${total}, olingan ${example.answer}`);
  }

  return { valid: errors.length === 0, errors, categoryMismatches };
}
