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
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const active = values.includes(option.value);
          // Bo'sh holatga tushmasligi uchun oxirgi tanlangan variantni
          // o'chirib bo'lmaydi.
          const isOnlySelected = active && values.length === 1;
          return (
            <label
              key={option.value}
              className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                active ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-accent"
              } ${isOnlySelected ? "cursor-not-allowed opacity-90" : "cursor-pointer"}`}
            >
              <input
                type="checkbox"
                checked={active}
                disabled={isOnlySelected}
                onChange={() => onToggle(option.value)}
                className="h-4 w-4 accent-primary"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
