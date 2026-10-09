/**
 * Every animatable number in the scene, with its range and meaning.
 * Add a row here and it becomes available to the store, the keyframe
 * engine and the Pro Mode timeline with no other wiring.
 */

export type ParamGroup =
  | "object"
  | "camera"
  | "lights"
  | "screen"
  | "effects"
  | "background";

export interface ParamMeta {
  label: string;
  group: ParamGroup;
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
}

export const PARAMS = {
  /** Degrees. Pitch applied in world space on top of the rotation below. */
  "object.tilt": {
    label: "Tilt",
    group: "object",
    min: -60,
    max: 60,
    step: 1,
    default: 0,
    unit: "°",
  },
  /** 100 = one world unit (one device height) to the right. */
  "object.x": {
    label: "X Position",
    group: "object",
    min: -100,
    max: 100,
    step: 1,
    default: 0,
  },
  /** 100 = one world unit up. */
  "object.y": {
    label: "Y Position",
    group: "object",
    min: -100,
    max: 100,
    step: 1,
    default: 0,
  },
  /** Degrees, applied as Euler XYZ on the device. */
  "object.rotX": {
    label: "X Rotation",
    group: "object",
    min: -360,
    max: 360,
    step: 1,
    default: 0,
    unit: "°",
  },
  "object.rotY": {
    label: "Y Rotation",
    group: "object",
    min: -360,
    max: 360,
    step: 1,
    default: 0,
    unit: "°",
  },
  "object.rotZ": {
    label: "Z Rotation",
    group: "object",
    min: -360,
    max: 360,
    step: 1,
    default: 0,
    unit: "°",
  },

  /** Laptop lid: 100 = open as modelled, 0 = shut, past 100 leans further back. Ignored by devices without a lid. */
  "object.lid": {
    label: "Lid",
    group: "object",
    min: 0,
    max: 125,
    step: 1,
    default: 100,
    unit: "%",
  },

  /**
   * Framing, relative to the device and the composition: at 60 the whole
   * device fits the frame with room to turn, 120 is twice as close. The lens
   * does not change it.
   */
  "camera.zoom": {
    label: "Zoom",
    group: "camera",
    min: 10,
    max: 300,
    step: 1,
    default: 60,
  },
  /**
   * Perspective strength. fov = 50 - lens * 0.4 degrees, and the camera
   * dollies so the framing from `zoom` holds (0 = wide, 100 = near-flat).
   */
  "camera.lens": {
    label: "Lens",
    group: "camera",
    min: 0,
    max: 100,
    step: 1,
    default: 70,
  },
  /** Barrel distortion applied in post. */
  "camera.fisheye": {
    label: "Fisheye",
    group: "camera",
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },

  /**
   * Depth of field. The camera focuses on the middle of the device; parts
   * nearer or further away soften, more so as this goes up. 0 = everything
   * sharp.
   */
  "camera.dof": {
    label: "Depth of Field",
    group: "camera",
    min: 0,
    max: 100,
    step: 1,
    default: 20,
  },

  /** Brightness of every lamp in the rig at once. Presets fade it to bring the device up out of the dark. */
  "lights.level": {
    label: "Lamps",
    group: "lights",
    min: 0,
    max: 200,
    step: 1,
    default: 100,
    unit: "%",
  },

  "lights.ambient": {
    label: "Ambient",
    group: "lights",
    min: 0,
    max: 100,
    step: 1,
    default: 25,
  },

  /**
   * Turns the whole lighting rig (lights and studio reflections) around the
   * device, in degrees. Animating it sweeps highlights across the surfaces.
   */
  "lights.rotation": {
    label: "Light Sweep",
    group: "lights",
    min: -180,
    max: 180,
    step: 1,
    default: 0,
    unit: "°",
  },

  "screen.opacity": {
    label: "Opacity",
    group: "screen",
    min: 0,
    max: 100,
    step: 1,
    default: 100,
    unit: "%",
  },
  /** How strongly the cover glass reflects the lights and studio. 0 = no glass. */
  "screen.reflection": {
    label: "Reflection",
    group: "screen",
    min: 0,
    max: 100,
    step: 1,
    default: 6,
  },
  /** A phosphor dot mask over the screen content: RGB stripes in a fine grid. */
  "screen.crt": {
    label: "CRT",
    group: "screen",
    min: 0,
    max: 100,
    step: 1,
    default: 10,
  },
  /** Offset double image, as if seen through thick glass. */
  "screen.ghosting": {
    label: "Glass Ghosting",
    group: "screen",
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  /** Bloom spilling off the screen. 0 = off. */
  "screen.glow": {
    label: "Screen Glow",
    group: "screen",
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },

  /** Radial blur growing away from `effectCenters.blur`. */
  /**
   * How far the picture sits below the cover glass. The picture slides
   * against the bezel as the view turns, and its edges darken, which is what
   * makes it read as a real panel behind glass. 0 = painted on the surface.
   */
  "screen.depth": {
    label: "Glass Depth",
    group: "screen",
    min: 0,
    max: 100,
    step: 1,
    default: 25,
  },
  /** How much the lit screen spills its own colour onto nearby surfaces, such as a laptop keyboard. */
  "screen.spill": {
    label: "Light Spill",
    group: "screen",
    min: 0,
    max: 100,
    step: 1,
    default: 40,
  },

  "effects.blur": {
    label: "Blur",
    group: "effects",
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  /** An even, soft defocus over the whole picture. Presets use it to arrive out of focus and sharpen. */
  "effects.soften": {
    label: "Soft Blur",
    group: "effects",
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  /** Chromatic aberration growing away from `effectCenters.aberration`. */
  "effects.aberration": {
    label: "Aberration",
    group: "effects",
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  "effects.grain": {
    label: "Grain",
    group: "effects",
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },
  "effects.vignette": {
    label: "Vignette",
    group: "effects",
    min: 0,
    max: 100,
    step: 1,
    default: 0,
  },

  "background.opacity": {
    label: "Opacity",
    group: "background",
    min: 0,
    max: 100,
    step: 1,
    default: 100,
    unit: "%",
  },
} as const satisfies Record<string, ParamMeta>;

export type AnimPath = keyof typeof PARAMS;

export const ANIM_PATHS = Object.keys(PARAMS) as AnimPath[];

export function paramMeta(path: AnimPath): ParamMeta {
  return PARAMS[path];
}

export function pathsInGroup(group: ParamGroup): AnimPath[] {
  return ANIM_PATHS.filter((path) => PARAMS[path].group === group);
}

export function clampParam(path: AnimPath, value: number): number {
  const { min, max } = PARAMS[path];
  return Math.min(max, Math.max(min, value));
}
