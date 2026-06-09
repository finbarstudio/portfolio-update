"use client";

/**
 * BookViewer — shows a paginated document as a book: two facing pages per
 * spread, with the cover alone on the right. Flip through spreads with the
 * prev/next bubbles or arrow keys. Pages are contained (never cropped/zoomed),
 * so any page size fits. Reuses the .pdf-* control styles.
 */

import { useEffect, useRef, useState } from "react";

// A4-portrait page wireframe (frame + a few text lines) used while loading.
function PageWire() {
  return (
    <svg className="page-wire" viewBox="0 0 210 297" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="207" height="294" rx="6" stroke="currentColor" strokeWidth="2" />
      <rect x="22" y="30" width="120" height="9" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="22" y="55" width="166" height="4" rx="2" fill="currentColor" opacity="0.28" />
      <rect x="22" y="66" width="166" height="4" rx="2" fill="currentColor" opacity="0.28" />
      <rect x="22" y="77" width="120" height="4" rx="2" fill="currentColor" opacity="0.28" />
      <rect x="22" y="104" width="166" height="78" rx="4" fill="currentColor" opacity="0.16" />
      <rect x="22" y="198" width="166" height="4" rx="2" fill="currentColor" opacity="0.28" />
      <rect x="22" y="209" width="166" height="4" rx="2" fill="currentColor" opacity="0.28" />
      <rect x="22" y="220" width="100" height="4" rx="2" fill="currentColor" opacity="0.28" />
    </svg>
  );
}

// Preload both pages of a spread; resolves once both are decoded.
function preload(srcs: (string | null)[]): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  return Promise.all(
    srcs.filter(Boolean).map(
      (src) =>
        new Promise<void>((res) => {
          const im = new window.Image();
          im.onload = im.onerror = () => res();
          im.src = src as string;
        })
    )
  ).then(() => undefined);
}

export default function BookViewer({ pages, markSpread }: { pages: string[]; markSpread?: number }) {
  // Build spreads: cover alone on the right, then facing pairs, last page alone.
  const spreads: [string | null, string | null][] = [[null, pages[0] ?? null]];
  for (let i = 1; i < pages.length; i += 2) {
    spreads.push([pages[i] ?? null, pages[i + 1] ?? null]);
  }

  const [idx, setIdx] = useState(0);       // requested spread
  const [shown, setShown] = useState(0);   // spread currently displayed
  const [loading, setLoading] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const go = (d: number) =>
    setIdx((i) => Math.min(spreads.length - 1, Math.max(0, i + d)));

  // Load the requested spread fully before showing it, so both facing pages
  // appear together (never a half-loaded mismatch). Prefetch the neighbours so
  // subsequent flips are instant.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    preload(spreads[idx]).then(() => {
      if (cancelled) return;
      setShown(idx);
      setLoading(false);
      // warm the adjacent spreads in the background
      if (spreads[idx + 1]) preload(spreads[idx + 1]);
      if (spreads[idx - 1]) preload(spreads[idx - 1]);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

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

  // Touch swipe to flip spreads.
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 35) go(dx < 0 ? 1 : -1);
  };

  const [left, right] = spreads[shown];

  return (
    <div
      className="sm-book pdf-thumb"
      ref={rootRef}
      tabIndex={0}
      aria-label="Playbook"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="sm-book-spread">
        <div className="sm-book-page sm-book-left">
          {left && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={left} alt="" />
          )}
        </div>
        <div className="sm-book-page sm-book-right">
          {right && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={right} alt="" />
          )}
        </div>
      </div>

      {/* Wireframe placeholder — page outlines while a spread loads (less jarring
          than a full grey reload). */}
      {loading && (
        <div className="sm-book-loading" aria-hidden="true">
          <div className="sm-book-spread">
            <div className="sm-book-page sm-book-left"><PageWire /></div>
            <div className="sm-book-page sm-book-right"><PageWire /></div>
          </div>
        </div>
      )}

      <div className="pdf-controls has-nav">
        <button type="button" onClick={() => go(-1)} aria-label="Previous pages" className="pdf-arrow" disabled={idx === 0}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 4 6 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* Dots are display-only indicators (navigate via swipe / arrows). */}
        <div className="pdf-dots">
          {spreads.map((_, i) => (
            <span
              key={i}
              className={`pdf-dot${i === markSpread ? " pdf-dot-mark" : ""}`}
              data-active={i === idx}
              aria-hidden="true"
            >
              {i === markSpread && <span className="pdf-dot-star" aria-hidden="true">★</span>}
            </span>
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
