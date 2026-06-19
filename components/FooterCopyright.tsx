"use client";

/**
 * FooterCopyright — the single "© {year} finbarstudio" notice.
 *
 * It's pinned bottom-right of the viewport while scrolling (on the home page it
 * only appears once the intro logo has gone up into the nav), comes in with a
 * masked reveal, and DOCKS into its slot in the footer credit when you reach the
 * bottom — so there's exactly one copyright, never a duplicate. A hidden
 * placeholder reserves its line in the footer so the "design and build" sits
 * neatly beneath it.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function FooterCopyright({ year }: { year: number }) {
  const pathname = usePathname();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  const [docked, setDocked] = useState(false);

  // Reveal gate: home shows it only after the intro logo scrolls up into the
  // nav; every other page shows it from the start.
  useEffect(() => {
    if (pathname !== "/") { setShown(true); return; }
    setShown(false);
    const update = () => setShown(window.scrollY > window.innerHeight * 0.7);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  // Dock into the footer slot once it's reached.
  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setDocked(e.isIntersecting), { threshold: 1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span className="sf-copyright" ref={anchorRef}>
      {/* Reserves the line in the footer credit so "design and build" sits below. */}
      <span className="sf-copyright-ph" aria-hidden="true">© {year} finbarstudio</span>
      <span className={`sf-copyright-pin ${shown ? "is-shown" : ""} ${docked ? "is-docked" : ""}`}>
        <span className="sf-copyright-inner">© {year} finbarstudio</span>
      </span>
    </span>
  );
}
