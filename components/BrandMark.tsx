import { MARK_SHAPES, MARK_VIEWBOX } from "./brand-mark";

/**
 * BrandMark — the gradient asterisk, rendered from the supplied artwork.
 *
 * This is the logo. It replaces the old flat pink polygon: the mark now carries
 * its own six-step ramp, so unlike the old one it does NOT take `currentColor`
 * and cannot be recoloured by its parent. That's deliberate, it's the brand.
 *
 * Sizes off the font-size of its box (width/height 1em) exactly like the old
 * mark did, so the wordmark lockup keeps its proportions.
 */
export default function BrandMark({
  className = "",
  title,
}: {
  className?: string;
  /** Give it a title only when the mark stands alone as the logo. */
  title?: string;
}) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {MARK_SHAPES.map((s, i) => {
        // --layer = distance from the centre dot (painted last, so layer 0).
        // Inert on its own; CSS pulse rules (.mark-pulse, the footer's slow
        // breathe) use it to stagger the shapes centre-out.
        const style = { "--layer": MARK_SHAPES.length - 1 - i } as React.CSSProperties;
        if (s.tag === "polygon") return <polygon key={i} points={s.points} fill={s.fill} style={style} />;
        if (s.tag === "circle") return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} style={style} />;
        return <path key={i} d={s.d} fill={s.fill} style={style} />;
      })}
    </svg>
  );
}
