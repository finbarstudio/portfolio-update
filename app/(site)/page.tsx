import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { projects } from "@/content/projects";
import Reveal from "@/components/Reveal";
import HomeIntro from "@/components/HomeIntro";
import InlineIcon from "@/components/InlineIcon";
import MaskReveal from "@/components/MaskReveal";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  description:
    "Finbar Skitini is a Brisbane web designer and developer building custom websites, with brand identity, editorial and motion design behind them, for businesses across Australia and the UK.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Finbar Studio | Brisbane Web Design & Development",
    description:
      "Independent web design and development studio in Brisbane. Custom-coded websites, brand identity, editorial and motion. Available for select freelance projects and permanent roles.",
    url: SITE_URL,
    type: "website",
  },
};

/* Web-first featured roster: real scroll-throughs of the LIVE sites (recorded
   headless, shared with the case-study mac-model screens) as the thumbnails.
   More web builds slot in as they ship; everything else lives on /work. */
const SELECTED: { slug: string; video: string }[] = [
  { slug: "lows-design-build", video: "/images/lows-design-build/site-scroll.mp4" },
  { slug: "kinaya", video: "/images/kinaya/site-scroll.mp4" },
  { slug: "momentum-mentoring", video: "/images/momentum-mentoring/site-scroll.mp4" },
];

function HomeJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: "Finbar Studio, Brisbane Web Design & Development",
    description:
      "Independent web design and development studio in Brisbane, also working in brand identity, editorial and motion.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    primaryImageOfPage: `${SITE_URL}/opengraph-image`,
    inLanguage: "en-AU",
  };
  return (
    <Script
      id="ld-home"
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
    />
  );
}

/* ─── Disciplines: a big-type wall with dingbats set inline in the type ──────
   Glyphs come from the brand icon batch (Noto Sans Symbols 2, --font-dingbat);
   each reels through the batch on hover (see InlineIcon). Web leads. */
function Disciplines() {
  return (
    <section id="hero" className="home-disciplines px-5 md:px-10" aria-label="What I do">
      <MaskReveal as="h2" className="home-disc" aria-label="Web, digital, brand, print, social, editorial, but mainly web">
        {"Web "}
        <InlineIcon char="🏄" className="home-disc-icon" />
        {" Digital "}
        <InlineIcon char="🖧" className="home-disc-icon" />
        {" Brand "}
        <InlineIcon char="✌" className="home-disc-icon" />
        {" Print "}
        <InlineIcon char="📦" className="home-disc-icon" />
        {" Social "}
        <InlineIcon char="👪" className="home-disc-icon" />
        {" Editorial "}
        {"... "}
        <span className="home-disc-pink">but mainly web</span>
      </MaskReveal>
    </section>
  );
}

/* ─── Selected work: minimal 3-col grid of live-site scroll loops ─────────── */
function MiniCard({
  project,
  video,
  index,
}: {
  project: (typeof projects)[number];
  video: string;
  index: number;
}) {
  return (
    <article className="card-animate col-span-12 sm:col-span-4 group" style={{ animationDelay: `${index * 0.03}s` }}>
      <Link
        href={`/case-studies/${project.slug}`}
        className="block focus-visible:outline-pink focus-visible:outline-2 focus-visible:rounded"
        aria-label={`View case study: ${project.name}`}
      >
        {/* Card matches the recording's 16:9, so the full video IS the thumb. */}
        <div className="card-thumb relative overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`Scrolling preview of the ${project.name} website`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="flex items-start justify-between gap-4 mt-3">
          <h2 className="mono-heading text-ink group-hover:text-pink transition-colors" style={{ fontSize: "0.8125rem" }}>
            {project.name}
          </h2>
          <span className="meta-mono text-ink-soft whitespace-nowrap mt-px" style={{ fontSize: "0.625rem" }}>
            {project.date}
          </span>
        </div>
      </Link>
    </article>
  );
}

function SelectedWork() {
  return (
    <Reveal section as="section" id="top-work" className="home-section no-rule px-5 md:px-10" aria-label="Selected work">
      <div className="grid grid-cols-12 gap-x-8 gap-y-12">
        {SELECTED.map((pick, i) => {
          const project = projects.find((p) => p.slug === pick.slug);
          return project ? <MiniCard key={pick.slug} project={project} video={pick.video} index={i} /> : null;
        })}
      </div>
    </Reveal>
  );
}

/* ─── What I do: category names as big inline pill-bubbles ──────
   Web leads; the design capabilities stay (graphic design roles are still on
   the table), they just follow. */
const CAP_PILLS: { name: string; href: string }[] = [
  { name: "Web design & development", href: "/web-design" },
  { name: "Brand identity", href: "/work?filter=brand" },
  { name: "Graphic design", href: "/graphic-design" },
  { name: "Motion graphics", href: "/work?filter=motion" },
  { name: "Editorial & print", href: "/work?filter=editorial" },
  { name: "Creative direction", href: "/work?filter=art" },
];

function Capabilities() {
  return (
    <section className="home-disciplines px-5 md:px-10" aria-labelledby="services-title">
      <div className="home-cap">
        <h2 id="services-title" className="home-cap-title">How I help businesses</h2>
        <div className="home-disc home-cap-wrap">
          {CAP_PILLS.map((c) => (
            <Link key={c.name} href={c.href} className="home-cap-pill">
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      {/* Single page H1 — the design expresses the brand as the FINBARSTUDIO
          wordmark, so the semantic H1 is visually hidden but carries the key
          phrase for search + screen readers. */}
      <h1 className="sr-only">
        finbar✶studio. Brisbane web design &amp; development studio
      </h1>
      <HomeIntro />
      <Disciplines />
      {/* Past this point the auto-hidden nav slides in (see LayoutShell). */}
      <div id="nav-reveal-sentinel" aria-hidden="true" />
      <SelectedWork />
      <Capabilities />
    </>
  );
}
