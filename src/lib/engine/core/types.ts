export type Category = "ODDIY" | "KICHIK_DUST" | "KATTA_DUST" | "ARALASH_DUST";

export type TargetCategory = Category | "ARALASH_HAMMASI";

export type Operation = "ADD_ONLY" | "ADD_SUB";

export type DigitMode = 1 | 2;

export interface Term {
  value: number;
  sign: 1 | -1;
}

export interface StepInfo {
  term: Term;
  category: Category;
  totalAfter: number;
}

export interface GeneratedExample {
  terms: Term[];
  steps: StepInfo[];
  answer: number;
}

export interface GenerationSettings {
  targetCategory: TargetCategory;
  columnCount: number;
  digitMode: DigitMode;
  operation: Operation;
}
