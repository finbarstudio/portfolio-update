"use client";

import { ASIA_PATH, ASIA_VIEWBOX } from "./asiaPath";
import { FLAG_ART, type FlagArt } from "./flagArt";

/**
 * The four markets Moto Technique works for.
 *
 * The home page says their projects come "from all over the UK, Europe, Asia
 * and North America", which is a real credential buried in a paragraph nobody
 * reads. These put it under the laurel in the hero.
 *
 * The three flags are Finbar's one-colour artwork (see flagArt.ts), so nothing
 * is drawn here: this file only paints the shapes in `currentColor`. A
 * continent has no flag, so Asia is its coastline (see asiaPath.ts).
 *
 * All four share one height and a hairline outline, and each keeps its own true
 * proportions, the way a row of real flags hangs: the Union Flag at 1:2 and the
 * Stars and Stripes at 10:19 come out wider than Europe at 2:3. Nothing is
 * cropped or squeezed to match.
 *
 * The box is the <li>, not the <svg>. Each <li> is told its proportions outright
 * (--mt-ratio, read from the artwork's viewBox) and the stylesheet gives it a
 * whole-pixel height and the border; the svg just fills it. Sizing the svg
 * itself with an automatic width and a border is where browsers disagree about
 * which box the proportions apply to, and the flags came out different heights.
 */
const ratio = (viewBox: string) => {
  const [, , w, h] = viewBox.split(/\s+/).map(Number);
  return (w / h).toFixed(4);
};

function Flag({ art, label }: { art: FlagArt; label: string }) {
  return (
    <svg
      viewBox={art.viewBox}
      preserveAspectRatio="xMidYMid slice"
      className="mt-flag"
      role="img"
      aria-label={label}
      fill="currentColor"
    >
      {art.shapes.map((s, i) => {
        if (s.t === "polygon") return <polygon key={i} points={s.points} />;
        if (s.t === "path") return <path key={i} d={s.d} />;
        return <rect key={i} x={s.x} y={s.y} width={s.width} height={s.height} />;
      })}
    </svg>
  );
}

/** The stroke welds the hairline seams that simplifying the map leaves behind. */
function Asia({ label }: { label: string }) {
  return (
    <svg viewBox={ASIA_VIEWBOX} className="mt-flag" role="img" aria-label={label}>
      <path
        d={ASIA_PATH}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

const isFlag = (id: string): id is keyof typeof FLAG_ART => id in FLAG_ART;

export default function RegionMarks({ regions }: { regions: { id: string; label: string }[] }) {
  return (
    <ul className="mt-regions" aria-label="Where our work goes">
      {regions.map(({ id, label }) => {
        if (!isFlag(id) && id !== "asia") return null;
        return (
          <li
            key={id}
            className="mt-region"
            title={label}
            style={{ ["--mt-ratio" as string]: ratio(isFlag(id) ? FLAG_ART[id].viewBox : ASIA_VIEWBOX) }}
          >
            {isFlag(id) ? <Flag art={FLAG_ART[id]} label={label} /> : <Asia label={label} />}
          </li>
        );
      })}
    </ul>
  );
}
