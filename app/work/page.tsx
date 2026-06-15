import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";
import { WORK_FILTERS, projectMatchesFilter, filterLabel } from "@/content/filters";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Selected branding, web design, publication and motion projects by Finbar Skitini, a Brisbane graphic designer working with clients across Australia and the UK.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Selected Work | Finbar Studio",
    description:
      "Branding, web design, publication and motion projects from finbar✶studio, a Brisbane creative practice.",
    url: "/work",
    type: "website",
  },
};

/* ─── Archive structured data ────────────────────────────────────
   The work archive is a CollectionPage whose mainEntity is an ordered
   ItemList of the case studies, so search engines read it as a curated
   portfolio. Only ranked, non-hidden projects with a real case study page. */
function WorkJsonLd() {
  const listed = [...projects]
    .filter((p) => !p.hidden && p.tier !== "gallery")
    .sort((a, b) => a.rank - b.rank);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/work#webpage`,
    url: `${SITE_URL}/work`,
    name: "Work: Selected Projects | Finbar Studio",
    description:
      "Selected web design, brand identity, publication and motion projects by Finbar Skitini, a Brisbane graphic designer.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en-AU",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/work` },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: listed.length,
      itemListElement: listed.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/case-studies/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <Script
      id="ld-work"
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ─── Filter chips ──────────────────────────────────────────── */
function FilterChips({ active }: { active?: string }) {
  const chip = (key: string | undefined, label: string) => {
    const on = (active ?? "") === (key ?? "");
    const href = key ? `/work?filter=${key}` : "/work";
    return (
      <Link key={label} href={href} scroll={false} className={`tag ${on ? "tag-pink" : "tag-default"}`} aria-current={on ? "true" : undefined}>
        {label}
      </Link>
    );
  };
  return (
    <div className="flex flex-wrap gap-2 px-5 md:px-10 mb-12 md:mb-14">
      {chip(undefined, "All")}
      {WORK_FILTERS.map((f) => chip(f.key, f.label))}
    </div>
  );
}

/* ─── Work grid ─────────────────────────────────────────────────
   Featured: full-width. Everything else (full + gallery): 2-col grid.
   When a filter is active, everything drops into the uniform 2-col grid. */
function WorkGrid({ filter }: { filter?: string }) {
  const sorted = [...projects]
    .filter((p) => !p.hidden && projectMatchesFilter(p, filter))
    .sort((a, b) => a.rank - b.rank);
  const featured = filter ? [] : sorted.filter((p) => p.tier === "featured");
  const rest = filter ? sorted : sorted.filter((p) => p.tier !== "featured");

  let cardIndex = 0;

  return (
    <section
      id="work"
      className="bg-bg px-5 md:px-10"
      style={{ paddingBottom: "var(--space-section)" }}
      aria-label="Selected work"
    >
      {featured.length > 0 && (
        <div className="grid grid-cols-12 gap-x-8 gap-y-20 md:gap-y-24 mb-20 md:mb-24">
          {featured.map((project) => {
            const i = cardIndex++;
            return <ProjectCard key={project.slug} project={project} index={i} />;
          })}
        </div>
      )}

      {rest.length > 0 ? (
        <div className="grid grid-cols-12 gap-x-8 gap-y-16 md:gap-y-20">
          {rest.map((project) => {
            const i = cardIndex++;
            return <ProjectCard key={project.slug} project={project} index={i} />;
          })}
        </div>
      ) : (
        <p className="text-ink-soft" style={{ fontSize: "var(--text-small)" }}>
          Nothing under that filter yet. <Link href="/work" className="text-pink">Show all →</Link>
        </p>
      )}
    </section>
  );
}

/* ─── Archive header ─────────────────────────────────────────── */
function WorkHeader() {
  return (
    <header className="px-5 md:px-10 pt-8 md:pt-12 pb-10 md:pb-14">
      <p className="mono-label text-ink-soft mb-5">Archive of branding, web, publication &amp; motion</p>
      <h1
        className="font-bold text-ink leading-[1.02]"
        style={{ fontSize: "var(--text-display)", letterSpacing: "-0.01em" }}
      >
        Selected work.
      </h1>
      <p className="text-ink-soft font-sans leading-relaxed mt-6 max-w-2xl" style={{ fontSize: "var(--text-body)" }}>
        A working archive of projects for brands and businesses across Australia and the UK:
        visual identities, websites, publications and campaigns, designed and built end to end.
      </p>
    </header>
  );
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const sp = await searchParams;
  const filter = typeof sp.filter === "string" && filterLabel(sp.filter) ? sp.filter : undefined;
  return (
    <>
      <WorkJsonLd />
      <WorkHeader />
      <FilterChips active={filter} />
      <WorkGrid filter={filter} />

      <footer
        className="px-5 md:px-10 py-12 md:py-16 border-t border-line"
        aria-label="Site footer"
      >
        <a
          href="mailto:finbar@finbar.studio"
          className="font-sans font-medium text-ink hover:text-pink transition-colors"
          style={{ fontSize: "var(--text-h2)" }}
        >
          finbar@finbar.studio
        </a>
      </footer>
    </>
  );
}
