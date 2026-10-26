"use client";

import { useState } from "react";
import { fitBand, fitNumber, fitWord } from "@/lib/dad-shop/fit";
import { gbp } from "@/lib/dad-shop/format";
import type { GroupInfo } from "@/lib/dad-shop/pricing";
import { GROUP_COLOURS } from "@/lib/dad-shop/pricing";
import type { PriceView } from "@/lib/dad-shop/pricing";
import type { SeedOil, StoreStatus } from "@/lib/dad-shop/types";

/** Small shared pieces: picture, Fit badge, stars, seed-oil tag. */

export function ProductImage({ src, alt = "", className = "" }: { src: string | null; alt?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className={`ds-img ds-img--empty ${className}`} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
        <svg viewBox="0 0 24 24" width="40%" height="40%" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
          <path d="M3 7l9 4 9-4M12 11v10" />
        </svg>
      </span>
    );
  }
  return (
    // Remote Sainsbury's picture: next/image would need a host allow-list in next.config.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`ds-img ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

export function FitBadge({ fit }: { fit: number | null }) {
  const band = fitBand(fit);
  const word = fitWord(fit);
  return (
    <span className={`ds-fit ds-fit--${band}`} aria-label={fit == null ? word : `Fit ${fitNumber(fit)} out of 10: ${word}`}>
      <span className="ds-fit-num" aria-hidden="true">
        {fitNumber(fit)}
      </span>
      <span className="ds-fit-word" aria-hidden="true">
        {word}
      </span>
    </span>
  );
}

export function StarsDisplay({ stars }: { stars: number }) {
  return (
    <span className="ds-stars" role="img" aria-label={`You rated it ${stars} out of 5`}>
      {"★".repeat(stars)}
      <span className="ds-stars-off">{"☆".repeat(5 - stars)}</span>
    </span>
  );
}

export function StarsInput({
  value,
  onChange,
  disabled = false,
}: {
  value: number | null;
  onChange: (next: number | null) => void;
  disabled?: boolean;
}) {
  return (
    <div className="ds-rate" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const on = value !== null && n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
            className={`ds-rate-star${on ? " is-on" : ""}`}
            disabled={disabled}
            // Tapping the star you already chose clears it.
            onClick={() => onChange(value === n ? null : n)}
          >
            <span aria-hidden="true">{on ? "★" : "☆"}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SeedOilTag({ seedOil }: { seedOil: SeedOil | null }) {
  if (seedOil === "yes") return <span className="ds-tag ds-tag--red">Seed oil</span>;
  if (seedOil === "likely") return <span className="ds-tag ds-tag--amber">May have seed oil</span>;
  return null;
}

/** "Fit 7" or "Value 8" on a picture. Green 7+, amber 5-6, red below. */
export function ScoreChip({ label, score }: { label: string; score: number | null }) {
  if (score == null) return null;
  const n = Math.round(score);
  const tone = n >= 7 ? "g" : n >= 5 ? "a" : "r";
  return (
    <span className={`ds-score ds-score--${tone}`} aria-label={`${label} ${n} out of 10`}>
      {label} {n}
    </span>
  );
}

/** The price he pays, with the usual price struck through and a small Nectar note. */
export function PriceBlock({ view, qty = 1, big = false }: { view: PriceView; qty?: number; big?: boolean }) {
  return (
    <span className={`ds-pb${big ? " ds-pb--big" : ""}`}>
      <strong className="ds-pb-now">{gbp((view.nowPence * qty) / 100)}</strong>
      {view.cut && (
        <s className="ds-pb-was">
          <span className="ds-sr">Usually </span>
          {gbp((view.fullPence * qty) / 100)}
        </s>
      )}
      {view.nectar && <span className="ds-pb-note">with Nectar</span>}
    </span>
  );
}

/** The letter and colour of a list group, shown on cards too. */
export function GroupTag({ group, label }: { group: Pick<GroupInfo, "letter" | "colour" | "label">; label?: string }) {
  const [bg, fg] = GROUP_COLOURS[group.colour % GROUP_COLOURS.length];
  return (
    <span className="ds-gtag" style={{ "--gbg": bg, "--gfg": fg } as React.CSSProperties} title={`Offer group ${group.letter}: these items count together`}>
      <span className="ds-gtag-l">{group.letter}</span>
      <span>{label ?? group.label}</span>
    </span>
  );
}

export function groupStyle(colour: number): React.CSSProperties {
  const [bg, fg] = GROUP_COLOURS[colour % GROUP_COLOURS.length];
  return { "--gbg": bg, "--gfg": fg } as React.CSSProperties;
}

export function Caret() {
  return (
    <svg className="ds-caret" width="12" height="12" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** What the store chip says and how it looks, for a status. Shared by the card and the product page. */
export function storeChip(status: StoreStatus): { text: string; tone: "g" | "n" | "r"; fallback: string } {
  switch (status) {
    case "yes":
    case "likely":
      return { text: "At Chislehurst ✓", tone: "g", fallback: status === "yes" ? "On the Chislehurst shelf list." : "Probably on the shelf at Chislehurst." };
    case "no":
      return { text: "Not at Chislehurst", tone: "r", fallback: "Not on the Chislehurst shelf list." };
    default:
      return { text: "Check in store", tone: "n", fallback: "Not sure it is stocked at Chislehurst. Worth a look when you are there." };
  }
}

/** The store chip: tap for the reason. */
export function StoreChip({ status, reason, id }: { status: StoreStatus; reason: string | null; id: string }) {
  const [open, setOpen] = useState(false);
  const c = storeChip(status);
  return (
    <>
      <button type="button" className={`ds-store ds-store--${c.tone}`} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        {c.text}
      </button>
      {open && (
        <p className="ds-store-why" id={id} role="note">
          {reason ?? c.fallback}
        </p>
      )}
    </>
  );
}
