import { totalDuration } from "@/lib/mockup-studio/scene/animation";
import { getRenderer } from "@/lib/mockup-studio/scene/bridge";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import { download, fileStamp } from "./download";
import { parseSceneDocument } from "./validate";

export interface ExportProgress {
  /** 0..1 */
  progress: number;
  stage: "rendering" | "finalizing";
}

export interface VideoExportOptions {
  fps: 30 | 60;
  /** Multiplier on the composition size. */
  scale: 0.5 | 1 | 2;
  onProgress?: (progress: ExportProgress) => void;
  signal?: AbortSignal;
}

/** Longest edge GPUs reliably allocate a drawing buffer for. */
const MAX_IMAGE_EDGE = 8192;
/** Scene files are small; this only stops a wrong file from being read into memory. */
const MAX_SCENE_FILE_BYTES = 64 * 1024 * 1024;
/** Bits per pixel per frame, a comfortable H.264 budget for flat-lit product shots. */
const BITS_PER_PIXEL = 0.12;
const MIN_BITRATE = 2_000_000;
const MAX_BITRATE = 80_000_000;

const even = (n: number) => Math.max(2, Math.round(n / 2) * 2);

function toPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("The browser could not encode the image")),
      "image/png",
    );
  });
}

/** Render the frame at the playhead and download it as a PNG. */
export async function exportImage(scale: 1 | 2 | 4 = 1): Promise<void> {
  const { composition, playhead } = useStudio.getState();
  const width = Math.round(composition.width * scale);
  const height = Math.round(composition.height * scale);
  if (width > MAX_IMAGE_EDGE || height > MAX_IMAGE_EDGE) {
    throw new Error(
      `A ${scale}x export would be ${width} x ${height}px, over the ${MAX_IMAGE_EDGE}px limit. Pick a smaller scale.`,
    );
  }

  const renderer = getRenderer();
  try {
    await renderer.beginExport(width, height);
    await renderer.renderAt(playhead);
    // No awaits between render and capture: a WebGL canvas may be cleared once the task ends.
    const blob = await toPngBlob(renderer.canvas);
    download(blob, `mockup-${fileStamp()}.png`);
  } finally {
    renderer.endExport();
  }
}

/** Render every frame of the timeline and download an MP4. */
export async function exportVideo({
  fps,
  scale,
  onProgress,
  signal,
}: VideoExportOptions): Promise<void> {
  if (typeof VideoEncoder === "undefined") {
    throw new Error(
      "This browser has no video encoder (WebCodecs). Use a recent Chrome, Edge or Safari for MP4 export.",
    );
  }

  const state = useStudio.getState();
  state.setPlaying(false);
  const previousPlayhead = state.playhead;
  const width = even(state.composition.width * scale);
  const height = even(state.composition.height * scale);
  const frameCount = Math.max(
    1,
    Math.ceil((totalDuration(state.shots) / 1000) * fps),
  );

  const {
    BufferTarget,
    CanvasSource,
    Mp4OutputFormat,
    Output,
    Quality,
    canEncodeVideo,
  } = await import("mediabunny");

  const bitrate = Math.min(
    MAX_BITRATE,
    Math.max(MIN_BITRATE, Math.round(width * height * fps * BITS_PER_PIXEL)),
  );
  const quality = new Quality({ bitrate });
  if (
    !(await canEncodeVideo("avc", { width, height, quality, frameRate: fps }))
  ) {
    throw new Error(
      `This browser cannot encode H.264 video at ${width} x ${height}. Try a smaller scale or a different browser.`,
    );
  }
  if (signal?.aborted) throw new DOMException("Export cancelled", "AbortError");

  const renderer = getRenderer();
  const target = new BufferTarget();
  const output = new Output({
    format: new Mp4OutputFormat({ fastStart: "in-memory" }),
    target,
  });
  try {
    await renderer.beginExport(width, height);
    if (renderer.canvas.width !== width || renderer.canvas.height !== height) {
      throw new Error(
        `The viewport could not size its canvas to ${width} x ${height}`,
      );
    }

    const source = new CanvasSource(renderer.canvas, { codec: "avc", quality });
    output.addVideoTrack(source, { frameRate: fps });
    await output.start();

    for (let i = 0; i < frameCount; i++) {
      if (signal?.aborted)
        throw new DOMException("Export cancelled", "AbortError");
      await renderer.renderAt((i * 1000) / fps);
      await source.add(i / fps, 1 / fps);
      onProgress?.({ progress: (i + 1) / frameCount, stage: "rendering" });
      // Let the browser paint progress; awaiting promises alone never yields to rendering.
      if (i % 8 === 7)
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }

    if (signal?.aborted)
      throw new DOMException("Export cancelled", "AbortError");
    source.close();
    onProgress?.({ progress: 1, stage: "finalizing" });
    await output.finalize();
    if (!target.buffer) throw new Error("The encoder produced no data");
    download(
      new Blob([target.buffer], { type: "video/mp4" }),
      `mockup-${fileStamp()}.mp4`,
    );
  } catch (error) {
    if (output.state !== "finalized" && output.state !== "canceled")
      await output.cancel().catch(() => {});
    throw error;
  } finally {
    renderer.endExport();
    useStudio.getState().setPlayhead(previousPlayhead);
  }
}

/** Download the scene as a .json file. */
export function saveSceneFile(): void {
  const json = JSON.stringify(useStudio.getState().toDocument(), null, 2);
  download(
    new Blob([json], { type: "application/json" }),
    `scene-${fileStamp()}.json`,
  );
}

/** Replace the scene with one read from a .json file. Throws if the file is not a valid scene. */
export async function loadSceneFile(file: File): Promise<void> {
  if (file.size > MAX_SCENE_FILE_BYTES)
    throw new Error("That file is too large to be a scene file.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error("Not a valid scene file: it is not readable JSON.");
  }
  useStudio.getState().loadDocument(parseSceneDocument(parsed));
}
