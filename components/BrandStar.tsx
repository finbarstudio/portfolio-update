import { STAR_POINTS } from "@/components/brand-star";

/**
 * BrandStar — the finbar✶studio mark as an inline SVG, replacing the unreliable
 * ✶ glyph (which renders differently per system font) in the wordmark. Inherits
 * colour via `currentColor` and sits on the text baseline, so it behaves like a
 * letter inside "finbar✶studio".
 */
export default function BrandStar({
  size = "0.78em",
  className,
  style,
}: {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ display: "inline-block", verticalAlign: "-0.04em", ...style }}
    >
      <polygon points={STAR_POINTS} fill="currentColor" />
    </svg>
  );
}
