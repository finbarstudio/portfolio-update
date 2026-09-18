"use client";

import Reveal from "../Reveal";

/**
 * What a restomod is, in Kevin's words, then the three cars that prove it.
 * His quote is the argument, so it is set as the heading weight rather than
 * dropped in a box underneath.
 */
export default function Restomods({
  restomod,
}: {
  restomod: {
    heading: string;
    quote: string;
    quoteBy: string;
    body: string[];
    cars: { name: string; spec: string; note: string; image: string }[];
  };
}) {
  return (
    <section className="mt-restomods" id="restomods">
      <div className="mt-wrap">
        <Reveal as="blockquote" className="mt-pull">
          <p>“{restomod.quote}”</p>
          <cite>{restomod.quoteBy}</cite>
        </Reveal>

        <div className="mt-restomods-body">
          {restomod.body.map((p, i) => (
            <Reveal as="p" key={i} delay={0.06 * i}>
              {p}
            </Reveal>
          ))}
        </div>
      </div>

      <ul className="mt-cars mt-wrap">
        {restomod.cars.map((c, i) => (
          <Reveal as="li" key={`${c.name}-${c.spec}`} delay={0.08 * i} className="mt-car">
            <div className="mt-car-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt={`${c.name}. ${c.note}`} loading="lazy" decoding="async" />
            </div>
            <h3 className="mt-car-name">{c.name}</h3>
            <p className="mt-car-spec">{c.spec}</p>
            <p className="mt-car-note">{c.note}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
