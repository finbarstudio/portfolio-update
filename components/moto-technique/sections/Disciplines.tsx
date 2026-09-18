"use client";

import Reveal from "../Reveal";

/**
 * The six things they do, each with the car that shows it.
 *
 * On the current site these are six stacked blocks that take a long scroll to
 * get through. Here the photograph leads and the caption sits under it, so the
 * whole range reads in one screen and a half.
 */
export default function Disciplines({
  disciplines,
}: {
  disciplines: { name: string; caption: string; image: string; credit?: string }[];
}) {
  return (
    <section className="mt-disciplines" id="work">
      <div className="mt-wrap">
        <Reveal as="h2" className="mt-h2">
          Everything a car needs, under one roof
        </Reveal>
      </div>

      <ul className="mt-disc-grid mt-wrap">
        {disciplines.map((d, i) => (
          <Reveal as="li" key={d.name} delay={0.06 * (i % 3)} className="mt-disc">
            <div className="mt-disc-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.image} alt={d.caption} loading="lazy" decoding="async" />
            </div>
            <h3 className="mt-disc-name">{d.name}</h3>
            <p className="mt-disc-caption">{d.caption}</p>
            {d.credit ? <span className="mt-credit">Photo by {d.credit}</span> : null}
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
