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

  // Desktop: dock the moment the footer slot rises to the pin's resting line, so
  // the fixed pin lands exactly in place (a smooth slot-in, no disappear/reappear).
  // Tablet/mobile: the footer already shows its own copy, so just slide the floater
  // away as soon as you reach the footer (the HR line enters the viewport).
  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const rule = el.closest(".site-footer")?.querySelector<HTMLElement>(".site-footer-rule");
    if (!rule) return;
    const PIN_BOTTOM = 16; // matches .sf-copyright-pin { bottom: 16px }
    const check = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setDocked(el.getBoundingClientRect().bottom <= window.innerHeight - PIN_BOTTOM + 0.5);
      } else {
        setDocked(rule.getBoundingClientRect().top <= window.innerHeight);
      }
    };
    check();
    const lenis = window.__lenis;
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    lenis?.on?.("scroll", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      lenis?.off?.("scroll", check);
    };
  }, [pathname]);

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
