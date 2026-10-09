"use client";

import { type ReactNode, useId } from "react";
import { decimalsOf, NumberField } from "./number-field";

export interface SliderProps {
  label: string;
  value: number;
  onChange(value: number): void;
  /** The range the bar covers when dragged. */
  min: number;
  max: number;
  step: number;
  unit?: string;
  /** Outer limits for a typed value. Default to the bar's range. */
  typedMin?: number;
  typedMax?: number;
  /** Double-clicking the bar resets to this. */
  defaultValue?: number;
  /** Extra controls to the right of the bar. */
  trailing?: ReactNode;
}

/**
 * One bar that is the whole control: the fill shows the value, the label sits
 * inside on the left and the number, which can be typed, on the right. A
 * native range input lies invisibly over the bar so the keyboard, screen
 * readers and pointer all behave natively. The number box may take a value
 * past the bar's range; the bar then simply reads full or empty.
 */
export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  typedMin = min,
  typedMax = max,
  defaultValue,
  trailing,
}: SliderProps) {
  const id = useId();
  const span = max - min;
  const clamped = Math.min(max, Math.max(min, value));
  const at = span > 0 ? (clamped - min) / span : 0;
  // Bipolar ranges fill outwards from zero rather than from the left edge.
  const origin = min < 0 && max > 0 ? -min / span : 0;
  const from = Math.min(at, origin);
  const to = Math.max(at, origin);

  return (
    <div className="flex items-center gap-0.5 py-0.5">
      <div className="group relative h-7 min-w-0 flex-1 overflow-hidden rounded-ms-control bg-ms-raised has-[input[type=range]:focus-visible]:outline has-[input[type=range]:focus-visible]:outline-1 has-[input[type=range]:focus-visible]:outline-offset-1 has-[input[type=range]:focus-visible]:outline-ms-ink">
        <div
          className="pointer-events-none absolute inset-0 origin-left bg-ms-fill transition-colors group-hover:bg-ms-fill-hover"
          style={{
            transform: `translateX(${from * 100}%) scaleX(${to - from})`,
          }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={clamped}
          aria-valuetext={`${value.toFixed(decimalsOf(step))}${unit ?? ""}`}
          onChange={(event) => onChange(Number(event.target.value))}
          onDoubleClick={() => {
            if (defaultValue !== undefined) onChange(defaultValue);
          }}
          title={
            defaultValue === undefined ? undefined : "Double-click to reset"
          }
          className="absolute inset-0 m-0 size-full cursor-ew-resize appearance-none bg-transparent opacity-0 [&::-moz-range-thumb]:size-0 [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:size-0 [&::-webkit-slider-thumb]:appearance-none"
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute inset-y-0 left-2 right-16 flex items-center text-ms-ink-muted group-hover:text-ms-ink"
        >
          <span className="truncate">{label}</span>
        </label>
        <NumberField
          variant="bare"
          value={value}
          onCommit={onChange}
          min={typedMin}
          max={typedMax}
          step={step}
          unit={unit}
          label={label}
          className="absolute inset-y-0 right-0"
        />
      </div>
      {trailing}
    </div>
  );
}
