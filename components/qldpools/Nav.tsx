"use client";

import { useEffect, useState } from "react";

/* Nav: their own wave logo, no background bar, minimal.
   The hero starts white and ends as a full-bleed photo, so the mark and links
   flip ink -> white exactly while that photo covers the viewport, and back to
   ink over the white sections below. Tracking the hero's own geometry (rather
   than a fixed scroll threshold) keeps it right at any viewport height.
   Slides in when the intro lands. */

const LEFT = [
  { label: "Pool Range", href: "#" },
  { label: "Concrete Pools", href: "#" },
  { label: "Renovations", href: "#" },
];
const RIGHT = [
  { label: "Gallery", href: "#" },
  { label: "Reviews", href: "#" },
  { label: "Contact", href: "#" },
];
const ALL = [...LEFT, ...RIGHT];

export default function Nav({
  immediate = false,
  showLogo = false,
}: {
  immediate?: boolean;
  showLogo?: boolean;
} = {}) {
  const [revealed, setRevealed] = useState(immediate);
  const [menuOpen, setMenuOpen] = useState(false);
  // True only while the hero's photo has grown to cover the viewport.
  const [onImage, setOnImage] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("qpi-hero");
    if (!hero) return;
    const onScroll = () => {
      const r = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      // The arch finishes growing one viewport into the hero; the sticky inner
      // holds the photo until the hero's bottom passes the fold.
      const grown = -r.top > vh * 0.5;
      const stillPinned = r.bottom > vh;
      setOnImage(grown && stillPinned);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (immediate) return;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setRevealed(true);
      cleanup();
    };
    const onScroll = () => {
      if (window.scrollY > 40) reveal();
    };
    const w = window as unknown as { __qpiPreloaderLifted?: boolean };
    if (w.__qpiPreloaderLifted) {
      reveal();
      return;
    }
    window.addEventListener("qpi:intro-done", reveal);
    window.addEventListener("scroll", onScroll, { passive: true });
    const fallback = window.setTimeout(reveal, 5500);
    function cleanup() {
      window.removeEventListener("qpi:intro-done", reveal);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(fallback);
    }
    return cleanup;
  }, [immediate]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkClass = `qpi-caps text-[10px] whitespace-nowrap transition-colors duration-500 ${
    onImage ? "text-white/85 hover:text-white" : "text-[var(--qpi-ink)]/75 hover:text-[var(--qpi-blue)]"
  }`;

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[transform,background-color] duration-700 ease-out ${
        revealed ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex md:grid md:grid-cols-[1fr_auto_1fr] items-center h-16 px-5 md:px-8">
        {/* Left — desktop links; on mobile the logo sits here (top-left) */}
        <div className="flex items-center">
          <ul className="hidden md:flex items-center gap-7">
            {LEFT.map((l) => (
              <li key={l.label}>
                <a href={l.href} className={linkClass}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {showLogo && (
            <a href="/qldpools/site" className="md:hidden" aria-label="QLD Pool Installs, home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={onImage ? "/qldpools/logo-white.png" : "/qldpools/logo.png"}
                alt=""
                className="h-8 w-auto transition-opacity duration-500"
              />
            </a>
          )}
        </div>

        {/* Centre — their wave logo */}
        {showLogo ? (
          <a
            href="/qldpools/site"
            className="hidden md:block justify-self-center"
            aria-label="QLD Pool Installs, home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={onImage ? "/qldpools/logo-white.png" : "/qldpools/logo.png"}
              alt=""
              className="h-10 w-auto transition-opacity duration-500"
            />
          </a>
        ) : (
          <div className="hidden md:block w-px justify-self-center" />
        )}

        {/* Right — desktop links + mobile hamburger (top-right) */}
        <div className="flex items-center justify-end ml-auto md:ml-0">
          <ul className="hidden md:flex items-center gap-7">
            {RIGHT.map((l) => (
              <li key={l.label}>
                <a href={l.href} className={linkClass}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden w-8 h-8 flex flex-col items-end justify-center gap-[5px] relative z-[60]"
          >
            <span
              className={`block h-px transition-all duration-300 ${
                menuOpen
                  ? "w-6 rotate-45 translate-y-[3px] bg-[var(--qpi-ink)]"
                  : `w-6 ${onImage ? "bg-white" : "bg-[var(--qpi-ink)]"}`
              }`}
            />
            <span
              className={`block h-px transition-all duration-300 ${
                menuOpen
                  ? "w-6 -rotate-45 -translate-y-[3px] bg-[var(--qpi-ink)]"
                  : `w-4 ${onImage ? "bg-white" : "bg-[var(--qpi-ink)]"}`
              }`}
            />
          </button>
        </div>
      </div>
    </nav>

      {/* Mobile menu — full-screen solid white overlay (outside the transformed
          nav so `fixed` is relative to the viewport, not the bar) */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white flex flex-col px-6 pt-24 gap-1 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {ALL.map((l) => (
          <a
            key={l.label}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="qpi-caps text-[var(--qpi-ink)] text-2xl tracking-[0.06em] py-3 border-b border-[var(--qpi-ink)]/10"
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
