"use client";

/**
 * useMacTextures — one screen texture per media item for the Studio Display.
 *
 * Same shape + lifecycle as `usePhoneTextures` (videos lazily attach/detach to
 * stay within the decoder budget; images composite once onto a screen-aspect
 * canvas so cover/contain/stretch — including real letterbox bars — are honoured),
 * but tuned for the Mac's GLTF: a landscape 16:9 screen, default flipY (this model's
 * MOCKUP/Glass UVs map upright with flipY=true), and no horizontal mirror.
 */

import { useEffect, useMemo } from "react";
import * as THREE from "three";

import { MAC_SCREEN_ASPECT, type FitMode, type MacMediaItem } from "./mac-config";
import { fitRect } from "@/lib/sandbox/fit";

export type MacTextureDescriptor = {
  kind: "video" | "image";
  src: string;
  texture: THREE.Texture;
  video: HTMLVideoElement | null;
  hasFrame: () => boolean;
  tick: () => void;
  sync: (onScreen: boolean, onStage: boolean, paused: boolean) => void;
  pauseVideo: () => void;
  recompose: (fit: FitMode, bgColor: string | null) => void;
  dispose: () => void;
};

const mediaKey = (media: MacMediaItem[]) => media.map((m) => `${m.kind}:${m.src}`).join("|");

function makeVideoDescriptor(src: string): MacTextureDescriptor {
  const el = document.createElement("video");
  el.muted = true;
  el.loop = true;
  el.playsInline = true;
  el.preload = "auto";
  el.setAttribute("playsinline", "");
  el.setAttribute("muted", "");
  el.crossOrigin = "anonymous";
  // The single Studio Display shows one screen at a time, so — unlike the off-stage
  // phones — videos must stay decoded: a multi-item slideshow that detached/reattached
  // the src each cycle never held the element long enough to decode a frame (it just
  // showed black). The Mac tool has at most a handful of items, so each video is kept
  // resident and merely paused/played. Several browsers also won't decode frames for a
  // WebGL texture unless the <video> is in the DOM, so keep it attached but off-screen.
  el.style.cssText =
    "position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0;pointer-events:none;";
  el.src = src;
  if (typeof document !== "undefined" && document.body) document.body.appendChild(el);
  el.load();

  const tex = new THREE.VideoTexture(el);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  // Default flipY (true) — matches the studio-display MOCKUP UVs (same as ModelDisplay).

  return {
    kind: "video",
    src,
    texture: tex,
    video: el,
    hasFrame: () => el.readyState >= 2,
    tick: () => {
      if (!el.paused && el.readyState >= 2) tex.needsUpdate = true;
    },
    sync: (onScreen, onStage, paused) => {
      // Keep the src resident (decoded); just play the on-screen item and hold
      // every other one on its current frame.
      if (onScreen && onStage && !paused) {
        if (el.paused) el.play().catch(() => {});
      } else if (!el.paused) {
        el.pause();
      }
    },
    pauseVideo: () => {
      if (!el.paused) el.pause();
    },
    recompose: () => {},
    dispose: () => {
      el.pause();
      el.src = "";
      el.removeAttribute("src");
      el.load();
      if (el.parentNode) el.parentNode.removeChild(el);
      tex.dispose();
    },
  };
}

function makeImageDescriptor(src: string): MacTextureDescriptor {
  // Composite onto a 16:9 screen-aspect canvas. Width fixed; height from aspect.
  const W = 1280;
  const H = Math.max(2, Math.round(W / MAC_SCREEN_ASPECT));
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  // Default flipY (true) — match the video path on this model.

  const img = new Image();
  img.decoding = "async";
  img.crossOrigin = "anonymous";
  let loaded = false;
  let lastFit: FitMode = "cover";
  let lastBg: string | null = null;

  const paint = () => {
    if (!ctx || !loaded) return;
    ctx.clearRect(0, 0, W, H);
    if (lastFit === "contain") {
      ctx.fillStyle = lastBg ?? "#000";
      ctx.fillRect(0, 0, W, H);
    }
    const r = fitRect(img.naturalWidth, img.naturalHeight, W, H, lastFit);
    ctx.drawImage(img, r.sx, r.sy, r.sw, r.sh, r.dx, r.dy, r.dw, r.dh);
    tex.needsUpdate = true;
  };

  img.onload = () => {
    loaded = true;
    paint();
  };
  img.src = src;

  return {
    kind: "image",
    src,
    texture: tex,
    video: null,
    hasFrame: () => loaded,
    tick: () => {},
    sync: () => {},
    pauseVideo: () => {},
    recompose: (fit, bgColor) => {
      lastFit = fit;
      lastBg = bgColor;
      paint();
    },
    dispose: () => {
      img.onload = null;
      img.src = "";
      tex.dispose();
    },
  };
}

export function useMacTextures(
  media: MacMediaItem[],
  fit: FitMode,
  bgColor: string | null,
): MacTextureDescriptor[] {
  const key = mediaKey(media);

  const descriptors = useMemo(() => {
    if (typeof document === "undefined") return [] as MacTextureDescriptor[];
    return media.map((m) =>
      m.kind === "video" ? makeVideoDescriptor(m.src) : makeImageDescriptor(m.src),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    descriptors.forEach((d) => d.recompose(fit, bgColor));
  }, [descriptors, fit, bgColor]);

  useEffect(() => {
    return () => descriptors.forEach((d) => d.dispose());
  }, [descriptors]);

  return descriptors;
}
