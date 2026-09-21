"use client";

/**
 * InfoTip — the little ⓘ next to a price, explaining what moves the number.
 * Tooltip shows on hover and on focus (a tap focuses the button on touch, so
 * it works there too); Escape or tapping elsewhere blurs it away.
 *
 * KEPT INSIDE THE PAGE MARGIN. The bubble is centred on its icon, and an icon
 * can sit anywhere: hard against the left margin in a list, at the right edge
 * of a card, anywhere at all on a phone. So each time it opens it is measured
 * and slid sideways by exactly as much as it takes to stay inside the page's
 * own side padding. The slide is handed to the stylesheet as --pr-shift.
 *
 * It depends only on the layout, so it is worked out ahead of time (on load,
 * when the fonts land, whenever the window resizes) rather than waiting for a
 * hover: the bubble is already in the right place the moment it fades in, on a
 * mouse, a keyboard or a finger alike. Opening it re-checks, which costs nothing.
 */

import { useEffect, useRef } from "react";
import { MdInfoOutline } from "@/components/MaterialIcon";

export default function InfoTip({ text }: { text: string }) {
  const tip = useRef<HTMLSpanElement>(null);

  const fit = () => {
    const el = tip.current;
    const icon = el?.parentElement;
    if (!el || !icon) return;
    // Worked out from the layout, not from where the bubble is drawn right now:
    // it animates, so its drawn position mid-fade is not where it will end up.
    const page = el.closest<HTMLElement>(".pr");
    const margin = page ? parseFloat(getComputedStyle(page).paddingLeft) || 20 : 20;
    const at = icon.getBoundingClientRect();
    const centre = at.left + at.width / 2;
    const left = centre - el.offsetWidth / 2;
    const right = centre + el.offsetWidth / 2;
    const min = margin;
    const max = document.documentElement.clientWidth - margin;
    let shift = 0;
    if (left < min) shift = min - left;
    else if (right > max) shift = max - right;
    el.style.setProperty("--pr-shift", `${Math.round(shift)}px`);
  };

  useEffect(() => {
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <span className="pr-info" onPointerEnter={fit} onFocus={fit}>
      <button
        type="button"
        className="pr-info-btn"
        aria-label={`More about this: ${text}`}
        onKeyDown={(e) => { if (e.key === "Escape") (e.target as HTMLElement).blur(); }}
      >
        <MdInfoOutline size={14} />
      </button>
      <span ref={tip} role="tooltip" className="pr-info-tip">{text}</span>
    </span>
  );
}
