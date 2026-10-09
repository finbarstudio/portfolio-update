"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { cn } from "./cn";

export interface NumberFieldProps {
  value: number;
  /** Called with a value already clamped to min/max. */
  onCommit(value: number): void;
  min: number;
  max: number;
  step: number;
  /** Accessible name. */
  label: string;
  unit?: string;
  /** "bare" drops the box, for a field that sits inside another control. */
  variant?: "boxed" | "bare";
  className?: string;
}

/** Digits to show after the point for a given step (0.1 -> 1, 1 -> 0). */
export function decimalsOf(step: number): number {
  return String(step).split(".")[1]?.length ?? 0;
}

/**
 * Editable number. Typing is a draft that commits on Enter or blur and is
 * dropped on Escape. Arrow keys step (Shift = x10).
 */
export function NumberField({
  value,
  onCommit,
  min,
  max,
  step,
  label,
  unit,
  variant = "boxed",
  className,
}: NumberFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const cancelled = useRef(false);
  const decimals = decimalsOf(step);

  function clamp(n: number): number {
    return Math.min(max, Math.max(min, n));
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      cancelled.current = true;
      event.currentTarget.blur();
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const typed = draft === null ? Number.NaN : Number.parseFloat(draft);
      const base = Number.isFinite(typed) ? typed : value;
      const direction = event.key === "ArrowUp" ? 1 : -1;
      const amount = step * (event.shiftKey ? 10 : 1);
      onCommit(clamp(Number((base + direction * amount).toFixed(decimals))));
      setDraft(null);
    }
  }

  function onBlur() {
    if (cancelled.current) {
      cancelled.current = false;
    } else if (draft !== null) {
      const parsed = Number.parseFloat(draft);
      if (Number.isFinite(parsed)) onCommit(clamp(parsed));
    }
    setDraft(null);
  }

  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-ms-control pr-1.5",
        variant === "boxed"
          ? "bg-ms-raised focus-within:outline focus-within:outline-1 focus-within:outline-offset-1 focus-within:outline-ms-ink"
          : "focus-within:bg-ms-canvas/60",
        className,
      )}
    >
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        aria-label={label}
        value={draft ?? value.toFixed(decimals)}
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className="h-full w-10 min-w-0 grow bg-transparent px-1.5 text-right tabular-nums outline-none"
      />
      {unit ? (
        <span aria-hidden="true" className="text-ms-ink-faint">
          {unit}
        </span>
      ) : null}
    </span>
  );
}
