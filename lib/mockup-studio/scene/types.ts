/**
 * Scene contract. Everything in the studio (viewport, inspector, timeline,
 * export) reads and writes through these types and the store in ./store.
 *
 * World conventions the viewport must honour:
 * - The device model is normalised so its largest dimension is 1 world unit,
 *   centred on the origin, screen facing +Z.
 * - Animatable numbers live in a flat `Values` record keyed by `AnimPath`.
 *   Their ranges and meaning are documented in ./params.
 */

import type { Hdri } from "./hdris";
import type { AnimPath } from "./params";

export type Values = Record<AnimPath, number>;

export type Ease =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  /** Very fast start, long soft landing. The classic product-film move. */
  | "easeOutExpo"
  /** Slow at both ends, quick through the middle. */
  | "easeInOutQuint"
  /** Lands a little past the target and comes back. */
  | "easeOutBack"
  /** Overshoots and wobbles into place. */
  | "spring"
  | "hold";

export interface Keyframe {
  id: string;
  /** Milliseconds from the start of the owning shot. */
  t: number;
  value: number;
  /** Easing used from this keyframe to the next one. */
  ease: Ease;
}

export type Tracks = Partial<Record<AnimPath, Keyframe[]>>;

export interface Shot {
  id: string;
  name: string;
  /** Milliseconds. */
  duration: number;
  /** Keyframes sorted by `t`. Paths without a track use the rest values. */
  tracks: Tracks;
}

export interface Light {
  id: string;
  name: string;
  /** Degrees around the device, 0 = in front (camera side), 90 = right. */
  azimuth: number;
  /** Degrees above the horizon, -90..90. */
  elevation: number;
  /** 0..10 */
  intensity: number;
  /** Hex colour, e.g. "#ffffff". */
  color: string;
  /** Optional point on the device the light aims at, in device-local units. */
  target: [number, number, number];
}

export type AspectPreset =
  | "1:1"
  | "16:9"
  | "2:1"
  | "4:3"
  | "3:4"
  | "9:16"
  | "custom";

export interface Composition {
  preset: AspectPreset;
  /** Output pixel size. Presets keep the long edge at 1920. */
  width: number;
  height: number;
}

export type MediaFit = "cover" | "contain" | "stretch";

export interface Media {
  /** Object URL or remote URL. Object URLs do not survive a reload. */
  url: string;
  kind: "image" | "video";
  name: string;
  fit: MediaFit;
  /** Length in milliseconds. Videos only, filled in once the file's metadata has loaded. */
  duration?: number;
  /** Extra zoom on top of the fit, 1 = none. */
  scale: number;
  /** Pan in screen UV units, -1..1. */
  offsetX: number;
  offsetY: number;
}

export interface BackgroundLayer {
  id: string;
  url: string;
  name: string;
  /** 0..100 */
  opacity: number;
  fit: "cover" | "contain";
}

/** What the device stands on. "none" leaves it floating in the studio. */
export type FloorKind = "none" | "concrete" | "asphalt" | "wood";

export interface Background {
  /** Hex colour. */
  color: string;
  /** A ground plane under the device, with a painted surface, catching its shadow. */
  floor: FloorKind;
  /** When true the canvas clears to alpha 0 and exports keep transparency. */
  transparent: boolean;
  /** Image layers drawn over the colour, first = bottom. */
  layers: BackgroundLayer[];
  /** Id of a built-in environment photo shown behind the device, or null. */
  hdri: string | null;
  /** An environment the user uploaded. Takes priority over `hdri`. Lives for the session only. */
  hdriFile: Hdri | null;
  /** 0..100, how far out of focus the environment is. */
  hdriBlur: number;
  /** 0..200, percent. */
  hdriBrightness: number;
  /** Degrees. Turns the environment to choose which part is behind the device. */
  hdriRotation: number;
  /** Also light the device with the environment, replacing the studio reflections. */
  hdriLighting: boolean;
}

/** Centre points for effects that have one, in frame UV (0..1, origin top-left). */
export interface EffectCenters {
  blur: [number, number];
  aberration: [number, number];
}

export type Tool = "select" | "hand";

/** What the next viewport click places. */
export type PickMode =
  | { kind: "effectCenter"; effect: keyof EffectCenters }
  | { kind: "lightTarget"; lightId: string };

/** The part of the store that is saved to disk. */
export interface SceneDocument {
  version: 1;
  deviceId: string;
  /** Hex colour the device body is tinted with, or null for the model's own colours. */
  bodyColor: string | null;
  composition: Composition;
  values: Values;
  lights: Light[];
  effectCenters: EffectCenters;
  background: Background;
  media: Media | null;
  shots: Shot[];
  /** The end of the timeline returns to the first frame, so it loops without a jump. */
  seamlessLoop?: boolean;
}
