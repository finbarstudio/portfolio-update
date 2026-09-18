"use client";

import Reveal from "../Reveal";

/**
 * What owners and the press say.
 *
 * On the current site these are pictures with the words baked into them, so
 * they cannot be searched, selected, read aloud or found by Google. Here the
 * words are words and the photograph sits behind them.
 */
export default function Testimonials({
  testimonials,
}: {
  testimonials: { quote: string; by: string; context: string; image: string; credit?: string }[];
}) {
  return (
    <section className="mt-testimonials" id="voices">
      <ul>
        {testimonials.map((t, i) => (
          <Reveal as="li" key={t.by} delay={0.05 * i} className="mt-voice">
            <div className="mt-voice-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.image} alt={t.context} loading="lazy" decoding="async" />
            </div>
            <blockquote className="mt-voice-copy">
              <p>“{t.quote}”</p>
              <cite>
                <span className="mt-voice-by">{t.by}</span>
                <span className="mt-voice-context">{t.context}</span>
              </cite>
            </blockquote>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
