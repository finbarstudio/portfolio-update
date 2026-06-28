import { route, stops, type Country, type RoutePoint } from "@/content/imogen";
import { COUNTRIES, LABELS, VB_W, VB_H, project } from "./geo";

// Stops rated 9 or 10 get a star on their pin + in the legend.
const TOP_IDS = new Set(stops.filter((s) => s.rating != null && s.rating >= 9).map((s) => s.id));

/**
 * RouteMap — the big map, drawn on Finbar's traced SE Asia outlines (geo.ts /
 * sea-geo.ts). Pins are projected from real lon/lat by project(). To stay
 * uncluttered they're numbered DOTS only; a tappable legend underneath names
 * them. Spine stops are numbered, side trips (Pai, Ha Giang) are ↗ spurs,
 * Vientiane is a small pass-through dot, faded numbered dots are still-to-write.
 */

const COUNTRY_CLASS: Record<Country, string> = {
  Thailand: "c-thailand",
  Laos: "c-laos",
  Vietnam: "c-vietnam",
};

const markerClass = (p: RoutePoint) => {
  const planned = !p.detailed && !p.side && !p.waypoint;
  return `${COUNTRY_CLASS[p.country]} ${planned ? "is-planned" : ""} ${p.side ? "is-side" : ""} ${p.waypoint ? "is-waypoint" : ""}`;
};
const markerText = (p: RoutePoint) => (p.side ? "↗" : p.waypoint ? "" : p.n);

export default function RouteMap() {
  const linePts = route.filter((p) => !p.side).map((p) => project(p.lon, p.lat));
  const lineD = "M" + linePts.map((p) => `${p.x},${p.y}`).join(" L");

  return (
    <div className="im-map-wrap">
      <div className="im-map" role="img" aria-label="Map of the route through Thailand, Laos and Vietnam">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} xmlns="http://www.w3.org/2000/svg">
          {COUNTRIES.map((c) => (
            <g key={c.id} className="im-map-country">
              {c.paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill={c.fill}
                  fillOpacity={c.id === "cambodia" ? 0.12 : 0.16}
                  stroke={c.fill}
                  strokeOpacity={c.id === "cambodia" ? 0.35 : 0.5}
                />
              ))}
            </g>
          ))}

          {LABELS.map((l) => {
            const { x, y } = project(l.lon, l.lat);
            return (
              <text
                key={l.t}
                className={`im-map-label ${l.muted ? "is-muted" : ""}`}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={l.muted ? 2.1 : 2.6}
                letterSpacing={0.35}
              >
                {l.t}
              </text>
            );
          })}

          <path className="im-map-route" d={lineD} />
        </svg>

        {route.map((p) => {
          const { x, y } = project(p.lon, p.lat);
          const left = `${(x / VB_W) * 100}%`;
          const top = `${(y / VB_H) * 100}%`;
          const isTop = TOP_IDS.has(p.id);
          const cls = `im-pin ${markerClass(p)} ${isTop ? "is-top" : ""}`;
          const dot = (
            <span className="im-pin-dot">
              {markerText(p)}
              {isTop && <span className="im-pin-star" aria-hidden="true">★</span>}
            </span>
          );
          return p.detailed ? (
            <a key={p.id} className={cls} style={{ left, top }} href={`#stop-${p.id}`} aria-label={p.name}>
              {dot}
            </a>
          ) : (
            <span key={p.id} className={cls} style={{ left, top }} aria-label={p.name}>
              {dot}
            </span>
          );
        })}
      </div>

      <ul className="im-map-legend">
        {route.map((p) => {
          const inner = (
            <>
              <span className={`im-leg-dot ${markerClass(p)}`}>{markerText(p)}</span>
              {p.name}
              {TOP_IDS.has(p.id) && <span className="im-leg-star" aria-hidden="true">★</span>}
            </>
          );
          return (
            <li key={p.id}>
              {p.detailed ? (
                <a href={`#stop-${p.id}`} className="im-leg-link">
                  {inner}
                </a>
              ) : (
                <span className="im-leg-link is-static">{inner}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
