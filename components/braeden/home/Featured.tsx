/**
 * Braeden homepage — FEATURED WORK as a BENTO grid. A full-width white section
 * with the shared header, then an asymmetric bento of project plates (a 2×2
 * feature + wide + small tiles), each with a hover image-zoom and a caption.
 */

import BReveal from "./BReveal";

const P = "/braeden/projects";

const PROJECTS: { img: string; name: string; meta: string; feature?: boolean; span?: React.CSSProperties }[] = [
  { img: "modern-thai", name: "Modern Thai House", meta: "Noosa Heads", feature: true, span: { gridColumn: "span 2", gridRow: "span 2" } },
  { img: "noosaville", name: "Riverside", meta: "Noosaville", span: { gridColumn: "span 2" } },
  { img: "peregian", name: "Peregian", meta: "Sunshine Coast" },
  { img: "sunrise-beach", name: "Sunrise Beach", meta: "Noosa" },
  { img: "river-haven", name: "River Haven", meta: "Noosa", span: { gridColumn: "span 2" } },
  { img: "cooroy-mountain", name: "Cooroy", meta: "Hinterland", span: { gridColumn: "span 2" } },
];

export default function Featured() {
  return (
    <section className="bsec-plain">
      <div className="bcol">
        <BReveal>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1.4rem", marginBottom: "clamp(28px,3.4vw,52px)" }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: "1.3em" }}>Our work</p>
              <h2 className="bhead-title" style={{ marginBottom: "0.5em" }}>Selected work</h2>
              <span className="brule" aria-hidden style={{ margin: "0 0 1.1em" }} />
              <p className="ff-quick" style={{ fontSize: "clamp(14px,1vw,16.5px)", lineHeight: 1.6, color: "var(--ink-soft)", maxWidth: "42ch", margin: 0 }}>
                A few of the homes behind the record. Every one bespoke to its block.
              </p>
            </div>
            <a href="/braeden/site/projects" className="redlink">View all projects <span className="ar" aria-hidden>→</span></a>
          </div>
        </BReveal>
        <BReveal delay={0.08}>
          <div className="b-bento">
            {PROJECTS.map((p) => (
              <a
                key={p.name}
                href="/braeden/site/projects"
                data-cursor="View project"
                className={`b-bento-cell${p.feature ? " b-bento-feature" : ""}`}
                style={p.span}
              >
                <img src={`${P}/${p.img}.webp`} alt={`${p.name}, ${p.meta}`} />
                <div className="b-bento-cap">
                  <span className="n">{p.name}</span>
                  <span className="m">{p.meta}</span>
                </div>
              </a>
            ))}
          </div>
        </BReveal>
      </div>
    </section>
  );
}
