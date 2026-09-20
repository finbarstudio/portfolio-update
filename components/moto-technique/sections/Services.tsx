"use client";

import { useState } from "react";
import Wipe from "../Wipe";

type Item = { id: string; name: string; href: string; blurb: string; image: string };

/**
 * The services wheel: one circle cut into quarters, with Hi-Tech at the hub.
 *
 * Point at a quarter and it fills, a line draws itself out of it at an angle,
 * and a white card opens outside the circle on that quarter's own side: top
 * right for the top right quarter, and so on round. The card takes all the
 * room there is beside the wheel and carries that discipline's photograph. The
 * line meets the card on its side, near the corner, never at its middle.
 * Hi-Tech's card opens just under the hub, over the wheel. Nothing but the
 * wheel shows until you point: no lines, no cards. Click and that service's
 * page opens.
 *
 * ONE SET OF UNITS. The wheel is a 100 x 100 drawing, and the cards and lines
 * are placed in percentages of the same square, so 112% across is the same
 * place as x = 112 in the drawing. That is what lets a line land exactly on the
 * edge of a card at every size, with no measuring.
 *
 * THE LINES ARE HTML, NOT SVG. Each is a 1px-tall box, as long as the line,
 * turned to its angle about its starting end, and drawn in by growing from
 * that end. The usual SVG way (a dash the length of the line, slid into view)
 * came out visibly dashed here: a line told to stay 1px at any size also has
 * its dashes measured in screen pixels, so the "one long dash" broke up.
 *
 * WHO GETS WHAT. The labels are real links, so a keyboard or a screen reader
 * gets five ordinary links and never meets the drawing; focusing one opens its
 * box just as pointing does. The wedges repeat the hover and click for a
 * pointer only, so the whole quarter is the target, not just the word in it.
 * On a touch screen there is no hover, so the first tap opens the box and the
 * second follows the link.
 *
 * A first pass, as agreed. The full build gives each service its own page.
 */

const RIM = 46;
const HUB = 15;
/** Left edge of a right-hand box, and the mirror of it, in wheel units. */
const BOX_NEAR = 112;
/** How far down (or up) the box's side the line lands: near the corner. */
const BOX_HIT = 9;
/** The cards start this far above the wheel's top, and end as far below its bottom. */
const BOX_INSET = -6;

/** A point on the wheel, from an angle clockwise off 12 o'clock and a radius. */
const at = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [50 + r * Math.sin(a), 50 - r * Math.cos(a)] as const;
};

/** A quarter of the circle as a path: centre, out, round the arc, back. */
function wedge(index: number) {
  const [x1, y1] = at(index * 90, RIM);
  const [x2, y2] = at(index * 90 + 90, RIM);
  return `M50 50L${x1.toFixed(3)} ${y1.toFixed(3)}A${RIM} ${RIM} 0 0 1 ${x2.toFixed(3)} ${y2.toFixed(3)}Z`;
}

/** Everything about where quarter `index` puts its label, its line and its box. */
function place(index: number) {
  const mid = index * 90 + 45;
  const right = index < 2;
  const top = index === 0 || index === 3;
  const [lx, ly] = at(mid, (HUB + RIM) / 2);
  const [sx, sy] = at(mid, 39);
  const ex = right ? BOX_NEAR : 100 - BOX_NEAR;
  const ey = top ? BOX_INSET + BOX_HIT : 100 - BOX_INSET - BOX_HIT;
  return {
    label: { left: `${lx.toFixed(2)}%`, top: `${ly.toFixed(2)}%` },
    // start point, length and angle: all the stylesheet needs to draw it
    line: {
      left: `${sx.toFixed(3)}%`,
      top: `${sy.toFixed(3)}%`,
      width: `${Math.hypot(ex - sx, ey - sy).toFixed(3)}%`,
      rotate: `${((Math.atan2(ey - sy, ex - sx) * 180) / Math.PI).toFixed(3)}deg`,
    },
    box: `${right ? "right" : "left"}-${top ? "top" : "bottom"}`,
  };
}

export default function Services({ services }: { services: { title: string; quarters: Item[]; hub: Item } }) {
  const [open, setOpen] = useState<string | null>(null);

  /** Pointing opens a box; on touch there is no pointing, so taps do it (see `tap`). */
  const point = (s: Item) => ({
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType !== "touch") setOpen(s.id);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType !== "touch") setOpen((v) => (v === s.id ? null : v));
    },
  });

  /** True when this click should open the box rather than follow the link. */
  const tap = (s: Item) => {
    const touch = window.matchMedia("(hover: none)").matches;
    if (touch && open !== s.id) {
      setOpen(s.id);
      return true;
    }
    return false;
  };

  const visit = (s: Item) => {
    if (!tap(s)) window.location.assign(s.href);
  };

  const label = (s: Item, className: string, style?: React.CSSProperties) => (
    <a
      key={`label-${s.id}`}
      href={s.href}
      className={className}
      style={style}
      data-open={open === s.id ? "1" : "0"}
      aria-describedby={`mt-svc-${s.id}`}
      onClick={(e) => {
        if (tap(s)) e.preventDefault();
      }}
      onFocus={() => setOpen(s.id)}
      onBlur={() => setOpen((v) => (v === s.id ? null : v))}
      {...point(s)}
    >
      {s.name}
    </a>
  );

  const box = (s: Item, where: string) => (
    <div key={`box-${s.id}`} id={`mt-svc-${s.id}`} className="mt-wheel-box" data-where={where} data-open={open === s.id ? "1" : "0"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.image} alt="" className="mt-wheel-box-img" loading="lazy" decoding="async" />
      <div className="mt-wheel-box-say">
        <span className="mt-wheel-box-name">{s.name}</span>
        <p>{s.blurb}</p>
      </div>
    </div>
  );

  return (
    <section className="mt-services" id="services" data-tone="light">
      <Wipe as="h2" className="mt-title">
        {services.title}
      </Wipe>

      <div className="mt-wheel">
        <svg viewBox="0 0 100 100" className="mt-wheel-art" aria-hidden="true">
          {services.quarters.map((s, i) => (
            <path
              key={s.id}
              d={wedge(i)}
              className="mt-wheel-quarter"
              data-open={open === s.id ? "1" : "0"}
              onClick={() => visit(s)}
              {...point(s)}
            />
          ))}
          <circle cx="50" cy="50" r={RIM} className="mt-wheel-ring" />

          <circle
            cx="50"
            cy="50"
            r={HUB}
            className="mt-wheel-hub"
            data-open={open === services.hub.id ? "1" : "0"}
            onClick={() => visit(services.hub)}
            {...point(services.hub)}
          />
        </svg>

        {/* The leader lines: nothing until a quarter is pointed at, then drawn in. */}
        {services.quarters.map((s, i) => (
          <span
            key={`lead-${s.id}`}
            className="mt-wheel-lead"
            style={place(i).line}
            data-open={open === s.id ? "1" : "0"}
            aria-hidden="true"
          />
        ))}

        {services.quarters.map((s, i) => label(s, "mt-wheel-label", place(i).label))}
        {label(services.hub, "mt-wheel-hub-label")}

        {services.quarters.map((s, i) => box(s, place(i).box))}
        {box(services.hub, "hub")}
      </div>
    </section>
  );
}
