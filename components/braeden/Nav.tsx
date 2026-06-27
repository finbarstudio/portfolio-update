"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BraedenLogoFull from "./BraedenLogoFull";
import { playOnIntro } from "./intro";

/**
 * Nav — magazine treatment. The logo sits top-left and stays there (it's the
 * hero's top-left mark too, so it reads as one thing); it fades in on the intro.
 * The other nav items don't show over the hero — they pop in once you've scrolled
 * past it. On non-home pages everything is present immediately. Mono throughout.
 */
const LINKS = [
  { label: "Projects", href: "/braeden/site/projects" },
  { label: "About", href: "/braeden/site/about" },
  { label: "Contact", href: "/braeden/site#contact" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoIn, setLogoIn] = useState(false);
  const [itemsIn, setItemsIn] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/braeden/site";

  const onLogoClick = (e: React.MouseEvent) => {
    if (!isHome) return;
    e.preventDefault();
    const lenis = (window as unknown as { __brdLenis?: { scrollTo: (t: number, o?: object) => void } }).__brdLenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Logo fades in with the intro (after the preloader lifts; immediately later).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLogoIn(true);
      return;
    }
    return playOnIntro(() => setLogoIn(true));
  }, []);

  // Nav items appear once you've scrolled most of the way past the hero (home
  // only). An IntersectionObserver on the hero is robust under Lenis (no reliance
  // on window scroll events): items show once the hero is <~20% in view.
  useEffect(() => {
    if (!isHome) {
      setItemsIn(true);
      return;
    }
    const onScroll = () => setItemsIn(window.scrollY > window.innerHeight * 0.82);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // IntersectionObserver as the primary signal (robust under Lenis); the scroll
    // listener is a fallback so the items can never get stranded hidden.
    let io: IntersectionObserver | undefined;
    const hero = document.querySelector(".bx-hero");
    if (hero) {
      io = new IntersectionObserver(
        ([entry]) => setItemsIn(entry.intersectionRatio < 0.2),
        { threshold: [0, 0.2, 0.6, 1] }
      );
      io.observe(hero);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, [isHome]);

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
        <div className="flex items-center justify-between h-16 md:h-20 px-[var(--gutter)]">
          <a
            href="/braeden/site"
            onClick={onLogoClick}
            aria-label="Braeden Constructions, home"
            className="transition-opacity duration-700 ease-out"
            style={{ opacity: logoIn ? 1 : 0 }}
          >
            <BraedenLogoFull variant="wordmark" className="h-[22px] md:h-[26px] w-auto" />
          </a>

          <div
            className="flex items-center gap-8 transition-[opacity,transform] duration-500 ease-out"
            style={{
              opacity: itemsIn ? 1 : 0,
              transform: itemsIn ? "none" : "translateY(-6px)",
              pointerEvents: itemsIn ? "auto" : "none",
            }}
          >
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
