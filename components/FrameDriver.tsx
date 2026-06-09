"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * FrameDriver — drives a Canvas that uses `frameloop="demand"`.
 *
 * While `active` (e.g. hovered / animating) it requests a frame every rAF tick
 * (full 60fps). Otherwise it ticks at `idleFps` — 30 is plenty for a looping
 * screen video, 0 means "don't render at all until something else invalidates"
 * (for static scenes). This avoids burning a continuous 60fps render loop per
 * canvas when nothing is changing, which is the main CPU cost of having several
 * 3D thumbnails on one page.
 */
export function FrameDriver({ active, idleFps = 0 }: { active: boolean; idleFps?: number }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let raf = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    if (active) {
      const loop = () => {
        invalidate();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    } else if (idleFps > 0) {
      timer = setInterval(() => invalidate(), 1000 / idleFps);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (timer) clearInterval(timer);
    };
  }, [active, idleFps, invalidate]);

  return null;
}
