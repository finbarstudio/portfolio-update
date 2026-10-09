"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Vector2 } from "three";
import { type RendererBridge, setRenderer } from "@/lib/mockup-studio/scene/bridge";
import type { ViewportRuntime } from "./runtime";

/** Give up waiting for a seek after this long, so a stalled video cannot hang an export. */
const SEEK_TIMEOUT_MS = 2000;

/** Seek `video` to the loop position matching global time `ms` and resolve once that frame is ready to draw. */
function seekVideo(video: HTMLVideoElement, ms: number): Promise<void> {
  const { duration } = video;
  if (!Number.isFinite(duration) || duration <= 0) return Promise.resolve();
  const target = (ms / 1000) % duration;
  if (
    video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
    Math.abs(video.currentTime - target) < 0.0005
  ) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const finish = () => {
      clearTimeout(timer);
      video.removeEventListener("seeked", finish);
      resolve();
    };
    const timer = setTimeout(finish, SEEK_TIMEOUT_MS);
    video.addEventListener("seeked", finish);
    video.currentTime = target;
  });
}

/**
 * Registers the renderer bridge that export drives. While exporting, the live loop is stopped and each `renderAt`
 * pushes exactly one frame through the same per-frame code the live viewport uses.
 */
export function ExportBridge({ runtime }: { runtime: ViewportRuntime }) {
  const gl = useThree((s) => s.gl);
  const get = useThree((s) => s.get);

  useEffect(() => {
    const current = new Vector2();
    let target: { width: number; height: number } | null = null;

    // Only touch the renderer when the size really differs: assigning a canvas size, even an equal one, clears it.
    const fitBuffer = () => {
      if (!target) return;
      gl.getSize(current);
      if (
        gl.getPixelRatio() === 1 &&
        current.x === target.width &&
        current.y === target.height
      )
        return;
      gl.setPixelRatio(1);
      // updateStyle = false: the drawing buffer changes, the CSS size on screen does not.
      gl.setSize(target.width, target.height, false);
    };

    const bridge: RendererBridge = {
      canvas: gl.domElement,

      beginExport(width, height) {
        target = { width, height };
        runtime.tick = 0;
        runtime.exportMs = 0;
        get().setFrameloop("never");
        runtime.video?.pause();
        fitBuffer();
        return Promise.resolve();
      },

      async renderAt(ms) {
        if (!target) throw new Error("renderAt called before beginExport");
        runtime.exportMs = ms;
        if (runtime.video) {
          await seekVideo(runtime.video, ms);
          // The video texture normally refreshes from the video's own frame callback, which a seek on a paused video
          // may not deliver before we draw.
          if (runtime.videoTexture) runtime.videoTexture.needsUpdate = true;
        }
        fitBuffer();
        runtime.tick += 1 / 60;
        get().advance(runtime.tick);
      },

      endExport() {
        target = null;
        runtime.exportMs = null;
        const state = get();
        gl.setPixelRatio(state.viewport.dpr);
        gl.setSize(state.size.width, state.size.height, true);
        state.setFrameloop("always");
        runtime.video?.play().catch(() => undefined);
      },
    };

    setRenderer(bridge);
    return () => setRenderer(null);
  }, [gl, get, runtime]);

  return null;
}
