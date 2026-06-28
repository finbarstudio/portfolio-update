import { route, type Country } from "@/content/imogen";
import { COUNTRIES, LABELS, VB_W, VB_H } from "./geo";

/**
 * RouteMap — the big map. Stylised mainland SE Asia (Thailand / Laos / Vietnam,
 * Cambodia muted) from shared outlines in geo.ts, with the route through pins.
 * To keep it uncluttered the pins are just numbered DOTS (no labels on the map);
 * a tappable legend underneath names them. Spine stops are numbered; side trips
 * (Pai, Ha Giang) are ↗ spurs; Vientiane is a small pass-through dot; the faded
 * numbered dots are stops still being written.
 */

const COUNTRY_CLASS: Record<Country, string> = {
  Thailand: "c-thailand",
  Laos: "c-laos",
  Vietnam: "c-vietnam",
};

export default function RouteMap() {
  const spine = route.filter((p) => !p.side);
  const boatD = `M${spine[0].x},${spine[0].y} L${spine[1].x},${spine[1].y}`;
  const roadD = "M" + spine.slice(1).map((p) => `${p.x},${p.y}`).join(" L");
  const spurs = route
    .filter((p) => p.side && p.from)
    .map((p) => {
      const parent = route.find((q) => q.id === p.from);
      return parent ? `M${parent.x},${parent.y} L${p.x},${p.y}` : null;
    })
    .filter((d): d is string => d !== null);

  const markerClass = (p: (typeof route)[number]) => {
    const planned = !p.detailed && !p.side && !p.waypoint;
    return `${COUNTRY_CLASS[p.country]} ${planned ? "is-planned" : ""} ${p.side ? "is-side" : ""} ${p.waypoint ? "is-waypoint" : ""}`;
  };
  const markerText = (p: (typeof route)[number]) => (p.side ? "↗" : p.waypoint ? "" : p.n);

  return (
    <div className="im-map-wrap">
      <div className="im-map" role="img" aria-label="Map of the route through Thailand, Laos and Vietnam">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} xmlns="http://www.w3.org/2000/svg">
          {COUNTRIES.map((c) => (
            <path
              key={c.id}
              className="im-map-country"
              d={c.path}
              fill={c.fill}
              fillOpacity={c.id === "cambodia" ? 0.1 : 0.15}
              stroke={c.fill}
              strokeOpacity={c.id === "cambodia" ? 0.3 : 0.45}
            />
          ))}
          {LABELS.map((l) => (
            <text key={l.t} className={`im-map-label ${l.muted ? "is-muted" : ""}`} x={l.x} y={l.y} textAnchor="middle">
              {l.t}
            </text>
          ))}
          <path className="im-map-route" d={roadD} />
          <path className="im-map-route is-boat" d={boatD} />
          {spurs.map((d, i) => (
            <path key={i} className="im-map-route is-boat" d={d} />
          ))}
        </svg>

        {route.map((p) => {
          const left = `${(p.x / VB_W) * 100}%`;
          const top = `${(p.y / VB_H) * 100}%`;
          const cls = `im-pin ${markerClass(p)}`;
          const dot = <span className="im-pin-dot">{markerText(p)}</span>;
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
