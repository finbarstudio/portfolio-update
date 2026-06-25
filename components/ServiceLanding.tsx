import { jsonLdHtml } from "@/lib/json-ld";
import Script from "next/script";
import Link from "next/link";
import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";

/**
 * ServiceLanding — a focused service landing page (e.g. /web-design,
 * /graphic-design) for local search intent. A short intro carrying the local
 * keyword, then the relevant slice of the portfolio (matched on category terms),
 * plus a Service + CollectionPage graph linked to the one Person node.
 */

const SITE_URL = "https://www.finbar.studio";

export type ServiceLandingProps = {
  slug: string;
  label: string;          // small mono eyebrow
  heading: string;        // H1
  intro: string;          // ~1 paragraph, keyword-led, plainly written
  serviceName: string;    // schema Service name
  description: string;    // meta + schema description
  terms: string[];        // category terms a project must match to show
};

export default function ServiceLanding({
  slug, label, heading, intro, serviceName, description, terms,
}: ServiceLandingProps) {
  const matched = [...projects]
    .filter((p) => !p.hidden && terms.some((t) => p.categories.join(" ").toLowerCase().includes(t)))
    .sort((a, b) => a.rank - b.rank);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/${slug}#webpage`,
    url: `${SITE_URL}/${slug}`,
    name: `${heading} | Finbar Studio`,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
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
      provider: { "@id": `${SITE_URL}/#person` },
      areaServed: [
        { "@type": "City", name: "Brisbane" },
        { "@type": "State", name: "Queensland" },
        { "@type": "Country", name: "Australia" },
      ],
    },
  };

  return (
    <>
      <Script
        id={`ld-${slug}`}
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
      />
      <section className="px-5 md:px-10 pt-10 md:pt-16 pb-10 md:pb-14">
        <p className="mono-label text-ink-soft mb-4">{label}</p>
        <h1 className="font-bold text-ink leading-[1.02] max-w-4xl" style={{ fontSize: "var(--text-display)", letterSpacing: "-0.01em" }}>
          {heading}
        </h1>
        <p className="text-ink-soft mt-6 max-w-2xl" style={{ fontSize: "var(--text-body)" }}>
          {intro}
        </p>
      </section>

      <section
        className="bg-bg px-5 md:px-10"
        style={{ paddingBottom: "var(--space-section)" }}
        aria-label={`${heading} projects`}
      >
        {matched.length > 0 ? (
          <div className="grid grid-cols-12 gap-x-8 gap-y-16 md:gap-y-20">
            {matched.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-ink-soft" style={{ fontSize: "var(--text-small)" }}>
            More coming soon. <Link href="/work" className="u-underline">See all work →</Link>
          </p>
        )}
      </section>
    </>
  );
}
