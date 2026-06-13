import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  description:
    "Finbar Studio is the independent practice of Finbar Skitini, a Brisbane graphic designer working in brand identity, editorial, web and motion for businesses in Australia and the UK.",
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
const SELECTED = ["tmyr", "salesmasters", "kinaya"];

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

/* ─── Hero ──────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="px-5 md:px-10 pt-16 md:pt-32 pb-12 md:pb-16" aria-label="Introduction">
      <p className="mono-label text-ink-soft mb-6 md:mb-8 home-enter">Brisbane graphic designer</p>

      <h1 className="home-display text-ink max-w-[15ch] home-enter" style={{ animationDelay: "0.06s" }}>
        Brand identity, editorial, web &amp; motion.
      </h1>

      <div className="mt-8 md:mt-10 grid md:grid-cols-12 gap-6 md:gap-8 items-end home-enter" style={{ animationDelay: "0.14s" }}>
        <p className="md:col-span-7 text-ink leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
          I&rsquo;m Finbar. I design brand identities, publications and websites for businesses in
          Australia and the UK. My background is print and editorial, so type, grids and the small
          details are where I&rsquo;m strongest, and I bring the same eye to everything on screen.
        </p>
        <div className="md:col-span-5 md:col-start-9">
          <p className="mono-label text-ink-soft mb-3">Available for</p>
          <ul className="home-list">
            <li>
              <span className="status-dot" aria-hidden="true" />
              <span className="text-ink" style={{ fontSize: "var(--text-small)" }}>Select freelance projects</span>
            </li>
            <li>
              <span className="status-dot" aria-hidden="true" />
              <span className="text-ink" style={{ fontSize: "var(--text-small)" }}>Permanent design roles</span>
            </li>
          </ul>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6">
            <Link href="/work" className="home-link">View work →</Link>
            <Link href="/about#contact" className="home-link">Start a project →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Selected work ─────────────────────────────────────────── */
function SelectedWork() {
  const picks = SELECTED.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean) as typeof projects;
  let i = 0;
  return (
    <section className="home-section px-5 md:px-10" aria-label="Selected work">
      <div className="reveal-up">
        <SectionHead title="Selected work" aside={<Link href="/work" className="home-link">Full archive →</Link>} />
      </div>
      <div className="grid grid-cols-12 gap-x-8 gap-y-16 md:gap-y-20">
        {picks.map((project) => (
          <ProjectCard key={project.slug} project={project} index={i++} />
        ))}
      </div>
    </section>
  );
}

/* ─── How I work ────────────────────────────────────────────── */
function Approach() {
  return (
    <section className="home-section px-5 md:px-10 reveal-up" aria-label="How I work">
      <SectionHead title="How I work" />
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7 max-w-2xl space-y-4 text-ink leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
          <p>
            Most projects start with the brand: the mark, the type, the rules. From there it goes
            wherever it needs to, a website, a publication, a campaign.
          </p>
          <p>
            My background is editorial and print, so I think in grids and hierarchy and care about
            the small stuff, kerning, spacing, the way a page holds together. That carries into the
            web work, where the detail tends to show the most.
          </p>
          <p>
            I work creative first and move quickly, putting things in front of real content and
            adjusting until they feel right.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── What I do (capabilities matrix) ───────────────────────── */
const CAPABILITIES = [
  { name: "Brand identity", desc: "Logomarks, colour and type, with guidelines to keep it consistent." },
  { name: "Editorial & print", desc: "Publications and print-ready layouts, set in InDesign." },
  { name: "Web & UI design", desc: "Brand-led websites and interfaces, built detail-first." },
  { name: "Creative direction", desc: "Art direction and visual systems across a project." },
  { name: "Motion graphics", desc: "Animated assets and short-form video, made in After Effects." },
  { name: "Social campaigns", desc: "Static and motion sets sized for every channel." },
];

function Capabilities() {
  return (
    <section className="home-section px-5 md:px-10 reveal-up" aria-label="What I do">
      <SectionHead
        title="What I do"
        aside={<Link href="/about#contact" className="home-link">Hiring or have a project? →</Link>}
      />
      <p className="text-ink-soft leading-relaxed mb-8 max-w-xl" style={{ fontSize: "var(--text-small)" }}>
        One designer across the whole range, from the first sketch to the finished thing. Open to
        freelance projects and permanent roles alike.
      </p>
      <div className="cap-grid">
        {CAPABILITIES.map((c, i) => (
          <div key={c.name} className="cap-item">
            <span className="cap-index">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="cap-name">{c.name}</h3>
            <p className="cap-desc">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Contact ───────────────────────────────────────────────── */
function Contact() {
  return (
    <section className="home-section px-5 md:px-10 reveal-up" aria-label="Contact">
      <SectionHead title="Get in touch" />
      <div className="grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <p className="text-ink-soft mb-4" style={{ fontSize: "var(--text-small)" }}>
            Got a project or a role in mind? Email is the best way to reach me.
          </p>
          <a
            href="mailto:finbar@finbar.studio"
            className="home-display-sm text-ink hover:text-pink transition-colors break-words"
          >
            finbar@finbar.studio
          </a>
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Hero />
      <SelectedWork />
      <Approach />
      <Capabilities />
      <Contact />
    </>
  );
}
