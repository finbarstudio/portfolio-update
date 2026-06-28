"use client";

import { useEffect, useState } from "react";
import { mapsUrl, type Stop, type StopDates, type Country, type DoItem } from "@/content/imogen";
import LoopTable from "./LoopTable";

/**
 * StopCard — a stop in the trip, as a two-level accordion. The stop itself is
 * collapsed to a header (so the trip reads as a list you can scan); tap to open.
 * Inside, items (the hostel(s) + things to do) are grouped by category, each
 * collapsed to a title with the map link right-aligned; tap to expand the detail.
 * Filter chips show one category at a time. Each item is colour-coded by how
 * strongly it's recommended (rec / rating). Tapping a map pin opens the matching
 * stop via the URL hash.
 */

const COUNTRY_CLASS: Record<Country, string> = {
  Thailand: "c-thailand",
  Laos: "c-laos",
  Vietnam: "c-vietnam",
};

type Cat = "Hostel" | "Day" | "Food" | "Night";
const CAT_ORDER: Cat[] = ["Hostel", "Day", "Food", "Night"];
const catOf = (k: DoItem["kind"]): Cat => (k === "food" ? "Food" : k === "night" ? "Night" : "Day");

type UItem = {
  cat: Cat;
  title: string;
  maps?: string;
  url?: string;
  book?: string;
  note?: string;
  room?: string;
  rec?: "must" | "low";
  rating?: number;
};

function recLevel(rec?: "must" | "low", rating?: number): "must" | "low" | "mid" {
  if (rec === "must" || (rating != null && rating >= 9)) return "must";
  if (rec === "low" || (rating != null && rating <= 6)) return "low";
  return "mid";
}

export default function StopCard({ stop, dates, badge }: { stop: Stop; dates?: StopDates; badge: string }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Cat | "All">("All");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Open this stop when a map pin (or any #stop-<id> link) targets it.
  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined" && window.location.hash === `#stop-${stop.id}`) setOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [stop.id]);

  const isTravel = stop.kind === "travel";
  const dateStr = dates
    ? `≈ ${dates.from} – ${dates.to} · ${
        dates.nights != null
          ? `${dates.nights} ${dates.nights === 1 ? "night" : "nights"}`
          : `${dates.days} days on the move`
      }`
    : null;

  const hostels = stop.hostels ?? (stop.hostel ? [stop.hostel] : []);
  const items: UItem[] = [
    ...hostels.map((h): UItem => ({ cat: "Hostel", title: h.name, maps: h.maps, book: h.url, note: h.note, room: h.room, rec: h.rec, rating: h.rating })),
    ...(stop.dos ?? []).map((d): UItem => ({ cat: catOf(d.kind), title: d.name, maps: d.maps, url: d.url, note: d.note, rec: d.rec, rating: d.rating })),
  ];
  const cats = CAT_ORDER.filter((c) => items.some((i) => i.cat === c));
  const shown = filter === "All" ? items : items.filter((i) => i.cat === filter);
  const groups = CAT_ORDER.map((c) => ({ c, list: shown.filter((i) => i.cat === c) })).filter((g) => g.list.length);

  return (
    <article id={`stop-${stop.id}`} className={`im-stop ${COUNTRY_CLASS[stop.country]} ${isTravel ? "is-travel" : ""} ${open ? "is-open" : ""}`}>
      <button className="im-stop-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="im-stop-num">{badge}</span>
        <span className="im-stop-headtext">
          <span className="im-stop-name">{stop.name}</span>
          <span className="im-stop-meta">
            <span className="im-stop-country">{stop.country}</span>
            {stop.side ? (
              <>
                <span className="im-stop-side">{stop.sideLabel ?? "Side trip"}</span>
                {stop.sideNote && <span className="im-stop-dates">{stop.sideNote}</span>}
              </>
            ) : (
              dateStr && <span className="im-stop-dates">{dateStr}</span>
            )}
          </span>
        </span>
        <span className="im-stop-chev" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="im-stop-body">
          <p className="im-stop-blurb">{stop.blurb}</p>

          {stop.id === "ha-giang" && (
            <div className="im-block">
              <div className="im-block-label">Which hostel to book with</div>
              <LoopTable />
            </div>
          )}

          {items.length > 0 && (
            <div className="im-block">
              {cats.length > 1 && (
                <div className="im-filters">
                  <button className={`im-filter ${filter === "All" ? "is-active" : ""}`} onClick={() => setFilter("All")}>All</button>
                  {cats.map((c) => (
                    <button key={c} className={`im-filter ${filter === c ? "is-active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
                  ))}
                </div>
              )}

              {groups.map((g) => (
                <div className="im-grp" key={g.c}>
                  <div className="im-grp-label">{g.c}</div>
                  <div className="im-items">
                    {g.list.map((it, i) => {
                      const key = `${g.c}-${i}`;
                      const isOpen = !!openItems[key];
                      const lvl = recLevel(it.rec, it.rating);
                      return (
                        <div className={`im-item rec-${lvl} ${isOpen ? "is-open" : ""}`} key={key}>
                          <div className="im-item-row">
                            <button
                              className="im-item-toggle"
                              onClick={() => setOpenItems((s) => ({ ...s, [key]: !s[key] }))}
                              aria-expanded={isOpen}
                            >
                              <span className="im-item-dot" aria-hidden="true" />
                              <span className="im-item-title">{it.title}</span>
                            </button>
                            {it.maps && (
                              <a className="im-item-map" href={mapsUrl(it.maps)} target="_blank" rel="noopener noreferrer">
                                Map ↗
                              </a>
                            )}
                          </div>
                          {isOpen && (
                            <div className="im-item-detail">
                              {it.room && <span className="im-stay-room">{it.room}</span>}
                              {it.note && <p className="im-item-note">{it.note}</p>}
                              {(it.book || it.url) && (
                                <div className="im-item-links">
                                  {it.book && (
                                    <a className="im-linkbtn is-primary" href={it.book} target="_blank" rel="noopener noreferrer">
                                      Book on Hostelworld
                                    </a>
                                  )}
                                  {it.url && (
                                    <a className="im-linkbtn is-quiet" href={it.url} target="_blank" rel="noopener noreferrer">
                                      Open ↗
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
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
        </div>
      )}
    </article>
  );
}
