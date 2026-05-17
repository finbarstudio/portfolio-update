"use client";

import { useState, useEffect } from "react";
import ClientImage from "@/components/ClientImage";

// PDF-to-image slideshow: renders each page as a WebP image with minimal
// prev/next navigation. Pages are pre-converted by the build pipeline.
// Adjacent pages are preloaded on mount and on page change so navigation
// feels instant.
export default function PDFSlideshow({
  pages,
  title,
}: {
  pages: string[];
  title: string;
}) {
  const [current, setCurrent] = useState(0);
  const total = pages.length;

  function goTo(index: number) {
    if (index === current) return;
    setCurrent(index);
  }

  // Preload adjacent pages whenever current changes
  useEffect(() => {
    const preload = (i: number) => {
      if (i < 0 || i >= total) return;
      const img = new window.Image();
      img.src = pages[i];
    };
    preload(current - 1);
    preload(current + 1);
  }, [current, pages, total]);

  return (
    <div className="py-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <p className="mono-label text-ink-soft">{title}</p>
          <span className="mono-label text-ink-soft" style={{ fontSize: "0.5625rem", opacity: 0.6 }}>
            PDF · {total} pages
          </span>
        </div>
        <p className="mono-label text-ink-soft tabular-nums">
          {current + 1} / {total}
        </p>
      </div>

      {/* Page image — A4 ratio, white background, contain */}
      <div
        className="img-wrap border border-line"
        style={{ aspectRatio: "1/1.414", maxHeight: "80vh", background: "white" }}
      >
        <ClientImage
          key={current}
          src={pages[current]}
          alt={`${title} — page ${current + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, calc(100vw - 224px)"
          className="object-contain"
        />
      </div>

      {/* Navigation */}
      {total > 1 && (
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => goTo(Math.max(0, current - 1))}
            disabled={current === 0}
            className="mono-label text-ink-soft hover:text-pink transition-colors disabled:opacity-30"
            aria-label="Previous page"
          >
            ← PREV
          </button>

          <div className="flex gap-1 flex-1 justify-center flex-wrap">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to page ${i + 1}`}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: i === current ? "var(--ink)" : "var(--line)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "background 0.15s",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(Math.min(total - 1, current + 1))}
            disabled={current === total - 1}
            className="mono-label text-ink-soft hover:text-pink transition-colors disabled:opacity-30"
            aria-label="Next page"
          >
            NEXT →
          </button>
        </div>
      )}
    </div>
  );
}
