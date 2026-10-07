"use client";

import { useRef, useState } from "react";
import { media } from "@/lib/media";
import sheet from "@/content/portfolio-cars.json";

/**
 * The Rennen Plus car grid on /portfolio: every thumbnail on the site, 12
 * across in 19 full rows. Put the pointer on a car (or tap it) and it grows to
 * three columns wide, right where it is. Only the cars in those three columns
 * move, and only straight up or down to clear it, so the rest of the grid
 * stays still.
 *
 * The frame has a few spare rows above and below the grid for those columns
 * to slide into, so nothing leaves the page.
 *
 * Small cars are drawn from one sprite file (so the page makes one request,
 * not hundreds); the open car loads its own larger file on top. The sprite,
 * the larger files and the car list are all written by the same script:
 * Portfolio/Rennen Plus/Source/Contact Sheet Rig/build.py.
 */

const COLS = 12;
const ROWS = 19;
const UP = 3; // rows the cars above an open car move up
const DOWN = 2; // rows the cars below it move down
const TRACKS = ROWS + UP + DOWN; // row heights the frame is divided into
const WIDE = 3; // columns an open car takes
const CARS = sheet.cars;
const SPRITE = "/media/images/portfolio/rennen-plus/cars-sprite.webp";

/** The open car, its own cell, and the first of the columns it takes. */
interface Open { i: number; c: number; r: number; c0: number }

/** Where every car sits: [column, row], given which one (if any) is open. */
function layout(open: Open | null): [number, number][] {
  return CARS.map((_, i) => {
    const c = i % COLS;
    const r = Math.floor(i / COLS);
    if (!open || i === open.i || c < open.c0 || c >= open.c0 + WIDE) return [c, r];
    return [c, r <= open.r ? r - UP : r + DOWN];
  });
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function PfCars() {
  const [open, setOpen] = useState<Open | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const at = layout(open);

  const point = (e: React.PointerEvent<HTMLDivElement>) => {
    const b = box.current?.getBoundingClientRect();
    if (!b) return;
    const c = Math.floor(((e.clientX - b.left) / b.width) * COLS);
    const r = Math.floor(((e.clientY - b.top) / b.height) * TRACKS) - UP;
    // still on the open car (its three columns, two rows either side): leave it
    if (open && c >= open.c0 && c < open.c0 + WIDE && Math.abs(r - open.r) <= 2) return;
    const i = at.findIndex((p) => p[0] === c && p[1] === r);
    if (i < 0) {
      if (open) setOpen(null);
      return;
    }
    const home = { c: i % COLS, r: Math.floor(i / COLS) };
    setOpen({ i, ...home, c0: clamp(home.c - 1, 0, COLS - WIDE) });
  };

  const sprite = `url(${media(SPRITE)})`;

  return (
    <div className="pf-cars" ref={box} onPointerMove={point} onPointerDown={point} onPointerLeave={() => setOpen(null)}>
      {CARS.map((car, i) => {
        const big = open?.i === i;
        return (
          <div
            key={car.slug}
            className="pf-car"
            data-big={big ? "1" : "0"}
            style={{
              transform: big
                ? `translate(${open.c0 * 100}%, ${(open.r - 1 + UP) * 100}%) scale(${WIDE})`
                : `translate(${at[i][0] * 100}%, ${(at[i][1] + UP) * 100}%)`,
            }}
          >
            <div
              className="pf-car-art"
              role="img"
              aria-label={car.name}
              style={{
                backgroundImage: sprite,
                backgroundSize: `${sheet.spriteCols * 100}% ${sheet.spriteRows * 100}%`,
                backgroundPosition: `${((i % sheet.spriteCols) / (sheet.spriteCols - 1)) * 100}% ${(Math.floor(i / sheet.spriteCols) / (sheet.spriteRows - 1)) * 100}%`,
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
      {open ? (
        <p className="pf-car-name pf-mono" style={{ left: `${((open.c0 + WIDE / 2) / COLS) * 100}%`, top: `${((open.r + 3 + UP) / TRACKS) * 100}%` }}>
          {CARS[open.i].name}
        </p>
      ) : null}
    </div>
  );
}
