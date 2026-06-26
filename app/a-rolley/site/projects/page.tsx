import Nav from "@/components/arolley/Nav";
import ViewCursor from "@/components/arolley/ViewCursor";
import MaskReveal from "@/components/arolley/MaskReveal";
import SiteFooter from "@/components/arolley/sections/SiteFooter";

export const metadata = {
  title: { absolute: "Projects | A Rolley & Sons · Sunshine Coast Custom Homes" },
};

type P = { title: string; meta: string; src: string; ratio: string };
const PROJECTS: P[] = [
  { title: "Lake House", meta: "Custom Home · Sunshine Coast", src: "/a-rolley/projects/lake-house.webp", ratio: "16 / 10" },
  { title: "MacPhee Residence", meta: "Custom Home", src: "/a-rolley/projects/macphee.webp", ratio: "4 / 5" },
  { title: "Watson Residence", meta: "Custom Home", src: "/a-rolley/projects/watson.webp", ratio: "16 / 10" },
  { title: "KI House", meta: "Custom Home", src: "/a-rolley/projects/ki-house.webp", ratio: "4 / 5" },
  { title: "Curra's Annex", meta: "Secondary Dwelling", src: "/a-rolley/projects/curras.webp", ratio: "16 / 10" },
  { title: "Bells Duplex", meta: "Dual Occupancy", src: "/a-rolley/projects/bells-duplex.webp", ratio: "4 / 5" },
  { title: "The Cottage", meta: "Renovation", src: "/a-rolley/projects/cottage-living.webp", ratio: "16 / 10" },
  { title: "M & L Residence", meta: "Custom Home", src: "/a-rolley/projects/ml-bathroom.webp", ratio: "4 / 5" },
];

export default function ARolleyProjects() {
  return (
    <main>
      <Nav />
      <ViewCursor />

      <section className="frame text-center" style={{ paddingTop: "clamp(116px,15vh,176px)", paddingBottom: "clamp(36px,5vw,72px)" }}>
        <h1 className="display" style={{ fontSize: "var(--step-display)", maxWidth: "14ch", marginInline: "auto" }}>
          Homes from the <span className="display-italic accent">Coast</span>.
        </h1>
      </section>

      <section className="frame" style={{ paddingBottom: "clamp(72px,10vw,160px)" }}>
        <div className="wrap grid grid-cols-1 md:grid-cols-2" style={{ gap: "clamp(28px,3.5vw,72px) clamp(28px,3vw,56px)" }}>
          {PROJECTS.map((p, i) => (
            <a
              key={p.title}
              href="/a-rolley/site/projects"
              className="group block"
              data-cursor="View"
              style={{ alignSelf: i % 2 ? "end" : "start" }}
              aria-label={`${p.title}, ${p.meta}`}
            >
              <MaskReveal>
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: p.ratio, background: "var(--paper-2)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.title} loading={i < 2 ? "eager" : "lazy"} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
                </div>
              </MaskReveal>
              <div className="flex items-baseline justify-between" style={{ marginTop: "clamp(12px,1.4vw,18px)", gap: "1rem" }}>
                <h2 className="display" style={{ fontSize: "var(--step-h3)" }}>{p.title}</h2>
                <span className="eyebrow" style={{ whiteSpace: "nowrap" }}>{p.meta}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
