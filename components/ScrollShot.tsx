"use client";

/**
 * ScrollShot — a full-page screenshot panning slowly inside a fixed frame,
 * reading like someone scrolling the site. Used to show off whole pages
 * (e.g. the Lows estimate calculator) without a video capture.
 *
 * The pan runs only while in view (IntersectionObserver), sits still under
 * prefers-reduced-motion, and follows the loading rule: grey box + brand
 * loader until the image is really there, never the pulse over visible media.
 * Distance is pure CSS — the frame is a size container, so the keyframes can
 * say "image height minus frame height" as calc(-100% + 100cqh).
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

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const mark = () => setLoaded(true);
    if (el.complete && el.naturalWidth > 0) { mark(); return; }
    el.addEventListener("load", mark);
    return () => el.removeEventListener("load", mark);
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
