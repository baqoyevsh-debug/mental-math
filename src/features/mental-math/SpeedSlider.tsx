"use client";

import { SPEED_MAX_MS, SPEED_MIN_MS, SPEED_STEP_MS } from "@/config/settings";

interface SpeedSliderProps {
  valueMs: number;
  onChange: (valueMs: number) => void;
}

export function SpeedSlider({ valueMs, onChange }: SpeedSliderProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Tezlik
        </span>
        <span className="font-mono text-sm font-medium text-foreground">
          {(valueMs / 1000).toFixed(1)}s
        </span>
      </div>
      <input
        type="range"
        min={SPEED_MIN_MS}
        max={SPEED_MAX_MS}
        step={SPEED_STEP_MS}
        value={valueMs}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Tez</span>
        <span>Sekin</span>
      </div>
    </div>
  );
}
