"use client";

// Wraps next/image with an onError handler so broken/missing images
// disappear cleanly instead of showing the browser's broken-image icon.
// Progressive quality: renders WebP src immediately, then silently preloads
// the matching .png, if it exists, swaps to it for lossless source quality.

import Image from "next/image";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    setActiveSrc(src);
    setFailed(false);
    setLoaded(false);
  }, [src]);

  if (failed) return null;
  return (
    <>
      {!loaded && <Loader size={24} />}
      <Image
        src={activeSrc}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={className}
        onError={() => { setFailed(true); onReady?.(); }}
        onLoad={() => { setLoaded(true); onReady?.(); }}
      />
    </>
  );
}
