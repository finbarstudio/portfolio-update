import type { Metadata } from "next";
import Script from "next/script";
import ClientImage from "@/components/ClientImage";
import { projects } from "@/content/projects";

const SITE_URL = "https://www.finbar.studio";

// ProfilePage is the canonical schema for a personal/about page. It points at
// the one Person node defined in the root layout rather than redefining it.
const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about#webpage`,
  url: `${SITE_URL}/about`,
  name: "About | Finbar Skitini | Brisbane Designer",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  inLanguage: "en-AU",
  mainEntity: { "@id": `${SITE_URL}/#person` },
};

/* ── Testimonials gathered from any project that has one ─────── */
function AboutTestimonials() {
  const quotes = projects
    .filter((p) => p.testimonial)
    .map((p) => ({ ...p.testimonial!, slug: p.slug }));
  if (!quotes.length) return null;
  return (
    <section className="pt-10 pb-12 border-t border-line" aria-label="Client testimonials">
      <p className="mono-label text-ink-soft mb-6">Kind words</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {quotes.map((q) => (
          <figure key={q.slug} className="max-w-prose">
            <blockquote
              className="font-sans text-ink leading-relaxed"
              style={{ fontSize: "var(--text-body)", lineHeight: 1.6 }}
            >
              &ldquo;{q.quote}&rdquo;
            </blockquote>
            <figcaption
              className="mono-label text-ink-soft mt-4"
              style={{ fontSize: "11px" }}
            >
              {q.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: { absolute: "About | Finbar Skitini | Brisbane Designer" },
  description:
    "Hi I am Finbar, a Brisbane-based graphic designer originally from London. Websites and brands built with care, creativity, and a strong graphic design foundation.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Finbar Skitini | Brisbane Designer",
    description:
      "Hi I am Finbar, a Brisbane-based graphic designer originally from London. Websites and brands built with care, creativity, and a strong graphic design foundation.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
      <h1
        className="font-sans font-bold uppercase text-ink leading-[1.02]"
        style={{ fontSize: "var(--text-display)", letterSpacing: "0.03em" }}
      >
        Finbar Skitini.
      </h1>

      <p className="mono-label text-ink-soft mt-6 mb-12">
        graphic designer &amp; framer developer · brisbane, au
      </p>

      {/* Headshot + Bio */}
      <div className="mb-16 md:mb-24 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
        <div
          className="shrink-0"
          style={{ width: 160, height: 160, position: "relative", borderRadius: 4, overflow: "hidden", background: "white" }}
        >
          <ClientImage
            src="/images/headshot.webp"
            alt="Finbar Skitini, graphic designer and Framer developer"
            fill
            sizes="160px"
            className="object-contain"
          />
        </div>
        <div className="max-w-2xl">
          <div className="space-y-4 font-sans leading-relaxed text-ink" style={{ fontSize: "var(--text-body)" }}>
            <p>
              I&rsquo;m a graphic designer and Framer developer based in
              Brisbane. Over the last four years I&rsquo;ve worked across brand
              identity, digital campaigns, websites and publications. Originally
              from London. Studied design in London and Brighton, then moved to
              Australia and started Finbar Studio.
            </p>
            <p>
              Most jobs start with the brand: logo, colour, type, guidelines.
              From there I take it into whatever comes next, usually a motion
              campaign, a printed publication, or a Framer website with a CMS
              the client can run themselves.
            </p>
            <p>
              I like work that looks good, holds up technically, and actually
              works for the people using it. Accessibility isn&rsquo;t something
              I bolt on at the end. I&rsquo;d rather build for real users than
              for a tidy portfolio screenshot.
            </p>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="mb-16 md:mb-24">
        <p className="mono-label text-ink-soft mb-8">Capabilities</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-12">
          {[
            {
              heading: "Brand Identity",
              items: [
                "Logo design & logomark",
                "Colour systems",
                "Typography selection",
                "Brand guidelines",
                "Graphic asset systems",
              ],
            },
            {
              heading: "Web & Digital",
              items: [
                "Framer development",
                "CMS setup & handover",
                "Custom interactive components",
                "Accessibility implementation",
                "SEO foundations",
              ],
            },
            {
              heading: "Publication & Campaign",
              items: [
                "Publication design (InDesign)",
                "Infographic design",
                "Content writing",
                "Motion graphics (After Effects)",
                "Print production",
              ],
            },
          ].map(({ heading, items }) => (
            <div key={heading} className="border-l border-line pl-5">
              <p
                className="font-sans font-bold uppercase text-ink mb-4 tracking-wider"
                style={{ fontSize: "var(--text-small)" }}
              >
                {heading}
              </p>
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
      </div>

      {/* Testimonials — pulled from any project that has one */}
      <AboutTestimonials />

      {/* Contact CTA */}
      <div className="pt-8 border-t border-line">
        <div className="mb-3">
          <span className="status-badge">OPEN FOR WORK</span>
        </div>
        <p className="font-sans text-ink-soft mb-5" style={{ fontSize: "var(--text-small)" }}>
          Taking on full-time design roles and freelance projects. Based in
          Brisbane, happy to work remotely.
        </p>
        <a
          href="mailto:finbar@finbar.studio"
          className="font-sans font-bold text-ink hover:text-pink transition-colors"
          style={{ fontSize: "var(--text-h2)" }}
        >
          finbar@finbar.studio
        </a>
      </div>
    </div>
  );
}
