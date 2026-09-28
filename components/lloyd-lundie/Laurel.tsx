"use client";

import { useEffect, useRef } from "react";
import { LAUREL_PATH } from "./laurelPath";

/**
 * The laurel under the hero wordmark, drawn on rather than dropped in: the
 * wreath's outline draws, then fills, then the figure inside it and the word
 * beneath it rise into place. Same pattern as /mt's AwardLaurel. CSS does the
 * animation; this only flips `data-drawn` once mounted.
 */
export default function Laurel({ mark, unit, delay = 0 }: { mark: string; unit: string; delay?: number }) {
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
    <div ref={root} className="ll-laurel" data-drawn="0" style={{ ["--ll-delay" as string]: `${delay}s` }}>
      <div className="ll-laurel-art">
        <svg viewBox="0 0 90 73.04" aria-hidden="true">
          <path d={LAUREL_PATH} pathLength={1} />
        </svg>
        <span className="ll-laurel-mark">{mark}</span>
      </div>
      <span className="ll-laurel-mask">
        <span className="ll-laurel-unit">{unit}</span>
      </span>
    </div>
  );
}
