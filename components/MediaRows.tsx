"use client";

/**
 * MediaRows — a grid of looping reels / images (the TMYR hero). The whole grid
 * shows a single skeleton placeholder until EVERY item has loaded, then they all
 * appear together (no piecemeal pop-in), like a modern app skeleton loader.
 */

import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import ClientImage from "./ClientImage";

type Row = { ratio: string; videos?: string[]; images?: string[]; caption?: string; alt?: string };

function Grid({
  rows,
  count,
  className,
  sizes,
  ready,
}: {
  rows: Row[];
  count: number;
  className: string;
  sizes: string;
  ready: boolean;
}) {
  return (
    <div
      className={className}
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
            {/* Skeleton cell until everything is ready */}
            {!ready && <div className="skeleton" />}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: ready ? 1 : 0,
                transition: "opacity 0.5s var(--ease, ease)",
              }}
            >
              {row.videos ? (
                <VideoPlayer src={src} />
              ) : (
                <ClientImage src={src} alt={row.alt ?? ""} fill sizes={sizes} className="object-cover" />
              )}
            </div>
          </div>
        ));
      })}
    </div>
  );
}

export default function MediaRows({ rows }: { rows: Row[] }) {
  const maxCount = Math.max(...rows.map((r) => (r.videos ?? r.images ?? []).length));
  const mobileCount = Math.min(2, maxCount);
  const [ready, setReady] = useState(false);

  // Preload every item; reveal the whole grid only once they're all decoded.
  useEffect(() => {
    if (maxCount === 0) { setReady(true); return; }
    const srcs: { src: string; video: boolean }[] = [];
    rows.forEach((r) => {
      (r.videos ?? r.images ?? []).forEach((src) => srcs.push({ src, video: !!r.videos }));
    });
    if (srcs.length === 0) { setReady(true); return; }

    let cancelled = false;
    let remaining = srcs.length;
    const cleanups: (() => void)[] = [];
    const done = () => {
      if (cancelled) return;
      remaining -= 1;
      if (remaining <= 0) setReady(true);
    };

    srcs.forEach(({ src, video }) => {
      if (video) {
        const v = document.createElement("video");
        v.preload = "auto";
        v.muted = true;
        const onDone = () => done();
        v.addEventListener("loadeddata", onDone, { once: true });
        v.addEventListener("error", onDone, { once: true });
        v.src = src;
        v.load();
        cleanups.push(() => {
          v.removeEventListener("loadeddata", onDone);
          v.removeEventListener("error", onDone);
          v.src = "";
        });
      } else {
        const im = new window.Image();
        im.onload = im.onerror = () => done();
        im.src = src;
      }
    });

    // Safety: don't wait forever if something stalls.
    const t = setTimeout(() => setReady(true), 8000);
    return () => { cancelled = true; clearTimeout(t); cleanups.forEach((c) => c()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (maxCount === 0) return null;

  return (
    <div className="py-2">
      <Grid rows={rows} count={mobileCount} className="grid gap-2.5 md:hidden" sizes="50vw" ready={ready} />
      <Grid rows={rows} count={maxCount} className="hidden md:grid gap-3" sizes="14vw" ready={ready} />
    </div>
  );
}
