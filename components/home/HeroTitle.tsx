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
  { text: "A boutique web", indent: true },
  { text: "development studio" },
  { text: "with a designer’s eye." },
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
      root.querySelectorAll<HTMLElement>(".ht-line").forEach((line, i) => {
        const inner = line.querySelector<HTMLElement>(".ht-inner");
        if (!inner) return;
        const indent = LINES[i]?.indent ? width * INDENT : 0;
        const avail = width - indent;
        // Transitions (even an inherited transition-delay) make font-size
        // writes land late, which poisons the measure-set-measure loop. Kill
        // them for the duration of the fit and force a reflow per write.
        const prevTransition = inner.style.transition;
        inner.style.transition = "none";
        inner.style.fontSize = "100px";
        void inner.offsetWidth;
        const natural = inner.getBoundingClientRect().width;
        if (natural <= 0) return;
        let size = (avail / natural) * 100;
        for (let k = 0; k < 3; k++) {
          inner.style.fontSize = `${size}px`;
          void inner.offsetWidth;
          const measured = inner.getBoundingClientRect().width;
          if (Math.abs(measured - avail) <= 1) break;
          size = size * (avail / measured);
        }
        inner.style.fontSize = `${size}px`;
        inner.style.marginLeft = indent ? `${indent}px` : "0px";
        void inner.offsetWidth;
        requestAnimationFrame(() => { inner.style.transition = prevTransition; });
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
      className={`home-hero-display ht ${fitted ? "ht-go" : ""}`}
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
