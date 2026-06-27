import type { Metadata } from "next";
import Link from "next/link";
import DrumCreditsClient from "@/components/sandbox/library/DrumCreditsClient";

export const metadata: Metadata = {
  title: "Drum Credits",
  description:
    "A 1950s title-sequence effect: credits printed on a tight-radius drum, bowing and foreshortening at the top and bottom of frame as one continuous roll turns through it.",
  robots: { index: false, follow: true },
};

// The film whose intro this is modelled on — kept as the source reference.
const REFERENCE = "https://www.youtube.com/watch?v=QG-4bjOF4OY";

export default function DrumCreditsPage() {
  return (
    <section className="sb-fx">
      <header className="sb-fx-head">
        <div>
          <h1 className="sb-fx-title">Drum Credits</h1>
          <p className="sb-fx-note">
            Credits shot off a rotating drum, not a flat sheet. A tight-radius cylinder, so the type
            bows and foreshortens as it rolls through frame. On the right, one roll turns through three
            stacked windows, the same copy travelling off the bottom, onto the middle, onto the top.
          </p>
        </div>
        <Link className="sb-fx-ref" href={REFERENCE} target="_blank" rel="noopener noreferrer">
          Reference film ↗
        </Link>
      </header>

      <DrumCreditsClient />
    </section>
  );
}
