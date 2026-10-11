"use client";

import { useProgress } from "@react-three/drei/core/Progress";
import { Canvas } from "@react-three/fiber";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import { createRuntime } from "./runtime";
import { StudioScene } from "./scene";

/** Space kept free around the frame, in CSS pixels. */
const FRAME_PADDING = 24;

// Hoisted so the canvas never sees a "new" config object and re-applies it.
const GL_PROPS = { preserveDrawingBuffer: true, alpha: true, antialias: true };

/** Most pixels the preview draws per frame. Past this the lens and depth of field passes make playback stutter. */
const SHARP_PIXELS = 6_000_000;
/** The budget for the fast preview: about a 1080p frame. */
const FAST_PIXELS = 2_000_000;

/**
 * How many buffer pixels to draw per CSS pixel. Ideally more than the screen has (one and a half times its ratio,
 * between 2 and 3), which is what makes edges crisp. But a full-screen frame at that density is tens of millions of
 * pixels, so the ratio comes down as the frame grows to stay inside a pixel budget, and further for the fast
 * preview. Export sizes its own buffer and ignores all of this.
 */
function renderRatio(width: number, height: number, fast: boolean): number {
  const screen = typeof window === "undefined" ? 1 : window.devicePixelRatio;
  const ideal = fast ? 1 : Math.min(3, Math.max(2, screen * 1.5));
  const budget = fast ? FAST_PIXELS : SHARP_PIXELS;
  const fits = Math.sqrt(budget / Math.max(1, width * height));
  return Math.max(0.5, Math.min(ideal, fits));
}

function screenRatio(): number {
  return typeof window === "undefined" ? 1 : window.devicePixelRatio;
}
const CAMERA_PROPS = {
  fov: 50,
  near: 0.05,
  far: 100,
  position: [0, 0, 5] as [number, number, number],
};

/** Shows through the canvas when the background is transparent. */
const CHECKER: CSSProperties = {
  backgroundColor: "#1c1c1c",
  backgroundImage:
    "repeating-conic-gradient(#262626 0% 25%, transparent 0% 50%)",
  backgroundSize: "16px 16px",
};

/**
 * Safe zones, shown over the preview only. Tall canvases get the areas a reel or story covers with its own interface
 * (top bar, caption and buttons); other shapes get a plain margin and centre lines.
 */
function Guides({ tall }: { tall: boolean }) {
  const line = "absolute border-dashed border-white/50";
  return (
    <div className="pointer-events-none absolute inset-0 text-[10px] text-white/60">
      {tall ? (
        <>
          <div
            className={`${line} inset-x-0 top-0 h-[12%] border-b bg-black/25`}
          >
            <span className="absolute bottom-1 left-2">Top bar</span>
          </div>
          <div
            className={`${line} inset-x-0 bottom-0 h-[22%] border-t bg-black/25`}
          >
            <span className="absolute left-2 top-1">Caption and buttons</span>
          </div>
          <div
            className={`${line} right-0 top-[12%] bottom-[22%] w-[14%] border-l bg-black/15`}
          />
        </>
      ) : (
        <>
          <div className={`${line} inset-[5%] border`} />
          <div className={`${line} inset-y-0 left-1/2 border-l`} />
          <div className={`${line} inset-x-0 top-1/2 border-t`} />
        </>
      )}
    </div>
  );
}

/** Shown while a model, environment or other large file is on its way in. */
function LoadingOverlay() {
  const active = useProgress((s) => s.active);
  const progress = useProgress((s) => s.progress);
  if (!active) return null;
  return (
    <output className="pointer-events-none absolute inset-0 grid place-items-center bg-ms-canvas/60">
      <div className="flex w-40 flex-col items-center gap-2 text-ms-ink-muted">
        <span className="size-5 animate-spin rounded-full border-2 border-ms-line border-t-ink motion-reduce:animate-none" />
        <span className="tabular-nums">Loading {Math.round(progress)}%</span>
        <span className="h-0.5 w-full overflow-hidden rounded-full bg-ms-line">
          <span
            className="block h-full origin-left bg-ms-ink transition-transform"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </span>
      </div>
    </output>
  );
}

export function Viewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState({ width: 0, height: 0 });
  const [runtime] = useState(createRuntime);
  const composition = useStudio((s) => s.composition);
  const transparent = useStudio((s) => s.background.transparent);
  const guides = useStudio((s) => s.guides);
  const fastPreview = useStudio((s) => s.fastPreview);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) setAvailable({ width: box.width, height: box.height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Largest frame with the composition's aspect ratio that fits the free space.
  const fit = Math.min(
    Math.max(0, available.width - FRAME_PADDING * 2) / composition.width,
    Math.max(0, available.height - FRAME_PADDING * 2) / composition.height,
  );
  const frameWidth = Math.floor(composition.width * fit);
  const frameHeight = Math.floor(composition.height * fit);
  const ratio = renderRatio(frameWidth, frameHeight, fastPreview);
  // Below the screen's own density the preview is visibly softer than the export will be, which is worth saying.
  const reduced = ratio < screenRatio() - 0.05;

  return (
    <div
      ref={containerRef}
      className="relative flex size-full items-center justify-center overflow-hidden"
    >
      {frameWidth > 0 && frameHeight > 0 && (
        <div
          className="relative shrink-0 overflow-hidden rounded-ms-control"
          style={{
            width: frameWidth,
            height: frameHeight,
            ...(transparent ? CHECKER : undefined),
          }}
        >
          <Canvas
            className="absolute inset-0"
            flat
            dpr={ratio}
            shadows="soft"
            gl={GL_PROPS}
            camera={CAMERA_PROPS}
          >
            <StudioScene runtime={runtime} />
          </Canvas>
          <LoadingOverlay />
          {reduced ? (
            <p className="pointer-events-none absolute top-2 right-2 rounded-full bg-ms-panel/80 px-2.5 py-1 text-[11px] text-ms-ink-muted backdrop-blur-md">
              Preview at {Math.round((ratio / screenRatio()) * 100)}%
              resolution. Export is full quality.
            </p>
          ) : null}
          {guides ? (
            <Guides tall={composition.height > composition.width} />
          ) : null}
          {/* Drawn over the canvas so the outline does not eat into the rendered area. */}
          <div className="pointer-events-none absolute inset-0 rounded-ms-control border border-ms-line" />
        </div>
      )}
    </div>
  );
}
