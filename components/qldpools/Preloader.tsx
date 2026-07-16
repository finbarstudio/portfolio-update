"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { markIntroDone } from "@/components/qldpools/intro";

/**
 * Preloader — a plain white curtain whose only job is to hold the page until
 * the hero photo has actually decoded, so the arch never fills in on a blank
 * frame. Once the image is ready the curtain fades and `qpi:intro-done` fires:
 * SmoothScroll unlocks, the Nav slides in, and the Hero fills its arch and
 * staggers the type.
 *
 * (This used to be a logo-shaped cutout that zoomed through the mark. Finbar
 * asked for the simpler read: just load the image into the arch.)
 *
 * Plays once per real document load (module flag survives client-side nav).
 * Reduced motion cuts straight through. Fail-open: a timeout always lifts it.
 */

const FADE_MS = 480;
const DECODE_CAP_MS = 2200;

let started = false;

export default function Preloader() {
  const pathname = usePathname();

  // Decided during render so the curtain is in the server HTML and covers from
  // the very first paint.
  const [play] = useState(() => pathname === "/qldpools/site" && !started);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!play || hidden) return;
    started = true;

    const finish = () => {
      setHidden(true);
      // Sets the flag, resolves the promise and dispatches the legacy event.
      markIntroDone();
    };

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(finish, 0);
      return () => window.clearTimeout(id);
    }

    let cancelled = false;
    let fadeTimer = 0;

    const lift = () => {
      if (cancelled) return;
      const root = rootRef.current;
      if (root) {
        root.style.transition = `opacity ${FADE_MS}ms ease`;
        root.style.opacity = "0";
      }
      fadeTimer = window.setTimeout(finish, FADE_MS);
    };

    // Wait on the hero image, but never longer than the cap.
    const heroImg = document.querySelector<HTMLImageElement>("img[data-qpi-hero]");
    const decoded =
      heroImg && !heroImg.complete ? heroImg.decode().catch(() => {}) : Promise.resolve();
    const capped = new Promise<void>((r) => window.setTimeout(r, DECODE_CAP_MS));
    Promise.race([decoded, capped]).then(lift);

    // Absolute fail-safe.
    const failsafe = window.setTimeout(finish, DECODE_CAP_MS + FADE_MS + 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(fadeTimer);
      window.clearTimeout(failsafe);
    };
  }, [play, hidden]);

  if (!play || hidden) return null;

  return (
    // Inline so the curtain holds from the first paint, before any stylesheet.
    <div
      className="qpi-preloader"
      ref={rootRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 80, background: "#ffffff" }}
    />
  );
}
