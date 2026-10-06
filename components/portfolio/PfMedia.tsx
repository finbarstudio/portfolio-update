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
 * the element as a local address. Four files download at a time, in page order, except that a project picked
 * from the project list jumps the queue.
 *
 * On a phone, clips are left to stream the normal way: holding every clip of
 * the portfolio in memory at once is too much for a phone. Images still get
 * the bar. If a scripted download fails for any reason, the element falls back
 * to loading the file itself, so nothing is ever left blank.
 */

const MAX = 4;
let active = 0;
const waiting: { go: () => void; group?: string }[] = [];

/**
 * The project the reader has jumped to from the project list (the address ends
 * in #its-id). Its files go to the front of the queue, so the pages they are
 * about to look at arrive before the ones they skipped.
 */
let first = "";
if (typeof window !== "undefined") {
  const read = () => (first = decodeURIComponent(window.location.hash.slice(1)));
  read();
  window.addEventListener("hashchange", read);
}

/** Wait for a download slot. Resolves with the function that gives it back. */
function slot(group?: string): Promise<() => void> {
  return new Promise((resolve) => {
    const go = () => {
      active += 1;
      resolve(() => {
        active -= 1;
        const i = first ? waiting.findIndex((w) => w.group === first) : -1;
        waiting.splice(Math.max(i, 0), 1)[0]?.go();
      });
    };
    if (active < MAX) go();
    else waiting.push({ go, group });
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

export default function PfMedia({ src: dark, light, video, alt, w, h, group }: { src: string; light?: string; video?: boolean; alt?: string; w: number; h: number; group?: string }) {
  // A piece can have a second file for the page's light theme. It is swapped
  // the moment the theme switch is flipped (it sets data-pf-theme on <html>).
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    if (!light) return;
    const read = () => setIsLight(document.documentElement.dataset.pfTheme === "light");
    read();
    const watch = new MutationObserver(read);
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-pf-theme"] });
    return () => watch.disconnect();
  }, [light]);
  const src = light && isLight ? light : dark;
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
    setShown(false);
    setUrl(null);
    setPct(0);
    let dead = false;
    let made: string | null = null;
    const stop = new AbortController();
    (async () => {
      const release = await slot(group);
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
