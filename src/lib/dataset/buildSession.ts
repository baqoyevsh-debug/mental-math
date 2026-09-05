import type { GeneratedExample, GenerationSettings } from "./types";
import { openCategoryHistory } from "@/lib/exampleHistory";
import {
  abacusProblemsToExamples,
  filterAbacusPool,
  fingerprintAbacusProblem,
  fingerprintMulDivPair,
  getMulDivPool,
  mulDivPairToExample,
} from "./loadExamples";

function shuffle<T>(items: T[]): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Tanlangan `count` ta elementni `pool`dan, so'nggi seanslarda ko'rilganlarni
 * (agar iloji bo'lsa) chetlab o'tib tanlaydi. Zaxira tugasa, takrorlanishga
 * yo'l qo'yiladi (bundan boshqa iloj yo'q). */
function pickUnique<T>(pool: T[], count: number, fingerprint: (item: T) => string, history: ReturnType<typeof openCategoryHistory>): T[] {
  if (pool.length === 0) {
    throw new Error("Bu sozlamalar bilan misol topilmadi. Boshqa sozlamalarni tanlang.");
  }

  const picked: T[] = [];
  let shuffled = shuffle(pool);
  let cursor = 0;

  while (picked.length < count) {
    if (cursor >= shuffled.length) {
      shuffled = shuffle(pool);
      cursor = 0;
    }

    const candidate = shuffled[cursor];
    cursor++;
    const fp = fingerprint(candidate);

    if (history.has(fp) && picked.length < pool.length) {
      continue;
    }

    history.add(fp);
    picked.push(candidate);
  }

  return picked;
}

export function buildDatasetSession(settings: GenerationSettings, count: number): GeneratedExample[] {
  if (settings.targetCategory === "KOPAYTIRISH_BOLISH") {
    const opsKey = [...settings.mulDivOperations].sort().join(",");
    const history = openCategoryHistory(`KOPAYTIRISH_BOLISH:${opsKey}`);
    const pool = getMulDivPool(settings.mulDivOperations);
    const picked = pickUnique(pool, count, fingerprintMulDivPair, history);
    history.flush();
    return picked.map(mulDivPairToExample);
  }

  const historyKey = `${settings.targetCategory}:${settings.digitMode}:${settings.columnCount}:${settings.operation}`;
  const history = openCategoryHistory(historyKey);
  const pool = filterAbacusPool(
    settings.targetCategory,
    settings.digitMode,
    settings.columnCount,
    settings.operation,
  );
  const picked = pickUnique(pool, count, fingerprintAbacusProblem, history);
  history.flush();
  return abacusProblemsToExamples(picked);
}
