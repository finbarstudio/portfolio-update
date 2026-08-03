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
  // The shot we're fading AWAY FROM stays fully opaque underneath the incoming
  // one: only the top layer fades, so the ground never shows through mid-fade
  // (a symmetric cross-fade dips to ~75% coverage and blinks white).
  const prev = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
    setI((v) => { prev.current = v; return 0; });
  };
  const start = () => {
    if (images.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (timer.current) return;
    timer.current = setInterval(() => setI((v) => { prev.current = v; return (v + 1) % images.length; }), interval);
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
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={
            idx === i
              ? { opacity: 1, zIndex: 2, transition: "opacity 0.3s ease" }
              : idx === prev.current
                ? { opacity: 1, zIndex: 1, transition: "none" }
                : { opacity: 0, zIndex: 0, transition: "none" }
          }
        />
      ))}
    </div>
  );
}
