/**
 * export-gif — animated GIF of the loop. Same deterministic offset sweep as the
 * video, at a lower fps + reduced size. `gifenc` is dynamically imported here so
 * it only enters the bundle when the user actually exports a GIF.
 *
 * GIF has no alpha gradient, so frames must be flattened to an opaque matte (the
 * caller composites an opaque background before this runs).
 */

// Minimal local typing so the build doesn't depend on the package's own types.
type Gifenc = {
  GIFEncoder: () => {
    writeFrame: (
      index: Uint8Array,
      width: number,
      height: number,
      opts: { palette: number[][]; delay?: number },
    ) => void;
    finish: () => void;
    bytes: () => Uint8Array;
  };
  quantize: (rgba: Uint8ClampedArray | Uint8Array, maxColors: number) => number[][];
  applyPalette: (rgba: Uint8ClampedArray | Uint8Array, palette: number[][]) => Uint8Array;
};

const yieldTick = () => new Promise<void>((r) => setTimeout(r, 0));

export type EncodeGifOptions = {
  canvas: HTMLCanvasElement;
  draw: (offset: number, hover: number) => Promise<void>;
  period: number;
  hover: number;
  fps: number;
  frames: number;
  onProgress?: (p: number) => void;
  shouldCancel?: () => boolean;
};

export async function encodeGif(opts: EncodeGifOptions): Promise<Blob | null> {
  const { canvas, draw, period, hover, fps, frames, onProgress, shouldCancel } = opts;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const { GIFEncoder, quantize, applyPalette } = (await import("gifenc")) as unknown as Gifenc;
  const gif = GIFEncoder();
  const delayMs = Math.round(1000 / fps);

  for (let f = 0; f < frames; f++) {
    if (shouldCancel?.()) break;
    const offset = (f / frames) * period;
    await draw(offset, hover);
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);
    gif.writeFrame(index, width, height, { palette, delay: delayMs });
    onProgress?.(f / frames);
    await yieldTick();
  }

  gif.finish();
  onProgress?.(1);
  return new Blob([gif.bytes() as unknown as BlobPart], { type: "image/gif" });
}
