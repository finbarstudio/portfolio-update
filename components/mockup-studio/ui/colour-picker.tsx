"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "./cn";

/**
 * A compact colour control: a chip and hex in the row, opening to the shade
 * square for the chosen hue, a hue and a lightness slider, a hex box, and
 * swatches that remember what you pick between visits.
 */

/** Always offered. Colours you pick are remembered after these. */
const FIXED_SWATCHES = ["#000000", "#ffffff"];
const SAVED_KEY = "mockup-studio:swatches";
const SAVED_MAX = 12;
const HEX = /^#[0-9a-f]{6}$/;

interface Hsv {
  h: number;
  s: number;
  v: number;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function hexToHsv(hex: string): Hsv {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
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
  const part = (n: number) => {
    const k = (n + h / 60) % 6;
    const value = v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${part(5)}${part(3)}${part(1)}`;
}

/** Accepts "#abc", "abc", "#aabbcc" or "aabbcc"; returns six-digit lower case or null. */
function normaliseHex(text: string): string | null {
  const raw = text.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{6}$/.test(raw)) return `#${raw}`;
  if (/^[0-9a-f]{3}$/.test(raw))
    return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`;
  return null;
}

/** Picked colours from earlier visits. Anything that is not a plain hex is dropped. */
function readSaved(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]");
    if (!Array.isArray(stored)) return [];
    return stored
      .filter(
        (item): item is string =>
          typeof item === "string" &&
          HEX.test(item) &&
          !FIXED_SWATCHES.includes(item),
      )
      .slice(0, SAVED_MAX);
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

function eyeDropper(): EyeDropperApi | null {
  const Ctor = (window as unknown as { EyeDropper?: new () => EyeDropperApi })
    .EyeDropper;
  return Ctor ? new Ctor() : null;
}

const SHADE_STEPS: Record<string, [number, number]> = {
  ArrowLeft: [-0.02, 0],
  ArrowRight: [0.02, 0],
  ArrowUp: [0, 0.02],
  ArrowDown: [0, -0.02],
};

/** A bare gradient track with a small ring for a thumb. The gradient itself is set inline. */
const RANGE =
  "m-0 block h-2.5 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:size-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgb(0_0_0/0.4)]";

export interface ColourPickerProps {
  label: string;
  /** Six-digit hex. */
  value: string;
  onChange(hex: string): void;
}

export function ColourPicker({ label, value, onChange }: ColourPickerProps) {
  const current = value.toLowerCase();
  const [open, setOpen] = useState(false);
  // Hue and saturation live here so they survive a trip through black or white.
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(current));
  const [hexText, setHexText] = useState<string | null>(null);
  const [canPick, setCanPick] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const square = useRef<HTMLDivElement>(null);
  const latest = useRef(current);

  useEffect(() => {
    latest.current = current;
  });

  // A colour set from outside (a loaded scene, a reset) moves the sliders.
  useEffect(() => {
    setHsv((now) => (hsvToHex(now) === current ? now : hexToHsv(current)));
  }, [current]);

  // Only the browser knows these, so they are read after the first render.
  useEffect(() => {
    setCanPick("EyeDropper" in window);
    setSaved(readSaved());
  }, []);

  /** Closing is the moment a colour counts as chosen: it joins the swatches. */
  function close() {
    setOpen(false);
    const chosen = latest.current;
    if (FIXED_SWATCHES.includes(chosen)) return;
    const next = [chosen, ...readSaved().filter((item) => item !== chosen)];
    next.length = Math.min(next.length, SAVED_MAX);
    writeSaved(next);
    setSaved(next);
  }
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });

  useEffect(() => {
    if (!open) return;
    // Another picker may have saved a colour since this one last looked.
    setSaved(readSaved());
    function away(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        closeRef.current();
    }
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") closeRef.current();
    }
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  function commit(next: Hsv) {
    setHsv(next);
    onChange(hsvToHex(next));
  }
  function setHex(hex: string) {
    setHsv(hexToHsv(hex));
    onChange(hex);
  }

  function pickShade(event: ReactPointerEvent<HTMLDivElement>) {
    const box = square.current?.getBoundingClientRect();
    if (!box) return;
    commit({
      ...hsv,
      s: clamp01((event.clientX - box.left) / box.width),
      v: clamp01(1 - (event.clientY - box.top) / box.height),
    });
  }

  function commitHex() {
    const hex = hexText === null ? null : normaliseHex(hexText);
    if (hex) setHex(hex);
    setHexText(null);
  }

  async function pickFromScreen() {
    try {
      const picked = await eyeDropper()?.open();
      const hex = picked?.sRGBHex.toLowerCase();
      if (hex && HEX.test(hex)) setHex(hex);
    } catch {
      // Closed without picking.
    }
  }

  const hue = `hsl(${hsv.h} 100% 50%)`;
  const full = hsvToHex({ ...hsv, v: 1 });

  return (
    <div ref={root} className="flex flex-col gap-2">
      <div className="flex h-7 items-center justify-between gap-2">
        <span className="text-ms-ink-muted">{label}</span>
        <button
          type="button"
          aria-label={`${label}: ${current}`}
          aria-expanded={open}
          onClick={() => (open ? close() : setOpen(true))}
          className="inline-flex h-7 items-center gap-1.5 rounded-ms-control bg-ms-raised pl-1.5 pr-2 tabular-nums text-ms-ink-muted hover:bg-ms-hover hover:text-ms-ink aria-expanded:bg-ms-hover aria-expanded:text-ms-ink"
        >
          <span
            aria-hidden="true"
            className="size-4 rounded-full border border-white/15"
            style={{ background: current }}
          />
          {current}
        </button>
      </div>

      {open ? (
        <fieldset className="flex min-w-0 flex-col gap-2 rounded-ms-control border border-ms-line bg-ms-raised p-2">
          <legend className="sr-only">{`${label} colour`}</legend>
          <div
            ref={square}
            role="slider"
            tabIndex={0}
            aria-label="Shade"
            aria-valuenow={Math.round(hsv.v * 100)}
            aria-valuetext={`saturation ${Math.round(hsv.s * 100)}%, lightness ${Math.round(hsv.v * 100)}%`}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              pickShade(event);
            }}
            onPointerMove={(event) => {
              if (event.buttons) pickShade(event);
            }}
            onKeyDown={(event) => {
              const step = SHADE_STEPS[event.key];
              if (!step) return;
              event.preventDefault();
              commit({
                ...hsv,
                s: clamp01(hsv.s + step[0]),
                v: clamp01(hsv.v + step[1]),
              });
            }}
            className="relative aspect-[3/2] w-full cursor-crosshair touch-none rounded-[6px]"
            style={{
              backgroundColor: hue,
              backgroundImage:
                "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.4)]"
              style={{
                left: `${hsv.s * 100}%`,
                top: `${(1 - hsv.v) * 100}%`,
                background: current,
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            {canPick ? (
              <button
                type="button"
                aria-label="Pick a colour from the screen"
                title="Pick a colour from the screen"
                onClick={pickFromScreen}
                className="grid size-7 shrink-0 place-items-center rounded-ms-control text-ms-ink-muted hover:bg-ms-hover hover:text-ms-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m10.5 6.5 7 7M2 22s4.5-.5 7-3L21 7a2.828 2.828 0 1 0-4-4L5 15c-2.5 2.5-3 7-3 7Z" />
                </svg>
              </button>
            ) : null}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={Math.round(hsv.h)}
                aria-label="Hue"
                onChange={(event) =>
                  commit({ ...hsv, h: Number(event.target.value) })
                }
                className={RANGE}
                style={{
                  background:
                    "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
                }}
              />
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(hsv.v * 100)}
                aria-label="Lightness"
                onChange={(event) =>
                  commit({ ...hsv, v: Number(event.target.value) / 100 })
                }
                className={RANGE}
                style={{
                  background: `linear-gradient(to right, #000, ${full})`,
                }}
              />
            </div>
          </div>

          <input
            type="text"
            spellCheck={false}
            autoComplete="off"
            aria-label="Hex"
            value={hexText ?? current}
            onFocus={(event) => {
              setHexText(current);
              event.target.select();
            }}
            onChange={(event) => setHexText(event.target.value)}
            onBlur={commitHex}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
            className="h-7 w-full rounded-ms-control bg-ms-panel px-2 tabular-nums outline-none focus:outline focus:outline-1 focus:outline-ms-ink"
          />

          <div className="flex flex-wrap gap-1.5">
            {[...FIXED_SWATCHES, ...saved].map((swatch) => (
              <button
                key={swatch}
                type="button"
                aria-label={swatch}
                title={swatch}
                aria-pressed={swatch === current}
                onClick={() => setHex(swatch)}
                className={cn(
                  "size-5 rounded-full border border-white/15",
                  "aria-pressed:outline aria-pressed:outline-1 aria-pressed:outline-offset-1 aria-pressed:outline-ms-ink",
                )}
                style={{ background: swatch }}
              />
            ))}
          </div>
        </fieldset>
      ) : null}
    </div>
  );
}
