"use client";

/**
 * ScrollShot — a full-page screenshot panning slowly inside a fixed frame,
 * reading like someone scrolling the site. Used to show off whole pages
 * (e.g. the Lows estimate calculator) without a video capture.
 *
 * The pan distance (image height minus frame height) is measured in JS and
 * set as --pan, so the CSS animation is a plain translateY(var(--pan)). An
 * earlier version used container-query units (100cqh), which iOS Safari
 * resolves unreliably inside animations — the pan sat still on mobile.
 *
 * Pans only while in view (IntersectionObserver), sits still under
 * prefers-reduced-motion, and follows the loading rule: grey box + brand
 * loader until the image is really there, never the pulse over visible media.
 */

import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";

export default function ScrollShot({
  src,
  alt,
  aspectRatio = "16/9",
}: {
  src: string;
  alt: string;
  aspectRatio?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [live, setLive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Measure how far the image overflows the frame and expose it as --pan.
  // Recompute on load and whenever the frame resizes (rotate / responsive).
  useEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;
    const measure = () => {
      const dist = frame.clientHeight - img.offsetHeight; // negative = pan up
      img.style.setProperty("--pan", `${Math.min(0, dist)}px`);
    };
    const mark = () => { setLoaded(true); measure(); };
    if (img.complete && img.naturalWidth > 0) mark();
    else img.addEventListener("load", mark);
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    return () => { img.removeEventListener("load", mark); ro.disconnect(); };
  }, []);

  return (
    <div ref={frameRef} className={`scroll-shot${live ? " is-live" : ""}`} style={{ aspectRatio }}>
      {!loaded && <span aria-hidden="true" className="scroll-shot-ground" />}
      {!loaded && <Loader bare />}
      {/* Plain img: next/image's fill mode fights the height-driven pan. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}
