import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import HomeIntro from "@/components/HomeIntro";
import InlineIcon from "@/components/InlineIcon";
import MaskReveal from "@/components/MaskReveal";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  description:
    "Finbar Skitini is a Brisbane graphic designer working in brand identity, editorial, web and motion for businesses across Australia and the UK.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Finbar Studio | Brisbane Graphic Designer",
    description:
      "Independent design studio in Brisbane. Brand identity, editorial, web and motion. Available for select freelance projects and permanent roles.",
    url: SITE_URL,
    type: "website",
  },
};

/* The strongest three for the homepage; the rest live in /work. */
const SELECTED = ["tmyr", "salesmasters", "palmsmotel"];

function HomeJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: "Finbar Studio, Brisbane Graphic Designer",
    description:
      "Independent design studio in Brisbane working in brand identity, editorial, web and motion.",
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ─── Disciplines: a big-type wall with dingbats set inline in the type ──────
   Glyphs come from the brand icon batch (Noto Sans Symbols 2, --font-dingbat);
   each reels through the batch on hover (see InlineIcon). */
function Disciplines() {
  return (
    <section className="home-disciplines px-5 md:px-10" aria-label="What I do">
      <MaskReveal as="h2" className="home-disc" aria-label="Brand, digital, print, social, web, editorial and whatever else your heart desires">
        {"Brand "}
        <InlineIcon char="⦿" className="home-disc-icon" />
        {" Digital "}
        <InlineIcon char="🖧" className="home-disc-icon" />
        {" Print "}
        <InlineIcon char="📦" className="home-disc-icon" />
        {" Social "}
        <InlineIcon char="👪" className="home-disc-icon" />
        {" Web "}
        <InlineIcon char="⮔" className="home-disc-icon" />
        {" Editorial "}
        <span className="home-disc-pink">and</span>
        {" whatever else your heart "}
        <InlineIcon char="♡" className="home-disc-icon" />
        {" desires"}
      </MaskReveal>
    </section>
  );
}

/* ─── Selected work ─────────────────────────────────────────── */
function SelectedWork() {
  const picks = SELECTED.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean) as typeof projects;
  let i = 0;
  return (
    <Reveal section as="section" id="top-work" className="home-section no-rule px-5 md:px-10" aria-label="Selected work">
      <div className="grid grid-cols-12 gap-x-8 gap-y-20 md:gap-y-28">
        {picks.map((project) => (
          <ProjectCard key={project.slug} project={project} index={i++} />
        ))}
      </div>
    </Reveal>
  );
}

/* ─── What I do: category names as big inline pill-bubbles ──────
   Same size/layout as the disciplines wall (.home-disc), but each word set in a
   nav-style bubble, wrapping inline like a paragraph. */
const CAP_PILLS = [
  { name: "Brand identity", filter: "brand" },
  { name: "Editorial & print", filter: "editorial" },
  { name: "Web & UI design", filter: "web" },
  { name: "Creative direction", filter: "art" },
  { name: "Motion graphics", filter: "motion" },
  { name: "Social campaigns", filter: "motion" },
];

function Capabilities() {
  return (
    <section className="home-disciplines px-5 md:px-10" aria-label="Services">
      <div className="home-disc home-cap-wrap">
        {CAP_PILLS.map((c) => (
          <Link key={c.name} href={`/work?filter=${c.filter}`} className="home-cap-pill">
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <HomeIntro />
      <Disciplines />
      {/* Past this point the auto-hidden nav slides in (see LayoutShell). */}
      <div id="nav-reveal-sentinel" aria-hidden="true" />
      <SelectedWork />
      <Capabilities />
    </>
  );
}
