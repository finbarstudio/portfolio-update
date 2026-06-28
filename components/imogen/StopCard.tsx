import { mapsUrl, type Stop, type StopDates, type Country, type DoItem } from "@/content/imogen";

const COUNTRY_CLASS: Record<Country, string> = {
  Thailand: "c-thailand",
  Laos: "c-laos",
  Vietnam: "c-vietnam",
};

function doTag(kind: DoItem["kind"]) {
  if (kind === "food") return <span className="im-tagword im-tag-food">Eat</span>;
  if (kind === "night") return <span className="im-tagword im-tag-night">Night</span>;
  if (kind === "optional") return <span className="im-tagword im-tag-optional">If you can</span>;
  return null;
}

export default function StopCard({
  stop,
  dates,
  badge,
}: {
  stop: Stop;
  dates?: StopDates;
  badge: string;
}) {
  const isTravel = stop.kind === "travel";
  const dateStr = dates
    ? `≈ ${dates.from} – ${dates.to} · ${
        dates.nights != null
          ? `${dates.nights} ${dates.nights === 1 ? "night" : "nights"}`
          : `${dates.days} days on the move`
      }`
    : null;

  return (
    <article id={`stop-${stop.id}`} className={`im-stop ${COUNTRY_CLASS[stop.country]} ${isTravel ? "is-travel" : ""}`}>
      <div className="im-stop-head">
        <span className="im-stop-num">{badge}</span>
        <div className="im-stop-headtext">
          <h3 className="im-stop-name">{stop.name}</h3>
          <div className="im-stop-meta">
            <span className="im-stop-country">{stop.country}</span>
            {dateStr && <span className="im-stop-dates">{dateStr}</span>}
          </div>
        </div>
      </div>

      <p className="im-stop-blurb">{stop.blurb}</p>

      {stop.hostel && (
        <div className="im-block">
          <div className="im-block-label">Stay</div>
          <div className="im-stay">
            <div className="im-stay-name">{stop.hostel.name}</div>
            {stop.hostel.room && <span className="im-stay-room">{stop.hostel.room}</span>}
            {stop.hostel.note && <p className="im-stay-note">{stop.hostel.note}</p>}
            <div className="im-stay-links">
              {stop.hostel.url && (
                <a className="im-linkbtn is-primary" href={stop.hostel.url} target="_blank" rel="noopener noreferrer">
                  Book on Hostelworld
                </a>
              )}
              {stop.hostel.maps && (
                <a className="im-linkbtn is-quiet" href={mapsUrl(stop.hostel.maps)} target="_blank" rel="noopener noreferrer">
                  Map
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {stop.dos && stop.dos.length > 0 && (
        <div className="im-block">
          <div className="im-block-label">Do</div>
          <div className="im-dos">
            {stop.dos.map((d) => (
              <div className="im-do" key={d.name}>
                <span className="im-do-mark" aria-hidden="true">›</span>
                <div className="im-do-body">
                  <div className="im-do-name">
                    {d.name}
                    {doTag(d.kind)}
                  </div>
                  {d.note && <p className="im-do-note">{d.note}</p>}
                  {(d.maps || d.url) && (
                    <div className="im-do-links">
                      {d.maps && (
                        <a className="im-linkbtn is-quiet" href={mapsUrl(d.maps)} target="_blank" rel="noopener noreferrer">
                          Map
                        </a>
                      )}
                      {d.url && (
                        <a className="im-linkbtn is-quiet" href={d.url} target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stop.leg && (
        <div className="im-leg">
          <div className="im-block-label">{isTravel ? "Then" : "Getting to the next place"}</div>
          <div className="im-leg-to">{stop.leg.to}</div>
          <p className="im-leg-mode">{stop.leg.mode}</p>
          {(stop.leg.app || stop.leg.appUrl) &&
            (stop.leg.appUrl ? (
              <p className="im-leg-mode">
                <a className="im-linkbtn is-quiet" href={stop.leg.appUrl} target="_blank" rel="noopener noreferrer">
                  {stop.leg.app ?? "Book it"}
                </a>
              </p>
            ) : (
              stop.leg.app && <p className="im-leg-note">{stop.leg.app}</p>
            ))}
          {stop.leg.note && <p className="im-leg-note">{stop.leg.note}</p>}
        </div>
      )}
    </article>
  );
}
