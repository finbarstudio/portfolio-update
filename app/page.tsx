import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";
import EncryptedText from "@/components/EncryptedText";

/* ─── Section label ────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mono-label text-ink-soft pb-3 mb-8">
      {children}
    </p>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────
   Sticky: stays behind the work section as it scrolls over.
   CSS scroll-driven animation fades text out as work covers it.
   ─────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      className="sticky top-0 z-0 bg-bg px-6 md:px-10"
      style={{ minHeight: "36vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "2.5rem", paddingTop: "1rem" }}
      aria-labelledby="hero-heading"
    >
      <div className="hero-scroll-fade">
        <h1
          id="hero-heading"
          className="font-sans font-bold uppercase text-ink leading-[1.05]"
          style={{
            fontSize: "var(--text-display)",
            letterSpacing: "0.04em",
            maxWidth: "18ch",
          }}
        >
          <EncryptedText text="DIGITAL DESIGNER" />
        </h1>
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
      className="relative z-10 bg-bg px-6 md:px-10"
      style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }}
      aria-labelledby="work-heading"
    >
      <h2 id="work-heading" className="sr-only">Selected Work</h2>

      {/* Featured — full-width, no section label, work begins immediately */}
      <div className="grid grid-cols-12 gap-x-6 gap-y-14 mb-16">
        {featured.map((project) => {
          const i = cardIndex++;
          return <ProjectCard key={project.slug} project={project} index={i} />;
        })}
      </div>

      {/* All other projects — uniform 2-col grid */}
      <div>
        <SectionLabel>SELECTED PROJECTS</SectionLabel>
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          {rest.map((project) => {
            const i = cardIndex++;
            return <ProjectCard key={project.slug} project={project} index={i} />;
          })}
        </div>
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
          className="px-6 md:px-10 py-12"
          aria-label="Site footer"
        >
          <p className="mono-label text-ink-soft mb-3">Get in touch</p>
          <a
            href="mailto:finbar@finbar.studio"
            className="font-sans font-medium text-ink hover:text-pink transition-colors link-wipe"
            style={{ fontSize: "var(--text-h2)" }}
          >
            finbar@finbar.studio
          </a>
        </footer>
      </div>
    </>
  );
}
