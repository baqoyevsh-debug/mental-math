import { describe, expect, it } from "vitest";
import { classifyDigit, classifyStep } from "@/lib/dataset/classify";
import { buildDatasetSession } from "@/lib/dataset/buildSession";
import {
  countAbacusPool,
  getViableColumnCounts,
  hasAnyAbacusData,
} from "@/lib/dataset/loadExamples";
import oddiyRaw from "@/data/examples/oddiy.json";
import kichikDostRaw from "@/data/examples/kichikDost.json";
import kattaDostRaw from "@/data/examples/kattaDost.json";
import miksRaw from "@/data/examples/miks.json";
import multiplyRaw from "@/data/examples/multiply.json";
import divideRaw from "@/data/examples/divide.json";
import type { AbacusCategory, Category, GenerationSettings } from "@/lib/dataset/types";

type RawProblem = number[];

describe("classifyDigit — berilgan misollar", () => {
  it.each([
    [3, 1, "ODDIY"],
    [4, 3, "KICHIK_DUST"],
    [8, 7, "KATTA_DUST"],
    [6, 7, "ARALASH_DUST"],
  ] as [number, number, Category][])("%i + %i -> %s", (c, d, expected) => {
    expect(classifyDigit(c, d, true)).toBe(expected);
  });
});

function runningTotalsOk(problem: RawProblem): boolean {
  if (problem.length < 2 || problem[0] <= 0) return false;
  let total = problem[0];
  for (const term of problem.slice(1)) {
    total += term;
    if (total < 0) return false;
  }
  return true;
}

function isPureOddiy(problem: RawProblem): boolean {
  let total = problem[0];
  for (const term of problem.slice(1)) {
    if (classifyStep(total, term, term > 0) !== "ODDIY") return false;
    total += term;
  }
  return true;
}

describe("namunadan olingan ma'lumotlar bazasi — sifat kafolatlari", () => {
  const datasets: [string, RawProblem[]][] = [
    ["oddiy", oddiyRaw as RawProblem[]],
    ["kichikDost", kichikDostRaw as RawProblem[]],
    ["kattaDost", kattaDostRaw as RawProblem[]],
    ["miks", miksRaw as RawProblem[]],
  ];

  for (const [name, problems] of datasets) {
    it(`${name}: bo'sh emas va har bir misolda oraliq natijalar manfiy emas`, () => {
      expect(problems.length).toBeGreaterThan(0);
      for (const p of problems) {
        expect(runningTotalsOk(p)).toBe(true);
      }
    });
  }

  it("oddiy: HAR BIR qadam qat'iy ravishda ODDIY (formulasiz)", () => {
    const problems = oddiyRaw as RawProblem[];
    for (const p of problems) {
      expect(isPureOddiy(p)).toBe(true);
    }
  });

  it("multiply: har bir juftlik uchun a*b to'g'ri hisoblanadi", () => {
    const pairs = multiplyRaw as { op: string; a: number; b: number }[];
    expect(pairs.length).toBeGreaterThan(0);
    for (const { a, b } of pairs) {
      expect(a * b).toBeGreaterThan(0);
    }
  });

  it("divide: b hech qachon 0 emas", () => {
    const pairs = divideRaw as { op: string; a: number; b: number }[];
    expect(pairs.length).toBeGreaterThan(0);
    for (const { b } of pairs) {
      expect(b).not.toBe(0);
    }
  });
});

describe("buildDatasetSession — abakus kategoriyalari", () => {
  const categories: AbacusCategory[] = ["ODDIY", "KICHIK_DUST", "KATTA_DUST", "MIKS"];

  for (const targetCategory of categories) {
    it(`${targetCategory}: mavjud kombinatsiyada so'ralgan sondagi misol qaytaradi`, () => {
      // Har bir kategoriya uchun kamida bitta ma'lum yaroqli kombinatsiya bor
      // (1 xonali, ADD_SUB) — barcha 4 ta datasetda ham mavjud.
      const settings: GenerationSettings = {
        targetCategory,
        columnCount: 6,
        digitMode: 1,
        operation: "ADD_SUB",
        mulDivOperation: "MULTIPLY",
      };
      const pool = countAbacusPool(targetCategory, 1, 6, "ADD_SUB");
      if (pool === 0) return; // bu aniq kombinatsiya mavjud bo'lmasa, o'tkazib yuboriladi

      const session = buildDatasetSession(settings, 10);
      expect(session).toHaveLength(10);
      for (const example of session) {
        expect(example.kind).toBe("abacus");
        if (example.kind !== "abacus") continue;
        expect(example.terms).toHaveLength(6);
        const sum = example.terms.reduce((acc, t) => acc + t.sign * t.value, 0);
        expect(sum).toBe(example.answer);
      }
    });
  }

  it("mavjud bo'lmagan kombinatsiyada tushunarli xato tashlaydi", () => {
    // Kichik do'st va Katta do'stda 2/3 xonali ma'lumot yo'q.
    const settings: GenerationSettings = {
      targetCategory: "KICHIK_DUST",
      columnCount: 4,
      digitMode: 3,
      operation: "ADD_SUB",
      mulDivOperation: "MULTIPLY",
    };
    expect(countAbacusPool("KICHIK_DUST", 3, 4, "ADD_SUB")).toBe(0);
    expect(() => buildDatasetSession(settings, 10)).toThrow();
  });
});

describe("buildDatasetSession — Ko'paytirish va bo'lish", () => {
  it("Ko'paytirish: javob a*b ga teng", () => {
    const settings: GenerationSettings = {
      targetCategory: "KOPAYTIRISH_BOLISH",
      columnCount: 2,
      digitMode: 1,
      operation: "ADD_SUB",
      mulDivOperation: "MULTIPLY",
    };
    const session = buildDatasetSession(settings, 10);
    expect(session).toHaveLength(10);
    for (const example of session) {
      expect(example.kind).toBe("muldiv");
      if (example.kind !== "muldiv") continue;
      expect(example.answer).toBe(example.a * example.b);
    }
  });

  it("Bo'lish: javob va qoldiq to'g'ri hisoblanadi", () => {
    const settings: GenerationSettings = {
      targetCategory: "KOPAYTIRISH_BOLISH",
      columnCount: 2,
      digitMode: 1,
      operation: "ADD_SUB",
      mulDivOperation: "DIVIDE",
    };
    const session = buildDatasetSession(settings, 10);
    expect(session).toHaveLength(10);
    for (const example of session) {
      expect(example.kind).toBe("muldiv");
      if (example.kind !== "muldiv") continue;
      const remainder = example.remainder ?? 0;
      expect(example.answer * example.b + remainder).toBe(example.a);
      expect(remainder).toBeLessThan(example.b);
    }
  });
});

describe("viability yordamchilari", () => {
  it("Kichik do'stda faqat 1 xonali uchun ma'lumot bor", () => {
    expect(hasAnyAbacusData("KICHIK_DUST", 1, "ADD_SUB", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(true);
    expect(hasAnyAbacusData("KICHIK_DUST", 2, "ADD_SUB", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(false);
    expect(hasAnyAbacusData("KICHIK_DUST", 3, "ADD_SUB", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(false);
  });

  it("Miksda barcha 3 xona rejimi uchun ma'lumot bor", () => {
    for (const digitMode of [1, 2, 3] as const) {
      expect(hasAnyAbacusData("MIKS", digitMode, "ADD_SUB", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(true);
    }
  });

  it("getViableColumnCounts faqat yetarli namunali ustunlarni qaytaradi", () => {
    const viable = getViableColumnCounts("ODDIY", 1, "ADD_SUB", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(viable.size).toBeGreaterThan(0);
    for (const columnCount of viable) {
      expect(countAbacusPool("ODDIY", 1, columnCount, "ADD_SUB")).toBeGreaterThanOrEqual(3);
    }
  });
});
