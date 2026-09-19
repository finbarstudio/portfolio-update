"use client";

import Reveal from "../Reveal";

/**
 * The million dollar beat.
 *
 * Kevin asked for the David Lee Dino sale to carry the ethos of the restomod
 * work, so it comes straight after the hero and before anything else is
 * explained. The figure does the arguing, Jay Leno's line seconds it, and both
 * links go out to the source rather than asking anyone to take our word.
 *
 * It sits on white. The hero is a full photograph edge to edge, so a second
 * one directly under it would be the same note twice. Here the figure gets the
 * room and the car is a framed picture beside it.
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
    <section className="mt-sale" id="sale">
      <div className="mt-sale-inner">
        <div className="mt-sale-copy">
          <Reveal className="mt-sale-figure">
            <span className="mt-eyebrow">{sale.eyebrow}</span>
            <p className="mt-sale-price">{sale.price}</p>
            <p className="mt-sale-lot">{sale.lot}</p>
          </Reveal>

          <Reveal className="mt-sale-words" delay={0.12}>
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

        <Reveal as="figure" className="mt-sale-art" delay={0.2}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sale.image} alt={sale.headline} loading="lazy" decoding="async" />
          {sale.credit ? <figcaption className="mt-credit">Photo by {sale.credit}</figcaption> : null}
        </Reveal>
      </div>
    </section>
  );
}
