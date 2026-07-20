"use client";

/**
 * BookCall — the conversion path. A pink "Book a call" pill pinned bottom-right
 * (the slot the sandbox link used to hold; sandbox now lives in the top nav),
 * opening the Cal.com overlay.
 *
 * Pin mechanics inherited from the old FooterNav: fixed bottom-right ABOVE the
 * copyright while you scroll, arriving with a masked slide-up, then docking
 * into its reserved line in the footer credit at the bottom. A hidden
 * placeholder keeps the line so the copyright sits neatly beneath.
 *
 * Clicking dispatches the same "contact:open" event the nav's Contact pill
 * uses — the merged popup (ContactPanel) holds the Cal booker, the form and
 * the direct links, so every path converges on one surface.
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MdAdsClick } from "@/components/MaterialIcon";

const PIN_BOTTOM = 42; // matches .sf-cta-pin { bottom: 42px } — sits above the ©

function Pill({ interactive, tab, onOpen }: { interactive: boolean; tab: number; onOpen?: (e: React.MouseEvent) => void }) {
  // The click glyph reads as an affordance: this pill IS the thing to click.
  // .sticker-pill is inline-flex with a gap, so it sits inline and never wraps.
  const inner = <>Free website <MdAdsClick size={15} /></>;
  if (!interactive) {
    // Placeholder: reserves the line + width, never interactive.
    return <span className="sticker-pill book-call-pill">{inner}</span>;
  }
  return (
    <button type="button" className="sticker-pill book-call-pill" tabIndex={tab} onClick={onOpen}>
      {inner}
    </button>
  );
}

export default function BookCall() {
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
    <span className="sf-cta" ref={anchorRef}>
      {/* Reserves the line + width in the footer credit (above the copyright). */}
      <span className="sf-cta-ph" aria-hidden="true">
        <Pill interactive={false} tab={-1} />
      </span>
      <span className={`sf-cta-pin ${shown ? "is-shown" : ""} ${docked ? "is-docked" : ""}`}>
        <span className="sf-cta-inner">
          <Pill
            interactive
            tab={shown ? 0 : -1}
            onOpen={(e) => window.dispatchEvent(new CustomEvent("contact:open", { detail: { x: e.clientX, y: e.clientY } }))}
          />
        </span>
      </span>
    </span>
  );
}
