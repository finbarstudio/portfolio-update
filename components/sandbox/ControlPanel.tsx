"use client";

/**
 * ControlPanel — the mockup's look controls: animation preset, aspect ratio,
 * screen fit, and background. Pure presentational segmented toggles + swatches;
 * all state lives in PhoneMockupTool.
 */

import type { AnimationPreset, FitMode } from "@/components/phone/phone-config";
import { MAX_SPEED } from "@/components/phone/phone-config";

export type AspectToken = "9:16" | "1:1" | "16:9";

export type MotionControls = {
  /** Carousel speed multiplier (phone only). Omit `onSpeed` to hide the slider. */
  speed?: number;
  onSpeed?: (v: number) => void;
  angle: number;
  onAngle: (v: number) => void;
  /** Format the Angle value (the Mac uses a bidirectional Left/Flat/Right readout). */
  angleDisplay?: (v: number) => string;
  /** Size slider value (phone: main-phone prominence; mac: whole-display scale). */
  size: number;
  onSize: (v: number) => void;
  /** Size slider label + range. Default to the phone's "Main phone size" (0..1 %). */
  sizeLabel?: string;
  sizeMin?: number;
  sizeMax?: number;
  sizeStep?: number;
  sizeDisplay?: (v: number) => string;
};

const pct = (v: number) => `${Math.round(v * 100)}%`;

function Range({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="sb-field">
      <span className="mono-label sb-field-label">
        {label}
        <span className="sb-range-val">{display}</span>
      </span>
      <input
        type="range"
        className="sb-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}

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
  preset = "carousel",
  onPreset,
  aspect,
  onAspect,
  fit,
  onFit,
  background,
  onBackground,
  presetLabels = { carousel: "Carousel", flat: "Flat" },
  motion,
  showAspect = true,
}: {
  preset?: AnimationPreset;
  onPreset?: (v: AnimationPreset) => void;
  aspect: AspectToken;
  onAspect: (v: AspectToken) => void;
  fit: FitMode;
  onFit: (v: FitMode) => void;
  background: string;
  onBackground: (v: string) => void;
  /** Override the two preset button labels (the Mac tool uses Angle / Flat). */
  presetLabels?: { carousel: string; flat: string };
  /** When set, replace the Animation toggle with Speed + Angle sliders (phone). */
  motion?: MotionControls;
  /** Hide the aspect selector (the Mac tool is locked to 16:9). */
  showAspect?: boolean;
}) {
  const customActive = !SWATCHES.some((s) => s.value === background);

  return (
    <div className="sb-panel">
      <h3 className="sb-panel-title mono-heading">Style</h3>

      {motion ? (
        <>
          {motion.onSpeed && motion.speed != null && (
            <Range
              label="Speed"
              value={motion.speed}
              min={0}
              max={MAX_SPEED}
              step={0.05}
              display={motion.speed === 0 ? "Still" : `${motion.speed.toFixed(2)}×`}
              onChange={motion.onSpeed}
            />
          )}
          <Range
            label="Angle"
            value={motion.angle}
            min={0}
            max={1}
            step={0.01}
            display={(motion.angleDisplay ?? pct)(motion.angle)}
            onChange={motion.onAngle}
          />
          <Range
            label={motion.sizeLabel ?? "Main phone size"}
            value={motion.size}
            min={motion.sizeMin ?? 0}
            max={motion.sizeMax ?? 1}
            step={motion.sizeStep ?? 0.01}
            display={(motion.sizeDisplay ?? pct)(motion.size)}
            onChange={motion.onSize}
          />
        </>
      ) : (
        <Segmented<AnimationPreset>
          label="Animation"
          value={preset}
          onChange={onPreset ?? (() => {})}
          options={[
            { value: "carousel", label: presetLabels.carousel },
            { value: "flat", label: presetLabels.flat },
          ]}
        />
      )}

      {showAspect && (
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
      )}

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
