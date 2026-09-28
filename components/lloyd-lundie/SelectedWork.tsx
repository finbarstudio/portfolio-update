import Reveal from "./Reveal";

/** Four large single photographs, real jobs, each with a plain caption. No grid of thumbnails, no gallery/lightbox. */
export default function SelectedWork({
  items,
}: {
  items: { image: string; alt: string; caption: string }[];
}) {
  return (
    <section className="ll-work">
      <div className="ll-wrap">
        <Reveal as="h2" className="ll-section-title">
          Some of our recent work
        </Reveal>

        <div className="ll-work-list">
          {items.map((item, i) => (
            <Reveal key={item.image} className="ll-work-item" delay={i * 0.05}>
              <img src={item.image} alt={item.alt} width={1600} height={1067} loading="lazy" decoding="async" />
              <p className="ll-work-caption">{item.caption}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
