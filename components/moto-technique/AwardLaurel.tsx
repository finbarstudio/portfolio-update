"use client";

import { useEffect, useRef } from "react";
import { LAUREL_PATH } from "./laurelPath";

/**
 * The laurel, drawn on rather than dropped in.
 *
 * Their current site has this credential as a gold badge on a black square in
 * the middle of a white page. Here it is a one-colour SVG that inherits the
 * text colour, so it sits over the hero photograph with nothing behind it.
 *
 * CSS drives the draw, not GSAP: it is a self-contained entrance, which is what
 * DESIGN.md asks for, and it cannot be left half-set by an effect that runs
 * twice in development. The component only flips `data-drawn`, and the
 * stylesheet does the rest.
 */
export default function AwardLaurel({
  mark,
  body,
  label,
  delay = 0,
}: {
  mark: string;
  body: string;
  label: string;
  delay?: number;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const t = setTimeout(() => {
      el.dataset.drawn = "1";
    }, 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={root}
      className="mt-laurel"
      data-drawn="0"
      style={{ ["--mt-delay" as string]: `${delay}s` }}
    >
      <div className="mt-laurel-art">
        <svg viewBox="0 0 90 73.04" aria-hidden="true">
          <path d={LAUREL_PATH} pathLength={1} />
        </svg>
        <span className="mt-laurel-mark">{mark}</span>
      </div>
      <div className="mt-laurel-lines">
        <span className="mt-mask">
          <span className="mt-laurel-line">{body}</span>
        </span>
        <span className="mt-mask">
          <span className="mt-laurel-line mt-laurel-year">{label}</span>
        </span>
      </div>
    </div>
  );
}
