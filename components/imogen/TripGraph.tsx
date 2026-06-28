import { stops, type Country } from "@/content/imogen";

/**
 * TripGraph — the trip as one continuous line, split into places by how many
 * nights you spend in each. The bar shows the split; a wrapping legend names the
 * segments (so it scales to lots of stops without the labels colliding). Spine
 * place-stops only; side trips (Pai, Ha Giang, Sapa, Halong) sit on top and
 * travel days aren't counted.
 */
const COUNTRY_CLASS: Record<Country, string> = {
  Thailand: "c-thailand",
  Laos: "c-laos",
  Vietnam: "c-vietnam",
};

export default function TripGraph() {
  const places = stops.filter((s) => s.kind === "place" && !s.side && s.nights);
  const total = places.reduce((a, s) => a + (s.nights ?? 0), 0);

  return (
    <div className="im-tl">
      <div className="im-tl-bar">
        {places.map((s) => (
          <span
            key={s.id}
            className={`im-tl-seg ${COUNTRY_CLASS[s.country]}`}
            style={{ flexGrow: s.nights }}
            title={`${s.name} · ${s.nights} nights`}
          />
        ))}
      </div>
      <div className="im-tl-legend">
        {places.map((s) => (
          <span key={s.id} className={`im-tl-key ${COUNTRY_CLASS[s.country]}`}>
            <span className="im-tl-key-dot" aria-hidden="true" />
            <span className="im-tl-key-name">{s.name}</span>
            <span className="im-tl-key-n">{s.nights}n</span>
          </span>
        ))}
      </div>
      <p className="im-tl-total">
        {total} nights so far · Pai, plus Ha Giang, Sapa and Halong up north, sit on top of this
      </p>
    </div>
  );
}
