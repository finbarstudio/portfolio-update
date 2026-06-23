"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Flips html.nav-light when the nav line sits over a light section, so the
 * wordmark and links read brown over cream and cream over dark. Sections that
 * are dark carry data-tone="dark"; everything else is treated as light.
 */
export default function NavTone() {
  const pathname = usePathname();

  useEffect(() => {
    const navY = 32; // nav vertical centre
    let raf = 0;

    const update = () => {
      const darks = document.querySelectorAll<HTMLElement>('[data-tone="dark"]');
      let onDark = false;
      darks.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= navY && r.bottom >= navY) onDark = true;
      });
      document.documentElement.classList.toggle("nav-light", !onDark);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    const timers = [80, 400, 1000].map((d) => window.setTimeout(update, d));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.documentElement.classList.remove("nav-light");
    };
  }, [pathname]);

  return null;
}
