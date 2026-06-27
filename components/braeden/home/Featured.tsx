/**
 * Braeden homepage — FEATURED WORK (cohesive card system). The work lives inside
 * the shared card: a sticky "Selected work" heading + a column of project plates,
 * each with a Montserrat name and a Space Mono location / award line.
 */

import { CardSection } from "./Card";

const P = "/braeden/projects";
const PROJECTS = [
  { img: "modern-thai", name: "Modern Thai House", meta: "Noosa Heads · MBA Queensland House of the Year" },
  { img: "noosaville", name: "Riverside", meta: "Noosaville · 2025 Best Individual Home" },
  { img: "peregian", name: "Peregian", meta: "Sunshine Coast · Custom home" },
];

export default function Featured() {
  return (
    <CardSection
      eyebrow="Our work"
      title="Selected work"
      intro="A few of the homes behind the record. Every one bespoke to its block."
      headExtra={
        <a href="/braeden/site/projects" className="redlink" style={{ marginTop: "2em", display: "inline-flex" }}>
          View all projects <span className="ar" aria-hidden>→</span>
        </a>
      }
    >
      <div style={{ display: "grid", gap: "clamp(30px,3.2vw,48px)" }}>
        {PROJECTS.map((p) => (
          <a key={p.name} href="/braeden/site/projects" data-cursor="View project" style={{ display: "block" }}>
            <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden", borderRadius: 10, background: "#e6e3dd" }}>
              <img src={`${P}/${p.img}.webp`} alt={`${p.name}, ${p.meta}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "0.6em", marginTop: "0.95em" }}>
              <h3 className="ff-mont" style={{ fontWeight: 700, fontSize: "clamp(17px,1.5vw,23px)", textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--ink)", margin: 0 }}>{p.name}</h3>
              <span className="ff-mono" style={{ fontSize: "clamp(9px,0.72vw,10.5px)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-soft)" }}>{p.meta}</span>
            </div>
          </a>
        ))}
      </div>
    </CardSection>
  );
}
