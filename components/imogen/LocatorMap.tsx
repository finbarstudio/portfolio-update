import { COUNTRIES, VB_W, VB_H } from "./geo";

/**
 * LocatorMap — a small drawn map for a hostel: the shared SE Asia outlines,
 * cropped to a square window around the spot, with a pink pin where it is.
 * Reuses the exact geo.ts paths + the city's pin coords, so it always matches
 * the big map. Wrap it in a Google Maps link for the tap-through.
 */
export default function LocatorMap({ x, y, z = 130 }: { x: number; y: number; z?: number }) {
  const span = z * 2;
  const minX = Math.max(0, Math.min(VB_W - span, x - z));
  const minY = Math.max(0, Math.min(VB_H - span, y - z));
  return (
    <svg className="im-loc-svg" viewBox={`${minX} ${minY} ${span} ${span}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {COUNTRIES.map((c) => (
        <path key={c.id} d={c.path} fill={c.fill} fillOpacity={0.16} stroke={c.fill} strokeOpacity={0.5} strokeWidth={1.5} />
      ))}
      <circle cx={x} cy={y} r={11} fill="var(--pink, #e8718b)" stroke="#fff" strokeWidth={3.5} />
    </svg>
  );
}
