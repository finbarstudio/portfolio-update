/**
 * phone-config — single source of truth for the phone carousel engine.
 *
 * The geometry, tunables and slot tables here were extracted verbatim from the
 * original `components/PhoneCarousel.tsx` (the TMYR 7-phone hero). The engine in
 * `PhoneScene.tsx` is the generalised version: it drives any media count 1..10
 * by treating the two 7-entry slot tables as a CANONICAL ARC and resampling it
 * by normalised position. The resampler is built so that **count === 7 lands on
 * the original table points exactly**, which keeps the TMYR thumbnail identical
 * (hard rule #1). See `slotAt()` and `arcPosFor()` below for the math.
 */

import * as THREE from "three";

/* ── Public types (the sandbox + adapter consume these) ───────── */

export type PhoneMediaKind = "video" | "image";
export type PhoneMediaItem = { kind: PhoneMediaKind; src: string };

/** carousel = the original REST pose (tilted 3-up cycle). flat = the original
 *  HOVER pose (single horizontal line). TMYR drives the blend by pointer hover;
 *  the sandbox forces one preset via `presetOverride`. */
export type AnimationPreset = "carousel" | "flat";

/** How each media item fills the phone screen. Only affects images in MVP; the
 *  video path keeps the original base UV transform (see usePhoneTextures). */
export type FitMode = "cover" | "contain" | "stretch";

/* ── Tunables (verbatim from the original PhoneCarousel) ───────── */

export const TABLE_LEN = 7;             // canonical arc stations (slot table length)
export const CENTER_SLOT = 3;           // the visible "centre" station index
export const CYCLE_SPEED = 0.32;        // logical slot-steps per second (raw; eased via DWELL)
export const DWELL_PORTION = 0.35;      // fraction of each step spent paused at the integer slot
export const STATE_LERP = 0.04;         // hover state transition easing
export const CAMERA_DISTANCE = 0.42;    // camera Z — pull-back
export const CAMERA_FOV = 32;
export const FLANK_ROT = Math.PI / 12;  // ±15° subtle Z-tilt on flanking phones
export const ONSTAGE_THRESHOLD = 0.5;   // phones above this scale actually play (limits active decoders)
export const MODEL_BASE_SCALE = 1.27;   // base model scale before slot scaling

/** Aspect (w/h) of the phone's screen mesh, used to composite uploaded images so
 *  cover/contain/stretch line up. iPhone 15 Pro Max display ≈ 1290×2796. */
export const PHONE_SCREEN_ASPECT = 1290 / 2796;

export const MIN_PHONES = 1;
export const MAX_PHONES = 10;

export type Slot = {
  x: number; y: number; z: number;
  rotZ: number; scale: number; opacity: number;
};

// Each slot = where a phone is when its arc position lands exactly on that index.
// Phones interpolate continuously between adjacent slots, wrapping mod 7.
// Slot 3 = visible centre. Slots 2/4 = flanks. 1/5 = transitional fade. 0/6 = hidden.
export const REST_SLOTS: Slot[] = [
  { x:  0.40, y: -0.14, z: -0.15, rotZ: -FLANK_ROT, scale: 0.0,  opacity: 0.0 }, // 0: far off-right (invisible)
  { x:  0.27, y: -0.08, z: -0.07, rotZ: -FLANK_ROT, scale: 0.30, opacity: 0.0 }, // 1: entering right (no decoder)
  { x:  0.165, y: 0.00, z: -0.02, rotZ: -FLANK_ROT, scale: 0.66, opacity: 0.65 },// 2: RIGHT (live video)
  { x:  0.00, y:  0.00, z:  0.00, rotZ:  0,         scale: 1.0,  opacity: 1.0  },// 3: CENTER (live video)
  { x: -0.165, y: 0.00, z: -0.02, rotZ:  FLANK_ROT, scale: 0.66, opacity: 0.65 },// 4: LEFT (live video)
  { x: -0.27, y: -0.08, z: -0.07, rotZ:  FLANK_ROT, scale: 0.30, opacity: 0.0 }, // 5: exiting left (no decoder)
  { x: -0.40, y: -0.14, z: -0.15, rotZ:  FLANK_ROT, scale: 0.0,  opacity: 0.0 }, // 6: far off-left
];

export const HOVER_SLOTS: Slot[] = [
  { x:  0.56, y: 0, z: 0, rotZ: 0, scale: 0.0, opacity: 0.0 },
  { x:  0.40, y: 0, z: 0, rotZ: 0, scale: 0.6, opacity: 0.35 },
  { x:  0.22, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 0.70 },
  { x:  0.00, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 1.0 },
  { x: -0.22, y: 0, z: 0, rotZ: 0, scale: 1.0, opacity: 0.70 },
  { x: -0.40, y: 0, z: 0, rotZ: 0, scale: 0.6, opacity: 0.35 },
  { x: -0.56, y: 0, z: 0, rotZ: 0, scale: 0.0, opacity: 0.0 },
];

/* ── Carousel math ────────────────────────────────────────────── */

export function clampCount(n: number): number {
  if (!Number.isFinite(n)) return MIN_PHONES;
  return Math.max(MIN_PHONES, Math.min(MAX_PHONES, Math.floor(n)));
}

/** The carousel ring is always filled by repeating the media in whole cycles, so
 *  a single upload populates every screen and N uploads tile 1..N-1..N… with no
 *  gaps. Returns how many phones to render for `mediaCount` unique items: the
 *  multiple of mediaCount closest to RING_TARGET, capped at RING_MAX. Whole
 *  cycles keep the 1-2-3-1-2-3 pattern seamless across the loop. */
export const RING_TARGET = 9;
export const RING_MAX = 12;
export function fillCount(mediaCount: number): number {
  const m = Math.max(1, mediaCount);
  let reps = Math.max(1, Math.round(RING_TARGET / m));
  if (m * reps > RING_MAX) reps = Math.max(1, Math.floor(RING_MAX / m));
  return m * reps;
}

/**
 * Ease the raw offset so each phone dwells briefly at every integer slot (incl.
 * the centre) before sliding to the next. Linear time -> stair-stepped progress.
 * (Verbatim from the original.)
 */
export function easedOffset(raw: number): number {
  const intPart = Math.floor(raw);
  const frac = raw - intPart;
  if (frac < DWELL_PORTION) return intPart;            // pause at the integer slot
  const t = (frac - DWELL_PORTION) / (1 - DWELL_PORTION);
  const eased = t * t * (3 - 2 * t);                   // smoothstep transit to next slot
  return intPart + eased;
}

/**
 * Sample a 7-entry slot table at a continuous arc position `t` in [0, TABLE_LEN),
 * wrapping cyclically. Linear interp between adjacent stations — exactly the
 * blend the original did with `slotA = floor(slotFloat)`, `slotB = slotA + 1`.
 */
export function slotAt(table: Slot[], t: number): Slot {
  const len = table.length; // 7
  let tt = t % len;
  if (tt < 0) tt += len;
  const a = Math.floor(tt) % len;
  const b = (a + 1) % len;
  const frac = tt - Math.floor(tt);
  const A = table[a];
  const B = table[b];
  const lerp = THREE.MathUtils.lerp;
  return {
    x: lerp(A.x, B.x, frac),
    y: lerp(A.y, B.y, frac),
    z: lerp(A.z, B.z, frac),
    rotZ: lerp(A.rotZ, B.rotZ, frac),
    scale: lerp(A.scale, B.scale, frac),
    opacity: lerp(A.opacity, B.opacity, frac),
  };
}

/**
 * Continuous arc position (in [0, TABLE_LEN)) for phone `i` of `count`, given the
 * eased carousel `offset` (in logical slot-steps). Phones are spaced
 * TABLE_LEN/count arc-units apart and advance TABLE_LEN/count arc-units per step.
 *
 * For count === 7 this reduces to `(CENTER_SLOT - i + offset) mod 7` — the exact
 * formula the original used — so the TMYR carousel is unchanged.
 */
export function arcPosFor(i: number, count: number, offset: number): number {
  const step = TABLE_LEN / count; // 1 when count === 7
  let p = (CENTER_SLOT - (i - offset) * step) % TABLE_LEN;
  if (p < 0) p += TABLE_LEN;
  return p;
}

/** The raw carousel offset that centres media `i` (and rests there in the dwell
 *  zone). Inverting arcPosFor: arcPos_i === CENTER_SLOT  ⟺  offset ≡ i (mod count). */
export function offsetForFocus(i: number): number {
  return i;
}

/** Target hover blend for a given preset/hover state. presetOverride forces the
 *  pose (sandbox); otherwise pointer hover drives it (TMYR). */
export function hoverTargetFor(
  hovered: boolean,
  presetOverride?: AnimationPreset,
): number {
  if (presetOverride) return presetOverride === "flat" ? 1 : 0;
  return hovered ? 1 : 0;
}
