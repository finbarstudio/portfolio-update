"use client";

/**
 * HeroTitle — the hero statement set as a full-measure type block.
 *
 * Every line is fitted to EXACTLY the container width (the same measure-and-
 * scale trick as the footer wordmark), so the block is genuinely edge-to-edge
 * with normal word spaces: no justify, no stretched gaps. Line one carries the
 * editorial indent (its fit accounts for it). Lines rise in staggered out of
 * masks once fitted; reduced motion shows them in place.
 */

import { useLayoutEffect, useRef, useState } from "react";

const LINES: { text: string; indent?: boolean }[] = [
  { text: "A boutique web development", indent: true },
  { text: "studio with a designer’s eye." },
];

// Indent as a fraction of the measure (line 1 only).
const INDENT = 0.14;

export default function HeroTitle() {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const [fitted, setFitted] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fit = () => {
      const width = root.clientWidth;
      if (!width) return;
      const inners = [...root.querySelectorAll<HTMLElement>(".ht-line")].map((line, i) => ({
        inner: line.querySelector<HTMLElement>(".ht-inner")!,
        indent: LINES[i]?.indent ? width * INDENT : 0,
      })).filter((x) => x.inner);
      // ONE size for the whole block: measure every line at a reference size,
      // take the scale that lets the WIDEST line exactly fill its measure, and
      // apply it uniformly (the other lines rag naturally).
      // Transitions (even an inherited transition-delay) make font-size writes
      // land late and poison measurement, so they're disabled during the fit.
      const prev = inners.map(({ inner }) => inner.style.transition);
      inners.forEach(({ inner }) => { inner.style.transition = "none"; inner.style.fontSize = "100px"; });
      void root.offsetWidth;
      let size = Infinity;
      inners.forEach(({ inner, indent }) => {
        const natural = inner.getBoundingClientRect().width;
        if (natural > 0) size = Math.min(size, ((width - indent) / natural) * 100);
      });
      if (!isFinite(size)) return;
      // one refinement pass at the chosen size (letter-spacing is em-based, so
      // width doesn't scale perfectly linearly)
      inners.forEach(({ inner }) => { inner.style.fontSize = `${size}px`; });
      void root.offsetWidth;
      let scale = Infinity;
      inners.forEach(({ inner, indent }) => {
        const measured = inner.getBoundingClientRect().width;
        if (measured > 0) scale = Math.min(scale, (width - indent) / measured);
      });
      if (isFinite(scale)) size = size * scale;
      inners.forEach(({ inner, indent }, i) => {
        inner.style.fontSize = `${size}px`;
        inner.style.marginLeft = indent ? `${indent}px` : "0px";
        void inner.offsetWidth;
        requestAnimationFrame(() => { inner.style.transition = prev[i]; });
      });
      setFitted(true);
    };

    fit();
    // Fonts swapping in mid-pass can poison the measurements (a fallback-font
    // fit sticks if no later pass runs), so refit on fonts.ready AND on a few
    // staged timers; every pass re-measures from scratch, so the last honest
    // one wins.
    document.fonts?.ready.then(fit).catch(() => {});
    const timers = [300, 900, 2000].map((ms) => window.setTimeout(fit, ms));
    const ro = new ResizeObserver(fit);
    ro.observe(root);
    return () => {
      ro.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <h1
      ref={rootRef}
      className={`home-hero-display display-brand ht ${fitted ? "ht-go" : ""}`}
      aria-label="A boutique web development studio with a designer's eye."
    >
      {LINES.map((l, i) => (
        <span key={i} className="ht-line block overflow-hidden" aria-hidden="true">
          <span
            className="ht-inner inline-block whitespace-nowrap will-change-transform"
            style={{ transitionDelay: `${i * 0.09}s` }}
          >
            {l.text}
          </span>
        </span>
      ))}
    </h1>
  );
}
