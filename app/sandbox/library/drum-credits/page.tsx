import type { Metadata } from "next";
import Link from "next/link";
import DrumCreditsClient from "@/components/sandbox/library/DrumCreditsClient";

export const metadata: Metadata = {
  title: "Drum Credits",
  description:
    "A 1950s title-sequence effect: credits printed on a large-radius drum, curving away at the top and bottom of frame as they roll.",
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
            Credits shot off a rotating drum, not a flat sheet. A large-radius cylinder, so the
            type bows ever so slightly and foreshortens as it enters and leaves frame.
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
