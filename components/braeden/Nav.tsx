"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BraedenLogoFull from "./BraedenLogoFull";
import { playOnIntro } from "./intro";

const LEFT = [
  { label: "Projects", href: "/braeden/site/projects" },
  { label: "About", href: "/braeden/site/about" },
];
const RIGHT = [
  { label: "Contact", href: "/braeden/site#contact" },
];
const ALL = [...LEFT, ...RIGHT];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/braeden/site";

  // Pop the bar in (mask reveal) when the intro fires — after the preloader lifts
  // on first load, immediately on later navigation, with a guaranteed fallback.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    return playOnIntro(() => setShown(true));
  }, []);

  const onLogoClick = (e: React.MouseEvent) => {
    if (!isHome) return; // other pages: let it navigate home
    e.preventDefault();
    const lenis = (window as unknown as { __brdLenis?: { scrollTo: (t: number, o?: object) => void } }).__brdLenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const link = "text-[10px] tracking-[0.24em] uppercase whitespace-nowrap hover:opacity-50 transition-opacity duration-300";

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 nav-tinted">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 md:h-20 px-[var(--gutter)] brd-mask" data-revealed={shown ? "1" : undefined}>
          <ul className="hidden md:flex items-center gap-8">
            {LEFT.map((l) => (
              <li key={l.label}><a href={l.href} className={link}>{l.label}</a></li>
            ))}
          </ul>

          <a href="/braeden/site" onClick={onLogoClick} className="col-start-2 justify-self-center" aria-label="Braeden Constructions, home">
            <BraedenLogoFull variant="wordmark" className="h-[22px] md:h-[26px] w-auto" />
          </a>

          <div className="col-start-3 flex items-center justify-end gap-8">
            <ul className="hidden md:flex items-center gap-8">
              {RIGHT.map((l) => (
                <li key={l.label}><a href={l.href} className={link}>{l.label}</a></li>
              ))}
            </ul>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden w-8 h-8 flex flex-col items-end justify-center gap-[5px]"
            >
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "w-6 rotate-45 translate-y-[3px]" : "w-6"}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? "w-6 -rotate-45 -translate-y-[3px]" : "w-4"}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`md:hidden fixed inset-0 z-40 flex flex-col px-8 pt-28 gap-1 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: "var(--paper)" }}
      >
        {ALL.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="display text-4xl py-3">
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
