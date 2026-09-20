"use client";

import { useEffect, useRef } from "react";

/**
 * The footer, and the only thing after the services.
 *
 * White. Three columns, each the same three rows deep (a label, then two lines
 * or links, then a last one), so they end level instead of ragged: the address
 * is on two lines rather than five, and nothing here is set in the title face.
 *
 * Then the name, as wide as the footer's own margins allow and the same margin
 * off the bottom edge. Each letter stands in its own mask and rises into it,
 * one after another. It is scroll-ACTIVATED, not scroll-linked: it waits until
 * most of the name is actually on screen, holds a beat, then plays through once
 * at its own pace. Started any earlier it is over before anyone has scrolled
 * far enough to see it. This file only flips data-in; the stylesheet staggers
 * the letters from each one's own index, so there is no per-letter script and
 * no animation library.
 *
 * FITTING THE NAME. The letters are sized so the word is exactly as wide as the
 * space between the margins. That cannot be written in CSS alone, because it
 * depends on the real widths of these letters in whichever font loaded, so it is measured: set a
 * known size, read the width, scale. It is measured again if the screen
 * resizes or the font swaps in.
 */
export default function Footer({
  contact,
  name,
  established,
  links,
}: {
  contact: {
    name: string;
    addressShort: string[];
    phone: string;
    phoneHref: string;
    email: string;
    instagram: string;
    maps: string;
  };
  name: string;
  established: string;
  /** The two ways out that already exist: the auction and the film. */
  links: { label: string; href: string }[];
}) {
  const word = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = word.current;
    if (!w) return;

    const fit = () => {
      w.style.fontSize = "100px";
      const width = w.scrollWidth;
      if (width > 0) w.style.fontSize = `${(100 * w.clientWidth) / width}px`;
    };
    fit();
    document.fonts?.ready.then(fit);

    window.addEventListener("resize", fit);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      w.dataset.in = "1";
      return () => window.removeEventListener("resize", fit);
    }

    // 0.7: most of the name is on screen, which only happens at the very end of
    // the page. The pause before it starts is in the stylesheet.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          w.dataset.in = "1";
          io.disconnect();
        }
      },
      { threshold: 0.7 },
    );
    io.observe(w);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  const letters = [...name];

  return (
    <footer className="mt-footer" id="contact" data-tone="light">
      <div className="mt-footer-grid">
        <div>
          <span className="mt-eyebrow">Workshop</span>
          {contact.addressShort.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <a className="mt-footer-link" href={contact.maps} target="_blank" rel="noopener noreferrer">
            Open in Maps
          </a>
        </div>

        <div>
          <span className="mt-eyebrow">Speak to Kevin</span>
          <a href={contact.phoneHref} data-cursor="Call">
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} data-cursor="Email">
            {contact.email}
          </a>
          <span className="mt-footer-quiet">{established}</span>
        </div>

        <div>
          <span className="mt-eyebrow">Elsewhere</span>
          <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          {links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      </div>

      {/* Read out once as a word; the letters themselves are decoration. */}
      <div ref={word} className="mt-footer-word" role="img" aria-label={name}>
        {letters.map((ch, i) => (
          <span key={i} className="mt-footer-char" aria-hidden="true" style={{ ["--mt-i" as string]: i }}>
            <span>{ch === " " ? "\u00a0" : ch}</span>
          </span>
        ))}
      </div>
    </footer>
  );
}
