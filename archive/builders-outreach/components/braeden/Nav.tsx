"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BraedenLogoFull from "./BraedenLogoFull";
import { playOnIntro } from "./intro";

/**
 * Nav — magazine treatment. The logo sits top-left (it's the hero's top-left mark
 * too, so it reads as one thing), the items sit right. Both fade in together on
 * the intro and stay visible over the hero and everywhere after. Mono throughout;
 * NavTone flips it ink/paper over light vs dark sections.
 */
const LINKS = [
  { label: "Projects", href: "/braeden/site/projects" },
  { label: "About", href: "/braeden/site/about" },
  { label: "Contact", href: "/braeden/site#contact" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/braeden/site";

  const onLogoClick = (e: React.MouseEvent) => {
    if (!isHome) return;
    e.preventDefault();
    const lenis = (window as unknown as { __brdLenis?: { scrollTo: (t: number, o?: object) => void } }).__brdLenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Logo + items fade in together on the intro (after the preloader lifts on first
  // load, immediately on later navigation).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    return playOnIntro(() => setShown(true));
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const link = "ff-mono text-[11px] tracking-[0.2em] uppercase whitespace-nowrap hover:opacity-50 transition-opacity duration-300";

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 nav-tinted">
        <div
          className="flex items-center justify-between h-16 md:h-20 px-[var(--gutter)] transition-opacity duration-700 ease-out"
          style={{ opacity: shown ? 1 : 0 }}
        >
          <a href="/braeden/site" onClick={onLogoClick} aria-label="Braeden Constructions, home">
            <BraedenLogoFull variant="wordmark" className="h-[22px] md:h-[26px] w-auto" />
          </a>

          <div className="flex items-center gap-8">
            <ul className="hidden md:flex items-center gap-8">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={link}>{l.label}</a>
                </li>
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
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="ff-mono uppercase tracking-[0.18em] text-xl py-3">
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
