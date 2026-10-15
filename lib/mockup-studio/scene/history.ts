import { type StudioState, useStudio } from "./store";

/**
 * Undo and redo for the scene. Everything a saved file holds is tracked except the screen media, whose file is
 * released when it is replaced and so cannot be brought back. Playback, selection and view settings are not history.
 */
const TRACKED = [
  "deviceId",
  "bodyColor",
  "composition",
  "values",
  "lights",
  "effectCenters",
  "background",
  "shots",
  "seamlessLoop",
  "shotBlend",
  "frame",
  "statusBar",
] as const satisfies readonly (keyof StudioState)[];

type Snapshot = Pick<StudioState, (typeof TRACKED)[number]>;

/** Changes closer together than this are one step: a slider drag undoes in one go, not a pixel at a time. */
const SAME_GESTURE_MS = 400;
const MAX_STEPS = 200;

const undoStack: Snapshot[] = [];
const redoStack: Snapshot[] = [];
let lastChange = 0;
let restoring = false;

function snapshot(state: StudioState): Snapshot {
  const out: Partial<Record<keyof Snapshot, unknown>> = {};
  for (const key of TRACKED) out[key] = state[key];
  return out as Snapshot;
}

function changed(a: StudioState, b: StudioState): boolean {
  return TRACKED.some((key) => a[key] !== b[key]);
}

/** Start recording. Returns the function that stops it. */
export function watchHistory(): () => void {
  return useStudio.subscribe((state, previous) => {
    if (restoring || !changed(state, previous)) return;
    const now = performance.now();
    if (now - lastChange > SAME_GESTURE_MS) {
      undoStack.push(snapshot(previous));
      if (undoStack.length > MAX_STEPS) undoStack.shift();
    }
    lastChange = now;
    redoStack.length = 0;
  });
}

function restore(from: Snapshot[], to: Snapshot[]): boolean {
  const target = from.pop();
  if (!target) return false;
  const state = useStudio.getState();
  to.push(snapshot(state));
  restoring = true;
  useStudio.setState({
    ...target,
    // The timeline may have got shorter, and a light that is selected may no longer exist.
    playhead: Math.min(
      state.playhead,
      target.shots.reduce((sum, shot) => sum + shot.duration, 0),
    ),
    selectedLightId: target.lights.some(
      (light) => light.id === state.selectedLightId,
    )
      ? state.selectedLightId
      : (target.lights[0]?.id ?? null),
  });
  restoring = false;
  // The next edit starts a step of its own rather than joining whatever came before the undo.
  lastChange = 0;
  return true;
}

export const undo = () => restore(undoStack, redoStack);
export const redo = () => restore(redoStack, undoStack);
