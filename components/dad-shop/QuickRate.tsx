"use client";

import { useState } from "react";
import { api } from "./api";

type Phase = "idle" | "saving" | "saved" | "error";

/** A personal 1-5 star rating right on the card, so rating doesn't need the product page. Tap the same star to clear. */
export default function QuickRate({ productId, name, stars: initial }: { productId: string; name: string; stars: number | null }) {
  const [stars, setStars] = useState<number | null>(initial);
  const [phase, setPhase] = useState<Phase>("idle");

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
    <div className="ds-qrate">
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
      </div>
      <span className="ds-qrate-note" aria-live="polite">
        {phase === "error" ? "Not saved, try again" : phase === "saved" ? (stars === null ? "Cleared" : "Saved") : stars === null ? "Rate it" : "Your rating"}
      </span>
    </div>
  );
}
