import {
  Color,
  type Group,
  type Object3D,
  Vector3,
  type VideoTexture,
} from "three";
import { defaultValues } from "@/lib/mockup-studio/scene/store";
import type { Values } from "@/lib/mockup-studio/scene/types";

/**
 * Mutable state shared by the viewport's per-frame code. It lives outside React on purpose: frames write to it every
 * tick and must never cause a render.
 */
export interface ViewportRuntime {
  /** Global time of the export frame being drawn, or null while the viewport is live. */
  exportMs: number | null;
  /** Time the current frame is drawn at: the playhead live, `exportMs` while exporting. */
  timeMs: number;
  /** Scene values at `timeMs`, refreshed once per frame by the frame driver before anything else reads them. */
  values: Values;
  /** Group that holds the device model. Used for ray picks and for light targets. */
  device: Group | null;
  /** Width, height and depth of the loaded device in world units, used to frame it. */
  deviceExtents: Vector3;
  /** Average colour of what the screen is showing, which is the colour of the light it gives off. Black when empty. */
  screenColor: Color;
  /** Something sitting at the centre of the screen, which is where the camera focuses. Null without a screen. */
  focusTarget: Object3D | null;
  /** Screen video while the media is a video. */
  video: HTMLVideoElement | null;
  videoTexture: VideoTexture | null;
  /** Monotonic seconds passed to R3F's `advance` while exporting. */
  tick: number;
}

export function createRuntime(): ViewportRuntime {
  return {
    exportMs: null,
    timeMs: 0,
    values: defaultValues(),
    device: null,
    focusTarget: null,
    deviceExtents: new Vector3(1, 1, 1),
    screenColor: new Color(0, 0, 0),
    video: null,
    videoTexture: null,
    tick: 0,
  };
}
