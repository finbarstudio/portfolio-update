"use client";

import { useEffect, useState } from "react";

/* SiteWindow — a small screen in the hero flicking through screenshots of the
   shipped sites. Hard-ish cuts (quick 0.2s fade) every couple of seconds, with
   the site's name as a small mono caption. Pauses politely for reduced motion
   (shows the first frame only). */

export type SiteShot = { src: string; label: string };

export default function SiteWindow({ shots, interval = 2000 }: { shots: SiteShot[]; interval?: number }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setPaused(true);
      return;
    }
    const t = window.setInterval(() => setI((v) => (v + 1) % shots.length), interval);
    return () => window.clearInterval(t);
  }, [shots.length, interval]);

  return (
    <figure aria-label="Screens from recent website builds">
      <div
        className="relative overflow-hidden border border-line"
        style={{ aspectRatio: "16 / 9", borderRadius: "4px" }}
      >
        {shots.map((s, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt={idx === i ? `${s.label} website` : ""}
            loading={idx === 0 ? "eager" : "lazy"}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
            style={{ opacity: paused ? (idx === 0 ? 1 : 0) : idx === i ? 1 : 0 }}
          />
        ))}
      </div>
    </figure>
  );
}
