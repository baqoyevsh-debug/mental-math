import oddiyRaw from "@/data/examples/oddiy.json";
import kichikDostRaw from "@/data/examples/kichikDost.json";
import kattaDostRaw from "@/data/examples/kattaDost.json";
import miksRaw from "@/data/examples/miks.json";
import multiplyRaw from "@/data/examples/multiply.json";
import divideRaw from "@/data/examples/divide.json";
import type { AbacusCategory, AbacusExample, DigitMode, MulDivExample, MulDivOperation, Operation } from "./types";

/** Har bir "misol" — birinchi soni ishorasiz, qolganlari ishorali butun sonlar. */
type RawProblem = number[];

const ABACUS_DATA: Record<AbacusCategory, RawProblem[]> = {
  ODDIY: oddiyRaw as RawProblem[],
  KICHIK_DUST: kichikDostRaw as RawProblem[],
  KATTA_DUST: kattaDostRaw as RawProblem[],
  MIKS: miksRaw as RawProblem[],
};

interface RawMulDivPair {
  op: "MULTIPLY" | "DIVIDE";
  a: number;
  b: number;
}

const MULTIPLY_DATA = multiplyRaw as RawMulDivPair[];
const DIVIDE_DATA = divideRaw as RawMulDivPair[];

function digitModeOf(problem: RawProblem): DigitMode {
  const max = Math.max(...problem.map(Math.abs));
  if (max < 10) return 1;
  if (max < 100) return 2;
  return 3;
}

function isAddSub(problem: RawProblem): boolean {
  return problem.slice(1).some((v) => v < 0);
}

function toAbacusExample(problem: RawProblem): AbacusExample {
  const terms = problem.map((value) => ({ value: Math.abs(value), sign: value < 0 ? -1 : (1 as 1 | -1) }));
  const answer = problem.reduce((sum, v) => sum + v, 0);
  return { kind: "abacus", terms, answer };
}

export function fingerprintAbacusProblem(problem: RawProblem): string {
  return problem.join(",");
}

export function fingerprintMulDivPair(pair: RawMulDivPair): string {
  return `${pair.op}:${pair.a}:${pair.b}`;
}

/** Berilgan kategoriya + xonalar soni + ustun soni + amalga mos keladigan
 * (namunadan olingan) xom misollarni qaytaradi. */
export function filterAbacusPool(
  category: AbacusCategory,
  digitMode: DigitMode,
  columnCount: number,
  operation: Operation,
): RawProblem[] {
  return ABACUS_DATA[category].filter((problem) => {
    if (problem.length !== columnCount) return false;
    if (digitModeOf(problem) !== digitMode) return false;
    if (operation === "ADD_ONLY" && isAddSub(problem)) return false;
    return true;
  });
}

export function countAbacusPool(
  category: AbacusCategory,
  digitMode: DigitMode,
  columnCount: number,
  operation: Operation,
): number {
  return filterAbacusPool(category, digitMode, columnCount, operation).length;
}

const MIN_POOL_SIZE = 3;

/** Berilgan kategoriya+xonalar+amal uchun kamida bitta ustun sonida
 * yetarlicha (MIN_POOL_SIZE) namuna bormi. "Sonlar" tugmalarini
 * yoqish/o'chirish uchun ishlatiladi. */
export function hasAnyAbacusData(
  category: AbacusCategory,
  digitMode: DigitMode,
  operation: Operation,
  columnCandidates: readonly number[],
): boolean {
  return columnCandidates.some(
    (columnCount) => countAbacusPool(category, digitMode, columnCount, operation) >= MIN_POOL_SIZE,
  );
}

/** Berilgan kategoriya+xonalar+amal bo'yicha qaysi ustun sonlarida yetarli
 * namuna borligini qaytaradi. "Ustun soni" tugmalarini yoqish/o'chirish
 * uchun ishlatiladi. */
export function getViableColumnCounts(
  category: AbacusCategory,
  digitMode: DigitMode,
  operation: Operation,
  columnCandidates: readonly number[],
): Set<number> {
  const viable = new Set<number>();
  for (const columnCount of columnCandidates) {
    if (countAbacusPool(category, digitMode, columnCount, operation) >= MIN_POOL_SIZE) {
      viable.add(columnCount);
    }
  }
  return viable;
}

export function abacusProblemsToExamples(problems: RawProblem[]): AbacusExample[] {
  return problems.map(toAbacusExample);
}

export function getMulDivPool(operations: readonly MulDivOperation[]): RawMulDivPair[] {
  const pools: RawMulDivPair[] = [];
  if (operations.includes("MULTIPLY")) pools.push(...MULTIPLY_DATA);
  if (operations.includes("DIVIDE")) pools.push(...DIVIDE_DATA);
  return pools;
}

export function mulDivPairToExample(pair: RawMulDivPair): MulDivExample {
  if (pair.op === "MULTIPLY") {
    return { kind: "muldiv", operation: "MULTIPLY", a: pair.a, b: pair.b, answer: pair.a * pair.b };
  }
  const answer = Math.floor(pair.a / pair.b);
  const remainder = pair.a % pair.b;
  return {
    kind: "muldiv",
    operation: "DIVIDE",
    a: pair.a,
    b: pair.b,
    answer,
    remainder: remainder === 0 ? undefined : remainder,
  };
}
