import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import CapabilitiesSlider from "@/components/CapabilitiesSlider";
import HomeIntro from "@/components/HomeIntro";

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

/* Section heading row: a natural H2 with an optional link on the right. */
function SectionHead({ title, aside }: { title: string; aside?: React.ReactNode }) {
  return (
    <div className="home-section-index">
      <h2 className="home-display-sm text-ink">{title}</h2>
      {aside}
    </div>
  );
}

/* ─── Disciplines: a big-type wall with dingbats set inline in the type ──────
   Glyphs are drawn from the Noto Sans Symbols 2 dingbat font (OFL, loaded in
   layout.tsx as --font-dingbat) — quirky little marks between each word. */
function Ding({ char }: { char: string }) {
  return (
    <span className="home-disc-icon" aria-hidden="true">
      {char}
    </span>
  );
}

function Disciplines() {
  return (
    <section className="home-disciplines px-5 md:px-10" aria-label="What I do">
      <h2 className="home-disc" aria-label="Brand, digital, print, social, web, editorial and whatever else your heart desires">
        <span aria-hidden="true">Brand</span>
        <Ding char="✶" />
        <span aria-hidden="true">Digital</span>
        <Ding char="❧" />
        <span aria-hidden="true">Print</span>
        <Ding char="☞" />
        <span aria-hidden="true">Social</span>
        <Ding char="❄" />
        <span aria-hidden="true">Web</span>
        <Ding char="✺" />
        <span aria-hidden="true">Editorial</span>
        <span aria-hidden="true">
          {" "}
          <span className="home-disc-pink">and</span> whatever else your heart
        </span>
        <Ding char="❤" />
        <span aria-hidden="true">desires</span>
      </h2>
    </section>
  );
}

/* ─── Selected work ─────────────────────────────────────────── */
function SelectedWork() {
  const picks = SELECTED.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean) as typeof projects;
  let i = 0;
  return (
    <Reveal section as="section" className="home-section no-rule px-5 md:px-10" aria-label="Selected work">
      <div className="grid grid-cols-12 gap-x-8 gap-y-20 md:gap-y-28">
        {picks.map((project) => (
          <ProjectCard key={project.slug} project={project} index={i++} />
        ))}
      </div>
    </Reveal>
  );
}

/* ─── What I do (infinite capabilities slider) ──────────────── */
function Capabilities() {
  return (
    <Reveal section as="section" className="home-section px-5 md:px-10 overflow-hidden" aria-label="What I do">
      <SectionHead
        title="What I do"
        aside={<Link href="/about#contact" className="home-link">Hiring or have a project? →</Link>}
      />
      <p className="text-ink-soft leading-relaxed mb-5 max-w-xl" style={{ fontSize: "var(--text-small)" }}>
        One designer across the whole range. Tap a discipline to see the work.
      </p>
      <div className="-mx-5 md:-mx-10">
        <CapabilitiesSlider />
      </div>
    </Reveal>
  );
}

/* ─── Contact ───────────────────────────────────────────────── */
function Contact() {
  return (
    <Reveal section as="section" className="home-section px-5 md:px-10" aria-label="Contact">
      <SectionHead title="Get in touch" />
      <div className="grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <p className="text-ink-soft mb-4" style={{ fontSize: "var(--text-small)" }}>
            Email&rsquo;s the best way to reach me.
          </p>
          <h3>
            <a
              href="mailto:finbar@finbar.studio"
              className="mono-h3 text-ink hover:text-pink transition-colors"
            >
              finbar@finbar.studio
            </a>
          </h3>
        </div>
        <div className="md:col-span-4 space-y-3">
          <div>
            <p className="mono-label text-ink-soft mb-1">Location</p>
            <p className="text-ink" style={{ fontSize: "var(--text-small)" }}>Brisbane, QLD. Remote-friendly.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
            <Link href="/about" className="mono-label text-ink-soft hover:text-pink transition-colors">About</Link>
            <Link href="/work" className="mono-label text-ink-soft hover:text-pink transition-colors">Work</Link>
            <Link href="/about#contact" className="mono-label text-ink-soft hover:text-pink transition-colors">Contact</Link>
            <Link href="/privacy" className="mono-label text-ink-soft hover:text-pink transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </Reveal>
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
      <Contact />
    </>
  );
}
