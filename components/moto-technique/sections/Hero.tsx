"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/content/moto-technique";
import AwardLaurel from "../AwardLaurel";
import RegionMarks from "../RegionMarks";

/** How long each photograph holds before the next one fades in. */
const HOLD_MS = 6000;

/**
 * The hero: one car, six frames, and its name.
 *
 * No headline, no menu and no thumbnails. The wordmark is the fixed bar above
 * it (TopBar). The car's own script sits in the middle of the frame, and under
 * it, centred with a bottom bias, the laurel and the four flags. A gradient top
 * and bottom holds them without a panel.
 *
 * Left alone, the photograph changes by itself every few seconds. To change it
 * by hand, use the outer fifths of the frame: the cursor turns into an arrow
 * there and a click steps one frame that way. They are real buttons, so Tab
 * reaches them, and the left and right arrow keys work while either has focus.
 * Resting on one, by pointer or by keyboard, holds the photograph still, which
 * is also how the rotation is paused. Stepping by hand restarts the clock, so
 * choosing a frame never gets it taken away a moment later.
 *
 * The hero pins while the page scrolls up over it. As it is covered, the
 * photograph, the name and the marks drift up at three different speeds for
 * depth. This file only reports how far covered the hero is, as --mt-p from 0
 * to 1; the stylesheet decides what moves and by how much.
 *
 * Every frame comes from `hero` in content/moto-technique.ts and the name from
 * `heroMark`, so the car is editable. Swap those two and it is a different car.
 */
export default function Hero({
  slides,
  title,
  marks,
}: {
  slides: HeroSlide[];
  title: { image: string; alt: string; width: number; height: number } | null;
  marks: {
    laurel: { mark: string; unit: string; body: string; label: string };
    regions: { id: string; label: string }[];
  };
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  /** Pointer or keyboard focus is resting on an edge: someone is choosing. */
  const [choosing, setChoosing] = useState(false);
  /** The page has scrolled up over the hero, so nobody can see it change. */
  const [covered, setCovered] = useState(false);
  const count = slides.length;

  /** Wraps both ways, so stepping back from the first frame lands on the last. */
  const step = (by: number) => setActive((i) => (i + by + count) % count);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  const hold = {
    onPointerEnter: () => setChoosing(true),
    onPointerLeave: () => setChoosing(false),
    onFocus: () => setChoosing(true),
    onBlur: () => setChoosing(false),
    onKeyDown: onKey,
  };

  // Autoplay. A timeout keyed on `active`, not an interval: every change, by
  // hand or by the clock, starts a fresh hold. Reduced motion turns it off, and
  // so does a hidden tab, which would otherwise come back several frames on.
  useEffect(() => {
    if (count < 2 || choosing || covered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    const arm = () => {
      window.clearTimeout(timer);
      if (!document.hidden) timer = window.setTimeout(() => step(1), HOLD_MS);
    };
    arm();
    document.addEventListener("visibilitychange", arm);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", arm);
    };
    // `step` is recreated each render but only ever reads `count`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, choosing, covered, count]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (el.offsetHeight || 1)));
      el.style.setProperty("--mt-p", p.toFixed(4));
      // React bails out when the value is unchanged, so this costs nothing
      // except on the two frames where the hero becomes covered or uncovered.
      setCovered(p >= 0.98);
    };
    // One write per painted frame, however many scroll events arrive.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={root} className="mt-hero" data-tone="dark" aria-roledescription="carousel" aria-label="The car">
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

      {/* The outer fifths step through the frames, and hold them while rested on. */}
      <button
        type="button"
        className="mt-hero-edge mt-hero-edge-prev"
        aria-label={`Previous photograph (showing ${active + 1} of ${count})`}
        data-cursor-shape="prev"
        onClick={() => step(-1)}
        {...hold}
      />
      <button
        type="button"
        className="mt-hero-edge mt-hero-edge-next"
        aria-label={`Next photograph (showing ${active + 1} of ${count})`}
        data-cursor-shape="next"
        onClick={() => step(1)}
        {...hold}
      />

      {/* The car's name, dead centre, over every frame. */}
      {title ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={title.image}
          alt={title.alt}
          width={title.width}
          height={title.height}
          className="mt-hero-title"
          decoding="async"
        />
      ) : null}

      {/* Laurel, then the four markets, centred with a bottom bias. */}
      <div className="mt-hero-marks">
        <AwardLaurel
          mark={marks.laurel.mark}
          unit={marks.laurel.unit}
          body={marks.laurel.body}
          label={marks.laurel.label}
          delay={0.7}
        />
        <RegionMarks regions={marks.regions} />
      </div>
    </section>
  );
}
