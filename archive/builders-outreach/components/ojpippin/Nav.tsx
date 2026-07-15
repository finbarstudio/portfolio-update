"use client";

import { useEffect, useState } from "react";

const LEFT = [
  { label: "What We Do", href: "/oj-pippin/site/what-we-do" },
  { label: "Home Designs", href: "/oj-pippin/site/designs" },
];
const RIGHT = [
  { label: "About", href: "/oj-pippin/site/about" },
  { label: "Contact", href: "/oj-pippin/site#contact" },
];
const ALL = [...LEFT, ...RIGHT];

/**
 * Transparent nav, no background. Text sits on a mix-blend-difference layer so
 * it stays legible over both the full-bleed imagery and the bone sections.
 * On the home page the wordmark is supplied by the travelling logo (HeroIntro);
 * elsewhere the nav renders its own centred wordmark.
 *
 *  - immediate:  show the links straight away (off = HeroIntro staggers them in)
 *  - showLogo:   render the centred wordmark (off on home, the logo travels in)
 */
export default function Nav({
  immediate = false,
  showLogo = false,
}: {
  immediate?: boolean;
  showLogo?: boolean;
} = {}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkClass =
    "text-[10px] tracking-[0.24em] uppercase whitespace-nowrap hover:opacity-50 transition-opacity duration-300";
  const enterCls = immediate ? "" : "nav-enter";
  const enterStyle = (idx: number) =>
    immediate ? undefined : ({ animationDelay: `${2.55 + idx * 0.07}s` } as const);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 nav-tinted">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 md:h-20 px-6 md:px-10">
          {/* Left */}
          <ul className="hidden md:flex items-center gap-8">
            {LEFT.map((l, i) => (
              <li key={l.label}>
                <a href={l.href} className={`${linkClass} ${enterCls}`} style={enterStyle(i)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Centre wordmark (off on home) */}
          {showLogo ? (
            <a
              href="/oj-pippin/site"
              className="col-start-2 justify-self-center wordmark text-[15px] leading-none"
            >
              OJ&nbsp;PIPPIN
            </a>
          ) : (
            <span className="col-start-2 justify-self-center" aria-hidden />
          )}

          {/* Right + hamburger */}
          <div className="col-start-3 flex items-center justify-end gap-8">
            <ul className="hidden md:flex items-center gap-8">
              {RIGHT.map((l, i) => (
                <li key={l.label}>
                  <a href={l.href} className={`${linkClass} ${enterCls}`} style={enterStyle(LEFT.length + i)}>
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
              className={`md:hidden w-8 h-8 flex flex-col items-end justify-center gap-[5px] ${enterCls}`}
              style={enterStyle(ALL.length)}
            >
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  menuOpen ? "w-6 rotate-45 translate-y-[3px]" : "w-6"
                }`}
              />
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  menuOpen ? "w-6 -rotate-45 -translate-y-[3px]" : "w-4"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu, solid bone, no blend */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-bone flex flex-col px-8 pt-28 gap-1 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {ALL.map((l) => (
          <a
            key={l.label}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="display text-ink text-4xl py-3"
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
