import type { Metadata } from "next";
import Link from "next/link";
import BrandStar from "@/components/BrandStar";
import HeroStar from "@/components/HeroStar";

export const metadata: Metadata = {
  title: "Page not found | Finbar Studio",
  robots: { index: false, follow: true },
};

/* 404 — on-brand: the big serif "4 ✶ 4" with the brand star as the zero, the
   self-tracing background star, and a way back. Renders inside the root layout,
   so the sidebar stays put. */
export default function NotFound() {
  return (
    <section
      className="relative overflow-hidden px-5 md:px-10 flex flex-col justify-center"
      style={{ minHeight: "calc(100vh - var(--menubar-h))" }}
      aria-label="Page not found"
    >
      <HeroStar />

      <div className="relative z-10">
        <span className="sticker-pill is-pink mb-7 inline-flex">
          <span className="status-dot" aria-hidden="true" /> Page not found
        </span>

        <h1 className="home-display text-ink flex items-center" aria-label="404">
          <span aria-hidden="true">4</span>
          <BrandStar size="0.78em" style={{ color: "var(--pink)", margin: "0 0.06em" }} />
          <span aria-hidden="true">4</span>
        </h1>

        <p className="mt-7 max-w-md text-ink leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
          This one slipped off the grid. The page either moved or never existed. Either way,
          here&rsquo;s the way back.
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-9">
          <Link href="/" className="home-link">Back home →</Link>
          <Link href="/work" className="home-link">View work →</Link>
        </div>
      </div>
    </section>
  );
}
