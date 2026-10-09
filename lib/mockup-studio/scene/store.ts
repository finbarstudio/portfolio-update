import { create } from "zustand";
import { evaluate, locateShot, totalDuration } from "./animation";
import { DEFAULT_DEVICE_ID } from "./devices";
import type { ScreenBox } from "./framing";
import { clampTyped } from "./limits";
import { ANIM_PATHS, type AnimPath, PARAMS } from "./params";
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
  PickMode,
  SceneDocument,
  Shot,
  Tool,
  Tracks,
  Values,
} from "./types";

const LONG_EDGE = 1920;
const MIN_SHOT_MS = 200;
/** Keyframes closer than this to the playhead are edited instead of duplicated. */
const KEYFRAME_SNAP_MS = 20;

const ASPECTS: Record<Exclude<AspectPreset, "custom">, [number, number]> = {
  "1:1": [1, 1],
  "16:9": [16, 9],
  "2:1": [2, 1],
  "4:3": [4, 3],
  "3:4": [3, 4],
  "9:16": [9, 16],
};

export function compositionFor(
  preset: Exclude<AspectPreset, "custom">,
): Composition {
  // The wide banner format is used at this exact size.
  if (preset === "2:1") return { preset, width: 2000, height: 1000 };
  const [w, h] = ASPECTS[preset];
  const scale = LONG_EDGE / Math.max(w, h);
  // Even dimensions: video encoders reject odd ones.
  const even = (n: number) => Math.round((n * scale) / 2) * 2;
  return { preset, width: even(w), height: even(h) };
}

export function defaultValues(): Values {
  return Object.fromEntries(
    ANIM_PATHS.map((path) => [path, PARAMS[path].default]),
  ) as Values;
}

function id(): string {
  return crypto.randomUUID();
}

function makeShot(index: number, duration = 3000): Shot {
  return { id: id(), name: `Shot ${index + 1}`, duration, tracks: {} };
}

function defaultLights(): Light[] {
  // A three-point rig: key from the right and a little above, rim from behind and above so the far edge catches a
  // line of light, and a low fill from the left so the shadow side keeps some shape.
  return [
    {
      id: id(),
      name: "key",
      azimuth: 70,
      elevation: 13,
      intensity: 2,
      color: "#ffffff",
      target: [0, 0, 0],
    },
    {
      id: id(),
      name: "rim",
      azimuth: 150,
      elevation: 32,
      intensity: 2.4,
      color: "#ffffff",
      target: [0, 0, 0],
    },
    {
      id: id(),
      name: "fill",
      azimuth: -105,
      elevation: 6,
      intensity: 1.6,
      color: "#ffffff",
      target: [0, 0, 0],
    },
  ];
}

function upsertKeyframe(
  keyframes: Keyframe[],
  t: number,
  value: number,
): Keyframe[] {
  const existing = keyframes.find(
    (keyframe) => Math.abs(keyframe.t - t) <= KEYFRAME_SNAP_MS,
  );
  if (existing)
    return keyframes.map((keyframe) =>
      keyframe === existing ? { ...keyframe, value } : keyframe,
    );
  return [...keyframes, { id: id(), t, value, ease: "easeInOut" as Ease }].sort(
    (a, b) => a.t - b.t,
  );
}

function mapShot(
  shots: Shot[],
  shotId: string,
  fn: (shot: Shot) => Shot,
): Shot[] {
  return shots.map((shot) => (shot.id === shotId ? fn(shot) : shot));
}

function withTrack(shot: Shot, path: AnimPath, keyframes: Keyframe[]): Shot {
  const tracks: Tracks = { ...shot.tracks };
  if (keyframes.length) tracks[path] = keyframes;
  else delete tracks[path];
  return { ...shot, tracks };
}

export interface StudioState {
  // Document
  deviceId: string;
  /** Hex colour the device body is tinted with, or null for the model's own colours. */
  bodyColor: string | null;
  composition: Composition;
  /** Rest values: what the scene looks like where nothing is keyframed. */
  values: Values;
  lights: Light[];
  effectCenters: EffectCenters;
  background: Background;
  media: Media | null;
  shots: Shot[];
  /** The end of the timeline glides back to the first frame, so the animation loops without a jump. */
  seamlessLoop: boolean;

  // Session
  selectedLightId: string | null;
  /** Global playhead in milliseconds. */
  playhead: number;
  playing: boolean;
  loop: boolean;
  /** While on, value edits write keyframes at the playhead instead of rest values. */
  recording: boolean;
  proMode: boolean;
  /** Show safe-zone guides over the viewport. Never exported. */
  guides: boolean;
  tool: Tool;
  /** Set while the next click on the viewport should place something. */
  pick: PickMode | null;
  /** Width, height and depth of the loaded device in world units, reported by the viewport. */
  deviceExtents: [number, number, number];
  /** Where the loaded device's screen sits, for framing close shots on it. Null without a screen. */
  deviceScreen: ScreenBox | null;

  // Values and keyframes
  setValue(path: AnimPath, value: number): void;
  resetValues(paths: AnimPath[]): void;
  /** Keyframe `paths` (default: every path the current shot already animates, else object and camera) at the playhead. */
  addKeyframes(paths?: AnimPath[]): void;
  moveKeyframe(
    shotId: string,
    path: AnimPath,
    keyframeId: string,
    t: number,
  ): void;
  setKeyframeEase(
    shotId: string,
    path: AnimPath,
    keyframeId: string,
    ease: Ease,
  ): void;
  removeKeyframe(shotId: string, path: AnimPath, keyframeId: string): void;
  clearTrack(shotId: string, path: AnimPath): void;
  setTracks(shotId: string, tracks: Tracks): void;

  // Shots
  addShot(): void;
  duplicateShot(shotId: string): void;
  removeShot(shotId: string): void;
  moveShot(shotId: string, toIndex: number): void;
  renameShot(shotId: string, name: string): void;
  setShotDuration(shotId: string, duration: number): void;
  /** Replace the whole timeline, e.g. with a multi-shot preset. */
  setShots(shots: Shot[]): void;
  /** Back to the default pose, camera, effects and an empty timeline. Keeps the device, finish, media, lights and background. */
  resetScene(): void;
  /** Stretch or squeeze every shot and its keyframes so the timeline lasts `totalMs`. */
  fitTimelineTo(totalMs: number): void;

  // Transport
  setPlayhead(ms: number): void;
  setPlaying(playing: boolean): void;
  /** Advance the playhead by `dtMs` while playing. Called once per frame by the playback clock. */
  tick(dtMs: number): void;
  setLoop(loop: boolean): void;
  setSeamlessLoop(seamlessLoop: boolean): void;
  setRecording(recording: boolean): void;
  setProMode(proMode: boolean): void;
  setGuides(guides: boolean): void;
  setTool(tool: Tool): void;
  setPick(pick: PickMode | null): void;
  setDeviceExtents(
    extents: [number, number, number],
    screen: ScreenBox | null,
  ): void;

  // Scene
  setDevice(deviceId: string): void;
  setBodyColor(bodyColor: string | null): void;
  setAspect(preset: Exclude<AspectPreset, "custom">): void;
  setCustomSize(width: number, height: number): void;
  setMedia(media: Media | null): void;
  updateMedia(patch: Partial<Media>): void;
  addLight(): void;
  updateLight(lightId: string, patch: Partial<Light>): void;
  removeLight(lightId: string): void;
  selectLight(lightId: string | null): void;
  setEffectCenter(effect: keyof EffectCenters, center: [number, number]): void;
  setBackground(patch: Partial<Background>): void;
  addBackgroundLayer(layer: Omit<BackgroundLayer, "id">): void;
  updateBackgroundLayer(layerId: string, patch: Partial<BackgroundLayer>): void;
  removeBackgroundLayer(layerId: string): void;

  // Persistence
  toDocument(): SceneDocument;
  loadDocument(doc: SceneDocument): void;
}

export const useStudio = create<StudioState>()((set, get) => {
  const lights = defaultLights();
  return {
    deviceId: DEFAULT_DEVICE_ID,
    bodyColor: null,
    composition: compositionFor("4:3"),
    values: defaultValues(),
    lights,
    effectCenters: { blur: [0.5, 0.5], aberration: [0.5, 0.5] },
    background: {
      color: "#000000",
      transparent: false,
      layers: [],
      hdri: null,
      hdriFile: null,
      hdriBlur: 25,
      hdriBrightness: 100,
      hdriRotation: 0,
      hdriLighting: true,
      floor: "none",
    },
    media: null,
    shots: [makeShot(0)],

    selectedLightId: lights[0].id,
    playhead: 0,
    playing: false,
    seamlessLoop: false,
    loop: true,
    recording: false,
    proMode: false,
    guides: false,
    tool: "select",
    pick: null,
    deviceExtents: [1, 1, 1],
    deviceScreen: null,

    setValue(path, raw) {
      const value = clampTyped(path, raw);
      const { recording, shots, playhead, values } = get();
      const { shot, localMs } = locateShot(shots, playhead);
      const track = shot.tracks[path];
      // A keyframed path can only be changed through its keyframes, otherwise
      // the edit would be invisible (the track overrides the rest value).
      if (recording || track?.length) {
        const keyframes = upsertKeyframe(
          track ?? [],
          Math.round(localMs),
          value,
        );
        set({
          shots: mapShot(shots, shot.id, (s) => withTrack(s, path, keyframes)),
        });
      } else {
        set({ values: { ...values, [path]: value } });
      }
    },

    resetValues(paths) {
      const { values, shots, playhead } = get();
      const { shot } = locateShot(shots, playhead);
      const nextValues = { ...values };
      let nextShot = shot;
      for (const path of paths) {
        nextValues[path] = PARAMS[path].default;
        nextShot = withTrack(nextShot, path, []);
      }
      set({
        values: nextValues,
        shots: mapShot(shots, shot.id, () => nextShot),
      });
    },

    addKeyframes(paths) {
      const { shots, playhead, values } = get();
      const { shot, localMs } = locateShot(shots, playhead);
      const tracked = Object.keys(shot.tracks) as AnimPath[];
      const fallback = ANIM_PATHS.filter((path) => {
        const group = PARAMS[path].group;
        return group === "object" || group === "camera";
      });
      const targets = paths ?? (tracked.length ? tracked : fallback);
      const current = evaluate(values, shots, playhead);
      let next = shot;
      for (const path of targets) {
        next = withTrack(
          next,
          path,
          upsertKeyframe(
            next.tracks[path] ?? [],
            Math.round(localMs),
            current[path],
          ),
        );
      }
      set({ shots: mapShot(shots, shot.id, () => next) });
    },

    moveKeyframe(shotId, path, keyframeId, t) {
      set({
        shots: mapShot(get().shots, shotId, (shot) => {
          const clamped = Math.round(Math.min(Math.max(t, 0), shot.duration));
          const keyframes = (shot.tracks[path] ?? [])
            .map((keyframe) =>
              keyframe.id === keyframeId
                ? { ...keyframe, t: clamped }
                : keyframe,
            )
            .sort((a, b) => a.t - b.t);
          return withTrack(shot, path, keyframes);
        }),
      });
    },

    setKeyframeEase(shotId, path, keyframeId, ease) {
      set({
        shots: mapShot(get().shots, shotId, (shot) =>
          withTrack(
            shot,
            path,
            (shot.tracks[path] ?? []).map((keyframe) =>
              keyframe.id === keyframeId ? { ...keyframe, ease } : keyframe,
            ),
          ),
        ),
      });
    },

    removeKeyframe(shotId, path, keyframeId) {
      set({
        shots: mapShot(get().shots, shotId, (shot) =>
          withTrack(
            shot,
            path,
            (shot.tracks[path] ?? []).filter(
              (keyframe) => keyframe.id !== keyframeId,
            ),
          ),
        ),
      });
    },

    clearTrack(shotId, path) {
      set({
        shots: mapShot(get().shots, shotId, (shot) =>
          withTrack(shot, path, []),
        ),
      });
    },

    setTracks(shotId, tracks) {
      set({
        shots: mapShot(get().shots, shotId, (shot) => ({ ...shot, tracks })),
      });
    },

    addShot() {
      const { shots } = get();
      set({
        shots: [...shots, makeShot(shots.length)],
        playhead: totalDuration(shots),
      });
    },

    duplicateShot(shotId) {
      const { shots } = get();
      const index = shots.findIndex((shot) => shot.id === shotId);
      if (index < 0) return;
      const source = shots[index];
      const tracks: Tracks = {};
      for (const path of Object.keys(source.tracks) as AnimPath[]) {
        tracks[path] = source.tracks[path]?.map((keyframe) => ({
          ...keyframe,
          id: id(),
        }));
      }
      const copy: Shot = {
        ...source,
        id: id(),
        name: `${source.name} copy`,
        tracks,
      };
      set({
        shots: [...shots.slice(0, index + 1), copy, ...shots.slice(index + 1)],
      });
    },

    removeShot(shotId) {
      const { shots, playhead } = get();
      if (shots.length <= 1) return;
      const next = shots.filter((shot) => shot.id !== shotId);
      set({ shots: next, playhead: Math.min(playhead, totalDuration(next)) });
    },

    moveShot(shotId, toIndex) {
      const { shots } = get();
      const from = shots.findIndex((shot) => shot.id === shotId);
      if (from < 0) return;
      const next = [...shots];
      const [moved] = next.splice(from, 1);
      next.splice(Math.min(Math.max(toIndex, 0), next.length), 0, moved);
      set({ shots: next });
    },

    renameShot(shotId, name) {
      set({
        shots: mapShot(get().shots, shotId, (shot) => ({ ...shot, name })),
      });
    },

    setShotDuration(shotId, raw) {
      const duration = Math.max(MIN_SHOT_MS, Math.round(raw));
      const shots = mapShot(get().shots, shotId, (shot) => {
        const tracks: Tracks = {};
        for (const path of Object.keys(shot.tracks) as AnimPath[]) {
          // Keyframes past the new end are pulled back to it rather than lost.
          tracks[path] = shot.tracks[path]?.map((keyframe) => ({
            ...keyframe,
            t: Math.min(keyframe.t, duration),
          }));
        }
        return { ...shot, duration, tracks };
      });
      set({ shots, playhead: Math.min(get().playhead, totalDuration(shots)) });
    },

    resetScene() {
      set({
        values: defaultValues(),
        shots: [makeShot(0)],
        playhead: 0,
        playing: false,
      });
    },

    setShots(shots) {
      if (shots.length) set({ shots, playhead: 0 });
    },

    fitTimelineTo(totalMs) {
      const { shots, playhead } = get();
      const current = totalDuration(shots);
      const target = Math.max(MIN_SHOT_MS * shots.length, Math.round(totalMs));
      const factor = target / current;
      const scaled = shots.map((shot) => {
        const duration = Math.max(
          MIN_SHOT_MS,
          Math.round(shot.duration * factor),
        );
        const tracks: Tracks = {};
        for (const path of Object.keys(shot.tracks) as AnimPath[]) {
          tracks[path] = shot.tracks[path]?.map((keyframe) => ({
            ...keyframe,
            t: Math.min(
              duration,
              Math.round(keyframe.t * (duration / shot.duration)),
            ),
          }));
        }
        return { ...shot, duration, tracks };
      });
      set({
        shots: scaled,
        playhead: Math.min(playhead * factor, totalDuration(scaled)),
      });
    },

    setPlayhead(ms) {
      set({ playhead: Math.min(Math.max(ms, 0), totalDuration(get().shots)) });
    },

    setPlaying(playing) {
      const { playhead, shots } = get();
      // Pressing play at the end restarts from the top.
      if (playing && playhead >= totalDuration(shots))
        set({ playing, playhead: 0 });
      else set({ playing });
    },

    tick(dtMs) {
      const { playing, playhead, shots, loop } = get();
      if (!playing) return;
      const end = totalDuration(shots);
      const next = playhead + dtMs;
      if (next < end) set({ playhead: next });
      else if (loop) set({ playhead: next % end });
      else set({ playhead: end, playing: false });
    },

    setLoop: (loop) => set({ loop }),
    setSeamlessLoop: (seamlessLoop) => set({ seamlessLoop }),
    setRecording: (recording) => set({ recording }),
    setProMode: (proMode) => set({ proMode }),
    setGuides: (guides) => set({ guides }),
    setTool: (tool) => set({ tool }),
    setPick: (pick) => set({ pick }),
    setDeviceExtents: (deviceExtents, deviceScreen) =>
      set({ deviceExtents, deviceScreen }),

    // A tint picked for one device rarely suits the next, so it does not carry over.
    setDevice: (deviceId) => set({ deviceId, bodyColor: null }),
    setBodyColor: (bodyColor) => set({ bodyColor }),
    setAspect: (preset) => set({ composition: compositionFor(preset) }),
    setCustomSize(width, height) {
      const even = (n: number) =>
        Math.min(Math.max(Math.round(n / 2) * 2, 16), 7680);
      set({
        composition: {
          preset: "custom",
          width: even(width),
          height: even(height),
        },
      });
    },

    setMedia: (media) => set({ media }),
    updateMedia(patch) {
      const { media } = get();
      if (media) set({ media: { ...media, ...patch } });
    },

    addLight() {
      const { lights } = get();
      const light: Light = {
        id: id(),
        name: `light ${lights.length + 1}`,
        azimuth: 0,
        elevation: 45,
        intensity: 2,
        color: "#ffffff",
        target: [0, 0, 0],
      };
      set({ lights: [...lights, light], selectedLightId: light.id });
    },

    updateLight(lightId, patch) {
      set({
        lights: get().lights.map((light) =>
          light.id === lightId ? { ...light, ...patch } : light,
        ),
      });
    },

    removeLight(lightId) {
      const lights = get().lights.filter((light) => light.id !== lightId);
      const { selectedLightId } = get();
      set({
        lights,
        selectedLightId:
          selectedLightId === lightId
            ? (lights[0]?.id ?? null)
            : selectedLightId,
      });
    },

    selectLight: (selectedLightId) => set({ selectedLightId }),

    setEffectCenter(effect, center) {
      set({ effectCenters: { ...get().effectCenters, [effect]: center } });
    },

    setBackground(patch) {
      set({ background: { ...get().background, ...patch } });
    },

    addBackgroundLayer(layer) {
      const { background } = get();
      set({
        background: {
          ...background,
          layers: [...background.layers, { ...layer, id: id() }],
        },
      });
    },

    updateBackgroundLayer(layerId, patch) {
      const { background } = get();
      set({
        background: {
          ...background,
          layers: background.layers.map((layer) =>
            layer.id === layerId ? { ...layer, ...patch } : layer,
          ),
        },
      });
    },

    removeBackgroundLayer(layerId) {
      const { background } = get();
      set({
        background: {
          ...background,
          layers: background.layers.filter((layer) => layer.id !== layerId),
        },
      });
    },

    toDocument() {
      const {
        deviceId,
        bodyColor,
        composition,
        values,
        lights,
        effectCenters,
        background,
        media,
        shots,
        seamlessLoop,
      } = get();
      return {
        version: 1,
        deviceId,
        bodyColor,
        composition,
        values,
        lights,
        effectCenters,
        background,
        media,
        shots,
        seamlessLoop,
      };
    },

    loadDocument(doc) {
      set({
        deviceId: doc.deviceId,
        bodyColor: doc.bodyColor,
        composition: doc.composition,
        // Merge over defaults so documents saved before a param existed still load.
        values: { ...defaultValues(), ...doc.values },
        lights: doc.lights,
        effectCenters: doc.effectCenters,
        background: doc.background,
        media: doc.media,
        shots: doc.shots,
        seamlessLoop: doc.seamlessLoop === true,
        selectedLightId: doc.lights[0]?.id ?? null,
        playhead: 0,
        playing: false,
      });
    },
  };
});

/** Scene values at the playhead, re-rendering when they change. */
export function useResolvedValue(path: AnimPath): number {
  return useStudio(
    (state) =>
      evaluate(state.values, state.shots, state.playhead, state.seamlessLoop)[
        path
      ],
  );
}

/** Scene values at an arbitrary time, for the viewport's frame loop and export. */
export function resolveAt(ms: number): Values {
  const { values, shots, seamlessLoop } = useStudio.getState();
  return evaluate(values, shots, ms, seamlessLoop);
}
