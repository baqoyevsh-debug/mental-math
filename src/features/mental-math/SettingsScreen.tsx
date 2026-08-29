"use client";

import type { DigitMode, GenerationSettings, Operation } from "@/lib/engine";
import {
  CATEGORY_OPTIONS,
  COLUMN_COUNT_OPTIONS,
  DIGIT_MODE_OPTIONS,
  EXAMPLE_COUNT_OPTIONS,
  OPERATION_OPTIONS,
} from "@/config/settings";
import { ChoiceGroup } from "./ChoiceGroup";
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
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10 sm:py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Mental Math UZ</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mental arifmetika mashg&apos;ulotlari uchun misol generatori
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

          <ChoiceGroup
            label="Ustun soni"
            options={COLUMN_COUNT_OPTIONS.map((n) => ({ value: n, label: String(n) }))}
            value={settings.columnCount}
            onSelect={(columnCount) => onChange({ ...settings, columnCount })}
          />

          <ChoiceGroup
            label="Sonlar"
            options={DIGIT_MODE_OPTIONS}
            value={settings.digitMode}
            onSelect={(digitMode: DigitMode) => onChange({ ...settings, digitMode })}
          />

          <ChoiceGroup
            label="Amal"
            options={OPERATION_OPTIONS}
            value={settings.operation}
            onSelect={(operation: Operation) => onChange({ ...settings, operation })}
          />

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
