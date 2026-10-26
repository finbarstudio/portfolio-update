"use client";

import { useEffect, type RefObject } from "react";

/**
 * On a phone the header and the tab bar eat half the screen. This watches the
 * page's scroller and sets data-chrome="hidden" on the app while the page
 * scrolls down, and "shown" on any scroll up (or near the end of the page).
 * CSS does the moving, with transforms, so nothing reflows. It never hides
 * while a popover is open, and never on a wide screen.
 */
export function useChromeOnScroll(anchor: RefObject<HTMLElement | null>, resetKey: string): void {
  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>(".ds-app");
    const scroller = root?.querySelector<HTMLElement>(".ds-main");
    if (!root || !scroller) return;
    const el = scroller;
    const host = root;
    let last = el.scrollTop;
    host.dataset.chrome = "shown";
    function set(hidden: boolean) {
      const next = hidden ? "hidden" : "shown";
      if (host.dataset.chrome !== next) host.dataset.chrome = next;
    }
    function onScroll() {
      const y = el.scrollTop;
      if (!window.matchMedia("(max-width: 700px)").matches || document.querySelector(".ds-pop")) {
        set(false);
        last = y;
        return;
      }
      if (Math.abs(y - last) < 8) return;
      const nearEnd = y + el.clientHeight >= el.scrollHeight - 80;
      set(y > last && y > 120 && !nearEnd);
      last = y;
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
    // A new page starts with everything showing.
  }, [anchor, resetKey]);
}
