import MaskReveal from "../MaskReveal";

type P = { title: string; meta: string; src: string; ratio: string };

const LEAD: P = { title: "Lake House", meta: "Custom Home · Sunshine Coast", src: "/a-rolley/projects/lake-house.webp", ratio: "16 / 9" };
const GRID: P[] = [
  { title: "MacPhee Residence", meta: "Custom Home", src: "/a-rolley/projects/macphee.webp", ratio: "3 / 2" },
  { title: "Watson Residence", meta: "Custom Home", src: "/a-rolley/projects/watson.webp", ratio: "16 / 9" },
  { title: "KI House", meta: "Custom Home", src: "/a-rolley/projects/ki-house.webp", ratio: "16 / 9" },
  { title: "Curra's Annex", meta: "Secondary Dwelling", src: "/a-rolley/projects/curras.webp", ratio: "3 / 2" },
];

function Card({ p, priority = false }: { p: P; priority?: boolean }) {
  return (
    <a href="/a-rolley/site/projects" className="group block" data-cursor="View Project" aria-label={`${p.title}, ${p.meta}`}>
      <MaskReveal>
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: p.ratio, background: "var(--paper-2)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.src}
            alt={p.title}
            loading={priority ? "eager" : "lazy"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </div>
      </MaskReveal>
      <div className="flex items-baseline justify-between" style={{ marginTop: "clamp(12px,1.4vw,18px)", gap: "1rem" }}>
        <h3 className="display" style={{ fontSize: "var(--step-h3)" }}>{p.title}</h3>
        <span className="eyebrow" style={{ whiteSpace: "nowrap" }}>{p.meta}</span>
      </div>
    </a>
  );
}

export default function FeaturedProjects() {
  return (
    <section id="work" className="frame pad-y">
      <div className="wrap">
        <header className="flex items-end justify-between flex-wrap gap-4" style={{ marginBottom: "clamp(32px,4vw,64px)" }}>
          <div>
            <h2 className="display" style={{ fontSize: "var(--step-h2)", marginTop: "0.5em", maxWidth: "18ch" }}>
              Homes made for the way the Coast lives.
            </h2>
          </div>
          <a href="/a-rolley/site/projects" className="eyebrow" style={{ borderBottom: "1px solid var(--line)", paddingBottom: 4 }} data-cursor="All Work">
            View all projects
          </a>
        </header>

        <Card p={LEAD} priority />

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "clamp(28px,3vw,56px)", marginTop: "clamp(28px,3vw,56px)" }}>
          {GRID.map((p) => (
            <Card key={p.title} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
