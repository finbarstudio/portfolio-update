import { route, type Country } from "@/content/imogen";

/**
 * RouteMap — a stylised map of mainland SE Asia (Thailand / Laos / Vietnam) with
 * the trip route drawn through numbered pins. Pins for stops that have a card
 * link to it (#stop-<id>); planned stops are shown as dashed outlines.
 *
 * The country shapes are hand-simplified (no real geo data in the repo) and
 * easy to swap later. Coordinates live in content/imogen.ts in this 600×800
 * viewBox. Pins are HTML overlaid on the SVG so they're easy to tap + style.
 */

const VB_W = 600;
const VB_H = 800;

const COUNTRY_CLASS: Record<Country, string> = {
  Thailand: "c-thailand",
  Laos: "c-laos",
  Vietnam: "c-vietnam",
};
const COUNTRY_FILL: Record<Country, string> = {
  Thailand: "var(--c-thailand)",
  Laos: "var(--c-laos)",
  Vietnam: "var(--c-vietnam)",
};

// Simplified country outlines.
const THAILAND =
  "M120,175 C150,168 172,186 182,214 C192,242 188,270 180,296 C172,322 178,350 172,378 C168,400 176,430 162,452 C152,468 150,492 142,520 C136,540 120,552 112,536 C104,520 112,498 108,476 C104,452 92,442 88,418 C84,394 96,380 90,356 C84,330 72,318 74,292 C76,262 86,232 96,210 C104,192 104,182 120,175 Z";
const LAOS =
  "M150,150 C175,135 205,142 232,158 C260,175 280,196 300,220 C318,242 330,266 332,292 C334,316 322,332 300,330 C276,328 262,308 244,290 C224,270 206,256 188,238 C170,220 156,206 148,186 C142,170 140,160 150,150 Z";
const VIETNAM =
  "M352,96 C372,86 398,104 410,128 C424,150 432,166 440,186 C452,214 452,238 456,266 C462,298 460,330 462,360 C476,372 486,388 482,406 C500,452 516,506 520,556 C522,588 512,620 486,648 C462,672 430,694 404,700 C384,704 372,690 374,668 C376,644 392,628 398,604 C406,572 410,540 430,508 C444,484 446,456 440,430 C434,402 428,384 426,360 C424,330 420,300 404,276 C388,252 366,236 352,212 C338,188 330,160 332,138 C334,116 338,104 352,96 Z";

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
        <path className="im-map-country" d={THAILAND} fill={COUNTRY_FILL.Thailand} fillOpacity={0.15} stroke={COUNTRY_FILL.Thailand} strokeOpacity={0.45} />
        <path className="im-map-country" d={LAOS} fill={COUNTRY_FILL.Laos} fillOpacity={0.15} stroke={COUNTRY_FILL.Laos} strokeOpacity={0.45} />
        <path className="im-map-country" d={VIETNAM} fill={COUNTRY_FILL.Vietnam} fillOpacity={0.15} stroke={COUNTRY_FILL.Vietnam} strokeOpacity={0.45} />

        <text className="im-map-label" x="95" y="515" textAnchor="middle">THAILAND</text>
        <text className="im-map-label" x="238" y="300" textAnchor="middle">LAOS</text>
        <text className="im-map-label" x="452" y="250" textAnchor="middle">VIETNAM</text>

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
        const cls = `im-pin ${COUNTRY_CLASS[p.country]} ${p.detailed ? "" : "is-planned"} ${p.side ? "is-side" : ""} ${flip ? "flip" : ""}`;
        const inner = (
          <>
            <span className="im-pin-dot">{p.side ? "" : p.n}</span>
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
