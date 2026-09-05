"use client";

import { useState } from "react";
import type { GeneratedExample, GenerationSettings } from "@/lib/dataset";
import { buildDatasetSession } from "@/lib/dataset";
import {
  CATEGORY_LABELS,
  DEFAULT_EXAMPLE_COUNT,
  DEFAULT_SETTINGS,
  DEFAULT_SPEED_MS,
} from "@/config/settings";
import { SettingsScreen } from "./SettingsScreen";
import { PracticeScreen } from "./PracticeScreen";
import { ResultsScreen } from "./ResultsScreen";

type Screen = "settings" | "practice" | "results";

export function MentalMathApp() {
  const [screen, setScreen] = useState<Screen>("settings");
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [exampleCount, setExampleCount] = useState(DEFAULT_EXAMPLE_COUNT);
  const [speedMs, setSpeedMs] = useState(DEFAULT_SPEED_MS);
  const [examples, setExamples] = useState<GeneratedExample[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function startSession() {
    try {
      const session = buildDatasetSession(settings, exampleCount);
      setExamples(session);
      setCurrentIndex(0);
      setCorrectCount(0);
      setWrongCount(0);
      setError(null);
      setScreen("practice");
    } catch {
      setError(
        "Bu sozlamalar bilan misol topilmadi. Boshqa ustun soni, sonlar yoki amal tanlang.",
      );
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= examples.length) {
      setScreen("results");
    } else {
      setCurrentIndex((index) => index + 1);
    }
  }

  function handleMark(correct: boolean) {
    if (correct) setCorrectCount((count) => count + 1);
    else setWrongCount((count) => count + 1);
    handleNext();
  }

  if (screen === "practice") {
    return (
      <PracticeScreen
        examples={examples}
        currentIndex={currentIndex}
        correctCount={correctCount}
        wrongCount={wrongCount}
        categoryLabel={CATEGORY_LABELS[settings.targetCategory]}
        columnCount={settings.columnCount}
        speedMs={speedMs}
        onMark={handleMark}
        onNext={handleNext}
      />
    );
  }

  if (screen === "results") {
    return (
      <ResultsScreen
        total={examples.length}
        correctCount={correctCount}
        onRestart={startSession}
        onSettings={() => setScreen("settings")}
      />
    );
  }

  return (
    <SettingsScreen
      settings={settings}
      exampleCount={exampleCount}
      speedMs={speedMs}
      error={error}
      onChange={setSettings}
      onExampleCountChange={setExampleCount}
      onSpeedChange={setSpeedMs}
      onStart={startSession}
    />
  );
}
