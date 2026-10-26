"use client";

import { useState } from "react";
import { fitBand, fitNumber, fitWord } from "@/lib/dad-shop/fit";
import type { SeedOil } from "@/lib/dad-shop/types";

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
