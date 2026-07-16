"use client";

/**
 * BrandLoader — the one loading icon, everywhere.
 *
 * It's the preloader in miniature: the gradient mark's six shapes pulse from the
 * centre dot out to the tips, on a loop. The home intro plays that same move
 * once through GSAP; here it's a CSS keyframe so a tiny spinner carries no JS.
 *
 * There is ONE place to amend the look: the `.brand-loader` block in globals.css
 * (its `--brand-loader-*` tokens set the speed and the stagger). Every loading
 * state on the site routes through here — image placeholders (ClientImage),
 * route skeletons (loading.tsx), 3D/model loaders — so a change here changes all
 * of them. `LoaderThree` is kept as an alias so existing call sites don't move.
 */

import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

export function BrandLoader({ size = 46 }: { size?: number | "fluid" }) {
  // "fluid" fills the positioned parent — used decoratively (the 404's pulse
  // row) where the mark should scale with its cell rather than sit at 46px.
  const dim = size === "fluid" ? "100%" : size;
  return (
    <span className="brand-loader" aria-label="Loading" role="status">
      <svg viewBox={MARK_VIEWBOX} width={dim} height={dim} aria-hidden="true">
        {MARK_SHAPES.map((s, i) => {
          // Centre-out: the centre dot is painted last (on top), so the pulse
          // starts there and travels to the tips. --layer is the distance from
          // the centre, driving each shape's animation-delay in the CSS.
          const layer = MARK_SHAPES.length - 1 - i;
          const style = { "--layer": layer } as React.CSSProperties;
          if (s.tag === "polygon") return <polygon key={i} points={s.points} fill={s.fill} style={style} />;
          if (s.tag === "circle") return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} style={style} />;
          return <path key={i} d={s.d} fill={s.fill} style={style} />;
        })}
      </svg>
    </span>
  );
}

/** Legacy name — every existing call site imports LoaderThree. */
export const LoaderThree = BrandLoader;

export default BrandLoader;
