"use client";

import { useEffect, useState } from "react";
import type { GeneratedExample } from "@/lib/dataset";

interface PracticeScreenProps {
  examples: GeneratedExample[];
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  categoryLabel: string;
  columnCount: number;
  speedMs: number;
  onMark: (correct: boolean) => void;
  onNext: () => void;
}

type Phase = "flashing" | "ready" | "answer";

interface FlashItem {
  value: number;
  prefix: string;
}

function getFlashItems(example: GeneratedExample): FlashItem[] {
  if (example.kind === "abacus") {
    return example.terms.map((term, index) => ({
      value: term.value,
      prefix: index === 0 ? "" : term.sign === 1 ? "+" : "−",
    }));
  }
  return [
    { value: example.a, prefix: "" },
    { value: example.b, prefix: example.operation === "MULTIPLY" ? "×" : "÷" },
  ];
}

function getAnswerDisplay(example: GeneratedExample): { main: string; sub?: string } {
  if (example.kind === "abacus" || example.remainder === undefined) {
    return { main: String(example.answer) };
  }
  return { main: String(example.answer), sub: `qoldiq ${example.remainder}` };
}

export function PracticeScreen({
  examples,
  currentIndex,
  correctCount,
  wrongCount,
  categoryLabel,
  columnCount,
  speedMs,
  onMark,
  onNext,
}: PracticeScreenProps) {
  const example = examples[currentIndex];
  const flashItems = getFlashItems(example);
  const answerDisplay = getAnswerDisplay(example);
  const isAbacus = example.kind === "abacus";

  const [phase, setPhase] = useState<Phase>("flashing");
  const [revealIndex, setRevealIndex] = useState(0);

  useEffect(() => {
    setPhase("flashing");
    setRevealIndex(0);
  }, [currentIndex]);

  useEffect(() => {
    if (phase !== "flashing") return;

    const timer = setTimeout(() => {
      if (revealIndex + 1 < flashItems.length) {
        setRevealIndex((index) => index + 1);
      } else {
        setPhase("ready");
      }
    }, speedMs);

    return () => clearTimeout(timer);
  }, [phase, revealIndex, flashItems.length, speedMs]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isSpace = event.code === "Space" || event.key === " " || event.key === "Spacebar";

      if (isSpace) {
        event.preventDefault();
        if (phase === "flashing") setPhase("ready");
        else if (phase === "ready") setPhase("answer");
        return;
      }

      if (event.key === "Enter") {
        if (phase === "answer") onNext();
      } else if (event.key === "ArrowRight") {
        if (phase === "answer") onMark(true);
      } else if (event.key === "ArrowLeft") {
        if (phase === "answer") onMark(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, onMark, onNext]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4">
      <div className="w-full max-w-3xl py-3 text-center text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{categoryLabel}</span>
        {isAbacus && <> · {columnCount} ustun</>} · Misol {currentIndex + 1}/{examples.length} ·{" "}
        <span className="text-primary">✓{correctCount}</span>{" "}
        <span className="text-red-600">✗{wrongCount}</span>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center">
        {phase === "flashing" && (
          <FlashingTerm
            key={`${currentIndex}-${revealIndex}`}
            index={revealIndex}
            total={flashItems.length}
            value={flashItems[revealIndex].value}
            prefix={flashItems[revealIndex].prefix}
          />
        )}

        {phase === "ready" && (
          <button
            type="button"
            onClick={() => setPhase("answer")}
            className="animate-in zoom-in-95 fade-in rounded-full bg-primary px-16 py-10 text-3xl font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
          >
            JAVOBNI KO&apos;RSAT
          </button>
        )}

        {phase === "answer" && (
          <div className="animate-in zoom-in-95 fade-in flex flex-col items-center gap-2 duration-200">
            <span
              className="font-mono font-bold tabular-nums text-primary"
              style={{ fontSize: "clamp(5rem, 32vh, 18rem)", lineHeight: 1 }}
            >
              {answerDisplay.main}
            </span>
            {answerDisplay.sub && (
              <span className="text-2xl font-medium text-muted-foreground">{answerDisplay.sub}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex w-full max-w-md flex-col gap-4 pb-10">
        {phase === "flashing" && (
          <div className="flex justify-center gap-1.5">
            {flashItems.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  index <= revealIndex ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        )}

        {phase === "answer" && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onMark(true)}
              className="flex-1 rounded-2xl bg-primary py-5 text-lg font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg active:scale-[0.99]"
            >
              ✓ To&apos;g&apos;ri
            </button>
            <button
              type="button"
              onClick={() => onMark(false)}
              className="flex-1 rounded-2xl bg-red-600 py-5 text-lg font-semibold text-white shadow-md shadow-red-600/20 transition-all hover:shadow-lg active:scale-[0.99]"
            >
              ✗ Xato
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FlashingTerm({
  index,
  total,
  value,
  prefix,
}: {
  index: number;
  total: number;
  value: number;
  prefix: string;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <span className="text-sm font-medium text-muted-foreground">
        {index + 1} / {total}
      </span>
      <span
        className="animate-in zoom-in-95 fade-in font-mono font-bold tabular-nums text-foreground duration-200"
        style={{ fontSize: "clamp(5rem, 32vh, 18rem)", lineHeight: 1 }}
      >
        {prefix}
        {value}
      </span>
    </div>
  );
}
