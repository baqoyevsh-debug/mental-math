/** Bitta qadamning abakus texnikasi bo'yicha tasnifi (ichki, faqat
 * ma'lumotlar bazasini tekshirish uchun ishlatiladi). */
export type Category = "ODDIY" | "KICHIK_DUST" | "KATTA_DUST" | "ARALASH_DUST";

/** O'qituvchi tanlaydigan mashq kategoriyasi — har biri PDF namunalaridagi
 * bitta kitobga mos keladi. */
export type TargetCategory =
  | "ODDIY"
  | "KICHIK_DUST"
  | "KATTA_DUST"
  | "MIKS"
  | "KOPAYTIRISH_BOLISH";

export type AbacusCategory = "ODDIY" | "KICHIK_DUST" | "KATTA_DUST" | "MIKS";

export type Operation = "ADD_ONLY" | "ADD_SUB";

export type MulDivOperation = "MULTIPLY" | "DIVIDE";

export type DigitMode = 1 | 2 | 3;

export interface Term {
  value: number;
  sign: 1 | -1;
}

export interface AbacusExample {
  kind: "abacus";
  terms: Term[];
  answer: number;
}

export interface MulDivExample {
  kind: "muldiv";
  operation: MulDivOperation;
  a: number;
  b: number;
  answer: number;
  /** Faqat bo'lishda, agar tekis bo'linmasa. */
  remainder?: number;
}

export type GeneratedExample = AbacusExample | MulDivExample;

export interface GenerationSettings {
  targetCategory: TargetCategory;
  /** ODDIY/KICHIK_DUST/KATTA_DUST/MIKS uchun; KOPAYTIRISH_BOLISH da e'tiborga olinmaydi. */
  columnCount: number;
  /** ODDIY/KICHIK_DUST/KATTA_DUST/MIKS uchun; KOPAYTIRISH_BOLISH da e'tiborga olinmaydi. */
  digitMode: DigitMode;
  /** ODDIY/KICHIK_DUST/KATTA_DUST/MIKS uchun. */
  operation: Operation;
  /** Faqat KOPAYTIRISH_BOLISH uchun — ikkalasini ham tanlash mumkin (bo'sh
   * bo'lmasligi kerak). */
  mulDivOperations: MulDivOperation[];
}
