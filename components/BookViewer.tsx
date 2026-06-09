"use client";

/**
 * BookViewer — shows a paginated document as a book: two facing pages per
 * spread, with the cover alone on the right. Flip through spreads with the
 * prev/next bubbles or arrow keys. Pages are contained (never cropped/zoomed),
 * so any page size fits. Reuses the .pdf-* control styles.
 */

import { useEffect, useRef, useState } from "react";

export default function BookViewer({ pages }: { pages: string[] }) {
  // Build spreads: cover alone on the right, then facing pairs, last page alone.
  const spreads: [string | null, string | null][] = [[null, pages[0] ?? null]];
  for (let i = 1; i < pages.length; i += 2) {
    spreads.push([pages[i] ?? null, pages[i + 1] ?? null]);
  }

  const [idx, setIdx] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const go = (d: number) =>
    setIdx((i) => Math.min(spreads.length - 1, Math.max(0, i + d)));

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  const [left, right] = spreads[idx];

  return (
    <div className="sm-book pdf-thumb" ref={rootRef} tabIndex={0} aria-label="Playbook">
      <div className="sm-book-spread">
        <div className="sm-book-page sm-book-left">
          {left && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={left} alt="" loading="lazy" />
          )}
        </div>
        <div className="sm-book-page sm-book-right">
          {right && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={right} alt="" loading="lazy" />
          )}
        </div>
      </div>

      <div className="pdf-controls has-nav">
        <button type="button" onClick={() => go(-1)} aria-label="Previous pages" className="pdf-arrow" disabled={idx === 0}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 4 6 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="pdf-dots">
          {spreads.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Spread ${i + 1}`}
              aria-current={i === idx}
              onClick={() => setIdx(i)}
              className="pdf-dot"
              data-active={i === idx}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Next pages" className="pdf-arrow" disabled={idx === spreads.length - 1}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
