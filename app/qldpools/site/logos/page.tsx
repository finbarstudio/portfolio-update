import type { Metadata } from "next";
import Link from "next/link";
import { logoOptions } from "./options";

// Arch-motif wordmark options for QLD Pool Installs. Laid out as a grid (these
// are small lockups, so seeing many at once beats one-per-screen). Private,
// noindex, reachable by URL only.
export const metadata: Metadata = {
  title: { absolute: "Logo options · QLD Pool Installs" },
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function LogoGallery() {
  return (
    <div className="bg-white min-h-svh px-6 md:px-14 py-16 md:py-20">
      <header className="mb-12">
        <p className="qpi-caps text-[var(--qpi-blue)] text-[10px] mb-3">
          Logo options · {logoOptions.length}
        </p>
        <h1
          className="qpi-display"
          style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.1 }}
        >
          Arch wordmarks
        </h1>
        <p className="text-[var(--qpi-ink)]/60 mt-2 max-w-[54ch]" style={{ fontSize: "0.95rem" }}>
          Text logos built around the arch, the shape the hero already uses. Note the numbers you
          like.
        </p>
        <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/qldpools/site/sections" className="qpi-caps text-[10px] text-[var(--qpi-ink)]/45 hover:text-[var(--qpi-ink)]">
            Sections
          </Link>
          <Link href="/qldpools/site/heroes" className="qpi-caps text-[10px] text-[var(--qpi-ink)]/45 hover:text-[var(--qpi-ink)]">
            Heroes
          </Link>
        </nav>
      </header>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {logoOptions.map((l, i) => (
          <figure
            key={l.name + i}
            className="m-0 border border-black/10 bg-white"
            style={{ borderRadius: 4 }}
          >
            <div className="grid place-items-center px-4" style={{ minHeight: 260 }}>
              {l.node}
            </div>
            <figcaption className="flex items-baseline justify-between gap-3 border-t border-black/10 px-3 py-2">
              <span className="qpi-caps text-[9px] text-[var(--qpi-ink)]/45 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="qpi-caps text-[9px] text-[var(--qpi-ink)]/70 text-right">{l.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
