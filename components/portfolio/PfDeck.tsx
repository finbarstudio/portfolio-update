"use client";

import { useEffect, useRef, useState } from "react";
import { media } from "@/lib/media";

/**
 * A landscape document on the portfolio that can be paged through: one page
 * shown large, every page small in a strip underneath.
 *
 * Move on by clicking the right half of the page (the left half goes back),
 * with the arrows either side of the strip, with the arrow keys once the
 * document has been clicked or tabbed to, by picking a page from the strip,
 * or by swiping on a phone.
 *
 * The small copy of a page is shown at once and the full one fades in over it,
 * so a page is never blank while it loads. The page after the current one is
 * fetched ahead of time.
 */
export default function PfDeck({ name, pages, thumbs }: { name: string; pages: string[]; thumbs: string[] }) {
  const [at, setAt] = useState(0);
  const [sharp, setSharp] = useState(false);
  const down = useRef<number | null>(null);
  const last = pages.length - 1;
  const go = (to: number) => {
    const next = Math.min(last, Math.max(0, to));
    if (next === at) return;
    setSharp(false);
    setAt(next);
  };

  // fetch the next page ahead of time
  useEffect(() => {
    if (at >= last) return;
    const ahead = new Image();
    ahead.src = media(pages[at + 1]);
  }, [at, last, pages]);

  const two = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className="pf-deck"
      role="group"
      aria-label={name}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(at + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(at - 1); }
      }}
    >
      <div
        className="pf-deck-page"
        onPointerDown={(e) => { down.current = e.clientX; }}
        onPointerUp={(e) => {
          const from = down.current;
          down.current = null;
          if (from === null) return;
          const moved = e.clientX - from;
          // a swipe turns the page the way it was pushed; a plain click or tap
          // goes by which half of the page it landed on
          if (Math.abs(moved) > 40) return go(at + (moved < 0 ? 1 : -1));
          const box = e.currentTarget.getBoundingClientRect();
          go(at + (e.clientX - box.left > box.width / 2 ? 1 : -1));
        }}
        data-first={at === 0 ? "1" : "0"}
        data-last={at === last ? "1" : "0"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pf-deck-soft" src={media(thumbs[at])} alt="" width={1600} height={900} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={pages[at]}
          className="pf-deck-sharp"
          src={media(pages[at])}
          alt={`${name}, page ${at + 1} of ${pages.length}`}
          width={1600}
          height={900}
          data-in={sharp ? "1" : "0"}
          ref={(img) => { if (img?.complete && img.naturalWidth) setSharp(true); }}
          onLoad={() => setSharp(true)}
          draggable={false}
        />
      </div>

      <div className="pf-deck-bar pf-mono">
        <button type="button" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Previous page">←</button>
        <div className="pf-deck-strip">
          {thumbs.map((thumb, i) => (
            <button type="button" key={thumb} onClick={() => go(i)} data-on={i === at ? "1" : "0"} aria-label={`Page ${i + 1}`} aria-current={i === at ? "page" : undefined}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media(thumb)} alt="" width={160} height={90} loading="lazy" />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(at + 1)} disabled={at === last} aria-label="Next page">→</button>
        <span className="pf-deck-count pf-soft">{two(at + 1)}/{two(pages.length)}</span>
      </div>
    </div>
  );
}
