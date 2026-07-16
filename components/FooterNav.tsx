"use client";

/**
 * FooterNav — the SB (Sandbox) shortcut, relocated out of the top nav.
 *
 * Mirrors FooterCopyright: a fixed pin sitting bottom-right ABOVE the copyright
 * while you scroll, arriving with a masked slide-up, then docking into its slot in
 * the footer credit (just above the copyright) once you reach the bottom. A hidden
 * placeholder reserves its line in the footer so the copyright sits neatly beneath.
 * Unlike the copyright this is a link, so the pin is interactive once shown.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import BrandWordmarkStacked from "./BrandWordmarkStacked";

const SANDBOX_HREF = "https://sandbox.finbar.studio";
const PIN_BOTTOM = 42; // matches .sf-nav-pin { bottom: 42px } — sits above the ©

/**
 * The sandbox link is now the mark and nothing else — no pill, no "SB", no
 * arrow bubble. At 3rem the stacked wordmark carries it on its own, and the
 * accessible name lives on the link rather than in visible text.
 */
function SandboxLink({ interactive, tab }: { interactive: boolean; tab: number }) {
  const mark = <BrandWordmarkStacked className="sf-nav-mark" />;
  if (!interactive) {
    // Placeholder: reserves the line + width, never interactive.
    return <span className="sf-nav-link">{mark}</span>;
  }
  return (
    <a href={SANDBOX_HREF} target="_blank" rel="noopener noreferrer" className="sf-nav-link" tabIndex={tab} aria-label="Sandbox (opens in a new tab)">
      {mark}
    </a>
  );
}

export default function FooterNav() {
  const pathname = usePathname();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);
  const [docked, setDocked] = useState(false);

  // Reveal gate: home shows it only after the intro logo scrolls up into the nav;
  // every other page shows it from the start.
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

  // Dock the moment the footer slot rises to the pin's resting line, so the fixed
  // pin lands exactly in place (a smooth slot-in, no disappear/reappear).
  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const check = () => {
      setDocked(el.getBoundingClientRect().bottom <= window.innerHeight - PIN_BOTTOM + 0.5);
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
    <span className="sf-nav" ref={anchorRef}>
      {/* Reserves the line + width in the footer credit (above the copyright). */}
      <span className="sf-nav-ph" aria-hidden="true">
        <SandboxLink interactive={false} tab={-1} />
      </span>
      <span className={`sf-nav-pin ${shown ? "is-shown" : ""} ${docked ? "is-docked" : ""}`}>
        <span className="sf-nav-inner">
          <SandboxLink interactive tab={shown ? 0 : -1} />
        </span>
      </span>
    </span>
  );
}
