"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A follow-cursor "View Project" bubble. Shows whenever the pointer is over an
 * element marked with [data-cursor-view]. Those elements should set cursor:none
 * (see the `cursor-none` utility on them).
 */
export default function ViewCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("View Project");

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = ref.current;
    if (!el) return;

    const pos = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;

    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.2;
      cur.y += (pos.y - cur.y) * 0.2;
      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const hit = t?.closest<HTMLElement>("[data-cursor]");
      if (hit) {
        setActive(true);
        setLabel(hit.dataset.cursor || "View Project");
      } else {
        setActive(false);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`fixed left-0 top-0 z-[200] pointer-events-none violet uppercase tracking-[0.15em] text-[10px] whitespace-nowrap text-white bg-[var(--ink)] rounded-full px-4 py-3 transition-[opacity,scale] duration-300 ${
        active ? "opacity-100 scale-100" : "opacity-0 scale-75"
      }`}
    >
      {label}
    </div>
  );
}
