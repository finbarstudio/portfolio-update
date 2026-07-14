"use client";

/**
 * PreviewCycle — a website thumbnail that auto-cycles through screenshots of
 * notable sections (home, gallery, about, projects…) while the pointer is over
 * it, and rests on the first shot otherwise. Click behaviour belongs to the
 * consumer: the whole element sits inside a Link to the case study.
 *
 * Fills a positioned parent (absolute inset-0). Reduced motion: no cycling.
 */

import { useEffect, useRef, useState } from "react";

export default function PreviewCycle({
  images,
  alt,
  interval = 850,
}: {
  images: string[];
  alt: string;
  interval?: number;
}) {
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
    setI(0);
  };
  const start = () => {
    if (images.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (timer.current) return;
    timer.current = setInterval(() => setI((v) => (v + 1) % images.length), interval);
  };

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return (
    <div
      className="preview-cycle absolute inset-0"
      onPointerEnter={start}
      onPointerLeave={stop}
    >
      {images.map((src, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={idx === 0 ? alt : ""}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: idx === i ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
