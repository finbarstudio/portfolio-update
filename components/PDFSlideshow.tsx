"use client";

import { useState } from "react";
import ClientImage from "@/components/ClientImage";

// PDF-to-image slideshow: renders each page as a WebP image with minimal
// prev/next navigation. Pages are pre-converted by the build pipeline.
export default function PDFSlideshow({
  pages,
  title,
}: {
  pages: string[];
  title: string;
}) {
  const [current, setCurrent] = useState(0);
  const total = pages.length;

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-4">
        <p className="mono-label text-ink-soft">{title}</p>
        <p className="mono-label text-ink-soft tabular-nums">
          {current + 1} / {total}
        </p>
      </div>

      {/* Page image */}
      <div
        className="img-wrap border border-line"
        style={{ aspectRatio: "1/1.414", maxHeight: "80vh" }} /* A4 ratio */
      >
        <ClientImage
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
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="mono-label text-ink-soft hover:text-pink transition-colors disabled:opacity-30"
            aria-label="Previous page"
          >
            ← PREV
          </button>

          <div className="flex gap-1 flex-1 justify-center">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
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
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
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
