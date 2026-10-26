"use client";

import { useEffect, useState } from "react";
import { api } from "./api";

type Phase = "idle" | "saving" | "saved" | "error";

/**
 * A personal 1-5 star rating in the card's bottom row, so rating doesn't need
 * the product page. Tap the same star to clear. Saved state is subtle: a brief
 * tick after the stars, and the stars keep their colour.
 */
export default function QuickRate({ productId, name, stars: initial }: { productId: string; name: string; stars: number | null }) {
  const [stars, setStars] = useState<number | null>(initial);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (phase !== "saved") return;
    const t = setTimeout(() => setPhase("idle"), 1400);
    return () => clearTimeout(t);
  }, [phase]);

  async function rate(next: number | null) {
    const before = stars;
    setStars(next);
    setPhase("saving");
    try {
      await api("/rating", { method: "POST", body: { productId, stars: next } });
      setPhase("saved");
    } catch {
      setStars(before);
      setPhase("error");
    }
  }

  return (
    <div className={`ds-qrate${phase === "error" ? " is-error" : ""}`}>
      <div className="ds-qrate-stars" role="radiogroup" aria-label={`Your rating for ${name}`}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = stars !== null && n <= stars;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={stars === n}
              aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
              className={`ds-qrate-star${on ? " is-on" : ""}`}
              disabled={phase === "saving"}
              onClick={() => rate(stars === n ? null : n)}
            >
              <span aria-hidden="true">{on ? "★" : "☆"}</span>
            </button>
          );
        })}
        <span className={`ds-qrate-flag${phase === "saved" ? " is-saved" : phase === "error" ? " is-bad" : ""}`} aria-hidden="true">
          {phase === "saved" ? "✓" : phase === "error" ? "!" : ""}
        </span>
      </div>
      <span className="ds-sr" role="status" aria-live="polite">
        {phase === "saved" ? (stars === null ? "Rating cleared" : `Rated ${stars} stars`) : phase === "error" ? "Not saved, try again" : ""}
      </span>
    </div>
  );
}
