"use client";

/**
 * usePhoneTextures — builds one screen texture per media item, for both videos
 * and images, and returns a descriptor the engine drives per frame.
 *
 * VIDEO path is preserved verbatim from the original PhoneCarousel: lazy `src`
 * (decoder budget), `THREE.VideoTexture`, `flipY=false`, `repeat(-1,1)`,
 * `offset(1,0)`, per-frame `needsUpdate` only while playing, and the on/off-stage
 * lifecycle. This is what keeps TMYR identical — the engine calls `sync()`/`tick()`
 * with the same conditions the inline loop used.
 *
 * IMAGE path: the image is composited once onto a screen-aspect canvas (so
 * cover/contain/stretch — including real letterbox bars — are honoured), wrapped
 * in a `CanvasTexture` with the same SRGB + mirror/flip params, and uploaded
 * once (no per-frame cost). Re-composited only when `fit`/background changes.
 */

import { useEffect, useMemo } from "react";
import * as THREE from "three";

import {
  PHONE_SCREEN_ASPECT,
  type FitMode,
  type PhoneMediaItem,
} from "./phone-config";
import { fitRect } from "@/lib/sandbox/fit";

export type PhoneTextureDescriptor = {
  kind: "video" | "image";
  src: string;
  texture: THREE.Texture;
  video: HTMLVideoElement | null;
  /** Whether the screen has a frame ready to show (video decoded / image loaded). */
  hasFrame: () => boolean;
  /** Mark the texture dirty if its video is actively playing (no-op for images). */
  tick: () => void;
  /** Drive the per-frame video lifecycle (attach/detach src, play/pause). */
  sync: (onScreen: boolean, onStage: boolean, paused: boolean) => void;
  /** Pause the underlying video (no-op for images). */
  pauseVideo: () => void;
  /** Re-paint the image at the current fit/background (no-op for videos). */
  recompose: (fit: FitMode, bgColor: string | null) => void;
  dispose: () => void;
};

const mediaKey = (media: PhoneMediaItem[]) =>
  media.map((m) => `${m.kind}:${m.src}`).join("|");

/** Apply the screen mesh's horizontal mirror (repeat.x=-1, offset.x=1) on top of
 *  an optional UV crop. The original video used the identity crop → base mirror. */
function applyMirror(tex: THREE.Texture, crop = { repeat: [1, 1], offset: [0, 0] } as const) {
  const [rx, ry] = crop.repeat;
  const [ox, oy] = crop.offset;
  // tc.x = mirror(crop): final repeat.x = -rx, offset.x = rx + ox  (base = -1, 1)
  tex.repeat.set(-rx, ry);
  tex.offset.set(rx + ox, oy);
}

function makeVideoDescriptor(src: string): PhoneTextureDescriptor {
  const el = document.createElement("video");
  el.muted = true;
  el.loop = true;
  el.playsInline = true;
  el.preload = "none";
  el.setAttribute("playsinline", "");
  el.setAttribute("muted", "");
  // No src yet — attached lazily in sync() to stay within the decoder budget.

  const tex = new THREE.VideoTexture(el);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.flipY = false; // VP9 frames are top-to-bottom; flipY=true would invert
  applyMirror(tex); // repeat(-1,1) offset(1,0) — correct the mesh UV mirror

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
      if (onScreen) {
        if (el.getAttribute("src") !== src) {
          el.src = src;
          el.load();
        }
        if (onStage && !paused) {
          if (el.paused) el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      } else {
        if (!el.paused) el.pause();
        if (el.getAttribute("src")) {
          el.removeAttribute("src");
          el.load();
        }
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
      tex.dispose();
    },
  };
}

function makeImageDescriptor(src: string): PhoneTextureDescriptor {
  // Composite the image onto a screen-aspect canvas. Height fixed; width from
  // the phone screen aspect. Re-painted on fit/background change.
  const H = 1024;
  const W = Math.max(2, Math.round(H * PHONE_SCREEN_ASPECT));
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.flipY = false; // canvas is top-to-bottom, same as the video path
  applyMirror(tex);

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
      // Letterbox bars take the background (a real screen can't be transparent).
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

export function usePhoneTextures(
  media: PhoneMediaItem[],
  fit: FitMode,
  bgColor: string | null,
): PhoneTextureDescriptor[] {
  const key = mediaKey(media);

  const descriptors = useMemo(() => {
    if (typeof document === "undefined") return [] as PhoneTextureDescriptor[];
    return media.map((m) =>
      m.kind === "video" ? makeVideoDescriptor(m.src) : makeImageDescriptor(m.src),
    );
    // Rebuilt only when the media set changes (not on fit/bg — handled below).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Re-composite images whenever fit or background changes (cheap, one upload).
  useEffect(() => {
    descriptors.forEach((d) => d.recompose(fit, bgColor));
  }, [descriptors, fit, bgColor]);

  // Dispose textures + video elements when the media set changes / on unmount.
  useEffect(() => {
    return () => descriptors.forEach((d) => d.dispose());
  }, [descriptors]);

  return descriptors;
}
