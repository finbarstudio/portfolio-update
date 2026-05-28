import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";

/* ─── Work grid ─────────────────────────────────────────────────
   Featured: full-width. Everything else (full + gallery): 2-col grid.
   No directory header — the work leads.
   ─────────────────────────────────────────────────────────────── */
function WorkGrid() {
  const sorted = [...projects].sort((a, b) => a.rank - b.rank);
  const featured = sorted.filter((p) => p.tier === "featured");
  const rest = sorted.filter((p) => p.tier !== "featured");

  let cardIndex = 0;

  return (
    <section
      id="work"
      className="bg-bg px-5 md:px-10"
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
      {/* Minimal masthead — capabilities only, work leads below */}
      <header className="px-5 md:px-10 pt-8 md:pt-12 pb-10 md:pb-14">
        <h1
          className="font-sans font-medium text-ink"
          style={{ fontSize: "var(--text-h2)", letterSpacing: "0.01em", lineHeight: "var(--leading-snug)" }}
        >
          Graphic design, brand identity, editorial, web &amp; motion.
        </h1>
      </header>

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
