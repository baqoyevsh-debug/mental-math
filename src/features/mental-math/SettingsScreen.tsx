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

interface SettingsScreenProps {
  settings: GenerationSettings;
  exampleCount: number;
  error: string | null;
  onChange: (settings: GenerationSettings) => void;
  onExampleCountChange: (count: number) => void;
  onStart: () => void;
}

export function SettingsScreen({
  settings,
  exampleCount,
  error,
  onChange,
  onExampleCountChange,
  onStart,
}: SettingsScreenProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 p-6">
      <h1 className="text-center text-3xl font-bold">Mental Math UZ</h1>

      <ChoiceGroup
        label="Kategoriya"
        options={CATEGORY_OPTIONS}
        value={settings.targetCategory}
        onSelect={(targetCategory) => onChange({ ...settings, targetCategory })}
      />

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

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onStart}
        className="w-full rounded-lg bg-primary py-5 text-xl font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        BOSHLASH
      </button>
    </div>
  );
}
