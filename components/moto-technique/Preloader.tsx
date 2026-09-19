"use client";

import { useEffect, useRef } from "react";
import { LOGOMARK_PATHS } from "./logomarkPath";

/**
 * The preloader: a white screen, the logomark, and a way through it.
 *
 *   1. the screen is white
 *   2. the mark draws itself as an outline, in their red
 *   3. the inside of the mark cuts away, so the page shows through it like a
 *      window cut in the white
 *   4. the camera flies through that window and the white is gone
 *
 * HOW THE WINDOW WORKS. The white is one rect with an SVG mask. The mask is
 * white everywhere except the mark, which is painted black at an opacity that
 * goes 0 to 1: black in a mask means "not here", so raising it opens the hole.
 * A mask rather than a hole cut into the rect's own path, because a cut-out is
 * either there or it is not. Only a mask can open by degrees, which is the
 * "cuts away" moment.
 *
 * WHERE IT FLIES. Not the middle: the exact centre of the mark is the gap
 * between its two inner strokes, so zooming there zooms into white for ever.
 * TARGET is the roomiest point inside the mark, in the thick sweep at its left
 * end, found by measuring the artwork (largest clear circle: 20 units, against
 * 6.5 for anything near the middle). More room means a gentler zoom covers the
 * screen, 70x here, and a gentler zoom stays smooth. The target also slides to
 * the centre of the screen as it grows, so you arrive through the middle.
 *
 * WHY ATTRIBUTES AND NOT CSS. Every frame writes the `transform` attribute on
 * two groups, one inside the mask and one holding the outline, so they move as
 * one. Safari does not reliably repaint a CSS animation running on the contents
 * of a <mask>; it always repaints an attribute change. Transforming inside the
 * SVG also keeps the element itself screen sized. Scaling the element 70x would
 * ask the GPU for a layer 100,000px wide.
 *
 * ONCE PER SESSION. layout.tsx runs a one-line script before first paint that
 * marks the page `data-intro` only if this session has not seen it, and the
 * stylesheet shows this component only under that mark. So a refresh never
 * flashes white, and nothing replays. `?intro` in the address forces it.
 */

/** Logical square the SVG works in. `slice` makes it fill any screen shape. */
const VIEW = 1000;
/** The mark's artwork is 498.87 x 68.19. */
const ART_W = 498.87;
const ART_H = 68.19;
/** Width of the mark in logical units: about 430px on a laptop, 250 on a phone. */
const MARK_W = 300;
const K = MARK_W / ART_W;
const MARK_X = (VIEW - MARK_W) / 2;
const MARK_Y = (VIEW - ART_H * K) / 2;
/** Roomiest interior point of the mark, (45, 43) in its own units. */
const TARGET_X = MARK_X + 45 * K;
const TARGET_Y = MARK_Y + 43 * K;
const END_SCALE = 70;

/** The sequence, in milliseconds. */
const HOLD = 250;
const DRAW = 1500;
const OPEN = 450;
const ZOOM = 1150;
/** The zoom starts just before the window has finished opening. */
const ZOOM_AT = HOLD + DRAW + OPEN - 150;

const SEEN_KEY = "mt-intro-seen";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const site = el?.closest<HTMLElement>(".mt-site");
    if (!el || !site || !site.hasAttribute("data-intro")) return;

    const lenis = (window as unknown as { __mtLenis?: { stop(): void; start(): void } }).__mtLenis;
    lenis?.stop();

    const finish = () => {
      site.removeAttribute("data-intro");
      lenis?.start();
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // private mode: it will simply play again next load
      }
    };

    // Reduced motion: no drawing, no flying. The white lifts and that is all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      site.setAttribute("data-intro", "open");
      el.style.transition = "opacity 0.5s linear";
      el.style.opacity = "0";
      const t = window.setTimeout(finish, 520);
      return () => window.clearTimeout(t);
    }

    const hole = el.querySelector<SVGGElement>("[data-pre='hole']");
    const holeMove = el.querySelector<SVGGElement>("[data-pre='hole-move']");
    const lineMove = el.querySelector<SVGGElement>("[data-pre='line-move']");
    const lines = el.querySelectorAll<SVGPathElement>("[data-pre='line'] path");
    const veil = el.querySelector<SVGRectElement>("[data-pre='veil']");
    if (!hole || !holeMove || !lineMove || !veil) return finish();

    let raf = 0;
    let start = 0;
    let opened = false;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = now - start;

      // 2. the outline draws
      const draw = easeInOut(clamp01((t - HOLD) / DRAW));
      for (const p of lines) p.style.strokeDashoffset = String(1 - draw);

      // 3. the inside cuts away
      const open = clamp01((t - HOLD - DRAW) / OPEN);
      hole.setAttribute("opacity", easeOut(open).toFixed(3));
      if (open > 0 && !opened) {
        opened = true;
        // The page is now on show, so let the hero start its own entrance.
        site.setAttribute("data-intro", "open");
      }

      // 4. through the window. The scale is eased in log space, which is what
      // makes a zoom feel like constant travel rather than a lurch at the end.
      const z = clamp01((t - ZOOM_AT) / ZOOM);
      const e = easeIn(z);
      const s = Math.pow(END_SCALE, e);
      const cx = TARGET_X + (VIEW / 2 - TARGET_X) * e;
      const cy = TARGET_Y + (VIEW / 2 - TARGET_Y) * e;
      const move = `translate(${cx.toFixed(2)} ${cy.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-TARGET_X} ${-TARGET_Y})`;
      holeMove.setAttribute("transform", move);
      lineMove.setAttribute("transform", move);
      lineMove.setAttribute("opacity", (1 - clamp01(z / 0.45)).toFixed(3));
      // Belt and braces: whatever white is left in the corners goes with the
      // very last of the zoom, so there is never a pop at the end. It starts
      // late on purpose. By 0.92 the window is 27x and nearly covers the
      // screen; any earlier and the ending reads as a dissolve, not a flight.
      veil.setAttribute("opacity", (1 - clamp01((z - 0.92) / 0.08)).toFixed(3));

      if (z < 1) raf = requestAnimationFrame(tick);
      else finish();
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const place = `translate(${MARK_X} ${MARK_Y.toFixed(3)}) scale(${K.toFixed(5)})`;

  return (
    <div ref={root} className="mt-pre" aria-hidden="true">
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} preserveAspectRatio="xMidYMid slice" className="mt-pre-svg">
        <defs>
          <mask id="mt-pre-window" maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW} height={VIEW}>
            <rect width={VIEW} height={VIEW} fill="#fff" />
            <g data-pre="hole-move">
              <g data-pre="hole" transform={place} fill="#000" opacity="0">
                {LOGOMARK_PATHS.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
            </g>
          </mask>
        </defs>

        <rect data-pre="veil" width={VIEW} height={VIEW} fill="#fff" mask="url(#mt-pre-window)" />

        <g data-pre="line-move">
          <g data-pre="line" transform={place} className="mt-pre-line">
            {LOGOMARK_PATHS.map((d, i) => (
              <path key={i} d={d} pathLength={1} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
