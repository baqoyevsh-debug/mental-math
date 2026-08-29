"use client";

interface ResultsScreenProps {
  total: number;
  correctCount: number;
  onRestart: () => void;
  onSettings: () => void;
}

export function ResultsScreen({ total, correctCount, onRestart, onSettings }: ResultsScreenProps) {
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const wrongCount = total - correctCount;
  const percentColor =
    percent >= 80 ? "text-emerald-600" : percent >= 50 ? "text-amber-600" : "text-red-600";

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="flex flex-col items-center gap-1">
          <span className={`font-mono text-7xl font-bold tabular-nums ${percentColor}`}>
            {percent}%
          </span>
          <p className="text-sm text-muted-foreground">{total} ta misoldan</p>
        </div>

        <div className="flex w-full justify-center gap-8">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-semibold text-emerald-600">{correctCount}</span>
            <span className="text-xs text-muted-foreground">To&apos;g&apos;ri</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-semibold text-red-600">{wrongCount}</span>
            <span className="text-xs text-muted-foreground">Xato</span>
          </div>
        </div>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 rounded-xl bg-primary py-3 text-base font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg active:scale-[0.99]"
          >
            Qaytadan
          </button>
          <button
            type="button"
            onClick={onSettings}
            className="flex-1 rounded-xl border border-border py-3 text-base font-semibold transition-colors hover:bg-accent"
          >
            Sozlamalar
          </button>
        </div>
      </div>
    </div>
  );
}
