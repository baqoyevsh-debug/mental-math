import type { GenerationSettings, GeneratedExample } from "../core/types";
import { buildExample } from "./buildExample";

export function buildSession(
  settings: GenerationSettings,
  count: number,
  rng: () => number = Math.random,
): GeneratedExample[] {
  const examples: GeneratedExample[] = [];
  for (let i = 0; i < count; i++) {
    examples.push(buildExample(settings, rng));
  }
  return examples;
}
