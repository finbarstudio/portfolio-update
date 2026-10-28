"use client";

import { useEffect, useRef } from "react";
import { boot } from "./boot";
import { APP_MARKUP } from "./markup";

/**
 * Dad's Shop: the Tesco helper's page, running on Dad's Sainsbury's data.
 *
 * The page is vanilla DOM code (boot.ts), so React only owns an empty root div. The
 * effect injects the markup and boots the script. Cleanup aborts the script (its
 * listeners and timers all hang off the signal) and empties the root, so React's
 * dev double-run (mount, unmount, mount) leaves exactly one live copy.
 */
export default function DadApp() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const stop = new AbortController();
    el.innerHTML = APP_MARKUP;
    boot(el, stop.signal).catch((err: unknown) => {
      if (stop.signal.aborted) return;
      console.error("Dad's Shop failed to start", err);
      const msg = el.querySelector("#grid");
      if (msg) msg.innerHTML = "<p>Couldn't load the products. Check the connection and reload the page.</p>";
    });
    return () => {
      stop.abort();
      el.innerHTML = "";
      el.className = "dad-app";
    };
  }, []);

  return <div ref={root} className="dad-app" />;
}
