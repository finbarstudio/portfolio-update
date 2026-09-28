"use client";

import { useEffect, useState } from "react";
import Wordmark from "./Wordmark";

/**
 * Fixed nav on three columns: links left, the wordmark centred at the top,
 * phone + quote button right; a full screen mobile menu under a hamburger
 * below the md breakpoint. Locks body scroll while the mobile menu is open,
 * closes on link click and on Escape.
 *
 * `overHero`: on the home page the bar starts transparent with white type over
 * the full-bleed photo, and turns solid white once the hero has scrolled past.
 */
export default function Nav({
  nav,
  phone,
  phoneHref,
  overHero = false,
}: {
  nav: { label: string; href: string }[];
  phone: string;
  phoneHref: string;
  overHero?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(!overHero);

  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="ll-nav" data-solid={solid || open ? "1" : "0"}>
        <div className="ll-nav-inner">
          <nav className="ll-nav-links" aria-label="Primary">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="ll-nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ll-nav-mark">
            <Wordmark href="/lloyd-lundie" />
          </div>

          <div className="ll-nav-right">
            <a href={phoneHref} className="ll-nav-phone">
              {phone}
            </a>
            <a href="/lloyd-lundie#contact" className="ll-nav-cta">
              Get a quote
            </a>
            <button
              type="button"
              className="ll-nav-burger"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span data-open={open ? "1" : "0"} />
              <span data-open={open ? "1" : "0"} />
            </button>
          </div>
        </div>
      </header>

      <div className="ll-menu" data-open={open ? "1" : "0"}>
        <nav className="ll-menu-nav" aria-label="Mobile">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ll-menu-foot">
          <a href={phoneHref}>{phone}</a>
          <a href="/lloyd-lundie#contact" className="ll-menu-cta" onClick={() => setOpen(false)}>
            Get a quote
          </a>
        </div>
      </div>
    </>
  );
}
