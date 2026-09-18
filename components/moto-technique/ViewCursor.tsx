"use client";

import { useEffect, useRef } from "react";

/**
 * A small pill that follows the pointer and picks up its label from whatever
 * carries `data-cursor`. Pointer devices only, and it never runs on a phone.
 */
export default function ViewCursor() {
  const pill = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = pill.current;
    const text = label.current;
    if (!el || !text) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const hit = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (hit) {
        text.textContent = hit.dataset.cursor || "";
        el.dataset.on = "1";
      } else {
        el.dataset.on = "0";
      }
    };

    const tick = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={pill} className="mt-cursor" data-on="0" aria-hidden="true">
      <span ref={label} />
    </div>
  );
}
