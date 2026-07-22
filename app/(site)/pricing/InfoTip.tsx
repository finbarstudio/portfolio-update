"use client";

/**
 * InfoTip — the little ⓘ next to a price, explaining why the number can vary.
 * Tooltip shows on hover and on focus (a tap focuses the button on touch, so
 * it works there too); Escape or tapping elsewhere blurs it away.
 */

import { MdInfoOutline } from "@/components/MaterialIcon";

export default function InfoTip({ text }: { text: string }) {
  return (
    <span className="pr-info">
      <button
        type="button"
        className="pr-info-btn"
        aria-label={`Why this price: ${text}`}
        onKeyDown={(e) => { if (e.key === "Escape") (e.target as HTMLElement).blur(); }}
      >
        <MdInfoOutline size={14} />
      </button>
      <span role="tooltip" className="pr-info-tip">{text}</span>
    </span>
  );
}
