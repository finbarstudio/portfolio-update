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
      {/* Sliding strip — translates left one slot per advance */}
      <div
        style={{
          display: "flex",
          width: `${images.length * 100}%`,
          height: "100%",
          transform: `translateX(-${(current * 100) / images.length}%)`,
          transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {images.map((src) => (
          <div
            key={src}
            style={{
              width: `${100 / images.length}%`,
              flexShrink: 0,
              position: "relative",
              height: "100%",
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
    </div>
  );
}
