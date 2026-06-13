import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  // Home uses the default title from the root layout. Refine the description for
  // the new positioning + local search.
  description:
    "finbar✶studio is the independent creative practice of Finbar Skitini — a Brisbane graphic designer and design-minded developer making brand identities, websites and design systems for businesses across Australia and the UK.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Finbar Studio | Brisbane Graphic Designer & Framer Developer",
    description:
      "Independent creative practice — brand identity, web design and digital experiences. Brisbane, available for select freelance projects and permanent roles.",
    url: SITE_URL,
    type: "website",
  },
};

/* The three strongest, hand-picked for the homepage (the rest live in /work). */
const SELECTED = ["tmyr", "salesmasters", "kinaya"];

/* ─── Home page WebPage node ─────────────────────────────────────
   The home page describes the practice; the Person/WebSite nodes live in the
   root layout and are referenced here so the graph stays linked. */
function HomeJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: "Finbar Studio — Brisbane Graphic Designer & Design-Minded Developer",
    description:
      "Independent creative practice: brand identity, web design and digital experiences by a Brisbane graphic designer and design-minded developer.",
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

/* Small reusable section opener: index number + label, over a thin rule. */
function SectionIndex({ index, label, aside }: { index: string; label: string; aside?: React.ReactNode }) {
  return (
    <div className="home-section-index">
      <p className="mono-label text-ink-soft">
        <span className="text-ink">{index}</span> &nbsp;/&nbsp; {label}
      </p>
      {aside}
    </div>
  );
}

/* ─── 01 — Hero ─────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="px-5 md:px-10 pt-10 md:pt-16 pb-12 md:pb-16" aria-label="Introduction">
      <p className="mono-label text-ink-soft mb-6 md:mb-8">
        Independent creative studio — Brisbane, AU
      </p>

      {/* One H1, carrying the positioning + the primary local term. */}
      <h1 className="home-display text-ink max-w-[16ch]">
        Brand, web &amp; product design, built end to end.
      </h1>

      <div className="mt-8 md:mt-10 grid md:grid-cols-12 gap-6 md:gap-8 items-end">
        <p className="md:col-span-7 text-ink leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
          I&rsquo;m Finbar — a Brisbane graphic designer and design-minded developer. I make
          visual identities, websites and design systems for brands across Australia and the UK,
          then build them properly with modern tooling. One person, the full range: strategy,
          design and the code that ships it.
        </p>
        <div className="md:col-span-5 md:col-start-9">
          <p className="mono-label text-ink-soft mb-3">Available for</p>
          <ul className="home-list">
            <li className="home-status">
              <span className="status-dot" aria-hidden="true" />
              <span className="text-ink" style={{ fontSize: "var(--text-small)" }}>Select freelance projects</span>
            </li>
            <li className="home-status">
              <span className="status-dot" aria-hidden="true" />
              <span className="text-ink" style={{ fontSize: "var(--text-small)" }}>Permanent design roles</span>
            </li>
          </ul>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6">
            <Link href="/work" className="home-link">View work →</Link>
            <Link href="/contact" className="home-link">Start a project →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 02 — Selected work ────────────────────────────────────── */
function SelectedWork() {
  const picks = SELECTED.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean) as typeof projects;
  let i = 0;
  return (
    <section className="home-section px-5 md:px-10" aria-label="Selected work">
      <SectionIndex
        index="02"
        label="Selected work"
        aside={<Link href="/work" className="home-link">Full archive →</Link>}
      />
      <div className="grid grid-cols-12 gap-x-8 gap-y-16 md:gap-y-20">
        {picks.map((project) => (
          <ProjectCard key={project.slug} project={project} index={i++} />
        ))}
      </div>
    </section>
  );
}

/* ─── 03 — Studio philosophy ────────────────────────────────── */
function Philosophy() {
  return (
    <section className="home-section px-5 md:px-10" aria-label="How the studio works">
      <SectionIndex index="03" label="Studio" />
      <div className="grid md:grid-cols-12 gap-8">
        <h2 className="home-display-sm text-ink md:col-span-7 max-w-[18ch]">
          Designed as a system. Built like software.
        </h2>
        <div className="md:col-span-5 md:col-start-8 space-y-4 text-ink leading-relaxed" style={{ fontSize: "var(--text-small)" }}>
          <p>
            Most work starts with the brand — the mark, the type, the rules — then carries through
            to whatever it needs to live on: a website, a publication, a campaign. Holding both the
            design and the build means nothing gets lost in the handover.
          </p>
          <p>
            I care about the parts people feel but rarely name: spacing, hierarchy, how a page moves,
            how a layout holds up at every size. I prototype quickly, test in the browser, and use
            modern tooling and AI where it makes the work sharper — never as a shortcut around craft.
          </p>
          <p>
            The result is work that looks considered, reads clearly, and holds together technically.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── 04 — Split pathway ────────────────────────────────────── */
function SplitPathway() {
  return (
    <section className="home-section px-5 md:px-10" aria-label="Ways to work together">
      <SectionIndex index="04" label="Two ways in" />
      <div className="home-split">
        {/* For employers */}
        <div>
          <p className="mono-label text-ink-soft mb-4">For employers</p>
          <h2 className="home-display-sm text-ink mb-6 max-w-[12ch]">A designer who ships.</h2>
          <p className="text-ink leading-relaxed mb-6" style={{ fontSize: "var(--text-small)" }}>
            Looking for someone who can own brand and interface work and take it all the way into
            production. I work across design and front-end, and I&rsquo;m open to permanent roles.
          </p>
          <ul className="home-list mb-7" style={{ fontSize: "var(--text-small)" }}>
            <li className="text-ink">Brand identity &amp; design systems</li>
            <li className="text-ink">Web &amp; product design</li>
            <li className="text-ink">Front-end build (React / Next.js / Framer)</li>
            <li className="text-ink">Workflow, tooling &amp; AI-assisted production</li>
          </ul>
          <Link href="/about" className="home-link">View team fit →</Link>
        </div>

        {/* For clients */}
        <div>
          <p className="mono-label text-ink-soft mb-4">For clients</p>
          <h2 className="home-display-sm text-ink mb-6 max-w-[12ch]">A studio of one.</h2>
          <p className="text-ink leading-relaxed mb-6" style={{ fontSize: "var(--text-small)" }}>
            Working with businesses across Australia and the UK on identity, web and the things in
            between. Direct, no account layer — you work with the person doing the work.
          </p>
          <ul className="home-list mb-7" style={{ fontSize: "var(--text-small)" }}>
            <li className="text-ink">Brand identity &amp; logo design</li>
            <li className="text-ink">Web design &amp; development</li>
            <li className="text-ink">Creative direction</li>
            <li className="text-ink">Product &amp; publication design</li>
          </ul>
          <Link href="/contact" className="home-link">Start a project →</Link>
        </div>
      </div>
    </section>
  );
}

/* ─── 05 — Future products ──────────────────────────────────── */
function Products() {
  return (
    <section className="home-section px-5 md:px-10" aria-label="Studio products">
      <SectionIndex index="05" label="Studio products" aside={<span className="tag tag-teal">Coming soon</span>} />
      <div className="grid md:grid-cols-12 gap-8 items-end">
        <h2 className="home-display-sm text-ink md:col-span-7 max-w-[16ch]">
          Tools and templates, in the works.
        </h2>
        <p className="md:col-span-5 md:col-start-8 text-ink-soft leading-relaxed" style={{ fontSize: "var(--text-small)" }}>
          A small line of digital products is on the way — design templates, Framer components and
          plugins drawn from client work. Built once, made to reuse.
        </p>
      </div>
    </section>
  );
}

/* ─── 06 — Contact ──────────────────────────────────────────── */
function Contact() {
  return (
    <section className="home-section px-5 md:px-10" aria-label="Contact">
      <SectionIndex index="06" label="Contact" />
      <div className="grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <p className="text-ink-soft mb-4" style={{ fontSize: "var(--text-small)" }}>
            Have a project, a role, or a question? Email is the fastest way to reach me.
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
            <p className="text-ink" style={{ fontSize: "var(--text-small)" }}>Brisbane, QLD — remote-friendly</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
            <Link href="/about" className="mono-label text-ink-soft hover:text-pink transition-colors">About</Link>
            <Link href="/work" className="mono-label text-ink-soft hover:text-pink transition-colors">Work</Link>
            <Link href="/contact" className="mono-label text-ink-soft hover:text-pink transition-colors">Contact</Link>
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
      <Philosophy />
      <SplitPathway />
      <Products />
      <Contact />
    </>
  );
}
