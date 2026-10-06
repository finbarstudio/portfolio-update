"use client";

import { useState } from "react";
import { media } from "@/lib/media";
import sheet from "@/content/portfolio-cars.json";

/**
 * The hover layer over the Rennen Plus car contact sheet on /portfolio.
 *
 * The sheet itself is one flat image. This sits on top of it, works out which
 * car the pointer is over from the sheet's grid, and brings that car up large
 * in the middle with its name, while the sheet dims behind it. On a phone a
 * tap does the same, and a tap on empty space puts it away.
 *
 * The grid numbers and the car list come from content/portfolio-cars.json,
 * written by the same script that draws the sheet (Portfolio/Rennen Plus/
 * Source/Contact Sheet Rig/build.py), so the two can never disagree.
 */
export default function PfCars() {
  const [on, setOn] = useState(-1);
  const car = sheet.cars[on];

  const find = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width - sheet.mx) / (1 - 2 * sheet.mx);
    const y = ((e.clientY - box.top) / box.height - sheet.my) / (1 - 2 * sheet.my);
    const col = Math.floor(x * sheet.cols);
    const row = Math.floor(y * sheet.rows);
    const i = row * sheet.cols + col;
    setOn(x >= 0 && x < 1 && y >= 0 && y < 1 && i < sheet.cars.length ? i : -1);
  };

  return (
    <div className="pf-cars" data-on={car ? "1" : "0"} onPointerMove={find} onPointerDown={find} onPointerLeave={() => setOn(-1)}>
      {car ? (
        <figure key={car.slug}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media(`/media/images/portfolio/rennen-plus/cars/${car.slug}.webp`)} alt={car.name} width={1000} height={400} />
          <figcaption className="pf-mono">{car.name}</figcaption>
        </figure>
      ) : null}
    </div>
  );
}
