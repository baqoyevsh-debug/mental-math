"use client";

interface Option<T> {
  value: T;
  label: string;
}

interface ChoiceGroupProps<T extends string | number> {
  label: string;
  options: readonly Option<T>[];
  value: T;
  onSelect: (value: T) => void;
  isDisabled?: (value: T) => boolean;
}

export function ChoiceGroup<T extends string | number>({
  label,
  options,
  value,
  onSelect,
  isDisabled,
}: ChoiceGroupProps<T>) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          const disabled = isDisabled?.(option.value) ?? false;
          return (
            <button
              key={String(option.value)}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option.value)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                disabled
                  ? "cursor-not-allowed border-border bg-background text-muted-foreground/40"
                  : active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:border-foreground/30 hover:bg-accent"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
