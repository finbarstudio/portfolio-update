import Reveal from "./Reveal";

/**
 * Full-bleed hero: the new-build photograph fills the screen and the
 * statement sits centred on top of it, over a scrim for contrast. Note the
 * source photo is only 960x720, so it softens on very wide screens; swap in a
 * larger original when one exists.
 */
export default function Hero({
  heading,
  sub,
  image,
  imageAlt,
  cta,
}: {
  heading: string;
  sub: string;
  image: string;
  imageAlt: string;
  cta: { label: string; href: string };
}) {
  return (
    <section className="ll-hero" id="top">
      <img
        className="ll-hero-img"
        src={image}
        alt={imageAlt}
        width={960}
        height={720}
        loading="eager"
        decoding="sync"
        fetchPriority="high"
      />
      <div className="ll-hero-scrim" aria-hidden="true" />
      <div className="ll-wrap ll-hero-inner">
        <Reveal as="h1" className="ll-hero-heading">
          {heading}
        </Reveal>
        <Reveal as="p" className="ll-hero-sub" delay={0.1}>
          {sub}
        </Reveal>
        <Reveal delay={0.18}>
          <a href={cta.href} className="ll-btn ll-hero-cta">
            {cta.label}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
