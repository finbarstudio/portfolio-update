"use client";

import { ratingColor, STAR_COLOR, type Highlight } from "@/content/imogen";

/**
 * Highlights strip — the 9s and 10s as tappable chips. Clicking one jumps to
 * its stop (via the #stop-<id> hash, which StopCard opens) AND fires an
 * `imogen:expand` event so that stop expands all its items, so you land on the
 * featured thing with everything around it already open.
 */
export default function Highlights({ items }: { items: Highlight[] }) {
  return (
    <div className="im-highlights">
      {items.map((h) => (
        <a
          key={`${h.stopId}-${h.label}`}
          className={`im-hl ${h.star ? "is-star" : ""}`}
          href={`#stop-${h.stopId}`}
          onClick={() => {
            window.dispatchEvent(new CustomEvent("imogen:expand", { detail: { id: h.stopId } }));
          }}
        >
          <span className="im-hl-label">{h.label}</span>
          <span
            className="im-hl-rating"
            style={{ background: h.star ? STAR_COLOR : ratingColor(h.rating) ?? undefined, color: "#fff" }}
          >
            ★ {h.rating}/10
          </span>
        </a>
      ))}
    </div>
  );
}
