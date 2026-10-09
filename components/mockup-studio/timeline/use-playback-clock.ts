"use client";

import { useEffect } from "react";
import { useStudio } from "@/lib/mockup-studio/scene/store";

/**
 * A background tab pauses rAF; a gap this long is treated as a pause, not as
 * elapsed time. Shorter gaps count in full, so playback keeps real-time speed
 * even when the renderer is only managing a few frames a second.
 */
const PAUSE_GAP_MS = 1000;

/**
 * Advances the playhead with real elapsed time while `playing`. The frame loop
 * only runs during playback, and stops itself when the store stops (end of a
 * non-looping timeline, pause, scrub).
 */
export function usePlaybackClock(): void {
  useEffect(() => {
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      const gap = Math.max(now - last, 0);
      const dt = gap > PAUSE_GAP_MS ? 0 : gap;
      last = now;
      useStudio.getState().tick(dt);
      raf = requestAnimationFrame(frame);
    };

    const sync = (playing: boolean) => {
      if (playing && raf === 0) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!playing && raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    sync(useStudio.getState().playing);
    const unsubscribe = useStudio.subscribe((state, prev) => {
      if (state.playing !== prev.playing) sync(state.playing);
    });
    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
      raf = 0;
    };
  }, []);
}
