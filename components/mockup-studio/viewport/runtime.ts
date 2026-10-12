import { type Group, type Object3D, Quaternion, Vector3 } from "three";
import { defaultValues } from "@/lib/mockup-studio/scene/store";
import type { Values } from "@/lib/mockup-studio/scene/types";
import { type BounceUniforms, createBounceUniforms } from "./screen-bounce";

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
  /**
   * What the screen shows and where it is, shared by the screen's shader and every surface that reflects it: the
   * device's body and the floor. Written once per frame by the device.
   */
  bounce: BounceUniforms;
  /** Something sitting at the centre of the screen, which is where the camera focuses. Null without a screen. */
  focusTarget: Object3D | null;
  /** Screen video while the media is a video. */
  video: HTMLVideoElement | null;
  /** Bring the screen's texture up to date with the video's current frame. Null when the media is not a video. */
  refreshScreen: (() => void) | null;
  /** The media is being shown in a window over a backdrop, composed to exactly the screen's shape. */
  framed: boolean;
  /**
   * How the ground is turned. With a floor on, the floor and the surroundings ride with the device, so a move reads
   * as the camera travelling round a thing that stands still. Identity without a floor.
   */
  ground: Quaternion;
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
    bounce: createBounceUniforms(),
    video: null,
    refreshScreen: null,
    framed: false,
    ground: new Quaternion(),
    tick: 0,
  };
}
