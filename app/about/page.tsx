import type { Metadata } from "next";
import Script from "next/script";
import ClientImage from "@/components/ClientImage";
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
    <section className="home-section" aria-label="Client testimonials">
      <p className="mono-label text-ink-soft mb-6">Kind words</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {quotes.map((q) => (
          <figure key={q.slug} className="max-w-prose">
            <blockquote className="font-sans text-ink leading-relaxed" style={{ fontSize: "var(--text-body)", lineHeight: 1.6 }}>
              &ldquo;{q.quote}&rdquo;
            </blockquote>
            <figcaption className="mono-label text-ink-soft mt-4" style={{ fontSize: "11px" }}>
              {q.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
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

      <p className="mono-label text-ink-soft mb-6">Brisbane graphic designer</p>
      <h1
        className="font-sans font-bold uppercase text-ink leading-[1.02]"
        style={{ fontSize: "var(--text-display)", letterSpacing: "0.03em" }}
      >
        Finbar Skitini.
      </h1>

      {/* Headshot + bio */}
      <div className="mt-10 md:mt-14 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
        <div
          className="shrink-0"
          style={{ width: 160, height: 160, position: "relative", borderRadius: 6, overflow: "hidden", background: "var(--surface-sunken)" }}
        >
          <ClientImage
            src="/images/headshot.webp"
            alt="Finbar Skitini, Brisbane graphic designer"
            fill
            priority
            sizes="160px"
            className="object-cover"
          />
        </div>
        <div className="max-w-2xl space-y-4 font-sans leading-relaxed text-ink" style={{ fontSize: "var(--text-body)" }}>
          <p>
            I&rsquo;m Finbar, a graphic designer in Brisbane, originally from London. I studied
            design in London and Brighton, then moved to Australia and started working as finbar
            studio.
          </p>
          <p>
            My background is brand and editorial. Most jobs start with the brand, the logo, colour
            and type, then run into whatever&rsquo;s next: a publication, a website, a campaign. I
            care about the details, the kerning, the spacing, the way a thing holds together, and I
            bring that to screen work as much as print.
          </p>
          <p>
            I also lean on modern tools, AI included, to handle the technical lift and move quickly.
            That frees me up to spend my time on the creative work and get more done for each client.
          </p>
        </div>
      </div>

      {/* Capabilities */}
      <section className="home-section mt-16 md:mt-24" aria-label="Capabilities">
        <p className="mono-label text-ink-soft mb-8">Capabilities</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-12">
          {CAPABILITIES.map(({ heading, items }) => (
            <div key={heading} className="border-l border-line pl-5">
              <h2 className="font-sans font-bold uppercase text-ink mb-4 tracking-wider" style={{ fontSize: "var(--text-small)" }}>
                {heading}
              </h2>
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
      </section>

      <AboutTestimonials />

      {/* Contact — merged in from the old /contact page */}
      <section className="home-section" id="contact" aria-label="Contact">
        <h2 className="home-display-sm text-ink mb-2">Get in touch</h2>
        <p className="text-ink-soft mb-6 max-w-xl" style={{ fontSize: "var(--text-small)" }}>
          Open to freelance projects and permanent design roles. Email is the fastest way to reach me.
        </p>

        <a
          href="mailto:finbar@finbar.studio"
          className="home-display-sm text-ink hover:text-pink transition-colors break-words inline-block mb-8"
        >
          finbar@finbar.studio
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
          <div>
            <p className="mono-label text-ink-soft mb-2">Phone</p>
            <a href="tel:+61412796630" className="text-ink hover:text-pink transition-colors tabular-nums" style={{ fontSize: "var(--text-small)" }}>
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
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-pink transition-colors" style={{ fontSize: "var(--text-small)" }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <span className="status-badge">OPEN FOR WORK</span>
        </div>
      </section>
    </div>
  );
}
