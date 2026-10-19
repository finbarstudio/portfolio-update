/**
 * The subject of a photo, cut out elsewhere (Paint's "Remove background",
 * Photoshop, the cut-out bank) and brought in as a PNG with a transparent
 * background. The line passes behind it, in front of it, or is brushed over it.
 *
 * In-browser cut-out models were tried and dropped (19 Oct 2026): MODNet and
 * MediaPipe were too rough, BiRefNet and BEN2 too big or refused by the GPU,
 * RMBG not licensed for commercial use.
 */

/** The cut-out stretched over the background photo (it should be the same picture). */
export function makeSubject(png: CanvasImageSource, width: number, height: number): HTMLCanvasElement {
  const layer = document.createElement("canvas");
  layer.width = width;
  layer.height = height;
  layer.getContext("2d")!.drawImage(png, 0, 0, width, height);
  return layer;
}

/** Whether an image has see-through pixels, i.e. is a cut-out rather than a photo. */
export function hasTransparency(img: ImageBitmap): boolean {
  const c = document.createElement("canvas");
  c.width = Math.min(256, img.width);
  c.height = Math.max(1, Math.round((img.height * c.width) / img.width));
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0, c.width, c.height);
  const px = ctx.getImageData(0, 0, c.width, c.height).data;
  for (let i = 3; i < px.length; i += 4) if (px[i] < 250) return true;
  return false;
}
