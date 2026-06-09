"use client";

/**
 * MediaRows — a grid of looping reels / images (the TMYR hero). The whole grid
 * shows a single skeleton placeholder until EVERY item has loaded, then they all
 * appear together (no piecemeal pop-in), like a modern app skeleton loader.
 *
 * Only ONE grid is rendered at a time (chosen by viewport) so there are no
 * display:none copies whose videos never fire `loadeddata`. Readiness is driven
 * by the real rendered media via their onReady callbacks, with a safety timeout.
 */

import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import ClientImage from "./ClientImage";

type Row = { ratio: string; videos?: string[]; images?: string[]; caption?: string; alt?: string };

export default function MediaRows({ rows }: { rows: Row[] }) {
  const maxCount = Math.max(...rows.map((r) => (r.videos ?? r.images ?? []).length));

  // Pick the column count for the current viewport (mobile shows a couple, large).
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const count = isDesktop ? maxCount : Math.min(2, maxCount);

  // How many tiles are actually rendered for this count.
  const total = rows.reduce(
    (n, r) => n + Math.min(count, (r.videos ?? r.images ?? []).length),
    0
  );

  const [loadedCount, setLoadedCount] = useState(0);
  const ready = total > 0 && loadedCount >= total;

  // Reset the counter whenever the rendered set changes (viewport flip).
  useEffect(() => { setLoadedCount(0); }, [count]);

  // Safety: never leave the skeleton up forever if something stalls.
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    setTimedOut(false);
    const t = setTimeout(() => setTimedOut(true), 8000);
    return () => clearTimeout(t);
  }, [count]);

  const revealed = ready || timedOut;

  if (maxCount === 0 || isDesktop === null) {
    // Until we know the viewport, render a neutral skeleton frame to avoid a flash.
    return (
      <div className="py-2">
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.max(1, maxCount)}, minmax(0,1fr))` }}>
          {Array.from({ length: Math.max(1, maxCount) }).map((_, i) => (
            <div key={i} style={{ position: "relative", aspectRatio: "9/16", borderRadius: 8, overflow: "hidden", background: "var(--thumb-bg, #e0e0e0)" }}>
              <div className="skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const bump = () => setLoadedCount((n) => n + 1);

  return (
    <div className="py-2">
      <div
        className={isDesktop ? "grid gap-3" : "grid gap-2.5"}
        style={{
          gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows.length}, auto)`,
        }}
      >
        {rows.flatMap((row, ri) => {
          const items = (row.videos ?? row.images ?? []).slice(0, count);
          return items.map((src, i) => (
            <div
              key={`${ri}-${i}`}
              style={{
                position: "relative",
                aspectRatio: row.ratio,
                background: "var(--thumb-bg, #e0e0e0)",
                borderRadius: 8,
                overflow: "hidden",
                gridColumn: i + 1,
                gridRow: ri + 1,
              }}
            >
              {/* Unified skeleton on top until the whole frame is ready. */}
              {!revealed && <div className="skeleton" style={{ zIndex: 2 }} />}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: revealed ? 1 : 0,
                  transition: "opacity 0.5s var(--ease, ease)",
                }}
              >
                {row.videos ? (
                  <VideoPlayer src={src} eager onReady={bump} />
                ) : (
                  <ClientImage
                    src={src}
                    alt={row.alt ?? ""}
                    fill
                    sizes={isDesktop ? "14vw" : "50vw"}
                    className="object-cover"
                    onReady={bump}
                  />
                )}
              </div>
            </div>
          ));
        })}
      </div>
    </div>
  );
}
