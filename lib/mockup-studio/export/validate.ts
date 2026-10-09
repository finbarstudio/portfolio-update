/**
 * Validation for scene files. A .json picked from disk is untrusted input, so
 * everything is narrowed field by field and rebuilt; nothing from the file is
 * passed through unchecked.
 */

import { EASE_OPTIONS } from "@/lib/mockup-studio/scene/animation";
import { DEFAULT_DEVICE_ID, DEVICES } from "@/lib/mockup-studio/scene/devices";
import { getHdri } from "@/lib/mockup-studio/scene/hdris";
import { clampTyped } from "@/lib/mockup-studio/scene/limits";
import { ANIM_PATHS, type AnimPath, PARAMS } from "@/lib/mockup-studio/scene/params";
import type {
  AspectPreset,
  Background,
  BackgroundLayer,
  Composition,
  Ease,
  EffectCenters,
  Keyframe,
  Light,
  Media,
  MediaFit,
  SceneDocument,
  Shot,
  Tracks,
  Values,
} from "@/lib/mockup-studio/scene/types";

const MIN_SIZE = 16;
const MAX_SIZE = 7680;
const MIN_SHOT_MS = 200;
const MAX_SHOT_MS = 10 * 60 * 1000;
const ASPECT_PRESETS: readonly AspectPreset[] = [
  "1:1",
  "16:9",
  "2:1",
  "4:3",
  "3:4",
  "9:16",
  "custom",
];
const MEDIA_FITS: readonly MediaFit[] = ["cover", "contain", "stretch"];
const LAYER_FITS: readonly BackgroundLayer["fit"][] = ["cover", "contain"];
const MEDIA_KINDS: readonly Media["kind"][] = ["image", "video"];
const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isOneOf<T extends string>(
  options: readonly T[],
  value: unknown,
): value is T {
  return (
    typeof value === "string" && options.some((option) => option === value)
  );
}

function isEase(value: unknown): value is Ease {
  return isOneOf(EASE_OPTIONS, value);
}

function isAnimPath(value: string): value is AnimPath {
  return ANIM_PATHS.some((path) => path === value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function fail(where: string, problem: string): never {
  throw new Error(`Not a valid scene file: ${where} ${problem}.`);
}

function readRecord(value: unknown, where: string): Record<string, unknown> {
  if (!isRecord(value)) fail(where, "must be an object");
  return value;
}

function readArray(value: unknown, where: string): unknown[] {
  if (!Array.isArray(value)) fail(where, "must be a list");
  return value;
}

function readString(value: unknown, where: string): string {
  if (typeof value !== "string") fail(where, "must be text");
  return value;
}

function readNumber(value: unknown, where: string): number {
  if (!isNumber(value)) fail(where, "must be a number");
  return value;
}

function readColor(value: unknown, where: string): string {
  const color = readString(value, where);
  if (!HEX_COLOR.test(color)) fail(where, "must be a hex colour like #ffffff");
  return color;
}

/** Ids key React lists and store lookups, so repeated or empty ones are replaced. */
function readId(value: unknown, seen: Set<string>, where: string): string {
  const id = readString(value, where);
  const unique = id === "" || seen.has(id) ? crypto.randomUUID() : id;
  seen.add(unique);
  return unique;
}

/** Object URLs die with the page; anything but a plain web, data or same-origin path is not loaded either. */
function isPersistentUrl(url: string): boolean {
  return (
    /^(?:https?:|data:)/i.test(url) ||
    (url.startsWith("/") && !url.startsWith("//"))
  );
}

function readUV(value: unknown, where: string): [number, number] {
  const list = readArray(value, where);
  if (list.length !== 2) fail(where, "must have two numbers");
  return [
    clamp(readNumber(list[0], `${where}[0]`), 0, 1),
    clamp(readNumber(list[1], `${where}[1]`), 0, 1),
  ];
}

function readComposition(value: unknown): Composition {
  const raw = readRecord(value, "composition");
  const preset = raw.preset;
  if (!isOneOf(ASPECT_PRESETS, preset))
    fail("composition.preset", "is not a known aspect ratio");
  const size = (field: "width" | "height") => {
    const n = readNumber(raw[field], `composition.${field}`);
    if (n < MIN_SIZE || n > MAX_SIZE)
      fail(
        `composition.${field}`,
        `must be between ${MIN_SIZE} and ${MAX_SIZE}`,
      );
    // Video encoders reject odd sizes.
    return Math.round(n / 2) * 2;
  };
  return { preset, width: size("width"), height: size("height") };
}

function readValues(value: unknown): Values {
  const raw = readRecord(value, "values");
  const values = {} as Values;
  for (const path of ANIM_PATHS) {
    const entry = raw[path];
    // A param missing from an older file keeps its default.
    values[path] =
      entry === undefined
        ? PARAMS[path].default
        : clampTyped(path, readNumber(entry, `values.${path}`));
  }
  return values;
}

function readLights(value: unknown): Light[] {
  const seen = new Set<string>();
  return readArray(value, "lights").map((entry, i): Light => {
    const where = `lights[${i}]`;
    const raw = readRecord(entry, where);
    const target = readArray(raw.target, `${where}.target`);
    if (target.length !== 3) fail(`${where}.target`, "must have three numbers");
    return {
      id: readId(raw.id, seen, `${where}.id`),
      name: readString(raw.name, `${where}.name`),
      azimuth: readNumber(raw.azimuth, `${where}.azimuth`),
      elevation: clamp(
        readNumber(raw.elevation, `${where}.elevation`),
        -90,
        90,
      ),
      intensity: clamp(readNumber(raw.intensity, `${where}.intensity`), 0, 10),
      color: readColor(raw.color, `${where}.color`),
      target: [
        readNumber(target[0], `${where}.target[0]`),
        readNumber(target[1], `${where}.target[1]`),
        readNumber(target[2], `${where}.target[2]`),
      ],
    };
  });
}

function readEffectCenters(value: unknown): EffectCenters {
  const raw = readRecord(value, "effectCenters");
  return {
    blur: readUV(raw.blur, "effectCenters.blur"),
    aberration: readUV(raw.aberration, "effectCenters.aberration"),
  };
}

function readBackground(value: unknown): Background {
  const raw = readRecord(value, "background");
  const transparent = raw.transparent;
  if (typeof transparent !== "boolean")
    fail("background.transparent", "must be true or false");
  const seen = new Set<string>();
  const layers: BackgroundLayer[] = [];
  readArray(raw.layers, "background.layers").forEach((entry, i) => {
    const where = `background.layers[${i}]`;
    const layer = readRecord(entry, where);
    const url = readString(layer.url, `${where}.url`);
    const fit = layer.fit;
    if (!isOneOf(LAYER_FITS, fit))
      fail(`${where}.fit`, "must be cover or contain");
    const parsed: BackgroundLayer = {
      id: readId(layer.id, seen, `${where}.id`),
      url,
      name: readString(layer.name, `${where}.name`),
      opacity: clamp(readNumber(layer.opacity, `${where}.opacity`), 0, 100),
      fit,
    };
    if (isPersistentUrl(url)) layers.push(parsed);
  });
  // The environment fields are absent in files saved before they existed.
  const optional = (
    field: string,
    fallback: number,
    min: number,
    max: number,
  ) =>
    raw[field] === undefined
      ? fallback
      : clamp(readNumber(raw[field], `background.${field}`), min, max);
  return {
    color: readColor(raw.color, "background.color"),
    transparent,
    layers,
    hdri: getHdri(typeof raw.hdri === "string" ? raw.hdri : null)?.id ?? null,
    // Uploaded environments are object URLs, which do not survive a reload.
    hdriFile: null,
    hdriBlur: optional("hdriBlur", 25, 0, 100),
    hdriBrightness: optional("hdriBrightness", 100, 0, 200),
    hdriRotation: optional("hdriRotation", 0, -180, 180),
    hdriLighting: raw.hdriLighting !== false,
    floor:
      raw.floor === "concrete" ||
      raw.floor === "asphalt" ||
      raw.floor === "wood"
        ? raw.floor
        : "none",
  };
}

function readMedia(value: unknown): Media | null {
  if (value === null || value === undefined) return null;
  const raw = readRecord(value, "media");
  const url = readString(raw.url, "media.url");
  const kind = raw.kind;
  if (!isOneOf(MEDIA_KINDS, kind)) fail("media.kind", "must be image or video");
  const fit = raw.fit;
  if (!isOneOf(MEDIA_FITS, fit))
    fail("media.fit", "must be cover, contain or stretch");
  const media: Media = {
    url,
    kind,
    name: readString(raw.name, "media.name"),
    fit,
    scale: clamp(readNumber(raw.scale, "media.scale"), 0.01, 100),
    offsetX: clamp(readNumber(raw.offsetX, "media.offsetX"), -1, 1),
    offsetY: clamp(readNumber(raw.offsetY, "media.offsetY"), -1, 1),
  };
  if (raw.duration !== undefined)
    media.duration = clamp(
      readNumber(raw.duration, "media.duration"),
      0,
      24 * 60 * 60 * 1000,
    );
  return isPersistentUrl(url) ? media : null;
}

function readKeyframes(
  value: unknown,
  path: AnimPath,
  where: string,
  duration: number,
  seen: Set<string>,
): Keyframe[] {
  return readArray(value, where)
    .map((entry, i) => {
      const at = `${where}[${i}]`;
      const raw = readRecord(entry, at);
      const ease = raw.ease;
      if (!isEase(ease)) fail(`${at}.ease`, "is not a known easing");
      const keyframe: Keyframe = {
        id: readId(raw.id, seen, `${at}.id`),
        t: clamp(readNumber(raw.t, `${at}.t`), 0, duration),
        value: clampTyped(path, readNumber(raw.value, `${at}.value`)),
        ease,
      };
      return keyframe;
    })
    .sort((a, b) => a.t - b.t);
}

function readTracks(value: unknown, where: string, duration: number): Tracks {
  const raw = readRecord(value, where);
  const seen = new Set<string>();
  const tracks: Tracks = {};
  for (const key of Object.keys(raw)) {
    // Unknown params (from a newer or edited file) are dropped, not fatal.
    if (!isAnimPath(key)) continue;
    const keyframes = readKeyframes(
      raw[key],
      key,
      `${where}.${key}`,
      duration,
      seen,
    );
    if (keyframes.length) tracks[key] = keyframes;
  }
  return tracks;
}

function readShots(value: unknown): Shot[] {
  const list = readArray(value, "shots");
  if (list.length === 0) fail("shots", "must contain at least one shot");
  const seen = new Set<string>();
  return list.map((entry, i): Shot => {
    const where = `shots[${i}]`;
    const raw = readRecord(entry, where);
    const rawDuration = readNumber(raw.duration, `${where}.duration`);
    if (rawDuration <= 0)
      fail(`${where}.duration`, "must be greater than zero");
    const duration = Math.round(clamp(rawDuration, MIN_SHOT_MS, MAX_SHOT_MS));
    return {
      id: readId(raw.id, seen, `${where}.id`),
      name: readString(raw.name, `${where}.name`),
      duration,
      tracks: readTracks(raw.tracks, `${where}.tracks`, duration),
    };
  });
}

/** Check an untrusted parsed JSON value and rebuild it as a `SceneDocument`. Throws a readable Error. */
export function parseSceneDocument(input: unknown): SceneDocument {
  const raw = readRecord(input, "the file");
  if (raw.version !== 1)
    fail(
      "version",
      `must be 1 (this file says ${JSON.stringify(raw.version) ?? "nothing"})`,
    );
  const requested = raw.deviceId;
  const deviceId =
    typeof requested === "string" &&
    DEVICES.some((device) => device.id === requested)
      ? requested
      : DEFAULT_DEVICE_ID;
  return {
    version: 1,
    deviceId,
    // Absent in files saved before body tinting existed.
    bodyColor:
      raw.bodyColor == null ? null : readColor(raw.bodyColor, "bodyColor"),
    composition: readComposition(raw.composition),
    values: readValues(raw.values),
    lights: readLights(raw.lights),
    effectCenters: readEffectCenters(raw.effectCenters),
    background: readBackground(raw.background),
    media: readMedia(raw.media),
    shots: readShots(raw.shots),
    seamlessLoop: raw.seamlessLoop === true,
  };
}
