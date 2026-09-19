"use client";

import { useEffect, useRef } from "react";

/**
 * The cursor. Two states, no pill behind either.
 *
 *   data-cursor="View"          the word, set in the title face
 *   data-cursor-shape="next"    a triangle pointing right
 *   data-cursor-shape="prev"    the same triangle, mirrored
 *
 * Both are white with a hairline black edge (see the stylesheet), so they read
 * over a photograph and over a white section alike. Pointer devices only, so it
 * never runs on a phone.
 *
 * With reduced motion it still runs, it just stops easing and sits exactly on
 * the pointer. It must not switch off: the stylesheet hides the native cursor
 * over these elements, so bailing out here would leave no cursor at all.
 */
export default function ViewCursor() {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = root.current;
    const text = word.current;
    if (!el || !text) return;

    const ease = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0.2;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const hit = (e.target as HTMLElement | null)?.closest?.<HTMLElement>("[data-cursor], [data-cursor-shape]");
      if (!hit) {
        el.dataset.on = "0";
        return;
      }
      const shape = hit.dataset.cursorShape;
      el.dataset.shape = shape || "word";
      if (!shape) text.textContent = hit.dataset.cursor || "";
      el.dataset.on = "1";
    };

    // Leaving the window should not strand the cursor at the edge.
    const leave = () => {
      el.dataset.on = "0";
    };

    const tick = () => {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} className="mt-cursor" data-on="0" data-shape="word" aria-hidden="true">
      <span ref={word} className="mt-cursor-word" />
      <svg className="mt-cursor-arrow" viewBox="0 0 24 24">
        <polygon points="6,3 21,12 6,21" />
      </svg>
    </div>
  );
}
