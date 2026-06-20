"use client";

/**
 * StartingEleven — one half of the pitch drawn in thin lines, with the XI placed
 * by formation. The whole thing is SCROLL-SCRUBBED: as you scroll the pitch into
 * view the lines draw themselves and the players cascade in, tied to scroll
 * progress (not a one-shot reveal). Coords (x,y as % of the half-pitch) come from
 * content/worldcup.json.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import wc from "@/content/worldcup.json";

type Player = { name: string; num: number; club: string; badge: string; x: number; y: number };

let registered = false;

export default function StartingEleven() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const lines = el.querySelectorAll<SVGElement>(".wc-pitch-lines g > *");
    const icons = el.querySelectorAll<HTMLElement>(".wc-player-icon");
    const metas = el.querySelectorAll<HTMLElement>(".wc-player-meta");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(lines, { strokeDashoffset: 0 });
      gsap.set([...icons, ...metas], { opacity: 1, scale: 1, y: 0 });
      return;
    }
    if (!registered) { gsap.registerPlugin(ScrollTrigger); registered = true; }

    const ctx = gsap.context(() => {
      gsap.set(lines, { strokeDashoffset: 1 });
      gsap.set(icons, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
      gsap.set(metas, { opacity: 0, y: 8 });

      // Scrubbed to the page's first stretch of scroll (the pitch sits high in a
      // sticky column, so a viewport-entry trigger would already be "done" on
      // load). Anchoring to absolute scroll means it draws as you scroll down.
      const tl = gsap.timeline({
        scrollTrigger: { start: 0, end: 760, scrub: 0.6 },
      });
      tl.to(lines, { strokeDashoffset: 0, ease: "none", duration: 1.2 }, 0);
      tl.to(icons, { opacity: 1, scale: 1, ease: "back.out(1.7)", duration: 0.6, stagger: 0.1 }, 0.5);
      tl.to(metas, { opacity: 1, y: 0, ease: "power2.out", duration: 0.5, stagger: 0.1 }, 0.8);
    }, ref);

    return () => ctx.revert();
  }, []);

  const lineup = wc.lineup as Player[];
  return (
    <div ref={ref} className="wc-pitch" role="img" aria-label={`England starting eleven, ${wc.formation}`}>
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
      {lineup.map((p) => (
        <span
          key={p.name}
          className="wc-player"
          style={{ left: `${p.x}%`, top: `${p.y}%` } as React.CSSProperties}
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
