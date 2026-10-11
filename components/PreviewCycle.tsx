"use client";

/**
 * PreviewCycle — a website thumbnail that auto-cycles through screenshots of
 * notable sections (home, gallery, about, projects…) while the pointer is over
 * it, and rests on the first shot otherwise. Click behaviour belongs to the
 * consumer: the whole element sits inside a Link to the case study.
 *
 * Fills a positioned parent (absolute inset-0). Reduced motion: no cycling.
 *
 * Loading. Only the first shot is in the page to begin with: the others are
 * added the first time a pointer comes near, so a phone (no hover) never
 * downloads them. The first shot of each site also has an 800px copy beside it
 * (web/<site>-1-800.webp), offered through srcset so a phone takes that one.
 * `priority` is for the one thumbnail that is the largest thing on first paint:
 * it loads eagerly and at high priority, the rest stay lazy.
 */

import { useEffect, useRef, useState } from "react";

/** The 800px copy of a first shot, or nothing when the image is not one. */
function small(src: string): string | undefined {
  const m = src.match(/^(.*\/images\/web\/[a-z0-9-]+-1)\.webp(\?.*)?$/);
  return m ? `${m[1]}-800.webp?v=1` : undefined;
}

export default function PreviewCycle({
  images,
  alt,
  interval = 850,
  priority = false,
  sizes = "(max-width: 639px) 100vw, 50vw",
}: {
  images: string[];
  alt: string;
  interval?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const [i, setI] = useState(0);
  const [armed, setArmed] = useState(false);
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
    setArmed(true);
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
      {(armed ? images : images.slice(0, 1)).map((src, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          srcSet={idx === 0 && small(src) ? `${small(src)} 800w, ${src} 1440w` : undefined}
          sizes={idx === 0 && small(src) ? sizes : undefined}
          alt={idx === 0 ? alt : ""}
          loading={idx === 0 && priority ? "eager" : "lazy"}
          fetchPriority={idx === 0 && priority ? "high" : undefined}
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
