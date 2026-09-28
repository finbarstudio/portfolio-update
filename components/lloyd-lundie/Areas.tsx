import Reveal from "./Reveal";

/** A simple typographic list, no map. */
export default function Areas({ areas }: { areas: string[] }) {
  return (
    <section className="ll-areas">
      <div className="ll-wrap">
        <Reveal as="h2" className="ll-section-title">
          Areas we cover
        </Reveal>
        <Reveal as="p" className="ll-areas-list" delay={0.08}>
          {areas.join("  ·  ")}
        </Reveal>
      </div>
    </section>
  );
}
