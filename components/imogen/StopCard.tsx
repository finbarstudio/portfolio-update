import { mapsUrl, route, type Stop, type StopDates, type Country, type DoItem } from "@/content/imogen";
import LocatorMap from "./LocatorMap";
import LoopTable from "./LoopTable";
import { project } from "./geo";

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
  const loc = route.find((p) => p.id === stop.id);
  const lp = loc ? project(loc.lon, loc.lat) : null;
  const hostelList = stop.hostels ?? (stop.hostel ? [stop.hostel] : []);
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
            {stop.side ? (
              <>
                <span className="im-stop-side">Side trip</span>
                {stop.sideNote && <span className="im-stop-dates">{stop.sideNote}</span>}
              </>
            ) : (
              dateStr && <span className="im-stop-dates">{dateStr}</span>
            )}
          </div>
        </div>
      </div>

      <p className="im-stop-blurb">{stop.blurb}</p>

      {stop.id === "ha-giang" && (
        <div className="im-block">
          <div className="im-block-label">Which hostel to book with</div>
          <LoopTable />
        </div>
      )}

      {hostelList.length > 0 && (
        <div className="im-block">
          <div className="im-block-label">Stay{hostelList.length > 1 ? " · two good options" : ""}</div>
          <div className="im-stay">
            <div className="im-stay-top">
              {lp && (
                <a
                  className="im-stay-loc"
                  href={mapsUrl(hostelList[0].maps ?? `${hostelList[0].name}, ${stop.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Map of ${hostelList[0].name}`}
                >
                  <LocatorMap x={lp.x} y={lp.y} />
                </a>
              )}
              <div className="im-stay-main">
                <div className="im-stay-name">{hostelList[0].name}</div>
                {hostelList[0].room && <span className="im-stay-room">{hostelList[0].room}</span>}
              </div>
            </div>
            {hostelList[0].note && <p className="im-stay-note">{hostelList[0].note}</p>}
            <div className="im-stay-links">
              {hostelList[0].url && (
                <a className="im-linkbtn is-primary" href={hostelList[0].url} target="_blank" rel="noopener noreferrer">
                  Book on Hostelworld
                </a>
              )}
              {hostelList[0].maps && (
                <a className="im-linkbtn is-quiet" href={mapsUrl(hostelList[0].maps)} target="_blank" rel="noopener noreferrer">
                  Open in Maps
                </a>
              )}
            </div>

            {hostelList.slice(1).map((h) => (
              <div className="im-stay-opt is-more" key={h.name}>
                <div className="im-stay-name">{h.name}</div>
                {h.room && <span className="im-stay-room">{h.room}</span>}
                {h.note && <p className="im-stay-note">{h.note}</p>}
                <div className="im-stay-links">
                  {h.url && (
                    <a className="im-linkbtn is-primary" href={h.url} target="_blank" rel="noopener noreferrer">
                      Book on Hostelworld
                    </a>
                  )}
                  {h.maps && (
                    <a className="im-linkbtn is-quiet" href={mapsUrl(h.maps)} target="_blank" rel="noopener noreferrer">
                      Open in Maps
                    </a>
                  )}
                </div>
              </div>
            ))}
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
          <div className="im-block-label">{isTravel ? "Then" : stop.side ? "Getting there" : "Getting to the next place"}</div>
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
