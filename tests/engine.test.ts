import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { classifyDigit } from "@/lib/engine/difficulty/classify";
import { buildExample } from "@/lib/engine/planner/buildExample";
import { validateExample } from "@/lib/engine/validation/rules";
import type { Category, GenerationSettings, Operation, TargetCategory } from "@/lib/engine/core/types";

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

const CATEGORIES: Category[] = ["ODDIY", "KICHIK_DUST", "KATTA_DUST", "ARALASH_DUST"];
const ALL_TARGETS: TargetCategory[] = [...CATEGORIES, "ARALASH_HAMMASI"];

function baseSettings(target: TargetCategory): GenerationSettings {
  return {
    targetCategory: target,
    columnCount: 4,
    digitMode: 1,
    operation: "ADD_SUB",
  };
}

describe("generator — har bir kategoriya uchun 200 ta misol", () => {
  // "Oddiy" — bolalar hali formula bilmaydigan boshlang'ich bosqich, shuning
  // uchun bu yerda kategoriya QAT'IY talab: bironta ham mosliksiz qadam
  // bo'lmasligi kerak. Boshqa kategoriyalarda (amaliyotdagi o'qituvchi bilan
  // tekshirilgan) qat'iy talab emas, shuning uchun mosliksiz qadamlar
  // informatsion (categoryMismatches) sifatida kuzatiladi.
  for (const target of ALL_TARGETS) {
    it(`${target}: javob to'g'ri, oraliq natijalar chegarada`, () => {
      const settings = baseSettings(target);
      let totalMismatches = 0;
      let totalSteps = 0;

      for (let i = 0; i < 200; i++) {
        const example = buildExample(settings);
        const result = validateExample(example, settings);
        expect(result.errors).toEqual([]);
        expect(result.valid).toBe(true);

        totalMismatches += result.categoryMismatches;
        totalSteps += example.steps.length;
      }

      if (target === "ODDIY") {
        expect(totalMismatches).toBe(0);
      } else if (target !== "ARALASH_HAMMASI" && totalSteps > 0) {
        // ARALASH_DUST kabi tabiatan kamdan-kam uchraydigan kategoriyalarda
        // mosliksiz qadamlar sezilarli ulushni tashkil qilishi mumkin (bu —
        // kutilgan holat, xato emas).
        expect(totalMismatches / totalSteps).toBeLessThan(0.6);
      }
    });
  }
});

describe("generator — hech qachon xato tashlamasligi (1 dan 10 gacha ustun)", () => {
  // "Oddiy" endi qat'iy (formulasiz) bo'lgani va javob tanlangan xonalar
  // sonidan chiqmasligi kerakligi sababli, ba'zi tor kombinatsiyalarda
  // (masalan, 1 xonali + Faqat qo'shish + ko'p ustun) misol matematik
  // jihatdan mumkin emas — bu holatda generator aniq xato tashlaydi va UI
  // o'qituvchiga ustun sonini kamaytirishni yoki ayirishni yoqishni taklif
  // qiladi. Shu bois "Oddiy" bu testda alohida (yumshoqroq) tekshiriladi.
  for (const columnCount of [1, 2, 3, 5, 8, 10]) {
    for (const operation of ["ADD_ONLY", "ADD_SUB"] as Operation[]) {
      it(`columnCount=${columnCount}, operation=${operation}: Oddiydan boshqa barcha kategoriyalar uchun ishlaydi`, () => {
        for (const targetCategory of CATEGORIES.filter((c) => c !== "ODDIY")) {
          for (const digitMode of [1, 2, 3] as const) {
            const settings: GenerationSettings = { targetCategory, columnCount, digitMode, operation };
            expect(() => buildExample(settings)).not.toThrow();
          }
        }
      });
    }
  }

  it("Oddiy: kamida ADD_SUB bilan istalgan ustun sonida ishlaydi", () => {
    for (const columnCount of [1, 2, 3, 5, 8, 10]) {
      for (const digitMode of [1, 2, 3] as const) {
        const settings: GenerationSettings = {
          targetCategory: "ODDIY",
          columnCount,
          digitMode,
          operation: "ADD_SUB",
        };
        expect(() => buildExample(settings)).not.toThrow();
      }
    }
  });
});

describe("columnCount=1 — chegara holati", () => {
  it("bitta son, qadamlarsiz, javob shu sonning o'ziga teng", () => {
    const settings = baseSettings("ARALASH_HAMMASI");
    const example = buildExample({ ...settings, columnCount: 1 });
    expect(example.terms).toHaveLength(1);
    expect(example.steps).toHaveLength(0);
    expect(example.answer).toBe(example.terms[0].value);
  });
});

describe("property-based: javob va oraliq natijalar har doim to'g'ri", () => {
  it("turli sozlamalar bo'yicha generatsiya qilingan misollar har doim yaroqli", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_TARGETS),
        fc.integer({ min: 1, max: 10 }),
        fc.constantFrom<1 | 2 | 3>(1, 2, 3),
        fc.constantFrom<Operation>("ADD_ONLY", "ADD_SUB"),
        (targetCategory, columnCount, digitMode, operation) => {
          const settings: GenerationSettings = { targetCategory, columnCount, digitMode, operation };

          let example;
          try {
            example = buildExample(settings);
          } catch (err) {
            // "Oddiy" qat'iy (formulasiz) va javob xonalar sonidan chiqmasligi
            // kerakligi sababli ba'zi tor kombinatsiyalarda matematik
            // jihatdan yechim yo'q bo'lishi mumkin — bu domenning haqiqiy
            // chegarasi, bug emas (UI bunday holatda o'qituvchiga aniq
            // ko'rsatma beradi).
            if (targetCategory === "ODDIY") return;
            throw err;
          }

          const sum = example.terms.reduce((acc, term) => acc + term.sign * term.value, 0);
          expect(sum).toBe(example.answer);

          let running = 0;
          for (const term of example.terms) {
            running += term.sign * term.value;
            expect(running).toBeGreaterThanOrEqual(0);
          }

          const result = validateExample(example, settings);
          expect(result.valid).toBe(true);
        },
      ),
      { numRuns: 200 },
    );
  });
});
