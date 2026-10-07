"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A compact colour picker: the shade square for the chosen hue, then a hue
 * and a lightness slider, a hex box, and swatches that remember what you pick.
 */

/** Always offered. Colours you pick are remembered after these. */
const FIXED_SWATCHES = ["#000000", "#ffffff"];
const SAVED_KEY = "motion-presets:swatches";
const SAVED_MAX = 12;
const HEX = /^#[0-9a-f]{6}$/;

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

/** Picked colours from earlier visits. Anything that is not a plain hex is dropped. */
function readSaved(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]");
    if (!Array.isArray(stored)) return [];
    return stored.filter((item): item is string => typeof item === "string" && HEX.test(item) && !FIXED_SWATCHES.includes(item)).slice(0, SAVED_MAX);
  } catch {
    return []; // storage blocked or the entry is not JSON
  }
}

function writeSaved(swatches: string[]) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(swatches));
  } catch {
    // Storage blocked: the swatches still last until the page closes.
  }
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
  const [saved, setSaved] = useState<string[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const square = useRef<HTMLDivElement>(null);
  const latest = useRef(value);

  useEffect(() => {
    latest.current = value;
  });

  // A colour set from outside (a loaded setup, a reset) updates the sliders.
  useEffect(() => {
    setHsv((current) => (hsvToHex(current) === value ? current : hexToHsv(value)));
  }, [value]);

  // Only the browser knows these, so they are read after the first render.
  useEffect(() => {
    setCanPick("EyeDropper" in window);
    setSaved(readSaved());
  }, []);

  /** Closing the picker is the moment a colour counts as chosen: it joins the swatches. */
  const close = () => {
    setOpen(false);
    const chosen = latest.current;
    if (FIXED_SWATCHES.includes(chosen)) return;
    setSaved((current) => {
      const next = [chosen, ...current.filter((item) => item !== chosen)].slice(0, SAVED_MAX);
      writeSaved(next);
      return next;
    });
  };
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });

  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) closeRef.current();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
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
  const setHex = (hex: string) => {
    setHsv(hexToHsv(hex));
    onChange(hex);
  };

  const pickShade = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = square.current?.getBoundingClientRect();
    if (!box) return;
    commit({ ...hsv, s: clamp01((event.clientX - box.left) / box.width), v: clamp01(1 - (event.clientY - box.top) / box.height) });
  };

  const commitHex = () => {
    const hex = hexText === null ? null : normaliseHex(hexText);
    if (hex) setHex(hex);
    setHexText(null);
  };

  const pickFromScreen = async () => {
    try {
      const picked = await eyeDropper()?.open();
      if (picked && HEX.test(picked.sRGBHex.toLowerCase())) setHex(picked.sRGBHex.toLowerCase());
    } catch {
      // Closed without picking.
    }
  };

  const hue = `hsl(${hsv.h} 100% 50%)`;
  const full = hsvToHex({ ...hsv, v: 1 });
  const sliderColours = { "--hue": hue, "--full": full, "--now": value } as React.CSSProperties;

  return (
    <div className="mp-colour" ref={root}>
      <button type="button" className="mp-colour-trigger" aria-label={`${label}: ${value}`} aria-expanded={open} onClick={() => (open ? close() : setOpen(true))}>
        <span className="mp-colour-chip" style={{ background: value }} />
        <span>{value}</span>
      </button>
      {open && (
        <div className="mp-colour-pop" role="dialog" aria-label={`${label} colour`} style={sliderColours}>
          <div
            ref={square}
            className="mp-colour-square"
            style={{ backgroundColor: hue }}
            role="slider"
            tabIndex={0}
            aria-label="Shade"
            aria-valuetext={`saturation ${Math.round(hsv.s * 100)}%, lightness ${Math.round(hsv.v * 100)}%`}
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

          <div className="mp-colour-sliders">
            {canPick && (
              <button type="button" className="mp-colour-eye" aria-label="Pick a colour from the screen" onClick={pickFromScreen}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m10.5 6.5 7 7M2 22s4.5-.5 7-3L21 7a2.828 2.828 0 1 0-4-4L5 15c-2.5 2.5-3 7-3 7Z" />
                </svg>
              </button>
            )}
            <div>
              <input className="mp-colour-range mp-colour-hue" type="range" min={0} max={360} step={1} value={Math.round(hsv.h)} aria-label="Hue" onChange={(event) => commit({ ...hsv, h: Number(event.target.value) })} />
              <input
                className="mp-colour-range mp-colour-light"
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(hsv.v * 100)}
                aria-label="Lightness"
                onChange={(event) => commit({ ...hsv, v: Number(event.target.value) / 100 })}
              />
            </div>
          </div>

          <label className="mp-colour-field">
            <span className="mp-colour-chip" style={{ background: value }} />
            <input
              className="mp-colour-hex"
              type="text"
              spellCheck={false}
              autoComplete="off"
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
            {[...FIXED_SWATCHES, ...saved].map((swatch) => (
              <button key={swatch} type="button" aria-label={swatch} aria-pressed={swatch === value} style={{ background: swatch }} onClick={() => setHex(swatch)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
