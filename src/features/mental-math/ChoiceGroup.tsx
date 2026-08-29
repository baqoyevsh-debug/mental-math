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
}

export function ChoiceGroup<T extends string | number>({
  label,
  options,
  value,
  onSelect,
}: ChoiceGroupProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onSelect(option.value)}
              aria-pressed={active}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-accent"
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
