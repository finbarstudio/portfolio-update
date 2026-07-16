/**
 * The brand asterisk OUTLINE, as a single polygon in a 0-100 box.
 *
 * Taken from the outermost shape of the real artwork (Brand/SVG/Gradient
 * Logomark.svg, its `cls-3` polygon) and normalised from that 831.88 box to the
 * 0-100 one every consumer already expects, so this silhouette matches the logo
 * exactly. Outline ONLY: the full six-step gradient mark lives in
 * components/brand-mark.ts and renders through <BrandMark />.
 *
 * Use this where the shape must be stroked, drawn, tweened or parsed into
 * coordinates (the home intro's draw-on, the loaders, the sandbox toys). Use
 * BrandMark wherever the logo is simply shown.
 */

export const ASTERISK_POINTS =
  "41.67,0.00 58.33,0.00 55.18,37.49 79.46,8.75 91.25,20.54 62.51,44.82 100.00,41.67 100.00,58.33 62.51,55.18 91.25,79.46 79.46,91.25 55.18,62.51 58.33,100.00 41.67,100.00 44.82,62.51 20.54,91.25 8.75,79.46 37.49,55.18 0.00,58.33 0.00,41.67 37.49,44.82 8.75,20.54 20.54,8.75 44.82,37.49 41.67,0.00";

/** Perimeter in the 0-100 box, for stroke-dash draw-on animations. */
export const ASTERISK_PERIMETER = 735.3342;
