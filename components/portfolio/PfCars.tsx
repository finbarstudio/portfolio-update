"use client";

import { useRef, useState } from "react";
import { media } from "@/lib/media";
import sheet from "@/content/portfolio-cars.json";

/**
 * The Rennen Plus car grid on the portfolio: every thumbnail on the site, 12
 * across in 19 full rows, filling its frame exactly.
 *
 * Put the pointer on a car (or tap it) and it grows to three times its size,
 * where it is. Nothing is re-ordered: every other car keeps its place in the
 * grid and is simply pushed straight away from the open one, the near ones by
 * about a cell and the far ones by less. Cars pushed past the edge of the
 * frame are cut off by it (the frame hides its overflow, see portfolio.css).
 *
 * Small cars are drawn from one sprite file (so the page makes one request,
 * not hundreds); the open car loads its own larger file on top. The sprite,
 * the larger files and the car list are all written by the same script:
 * Portfolio/Rennen Plus/Source/Contact Sheet Rig/build.py.
 */

const COLS = 12;
const ROWS = 19;
const GROW = 3; // how many times bigger the open car is
const PUSH = 1.15; // cells the cars right beside it are pushed away
const REACH = 11; // cells from it at which the push has faded to nothing
const CARS = sheet.cars;
const SPRITE = "/media/images/portfolio/rennen-plus/cars-sprite.webp";

/** The open car and where its centre is shown, in cells. */
interface Open { i: number; x: number; y: number }

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Where car `i` is shown, [column, row], given which one (if any) is open. */
function place(i: number, open: Open | null): [number, number] {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  if (!open) return [c, r];
  if (i === open.i) return [open.x, open.y];
  const dx = c - open.x;
  const dy = r - open.y;
  const d = Math.hypot(dx, dy) || 1;
  // the fade is slow enough that neighbours never close up on each other
  const k = (PUSH * Math.max(0, 1 - d / REACH)) / d;
  return [c + dx * k, r + dy * k];
}

export default function PfCars() {
  const [open, setOpen] = useState<Open | null>(null);
  const box = useRef<HTMLDivElement>(null);

  const point = (e: React.PointerEvent<HTMLDivElement>) => {
    const b = box.current?.getBoundingClientRect();
    if (!b) return;
    // the car whose place in the grid the pointer is over
    const c = clamp(Math.floor(((e.clientX - b.left) / b.width) * COLS), 0, COLS - 1);
    const r = clamp(Math.floor(((e.clientY - b.top) / b.height) * ROWS), 0, ROWS - 1);
    const i = r * COLS + c;
    if (open?.i === i) return;
    // at the edges it opens a cell inwards, so the open car is never cut off
    const half = (GROW - 1) / 2;
    setOpen({ i, x: clamp(c, half, COLS - 1 - half), y: clamp(r, half, ROWS - 1 - half) });
  };

  const sprite = `url(${media(SPRITE)})`;

  return (
    <div className="pf-cars" ref={box} onPointerMove={point} onPointerDown={point} onPointerLeave={() => setOpen(null)}>
      {CARS.map((car, i) => {
        const big = open?.i === i;
        const [x, y] = place(i, open);
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
    </div>
  );
}
