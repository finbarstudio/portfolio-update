import type { Metadata } from "next";
import Link from "next/link";
import AsciiLab from "@/components/sandbox/library/AsciiLab";

export const metadata: Metadata = {
  title: "ASCII Imagery",
  description:
    "A photo resampled into a grid of type: luminance mapped onto character ramps, with colour modes and a gentle boil. Aniso-style, built in 2D canvas.",
  robots: { index: false, follow: true },
};

// The tool this technique is modelled on.
const REFERENCE = "https://github.com/darkroomengineering/aniso";

export default function AsciiPage() {
  return (
    <section className="sb-fx">
      <header className="sb-fx-head">
        <div>
          <h1 className="sb-fx-title">ASCII Imagery</h1>
          <p className="sb-fx-note">
            Character-based imagery: the photo is resampled at grid resolution, each cell&rsquo;s
            luminance picks a glyph from a ramp (dark gets dense, light gets sparse), and the grid
            gently boils so it shimmers like hand-set type. Swap ramps, colour modes and cell size.
          </p>
        </div>
        <Link className="sb-fx-ref" href={REFERENCE} target="_blank" rel="noopener noreferrer">
          Reference tool ↗
        </Link>
      </header>

      <AsciiLab src="/images/palmsmotel/scene-2.webp" />
    </section>
  );
}
