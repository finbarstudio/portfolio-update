"use client";

/**
 * ControlPanel — the mockup's look controls: animation preset, aspect ratio,
 * screen fit, and background. Pure presentational segmented toggles + swatches;
 * all state lives in PhoneMockupTool.
 */

import type { AnimationPreset, FitMode } from "@/components/phone/phone-config";

export type AspectToken = "9:16" | "1:1" | "16:9";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="sb-field">
      <span className="mono-label sb-field-label">{label}</span>
      <div className="sb-segmented" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`sb-seg ${value === o.value ? "is-active" : ""}`}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const SWATCHES: { value: string; label: string }[] = [
  { value: "transparent", label: "Transparent" },
  { value: "#FAFAF8", label: "Bone" },
  { value: "#FFFFFF", label: "White" },
  { value: "#141414", label: "Ink" },
  { value: "#FF2D78", label: "Pink" },
  { value: "#5FC9C4", label: "Teal" },
];

export default function ControlPanel({
  preset,
  onPreset,
  aspect,
  onAspect,
  fit,
  onFit,
  background,
  onBackground,
  presetLabels = { carousel: "Carousel", flat: "Flat" },
}: {
  preset: AnimationPreset;
  onPreset: (v: AnimationPreset) => void;
  aspect: AspectToken;
  onAspect: (v: AspectToken) => void;
  fit: FitMode;
  onFit: (v: FitMode) => void;
  background: string;
  onBackground: (v: string) => void;
  /** Override the two preset button labels (the Mac tool uses Angle / Flat). */
  presetLabels?: { carousel: string; flat: string };
}) {
  const customActive = !SWATCHES.some((s) => s.value === background);

  return (
    <div className="sb-panel">
      <h3 className="sb-panel-title mono-heading">Style</h3>

      <Segmented<AnimationPreset>
        label="Animation"
        value={preset}
        onChange={onPreset}
        options={[
          { value: "carousel", label: presetLabels.carousel },
          { value: "flat", label: presetLabels.flat },
        ]}
      />

      <Segmented<AspectToken>
        label="Aspect"
        value={aspect}
        onChange={onAspect}
        options={[
          { value: "9:16", label: "9:16" },
          { value: "1:1", label: "1:1" },
          { value: "16:9", label: "16:9" },
        ]}
      />

      <Segmented<FitMode>
        label="Screen fit"
        value={fit}
        onChange={onFit}
        options={[
          { value: "cover", label: "Cover" },
          { value: "contain", label: "Contain" },
          { value: "stretch", label: "Stretch" },
        ]}
      />

      <div className="sb-field">
        <span className="mono-label sb-field-label">Background</span>
        <div className="sb-swatches">
          {SWATCHES.map((s) => (
            <button
              key={s.value}
              type="button"
              title={s.label}
              aria-label={s.label}
              aria-pressed={background === s.value}
              onClick={() => onBackground(s.value)}
              className={`sb-swatch ${background === s.value ? "is-active" : ""} ${s.value === "transparent" ? "is-transparent" : ""}`}
              style={s.value === "transparent" ? undefined : { background: s.value }}
            />
          ))}
          <label
            className={`sb-swatch sb-swatch-custom ${customActive ? "is-active" : ""}`}
            title="Custom color"
            style={customActive ? { background } : undefined}
          >
            <input
              type="color"
              value={customActive ? background : "#FF2D78"}
              onChange={(e) => onBackground(e.target.value)}
              aria-label="Custom background color"
            />
            <span aria-hidden="true">+</span>
          </label>
        </div>
      </div>
    </div>
  );
}
