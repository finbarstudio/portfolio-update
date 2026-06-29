import type { Metadata } from "next";

// Private index of every builder demo + pitch — for Finbar's own navigation.
// Reachable by URL only: noindex, not in the sitemap, not linked from the nav.
export const metadata: Metadata = {
  title: { absolute: "Builders · index" },
  description: "Private index of the builder demo sites and pitch pages.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

type Page = { label: string; href: string };
type Builder = {
  name: string;
  meta: string;
  pitch: string;
  pages: Page[];
};

// The current batch of Lindon-style redesign demos.
const BATCH: Builder[] = [
  {
    name: "Foundation Homes",
    meta: "Sunshine Coast · custom homes",
    pitch: "/foundation-homes",
    pages: [
      { label: "Home", href: "/foundation-homes/site" },
      { label: "About", href: "/foundation-homes/site/about" },
      { label: "Projects", href: "/foundation-homes/site/portfolio" },
    ],
  },
  {
    name: "Resolve Construction",
    meta: "Gold Coast · boutique prestige",
    pitch: "/resolve-construction",
    pages: [
      { label: "Home", href: "/resolve-construction/site" },
      { label: "About", href: "/resolve-construction/site/about" },
      { label: "Projects", href: "/resolve-construction/site/portfolio" },
    ],
  },
  {
    name: "Ross Hogno Constructions",
    meta: "Toowoomba · custom homes",
    pitch: "/ross-hogno",
    pages: [
      { label: "Home", href: "/ross-hogno/site" },
      { label: "About", href: "/ross-hogno/site/about" },
      { label: "Projects", href: "/ross-hogno/site/portfolio" },
    ],
  },
  {
    name: "David Radic Prestige Homes",
    meta: "Gold Coast · waterfront prestige",
    pitch: "/david-radic",
    pages: [
      { label: "Home", href: "/david-radic/site" },
      { label: "About", href: "/david-radic/site/about" },
      { label: "Our Homes", href: "/david-radic/site/portfolio" },
    ],
  },
  {
    name: "GTO Building",
    meta: "Sunshine Coast · architect-led",
    pitch: "/gto-building",
    pages: [
      { label: "Home", href: "/gto-building/site" },
      { label: "About", href: "/gto-building/site/about" },
      { label: "Projects", href: "/gto-building/site/portfolio" },
    ],
  },
  {
    name: "HM Developments",
    meta: "Sunshine Coast · developer",
    pitch: "/hm-developments",
    pages: [
      { label: "Home", href: "/hm-developments/site" },
      { label: "About", href: "/hm-developments/site/about" },
      { label: "Projects", href: "/hm-developments/site/portfolio" },
    ],
  },
  {
    name: "MBC Prestige",
    meta: "Noosa · developer",
    pitch: "/mbc-prestige",
    pages: [
      { label: "Home", href: "/mbc-prestige/site" },
      { label: "About", href: "/mbc-prestige/site/about" },
      { label: "Projects", href: "/mbc-prestige/site/portfolio" },
    ],
  },
  {
    name: "BPPD",
    meta: "Brisbane · developer (thin content)",
    pitch: "/bppd",
    pages: [
      { label: "Home", href: "/bppd/site" },
      { label: "About", href: "/bppd/site/about" },
    ],
  },
];

// Earlier demos, for completeness.
const EARLIER: Builder[] = [
  {
    name: "Braeden Constructions",
    meta: "Noosa · custom homes",
    pitch: "/braeden",
    pages: [
      { label: "Home", href: "/braeden/site" },
      { label: "About", href: "/braeden/site/about" },
      { label: "Projects", href: "/braeden/site/projects" },
    ],
  },
  {
    name: "A Rolley & Sons",
    meta: "Sunshine Coast · 4th-gen builder",
    pitch: "/a-rolley",
    pages: [
      { label: "Home", href: "/a-rolley/site" },
      { label: "About", href: "/a-rolley/site/about" },
      { label: "Projects", href: "/a-rolley/site/projects" },
    ],
  },
  {
    name: "Lindon Homes",
    meta: "Brisbane · custom & luxury",
    pitch: "/lindon",
    pages: [
      { label: "Home", href: "/lindon/site" },
      { label: "About", href: "/lindon/site/about" },
      { label: "Portfolio", href: "/lindon/site/portfolio" },
    ],
  },
  {
    name: "OJ Pippin Homes",
    meta: "Brisbane · all-inclusive",
    pitch: "/oj-pippin",
    pages: [
      { label: "Home", href: "/oj-pippin/site" },
      { label: "About", href: "/oj-pippin/site/about" },
      { label: "Designs", href: "/oj-pippin/site/designs" },
      { label: "What We Do", href: "/oj-pippin/site/what-we-do" },
    ],
  },
];

function Row({ b }: { b: Builder }) {
  return (
    <div className="border-t border-line pt-5 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-3">
      <div className="md:col-span-5">
        <h3 className="mono-heading text-ink">{b.name}</h3>
        <p className="text-ink-soft mt-1" style={{ fontSize: "0.85rem" }}>{b.meta}</p>
      </div>
      <div className="md:col-span-7 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a href={b.pitch} className="mono-label text-pink hover:underline">
          Pitch &rarr;
        </a>
        <span className="text-ink-soft/40" aria-hidden="true">|</span>
        {b.pages.map((p) => (
          <a
            key={p.href}
            href={p.href}
            className="mono-label text-ink hover:text-pink transition-colors"
          >
            {p.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function BuildersIndexPage() {
  return (
    <div className="px-5 md:px-10 pb-24">
      <section className="pt-[5svh] md:pt-[7svh] pb-12 md:pb-16">
        <p className="mono-label text-pink mb-6">Private index</p>
        <h1 className="home-display-sm max-w-[20ch]">Builder demos &amp; pitches</h1>
        <p className="text-ink-soft mt-6 max-w-[60ch]" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.5 }}>
          Quick links to every redesign demo and its pitch page. Just for your reference,
          this page is noindex and isn&rsquo;t linked anywhere public. Demos open best on desktop.
        </p>
      </section>

      <section className="home-section py-10 md:py-14">
        <p className="mono-label text-ink-soft mb-8">The batch · 8</p>
        <div className="flex flex-col gap-7">
          {BATCH.map((b) => (
            <Row key={b.pitch} b={b} />
          ))}
        </div>
      </section>

      <section className="home-section py-10 md:py-14">
        <p className="mono-label text-ink-soft mb-8">Earlier · 4</p>
        <div className="flex flex-col gap-7">
          {EARLIER.map((b) => (
            <Row key={b.pitch} b={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
