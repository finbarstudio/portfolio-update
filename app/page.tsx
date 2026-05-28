import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";
import EncryptedText from "@/components/EncryptedText";

/* ─── Hero ──────────────────────────────────────────────────────
   Display heading + discipline subtitle. Sticky so it sits behind
   the work grid and fades as the work scrolls over it.
   ─────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      className="sticky top-0 z-0 bg-bg px-5 md:px-10 pt-8 md:pt-12 pb-8 md:pb-10"
      style={{
        minHeight: "38vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
      aria-labelledby="hero-heading"
    >
      <div className="hero-scroll-fade">
        <h1
          id="hero-heading"
          className="font-sans font-bold uppercase text-ink leading-[1.02]"
          style={{
            fontSize: "var(--text-display)",
            letterSpacing: "0.03em",
          }}
        >
          <EncryptedText text="Graphic" delay={0} />{" "}
          <EncryptedText text="Designer" delay={120} />
        </h1>

        <p className="mono-label text-ink-soft mt-6">
          brand · identity · editorial · web · motion
        </p>
      </div>
    </section>
  );
}

/* ─── Work grid ─────────────────────────────────────────────────
   Featured: full-width.
   Everything else (full + gallery): unified 2-col grid.
   ─────────────────────────────────────────────────────────────── */
function WorkGrid() {
  const sorted = [...projects].sort((a, b) => a.rank - b.rank);
  const featured = sorted.filter((p) => p.tier === "featured");
  const rest = sorted.filter((p) => p.tier !== "featured");

  let cardIndex = 0;

  return (
    <section
      id="work"
      className="relative z-10 bg-bg px-5 md:px-10"
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      aria-labelledby="work-heading"
    >
      <h2 id="work-heading" className="sr-only">Selected Work</h2>

      {/* Section header, directory listing flavour */}
      <div className="flex items-baseline justify-between border-b border-line pb-3 mb-12 md:mb-16">
        <p className="mono-label text-ink">
          <span className="text-pink">▸</span> /work
        </p>
        <p className="mono-label text-ink-soft">
          {sorted.length} ITEMS
        </p>
      </div>

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
      <Hero />

      {/* Work + footer wrapped so they slide over the sticky hero */}
      <div className="relative z-10 bg-bg">
        <WorkGrid />

        <footer
          className="px-5 md:px-10 py-12 md:py-16 border-t border-line"
          aria-label="Site footer"
        >
          <p className="mono-label text-ink-soft mb-3">Get in touch</p>
          <a
            href="mailto:finbar@finbar.studio"
            className="font-sans font-medium text-ink hover:text-pink transition-colors"
            style={{ fontSize: "var(--text-h2)" }}
          >
            finbar@finbar.studio
          </a>
        </footer>
      </div>
    </>
  );
}
