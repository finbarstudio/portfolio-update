"use client";

/**
 * useMockupExport — drives the imperative PhoneScene controller frame-by-frame to
 * produce every MVP export: PNG still, one-still-per-item, perfect-loop video, and
 * GIF. All exports composite through one shared 2D canvas:
 *
 *   setOffset/setHover → invalidate → await 2 rAFs (demand-render paints) →
 *   fill background (or keep alpha) → drawImage(gl) → drawWatermark
 *
 * Every frame carries the finbar.studio watermark (`WATERMARK`) — that's the
 * standing monetization seam; resolution itself is free (SD/HD/UHD). Progress
 * lives in a ref and is synced to state on a timer (never per frame), and a
 * `cancelled` ref lets the user abort cleanly between frames.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import type { PhoneSceneController } from "@/components/phone/PhoneScene";
import type { FitMode } from "@/components/phone/phone-config";
import { loopSeconds } from "@/components/phone/phone-config";
import type { MediaAsset } from "./media";
import { drawWatermark } from "./watermark";
import { downloadBlob, safeName } from "./download";
import { renderStillBlob } from "./export-still";
import { recordLoop, canExportVideo } from "./export-video";
import { encodeGif } from "./export-gif";

/**
 * The watermark is always drawn — every export carries the finbar.studio mark
 * regardless of resolution. (Removing it is the future paid unlock.)
 */
const WATERMARK = true;

/**
 * Export resolution tiers (short-side px). SD is the quick/light option; HD and
 * UHD are full-quality. All tiers are free and watermarked.
 */
export type QualityKey = "sd" | "hd" | "uhd";
const QUALITY_PX: Record<QualityKey, number> = { sd: 540, hd: 1080, uhd: 2160 };
const DEFAULT_QUALITY: QualityKey = "hd";
/** GIFs stay small regardless of tier (palette + file size). */
const GIF_BASE = 360;

/** Opaque matte for video/GIF when the chosen background is transparent. */
const MATTE = "#FAFAF8";

export type ExportConfig = {
  media: MediaAsset[];
  /** The pose blend captured in the export (phone: from the Angle slider; mac:
   *  1 for flat, 0 otherwise). */
  poseHover: number;
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
  quality: QualityKey;
  setQuality: (q: QualityKey) => void;
  exportStill: (focusIndex: number) => void;
  exportAllStills: () => void;
  exportVideo: (loops?: number) => void;
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

  // Export resolution. Held in a ref too so the (stable) export callbacks read
  // the current tier at call time without churning their dependency arrays.
  const [quality, setQualityState] = useState<QualityKey>(DEFAULT_QUALITY);
  const qualityRef = useRef<QualityKey>(DEFAULT_QUALITY);
  const setQuality = useCallback((q: QualityKey) => {
    qualityRef.current = q;
    setQualityState(q);
  }, []);
  const tierPx = () => QUALITY_PX[qualityRef.current];

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
        if (WATERMARK) drawWatermark(ctx, w, h);
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

  const baseName = (config: ExportConfig) => safeName(config.media[0]?.name ?? "phone-mockup");

  const exportStill = useCallback(
    (focusIndex: number) => {
      void withExport("Rendering still…", async () => {
        const config = getConfig();
        const { w, h } = resolutionFor(config.aspect, tierPx());
        const bgColor = config.background === "transparent" ? null : config.background;
        const { canvas, draw } = makeRenderer(w, h, bgColor);
        const offset = controllerRef.current?.offsetForFocus(focusIndex) ?? focusIndex;
        const blob = await renderStillBlob(canvas, draw, offset, config.poseHover);
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
      const { w, h } = resolutionFor(config.aspect, tierPx());
      const bgColor = config.background === "transparent" ? null : config.background;
      const { canvas, draw } = makeRenderer(w, h, bgColor);
      const n = config.media.length;
      const hover = config.poseHover;
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

  const exportVideo = useCallback((loops: number = 1) => {
    void withExport("Rendering video…", async () => {
      if (!videoSupported) {
        throw new Error("Video export isn’t supported in this browser — try Chrome, or export a GIF.");
      }
      const config = getConfig();
      const { w, h } = resolutionFor(config.aspect, tierPx());
      const matte = config.background === "transparent" ? MATTE : config.background;
      const { canvas, draw } = makeRenderer(w, h, matte);
      const ctrl = controllerRef.current;
      if (!ctrl) throw new Error("The mockup isn’t ready yet.");
      const period = ctrl.numPhones;
      const res = await recordLoop({
        canvas,
        draw,
        period,
        hover: config.poseHover,
        fps: 30,
        durationMs: loopSeconds(period, ctrl.cycleSpeed) * 1000,
        loops: Math.max(1, Math.round(loops)),
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
      const frames = Math.max(8, Math.round(loopSeconds(period, ctrl.cycleSpeed) * fps));
      const blob = await encodeGif({
        canvas,
        draw,
        period,
        hover: config.poseHover,
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
    quality,
    setQuality,
    exportStill,
    exportAllStills,
    exportVideo,
    exportGif,
    cancel,
  };
}
