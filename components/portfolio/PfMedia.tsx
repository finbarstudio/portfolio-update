"use client";

import { useEffect, useRef, useState } from "react";
import { corsMedia } from "@/lib/media";

/**
 * One image or clip on /portfolio, loaded in full as soon as the page opens,
 * with a thin bar and a percentage while it comes down.
 *
 * Everything on the page loads up front, not as it scrolls into view: the
 * opening pages are text, so by the time a reader reaches the work it is
 * already there at full quality. To show a real percentage the file is fetched
 * by script (a plain <img> or <video> reports no progress) and then handed to
 * the element as a local address. Four files download at a time, in page order.
 *
 * On a phone, clips are left to stream the normal way: holding every clip of
 * the portfolio in memory at once is too much for a phone. Images still get
 * the bar. If a scripted download fails for any reason, the element falls back
 * to loading the file itself, so nothing is ever left blank.
 */

const MAX = 4;
let active = 0;
const waiting: (() => void)[] = [];

/** Wait for a download slot. Resolves with the function that gives it back. */
function slot(): Promise<() => void> {
  return new Promise((resolve) => {
    const go = () => {
      active += 1;
      resolve(() => {
        active -= 1;
        waiting.shift()?.();
      });
    };
    if (active < MAX) go();
    else waiting.push(go);
  });
}

async function download(url: string, onProgress: (pct: number | null) => void, signal: AbortSignal): Promise<string> {
  // On the dev server, always check for a newer file: a hard refresh does not
  // clear what a scripted download has cached, so a replaced video kept showing.
  const res = await fetch(url, { signal, cache: process.env.NODE_ENV === "development" ? "reload" : "default" });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
  const total = Number(res.headers.get("content-length")) || 0;
  if (!total) onProgress(null); // no size given: the bar runs without a number
  const reader = res.body.getReader();
  const chunks: BlobPart[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    got += value.length;
    if (total) onProgress(Math.min(99, Math.floor((got / total) * 100)));
  }
  return URL.createObjectURL(new Blob(chunks, { type: res.headers.get("content-type") ?? "" }));
}

export default function PfMedia({ src, video, alt, w, h }: { src: string; video?: boolean; alt?: string; w: number; h: number }) {
  /** 0 to 99 while downloading; null when the size is unknown. */
  const [pct, setPct] = useState<number | null>(0);
  const [url, setUrl] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const clip = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video && window.matchMedia("(max-width: 760px)").matches) {
      setPct(null);
      setUrl(src);
      return;
    }
    let dead = false;
    let made: string | null = null;
    const stop = new AbortController();
    (async () => {
      const release = await slot();
      try {
        if (dead) return;
        made = await download(corsMedia(src), (p) => !dead && setPct(p), stop.signal);
        if (dead) URL.revokeObjectURL(made);
        else setUrl(made);
      } catch {
        if (!dead) {
          setPct(null);
          setUrl(src);
        }
      } finally {
        release();
      }
    })();
    return () => {
      dead = true;
      stop.abort();
      if (made) URL.revokeObjectURL(made);
    };
  }, [src, video]);

  // Clips play only while on screen.
  useEffect(() => {
    const v = clip.current;
    if (!v || !url) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [url]);

  return (
    <>
      {url && video ? (
        <video ref={clip} src={url} muted loop playsInline preload="auto" data-in={shown ? "1" : "0"} onLoadedData={() => setShown(true)} />
      ) : url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt ?? ""} width={w} height={h} decoding="async" data-in={shown ? "1" : "0"} onLoad={() => setShown(true)} />
      ) : null}
      {!shown && (
        <div className="pf-load" role="progressbar" aria-label="Loading" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct ?? undefined}>
          <span className="pf-load-n">{pct === null ? "Loading" : `${pct}%`}</span>
          <span className="pf-load-bar" data-open={pct === null ? "1" : "0"}>
            <i style={{ transform: `scaleX(${(pct ?? 100) / 100})` }} />
          </span>
        </div>
      )}
    </>
  );
}
