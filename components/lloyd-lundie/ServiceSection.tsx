import Reveal from "./Reveal";

export default function ServiceSection({
  id,
  name,
  intro,
  whyPoints,
  image,
  imageAlt,
  reverse,
}: {
  id: string;
  name: string;
  intro: string[];
  whyPoints: string[];
  image: string;
  imageAlt: string;
  reverse: boolean;
}) {
  return (
    <section className="ll-service" id={id} data-reverse={reverse ? "1" : "0"}>
      <div className="ll-wrap ll-service-inner">
        <Reveal className="ll-service-image">
          <img src={image} alt={imageAlt} width={1400} height={1050} loading="lazy" decoding="async" />
        </Reveal>

        <div className="ll-service-copy">
          <Reveal as="h2" className="ll-section-title">
            {name}
          </Reveal>
          {intro.map((p, i) => (
            <Reveal as="p" key={p.slice(0, 24)} className="ll-service-text" delay={0.05 + i * 0.04}>
              {p}
            </Reveal>
          ))}
          {whyPoints.length > 0 && (
            <Reveal as="ul" className="ll-service-points" delay={0.1}>
              {whyPoints.map((point) => (
                <li key={point.slice(0, 24)}>{point}</li>
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
