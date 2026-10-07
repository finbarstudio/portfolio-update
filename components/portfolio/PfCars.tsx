"use client";

import { useEffect, useRef, useState } from "react";
import { media } from "@/lib/media";
import sheet from "@/content/portfolio-cars.json";

/**
 * The Rennen Plus car grid on the portfolio: every thumbnail on the site, 12
 * across in 19 full rows. Rest the pointer on a car (or tap it) and it grows
 * to three cells by three, right where it is, while every other car shuffles
 * along to make room and stays in the grid.
 *
 * It is kept gentle on purpose: the open car is three cells, not five; a car
 * only opens once the pointer has rested on it for a moment, so sweeping
 * across the grid does not set the whole thing churning; and the shuffle is
 * slow (the transition is in portfolio.css).
 *
 * The frame is 12 by 20 cells: room for every car plus the space one open car
 * takes. At rest the last row is spare, so everything sits half a row lower to
 * stay centred.
 *
 * Small cars are drawn from one sprite file (so the page makes one request,
 * not hundreds); the open car loads its own larger file on top. The sprite,
 * the larger files and the car list are all written by the same script:
 * Portfolio/Rennen Plus/Source/Contact Sheet Rig/build.py.
 */

const COLS = 12;
const ROWS = 20; // 19 rows of cars and one spare
const SPAN = 3; // cells an open car takes, each way
const REST = 140; // ms the pointer must stay on a car before it opens
const CARS = sheet.cars;
const SPRITE = "/media/images/portfolio/rennen-plus/cars-sprite.webp";

/** The open car and the top left cell of the block it takes. */
interface Open { i: number; c: number; r: number }

/** Where every car sits: [column, row], given which one (if any) is open. */
function layout(open: Open | null): [number, number][] {
  const at: [number, number][] = new Array(CARS.length);
  let k = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (open && c >= open.c && c < open.c + SPAN && r >= open.r && r < open.r + SPAN) continue;
      if (open && k === open.i) k++;
      if (k < CARS.length) at[k++] = [c, r];
    }
  }
  if (open) at[open.i] = [open.c, open.r];
  return at;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function PfCars() {
  const [open, setOpen] = useState<Open | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const wait = useRef<{ i: number; id: ReturnType<typeof setTimeout> } | null>(null);
  const at = layout(open);
  const drop = open ? 0 : 0.5; // the half-row that centres the grid at rest

  const cancel = () => {
    if (wait.current) clearTimeout(wait.current.id);
    wait.current = null;
  };
  useEffect(() => cancel, []);

  const point = (e: React.PointerEvent<HTMLDivElement>) => {
    const b = box.current?.getBoundingClientRect();
    if (!b) return;
    const x = ((e.clientX - b.left) / b.width) * COLS;
    const y = ((e.clientY - b.top) / b.height) * ROWS;
    const c = Math.floor(x);
    // still on the open car: leave it
    if (open && c >= open.c && c < open.c + SPAN && y >= open.r && y < open.r + SPAN) return cancel();
    const r = Math.floor(y - drop);
    const i = at.findIndex((p) => p[0] === c && p[1] === r);
    if (i < 0) {
      cancel();
      if (open) setOpen(null);
      return;
    }
    // open it around the pointer, so the pointer is still on it afterwards
    const next = { i, c: clamp(c - 1, 0, COLS - SPAN), r: clamp(Math.floor(y) - 1, 0, ROWS - SPAN) };
    if (e.type === "pointerdown") {
      cancel();
      setOpen(next);
    } else if (wait.current?.i !== i) {
      cancel();
      wait.current = { i, id: setTimeout(() => { wait.current = null; setOpen(next); }, REST) };
    }
  };

  const sprite = `url(${media(SPRITE)})`;

  return (
    <div
      className="pf-cars"
      ref={box}
      onPointerMove={point}
      onPointerDown={point}
      onPointerLeave={() => {
        cancel();
        setOpen(null);
      }}
    >
      {CARS.map((car, i) => {
        const big = open?.i === i;
        return (
          <div
            key={car.slug}
            className="pf-car"
            data-big={big ? "1" : "0"}
            style={{ transform: `translate(${at[i][0] * 100}%, ${(at[i][1] + drop) * 100}%) scale(${big ? SPAN : 1})` }}
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
