"use client";

/**
 * WallpaperClient — the live Earth, compiled from Himawari-9 tiles.
 *
 * The satellite photographs the full disk every 10 minutes with Australia in
 * frame, so this IS live to the time of day: real clouds, real night side.
 * 550px tiles (an 8×8 grid = 4400px by default) are laid straight into a CSS
 * grid from NICT's servers; no canvas, no proxying of image bytes.
 *
 * Two stacked layers make updates seamless: the next frame's tiles preload
 * off-screen and the layers cross-fade only once all sixteen have decoded, so
 * the wallpaper never shows a half-loaded disk.
 *
 * Framing is tuned via URL params so Plash setups can be adjusted without a
 * redeploy: ?scale=1.6 (disk size, in multiples of the short viewport edge),
 * ?ox=-6&oy=22 (where Australia sits inside the disk, % from centre — the
 * point that gets pinned to the middle of the screen). ?scale=1 shows the
 * whole disk centred.
 */

import { useEffect, useRef, useState } from "react";
import "./wallpaper.css";

const BASE = "https://himawari8.nict.go.jp/img/D531106";
const POLL_MS = 5 * 60 * 1000;

// 8d = an 8×8 grid of 550px tiles → a 4400px disk, plenty for a retina
// desktop. ?res accepts 4/8/16/20 (NICT's published levels) to trade quality
// against bandwidth.
const DEFAULT_LEVEL = 8;
const LEVELS = [4, 8, 16, 20];

// Whole disk centred with a little space around it — desktop-wallpaper
// framing. ?scale/?ox/?oy still allow an Australia close-up (e.g.
// ?scale=1.6&ox=-6&oy=22 pins Australia to the centre of the screen).
const DEFAULT_SCALE = 0.92;
const DEFAULT_OX = 0;
const DEFAULT_OY = 0;

function tileUrls(date: string, level: number): string[] {
  // "2026-08-24 09:30:00" → "2026/08/24/093000"
  const [d, t] = date.split(" ");
  const path = `${d.replaceAll("-", "/")}/${t.replaceAll(":", "")}`;
  const urls: string[] = [];
  for (let y = 0; y < level; y++) {
    for (let x = 0; x < level; x++) urls.push(`${BASE}/${level}d/550/${path}_${x}_${y}.png`);
  }
  return urls;
}

function preload(urls: string[]): Promise<void> {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(src));
          img.src = src;
        }),
    ),
  ).then(() => undefined);
}

function Disk({ urls }: { urls: string[] }) {
  return (
    <>
      {urls.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt="" draggable={false} />
      ))}
    </>
  );
}

export default function WallpaperClient() {
  const [frames, setFrames] = useState<{ date: string; urls: string[]; level: number }[]>([]);
  const dateRef = useRef<string | null>(null);
  const [view, setView] = useState({ scale: DEFAULT_SCALE, ox: DEFAULT_OX, oy: DEFAULT_OY });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const num = (key: string, fallback: number) => {
      const v = parseFloat(q.get(key) ?? "");
      return Number.isFinite(v) ? v : fallback;
    };
    setView({ scale: num("scale", DEFAULT_SCALE), ox: num("ox", DEFAULT_OX), oy: num("oy", DEFAULT_OY) });
    const reqLevel = num("res", DEFAULT_LEVEL);
    const level = LEVELS.includes(reqLevel) ? reqLevel : DEFAULT_LEVEL;

    let cancelled = false;

    const refresh = async () => {
      try {
        const res = await fetch("/wallpaper/latest");
        const { date } = (await res.json()) as { date: string };
        if (cancelled || !date || date === dateRef.current) return;
        const urls = tileUrls(date, level);
        await preload(urls);
        if (cancelled) return;
        dateRef.current = date;
        // Keep the outgoing frame underneath while the new one fades in.
        setFrames((prev) => [...prev.slice(-1), { date, urls, level }]);
      } catch {
        // Feed hiccup — keep showing the current frame, try again next poll.
      }
    };

    refresh();
    const timer = setInterval(refresh, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <div className="wp-space">
      {frames.map((f, i) => (
        <div
          key={f.date}
          className={`wp-disk ${i === frames.length - 1 ? "is-front" : ""}`}
          style={{
            width: `calc(min(100vw, 100svh) * ${view.scale})`,
            transform: `translate(calc(-50% - ${view.ox}%), calc(-50% - ${view.oy}%))`,
            gridTemplateColumns: `repeat(${f.level}, 1fr)`,
          }}
        >
          <Disk urls={f.urls} />
        </div>
      ))}
    </div>
  );
}
