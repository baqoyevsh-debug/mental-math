"use client";

import { useEffect, useState } from "react";
import type { GeneratedExample } from "@/lib/engine";

interface PracticeScreenProps {
  examples: GeneratedExample[];
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  categoryLabel: string;
  columnCount: number;
  onMark: (correct: boolean) => void;
  onNext: () => void;
}

export function PracticeScreen({
  examples,
  currentIndex,
  correctCount,
  wrongCount,
  categoryLabel,
  columnCount,
  onMark,
  onNext,
}: PracticeScreenProps) {
  const [answerShown, setAnswerShown] = useState(false);
  const example = examples[currentIndex];

  useEffect(() => {
    setAnswerShown(false);
  }, [currentIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isSpace = event.code === "Space" || event.key === " " || event.key === "Spacebar";

      if (isSpace) {
        event.preventDefault();
        setAnswerShown(true);
        return;
      }

      if (event.key === "Enter") {
        if (answerShown) onNext();
      } else if (event.key === "ArrowRight") {
        if (answerShown) onMark(true);
      } else if (event.key === "ArrowLeft") {
        if (answerShown) onMark(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answerShown, onMark, onNext]);

  const fontVh = Math.max(46 / columnCount, 5);

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-3xl py-2 text-center text-sm text-muted-foreground">
        {categoryLabel} · {columnCount} ustun · Misol {currentIndex + 1}/{examples.length} · ✓
        {correctCount} ✗{wrongCount}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div
          className="inline-block text-right font-mono tabular-nums"
          style={{ fontSize: `clamp(2.5rem, min(${fontVh}vh, 20vw), 11rem)`, lineHeight: 1.15 }}
        >
          {example.terms.map((term, index) => (
            <div key={index}>
              {index === 0 ? "" : term.sign === 1 ? "+ " : "− "}
              {term.value}
            </div>
          ))}
          <div className="my-2 border-t-4 border-foreground" />
          <div className="text-primary">{answerShown ? example.answer : " "}</div>
        </div>
      </div>

      <div className="flex w-full max-w-md flex-col gap-4 pb-10">
        {!answerShown ? (
          <button
            type="button"
            onClick={() => setAnswerShown(true)}
            className="w-full rounded-lg bg-primary py-6 text-2xl font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            JAVOBNI KO&apos;RSAT
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onMark(true)}
              className="flex-1 rounded-lg bg-emerald-600 py-5 text-lg font-semibold text-white transition-opacity hover:opacity-90"
            >
              ✓ To&apos;g&apos;ri
            </button>
            <button
              type="button"
              onClick={() => onMark(false)}
              className="flex-1 rounded-lg bg-red-600 py-5 text-lg font-semibold text-white transition-opacity hover:opacity-90"
            >
              ✗ Xato
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
