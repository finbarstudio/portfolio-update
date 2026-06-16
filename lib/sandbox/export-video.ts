/**
 * export-video — record a perfect-loop opaque video from the deterministic
 * carousel. We sweep the carousel offset across exactly one period over N frames
 * and DON'T render the duplicate final frame, so frame 0 (offset 0) is the seam:
 * first frame === loop point. Frames are pushed into a `captureStream(0)` track
 * via `requestFrame()` (frame-accurate, not wall-clock sampled).
 *
 * MP4/avc1 is preferred; WebM/vp9 is the fallback. Opaque only in MVP
 * (transparent video needs ffmpeg.wasm — v2).
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

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export type RecordLoopOptions = {
  canvas: HTMLCanvasElement;
  /** Seek + composite one frame into `canvas`. */
  draw: (offset: number, hover: number) => Promise<void>;
  /** Carousel period in offset units (= phone count). */
  period: number;
  /** Hover/preset blend held constant across the loop. */
  hover: number;
  fps: number;
  frames: number;
  onProgress?: (p: number) => void;
  shouldCancel?: () => boolean;
};

export async function recordLoop(opts: RecordLoopOptions): Promise<{ blob: Blob; ext: string } | null> {
  const codec = pickVideoCodec();
  if (!codec) return null;

  const { canvas, draw, period, hover, fps, frames, onProgress, shouldCancel } = opts;

  // Paint the first frame before wiring the recorder so the stream starts clean.
  await draw(0, hover);

  const stream = canvas.captureStream(0);
  const track = stream.getVideoTracks()[0] as CanvasCaptureMediaStreamTrack;
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
  const frameMs = 1000 / fps;

  try {
    for (let f = 0; f < frames; f++) {
      if (shouldCancel?.()) break;
      const offset = (f / frames) * period; // [0, period) — no duplicate seam frame
      await draw(offset, hover);
      track.requestFrame();
      onProgress?.(f / frames);
      await delay(frameMs);
    }
  } finally {
    recorder.stop();
    track.stop();
  }

  await stopped;
  onProgress?.(1);
  if (!chunks.length) return null;
  return { blob: new Blob(chunks, { type: codec.mimeType }), ext: codec.ext };
}
