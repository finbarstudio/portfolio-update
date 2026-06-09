"use client";

import { useEffect, useState } from "react";

/**
 * Staggered, post-load mount scheduling for heavy (WebGL) thumbnails.
 *
 * Several 3D canvases initialising at once during the initial render blocks the
 * main thread — poor LCP and scroll jank. `useAppReady` resolves only after the
 * page has loaded + gone idle, and then hands out "mount slots" one at a time
 * (STAGGER apart) so the canvases spin up sequentially instead of in a burst.
 * Each component latches `ready` to true on its first slot and keeps it, so
 * later scroll-in mounts are immediate.
 */

const STAGGER = 300; // ms between successive canvas mounts

let chain: Promise<void> | null = null;

function afterLoadIdle(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    const idle = () => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void })
        .requestIdleCallback;
      if (ric) ric(() => resolve(), { timeout: 600 });
      else setTimeout(resolve, 150);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

function nextSlot(): Promise<void> {
  const start = chain ?? (chain = afterLoadIdle());
  const mine = start;
  chain = start.then(() => new Promise((r) => setTimeout(r, STAGGER)));
  return mine;
}

export function useAppReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    nextSlot().then(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, []);
  return ready;
}
