import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export const metadata: Metadata = {
  // Bare name — the root layout's title template appends "| Finbar Studio"
  // (the old hardcoded suffix rendered it twice in the tab).
  title: "Page not found",
  robots: { index: false, follow: true },
};

/* 404 — reads as a plain centred "404" (the gradient mark as the zero) until
   you hover the line: the 4s slide to the viewport edges and pulsing marks
   surface between them, 404 becoming 4000000004. Replaced the deprecated
   six-pointed BrandStar + self-tracing HeroStar. */

// Odd count on purpose: the row is centre-justified, so the middle mark is
// the resting "0" and hovering unmasks outward from it in both directions.
const ZERO_COUNT = 13;

export default function NotFound() {
  return (
    <section
      className="relative overflow-hidden px-5 md:px-10 flex flex-col justify-center"
      style={{ minHeight: "calc(100vh - var(--menubar-h))" }}
      aria-label="Page not found"
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="mono-label text-ink-soft mb-7">Page not found</p>

        {/* Hover stretches the zero slot across the line: the 4s slide to the
            viewport edges and the clipped marks surface one by one, each a
            pulsing zero — 404 becomes 4000000004. */}
        <h1 className="notfound-line home-display text-ink flex items-center justify-center" aria-label="404">
          <span aria-hidden="true">4</span>
          <span className="notfound-zeros" aria-hidden="true">
            {Array.from({ length: ZERO_COUNT }).map((_, i) => (
              <span
                key={i}
                className="mark-pulse notfound-zero"
                // Delay by distance from the centre mark, so the pulse (which
                // never stops) radiates the same way the unmask travels.
                style={{ "--mark-delay": `${Math.abs(i - (ZERO_COUNT - 1) / 2) * 0.13}s` } as React.CSSProperties}
              >
                <BrandMark />
              </span>
            ))}
          </span>
          <span aria-hidden="true">4</span>
        </h1>

        <p className="mt-7 max-w-md text-ink leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
          This one slipped off the grid. The page either moved or never existed. Either way,
          here&rsquo;s the way back.
        </p>

        {/* Boxed, on the same token as the nav pills. */}
        <div className="flex flex-wrap justify-center gap-3 mt-9">
          <Link href="/" className="tag tag-default">Back home →</Link>
          <Link href="/work" className="tag tag-default">View work →</Link>
        </div>
      </div>
    </section>
  );
}
