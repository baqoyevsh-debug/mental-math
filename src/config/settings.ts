import type { DigitMode, GenerationSettings, Operation, TargetCategory } from "@/lib/engine";

export const CATEGORY_OPTIONS: { value: TargetCategory; label: string }[] = [
  { value: "ODDIY", label: "Oddiy" },
  { value: "KICHIK_DUST", label: "Kichik do'st" },
  { value: "KATTA_DUST", label: "Katta do'st" },
  { value: "ARALASH_DUST", label: "Aralash do'st" },
  { value: "ARALASH_HAMMASI", label: "Aralash (hammasi)" },
];

export const CATEGORY_LABELS: Record<TargetCategory, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((option) => [option.value, option.label]),
) as Record<TargetCategory, string>;

export const COLUMN_COUNT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const DIGIT_MODE_OPTIONS: { value: DigitMode; label: string }[] = [
  { value: 1, label: "1 xonali (1-9)" },
  { value: 2, label: "2 xonali (10-99)" },
  { value: 3, label: "3 xonali (100-999)" },
];

export const OPERATION_OPTIONS: { value: Operation; label: string }[] = [
  { value: "ADD_ONLY", label: "Faqat qo'shish" },
  { value: "ADD_SUB", label: "Qo'shish va ayirish" },
];

export const EXAMPLE_COUNT_OPTIONS = [10, 20, 30, 50] as const;

export const SPEED_MIN_MS = 500;
export const SPEED_MAX_MS = 3000;
export const SPEED_STEP_MS = 100;

export const DEFAULT_SETTINGS: GenerationSettings = {
  targetCategory: "ODDIY",
  columnCount: 4,
  digitMode: 1,
  operation: "ADD_ONLY",
};

export const DEFAULT_EXAMPLE_COUNT = 20;
export const DEFAULT_SPEED_MS = 1500;
