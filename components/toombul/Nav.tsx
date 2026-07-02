"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "/toombul#story", label: "Story" },
  { href: "/toombul/club", label: "The Club" },
  { href: "/toombul/merch", label: "Merch" },
  { href: "/toombul#contact", label: "Contact" },
];

export default function Nav({ forceSolid = false }: { forceSolid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const solid = forceSolid || scrolled;

  useEffect(() => {
    if (forceSolid) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceSolid]);

  return (
    <header className="tc-nav" data-solid={solid}>
      <a href="/toombul#top" className="tc-nav-brand" aria-label="Toombul District Cricket Club, back to top">
        <img src="/toombul/logo.svg" alt="" className="tc-nav-crest" />
        <span className="tc-nav-word" style={{ color: solid ? undefined : "#fff" }}>
          Toombul
          <small style={{ color: solid ? undefined : "rgba(255,255,255,0.75)" }}>District Cricket Club</small>
        </span>
      </a>
      <nav className="tc-nav-links" style={{ color: solid ? "var(--ink)" : "#fff" }}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <a href="/toombul#contact" className="tc-cta-pill">
        Get Involved
      </a>
    </header>
  );
}
