"use client";

import { useEffect, useRef, useState } from "react";

/** The usual layout: a shade square, a hue strip, a hex box and a few swatches. */

const SWATCHES = ["#0e0e10", "#000000", "#1c1c1f", "#2b2b30", "#f2f2f3", "#ffffff", "#ece6df", "#0b1f3a", "#1b3b2a", "#ff0066"];

interface Hsv {
  h: number;
  s: number;
  v: number;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function hexToHsv(hex: string): Hsv {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d > 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function hsvToHex({ h, s, v }: Hsv): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    const part = v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    return Math.round(part * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(5)}${f(3)}${f(1)}`;
}

/** Accepts "#abc", "abc", "#aabbcc" or "aabbcc"; returns six-digit lower case or null. */
function normaliseHex(text: string): string | null {
  const raw = text.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{6}$/.test(raw)) return `#${raw}`;
  if (/^[0-9a-f]{3}$/.test(raw)) return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`;
  return null;
}

/** Chrome and Edge offer a screen eyedropper; other browsers do not. */
interface EyeDropperApi {
  open(): Promise<{ sRGBHex: string }>;
}
const eyeDropper = (): EyeDropperApi | null => {
  const Ctor = (window as unknown as { EyeDropper?: new () => EyeDropperApi }).EyeDropper;
  return Ctor ? new Ctor() : null;
};

export default function ColourPicker({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  const [open, setOpen] = useState(false);
  // Hue and saturation live here so they survive a trip through black or white.
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(value));
  const [hexText, setHexText] = useState<string | null>(null);
  const [canPick, setCanPick] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const square = useRef<HTMLDivElement>(null);

  // A colour set from outside (a loaded setup, a reset) updates the wheel.
  useEffect(() => {
    setHsv((current) => (hsvToHex(current) === value ? current : hexToHsv(value)));
  }, [value]);

  useEffect(() => {
    setCanPick("EyeDropper" in window);
  }, []);

  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  const commit = (next: Hsv) => {
    setHsv(next);
    onChange(hsvToHex(next));
  };

  const pickShade = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = square.current?.getBoundingClientRect();
    if (!box) return;
    commit({ ...hsv, s: clamp01((event.clientX - box.left) / box.width), v: clamp01(1 - (event.clientY - box.top) / box.height) });
  };

  const commitHex = () => {
    if (hexText !== null) {
      const hex = normaliseHex(hexText);
      if (hex) {
        setHsv(hexToHsv(hex));
        onChange(hex);
      }
    }
    setHexText(null);
  };

  const hue = `hsl(${hsv.h} 100% 50%)`;

  const pickFromScreen = async () => {
    try {
      const picked = await eyeDropper()?.open();
      if (picked) {
        const hex = picked.sRGBHex.toLowerCase();
        setHsv(hexToHsv(hex));
        onChange(hex);
      }
    } catch {
      // Closed without picking.
    }
  };

  return (
    <div className="mp-colour" ref={root}>
      <button type="button" className="mp-colour-trigger" aria-label={`${label}: ${value}`} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="mp-colour-chip" style={{ background: value }} />
        <span>{value}</span>
      </button>
      {open && (
        <div className="mp-colour-pop" role="dialog" aria-label={`${label} colour`}>
          <div
            ref={square}
            className="mp-colour-square"
            style={{ backgroundColor: hue }}
            role="slider"
            tabIndex={0}
            aria-label="Shade"
            aria-valuetext={`saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
            aria-valuenow={Math.round(hsv.v * 100)}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              pickShade(event);
            }}
            onPointerMove={(event) => {
              if (event.buttons) pickShade(event);
            }}
            onKeyDown={(event) => {
              const step = { ArrowLeft: [-0.02, 0], ArrowRight: [0.02, 0], ArrowUp: [0, 0.02], ArrowDown: [0, -0.02] }[event.key];
              if (!step) return;
              event.preventDefault();
              commit({ ...hsv, s: clamp01(hsv.s + step[0]), v: clamp01(hsv.v + step[1]) });
            }}
          >
            <span className="mp-colour-dot" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: value }} />
          </div>
          <div className="mp-colour-hue-row">
            {canPick && (
              <button type="button" className="mp-colour-eye" aria-label="Pick a colour from the screen" onClick={pickFromScreen}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m10.5 6.5 7 7M2 22s4.5-.5 7-3L21 7a2.828 2.828 0 1 0-4-4L5 15c-2.5 2.5-3 7-3 7Z" />
                </svg>
              </button>
            )}
            <input
              className="mp-colour-hue"
              type="range"
              min={0}
              max={360}
              step={1}
              value={Math.round(hsv.h)}
              aria-label="Hue"
              style={{ "--hue": hue } as React.CSSProperties}
              onChange={(event) => commit({ ...hsv, h: Number(event.target.value) })}
            />
          </div>
          <div className="mp-colour-row">
            <label className="mp-colour-field">
              <span className="mp-colour-chip" style={{ background: value }} />
              <input
                className="mp-colour-hex"
              type="text"
              inputMode="text"
              spellCheck={false}
              aria-label="Hex"
              value={hexText ?? value}
              onFocus={(event) => {
                setHexText(value);
                event.target.select();
              }}
              onChange={(event) => setHexText(event.target.value)}
              onBlur={commitHex}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
              }}
              />
            </label>
            <div className="mp-colour-swatches">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  aria-label={swatch}
                  aria-pressed={swatch === value}
                  style={{ background: swatch }}
                  onClick={() => {
                    setHsv(hexToHsv(swatch));
                    onChange(swatch);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
