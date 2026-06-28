import { stops, trip, COUNTRY_FLAG, type Country } from "@/content/imogen";

/**
 * TripGraph — the trip as one continuous line. Each place is a segment sized by
 * its nights (coloured by country, with the night count on it); travel legs are
 * blue segments sized by days, sitting where they actually happen. Country labels
 * sit off the bar on a leader line, alternating above/below to give them room.
 * Dates bookend the bar.
 */
const COUNTRY_CLASS: Record<Country, string> = {
  Thailand: "c-thailand",
  Laos: "c-laos",
  Vietnam: "c-vietnam",
};
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (iso: string) => {
  const d = new Date(iso + "T00:00:00Z");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
};
const addDays = (iso: string, n: number) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

type Seg =
  | { id: string; kind: "place"; country: Country; span: number }
  | { id: string; kind: "travel"; span: number };

export default function TripGraph() {
  const segs: Seg[] = stops
    .filter((s) => (s.nights ?? s.days) != null)
    .map((s) =>
      s.kind === "place"
        ? { id: s.id, kind: "place", country: s.country, span: s.nights ?? 0 }
        : { id: s.id, kind: "travel", span: s.days ?? 0 },
    );
  const total = segs.reduce((a, s) => a + s.span, 0) || 1;

  let acc = 0;
  const placed = segs.map((s) => {
    const start = acc;
    acc += s.span;
    return { ...s, start };
  });

  const order: Country[] = ["Thailand", "Laos", "Vietnam"];
  const groups = order
    .map((c) => {
      const arr = placed.filter((p): p is typeof p & { kind: "place" } => p.kind === "place" && p.country === c);
      if (!arr.length) return null;
      const start = arr[0].start;
      const last = arr[arr.length - 1];
      const end = last.start + last.span;
      const nights = arr.reduce((a, p) => a + p.span, 0);
      const places = stops.filter((s) => s.kind === "place" && s.country === c && s.nights).map((s) => s.name);
      return { country: c, midPct: ((start + (end - start) / 2) / total) * 100, nights, places };
    })
    .filter((g): g is NonNullable<typeof g> => g != null);

  const above = groups.filter((_, i) => i % 2 === 0);
  const below = groups.filter((_, i) => i % 2 === 1);

  const Cap = ({ g, below: isBelow }: { g: (typeof groups)[number]; below?: boolean }) => (
    <div
      className={`im-tl-cap ${isBelow ? "is-below" : "is-above"} ${COUNTRY_CLASS[g.country]}`}
      style={{ left: `${g.midPct}%` }}
    >
      {isBelow && <span className="im-tl-lead" />}
      <span className="im-tl-cap-text">
        <b className="im-tl-cap-name">
          {COUNTRY_FLAG[g.country]} {g.country} · {g.nights}n
        </b>
        <span className="im-tl-cap-places">{g.places.join(", ")}</span>
      </span>
      {!isBelow && <span className="im-tl-lead" />}
    </div>
  );

  return (
    <div className="im-tl">
      <div className="im-tl-track">
        <div className="im-tl-side is-above">{above.map((g) => <Cap key={g.country} g={g} />)}</div>

        <div className="im-tl-bar">
          {placed.map((s) => (
            <span
              key={s.id}
              className={`im-tl-seg ${s.kind === "place" ? COUNTRY_CLASS[s.country] : "is-travel"}`}
              style={{ flexGrow: s.span }}
              title={s.kind === "travel" ? `${s.span} on the move` : `${s.span} nights`}
            >
              <span className="im-tl-seg-n">{s.span}</span>
            </span>
          ))}
        </div>

        <div className="im-tl-side is-below">{below.map((g) => <Cap key={g.country} g={g} below />)}</div>
      </div>

      <div className="im-tl-dates">
        <span>{fmt(trip.start)}</span>
        <span>{fmt(addDays(trip.start, total))}</span>
      </div>

      <div className="im-tl-key">
        <span className="im-tl-keyitem">
          <span className="im-tl-keydot is-travel" aria-hidden="true" /> On the move
        </span>
        <span className="im-tl-keyitem">the number on each block is nights (or travel days)</span>
      </div>
    </div>
  );
}
