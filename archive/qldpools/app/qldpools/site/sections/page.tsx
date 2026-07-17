import type { Metadata } from "next";
import Link from "next/link";
import { GALLERIES } from "./registry";

// Index of the section-option galleries.
export const metadata: Metadata = {
  title: { absolute: "Section options · QLD Pool Installs" },
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function SectionsIndex() {
  const total = GALLERIES.reduce((n, g) => n + g.options.length, 0);
  return (
    <div className="bg-white min-h-svh px-6 md:px-14 py-16 md:py-24">
      <p className="qpi-caps text-[var(--qpi-blue)] text-[10px] mb-4">
        QLD Pool Installs · {total} options
      </p>
      <h1
        className="qpi-display max-w-[16ch]"
        style={{ color: "var(--qpi-ink)", fontSize: "clamp(2rem, 4.5vw, 3.4rem)", lineHeight: 1.05 }}
      >
        Pick a section
      </h1>
      <p className="text-[var(--qpi-ink)]/60 mt-4 max-w-[52ch]" style={{ fontSize: "1rem", lineHeight: 1.5 }}>
        One gallery per section of their home page, in page order. Open a gallery, scroll, and note
        the numbers you like.
      </p>

      <ul className="mt-12 m-0 p-0 list-none border-t border-black/10">
        <li>
          <Link
            href="/qldpools/site/heroes"
            className="group flex items-baseline justify-between gap-6 py-5 border-b border-black/10"
          >
            <span className="flex items-baseline gap-5">
              <span className="qpi-caps text-[var(--qpi-ink)]/35 text-[10px] tabular-nums">00</span>
              <span
                className="qpi-display text-[var(--qpi-ink)] group-hover:text-[var(--qpi-blue)] transition-colors"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.6rem)" }}
              >
                Hero
              </span>
              <span className="text-[var(--qpi-ink)]/45 hidden sm:inline" style={{ fontSize: "0.9rem" }}>
                102 options, you picked 76
              </span>
            </span>
            <span className="qpi-caps text-[var(--qpi-blue)] text-[10px]">Open</span>
          </Link>
        </li>
        {GALLERIES.map((g, i) => (
          <li key={g.slug}>
            <Link
              href={`/qldpools/site/sections/${g.slug}`}
              className="group flex items-baseline justify-between gap-6 py-5 border-b border-black/10"
            >
              <span className="flex items-baseline gap-5">
                <span className="qpi-caps text-[var(--qpi-ink)]/35 text-[10px] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="qpi-display text-[var(--qpi-ink)] group-hover:text-[var(--qpi-blue)] transition-colors"
                  style={{ fontSize: "clamp(1.1rem, 2vw, 1.6rem)" }}
                >
                  {g.label}
                </span>
                <span className="text-[var(--qpi-ink)]/45 hidden sm:inline" style={{ fontSize: "0.9rem" }}>
                  {g.blurb}
                </span>
              </span>
              <span className="qpi-caps text-[var(--qpi-ink)]/40 text-[10px] tabular-nums group-hover:text-[var(--qpi-blue)]">
                {g.options.length}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
