import { buildExample, type GeneratedExample, type GenerationSettings } from "@/lib/engine";
import { fingerprintExample, openCategoryHistory } from "@/lib/exampleHistory";

const MAX_RETRIES_PER_EXAMPLE = 30;

/**
 * Bir xil kategoriya bo'yicha bugun ishlagan misollar ertaga (yoki bir
 * soatdan keyin) qaytarilmasligi uchun localStorage tarixidan foydalanadi.
 * Agar kategoriya+sozlama juda tor bo'lsa (masalan, 2 ustunli 1 xonali
 * "Oddiy"da bor-yo'g'i bir necha o'nlab xil misol mavjud), tarix
 * to'lganidan keyin urinishlar tugab, takrorlanishga yo'l qo'yiladi —
 * bundan boshqa iloj yo'q, chunki imkoniyatlar chekli.
 */
export function buildUniqueSession(settings: GenerationSettings, count: number): GeneratedExample[] {
  const history = openCategoryHistory(settings.targetCategory);
  const examples: GeneratedExample[] = [];

  for (let i = 0; i < count; i++) {
    let example = buildExample(settings);
    let fingerprint = fingerprintExample(example);
    let attempts = 0;

    while (history.has(fingerprint) && attempts < MAX_RETRIES_PER_EXAMPLE) {
      example = buildExample(settings);
      fingerprint = fingerprintExample(example);
      attempts++;
    }

    history.add(fingerprint);
    examples.push(example);
  }

  history.flush();
  return examples;
}
