/**
 * mac-config — tunables for the single Studio Display mockup engine (MacScene).
 *
 * The phone mockup cycles a carousel of up to 10 iPhones; the Mac is a single
 * Apple Studio Display (the same GLTF the portfolio case studies use). It reuses
 * the sandbox's shared types (AnimationPreset / FitMode / PhoneMediaItem) and the
 * whole export pipeline by implementing the same imperative controller contract —
 * so "same concept" as the phone tool, one screen instead of a row.
 *
 * Camera + pose values mirror `components/ModelDisplay.tsx` (the proven portfolio
 * tuning for this exact model): an isometric rest angle that eases to a flat,
 * front-on view. Here the blend is driven by the chosen preset (Angle vs Flat)
 * rather than pointer hover, and a gentle turntable adds life for the loop export.
 */

// Re-export the shared sandbox media/preset types so Mac modules import from one
// place (the engine, hook + export pipeline all speak the same vocabulary).
export type {
  AnimationPreset,
  FitMode,
  PhoneMediaItem as MacMediaItem,
  PhoneMediaKind as MacMediaKind,
} from "@/components/phone/phone-config";

export const MAC_MODEL = "/models/studio-display/display.gltf";

/** Aspect (w/h) of the Studio Display's screen, used to composite uploaded images
 *  so cover/contain/stretch line up. 27" 5K panel ≈ 5120×2880 = 16:9. */
export const MAC_SCREEN_ASPECT = 16 / 9;

export const MIN_MEDIA = 1;
export const MAX_MEDIA = 10;

/* ── Camera + pose (verbatim from ModelDisplay's studio-display tuning) ── */

export const CAMERA_FOV = 28;
export const CAMERA_DISTANCE_DEFAULT = 19;    // Angle: whole Mac + stand framed
export const CAMERA_DISTANCE_HOVER = 12.08;   // Flat: zoomed onto the screen face
export const CAMERA_Y_DEFAULT = 0;
export const CAMERA_Y_HOVER = 0.9;            // Flat lifts to the screen's centre
export const LOOKAT_Y_HOVER = 0.9;

export const ISO_ROTATION_Y = -0.45;          // ~ -26° rest yaw (Angle preset)
export const ISO_ROTATION_X = 0.12;           //   ~7°  rest downward tilt

export const LERP_ROTATION = 0.06;            // live pose easing (unused when paused)
export const LERP_CAMERA = 0.03;              // live camera easing (unused when paused)

/* ── Turntable loop ──────────────────────────────────────────────────────
   The Mac has no carousel, so the loop motion is a subtle side-to-side turn.
   The export pipeline sweeps `offset` over [0, numMedia); we map its fractional
   part to a cosine yaw so the display swings to its turned extreme exactly at the
   integer boundary (where the on-screen media swaps for multi-item showcases) and
   is front-on at the quarter points (where stills are captured — see
   `offsetForFocus`). Perfect-loop: yaw(0) === yaw(numMedia). */
export const TURNTABLE_AMP = 0.16;            // ~9° peak yaw
export const CYCLE_SPEED = 0.28;              // loop "items" per second (export timing)
export const STATE_LERP = 0.05;               // hover/preset blend easing (live)

/** Yaw offset (radians) added on top of the base pose for the turntable, given a
 *  continuous carousel `offset`. Front-on at the quarter points; turned at the
 *  integers so a multi-item screen swap is masked behind the motion. */
export function turntableYaw(offset: number): number {
  const frac = offset - Math.floor(offset);
  return Math.cos(2 * Math.PI * frac) * TURNTABLE_AMP;
}

/** Which media index sits on the screen for a given offset (wraps over count). */
export function mediaIndexFor(offset: number, count: number): number {
  if (count <= 1) return 0;
  const i = Math.floor(offset) % count;
  return i < 0 ? i + count : i;
}

/** The offset that centres media `i` front-on for a still. Quarter past the
 *  integer puts the cosine turntable at zero (flat to camera) while still landing
 *  inside item `i`'s [i, i+1) window. */
export function offsetForFocus(i: number): number {
  return i + 0.25;
}

/** Target pose blend (0 = Angle/iso, 1 = Flat/front-on) for the given preset. */
export function poseTargetFor(preset: "carousel" | "flat" | undefined, hovered: boolean): number {
  if (preset) return preset === "flat" ? 1 : 0;
  return hovered ? 1 : 0;
}
