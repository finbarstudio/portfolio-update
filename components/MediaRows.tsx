"use client";

/**
 * MediaRows — a grid of looping reels / images (the TMYR hero). Each tile reveals
 * on its own as soon as its media is ready, so nothing waits on the slowest item.
 * Videos preload only metadata and decode/play once scrolled into view (handled by
 * VideoPlayer), so a long page of reels doesn't pull every file up front — which
 * matters most on mobile. Mobile shows two columns; desktop shows the full set.
 */

import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import ClientImage from "./ClientImage";

type Row = { ratio: string; videos?: string[]; images?: string[]; caption?: string; alt?: string };

function Tile({
  src,
  isVideo,
  ratio,
  alt,
  sizes,
}: {
  src: string;
  isVideo: boolean;
  ratio: string;
  alt: string;
  sizes: string;
}) {
  const [ready, setReady] = useState(false);
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        background: "var(--thumb-bg, #e0e0e0)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {!ready && <div className="skeleton" style={{ zIndex: 2 }} />}
      <div style={{ position: "absolute", inset: 0, opacity: ready ? 1 : 0, transition: "opacity 0.5s var(--ease, ease)" }}>
        {isVideo ? (
          <VideoPlayer src={src} onReady={() => setReady(true)} />
        ) : (
          <ClientImage src={src} alt={alt} fill sizes={sizes} className="object-cover" onReady={() => setReady(true)} />
        )}
      </div>
    </div>
  );
}

export default function MediaRows({ rows }: { rows: Row[] }) {
  const maxCount = Math.max(...rows.map((r) => (r.videos ?? r.images ?? []).length));

  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const count = isDesktop ? maxCount : Math.min(2, maxCount);

  if (maxCount === 0 || isDesktop === null) {
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
            <div key={`${ri}-${i}`} style={{ gridColumn: i + 1, gridRow: ri + 1 }}>
              <Tile
                src={src}
                isVideo={Boolean(row.videos)}
                ratio={row.ratio}
                alt={row.alt ?? ""}
                sizes={isDesktop ? "14vw" : "50vw"}
              />
            </div>
          ));
        })}
      </div>
    </div>
  );
}
