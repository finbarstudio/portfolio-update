"use client";

import { useCallback, useState } from "react";
import type { HeroSlide } from "@/content/moto-technique";
import AwardLaurel from "../AwardLaurel";
import RegionMarks from "../RegionMarks";

/**
 * The hero: one car, six frames, nothing else.
 *
 * No headline and no menu. The wordmark sits at the top, the thumbnails that
 * change the photograph sit under it on the right, and the only other marks are
 * the laurel and the four flags, centred just below the middle of the frame.
 * A gradient top and bottom holds them without a panel.
 *
 * Every frame comes from `hero` in content/moto-technique.ts, so the car and
 * the order are editable. Swap that list and the hero is a different car.
 */
export default function Hero({
  slides,
  marks,
  name,
}: {
  slides: HeroSlide[];
  marks: { laurel: { mark: string; body: string; label: string }; regions: { id: string; label: string }[] };
  name: string;
}) {
  const [active, setActive] = useState(0);
  const select = useCallback((i: number) => setActive(i), []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") select((active + 1) % slides.length);
    if (e.key === "ArrowLeft") select((active - 1 + slides.length) % slides.length);
  };

  return (
    <section className="mt-hero" data-tone="dark">
      {/* Every frame is mounted and cross-fades, so a switch never blanks. */}
      <div className="mt-hero-stage" aria-hidden="true">
        {slides.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.id}
            src={s.image}
            alt=""
            className="mt-hero-img"
            data-active={i === active ? "1" : "0"}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
          />
        ))}
      </div>

      <div className="mt-hero-scrim-top" aria-hidden="true" />
      <div className="mt-hero-scrim-bottom" aria-hidden="true" />

      {/* The wordmark, centred. */}
      <div className="mt-hero-brand">
        <span className="mt-hero-wordmark">{name}</span>
      </div>

      {/* The six frames, small, top right. */}
      <div className="mt-hero-switcher" role="tablist" aria-label="Choose a photograph" onKeyDown={onKey}>
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={s.car}
            className="mt-hero-thumb"
            data-active={i === active ? "1" : "0"}
            onClick={() => select(i)}
            data-cursor="View"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt="" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>

      {/* Laurel, then the four markets, centred with a bottom bias. */}
      <div className="mt-hero-marks">
        <AwardLaurel
          mark={marks.laurel.mark}
          body={marks.laurel.body}
          label={marks.laurel.label}
          delay={0.7}
        />
        <RegionMarks regions={marks.regions} />
      </div>
    </section>
  );
}
