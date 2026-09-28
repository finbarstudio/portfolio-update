import Reveal from "./Reveal";

export default function Story({
  paragraph,
  mottos,
  facts,
}: {
  paragraph: string;
  mottos: string[];
  facts: { value: string; label: string }[];
}) {
  return (
    <section className="ll-story">
      <div className="ll-wrap ll-story-inner">
        <Reveal as="p" className="ll-story-text">
          {paragraph}
        </Reveal>

        <Reveal as="p" className="ll-story-mottos" delay={0.08}>
          {mottos.join("  ·  ")}
        </Reveal>

        <div className="ll-facts">
          {facts.map((fact, i) => (
            <Reveal key={fact.label} className="ll-fact" delay={0.1 + i * 0.06}>
              <span className="ll-fact-value">{fact.value}</span>
              <span className="ll-fact-label">{fact.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
