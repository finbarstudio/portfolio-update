"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  /** ms between crossfades. Default 2800. */
  interval?: number;
  aspectRatio?: string;
  sizes?: string;
};

/**
 * HeroSlideshow — lightweight CSS crossfade carousel for cover images.
 * No WebGL. All images preloaded; each fades in over 0.6 s.
 */
export default function HeroSlideshow({
  images,
  interval = 2800,
  aspectRatio = "3/2",
  sizes = "(max-width: 640px) 100vw, calc((100vw - 224px) / 2)",
}: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(
      () => setCurrent((i) => (i + 1) % images.length),
      interval,
    );
    return () => clearInterval(t);
  }, [images.length, interval]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        overflow: "hidden",
        background: "var(--color-bg, #FAFAF8)",
      }}
    >
      {images.map((src, i) => (
        <div
          key={src}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            style={{ objectFit: "contain" }}
            sizes={sizes}
          />
        </div>
      ))}
    </div>
  );
}
