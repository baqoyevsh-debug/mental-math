export type {
  Category,
  TargetCategory,
  Operation,
  DigitMode,
  Term,
  StepInfo,
  GeneratedExample,
  GenerationSettings,
} from "./core/types";

export { classifyDigit, classifyStep } from "./difficulty/classify";
export { buildExample } from "./planner/buildExample";
export { buildSession } from "./planner/buildSession";
export { validateExample } from "./validation/rules";
export type { ValidationResult } from "./validation/rules";
export { isColumnCountViable, getViableColumnCounts } from "./validation/feasibility";
