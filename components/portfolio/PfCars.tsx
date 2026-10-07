"use client";

import { useEffect, useRef, useState } from "react";
import { media } from "@/lib/media";
import sheet from "@/content/portfolio-cars.json";

/**
 * The Rennen Plus car grid on the portfolio: every thumbnail on the site, 12
 * across in 19 full rows, filling its frame exactly.
 *
 * Put the pointer on a car (or tap it) and it grows to fill a block of five
 * cells by five around it. Nothing is re-ordered and nothing leaves the
 * grid's slots: the rows above it step up, the rows below it step down, and
 * the cars beside it in its own row step out sideways, each by a whole number
 * of slots. So the frame (which hides its overflow, see portfolio.css) only
 * ever cuts off whole cars: one row at the top and one at the bottom, or two
 * at one end when the open car is on an edge.
 *
 * Small cars are drawn from one sprite file (so the page makes one request,
 * not hundreds); the open car loads its own larger file on top. The sprite,
 * the larger files and the car list are all written by the same script:
 * Portfolio/Rennen Plus/Source/Contact Sheet Rig/build.py.
 */

/** Columns, rows and the cells the open car takes each way. */
interface Grid { cols: number; rows: number; grow: number }
const WIDE: Grid = { cols: 12, rows: 19, grow: 5 };
// A phone shows a sample, about every fifth car, at the size they are on a
// desktop: all 228 would be either tiny or a very long scroll. It is a still
// grid there: nothing opens on touch.
const PHONE: Grid = { cols: 4, rows: 12, grow: 1 };
const CELL = 2.9; // a cell's width over its height, the same on both (the frame in portfolio.css is cut to it)
const CARS = sheet.cars;
const SPRITE = "/media/images/portfolio/rennen-plus/cars-sprite.webp";

/** The open car, its own cell, and the top left cell of the block it fills. */
interface Open { i: number; c: number; r: number; c0: number; r0: number }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Where car `i` is shown, [column, row], given which one (if any) is open. */
function place(i: number, open: Open | null, { cols, grow: GROW }: Grid): [number, number] {
  const c = i % cols;
  const r = Math.floor(i / cols);
  if (!open) return [c, r];
  // the open car sits in the middle of its block
  if (i === open.i) return [open.c0 + (GROW - 1) / 2, open.r0 + (GROW - 1) / 2];
  // rows step clear of the block, by however much of it lies on their side
  if (r < open.r) return [c, r - (open.r - open.r0)];
  if (r > open.r) return [c, r + (open.r0 + GROW - 1 - open.r)];
  // its own row parts around it
  return [c < open.c ? c - (open.c - open.c0) : c + (open.c0 + GROW - 1 - open.c), r];
}

export default function PfCars() {
  const [open, setOpen] = useState<Open | null>(null);
  const [phone, setPhone] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const set = () => {
      setPhone(mq.matches);
      setOpen(null);
    };
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const grid = phone ? PHONE : WIDE;
  const { cols: COLS, rows: ROWS, grow: GROW } = grid;
  // which cars are shown: all of them, or an even sample on a phone
  const count = COLS * ROWS;
  const shown = Array.from({ length: count }, (_, k) => Math.floor((k * CARS.length) / count));

  const point = (e: React.PointerEvent<HTMLDivElement>) => {
    const b = box.current?.getBoundingClientRect();
    if (!b || phone) return;
    // the car whose place in the grid the pointer is over
    const c = clamp(Math.floor(((e.clientX - b.left) / b.width) * COLS), 0, COLS - 1);
    const r = clamp(Math.floor(((e.clientY - b.top) / b.height) * ROWS), 0, ROWS - 1);
    const i = r * COLS + c;
    if (open?.i === i) return;
    // the block is centred on the car, or sits against the edge the car is on
    setOpen({ i, c, r, c0: clamp(c - (GROW - 1) / 2, 0, COLS - GROW), r0: clamp(r - (GROW - 1) / 2, 0, ROWS - GROW) });
  };

  const sprite = `url(${media(SPRITE)})`;

  return (
    <div
      className="pf-cars"
      ref={box}
      style={{ "--cols": COLS, "--rows": ROWS, "--shape": ((COLS * CELL) / ROWS).toFixed(4) } as React.CSSProperties}
      onPointerMove={point}
      onPointerDown={point}
      onPointerLeave={() => setOpen(null)}
    >
      {shown.map((n, i) => {
        const car = CARS[n];
        const big = open?.i === i;
        const [x, y] = place(i, open, grid);
        return (
          <div
            key={car.slug}
            className="pf-car"
            data-big={big ? "1" : "0"}
            style={{ transform: `translate(${x * 100}%, ${y * 100}%) scale(${big ? GROW : 1})` }}
          >
            <div
              className="pf-car-art"
              role="img"
              aria-label={car.name}
              style={{
                backgroundImage: sprite,
                backgroundSize: `${sheet.spriteCols * 100}% ${sheet.spriteRows * 100}%`,
                backgroundPosition: `${((n % sheet.spriteCols) / (sheet.spriteCols - 1)) * 100}% ${(Math.floor(n / sheet.spriteCols) / (sheet.spriteRows - 1)) * 100}%`,
              }}
            >
              {big ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={media(`/media/images/portfolio/rennen-plus/cars/${car.slug}.webp`)} alt="" width={1000} height={400} />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
