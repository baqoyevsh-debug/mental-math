import type { GenerationSettings } from "../core/types";
import { createSeededRng, hashString } from "../core/rng";
import { buildExample } from "../planner/buildExample";

const SAMPLE_SIZE = 20;
const MIN_DISTINCT_ANSWERS = 3;

/**
 * Berilgan sozlamalar (kategoriya, o'lchov, amal) uchun ustun soni
 * "ma'noli" hisoblanadimi — ya'ni misollar bir xil javobga qulflanib
 * qolmaydimi (masalan, "Oddiy + Faqat qo'shish + 1 xonali" 4+ ustunda
 * abakus mexanikasi tufayli har doim bitta javobga tushib qoladi, chunki
 * "Oddiy" hech qachon o'nlikka o'tishga ruxsat bermaydi).
 *
 * Boshqa kategoriyalar (Kichik/Katta/Aralash do'st) va "Qo'shish va
 * ayirish" bilan bu muammo tabiiy ravishda yuzaga kelmaydi, shuning uchun
 * bu tekshiruv amalda faqat shu tor holatni cheklaydi.
 *
 * Tekshiruv seedli (deterministik) tasodifiy namuna orqali amalga
 * oshiriladi, shu bois bir xil sozlamalar har doim bir xil natija beradi
 * (UI da tugmalar miltillamasligi uchun muhim).
 */
export function isColumnCountViable(
  base: Omit<GenerationSettings, "columnCount">,
  columnCount: number,
): boolean {
  const settings: GenerationSettings = { ...base, columnCount };
  const seed = hashString(
    `${base.targetCategory}:${columnCount}:${base.digitMode}:${base.operation}`,
  );
  const rng = createSeededRng(seed);
  const answers = new Set<number>();

  try {
    for (let i = 0; i < SAMPLE_SIZE; i++) {
      const example = buildExample(settings, rng);
      answers.add(example.answer);
    }
  } catch {
    return false;
  }

  return answers.size >= Math.min(MIN_DISTINCT_ANSWERS, SAMPLE_SIZE);
}

export function getViableColumnCounts(
  base: Omit<GenerationSettings, "columnCount">,
  candidates: readonly number[],
): Set<number> {
  const viable = new Set<number>();
  for (const columnCount of candidates) {
    if (isColumnCountViable(base, columnCount)) viable.add(columnCount);
  }
  return viable;
}
