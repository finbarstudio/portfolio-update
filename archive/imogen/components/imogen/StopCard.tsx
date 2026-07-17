"use client";

import { useEffect, useRef, useState } from "react";
import { mapsUrl, ratingColor, COUNTRY_FLAG, imgSlug, type Stop, type StopDates, type Country, type DoItem } from "@/content/imogen";
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
  links?: { label: string; url: string }[];
  note?: string;
  room?: string;
  rec?: "must" | "low";
  rating?: number;
  star?: boolean;
  imgs?: string[];
  tip?: { label: string; href: string };
};

function recLevel(rec?: "must" | "low", rating?: number): "must" | "low" | "mid" {
  // Finbar rates harsh: 6–7 is good, 9+ is amazing, 5 and under is weak.
  if (rec === "must" || (rating != null && rating >= 9)) return "must";
  if (rec === "low" || (rating != null && rating <= 5)) return "low";
  return "mid";
}

const isVideo = (src: string) => /\.mp4$/i.test(src);

function MediaThumb({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
  if (isVideo(src)) {
    return (
      <button className="im-item-thumb is-video" onClick={onClick} aria-label={`Play ${alt} video`}>
        <video src={`${src}#t=0.1`} muted playsInline preload="metadata" />
        <span className="im-thumb-play" aria-hidden="true">▶</span>
      </button>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="im-item-thumb" src={src} alt={alt} loading="lazy" onClick={onClick} />
  );
}

export default function StopCard({
  stop,
  dates,
  badge,
  stopPhotos = [],
  itemPhotos = {},
}: {
  stop: Stop;
  dates?: StopDates;
  badge: string;
  stopPhotos?: string[];
  itemPhotos?: Record<string, string[]>;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Cat | "All">("All");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<{ list: string[]; i: number } | null>(null);
  const touchStartX = useRef<number | null>(null);
  const step = (d: number) => setLightbox((l) => l && { ...l, i: (l.i + d + l.list.length) % l.list.length });

  // Arrow keys / Escape drive the full-screen image viewer.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowRight") setLightbox((l) => l && { ...l, i: (l.i + 1) % l.list.length });
      else if (e.key === "ArrowLeft") setLightbox((l) => l && { ...l, i: (l.i - 1 + l.list.length) % l.list.length });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

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
  const dateStr = dates ? `≈ ${dates.from} – ${dates.to}` : null;
  const nightsLabel = dates
    ? dates.nights != null
      ? `${dates.nights} ${dates.nights === 1 ? "night" : "nights"}`
      : `${dates.days} days moving`
    : null;

  const hostels = stop.hostels ?? (stop.hostel ? [stop.hostel] : []);
  const items: UItem[] = [
    ...hostels.map((h): UItem => ({ cat: "Hostel", title: h.name, maps: h.maps, book: h.url, note: h.note, room: h.room, rec: h.rec, rating: h.rating, imgs: itemPhotos[imgSlug(h.name)] ?? h.imgs })),
    ...(stop.dos ?? []).map((d): UItem => ({ cat: catOf(d.kind), title: d.name, maps: d.maps, url: d.url, links: d.links, note: d.note, rec: d.rec, rating: d.rating, star: d.star, imgs: itemPhotos[imgSlug(d.name)] ?? d.imgs, tip: d.tip })),
  ];
  const cats = CAT_ORDER.filter((c) => items.some((i) => i.cat === c));
  const shown = filter === "All" ? items : items.filter((i) => i.cat === filter);
  const groups = CAT_ORDER.map((c) => ({ c, list: shown.filter((i) => i.cat === c) })).filter((g) => g.list.length);

  // Keys of every currently-shown item (for "expand all" from a highlight).
  const itemKeys = groups.flatMap((g) => g.list.map((_, i) => `${g.c}-${i}`));
  const itemKeysRef = useRef<string[]>(itemKeys);
  itemKeysRef.current = itemKeys;

  // A highlight click opens this stop AND expands all its items.
  useEffect(() => {
    const onExpand = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      if (id === stop.id) {
        setOpen(true);
        setOpenItems(Object.fromEntries(itemKeysRef.current.map((k) => [k, true])));
      }
    };
    window.addEventListener("imogen:expand", onExpand);
    return () => window.removeEventListener("imogen:expand", onExpand);
  }, [stop.id]);

  return (
    <article id={`stop-${stop.id}`} className={`im-stop ${COUNTRY_CLASS[stop.country]} ${isTravel ? "is-travel" : ""} ${open ? "is-open" : ""} ${stop.rating != null && stop.rating >= 10 ? "is-top" : ""} ${stop.muted ? "is-muted" : ""}`}>
      <button className="im-stop-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="im-stop-num">{badge}</span>
        <span className="im-stop-headtext">
          <span className="im-stop-name">{stop.name}</span>
          <span className="im-stop-meta">
            <span className="im-stop-country">{COUNTRY_FLAG[stop.country]} {stop.country}</span>
            {stop.muted && <span className="im-stop-optional">optional</span>}
            {stop.rating != null && (
              <span
                className="im-stop-rating"
                style={{ background: ratingColor(stop.rating) ?? undefined, color: "#fff" }}
              >
                {stop.rating}/10
              </span>
            )}
            {stop.rating != null && stop.rating >= 9 && (
              <span className="im-top-star" aria-hidden="true">★</span>
            )}
            {stop.vibe && <span className="im-stop-vibe">{stop.vibe}</span>}
            {nightsLabel && <span className="im-stop-nights">{nightsLabel}</span>}
            {dateStr && <span className="im-stop-dates">{dateStr}</span>}
          </span>
        </span>
        <span className="im-stop-chev" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="im-stop-body">
          {stopPhotos.length > 0 && (
            <div className="im-item-thumbs im-stop-thumbs">
              {stopPhotos.map((src, i) => (
                <MediaThumb key={src} src={src} alt={stop.name} onClick={() => setLightbox({ list: stopPhotos, i })} />
              ))}
            </div>
          )}
          <p className="im-stop-blurb">{stop.blurb}</p>

          {stop.id === "ha-giang" && (
            <div className="im-block">
              <div className="im-block-label">Which hostel to book with</div>
              <LoopTable />
            </div>
          )}

          {items.length > 0 && (
            <div className="im-block">
              <p className="im-tap-hint">Tap any item below for the notes, photos &amp; map ↓</p>
              {cats.length > 1 && (
                <div className="im-filters">
                  <span className="im-filter-label">Show</span>
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
                        <div className={`im-item rec-${lvl} ${it.star ? "is-star" : ""} ${(it.star || (it.rating != null && it.rating >= 10)) ? "is-top" : ""} ${isOpen ? "is-open" : ""}`} key={key}>
                          <div className="im-item-row">
                            <button
                              className="im-item-toggle"
                              onClick={() => setOpenItems((s) => ({ ...s, [key]: !s[key] }))}
                              aria-expanded={isOpen}
                            >
                              <span
                                className={`im-item-score ${it.star || (it.rating != null && it.rating >= 10) ? "is-topstar" : ""} ${it.rating == null && !it.star ? "is-empty" : ""}`}
                                style={
                                  it.star || (it.rating != null && it.rating >= 10)
                                    ? undefined
                                    : it.rating != null
                                      ? { background: ratingColor(it.rating) ?? undefined, color: "#fff" }
                                      : undefined
                                }
                                aria-hidden="true"
                              >
                                {it.star || (it.rating != null && it.rating >= 10) ? "" : it.rating != null ? it.rating : ""}
                              </span>
                              <span className="im-item-title">{it.title}</span>
                            </button>
                            {it.maps && (
                              <a className="im-item-map" href={mapsUrl(it.maps)} target="_blank" rel="noopener noreferrer">
                                Map ↗
                              </a>
                            )}
                            <button
                              className="im-item-chev"
                              onClick={() => setOpenItems((s) => ({ ...s, [key]: !s[key] }))}
                              aria-label={isOpen ? "Collapse" : "Expand"}
                              aria-expanded={isOpen}
                            >
                              {isOpen ? "▾" : "▸"}
                            </button>
                          </div>
                          {isOpen && (
                            <div className="im-item-detail">
                              {it.room && <span className="im-stay-room">{it.room}</span>}
                              {it.note && <p className="im-item-note">{it.note}</p>}
                              {it.tip && (
                                <a className="im-item-tiplink" href={it.tip.href}>
                                  ↑ {it.tip.label}
                                </a>
                              )}
                              {it.imgs && it.imgs.length > 0 && (
                                <div className="im-item-thumbs">
                                  {it.imgs.map((src, idx) => (
                                    <MediaThumb key={src} src={src} alt={it.title} onClick={() => setLightbox({ list: it.imgs!, i: idx })} />
                                  ))}
                                </div>
                              )}
                              {(it.book || it.url || it.links?.length) && (
                                <div className="im-item-links">
                                  {it.book && (
                                    <a className="im-linkbtn is-primary" href={it.book} target="_blank" rel="noopener noreferrer">
                                      {it.book.includes("booking.com") ? "Book on Booking.com" : "Book on Hostelworld"} ↗
                                    </a>
                                  )}
                                  {it.url && (
                                    <a className="im-linkbtn is-quiet" href={it.url} target="_blank" rel="noopener noreferrer">
                                      Open ↗
                                    </a>
                                  )}
                                  {it.links?.map((l) => (
                                    <a key={l.url} className="im-linkbtn is-quiet" href={l.url} target="_blank" rel="noopener noreferrer">
                                      {l.label} ↗
                                    </a>
                                  ))}
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

      {lightbox && (
        <div
          className="im-lightbox"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX.current == null || lightbox.list.length < 2) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
            touchStartX.current = null;
          }}
        >
          {isVideo(lightbox.list[lightbox.i]) ? (
            <video
              key={lightbox.list[lightbox.i]}
              src={lightbox.list[lightbox.i]}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lightbox.list[lightbox.i]} alt="" onClick={(e) => e.stopPropagation()} />
          )}
          {lightbox.list.length > 1 && (
            <>
              <button
                className="im-lightbox-nav is-prev"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((l) => l && { ...l, i: (l.i - 1 + l.list.length) % l.list.length });
                }}
              >
                ‹
              </button>
              <button
                className="im-lightbox-nav is-next"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((l) => l && { ...l, i: (l.i + 1) % l.list.length });
                }}
              >
                ›
              </button>
              <span className="im-lightbox-count">
                {lightbox.i + 1} / {lightbox.list.length}
              </span>
            </>
          )}
          <button className="im-lightbox-close" aria-label="Close">✕</button>
        </div>
      )}
    </article>
  );
}
