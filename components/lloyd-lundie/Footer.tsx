"use client";

import { useEffect, useRef } from "react";

/**
 * The footer: contact + Facebook + the legal name, then the big Cal Sans
 * wordmark rising in across the full width of the footer's own margins as it
 * scrolls into view (letters, not the whole word, each in its own mask), and
 * a small credit line crediting the demo back to finbar.studio. Pattern
 * adapted from components/moto-technique/sections/Footer.tsx: the word is
 * scroll-ACTIVATED, not scroll-linked, and its size is measured (not set in
 * CSS) so it always spans exactly the gutter-to-gutter width whatever font
 * actually loaded.
 */
export default function Footer({
  phoneMobile,
  phoneMobileHref,
  phoneOffice,
  phoneOfficeHref,
  email,
  facebookHandle,
  facebookHref,
  legalName,
  credit,
}: {
  phoneMobile: string;
  phoneMobileHref: string;
  phoneOffice: string;
  phoneOfficeHref: string;
  email: string;
  facebookHandle: string;
  facebookHref: string;
  legalName: string;
  credit: { label: string; href: string };
}) {
  const word = useRef<HTMLDivElement>(null);
  const name = "Lloyd Lundie";

  useEffect(() => {
    const w = word.current;
    if (!w) return;

    const fit = () => {
      // Measure the letters themselves, not the box: the box is always the
      // full width, so comparing its widths would never scale the name.
      w.style.fontSize = "100px";
      const chars = w.querySelectorAll<HTMLElement>(".ll-footer-char");
      const first = chars[0];
      const last = chars[chars.length - 1];
      if (!first || !last) return;
      const text = last.getBoundingClientRect().right - first.getBoundingClientRect().left;
      const cs = getComputedStyle(w);
      const room = w.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (text > 0 && room > 0) w.style.fontSize = `${(100 * room) / text}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      w.dataset.in = "1";
      return () => window.removeEventListener("resize", fit);
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          w.dataset.in = "1";
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(w);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  const letters = [...name];

  return (
    <footer className="ll-footer">
      <div className="ll-footer-grid">
        <div>
          <span className="ll-footer-label">Call us</span>
          <a href={phoneMobileHref}>{phoneMobile}</a>
          <a href={phoneOfficeHref}>{phoneOffice}</a>
        </div>

        <div>
          <span className="ll-footer-label">Email</span>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={facebookHref} target="_blank" rel="noopener noreferrer">
            {facebookHandle}
          </a>
        </div>

        <div>
          <span className="ll-footer-label">Company</span>
          <span>{legalName}</span>
          <a href={credit.href} target="_blank" rel="noopener noreferrer" className="ll-footer-credit">
            {credit.label}
          </a>
        </div>
      </div>

      <div ref={word} className="ll-footer-word" role="img" aria-label={name}>
        {letters.map((ch, i) => (
          <span key={i} className="ll-footer-char" aria-hidden="true" style={{ ["--ll-i" as string]: i }}>
            <span>{ch === " " ? " " : ch}</span>
          </span>
        ))}
      </div>
    </footer>
  );
}
