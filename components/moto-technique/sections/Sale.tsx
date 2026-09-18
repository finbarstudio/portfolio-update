"use client";

import Reveal from "../Reveal";

/**
 * The million dollar beat.
 *
 * Kevin asked for the David Lee Dino sale to carry the ethos of the restomod
 * work, so it comes straight after the hero and before anything else is
 * explained. The figure does the arguing, Jay Leno's line seconds it, and both
 * links go out to the source rather than asking anyone to take our word.
 */
export default function Sale({
  sale,
}: {
  sale: {
    eyebrow: string;
    price: string;
    headline: string;
    quote: string;
    quoteBy: string;
    body: string;
    lot: string;
    image: string;
    credit?: string;
    links: { label: string; href: string }[];
  };
}) {
  return (
    <section className="mt-sale" data-tone="dark" id="sale">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={sale.image} alt="" className="mt-sale-img" loading="lazy" decoding="async" />
      <div className="mt-sale-scrim" aria-hidden="true" />

      <div className="mt-sale-inner">
        <Reveal className="mt-sale-figure">
          <span className="mt-eyebrow">{sale.eyebrow}</span>
          <p className="mt-sale-price">{sale.price}</p>
          <p className="mt-sale-lot">{sale.lot}</p>
        </Reveal>

        <Reveal className="mt-sale-copy" delay={0.12}>
          <blockquote className="mt-sale-quote">
            <p>“{sale.quote}”</p>
            <cite>{sale.quoteBy}</cite>
          </blockquote>
          <p className="mt-sale-body">{sale.body}</p>
          <p className="mt-sale-links">
            {sale.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" data-cursor="Open">
                {l.label}
              </a>
            ))}
          </p>
        </Reveal>
      </div>

      {sale.credit ? <span className="mt-credit mt-credit-abs">Photo by {sale.credit}</span> : null}
    </section>
  );
}
