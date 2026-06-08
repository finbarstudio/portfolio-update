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

export default function PdfSlideshowThumb({ pages }: { pages: string[] }) {
  const { ref: hoverRef, hovered } = useGroupHover<HTMLDivElement>(true);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  // Pause cycling when off-screen.
  useEffect(() => {
    const el = hoverRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, [hoverRef]);

  useEffect(() => {
    if (!inView || pages.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % pages.length), INTERVAL);
    return () => clearInterval(id);
  }, [inView, pages.length]);

  return (
    <div
      ref={hoverRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#ffffff",
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

      {/* Page progress dots */}
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
    </div>
  );
}
