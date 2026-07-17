import { COUNTRIES, VB_W, VB_H } from "./geo";

/**
 * LocatorMap — a small drawn map for a hostel: the real SE Asia outlines cropped
 * to a window around the spot, with a pink pin. Takes already-projected x/y (in
 * the geo.ts viewBox). Wrap it in a Google Maps link for the tap-through.
 */
// Studio-palette fill per country, overriding geo.ts's own (off-palette) fill
// field — Cambodia is off-route context, so it stays a neutral ink-soft wash.
const COUNTRY_FILL: Record<string, string> = {
  thailand: "var(--c-thailand, var(--pink))",
  laos: "var(--c-laos, var(--pink-deep))",
  vietnam: "var(--c-vietnam, var(--ink))",
  cambodia: "var(--ink-soft)",
};

export default function LocatorMap({ x, y, z = 17 }: { x: number; y: number; z?: number }) {
  const span = z * 2;
  const minX = Math.max(0, Math.min(VB_W - span, x - z));
  const minY = Math.max(0, Math.min(VB_H - span, y - z));
  return (
    <svg className="im-loc-svg" viewBox={`${minX} ${minY} ${span} ${span}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {COUNTRIES.map((c) =>
        c.paths.map((d, i) => (
          <path
            key={c.id + i}
            d={d}
            fill={COUNTRY_FILL[c.id] ?? "var(--ink-soft)"}
            fillOpacity={0.2}
            stroke={COUNTRY_FILL[c.id] ?? "var(--ink-soft)"}
            strokeOpacity={0.55}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))
      )}
      <circle cx={x} cy={y} r={2.4} fill="var(--pink, #E96D89)" stroke="var(--bg, #FDF9F9)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
