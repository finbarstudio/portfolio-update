"use client";

import Reveal from "../Reveal";

/** The workshop and the man who started it, in his own words. */
export default function Workshop({
  workshop,
}: {
  workshop: {
    heading: string;
    body: string[];
    image: string;
    credit?: string;
    portrait: string;
    portraitCaption: string;
  };
}) {
  return (
    <section className="mt-workshop" id="workshop" data-tone="dark">
      <div className="mt-wrap mt-workshop-grid">
        <div className="mt-workshop-copy">
          <Reveal as="h2" className="mt-h2">
            {workshop.heading}
          </Reveal>
          {workshop.body.map((p, i) => (
            <Reveal as="p" key={i} delay={0.06 * (i + 1)}>
              {p}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-workshop-portrait" delay={0.1}>
          <div className="mt-workshop-portrait-art">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={workshop.portrait} alt={workshop.portraitCaption} loading="lazy" decoding="async" />
          </div>
          <p className="mt-workshop-caption">{workshop.portraitCaption}</p>
        </Reveal>
      </div>

      <Reveal className="mt-workshop-wide">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={workshop.image} alt="The Moto Technique workshop" loading="lazy" decoding="async" />
        {workshop.credit ? <span className="mt-credit">Photo by {workshop.credit}</span> : null}
      </Reveal>
    </section>
  );
}
