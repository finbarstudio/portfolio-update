import type { Metadata } from "next";
import Link from "next/link";
import LensLab from "@/components/sandbox/library/LensLab";

export const metadata: Metadata = {
  title: "Lens Test",
  description:
    "A cursor-following optical lens over a photo, with 30 stacked looks: fisheye, chromatic aberration, grain, halftone, CRT and friends. Pure 2D canvas, no WebGL.",
  robots: { index: false, follow: true },
};

// The page this technique was studied from.
const REFERENCE = "https://standardformat.vercel.app/lens-test";

export default function LensTestPage() {
  return (
    <section className="sb-fx">
      <header className="sb-fx-head">
        <div>
          <h1 className="sb-fx-title">Lens Test</h1>
          <p className="sb-fx-note">
            A magnifying lens that follows the cursor, warped and graded 30 different ways: barrel
            fisheye done with a two-pass column/row resample, then chromatic aberration, grain,
            pixelation, halftone and CRT passes stacked on top. All 2D canvas, no WebGL.
          </p>
        </div>
        <Link className="sb-fx-ref" href={REFERENCE} target="_blank" rel="noopener noreferrer">
          Reference page ↗
        </Link>
      </header>

      <LensLab src="/images/palmsmotel/scene-1.webp" />
    </section>
  );
}
