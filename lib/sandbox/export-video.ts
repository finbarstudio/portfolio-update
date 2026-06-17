/**
 * export-video — record a perfect-loop opaque video from the deterministic
 * carousel. The offset is swept by REAL elapsed time across `loops` full periods,
 * so the encoded video's duration matches the wall-clock we run (no drift) and it
 * ends exactly where it began (offset ≡ 0) for a seamless loop. We capture via
 * `captureStream(fps)` (the browser samples the canvas) rather than wall-clock
 * frame stepping, which previously made the file ~2× too long.
 *
 * MP4/avc1 is preferred; WebM/vp9 is the fallback. Opaque only in MVP.
 */

export type VideoCodec = { mimeType: string; ext: "mp4" | "webm" };

const CANDIDATES: VideoCodec[] = [
  { mimeType: "video/mp4;codecs=avc1", ext: "mp4" },
  { mimeType: "video/mp4", ext: "mp4" },
  { mimeType: "video/webm;codecs=vp9", ext: "webm" },
  { mimeType: "video/webm;codecs=vp8", ext: "webm" },
  { mimeType: "video/webm", ext: "webm" },
];

/** The first MediaRecorder codec this browser supports, or null (e.g. Safari). */
export function pickVideoCodec(): VideoCodec | null {
  if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) return null;
  return CANDIDATES.find((c) => MediaRecorder.isTypeSupported(c.mimeType)) ?? null;
}

export function canExportVideo(): boolean {
  return pickVideoCodec() !== null && typeof HTMLCanvasElement.prototype.captureStream === "function";
}

export type RecordLoopOptions = {
  canvas: HTMLCanvasElement;
  /** Seek + composite one frame into `canvas`. */
  draw: (offset: number, hover: number) => Promise<void>;
  /** Carousel period in offset units (= phone count) for ONE loop. */
  period: number;
  /** Hover/pose blend held constant across the loop. */
  hover: number;
  fps: number;
  /** Duration of a single loop, ms. */
  durationMs: number;
  /** How many seamless loops to record (≥ 1). */
  loops: number;
  onProgress?: (p: number) => void;
  shouldCancel?: () => boolean;
};

export async function recordLoop(opts: RecordLoopOptions): Promise<{ blob: Blob; ext: string } | null> {
  const codec = pickVideoCodec();
  if (!codec) return null;

  const { canvas, draw, period, hover, fps, durationMs, onProgress, shouldCancel } = opts;
  const loops = Math.max(1, Math.round(opts.loops));
  const totalMs = Math.max(1000, durationMs * loops);

  // Warm up the pipeline (decoders + GL) so the opening second isn't janky.
  for (let i = 0; i < 6; i++) await draw((i / 6) * period, hover);
  await draw(0, hover);

  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType: codec.mimeType,
    videoBitsPerSecond: 8_000_000,
  });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };
  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });

  recorder.start();
  const start = performance.now();

  await new Promise<void>((resolve) => {
    const tick = () => {
      if (shouldCancel?.()) return resolve();
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / totalMs, 1);
      // Sweep `loops` full periods so the end lands exactly on the start.
      const offset = t * period * loops;
      draw(offset, hover)
        .then(() => {
          onProgress?.(t);
          if (elapsed >= totalMs) resolve();
          else requestAnimationFrame(tick);
        })
        .catch(() => resolve());
    };
    requestAnimationFrame(tick);
  });

  recorder.stop();
  stream.getTracks().forEach((t) => t.stop());
  await stopped;
  onProgress?.(1);
  if (!chunks.length) return null;
  return { blob: new Blob(chunks, { type: codec.mimeType }), ext: codec.ext };
}
