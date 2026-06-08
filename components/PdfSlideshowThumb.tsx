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

  return (
    <div
      ref={hoverRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "var(--surface-sunken, #F2F2EF)",
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
          loading={i === 0 ? "eager" : "lazy"}
          style={{
            position: "absolute",
            inset: "8% 6%",            // inset so rounded corners don't clip the page
            width: "88%",
            height: "84%",
            margin: "auto",
            objectFit: "contain",
            opacity: i === active ? 1 : 0,
            transform: i === active ? "scale(1)" : "scale(0.97)",
            transition: "opacity 0.8s var(--ease, ease), transform 0.8s var(--ease, ease)",
            filter: "drop-shadow(0 6px 18px rgba(20,20,20,0.12))",
            zIndex: i === active ? 1 : 0,
          }}
        />
      ))}

      {/* Prev / next arrows + page counter (detail-page viewer) */}
      {nav && pages.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous page"
            className="pdf-nav-btn"
            style={{ left: 12 }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 4 6 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next page"
            className="pdf-nav-btn"
            style={{ right: 12 }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 12,
              right: 14,
              zIndex: 3,
              fontFamily: "var(--font-label)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "var(--ink-soft)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {active + 1} / {pages.length}
          </span>
        </>
      )}

      {/* Page progress dots (hidden when arrows/counter are shown) */}
      {!nav && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 12,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 5,
            zIndex: 2,
          }}
        >
          {pages.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === active ? 14 : 5,
                height: 5,
                borderRadius: 3,
                background: i === active ? "var(--pink)" : "rgba(20,20,20,0.18)",
                transition: "width 0.4s var(--ease, ease), background 0.4s var(--ease, ease)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
