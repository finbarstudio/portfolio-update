"use client";

/**
 * InlineIcon — a single dingbat glyph set inline in big display text (Noto Sans
 * Symbols 2, pink, via the passed class e.g. .home-disc-icon). On hover it
 * "reels" through the whole batch and eases back to its own glyph — the flick
 * slows down as it returns. Pure JS timers, reduced-motion safe.
 */

import { useRef } from "react";

// The brand icon batch (Noto Sans Symbols 2 glyphs). 🮲🮳 is a single icon made
// of two glyphs that must stay together (no space).
export const ICON_BATCH = [
  "⦿", "✱", "❉", "♡", "👪", "🖄", "⮔", "🚭", "📦", "🞋",
  "🖧", "🗑", "🗺", "⛖", "🮲🮳", "🅮", "✎", "✈", "☣",
];

export default function InlineIcon({ char, className }: { char?: string; className?: string }) {
  const base = char ?? ICON_BATCH[0];
  const ref = useRef<HTMLSpanElement>(null);
  const timers = useRef<number[]>([]);

  const reel = () => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const steps = 16;
    let t = 0;
    for (let i = 0; i < steps; i++) {
      // Delay grows steeply toward the end so the flick dramatically slows as it
      // settles back to its own glyph (fast spin → long, lingering final frames).
      t += 26 + 300 * Math.pow(i / steps, 4);
      const last = i === steps - 1;
      const glyph = last ? base : ICON_BATCH[Math.floor(Math.random() * ICON_BATCH.length)];
      timers.current.push(window.setTimeout(() => { el.textContent = glyph; }, t));
    }
  };

  return (
    <span ref={ref} className={className} onMouseEnter={reel} aria-hidden="true">
      {base}
    </span>
  );
}
