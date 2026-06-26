"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Follow-cursor badge: a label set around a ring with an arrow at the centre.
 * Appears over [data-cursor] elements; suppressed over [data-cursor-skip].
 * Disabled on coarse pointers (touch).
 */
const R = 36;
const CIRC = 2 * Math.PI * R;

export default function ViewCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("View");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const pos = { x: -200, y: -200 };
    const cur = { x: -200, y: -200 };
    let raf = 0;
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.3;
      cur.y += (pos.y - cur.y) * 0.3;
      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = e.target as HTMLElement | null;
      const hit = t?.closest<HTMLElement>("[data-cursor]");
      const skip = t?.closest<HTMLElement>("[data-cursor-skip]");
      if (hit && !skip) {
        setActive(true);
        setLabel(hit.dataset.cursor || "View");
      } else setActive(false);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const L = label.toUpperCase();
  const ring = `${L} • ${L} • `;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`fixed left-0 top-0 z-[200] pointer-events-none transition-opacity duration-200 ${active ? "opacity-100" : "opacity-0"}`}
    >
      <div className={`relative w-[92px] h-[92px] flex items-center justify-center transition-transform duration-300 ${active ? "scale-100" : "scale-50"}`}>
        <div className="absolute inset-0 rounded-full" style={{ background: "color-mix(in srgb, var(--ink) 90%, transparent)" }} />
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ animation: "arlSpin 11s linear infinite" }}>
          <defs>
            <path id="arl-vc-path" d={`M50,50 m-${R},0 a${R},${R} 0 1,1 ${R * 2},0 a${R},${R} 0 1,1 -${R * 2},0`} fill="none" />
          </defs>
          <text fill="var(--paper)" style={{ fontFamily: "var(--font-arolley-body), sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.04em" }}>
            <textPath xlinkHref="#arl-vc-path" href="#arl-vc-path" startOffset="0" textLength={CIRC} lengthAdjust="spacingAndGlyphs">
              {ring}
            </textPath>
          </text>
        </svg>
        <svg viewBox="0 0 24 24" className="relative w-4 h-4" fill="none" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 16 L16 8 M9.5 8 H16 V14.5" />
        </svg>
      </div>
    </div>
  );
}
