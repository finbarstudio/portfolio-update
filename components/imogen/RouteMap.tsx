import { route, type Country } from "@/content/imogen";
import { COUNTRIES, LABELS, VB_W, VB_H } from "./geo";

/**
 * RouteMap — the big map. Stylised mainland SE Asia (Thailand / Laos / Vietnam,
 * with Cambodia as muted context) drawn from shared outlines in geo.ts, with the
 * trip route drawn through numbered pins. Pins for stops that have a card link to
 * it (#stop-<id>); planned stops are dashed outlines; side trips (Pai) hang off
 * their parent on a dashed spur. Pins are HTML overlaid on the SVG for easy taps.
 */

const COUNTRY_CLASS: Record<Country, string> = {
  Thailand: "c-thailand",
  Laos: "c-laos",
  Vietnam: "c-vietnam",
};

export default function RouteMap() {
  // The spine = main-line stops (side trips are spurs). First spine leg
  // (Chiang Mai → Luang Prabang) is the slow boat, so it's drawn dashed.
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

  return (
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
        const flip = p.flip ?? p.x > 440;
        const planned = !p.detailed && !p.side && !p.waypoint;
        const cls = `im-pin ${COUNTRY_CLASS[p.country]} ${planned ? "is-planned" : ""} ${p.side ? "is-side" : ""} ${p.waypoint ? "is-waypoint" : ""} ${flip ? "flip" : ""}`;
        const inner = (
          <>
            <span className="im-pin-dot">{p.side || p.waypoint ? "" : p.n}</span>
            <span className="im-pin-name">{p.name}</span>
          </>
        );
        return p.detailed ? (
          <a key={p.id} className={cls} style={{ left, top }} href={`#stop-${p.id}`} aria-label={`Jump to ${p.name}`}>
            {inner}
          </a>
        ) : (
          <div key={p.id} className={cls} style={{ left, top }}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
