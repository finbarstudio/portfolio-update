"use client";

/**
 * MetaPixel — PageView per App Router navigation.
 *
 * The base pixel snippet lives verbatim in the root layout's <head> (Meta's
 * install location) and fires the FIRST PageView itself. Client-side route
 * changes never reload the page, so without this the pixel would undercount
 * by almost every navigation. Skips the mount run, tracks every one after.
 *
 * /free-redesign layers a Schedule conversion on top (see FreeRedesign) —
 * that's what Meta optimises ad delivery against; the base pixel builds the
 * retargeting audience.
 */

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
