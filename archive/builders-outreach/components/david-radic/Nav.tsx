"use client";

import { useEffect, useState } from "react";

const LEFT = [
  { label: "Our Homes", href: "/david-radic/site/portfolio" },
  { label: "The Process", href: "#" },
  { label: "About", href: "/david-radic/site/about" },
];
const RIGHT = [
  { label: "Awards", href: "#" },
  { label: "News", href: "#" },
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
    window.addEventListener("david-radic:intro-done", reveal);
    window.addEventListener("scroll", onScroll, { passive: true });
    const fallback = window.setTimeout(reveal, 5500);
    function cleanup() {
      window.removeEventListener("david-radic:intro-done", reveal);
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

  const linkClass =
    "violet text-[var(--ink)]/70 text-[10px] tracking-[0.18em] uppercase hover:text-[var(--black)] transition-colors whitespace-nowrap";

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm transition-transform duration-700 ease-out ${
        revealed ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex md:grid md:grid-cols-[1fr_auto_1fr] items-center h-14 px-5 md:px-8">
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
            <a
              href="/david-radic/site"
              className="md:hidden violet text-[var(--ink)] hover:text-[var(--black)] transition-colors text-sm tracking-[0.18em] whitespace-nowrap"
            >
              DAVID&nbsp;RADIC
            </a>
          )}
        </div>

        {/* Centre — desktop logo (on home the travelling logo lands here) */}
        {showLogo ? (
          <a
            href="/david-radic/site"
            className="hidden md:block justify-self-center violet text-[var(--ink)] hover:text-[var(--black)] transition-colors text-sm tracking-[0.18em] whitespace-nowrap"
          >
            DAVID&nbsp;RADIC
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
              className={`block h-px bg-[var(--ink)] transition-all duration-300 ${
                menuOpen ? "w-6 rotate-45 translate-y-[3px]" : "w-6"
              }`}
            />
            <span
              className={`block h-px bg-[var(--ink)] transition-all duration-300 ${
                menuOpen ? "w-6 -rotate-45 -translate-y-[3px]" : "w-4"
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
            className="violet text-[var(--ink)] text-2xl tracking-[0.06em] py-3 border-b border-[var(--ink)]/10"
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
