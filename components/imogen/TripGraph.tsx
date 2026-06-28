import { stops, type Country } from "@/content/imogen";

/**
 * TripGraph — a quick bar chart of nights per place, so the pacing of the trip
 * is easy to eyeball. Place stops only (travel legs aren't a "place"); side
 * trips show as a faded bar since their length is still open.
 */
const COUNTRY_CLASS: Record<Country, string> = {
  Thailand: "c-thailand",
  Laos: "c-laos",
  Vietnam: "c-vietnam",
};

export default function TripGraph() {
  const places = stops.filter((s) => s.kind === "place");
  const max = Math.max(...places.map((s) => s.nights ?? 3));

  return (
    <div className="im-graph">
      {places.map((s) => {
        const n = s.nights;
        const width = ((n ?? 2.5) / max) * 100;
        return (
          <div className={`im-graph-row ${COUNTRY_CLASS[s.country]}`} key={s.id}>
            <div className="im-graph-head">
              <span className="im-graph-name">{s.name}</span>
              <span className="im-graph-val">
                {s.side ? "side trip" : `${n} ${n === 1 ? "night" : "nights"}`}
              </span>
            </div>
            <span className="im-graph-track">
              <span className={`im-graph-bar ${s.side ? "is-side" : ""}`} style={{ width: `${width}%` }} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
