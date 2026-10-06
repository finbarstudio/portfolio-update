/**
 * fit — how a piece of media sits inside the phone's screen rectangle.
 *
 * Two representations of the same cover/contain/stretch math:
 *  - `computeFit()`  → a UV repeat/offset crop, used by the **video** texture
 *    path (no per-frame canvas copy; the GPU samples a sub-rect).
 *  - `fitRect()`     → a `drawImage` source/destination tuple, used by the
 *    **image** path (composited once onto a screen-aspect canvas, so `contain`
 *    can paint real letterbox bars — which a pure UV crop can't).
 */

import type { FitMode } from "@/components/phone/phone-config";

export type UVTransform = { repeat: [number, number]; offset: [number, number] };

/**
 * UV crop for sampling `mediaW×mediaH` media onto a screen of aspect
 * `screenAspect` (= screenW / screenH). Returns the pre-mirror crop; the texture
 * factory composes it with the screen mesh's horizontal mirror.
 *
 *  - stretch: fill, distort (identity crop).
 *  - cover:   fill, centre-crop the overflow (repeat ≤ 1).
 *  - contain: show all, repeat > 1 (UV samples outside [0,1] — clamps at edges;
 *             the image path uses `fitRect` instead so bars render properly).
 */
export function computeFit(
  mediaW: number,
  mediaH: number,
  screenAspect: number,
  mode: FitMode,
): UVTransform {
  if (mode === "stretch" || !mediaW || !mediaH || !Number.isFinite(screenAspect) || screenAspect <= 0) {
    return { repeat: [1, 1], offset: [0, 0] };
  }
  const mediaAspect = mediaW / mediaH;

  if (mode === "cover") {
    if (mediaAspect > screenAspect) {
      const rx = screenAspect / mediaAspect; // crop the width
      return { repeat: [rx, 1], offset: [(1 - rx) / 2, 0] };
    }
    const ry = mediaAspect / screenAspect;   // crop the height
    return { repeat: [1, ry], offset: [0, (1 - ry) / 2] };
  }

  // contain
  if (mediaAspect > screenAspect) {
    const ry = mediaAspect / screenAspect;   // > 1, bars top/bottom
    return { repeat: [1, ry], offset: [0, (1 - ry) / 2] };
  }
  const rx = screenAspect / mediaAspect;     // > 1, bars left/right
  return { repeat: [rx, 1], offset: [(1 - rx) / 2, 0] };
}

export type DrawRect = {
  sx: number; sy: number; sw: number; sh: number;
  dx: number; dy: number; dw: number; dh: number;
};

/**
 * `drawImage` source/destination rectangle to paint `srcW×srcH` media into a
 * `dstW×dstH` canvas under the given fit mode. With `contain`, the destination
 * is inset (leaving bars the caller can pre-fill); with `cover`, the source is
 * inset (cropping the overflow); `stretch` maps full→full.
 */
export function fitRect(
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
  mode: FitMode,
): DrawRect {
  const full = { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: 0, dy: 0, dw: dstW, dh: dstH };
  if (mode === "stretch" || !srcW || !srcH) return full;

  const srcAspect = srcW / srcH;
  const dstAspect = dstW / dstH;

  if (mode === "cover") {
    if (srcAspect > dstAspect) {
      const sw = srcH * dstAspect;           // crop source width
      return { sx: (srcW - sw) / 2, sy: 0, sw, sh: srcH, dx: 0, dy: 0, dw: dstW, dh: dstH };
    }
    const sh = srcW / dstAspect;             // crop source height
    return { sx: 0, sy: (srcH - sh) / 2, sw: srcW, sh, dx: 0, dy: 0, dw: dstW, dh: dstH };
  }

  // contain
  if (srcAspect > dstAspect) {
    const dh = dstW / srcAspect;             // bars top/bottom
    return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: 0, dy: (dstH - dh) / 2, dw: dstW, dh };
  }
  const dw = dstH * srcAspect;               // bars left/right
  return { sx: 0, sy: 0, sw: srcW, sh: srcH, dx: (dstW - dw) / 2, dy: 0, dw, dh: dstH };
}
