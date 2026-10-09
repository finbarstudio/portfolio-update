"use client";

export interface SwitchProps {
  label: string;
  checked: boolean;
  onChange(checked: boolean): void;
}

/** A labelled on/off switch built on a native checkbox. */
export function Switch({ label, checked, onChange }: SwitchProps) {
  return (
    <label className="flex h-7 cursor-pointer items-center justify-between gap-2 text-ms-ink-muted">
      <span>{label}</span>
      <input
        type="checkbox"
        role="switch"
        aria-checked={checked}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative h-4 w-7 shrink-0 rounded-full bg-ms-raised transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-3 after:rounded-full after:bg-ms-ink-muted after:transition-transform peer-checked:bg-ms-ink peer-checked:after:translate-x-3 peer-checked:after:bg-ms-canvas peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ms-ink"
      />
    </label>
  );
}
