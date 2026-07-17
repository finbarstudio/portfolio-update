import fs from "node:fs";
import path from "node:path";
import {
  trip,
  apps,
  tips,
  wishlist,
  safety,
  stops,
  buildItinerary,
  tripDateLabel,
  getHighlights,
  imgSlug,
  PHOTO_ALIASES,
} from "@/content/imogen";
import RouteMap from "@/components/imogen/RouteMap";
import TripGraph from "@/components/imogen/TripGraph";
import StopCard from "@/components/imogen/StopCard";
import Highlights from "@/components/imogen/Highlights";
import CollapsibleSection from "@/components/imogen/CollapsibleSection";
import MapFab from "@/components/imogen/MapFab";
import Reveal from "@/components/imogen/Reveal";

// Photos Finbar drops in public/imogen are auto-detected and take priority over
// searched images. Each subfolder is named after a place or activity; its web
// images (jpg/png/webp/avif — HEIC/MOV can't show in a browser) attach there.
// Matching is by name; anything that doesn't match auto-resolves via PHOTO_ALIASES.
const WEB_IMG = /\.(jpe?g|png|webp|avif|mp4)$/i;

type PhotoIndex = {
  stops: Record<string, string[]>; // stopId -> place photos
  items: Record<string, Record<string, string[]>>; // stopId -> itemSlug -> photos
};

function buildPhotoIndex(): PhotoIndex {
  const out: PhotoIndex = { stops: {}, items: {} };
  const root = path.join(process.cwd(), "public", "imogen");
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch {
    return out;
  }

  // Lookup of every stop + item by slug.
  const stopSlugs = new Map<string, string>();
  const itemList: { stopId: string; slug: string }[] = [];
  for (const s of stops) {
    stopSlugs.set(s.id, s.id);
    stopSlugs.set(imgSlug(s.name), s.id);
    for (const h of s.hostels ?? (s.hostel ? [s.hostel] : [])) itemList.push({ stopId: s.id, slug: imgSlug(h.name) });
    for (const d of s.dos ?? []) itemList.push({ stopId: s.id, slug: imgSlug(d.name) });
  }

  const resolve = (slug: string): { stopId: string; itemSlug?: string } | null => {
    const alias = PHOTO_ALIASES[slug];
    if (alias) return { stopId: alias.stopId, itemSlug: alias.item ? imgSlug(alias.item) : undefined };
    if (stopSlugs.has(slug)) return { stopId: stopSlugs.get(slug)! };
    const exact = itemList.filter((i) => i.slug === slug);
    if (exact.length === 1) return { stopId: exact[0].stopId, itemSlug: exact[0].slug };
    const fuzzy = itemList.filter((i) => i.slug.includes(slug) || slug.includes(i.slug));
    if (fuzzy.length === 1) return { stopId: fuzzy[0].stopId, itemSlug: fuzzy[0].slug };
    return null;
  };

  const add = (target: { stopId: string; itemSlug?: string }, urls: string[]) => {
    if (!urls.length) return;
    if (target.itemSlug) {
      (out.items[target.stopId] ??= {});
      out.items[target.stopId][target.itemSlug] = [...(out.items[target.stopId][target.itemSlug] ?? []), ...urls];
    } else {
      out.stops[target.stopId] = [...(out.stops[target.stopId] ?? []), ...urls];
    }
  };

  for (const e of entries) {
    if (e.isDirectory()) {
      const target = resolve(imgSlug(e.name));
      if (!target) continue;
      let files: string[] = [];
      try {
        files = fs.readdirSync(path.join(root, e.name)).filter((f) => WEB_IMG.test(f)).sort();
      } catch {
        /* ignore */
      }
      add(target, files.map((f) => `/imogen/${encodeURIComponent(e.name)}/${encodeURIComponent(f)}`));
    }
  }
  return out;
}

export default function ImogenPage() {
  const dates = buildItinerary();
  const highlights = getHighlights();
  const photos = buildPhotoIndex();
  let placeN = 0;

  return (
    <>
      <MapFab />
      <header className="im-bar">
        <span className="im-bar-name">
          {trip.who}&apos;s Asia
        </span>
        <a className="im-bar-link" href="#map">
          The map
        </a>
      </header>

      <div className="im-wrap">
        {/* ── hero ── */}
        <section className="im-hero">
          <Reveal>
            <p className="im-eyebrow">from Finbar</p>
            <h1 className="im-serif">
              {trip.title}
              <br />
              <em>{trip.subtitle}</em>
            </h1>
            <div className="im-hero-dates">
              <span className="dot" aria-hidden="true" />
              {tripDateLabel()} · {trip.weeks}
            </div>
            <p className="im-hero-intro">{trip.intro}</p>
            <div className="im-route-chips">
              <span className="im-chip c-thailand">🇹🇭 Thailand</span>
              <span className="im-chip c-laos">🇱🇦 Laos</span>
              <span className="im-chip c-vietnam">🇻🇳 Vietnam</span>
            </div>
          </Reveal>
        </section>
      </div>

      {/* ── highlights ── */}
      <div className="im-wrap">
        <section className="im-section">
          <Reveal>
            <p className="im-section-label">The highlights · my 10/10s</p>
            <Highlights items={highlights} />
          </Reveal>
        </section>
      </div>

      {/* ── map ── */}
      <div className="im-wrap">
        <section className="im-section" id="map">
          <Reveal>
            <p className="im-section-label">The route</p>
            <RouteMap />
            <p className="im-map-cap">Tap a numbered stop to jump to it.</p>
          </Reveal>
        </section>

        {/* ── time per place ── */}
        <section className="im-section">
          <Reveal>
            <p className="im-section-label">Time in each place</p>
            <TripGraph />
          </Reveal>
        </section>

        {/* ── apps ── */}
        <section className="im-section">
          <Reveal>
            <CollapsibleSection label="Apps to get first">
              <div className="im-apps">
                {apps.map((a) => (
                  <a
                    key={a.name}
                    className="im-app"
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="im-app-top">
                      <span className="im-app-name">{a.name}</span>
                      <span className="im-app-go">Open ↗</span>
                    </div>
                    <div className="im-app-tag">{a.tagline}</div>
                    {a.note && <p className="im-app-note">{a.note}</p>}
                  </a>
                ))}
              </div>
            </CollapsibleSection>
          </Reveal>
        </section>

        {/* ── how to travel ── */}
        <section className="im-section">
          <Reveal>
            <CollapsibleSection id="learnt" label="Things I learnt">
              <div className="im-tips">
                {tips.map((t) => (
                  <div key={t.title}>
                    <h3 className="im-tip-title im-serif">{t.title}</h3>
                    <p className="im-tip-body">{t.body}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </Reveal>
        </section>

        {/* ── what I wish I'd done ── */}
        <section className="im-section">
          <Reveal>
            <CollapsibleSection label="What I wish I'd done">
              <div className="im-tips">
                {wishlist.map((w) => (
                  <div key={w.title}>
                    <h3 className="im-tip-title im-serif">{w.title}</h3>
                    <p className="im-tip-body">{w.body}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          </Reveal>
        </section>

        {/* ── safety ── */}
        <section className="im-section">
          <Reveal>
            <CollapsibleSection id="heads-up" label="A heads-up" defaultOpen>
              <div className="im-safety">
                <p className="im-safety-title im-serif">{safety.title}</p>
                <p className="im-safety-body">{safety.body}</p>
                <p className="im-safety-body">{safety.vangVieng}</p>
                <p className="im-safety-body">{safety.closer}</p>
                <div className="im-safety-links">
                  {safety.sources.map((s) => (
                    <a key={s.url} className="im-linkbtn is-quiet" href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.text} ↗
                    </a>
                  ))}
                </div>
              </div>
            </CollapsibleSection>
          </Reveal>
        </section>

        {/* ── the trip ── */}
        <section className="im-section">
          <p className="im-section-label">The trip, in order</p>
          <div className="im-stops">
            {stops.map((s) => {
              const badge = s.side ? "↗" : s.kind === "place" ? String(++placeN) : "≈";
              return (
                <Reveal key={s.id}>
                  <StopCard
                    stop={s}
                    dates={dates[s.id]}
                    badge={badge}
                    stopPhotos={photos.stops[s.id] ?? []}
                    itemPhotos={photos.items[s.id] ?? {}}
                  />
                </Reveal>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── footer ── */}
      <footer className="im-foot">
        <div className="im-wrap">
          <p className="im-foot-note">
            Honestly, putting this together brought the whole trip flooding back and it was so cool
            to sit in it all again, so thank you for that. If it gives you even a fraction of what it
            gave me, I&apos;ll be made up.
          </p>
          <p className="im-foot-sign im-serif">
            Have the best time.
            <br />
            Say yes to everything. Finbar
          </p>
        </div>
      </footer>
    </>
  );
}
