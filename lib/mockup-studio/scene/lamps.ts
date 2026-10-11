import type { Light } from "./types";

/**
 * How far the lamps stand from the device, in world units (the device is about one unit tall). Close, like a product
 * shoot: with inverse-square falloff the near side is lit hard and the far side falls into shadow.
 */
export const LAMP_DISTANCE = 1.5;

const radians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * Where a lamp stands. Azimuth 0 is the camera side (+Z), 90 is +X; elevation lifts it above the horizon. `sweep`
 * turns the whole rig, in degrees.
 */
export function lampPosition(
  light: Light,
  sweep: number,
): [number, number, number] {
  const azimuth = radians(light.azimuth + sweep);
  const elevation = radians(light.elevation);
  return [
    LAMP_DISTANCE * Math.cos(elevation) * Math.sin(azimuth),
    LAMP_DISTANCE * Math.sin(elevation),
    LAMP_DISTANCE * Math.cos(elevation) * Math.cos(azimuth),
  ];
}
