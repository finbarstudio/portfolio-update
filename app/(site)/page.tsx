import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import HeroHeadline from "@/components/HeroHeadline";
import HeroStar from "@/components/HeroStar";
import CapabilitiesSlider from "@/components/CapabilitiesSlider";
import BrandStar from "@/components/BrandStar";
import Preloader from "@/components/Preloader";

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

/* ─── Intro: a blank first screen with the wordmark across the bottom ── */
function Intro() {
  return (
    <section className="home-intro" aria-label="finbar studio">
      <div className="home-intro-mark" aria-hidden="true">
        <span className="home-intro-word">finbar</span>
        <BrandStar className="home-intro-star" size="1em" />
        <span className="home-intro-word">studio</span>
      </div>
    </section>
  );
}

/* ─── Hero ──────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden px-5 md:px-10 pt-12 md:pt-24 pb-16 md:pb-24" aria-label="Introduction">
      <HeroStar />
      <div className="relative z-10">
      <Reveal immediate as="div" className="mb-6 md:mb-8">
        <span className="sticker-pill is-pink">
          <span className="status-dot" aria-hidden="true" /> Brisbane graphic designer
        </span>
      </Reveal>

      <HeroHeadline text="Brand identity, editorial, web & motion." className="home-display text-ink max-w-[15ch]" />

      <Reveal immediate delay={0.18} className="mt-8 md:mt-10 grid md:grid-cols-12 gap-6 md:gap-8 items-end">
        <p className="md:col-span-7 text-ink leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
          I&rsquo;m Finbar — brand identities, publications and websites for clients in Australia and the UK.
        </p>
        <div className="md:col-span-5 md:col-start-9">
          <p className="mono-label text-ink-soft mb-3">Available for</p>
          <div className="flex flex-wrap gap-2">
            <span className="sticker-pill">Freelance projects</span>
            <span className="sticker-pill">Permanent roles</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6">
            <Link href="/work" className="home-link">View work →</Link>
            <Link href="/about#contact" className="home-link">Start a project →</Link>
          </div>
        </div>
      </Reveal>
      </div>
    </section>
  );
}

/* ─── Selected work ─────────────────────────────────────────── */
function SelectedWork() {
  const picks = SELECTED.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean) as typeof projects;
  let i = 0;
  return (
    <Reveal section as="section" className="home-section px-5 md:px-10" aria-label="Selected work">
      <SectionHead title="Selected work" aside={<Link href="/work" className="home-link">Full archive →</Link>} />
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
      <Preloader />
      <Intro />
      <Hero />
      <SelectedWork />
      <Capabilities />
      <Contact />
    </>
  );
}
