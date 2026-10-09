"use client";

import { useEffect, useRef, useState } from "react";

/** How long the pointer rests on something before its tip shows. */
const DELAY_MS = 350;
/** Gap between the thing and its tip, and between the tip and the window edge. */
const GAP = 8;

interface Tip {
  text: string;
  /** Centre of the target, and its top and bottom edges, in window pixels. */
  x: number;
  top: number;
  bottom: number;
}

/**
 * The nearest element under the pointer that has something to say. A native
 * `title` is moved to `data-tip` on first sight, so the browser's own slow
 * tooltip never shows as well; anything it was naming keeps that name.
 */
function tipTarget(from: EventTarget | null): HTMLElement | null {
  if (!(from instanceof Element)) return null;
  const target = from.closest<HTMLElement>("[title], [data-tip]");
  if (!target) return null;
  const title = target.getAttribute("title");
  if (title) {
    target.dataset.tip = title;
    target.removeAttribute("title");
    if (!target.getAttribute("aria-label") && !target.textContent?.trim())
      target.setAttribute("aria-label", title);
  }
  return target.dataset.tip ? target : null;
}

/**
 * One tooltip for the whole app. Mount it once: anything with a `title` (or a
 * `data-tip`) gets a tip in the app's own style after a short rest of the
 * pointer, or at once when reached with the keyboard.
 */
export function Tooltips() {
  const [tip, setTip] = useState<Tip | null>(null);
  const [left, setLeft] = useState(0);
  const bubble = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer = 0;
    let current: HTMLElement | null = null;

    function hide() {
      window.clearTimeout(timer);
      current = null;
      setTip(null);
    }

    function show(target: HTMLElement, delay: number) {
      if (target === current) return;
      window.clearTimeout(timer);
      current = target;
      setTip(null);
      timer = window.setTimeout(() => {
        const text = target.dataset.tip;
        if (!text || !target.isConnected) return;
        const box = target.getBoundingClientRect();
        setTip({
          text,
          x: box.left + box.width / 2,
          top: box.top,
          bottom: box.bottom,
        });
      }, delay);
    }

    function onOver(event: PointerEvent) {
      // A finger has no hover; a tip would only get in the way of the tap.
      if (event.pointerType === "touch") return;
      const target = tipTarget(event.target);
      if (target) show(target, DELAY_MS);
      else hide();
    }
    function onFocus(event: FocusEvent) {
      const target = tipTarget(event.target);
      if (target?.matches(":focus-visible")) show(target, 0);
    }

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerdown", hide);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", hide);
    document.addEventListener("keydown", hide);
    document.addEventListener("scroll", hide, true);
    window.addEventListener("blur", hide);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", hide);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", hide);
      document.removeEventListener("keydown", hide);
      document.removeEventListener("scroll", hide, true);
      window.removeEventListener("blur", hide);
    };
  }, []);

  // Once the tip is in the page its width is known, so it can be kept inside the window.
  useEffect(() => {
    if (!tip || !bubble.current) return;
    const width = bubble.current.offsetWidth;
    setLeft(
      Math.max(
        GAP,
        Math.min(window.innerWidth - width - GAP, tip.x - width / 2),
      ),
    );
  }, [tip]);

  if (!tip) return null;
  // Below the target unless that would run off the bottom of the window.
  const below = tip.bottom + GAP + 40 < window.innerHeight;

  return (
    <div
      ref={bubble}
      role="tooltip"
      className="pointer-events-none fixed z-50 max-w-60 rounded-ms-control border border-ms-line bg-ms-raised px-2 py-1 text-[11px] text-ms-ink shadow-lg"
      style={{
        left,
        top: below ? tip.bottom + GAP : undefined,
        bottom: below ? undefined : window.innerHeight - tip.top + GAP,
      }}
    >
      {tip.text}
    </div>
  );
}
