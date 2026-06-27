"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Blur-up image (Lows-style): a tiny inline LQIP shows instantly — so the hero is
 * never blank as the preloader lifts — then the full photo fades in sharp over it
 * once it decodes. Plain <img> (the demo convention). Fills a positioned parent;
 * pass imgClassName for e.g. the Ken-burns drift.
 */
export default function BlurImage({
  src,
  lqip,
  alt,
  imgClassName = "",
  priority = false,
}: {
  src: string;
  lqip: string;
  alt: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Catch images already decoded from cache (onLoad won't fire for those).
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div className="bx-blur">
      <div className="bx-blur-lqip" style={{ backgroundImage: `url(${lqip})` }} aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={`bx-blur-img ${imgClassName}`}
        data-loaded={loaded ? "1" : undefined}
      />
    </div>
  );
}
