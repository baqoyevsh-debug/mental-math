"use client";

import { useEffect, useMemo } from "react";
import {
  getViableColumnCounts,
  hasAnyAbacusData,
  type AbacusCategory,
  type DigitMode,
  type GenerationSettings,
  type MulDivOperation,
  type Operation,
} from "@/lib/dataset";
import {
  CATEGORY_OPTIONS,
  COLUMN_COUNT_OPTIONS,
  DIGIT_MODE_OPTIONS,
  EXAMPLE_COUNT_OPTIONS,
  MUL_DIV_OPERATION_OPTIONS,
  OPERATION_OPTIONS,
} from "@/config/settings";
import { ChoiceGroup } from "./ChoiceGroup";
import { MultiChoiceGroup } from "./MultiChoiceGroup";
import { SpeedSlider } from "./SpeedSlider";

interface SettingsScreenProps {
  settings: GenerationSettings;
  exampleCount: number;
  speedMs: number;
  error: string | null;
  onChange: (settings: GenerationSettings) => void;
  onExampleCountChange: (count: number) => void;
  onSpeedChange: (speedMs: number) => void;
  onStart: () => void;
}

export function SettingsScreen({
  settings,
  exampleCount,
  speedMs,
  error,
  onChange,
  onExampleCountChange,
  onSpeedChange,
  onStart,
}: SettingsScreenProps) {
  const isMulDiv = settings.targetCategory === "KOPAYTIRISH_BOLISH";
  const category = settings.targetCategory as AbacusCategory;

  const viableColumnCounts = useMemo(
    () => (isMulDiv ? new Set<number>() : getViableColumnCounts(category, settings.digitMode, settings.operation, COLUMN_COUNT_OPTIONS)),
    [isMulDiv, category, settings.digitMode, settings.operation],
  );

  const viableDigitModes = useMemo(
    () =>
      isMulDiv
        ? new Set<DigitMode>()
        : new Set(
            DIGIT_MODE_OPTIONS.map((o) => o.value).filter((digitMode) =>
              hasAnyAbacusData(category, digitMode, settings.operation, COLUMN_COUNT_OPTIONS),
            ),
          ),
    [isMulDiv, category, settings.operation],
  );

  // Kategoriya/sonlar/amal o'zgarganda joriy ustun soni endi mos kelmasa
  // (masalan, shu kombinatsiyada namunadan olingan misollar yetarli
  // bo'lmasa), eng yaqin yaroqli qiymatga avtomatik o'tkaziladi.
  useEffect(() => {
    if (isMulDiv) return;
    if (viableColumnCounts.has(settings.columnCount)) return;

    const fallback =
      [...viableColumnCounts].filter((n) => n <= settings.columnCount).sort((a, b) => b - a)[0] ??
      [...viableColumnCounts].sort((a, b) => a - b)[0];

    if (fallback !== undefined && fallback !== settings.columnCount) {
      onChange({ ...settings, columnCount: fallback });
    }
  }, [isMulDiv, viableColumnCounts, settings, onChange]);

  useEffect(() => {
    if (isMulDiv) return;
    if (viableDigitModes.has(settings.digitMode)) return;

    const fallback = [...viableDigitModes].sort((a, b) => a - b)[0];
    if (fallback !== undefined && fallback !== settings.digitMode) {
      onChange({ ...settings, digitMode: fallback });
    }
  }, [isMulDiv, viableDigitModes, settings, onChange]);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10 sm:py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Mental Math UZ</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mental arifmetika mashg&apos;ulotlari uchun misol generatori
          </p>
          <p className="mt-1 text-xs font-medium text-primary">
            Xalqaro darajadagi mental arifmetika ustozi Gulasal Ikromova homiyligida
          </p>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <ChoiceGroup
            label="Kategoriya"
            options={CATEGORY_OPTIONS}
            value={settings.targetCategory}
            onSelect={(targetCategory) => onChange({ ...settings, targetCategory })}
          />

          <SpeedSlider valueMs={speedMs} onChange={onSpeedChange} />

          {!isMulDiv && (
            <>
              <ChoiceGroup
                label="Ustun soni"
                options={COLUMN_COUNT_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
                value={settings.columnCount}
                onSelect={(columnCount) => onChange({ ...settings, columnCount })}
                isDisabled={(n) => !viableColumnCounts.has(n)}
              />

              <ChoiceGroup
                label="Sonlar"
                options={DIGIT_MODE_OPTIONS}
                value={settings.digitMode}
                onSelect={(digitMode: DigitMode) => onChange({ ...settings, digitMode })}
                isDisabled={(n) => !viableDigitModes.has(n)}
              />

              <ChoiceGroup
                label="Amal"
                options={OPERATION_OPTIONS}
                value={settings.operation}
                onSelect={(operation: Operation) => onChange({ ...settings, operation })}
              />
            </>
          )}

          {isMulDiv && (
            <MultiChoiceGroup
              label="Amal"
              options={MUL_DIV_OPERATION_OPTIONS}
              values={settings.mulDivOperations}
              onToggle={(op: MulDivOperation) =>
                onChange({
                  ...settings,
                  mulDivOperations: settings.mulDivOperations.includes(op)
                    ? settings.mulDivOperations.filter((existing) => existing !== op)
                    : [...settings.mulDivOperations, op],
                })
              }
            />
          )}

          <ChoiceGroup
            label="Misollar soni"
            options={EXAMPLE_COUNT_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
            value={exampleCount}
            onSelect={onExampleCountChange}
          />
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-2xl bg-primary py-5 text-xl font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/25 active:scale-[0.99]"
        >
          BOSHLASH
        </button>
      </div>
    </div>
  );
}
