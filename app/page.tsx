import Script from "next/script";
import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";

const SITE_URL = "https://www.finbar.studio";

/* ─── Homepage structured data ───────────────────────────────────
   A CollectionPage whose mainEntity is an ordered ItemList of the case
   studies on show, so search engines read the home grid as a curated
   portfolio rather than a flat page. Only ranked, non-hidden projects
   that have a real case study page are listed. */
function HomeJsonLd() {
  const listed = [...projects]
    .filter((p) => !p.hidden && p.tier !== "gallery")
    .sort((a, b) => a.rank - b.rank);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: "Finbar Skitini — Selected Work",
    description:
      "Selected web design, brand identity, publication and motion projects by Finbar Skitini, a Brisbane graphic designer and Framer developer.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en-AU",
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
      id="ld-home"
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ─── Work grid ─────────────────────────────────────────────────
   Featured: full-width. Everything else (full + gallery): 2-col grid.
   No directory header — the work leads.
   ─────────────────────────────────────────────────────────────── */
function WorkGrid() {
  const sorted = [...projects].filter((p) => !p.hidden).sort((a, b) => a.rank - b.rank);
  const featured = sorted.filter((p) => p.tier === "featured");
  const rest = sorted.filter((p) => p.tier !== "featured");

  let cardIndex = 0;

  return (
    <section
      id="work"
      className="bg-bg px-5 md:px-10 pt-8 md:pt-12"
      style={{ paddingBottom: "var(--space-section)" }}
      aria-label="Selected work"
    >
      {/* Featured, full-width */}
      <div className="grid grid-cols-12 gap-x-8 gap-y-20 md:gap-y-24 mb-20 md:mb-24">
        {featured.map((project) => {
          const i = cardIndex++;
          return <ProjectCard key={project.slug} project={project} index={i} />;
        })}
      </div>

      {/* All other projects, uniform 2-col grid */}
      <div className="grid grid-cols-12 gap-x-8 gap-y-16 md:gap-y-20">
        {rest.map((project) => {
          const i = cardIndex++;
          return <ProjectCard key={project.slug} project={project} index={i} />;
        })}
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <WorkGrid />

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
