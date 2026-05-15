import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";

/* ─── Section label ────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mono-label text-ink-soft border-b border-line pb-3 mb-8">
      {children}
    </p>
  );
}

/* ─── Hero ──────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      className="px-6 md:px-10 pt-12 pb-10 border-b border-line"
      aria-labelledby="hero-heading"
    >
      {/* Eyebrow */}
      <p className="mono-label text-ink-soft mb-5">
        Brisbane &mdash; Graphic Designer &amp; Designer/Developer
      </p>

      {/* Statement */}
      {/*
       * PLACEHOLDER — refine this headline.
       * Replace with Finbar's preferred one-line statement.
       */}
      <h1
        id="hero-heading"
        className="font-sans text-[clamp(1.5rem,3.5vw,2.5rem)] font-medium leading-[1.15] text-ink max-w-2xl mb-6"
      >
        Four-plus years across brand identity, digital, web,
        and publication design.
      </h1>

      {/* Status */}
      <span className="status-badge">OPEN FOR WORK</span>
    </section>
  );
}

/* ─── Work grid ─────────────────────────────────────────────── */
function WorkGrid() {
  const sorted = [...projects].sort((a, b) => a.rank - b.rank);

  const featured = sorted.filter((p) => p.tier === "featured");
  const full = sorted.filter((p) => p.tier === "full");
  const gallery = sorted.filter((p) => p.tier === "gallery");

  let cardIndex = 0;

  return (
    <section
      id="work"
      className="px-6 md:px-10 py-12"
      aria-labelledby="work-heading"
    >
      <h2 id="work-heading" className="sr-only">
        Selected Work
      </h2>

      {/* Featured */}
      <div className="mb-16">
        <SectionLabel>FEATURED WORK</SectionLabel>
        <div className="grid grid-cols-12 gap-x-6 gap-y-14">
          {featured.map((project) => {
            const i = cardIndex++;
            return <ProjectCard key={project.slug} project={project} index={i} />;
          })}
        </div>
      </div>

      {/* Full case studies */}
      <div className="mb-16">
        <SectionLabel>SELECTED PROJECTS</SectionLabel>
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          {full.map((project) => {
            const i = cardIndex++;
            return <ProjectCard key={project.slug} project={project} index={i} />;
          })}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <SectionLabel>MORE WORK</SectionLabel>
        <div className="grid grid-cols-12 gap-x-6 gap-y-8">
          {gallery.map((project) => {
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
      <WorkGrid />

      {/* Footer CTA */}
      <footer className="px-6 md:px-10 py-12 border-t border-line">
        <p className="mono-label text-ink-soft mb-3">Get in touch</p>
        <a
          href="mailto:finbar@finbar.studio"
          className="font-sans text-2xl font-medium text-ink hover:text-pink transition-colors"
        >
          finbar@finbar.studio
        </a>
      </footer>
    </>
  );
}
