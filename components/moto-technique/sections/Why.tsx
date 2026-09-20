import Wipe from "../Wipe";

/**
 * Why Moto Technique: the title, the claim, then the figures that back it.
 *
 * A full screen of white after the hero's photographs, centred and with
 * nothing else on it, so the eye stops. The title is set like the wordmark, in
 * tracked capitals. The claim under it is one small line in the same style, in
 * gold: a strapline, not a second headline. The figures are set in the title
 * face at display size because they are the argument, not decoration.
 *
 * Each piece rises inside its own mask when it arrives on screen, one after the
 * other: the title, the strapline, the paragraph, then the figures left to right.
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
    <section className="mt-why" id="why" data-tone="light">
      <div className="mt-why-inner">
        <div className="mt-why-say">
          <Wipe as="h2" className="mt-title">
            {why.title}
          </Wipe>
          <Wipe as="h3" delay={0.12} className="mt-strap">
            {why.heading.join(" ")}
          </Wipe>
          <Wipe as="p" delay={0.24} className="mt-why-body">
            {why.body}
          </Wipe>
          <Wipe delay={0.36} className="mt-why-cta-wrap">
            <a className="mt-why-cta" href={why.cta.href} data-cursor="See">
              {why.cta.label}
            </a>
          </Wipe>
        </div>

        <dl className="mt-figures">
          {why.figures.map((f, i) => (
            <div key={f.value} className="mt-figure">
              <Wipe as="dt" delay={i * 0.14} className="mt-figure-value">
                {f.value}
              </Wipe>
              <Wipe as="dd" delay={0.2 + i * 0.14} className="mt-figure-label">
                {f.label}
              </Wipe>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
