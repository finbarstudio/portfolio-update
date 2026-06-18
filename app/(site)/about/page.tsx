import type { Metadata } from "next";
import Script from "next/script";
import ClientImage from "@/components/ClientImage";
import Reveal from "@/components/Reveal";
import { projects } from "@/content/projects";

const SITE_URL = "https://www.finbar.studio";

// Combined About + Contact page. ProfilePage with a contactPoint, pointing at
// the one Person node defined in the root layout.
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about#webpage`,
  url: `${SITE_URL}/about`,
  name: "About & Contact | Finbar Skitini, Brisbane Graphic Designer",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  inLanguage: "en-AU",
  mainEntity: {
    "@id": `${SITE_URL}/#person`,
    contactPoint: {
      "@type": "ContactPoint",
      email: "finbar@finbar.studio",
      telephone: "+61412796630",
      contactType: "Enquiries",
      areaServed: ["AU", "GB"],
      availableLanguage: "English",
    },
  },
};

const FACTS = [
  { label: "Based in", value: "Brisbane, QLD" },
  { label: "Working with", value: "Clients in AU + UK" },
  { label: "From", value: "London, originally" },
  { label: "Status", value: "Open for work" },
];

const PRINCIPLES = [
  {
    heading: "First principles",
    body: "I strip a brief back to what it actually needs, then build the design up from there, rather than starting from a template or whatever's trending.",
  },
  {
    heading: "Tech as a lever",
    body: "I lean on the latest tools to clear the technical barriers, so the time goes into the design and the craft instead of fighting the software.",
  },
  {
    heading: "Genuinely care",
    body: "I care about the work landing right about as much as I care about getting paid for it, and that tends to show up in the details.",
  },
];

const CAPABILITIES = [
  {
    heading: "Brand identity",
    items: ["Logo & logomark", "Colour systems", "Typography", "Brand guidelines", "Asset systems"],
  },
  {
    heading: "Editorial & print",
    items: ["Publication design (InDesign)", "Infographics", "Layout & typesetting", "Print production", "Content writing"],
  },
  {
    heading: "Web, motion & more",
    items: ["Website & UI design", "Creative direction", "Motion graphics (After Effects)", "Photoshop & Illustrator", "AI-assisted workflow"],
  },
];

const SOCIALS = [
  { label: "Are.na", href: "https://are.na/finbar-studio" },
  { label: "LinkedIn", href: "https://linkedin.com/in/finbarskitini" },
  { label: "Instagram", href: "https://instagram.com/finbar.studio" },
  { label: "X", href: "https://x.com/finbarstudio" },
];

/* Testimonials gathered from any project that has one. */
function AboutTestimonials() {
  const quotes = projects.filter((p) => p.testimonial).map((p) => ({ ...p.testimonial!, slug: p.slug }));
  if (!quotes.length) return null;
  return (
    <Reveal section as="section" className="home-section" aria-label="Client testimonials">
      <div className="home-section-index">
        <h2 className="home-display-sm text-ink">Kind words</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
        {quotes.map((q) => (
          <figure key={q.slug} className="max-w-prose">
            <blockquote className="font-sans text-ink leading-relaxed" style={{ fontSize: "var(--text-body)", lineHeight: 1.6 }}>
              &ldquo;{q.quote}&rdquo;
            </blockquote>
            <figcaption className="meta-mono text-ink-soft mt-4" style={{ fontSize: "11px" }}>
              {q.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </Reveal>
  );
}

export const metadata: Metadata = {
  title: { absolute: "About & Contact | Finbar Skitini, Brisbane Graphic Designer" },
  description:
    "Finbar Skitini is a Brisbane graphic designer working in brand identity, editorial, web and motion. About the studio, plus how to get in touch.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About & Contact | Finbar Studio",
    description:
      "Brisbane graphic designer working in brand identity, editorial, web and motion. About the studio and how to get in touch.",
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <div className="px-5 md:px-10 pt-8 md:pt-12 pb-10">
      <Script
        id="ld-about"
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      {/* ── Statement ─────────────────────────────────────────── */}
      <Reveal immediate as="header" className="max-w-[18ch] md:max-w-none">
        <p className="mono-label text-ink-soft mb-6">Brisbane graphic designer · AU + UK</p>
        <h1 className="home-display text-ink max-w-[20ch]">
          I&rsquo;m Finbar, a Brisbane graphic designer who sweats the small stuff.
        </h1>
      </Reveal>

      {/* ── Portrait + bio + facts ───────────────────────────── */}
      <Reveal as="div" className="mt-12 md:mt-16 grid md:grid-cols-12 gap-8 md:gap-12 items-start">
        <div className="md:col-span-4">
          <div
            style={{ width: "100%", maxWidth: 256, aspectRatio: "1", position: "relative", borderRadius: 10, overflow: "hidden", background: "var(--surface-sunken)" }}
          >
            <ClientImage
              src="/images/headshot.webp"
              alt="Finbar Skitini, Brisbane graphic designer"
              fill
              priority
              sizes="(max-width: 768px) 80vw, 256px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-5 space-y-4 font-sans leading-relaxed text-ink" style={{ fontSize: "var(--text-body)" }}>
          <p>
            I design brand identities, publications and websites for businesses across Australia
            and the UK. My background is print and editorial, so type, grids and the small details
            are where I&rsquo;m strongest, and I bring the same eye to everything on screen.
          </p>
          <p>
            I trained at Ravensbourne University in London and the University of Brighton, then moved
            to Australia and started working as finbar studio. Most jobs begin with the brand, the
            logo, colour and type, then run into whatever&rsquo;s next: a publication, a website, a campaign.
          </p>
          <p>
            Away from client work I tinker with creative coding, the interactive and generative kind
            this site is built from. Leaning on Claude for the technical side keeps me in the design
            rather than buried in code, and a fair bit of what I work out there ends up useful for
            clients too.
          </p>
        </div>

        {/* Facts */}
        <div className="md:col-span-3 md:border-l md:border-line md:pl-6">
          <dl className="grid grid-cols-2 md:grid-cols-1 gap-6">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="mono-label text-ink-soft mb-1.5">{f.label}</dt>
                <dd className="text-ink" style={{ fontSize: "var(--text-small)" }}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      {/* ── How I work ────────────────────────────────────────── */}
      <Reveal section as="section" className="home-section" aria-label="How I work">
        <div className="home-section-index">
          <h2 className="home-display-sm text-ink">How I work</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
          {PRINCIPLES.map((p) => (
            <div key={p.heading}>
              <h3 className="mono-heading text-pink mb-3">{p.heading}</h3>
              <p className="text-ink-soft leading-relaxed" style={{ fontSize: "var(--text-small)" }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── Capabilities ──────────────────────────────────────── */}
      <Reveal section as="section" className="home-section" aria-label="Capabilities">
        <div className="home-section-index">
          <h2 className="home-display-sm text-ink">What I do</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-12">
          {CAPABILITIES.map(({ heading, items }) => (
            <div key={heading} className="border-l border-line pl-5">
              <h3 className="font-sans font-bold uppercase text-ink mb-4 tracking-wider" style={{ fontSize: "var(--text-small)" }}>
                {heading}
              </h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="font-sans text-ink-soft" style={{ fontSize: "var(--text-small)" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <AboutTestimonials />

      {/* ── Contact ───────────────────────────────────────────── */}
      <Reveal section as="section" className="home-section" id="contact" aria-label="Contact">
        <div className="home-section-index">
          <h2 className="home-display-sm text-ink">Let&rsquo;s work together</h2>
          <span className="status-badge">Open for work</span>
        </div>
        <p className="text-ink-soft mb-6 max-w-xl" style={{ fontSize: "var(--text-small)" }}>
          Got a project or a role in mind? Email is the fastest way to reach me.
        </p>

        <h3 className="mb-8">
          <a href="mailto:finbar@finbar.studio" className="mono-h3 u-underline">
            finbar@finbar.studio
          </a>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
          <div>
            <p className="mono-label text-ink-soft mb-2">Phone</p>
            <a href="tel:+61412796630" className="u-underline tabular-nums" style={{ fontSize: "var(--text-small)" }}>
              +61 412 796 630
            </a>
          </div>
          <div>
            <p className="mono-label text-ink-soft mb-2">Location</p>
            <p className="text-ink" style={{ fontSize: "var(--text-small)" }}>Brisbane, QLD</p>
            <p className="text-ink-soft" style={{ fontSize: "var(--text-caption)" }}>Remote-friendly</p>
          </div>
          <div>
            <p className="mono-label text-ink-soft mb-2">Elsewhere</p>
            <div className="flex flex-col gap-1.5">
              {SOCIALS.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="u-underline" style={{ fontSize: "var(--text-small)" }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
