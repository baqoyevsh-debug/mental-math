"use client";

interface ResultsScreenProps {
  total: number;
  correctCount: number;
  onRestart: () => void;
  onSettings: () => void;
}

export function ResultsScreen({ total, correctCount, onRestart, onSettings }: ResultsScreenProps) {
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6 text-center">
      <p className="text-2xl font-medium">
        {total} ta misol · {correctCount} to&apos;g&apos;ri · {percent}%
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Qaytadan
        </button>
        <button
          type="button"
          onClick={onSettings}
          className="rounded-lg border border-border px-6 py-3 text-lg font-semibold hover:bg-accent"
        >
          Sozlamalar
        </button>
      </div>
    </div>
  );
}
