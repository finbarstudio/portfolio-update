import Reveal from "./Reveal";

/** Seven rows, one sentence each, linking to their anchor on the services page. No grid, no per-row image. */
export default function ServicesList({
  services,
}: {
  services: { id: string; name: string; oneLiner: string }[];
}) {
  return (
    <section className="ll-services" id="services">
      <div className="ll-wrap">
        <Reveal as="h2" className="ll-section-title">
          What we do
        </Reveal>

        <ul className="ll-services-list">
          {services.map((service, i) => (
            <Reveal key={service.id} as="li" delay={i * 0.04}>
              <a href={`/lloyd-lundie/services#${service.id}`} className="ll-services-row">
                <span className="ll-services-name">{service.name}</span>
                <span className="ll-services-line">{service.oneLiner}</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
