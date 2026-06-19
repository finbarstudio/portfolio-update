"use client";

/**
 * StickyCredit — a small "© {year} finbarstudio" pinned to the bottom-right of
 * every page. On the home page it stays hidden until you've scrolled past the
 * first screen (the intro wordmark has gone up into the nav), then it's there
 * for good — it doesn't fade at the footer (the footer credit already sits in
 * the same right-aligned spot).
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function StickyCredit() {
  const [year, setYear] = useState(2026);
  const [shown, setShown] = useState(false);
  const pathname = usePathname();

  useEffect(() => setYear(new Date().getFullYear()), []);

  useEffect(() => {
    if (pathname !== "/") { setShown(true); return; }
    // Home: reveal once the intro logo has scrolled up into the nav.
    const update = () => setShown(window.scrollY > window.innerHeight * 0.7);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <div className={`sticky-credit ${shown ? "" : "is-hidden"}`} aria-hidden="true">
      © {year} finbarstudio
    </div>
  );
}
