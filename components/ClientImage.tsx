"use client";

// Wraps next/image with an onError handler so broken/missing images
// disappear cleanly instead of showing the browser's broken-image icon.
//
// Loading state, the global rule: the brand loader sits on an empty grey box,
// NEVER over the media itself (a pulse over a visible image reads as broken).
// The image stays invisible until it has actually loaded, then fades in.

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Loader from "./Loader";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  onReady?: () => void;
};

export default function ClientImage({ src, alt, fill, sizes, priority, className, onReady }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeSrc, setActiveSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setActiveSrc(src);
    setFailed(false);
    setLoaded(false);
  }, [src]);

  // React's synthetic onLoad is not reliable here: cached images complete
  // before hydration attaches it, and some load paths bypass it entirely —
  // either leaves the loader stuck (the Lows logomark glitch) or the image
  // invisible. Ask the element directly: already complete → done; otherwise
  // listen on the DOM node itself.
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const mark = () => { setLoaded(true); onReady?.(); };
    const fail = () => { setFailed(true); onReady?.(); };
    // complete + no pixels = the fetch errored before we listened (SVGs can
    // legitimately report 0 in some engines, so they count as loaded).
    if (el.complete) {
      if (el.naturalWidth > 0 || el.currentSrc.includes(".svg")) mark();
      else fail();
      return;
    }
    el.addEventListener("load", mark);
    el.addEventListener("error", fail);
    return () => {
      el.removeEventListener("load", mark);
      el.removeEventListener("error", fail);
    };
  }, [activeSrc, onReady]);

  if (failed) return null;
  return (
    <>
      {!loaded && (
        <span
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, background: "rgba(33, 30, 26, 0.08)" }}
        />
      )}
      {!loaded && <Loader size={24} />}
      <Image
        ref={imgRef}
        src={activeSrc}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={className}
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
        onError={() => { setFailed(true); onReady?.(); }}
        onLoad={() => { setLoaded(true); onReady?.(); }}
      />
    </>
  );
}
