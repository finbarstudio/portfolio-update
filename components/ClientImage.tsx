"use client";

// Wraps next/image with an onError handler so broken/missing images
// disappear cleanly instead of showing the browser's broken-image icon.
// Progressive quality: renders WebP src immediately, then silently preloads
// the matching .png, if it exists, swaps to it for lossless source quality.

import Image from "next/image";
import { useState, useEffect } from "react";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export default function ClientImage({ src, alt, fill, sizes, priority, className }: Props) {
  const [failed, setFailed] = useState(false);
  const [activeSrc, setActiveSrc] = useState(src);

  useEffect(() => {
    // Reset to the supplied src whenever it changes (e.g. PDF page flip)
    setActiveSrc(src);
    setFailed(false);

    // Only try the PNG upgrade path for WebP sources
    if (!src.endsWith(".webp")) return;

    const pngSrc = src.replace(/\.webp$/, ".png");
    const img = new window.Image();
    let cancelled = false;

    img.onload = () => {
      if (!cancelled) setActiveSrc(pngSrc);
    };
    // onerror: PNG doesn't exist, silently stay on WebP
    img.src = pngSrc;

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (failed) return null;
  return (
    <Image
      src={activeSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
