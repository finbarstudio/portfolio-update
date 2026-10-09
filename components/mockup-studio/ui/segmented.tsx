"use client";

import { cn } from "./cn";

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string | number> {
  /** Accessible name of the group. */
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange(value: T): void;
  className?: string;
}

/** A row of mutually exclusive toggle buttons. */
export function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <fieldset
      className={cn(
        "flex min-w-0 gap-0.5 rounded-ms-panel bg-[#101012] p-[3px]",
        className,
      )}
    >
      <legend className="sr-only">{label}</legend>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className="h-7 min-w-0 flex-1 truncate rounded-[7px] px-1 text-[11px] text-ms-ink-muted transition-colors hover:text-ms-ink aria-pressed:bg-[#34343a] aria-pressed:text-ms-ink"
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}
