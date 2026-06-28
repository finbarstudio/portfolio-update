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
} from "@/content/imogen";
import RouteMap from "@/components/imogen/RouteMap";
import TripGraph from "@/components/imogen/TripGraph";
import StopCard from "@/components/imogen/StopCard";
import Highlights from "@/components/imogen/Highlights";
import CollapsibleSection from "@/components/imogen/CollapsibleSection";
import Reveal from "@/components/imogen/Reveal";

export default function ImogenPage() {
  const dates = buildItinerary();
  const highlights = getHighlights();
  let placeN = 0;

  return (
    <>
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
            <p className="im-eyebrow">For {trip.who} · from Finbar</p>
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
              <span className="im-chip c-thailand">Thailand</span>
              <span className="im-chip c-laos">Laos</span>
              <span className="im-chip c-vietnam">Vietnam</span>
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
            <CollapsibleSection label="Things I learnt">
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
            <CollapsibleSection label="A heads-up" defaultOpen>
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
                  <StopCard stop={s} dates={dates[s.id]} badge={badge} />
                </Reveal>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── footer ── */}
      <footer className="im-foot">
        <div className="im-wrap">
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
