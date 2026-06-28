import { stops, trip, COUNTRY_FLAG, type Country, type Stop } from "@/content/imogen";

/**
 * TripGraph — the trip as one continuous line FIXED to the real trip length
 * (trip.start → trip.end). Place nights fill it from the left in their country
 * colours, grouped by country with the country named on the bar; whatever's left
 * to the end of the dates is the "on the move" segment. The legend combines the
 * nights per country.
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

  // Group consecutive places by country (the route runs Thailand → Laos → Vietnam).
  const groups: { country: Country; nights: number; places: Stop[] }[] = [];
  for (const s of places) {
    const last = groups[groups.length - 1];
    if (last && last.country === s.country) {
      last.nights += s.nights ?? 0;
      last.places.push(s);
    } else {
      groups.push({ country: s.country, nights: s.nights ?? 0, places: [s] });
    }
  }

  return (
    <div className="im-tl">
      <div className="im-tl-axis">
        {groups.map((g) => (
          <div key={g.country} className={`im-tl-axis-item ${COUNTRY_CLASS[g.country]}`} style={{ flexGrow: g.nights }}>
            <span className="im-tl-axis-country">{COUNTRY_FLAG[g.country]} {g.country} · {g.nights}n</span>
            <span className="im-tl-axis-places">{g.places.map((p) => p.name).join(", ")}</span>
          </div>
        ))}
        {remaining > 0 && (
          <div className="im-tl-axis-item is-rest" style={{ flexGrow: remaining }}>
            <span className="im-tl-axis-country">On the move</span>
            <span className="im-tl-axis-places">{remaining}n</span>
          </div>
        )}
      </div>

      <div className="im-tl-bar">
        {groups.map((g) => (
          <div key={g.country} className={`im-tl-group ${COUNTRY_CLASS[g.country]}`} style={{ flexGrow: g.nights }}>
            {g.places.map((s) => (
              <span
                key={s.id}
                className={`im-tl-seg ${COUNTRY_CLASS[g.country]}`}
                style={{ flexGrow: s.nights }}
                title={`${s.name} · ${s.nights} nights`}
              />
            ))}
          </div>
        ))}
        {remaining > 0 && (
          <span className="im-tl-seg is-rest" style={{ flexGrow: remaining }} title={`${remaining} nights on the move`} />
        )}
      </div>

      <p className="im-tl-total">
        {sumNights} nights across the places{remaining > 0 ? ", the blue is time on the move" : ""}, plus travel on top. That&apos;s the whole route, a bit more than your window, so trim it down to your dates.
      </p>
    </div>
  );
}
