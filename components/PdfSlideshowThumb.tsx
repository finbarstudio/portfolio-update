"use client";

/**
 * PdfSlideshowThumb — a lightweight, GPU-cheap thumbnail for a PDF document.
 * Crossfades through the page images on a timer (opacity only — no WebGL, no
 * layout work). Pages sit `contain`ed on a soft surface with a small inset so
 * the rounded card corners never clip page content. Soft pink wash on card hover.
 *
 * Only animates while in view (IntersectionObserver) so off-screen cards cost
 * nothing.
 */

import { useEffect, useRef, useState } from "react";
import { useGroupHover } from "./useGroupHover";

const INTERVAL = 2600; // ms per page

export default function PdfSlideshowThumb({
  pages,
  hover = true,
  nav = false,
}: {
  pages: string[];
  hover?: boolean;
  /** Show prev/next arrows + a page counter (for the detail-page viewer). */
  nav?: boolean;
}) {
  const { ref: hoverRef, hovered } = useGroupHover<HTMLDivElement>(hover);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  // Auto-advance pauses once the user takes manual control via the arrows.
  const [manual, setManual] = useState(false);

  // Pause cycling when off-screen.
  useEffect(() => {
    const el = hoverRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, [hoverRef]);

  useEffect(() => {
    if (!inView || manual || pages.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % pages.length), INTERVAL);
    return () => clearInterval(id);
  }, [inView, manual, pages.length]);

  const go = (dir: number) => {
    setManual(true);
    setActive((i) => (i + dir + pages.length) % pages.length);
  };

  // Touch swipe to change page (mobile primary nav).
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 35) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      ref={hoverRef}
      className={`pdf-thumb ${nav ? "has-nav" : ""}`}
      // While the pointer is over the viewer, pause the auto-advance so the user
      // can read / navigate; resume it the moment the pointer leaves.
      onMouseEnter={nav ? () => setManual(true) : undefined}
      onMouseLeave={nav ? () => setManual(false) : undefined}
      onTouchStart={nav ? onTouchStart : undefined}
      onTouchEnd={nav ? onTouchEnd : undefined}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "var(--thumb-bg, #e0e0e0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Soft pink wash on hover */}
      <div className="mockup-pink-bg" aria-hidden="true" style={{ opacity: hovered ? 1 : 0 }} />

      {pages.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden={i !== active}
          data-active={i === active}
          loading={i === 0 ? "eager" : "lazy"}
          className="pdf-page"
          style={{
            opacity: i === active ? 1 : 0,
            zIndex: i === active ? 1 : 0,
          }}
        />
      ))}

      {/* Bottom control bar — pink page dots, plus hover-revealed prev/next
          arrows beside them when nav is enabled. Dots are clickable in nav mode. */}
      <div className={`pdf-controls ${nav ? "has-nav" : ""}`}>
        {nav && pages.length > 1 && (
          <button type="button" onClick={() => go(-1)} aria-label="Previous page" className="pdf-arrow">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 4 6 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Dots are display-only indicators (navigate via swipe / arrows). */}
        <div className="pdf-dots">
          {pages.map((_, i) => (
            <span key={i} className="pdf-dot" data-active={i === active} aria-hidden="true" />
          ))}
        </div>

        {nav && pages.length > 1 && (
          <button type="button" onClick={() => go(1)} aria-label="Next page" className="pdf-arrow">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
