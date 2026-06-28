import { stops, trip, type Country } from "@/content/imogen";

/**
 * TripGraph — the trip as one continuous line FIXED to the real trip length
 * (trip.start → trip.end). Place nights fill it from the left in their country
 * colours; whatever's left to the end of the dates is grey (still open). A
 * wrapping legend names the segments. Side trips (Pai, Ha Giang, Sapa, Halong)
 * and travel days sit on top of this and aren't counted in the fill.
 */
const COUNTRY_CLASS: Record<Country, string> = {
  Thailand: "c-thailand",
  Laos: "c-laos",
  Vietnam: "c-vietnam",
};

export default function TripGraph() {
  const places = stops.filter((s) => s.kind === "place" && !s.side && s.nights);
  const sumNights = places.reduce((a, s) => a + (s.nights ?? 0), 0);
  const totalDays = Math.max(
    sumNights,
    Math.round((Date.parse(trip.end) - Date.parse(trip.start)) / 86_400_000)
  );
  const remaining = Math.max(0, totalDays - sumNights);

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
        {remaining > 0 && (
          <span className="im-tl-seg is-rest" style={{ flexGrow: remaining }} title={`${remaining} nights still open`} />
        )}
      </div>
      <div className="im-tl-legend">
        {places.map((s) => (
          <span key={s.id} className={`im-tl-key ${COUNTRY_CLASS[s.country]}`}>
            <span className="im-tl-key-dot" aria-hidden="true" />
            <span className="im-tl-key-name">{s.name}</span>
            <span className="im-tl-key-n">{s.nights}n</span>
          </span>
        ))}
        {remaining > 0 && (
          <span className="im-tl-key is-rest">
            <span className="im-tl-key-dot" aria-hidden="true" />
            <span className="im-tl-key-name">On the move</span>
            <span className="im-tl-key-n">{remaining}n</span>
          </span>
        )}
      </div>
      <p className="im-tl-total">
        {sumNights} nights across the places{remaining > 0 ? ", the blue is time on the move" : ""}, plus travel on top. That&apos;s the whole route, a bit more than your window, so trim it down to your dates.
      </p>
    </div>
  );
}
