"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * On a phone, a tall header takes half the screen. This says "hide it" while
 * the page scrolls down and "show it" on any scroll up. It never hides while a
 * popover is open.
 */
export function useHideOnScroll(ref: RefObject<HTMLElement | null>): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const scroller = ref.current?.closest<HTMLElement>(".ds-main");
    if (!scroller) return;
    let last = scroller.scrollTop;
    function onScroll() {
      const el = scroller;
      if (!el) return;
      const y = el.scrollTop;
      if (!window.matchMedia("(max-width: 700px)").matches || document.querySelector(".ds-pop")) {
        setHidden(false);
        last = y;
        return;
      }
      if (Math.abs(y - last) < 8) return;
      setHidden(y > last && y > 160);
      last = y;
    }
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [ref]);

  return hidden;
}
