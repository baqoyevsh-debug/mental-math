"use client";

interface Option<T> {
  value: T;
  label: string;
}

interface MultiChoiceGroupProps<T extends string> {
  label: string;
  options: readonly Option<T>[];
  values: readonly T[];
  onToggle: (value: T) => void;
}

export function MultiChoiceGroup<T extends string>({
  label,
  options,
  values,
  onToggle,
}: MultiChoiceGroupProps<T>) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = values.includes(option.value);
          // Bo'sh holatga tushmasligi uchun oxirgi tanlangan variantni
          // o'chirib bo'lmaydi.
          const isOnlySelected = active && values.length === 1;
          return (
            <button
              key={option.value}
              type="button"
              disabled={isOnlySelected}
              onClick={() => onToggle(option.value)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-background text-foreground hover:border-foreground/30 hover:bg-accent"
              } ${isOnlySelected ? "cursor-not-allowed opacity-90" : ""}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
