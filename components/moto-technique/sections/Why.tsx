import Reveal from "../Reveal";

/**
 * Why Moto Technique: the title, the claim, then the figures that back it.
 *
 * A full screen of white after the hero's photographs, centred and with
 * nothing else on it, so the eye stops. The title is set like the wordmark, in
 * tracked capitals, and the claim under it is the second-level heading. The
 * figures are set in the title face at display size because they are the
 * argument, not decoration.
 */
export default function Why({
  why,
}: {
  why: {
    title: string;
    heading: string[];
    body: string;
    cta: { label: string; href: string };
    figures: { value: string; label: string }[];
  };
}) {
  return (
    <section className="mt-why" id="why">
      <div className="mt-why-inner">
        <Reveal className="mt-why-say">
          <h2 className="mt-title">{why.title}</h2>
          <h3 className="mt-why-heading">
            {why.heading.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h3>
          <p className="mt-why-body">{why.body}</p>
          <a className="mt-why-cta" href={why.cta.href} data-cursor="See">
            {why.cta.label}
          </a>
        </Reveal>

        <Reveal as="dl" className="mt-figures" delay={0.14}>
          {why.figures.map((f) => (
            <div key={f.value} className="mt-figure">
              <dt className="mt-figure-value">{f.value}</dt>
              <dd className="mt-figure-label">{f.label}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
