"use client";

/**
 * StartingEleven — one half of the pitch drawn in thin lines, with the XI placed
 * by formation. On scroll-into-view it choreographs: the pitch lines draw
 * themselves, then each player cascades in — the 🚹 marker pops, then their
 * number+name, then club fade up — staggered across the team. Coords (x,y as % of
 * the half-pitch) come from content/worldcup.json.
 */

import { useEffect, useRef, useState } from "react";
import wc from "@/content/worldcup.json";

type Player = { name: string; num: number; club: string; badge: string; x: number; y: number };

export default function StartingEleven() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setInView(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const lineup = wc.lineup as Player[];
  return (
    <div ref={ref} className={`wc-pitch ${inView ? "is-in" : ""}`} role="img" aria-label={`England starting eleven, ${wc.formation}`}>
      <svg className="wc-pitch-lines" viewBox="0 0 68 56" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <g fill="none" stroke="var(--line)" strokeWidth="0.5">
          <rect x="1" y="1" width="66" height="54" pathLength={1} />
          <path d="M25 1 A 9 9 0 0 0 43 1" pathLength={1} />
          <rect x="13.8" y="38.5" width="40.4" height="16.5" pathLength={1} />
          <rect x="24.8" y="49.5" width="18.4" height="5.5" pathLength={1} />
          <path d="M27 38.5 A 9 9 0 0 1 41 38.5" pathLength={1} />
        </g>
        <circle cx="34" cy="1" r="0.6" fill="var(--line)" />
      </svg>
      {lineup.map((p, i) => (
        <span
          key={p.name}
          className="wc-player"
          style={{ left: `${p.x}%`, top: `${p.y}%`, "--i": i } as React.CSSProperties}
        >
          <span className="wc-player-icon" aria-hidden="true">{"\u{1F6B9}"}</span>
          <span className="wc-player-meta">
            <span className="wc-player-name">{p.name}</span>
            <span className="wc-player-sub">
              <span className="wc-player-num">{p.num}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="wc-player-badge" src={`/badges/${p.badge}.svg`} alt={p.club} width={16} height={16} />
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
