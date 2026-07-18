import { jsonLdHtml } from "@/lib/json-ld";
import Link from "next/link";
import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";
import ContactCta from "@/components/ContactCta";
import { MdArrowForward, MdArrowOutward } from "@/components/MaterialIcon";

/**
 * ServiceLanding — a focused service landing page (e.g. /web-design,
 * /graphic-design) built for local search intent and for turning a visitor
 * into an enquiry. Sections, top to bottom:
 *   1. Keyword-led intro (H1 + one paragraph).
 *   2. "What I do" — the capability list, so the page reads as substantial.
 *   3. The relevant slice of the portfolio (matched on category terms).
 *   4. A testimonial strip pulled from those same projects (social proof).
 *   5. FAQ — answers the questions people actually search, and feeds a
 *      FAQPage rich result.
 *   6. CTA with a crawlable NAP (name, area, email, phone).
 *
 * Schema: a Service (provider = the #studio ProfessionalService node, so the
 * local-business signal carries through) inside a CollectionPage, plus a
 * separate FAQPage.
 */

const SITE_URL = "https://www.finbar.studio";

export type Faq = { q: string; a: string };

export type ServiceLandingProps = {
  slug: string;
  label: string;          // small mono eyebrow
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
  slug, label, heading, intro, serviceName, description, terms, excludeSlugs = [],
  capsTitle, capabilities, sections = [], process = [], meet, guarantee, faqs, ctaHeading, ctaNote,
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

      {/* 1 — intro */}
      <section className="px-5 md:px-10 pt-10 md:pt-16 pb-10 md:pb-14">
        <p className="mono-label text-ink-soft mb-4">{label}</p>
        <h1 className="font-bold text-ink leading-[1.02] max-w-4xl" style={{ fontSize: "var(--text-display)", letterSpacing: "-0.01em" }}>
          {heading}
        </h1>
        <p className="text-ink-soft mt-6 max-w-2xl" style={{ fontSize: "var(--text-body)" }}>
          {intro}
        </p>
      </section>

      {/* 2 — what I do */}
      <section className="px-5 md:px-10 pb-12 md:pb-16" aria-labelledby={`${slug}-caps`}>
        <h2 id={`${slug}-caps`} className="mono-heading text-ink-soft mb-5">{capsTitle}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 max-w-4xl text-ink font-sans leading-snug" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.65rem)" }}>
          {capabilities.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      {/* 2b — long-form sections: the crawlable substance (variants, locations,
          the how-and-why). Plain H2 + paragraph, nothing clever. */}
      {sections.length > 0 && (
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
      )}

      {/* 3 — portfolio slice */}
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

      {/* 4 — testimonials */}
      {testimonials.length > 0 && (
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
      )}

      {/* 4b — how a project runs */}
      {process.length > 0 && (
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
      )}

      {/* 4c — who is behind the work (the credentials search and clients both check) */}
      {meet && (
        <section className="px-5 md:px-10 pb-16 md:pb-24" aria-labelledby={`${slug}-meet-h`}>
          <div className="border-t border-line pt-10 max-w-4xl">
            <h2 id={`${slug}-meet-h`} className="font-bold display-brand leading-[1.05] mb-4" style={{ fontSize: "clamp(1.4rem, 2.4vw, 2.2rem)", letterSpacing: "-0.01em" }}>
              {meet.heading}
            </h2>
            <p className="text-ink-soft leading-relaxed max-w-2xl" style={{ fontSize: "var(--text-body)" }}>{meet.body}</p>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-ink font-sans leading-snug" style={{ fontSize: "clamp(1rem, 1.35vw, 1.3rem)" }}>
              {meet.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 5 — FAQ */}
      <section className="px-5 md:px-10 pb-16 md:pb-24" aria-labelledby={`${slug}-faq-h`}>
        <h2 id={`${slug}-faq-h`} className="mono-heading text-ink-soft mb-6">Common questions</h2>
        <dl className="max-w-3xl divide-y divide-line border-t border-line">
          {faqs.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="text-ink font-sans font-semibold mb-1.5" style={{ fontSize: "clamp(1rem, 1.3vw, 1.25rem)" }}>{f.q}</dt>
              <dd className="text-ink-soft leading-relaxed" style={{ fontSize: "var(--text-small)" }}>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 5b — risk-reversal band: the guarantee, right before the ask. */}
      {guarantee && (
        <section className="px-5 md:px-10 pb-16 md:pb-24" aria-label="Our guarantee">
          <div className="max-w-3xl rounded-md border border-pink px-6 py-6" style={{ background: "rgba(233, 109, 137, 0.08)" }}>
            <p className="mono-label text-ink-soft mb-2">{guarantee.label}</p>
            <p className="text-ink leading-relaxed" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)" }}>{guarantee.body}</p>
          </div>
        </section>
      )}

      {/* 6 — CTA + crawlable NAP */}
      <section className="px-5 md:px-10 pb-24 md:pb-32" aria-label="Start a project">
        <div className="border-t border-line pt-10 max-w-3xl">
          <h2 className="font-bold display-brand leading-[1.05]" style={{ fontSize: "var(--text-h2, clamp(1.6rem, 3vw, 2.6rem))", letterSpacing: "-0.01em" }}>
            {ctaHeading}
          </h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
            {/* Opens the global contact/book-a-call panel, not a mailto. */}
            <ContactCta className="tag tag-pink">Start a project <MdArrowOutward size={14} /></ContactCta>
            <Link href="/work" className="text-ink-soft u-underline" style={{ fontSize: "var(--text-small)" }}>See more work</Link>
          </div>
          {ctaNote && (
            <p className="text-ink-soft mt-4 leading-relaxed max-w-2xl" style={{ fontSize: "var(--text-small)" }}>{ctaNote}</p>
          )}
          <address className="not-italic text-ink-soft mt-8 leading-relaxed" style={{ fontSize: "var(--text-small)" }}>
            Finbar Studio, Brisbane, QLD, Australia. Working with clients across Australia and the UK.{" "}
            <a href="mailto:finbar@finbar.studio" className="u-underline">finbar@finbar.studio</a>{" "}
            <a href="tel:+61412796630" className="u-underline tabular-nums">+61 412 796 630</a>
          </address>
        </div>
      </section>
    </>
  );
}
