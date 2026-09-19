"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/content/moto-technique";
import AwardLaurel from "../AwardLaurel";
import DinoBadge, { type Finish } from "../DinoBadge";
import RegionMarks from "../RegionMarks";

/** How long each photograph holds before the next one fades in. */
const HOLD_MS = 6000;

/** Eases the scroll so the split starts and lands softly instead of tracking the wheel 1:1. */
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

type Sale = {
  eyebrow: string;
  price: string;
  quote: string;
  quoteBy: string;
  body: string;
  lot: string;
  spec: { label: string; value: string }[];
  details: string[];
  closing: string;
  closingBy: string;
  links: { label: string; href: string }[];
};

/**
 * The hero: one car, its name, and then its story.
 *
 * AT REST. The photograph edge to edge, the car's badge in the middle, and
 * under it the laurel and the four flags. No headline, no thumbnails.
 *
 * AS YOU SCROLL. The hero stays pinned and plays one move: the laurel and flags
 * fade, the badge turns a quarter turn anticlockwise and settles in the left
 * half, the photograph slides over to stay centred behind it, and a white panel
 * comes in from the right carrying what the car is. On a phone there is no room
 * for left and right, so the panel rises from the bottom and the badge stays
 * level in the photograph above it.
 *
 * ONCE OPEN the panel scrolls on its own while the hero stays pinned: the sale
 * figure and Jay Leno's line, then the specification, the details that make it
 * theirs, Kevin's closing word, and the links out to the auction and the film.
 * Only when it reaches its end does the rest of the page start to scroll up
 * over the pinned hero like a curtain, with the hero drifting up behind it.
 *
 * HOW. This file measures two numbers from the scroll position and hands them
 * to the stylesheet, which decides what moves and by how much:
 *   --mt-split  0 to 1 across the scroll spacer that follows the hero
 *   --mt-p      0 to 1 while the next section covers the hero
 * With reduced motion the split is a cut, not a move: it jumps from closed to
 * open partway down, so the information is still reached without the travel.
 *
 * Left alone, the photograph changes every few seconds. The outer fifths of the
 * frame step it by hand (the cursor becomes an arrow there); they are real
 * buttons, so Tab and the arrow keys work, and resting on one holds the frame.
 *
 * Everything shown comes from content/moto-technique.ts: `hero`, `heroMark`,
 * `marks` and `sale`. Swap those and it is a different car.
 */
export default function Hero({
  slides,
  title,
  marks,
  sale,
  h1,
}: {
  slides: HeroSlide[];
  title: { image: string; normal: string; finish: Finish; alt: string; width: number; height: number } | null;
  marks: {
    laurel: { mark: string; unit: string; body: string; label: string };
    regions: { id: string; label: string }[];
  };
  sale: Sale;
  /** The page's one h1. Read out and indexed, not shown: the hero is wordless by design. */
  h1: string;
}) {
  const root = useRef<HTMLElement>(null);
  const run = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  /** Pointer or keyboard focus is resting on an edge: someone is choosing. */
  const [choosing, setChoosing] = useState(false);
  /** The page has scrolled up over the hero, so nobody can see it change. */
  const [covered, setCovered] = useState(false);
  /** The info panel is on screen, so its links may take focus. */
  const [open, setOpen] = useState(false);
  const count = slides.length;

  /** Wraps both ways, so stepping back from the first frame lands on the last. */
  const step = (by: number) => setActive((i) => (i + by + count) % count);

  const hold = {
    onPointerEnter: () => setChoosing(true),
    onPointerLeave: () => setChoosing(false),
    onFocus: () => setChoosing(true),
    onBlur: () => setChoosing(false),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    },
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
    const spacer = run.current;
    const inner = panel.current;
    if (!el || !spacer || !inner) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // How far the panel's contents overflow it, which is how far they travel as
    // it reads itself out. Zero on a screen tall enough to hold them at once.
    // Remeasured whenever the box changes, so it is right at every size and
    // once the fonts have swapped in.
    const measure = () => {
      const over = Math.max(0, inner.scrollHeight - (inner.parentElement?.clientHeight ?? 0));
      el.style.setProperty("--mt-over", `${Math.round(over)}px`);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(inner);
    if (inner.parentElement) ro.observe(inner.parentElement);

    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const distance = spacer.offsetHeight || 1;
      // The move finishes at 80% of the spacer; the last fifth is a held beat
      // with the panel fully open before the next section starts to cover it.
      // The split plays over the first 40% of the spacer. The rest is the panel
      // reading itself out: `read` drives how far its contents are scrolled up.
      const raw = clamp01(y / (distance * 0.4));
      const split = reduce ? (raw > 0.45 ? 1 : 0) : smooth(raw);
      const read = clamp01((y - distance * 0.4) / (distance * 0.6));
      const cover = reduce ? 0 : clamp01((y - distance) / (el.offsetHeight || 1));
      el.style.setProperty("--mt-read", read.toFixed(4));
      el.style.setProperty("--mt-split", split.toFixed(4));
      el.style.setProperty("--mt-p", cover.toFixed(4));
      // React bails out when a value is unchanged, so these cost nothing except
      // on the frames where a threshold is actually crossed.
      setOpen(split > 0.6);
      setCovered(cover >= 0.98);
    };
    // One write per painted frame, however many scroll events arrive.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <section ref={root} className="mt-hero" data-tone="dark" aria-roledescription="carousel" aria-label="The car">
        <h1 className="mt-sr">{h1}</h1>

        {/* Every frame is mounted and cross-fades, so a switch never blanks. */}
        <div className="mt-hero-stage" aria-hidden="true">
          {slides.map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={s.id}
              src={s.image}
              srcSet={`${s.imageSm} 1600w, ${s.image} 2500w`}
              sizes="100vw"
              alt=""
              className="mt-hero-img"
              data-active={i === active ? "1" : "0"}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
            />
          ))}
          <div className="mt-hero-grain" />
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

        {title ? <DinoBadge title={title} active={!covered} /> : null}

        {/* Laurel, then the four markets. They leave as the split begins. */}
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

        {/* What the car is. Off screen until the split, and inert until then so
            its links cannot take focus while nobody can see them. */}
        <aside className="mt-hero-info" id="sale" aria-label="About this car" data-tone="light" inert={!open}>
          <div ref={panel} className="mt-hero-info-inner">
            <span className="mt-eyebrow">{sale.eyebrow}</span>
            <p className="mt-sale-price">{sale.price}</p>
            <p className="mt-sale-lot">{sale.lot}</p>

            <blockquote className="mt-sale-quote">
              <p>“{sale.quote}”</p>
              <cite>{sale.quoteBy}</cite>
            </blockquote>
            <p className="mt-sale-body">{sale.body}</p>

            <dl className="mt-spec">
              {sale.spec.map((row) => (
                <div key={row.label} className="mt-spec-row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-details">
              {sale.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            <blockquote className="mt-sale-closing">
              <p>“{sale.closing}”</p>
              <cite>{sale.closingBy}</cite>
            </blockquote>

            <p className="mt-sale-links">
              {sale.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" data-cursor="Open">
                  {l.label}
                </a>
              ))}
            </p>
          </div>
        </aside>
      </section>

      {/* Scroll distance for the split to play over. It holds nothing: the hero
          is pinned behind it the whole way. */}
      <div ref={run} className="mt-hero-run" aria-hidden="true" />
    </>
  );
}
