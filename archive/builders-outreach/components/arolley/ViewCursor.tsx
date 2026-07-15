"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Follow-cursor PILL: a small rounded pill that trails the pointer and shows a
 * label (with an arrow) over [data-cursor] elements; suppressed over
 * [data-cursor-skip]. Disabled on coarse pointers (touch).
 */
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
      } else setActive(false);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed left-0 top-0 z-[200] pointer-events-none will-change-transform"
    >
      {/* Position lives on the wrapper (rewritten every frame, no CSS transition,
          so the follow stays smooth). Appearance (opacity + scale pop) lives here
          on the pill, where a transition is safe. */}
      <span
        className="inline-flex items-center gap-2 rounded-full whitespace-nowrap"
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          padding: "9px 16px",
          fontFamily: "var(--font-braeden-body, var(--font-arolley-body), sans-serif)",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          transformOrigin: "center",
          opacity: active ? 1 : 0,
          transform: `scale(${active ? 1 : 0.7})`,
          transition: "opacity 0.22s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {label}
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 16 L16 8 M9.5 8 H16 V14.5" />
        </svg>
      </span>
    </div>
  );
}
