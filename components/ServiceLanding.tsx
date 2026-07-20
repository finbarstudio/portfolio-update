import { jsonLdHtml } from "@/lib/json-ld";
import Link from "next/link";
import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";
import ContactCta from "@/components/ContactCta";
import FaqAccordion from "@/components/FaqAccordion";
import { MdArrowForward } from "@/components/MaterialIcon";

/**
 * ServiceLanding — a focused service landing page (e.g. /web-design,
 * /graphic-design) built for local search intent and for turning a visitor
 * into an enquiry. Default order, top to bottom:
 *   1. Keyword-led intro (H1 + one paragraph).
 *   2. "What I do" — the capability list, so the page reads as substantial.
 *   3. Long-form H2 sections (the crawlable substance).
 *   4. The relevant slice of the portfolio (matched on category terms).
 *   5. Testimonials, process, meet-the-designer, FAQ, guarantee.
 *   6. CTA with a crawlable NAP (name, area, email, phone).
 *
 * With `galleryFirst`, the portfolio slice jumps to right under the H1 and all
 * the descriptive copy moves below it (used on /web-design — show the work
 * first, explain second).
 *
 * Schema: a Service (provider = the #studio ProfessionalService node, so the
 * local-business signal carries through) inside a CollectionPage, plus a
 * separate FAQPage.
 */

const SITE_URL = "https://www.finbar.studio";

export type Faq = { q: string; a: string };

export type ServiceLandingProps = {
  slug: string;
  label?: string;         // deprecated: the mono eyebrow was removed (no redundant subtitles)
  heading: string;        // H1
  intro: string;          // ~1 paragraph, keyword-led, plainly written
  serviceName: string;    // schema Service name
  description: string;    // meta + schema description
  terms: string[];        // category terms a project must match to show
  excludeSlugs?: string[]; // projects to keep off this page (e.g. web off graphic)
  capsTitle: string;      // "What I do" heading
  capabilities: string[]; // capability bullets
  /** Long-form H2 sections after the capabilities — the substance search
   *  actually rewards (keyword variants, locations, specifics). */
  sections?: { heading: string; body: string }[];
  /** "How a project runs" numbered steps. */
  process?: { title: string; body: string }[];
  /** E-E-A-T block: who is behind the work, with true credential points. */
  meet?: { heading: string; body: string; points: string[] };
  /** Risk-reversal band near the CTA (e.g. the design-stage guarantee). */
  guarantee?: { label: string; body: string };
  faqs: Faq[];            // FAQ + FAQPage schema
  ctaHeading: string;     // CTA headline, page-specific
  /** Optional line under the CTA (e.g. the free homepage redesign offer). */
  ctaNote?: React.ReactNode;
  /** Show the project gallery straight after the H1, with all copy below it. */
  galleryFirst?: boolean;
};

// Whole-word term match (so "ui" doesn't match "guidelines").
const matchesTerms = (project: { categories: string[] }, terms: string[]) => {
  const hay = project.categories.join(" ").toLowerCase();
  return terms.some((t) => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(hay));
};

// Newest year mentioned in a date ("2023 to 2026" -> 2026), for sorting.
const newestYear = (date: string) => {
  const years = (date.match(/\d{4}/g) ?? []).map(Number);
  return years.length ? Math.max(...years) : 0;
};

export default function ServiceLanding({
  slug, heading, intro, serviceName, description, terms, excludeSlugs = [],
  capsTitle, capabilities, sections = [], process = [], meet, guarantee, faqs, ctaHeading, ctaNote,
  galleryFirst = false,
}: ServiceLandingProps) {
  const exclude = new Set(excludeSlugs);
  const matched = [...projects]
    .filter((p) => !p.hidden && !exclude.has(p.slug) && matchesTerms(p, terms))
    .sort((a, b) => newestYear(b.date) - newestYear(a.date) || a.rank - b.rank);

  // Social proof: real client quotes from the projects already on this page.
  const testimonials = matched
    .filter((p) => p.testimonial)
    .slice(0, 3)
    .map((p) => ({ ...p.testimonial!, slug: p.slug }));

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/${slug}#webpage`,
    url: `${SITE_URL}/${slug}`,
    name: `${heading} | Finbar Studio`,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#studio` },
    inLanguage: "en-AU",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: heading, item: `${SITE_URL}/${slug}` },
      ],
    },
    mainEntity: {
      "@type": "Service",
      name: serviceName,
      serviceType: serviceName,
      description,
      provider: { "@id": `${SITE_URL}/#studio` },
      areaServed: [
        { "@type": "City", name: "Brisbane" },
        { "@type": "State", name: "Queensland" },
        { "@type": "Country", name: "Australia" },
        { "@type": "Country", name: "United Kingdom" },
      ],
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/${slug}#faq`,
    isPartOf: { "@id": `${SITE_URL}/${slug}#webpage` },
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // ── Blocks (declared once, arranged by `galleryFirst` below) ──────────────

  // Header: eyebrow + H1. In the default layout the intro paragraph sits with
  // it; in galleryFirst it drops down into the copy flow under the gallery.
  const header = (
    <section className={galleryFirst ? "px-5 md:px-10 pt-10 md:pt-16 pb-6 md:pb-8" : "px-5 md:px-10 pt-10 md:pt-16 pb-10 md:pb-14"}>
      <h1 className="font-bold text-ink leading-[1.02] max-w-4xl" style={{ fontSize: "var(--text-display)", letterSpacing: "-0.01em" }}>
        {heading}
      </h1>
      {!galleryFirst && (
        <p className="text-ink-soft mt-6 max-w-2xl" style={{ fontSize: "var(--text-body)" }}>
          {intro}
        </p>
      )}
    </section>
  );

  // The intro paragraph as a standalone block (galleryFirst only) — the first
  // line of copy once the work has been shown.
  const introBlock = galleryFirst ? (
    <section className="px-5 md:px-10 pt-12 md:pt-16 pb-4">
      <p className="text-ink-soft max-w-2xl" style={{ fontSize: "var(--text-body)" }}>{intro}</p>
    </section>
  ) : null;

  // Capabilities as a wrap of pill-cards — reads across the width, and carries
  // no eyebrow (self-evident). aria-label keeps it named for assistive tech.
  const capsBlock = (
    <section className="px-5 md:px-10 pb-14 md:pb-20" aria-label={capsTitle}>
      <ul className="flex flex-wrap gap-2.5 md:gap-3 max-w-5xl">
        {capabilities.map((c) => (
          <li
            key={c}
            className="rounded-full border border-line px-4 py-2.5 md:px-5 text-ink font-sans leading-none"
            style={{ fontSize: "clamp(0.95rem, 1.25vw, 1.2rem)" }}
          >
            {c}
          </li>
        ))}
      </ul>
    </section>
  );

  const sectionsBlock = sections.length > 0 ? (
    <section className="px-5 md:px-10 pb-12 md:pb-16" aria-label={`About ${serviceName.toLowerCase()}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 max-w-5xl">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="font-bold display-brand leading-snug mb-3" style={{ fontSize: "clamp(1.15rem, 1.6vw, 1.5rem)", letterSpacing: "-0.01em" }}>
              {s.heading}
            </h2>
            <p className="text-ink-soft leading-relaxed" style={{ fontSize: "var(--text-small)" }}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const galleryBlock = (
    <section
      className="bg-bg px-5 md:px-10 pt-2"
      style={{ paddingBottom: "var(--space-section)" }}
      aria-label={`${heading} projects`}
    >
      {matched.length > 0 ? (
        <div className="reveal-open grid grid-cols-12 gap-x-8 gap-y-16 md:gap-y-20">
          {matched.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-ink-soft" style={{ fontSize: "var(--text-small)" }}>
          More coming soon.{" "}
          <Link href="/work" className="u-underline inline-flex items-center gap-1">See all work <MdArrowForward size={14} /></Link>
        </p>
      )}
    </section>
  );

  const testimonialsBlock = testimonials.length > 0 ? (
    <section className="px-5 md:px-10 pb-16 md:pb-24" aria-label="What clients say">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl">
        {testimonials.map((t) => (
          <figure key={t.slug} className="flex flex-col">
            <blockquote className="text-ink leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.15vw, 1.15rem)" }}>
              &ldquo;{t.quote.length > 220 ? `${t.quote.slice(0, 217).trimEnd()}…` : t.quote}&rdquo;
            </blockquote>
            <figcaption className="mono-label text-ink-soft mt-4">{t.author}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  ) : null;

  const processBlock = process.length > 0 ? (
    <section className="px-5 md:px-10 pb-16 md:pb-24" aria-labelledby={`${slug}-process-h`}>
      <h2 id={`${slug}-process-h`} className="mono-heading text-ink-soft mb-6">How a project runs</h2>
      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 max-w-6xl">
        {process.map((p, i) => (
          <li key={p.title}>
            <p className="mono-label text-ink-soft mb-2">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="text-ink font-sans font-semibold mb-1.5" style={{ fontSize: "clamp(1rem, 1.3vw, 1.2rem)" }}>{p.title}</h3>
            <p className="text-ink-soft leading-relaxed" style={{ fontSize: "var(--text-small)" }}>{p.body}</p>
          </li>
        ))}
      </ol>
    </section>
  ) : null;

  const meetBlock = meet ? (
    <section className="px-5 md:px-10 pb-16 md:pb-24" aria-labelledby={`${slug}-meet-h`}>
      <div className="border-t border-line pt-10 grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,13fr)] gap-x-12 lg:gap-x-20 gap-y-6 max-w-6xl">
        <h2 id={`${slug}-meet-h`} className="font-bold display-brand leading-[1.05] md:sticky md:top-24 md:self-start" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.4rem)", letterSpacing: "-0.01em" }}>
          {meet.heading}
        </h2>
        <div>
          <p className="text-ink-soft leading-relaxed max-w-2xl" style={{ fontSize: "var(--text-body)" }}>{meet.body}</p>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-ink font-sans leading-snug" style={{ fontSize: "clamp(1rem, 1.35vw, 1.3rem)" }}>
            {meet.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  ) : null;

  const faqBlock = (
    <section className="px-5 md:px-10 pb-16 md:pb-24" aria-labelledby={`${slug}-faq-h`}>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,7fr)_minmax(0,13fr)] gap-x-12 lg:gap-x-20 gap-y-6 max-w-6xl">
        <div className="md:sticky md:top-24 md:self-start">
          <h2 id={`${slug}-faq-h`} className="font-bold display-brand leading-[1.05]" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.4rem)", letterSpacing: "-0.01em" }}>
            Common questions
          </h2>
          <p className="text-ink-soft mt-3 max-w-[26ch]" style={{ fontSize: "var(--text-small)" }}>
            The things people usually want to know before getting in touch.
          </p>
        </div>
        <FaqAccordion faqs={faqs} idBase={slug} />
      </div>
    </section>
  );

  // The guarantee is a focal moment: a centred, oversized risk-reversal card —
  // deliberately louder than the info blocks above it (no eyebrow label).
  const guaranteeBlock = guarantee ? (
    <section className="px-5 md:px-10 pb-20 md:pb-28" aria-label="Our guarantee">
      <div
        className="mx-auto max-w-3xl text-center rounded-2xl border border-pink px-6 md:px-12 py-12 md:py-16"
        style={{ background: "rgba(233, 109, 137, 0.08)" }}
      >
        <p className="text-ink font-bold leading-[1.15] text-balance" style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.7rem)", letterSpacing: "-0.015em" }}>
          {guarantee.body}
        </p>
      </div>
    </section>
  ) : null;

  // The CTA is the climax: centred, the biggest heading on the page, the action
  // front and centre (louder hierarchy than everything above).
  const ctaBlock = (
    <section className="px-5 md:px-10 pb-24 md:pb-32" aria-label="Start a project">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-bold display-brand leading-[1.03] text-balance" style={{ fontSize: "clamp(2.1rem, 5.2vw, 3.6rem)", letterSpacing: "-0.02em" }}>
          {ctaHeading}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-8">
          {/* Opens the global contact/book-a-call panel, not a mailto. */}
          <ContactCta className="tag tag-pink">Start a project</ContactCta>
          <Link href="/work" className="text-ink-soft u-underline" style={{ fontSize: "var(--text-small)" }}>See more work</Link>
        </div>
        {ctaNote && (
          <p className="text-ink-soft mt-5 leading-relaxed mx-auto max-w-xl" style={{ fontSize: "var(--text-small)" }}>{ctaNote}</p>
        )}
        <address className="not-italic text-ink-soft mt-10 leading-relaxed mx-auto max-w-xl" style={{ fontSize: "var(--text-small)" }}>
          Finbar Studio, Brisbane, QLD, Australia. Working with clients across Australia and the UK.{" "}
          <a href="mailto:finbar@finbar.studio" className="u-underline">finbar@finbar.studio</a>{" "}
          <a href="tel:+61412796630" className="u-underline tabular-nums">+61 412 796 630</a>
        </address>
      </div>
    </section>
  );

  // Copy blocks shared by both layouts, in reading order.
  const copyBlocks = (
    <>
      {capsBlock}
      {sectionsBlock}
      {testimonialsBlock}
      {processBlock}
      {meetBlock}
      {faqBlock}
      {guaranteeBlock}
      {ctaBlock}
    </>
  );

  return (
    <>
      {/* Plain inline scripts (the root layout's pattern): next/script injects
          after hydration, which keeps the schema OUT of the server HTML — fine
          for Googlebot's renderer, invisible to everything that doesn't run JS. */}
      <script
        id={`ld-${slug}`}
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(pageJsonLd) }}
      />
      <script
        id={`ld-${slug}-faq`}
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(faqJsonLd) }}
      />

      {galleryFirst ? (
        // H1 → gallery → all copy.
        <>
          {header}
          {galleryBlock}
          {introBlock}
          {copyBlocks}
        </>
      ) : (
        // Intro → capabilities → sections → gallery → the rest.
        <>
          {header}
          {capsBlock}
          {sectionsBlock}
          {galleryBlock}
          {testimonialsBlock}
          {processBlock}
          {meetBlock}
          {faqBlock}
          {guaranteeBlock}
          {ctaBlock}
        </>
      )}
    </>
  );
}
