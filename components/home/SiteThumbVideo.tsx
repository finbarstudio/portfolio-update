"use client";

/**
 * SiteThumbVideo — a looping, silent clip in place of a static home-grid
 * thumbnail, for sites that ship with a showcase film.
 *
 * Two courtesies, both required by the project's motion rules: it never
 * autoplays under `prefers-reduced-motion` (the poster frame stands in), and
 * it only runs while it's actually on screen, so a card scrolled past isn't
 * quietly decoding video in the background.
 */

import { useEffect, useRef } from "react";

export default function SiteThumbVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      // No `autoPlay`: playback is started by the observer above, so reduced
      // motion and off-screen cards simply keep showing the poster.
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={alt}
      className="w-full h-auto rounded-md border border-line block"
    >
      <source src={src} type="video/webm" />
    </video>
  );
}
