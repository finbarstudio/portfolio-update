import type { DeviceDef } from "./devices";
import type { Values } from "./types";

/**
 * How the screen video's sound is shaped at one moment. Worked out from the scene values alone, so the live preview
 * and the exported file use exactly the same numbers.
 */
export interface SoundShape {
  /** 0..1 */
  level: number;
  /** Hz below which the speaker gives nothing. */
  floor: number;
  /** Hz above which the sound is cut off, lower the more it is muffled. */
  ceiling: number;
}

export const OPEN_SOUND: SoundShape = { level: 1, floor: 20, ceiling: 20000 };
export const SILENCE: SoundShape = { level: 0, floor: 20, ceiling: 20000 };

/** Hz below which each kind of device gives no sound: the smaller the speaker, the thinner it is. */
const SPEAKER_FLOOR: Record<DeviceDef["category"], number> = {
  "Phones and tablets": 320,
  "Computers and displays": 140,
  Wearables: 520,
  Retro: 260,
  Signage: 110,
};

/** A lid at or past this many percent open no longer muffles anything. */
const LID_CLEAR = 35;

const clamp = (x: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, x));
const radians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * The sound as it would leave the device. A shut lid sits over the speakers, so it dulls and quietens them; turning
 * the device away does the same to a lesser degree; and it gets louder as the camera comes close.
 */
export function speakerShape(def: DeviceDef, v: Values): SoundShape {
  const open = def.lid ? clamp(v["object.lid"] / LID_CLEAR, 0, 1) : 1;
  // How squarely the screen faces the camera: 1 head on, -1 with its back turned. The camera looks down -Z, and
  // tilt and X rotation are both pitches, so the screen's normal has this much of +Z left in it.
  const facing =
    Math.cos(radians(v["object.rotY"])) *
    Math.cos(radians(v["object.tilt"] + v["object.rotX"]));
  const t = clamp((-facing + 0.2) / 0.8, 0, 1);
  const away = t * t * (3 - 2 * t);
  const near = clamp(Math.sqrt(v["camera.zoom"] / 60), 0.45, 1.25);
  return {
    level: Math.min(1, (0.18 + 0.82 * open) * (1 - 0.45 * away) * near * 0.85),
    floor: SPEAKER_FLOOR[def.category],
    ceiling: Math.min(600 + 17400 * open * open, 18000 - 15000 * away),
  };
}
