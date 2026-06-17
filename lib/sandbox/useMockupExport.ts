"use client";

/**
 * useMockupExport — drives the imperative PhoneScene controller frame-by-frame to
 * produce every MVP export: PNG still, one-still-per-item, perfect-loop video, and
 * GIF. All exports composite through one shared 2D canvas:
 *
 *   setOffset/setHover → invalidate → await 2 rAFs (demand-render paints) →
 *   fill background (or keep alpha) → drawImage(gl) → drawWatermark
 *
 * The watermark is always drawn behind a single `LICENSED` gate — that's the whole
 * monetization seam (MVP is free, so `LICENSED = false`). Progress lives in a ref
 * and is synced to state on a timer (never per frame), and a `cancelled` ref lets
 * the user abort cleanly between frames.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import type { PhoneSceneController } from "@/components/phone/PhoneScene";
import type { AnimationPreset, FitMode } from "@/components/phone/phone-config";
import type { MediaAsset } from "./media";
import { drawWatermark } from "./watermark";
import { downloadBlob, safeName } from "./download";
import { renderStillBlob } from "./export-still";
import { recordLoop, canExportVideo } from "./export-video";
import { encodeGif } from "./export-gif";

/** MVP is free but always watermarked. The future license unlock flips this. */
const LICENSED = false;

/**
 * Export resolution tiers (short-side px). The free plan renders at SD; the
 * 1080 / 2K / 4K tiers unlock with payment (coming soon). Until then every
 * export uses FREE_TIER — flip `activeTier` to the paid value once licensed.
 */
const TIERS = { sd: 540, hd: 1080, "2k": 1440, "4k": 2160 } as const;
const FREE_TIER = TIERS.sd;
const activeTier: number = LICENSED ? TIERS.hd : FREE_TIER;
/** GIFs stay small regardless of tier (palette + file size). */
const GIF_BASE = 360;

/** Opaque matte for video/GIF when the chosen background is transparent. */
const MATTE = "#FAFAF8";

export type ExportConfig = {
  media: MediaAsset[];
  preset: AnimationPreset;
  fit: FitMode;
  aspect: string; // "9:16" | "1:1" | "16:9"
  background: string; // "transparent" | css color
};

type UseMockupExportArgs = {
  controllerRef: React.RefObject<PhoneSceneController | null>;
  setPaused: (paused: boolean) => void;
  getConfig: () => ExportConfig;
};

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function resolutionFor(aspect: string, base: number): { w: number; h: number } {
  const [aw, ah] = aspect.split(/[:/]/).map(Number);
  const ratio = aw && ah ? aw / ah : 16 / 9;
  let w: number;
  let h: number;
  if (ratio <= 1) {
    w = base;
    h = Math.round(base / ratio);
  } else {
    h = base;
    w = Math.round(base * ratio);
  }
  return { w: w - (w % 2), h: h - (h % 2) }; // even dims for encoders
}

export type MockupExport = {
  busy: boolean;
  progress: number;
  status: string;
  error: string | null;
  videoSupported: boolean;
  exportStill: (focusIndex: number) => void;
  exportAllStills: () => void;
  exportVideo: () => void;
  exportGif: () => void;
  cancel: () => void;
};

export function useMockupExport({ controllerRef, setPaused, getConfig }: UseMockupExportArgs): MockupExport {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const busyRef = useRef(false);
  const cancelledRef = useRef(false);
  const progressRef = useRef(0);

  // Optimistic on SSR + first client render (so hydration matches), then
  // corrected to the real capability after mount (MediaRecorder is client-only).
  const [videoSupported, setVideoSupported] = useState(true);
  useEffect(() => {
    setVideoSupported(canExportVideo());
  }, []);

  const onProgress = useCallback((p: number) => {
    progressRef.current = p;
  }, []);
  const shouldCancel = useCallback(() => cancelledRef.current, []);

  /** Build a compositing canvas + a per-frame `draw` that seeks and captures. */
  const makeRenderer = useCallback(
    (w: number, h: number, bgColor: string | null, readFrequently = false) => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: readFrequently });
      if (!ctx) throw new Error("Could not create an export canvas.");

      const draw = async (offset: number, hover: number) => {
        const ctrl = controllerRef.current;
        if (!ctrl) throw new Error("The mockup isn’t ready yet.");
        ctrl.setHover(hover);
        ctrl.setOffset(offset);
        ctrl.invalidate();
        await nextFrame();
        await nextFrame();
        if (bgColor) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, w, h);
        } else {
          ctx.clearRect(0, 0, w, h);
        }
        ctx.drawImage(ctrl.gl.domElement, 0, 0, w, h);
        if (!LICENSED) drawWatermark(ctx, w, h);
      };

      return { canvas, draw };
    },
    [controllerRef],
  );

  const withExport = useCallback(
    async (label: string, fn: () => Promise<void>) => {
      if (busyRef.current) return;
      busyRef.current = true;
      cancelledRef.current = false;
      progressRef.current = 0;
      setBusy(true);
      setError(null);
      setStatus(label);
      setProgress(0);

      const tick = setInterval(() => setProgress(progressRef.current), 100);
      setPaused(true);
      // Let the engine enter paused mode before we start seeking frames.
      await nextFrame();
      await nextFrame();
      await nextFrame();

      try {
        await fn();
      } catch (e) {
        if (!cancelledRef.current) {
          setError(e instanceof Error ? e.message : "Export failed.");
        }
      } finally {
        clearInterval(tick);
        setPaused(false);
        busyRef.current = false;
        setBusy(false);
        setStatus("");
        setProgress(0);
      }
    },
    [setPaused],
  );

  const hoverFor = (preset: AnimationPreset) => (preset === "flat" ? 1 : 0);
  const baseName = (config: ExportConfig) => safeName(config.media[0]?.name ?? "phone-mockup");

  const exportStill = useCallback(
    (focusIndex: number) => {
      void withExport("Rendering still…", async () => {
        const config = getConfig();
        const { w, h } = resolutionFor(config.aspect, activeTier);
        const bgColor = config.background === "transparent" ? null : config.background;
        const { canvas, draw } = makeRenderer(w, h, bgColor);
        const offset = controllerRef.current?.offsetForFocus(focusIndex) ?? focusIndex;
        const blob = await renderStillBlob(canvas, draw, offset, hoverFor(config.preset));
        if (cancelledRef.current || !blob) return;
        downloadBlob(blob, `${baseName(config)}-still.png`);
        progressRef.current = 1;
      });
    },
    [withExport, getConfig, makeRenderer, controllerRef],
  );

  const exportAllStills = useCallback(() => {
    void withExport("Rendering stills…", async () => {
      const config = getConfig();
      const { w, h } = resolutionFor(config.aspect, activeTier);
      const bgColor = config.background === "transparent" ? null : config.background;
      const { canvas, draw } = makeRenderer(w, h, bgColor);
      const n = config.media.length;
      const hover = hoverFor(config.preset);
      for (let i = 0; i < n; i++) {
        if (cancelledRef.current) break;
        const offset = controllerRef.current?.offsetForFocus(i) ?? i;
        const blob = await renderStillBlob(canvas, draw, offset, hover);
        if (blob) downloadBlob(blob, `${baseName(config)}-${i + 1}.png`);
        progressRef.current = (i + 1) / n;
        await delay(250); // space the downloads so the browser doesn't block them
      }
    });
  }, [withExport, getConfig, makeRenderer, controllerRef]);

  const exportVideo = useCallback(() => {
    void withExport("Rendering video…", async () => {
      if (!videoSupported) {
        throw new Error("Video export isn’t supported in this browser — try Chrome, or export a GIF.");
      }
      const config = getConfig();
      const { w, h } = resolutionFor(config.aspect, activeTier);
      const matte = config.background === "transparent" ? MATTE : config.background;
      const { canvas, draw } = makeRenderer(w, h, matte);
      const ctrl = controllerRef.current;
      if (!ctrl) throw new Error("The mockup isn’t ready yet.");
      const period = ctrl.numPhones;
      const fps = 30;
      const naturalDur = period / ctrl.cycleSpeed;
      const dur = Math.min(Math.max(naturalDur, 4), 8);
      const frames = Math.round(dur * fps);
      const res = await recordLoop({
        canvas,
        draw,
        period,
        hover: hoverFor(config.preset),
        fps,
        frames,
        onProgress,
        shouldCancel,
      });
      if (cancelledRef.current || !res) return;
      downloadBlob(res.blob, `${baseName(config)}-loop.${res.ext}`);
    });
  }, [withExport, getConfig, makeRenderer, controllerRef, videoSupported, onProgress, shouldCancel]);

  const exportGif = useCallback(() => {
    void withExport("Encoding GIF…", async () => {
      const config = getConfig();
      const { w, h } = resolutionFor(config.aspect, GIF_BASE);
      const matte = config.background === "transparent" ? MATTE : config.background;
      const { canvas, draw } = makeRenderer(w, h, matte, true);
      const ctrl = controllerRef.current;
      if (!ctrl) throw new Error("The mockup isn’t ready yet.");
      const period = ctrl.numPhones;
      const fps = 12;
      const naturalDur = period / ctrl.cycleSpeed;
      const dur = Math.min(Math.max(naturalDur, 3), 5);
      const frames = Math.round(dur * fps);
      const blob = await encodeGif({
        canvas,
        draw,
        period,
        hover: hoverFor(config.preset),
        fps,
        frames,
        onProgress,
        shouldCancel,
      });
      if (cancelledRef.current || !blob) return;
      downloadBlob(blob, `${baseName(config)}-loop.gif`);
    });
  }, [withExport, getConfig, makeRenderer, controllerRef, onProgress, shouldCancel]);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
  }, []);

  return {
    busy,
    progress,
    status,
    error,
    videoSupported,
    exportStill,
    exportAllStills,
    exportVideo,
    exportGif,
    cancel,
  };
}
