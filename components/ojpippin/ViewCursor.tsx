"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Follow-cursor badge: the label set in rotating type around a small ring with
 * an arrow at the centre. Shows over elements marked [data-cursor]; suppressed
 * over [data-cursor-skip] (e.g. the clickable thumbnails keep a normal pointer).
 */
export default function ViewCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("View Project");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;

    const pos = { x: -200, y: -200 };
    const cur = { x: -200, y: -200 };
    let raf = 0;

    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.28;
      cur.y += (pos.y - cur.y) * 0.28;
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
      } else {
        setActive(false);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const ringText = useMemo(() => {
    const unit = `${label.toUpperCase()}   •   `;
    const repeats = Math.max(2, Math.round(30 / unit.length));
    return unit.repeat(repeats);
  }, [label]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`fixed left-0 top-0 z-[200] pointer-events-none transition-[opacity] duration-200 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative w-[76px] h-[76px] flex items-center justify-center transition-transform duration-300 ${
          active ? "scale-100" : "scale-50"
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-[rgba(16,11,8,0.45)]" />
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ animation: "vcspin 10s linear infinite" }}
        >
          <defs>
            <path id="vc-path" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" fill="none" />
          </defs>
          <text
            fill="var(--cream)"
            style={{ fontFamily: "var(--font-hanken), sans-serif", fontSize: "8px", letterSpacing: "1.4px", fontWeight: 500 }}
          >
            <textPath xlinkHref="#vc-path" href="#vc-path">
              {ringText}
            </textPath>
          </text>
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="relative w-3.5 h-3.5"
          fill="none"
          stroke="var(--cream)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 16 L16 8 M9.5 8 H16 V14.5" />
        </svg>
      </div>
    </div>
  );
}
