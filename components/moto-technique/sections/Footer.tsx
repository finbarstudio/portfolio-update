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
 * off the bottom edge. Each
 * letter stands in its own mask and rises into it as you reach the end of the
 * page, one after another, tied live to the scroll: scroll back up and they
 * sink again. This file only reports how far through the footer you are as
 * --mt-foot (0 to 1); the stylesheet turns that into each letter's position
 * from the letter's own index, so there is no per-letter script and no
 * animation library.
 *
 * FITTING THE NAME. The letters are sized so the word is exactly as wide as the
 * space between the margins. That cannot be written in CSS alone, because it depends on the real
 * widths of these letters in whichever font loaded, so it is measured: set a
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
  const root = useRef<HTMLElement>(null);
  const word = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const w = word.current;
    if (!el || !w) return;

    const fit = () => {
      w.style.fontSize = "100px";
      const width = w.scrollWidth;
      if (width > 0) w.style.fontSize = `${(100 * w.clientWidth) / width}px`;
    };
    fit();
    document.fonts?.ready.then(fit);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduce) return el.style.setProperty("--mt-foot", "1");
      // 0 when the name first shows at the bottom of the screen, 1 when the
      // page can scroll no further
      const r = w.getBoundingClientRect();
      const p = (window.innerHeight - r.top) / (r.height || 1);
      el.style.setProperty("--mt-foot", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      fit();
      onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  const letters = [...name];

  return (
    <footer ref={root} className="mt-footer" id="contact" data-tone="light">
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
      <div ref={word} className="mt-footer-word" role="img" aria-label={name} style={{ ["--mt-n" as string]: letters.length }}>
        {letters.map((ch, i) => (
          <span key={i} className="mt-footer-char" aria-hidden="true" style={{ ["--mt-i" as string]: i }}>
            <span>{ch === " " ? "\u00a0" : ch}</span>
          </span>
        ))}
      </div>
    </footer>
  );
}
