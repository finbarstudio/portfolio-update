"use client";

import { useEffect } from "react";
import Tempus from "tempus";

/**
 * TempusKernel — one shared requestAnimationFrame for the whole site.
 *
 * Tempus.patch() absorbs every native rAF call — Lenis loops, canvas effects,
 * React Three Fiber, GSAP's ticker, the sandbox toys — into a single ordered
 * loop. With several animations alive on one page (home: smooth scroll + 3D
 * thumbnails + hero slideshows), one loop means one scheduling pass per frame
 * instead of N competing callbacks, and one place to pause or profile.
 *
 * Mounted once in the root layout, before anything that animates.
 */
export default function TempusKernel() {
  useEffect(() => {
    Tempus.patch();
    return () => Tempus.unpatch();
  }, []);
  return null;
}
