"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Toggles html.brd-nav-dark while the nav line sits over a dark section
 * (data-tone="dark", e.g. the full-bleed hero image), so the wordmark + links
 * read paper over imagery and ink over the paper ground.
 */
export default function NavTone() {
  const pathname = usePathname();
  useEffect(() => {
    const navY = 40;
    let raf = 0;
    const update = () => {
      const darks = document.querySelectorAll<HTMLElement>('[data-tone="dark"]');
      let onDark = false;
      darks.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= navY && r.bottom >= navY) onDark = true;
      });
      document.documentElement.classList.toggle("brd-nav-dark", onDark);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    const timers = [60, 400, 1000].map((d) => window.setTimeout(update, d));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.documentElement.classList.remove("brd-nav-dark");
    };
  }, [pathname]);
  return null;
}
