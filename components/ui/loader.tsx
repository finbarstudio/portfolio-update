"use client";

/**
 * LoaderThree — the brand loading spinner.
 *
 * The finbar✶studio six-pointed star, drawn as two stacked outlines: a faint
 * static "track" and a glowing pink stroke that draws itself around the star on
 * a loop while the whole mark slowly rotates. CSS-only (no animation library),
 * matching the wordmark + favicon star exactly via the shared STAR_POINTS.
 *
 * Drop it into any positioned container; it centres itself.
 */

import { STAR_POINTS } from "@/components/brand-star";

export function LoaderThree({ size = 46 }: { size?: number }) {
  return (
    <span className="star-loader" aria-label="Loading" role="status">
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <polygon className="star-loader-track" points={STAR_POINTS} />
        <polygon
          className="star-loader-draw"
          points={STAR_POINTS}
          pathLength={1}
        />
      </svg>
    </span>
  );
}

export default LoaderThree;
