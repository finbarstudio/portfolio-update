/**
 * Braeden homepage CHOOSER — FEATURED PROJECTS, six options.
 *
 * Each option is a full ~100svh "Selected Work" showcase grounded in a real
 * gallery archetype: imagery leads, project names are the anchors, copy is
 * faithful to Braeden. A Tag names each option for Finbar to pick one.
 *
 * Import helpers come from _kit so scrims, Photo, and Tag are consistent with
 * the rest of the chooser. Section="Featured", n=1..6.
 */

import { Tag, Photo, P, RADIAL_SCRIM, BOTTOM_SCRIM, TOP_WASH } from "./_kit";
import React from "react";

export default function FeaturedProjectsOptions() {
  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────────
          1 — Full-bleed parallax drift
          One cinematic plate (modern-thai) inset a hair, centred red eyebrow
          above it, project title bottom-left over a BOTTOM_SCRIM, a row of
          small rounded thumbnails along the bottom, and a top-right "View all
          projects" redlink. Montserrat + Quicksand, red on active thumb.
          ───────────────────────────────────────────────────────────────────── */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          overflow: "hidden",
          background: "#111",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        } satisfies React.CSSProperties}
      >
        <Tag section="Featured" n={1} label="Full-bleed parallax drift" />

        {/* Top-right "View all projects" link */}
        <a
          href="#"
          className="redlink"
          style={{
            position: "absolute",
            top: "clamp(22px,3vw,40px)",
            right: "var(--gutter)",
            zIndex: 10,
            color: "#fff",
          } satisfies React.CSSProperties}
        >
          View all projects <span className="ar">&rarr;</span>
        </a>

        {/* Photo plate — inset slightly from all edges */}
        <div
          style={{
            position: "absolute",
            inset: "clamp(10px,1.2vw,18px)",
            overflow: "hidden",
            borderRadius: 2,
          } satisfies React.CSSProperties}
        >
          <Photo src={`${P}/modern-thai.webp`} pos="center 42%" />
          <div
            style={{ position: "absolute", inset: 0, background: BOTTOM_SCRIM }}
          />
          <div
            style={{ position: "absolute", inset: 0, background: TOP_WASH }}
          />

          {/* Bottom-left caption */}
          <div
            style={{
              position: "absolute",
              bottom: "clamp(80px,10vw,130px)",
              left: "clamp(22px,3vw,48px)",
              right: "clamp(22px,3vw,48px)",
              color: "#fff",
            } satisfies React.CSSProperties}
          >
            <p
              className="eyebrow"
              style={{
                color: "var(--red)",
                marginBottom: "0.7em",
              } satisfies React.CSSProperties}
            >
              Selected Work
            </p>
            <h2
              className="ff-mont caps"
              style={{
                fontWeight: 700,
                fontSize: "clamp(26px,3.8vw,58px)",
                lineHeight: 1.04,
                letterSpacing: "-0.01em",
                color: "#fff",
                margin: 0,
              } satisfies React.CSSProperties}
            >
              Modern Thai House
            </h2>
            <p
              className="ff-quick"
              style={{
                marginTop: "0.45em",
                fontSize: "clamp(13px,1.1vw,16px)",
                color: "rgba(255,255,255,0.75)",
              } satisfies React.CSSProperties}
            >
              Noosa Heads &middot; MBA Queensland House of the Year
            </p>
          </div>

          {/* Thumbnail strip — bottom of the inset plate */}
          <div
            style={{
              position: "absolute",
              bottom: "clamp(16px,2vw,28px)",
              left: "clamp(22px,3vw,48px)",
              display: "flex",
              gap: "clamp(8px,0.8vw,12px)",
              alignItems: "flex-end",
            } satisfies React.CSSProperties}
          >
            {(
              [
                { file: "modern-thai", label: "Modern Thai", active: true },
                { file: "river-haven", label: "River Haven", active: false },
                { file: "noosaville", label: "Riverside", active: false },
                { file: "sunshine-beach", label: "Sunrise Beach", active: false },
              ] as const
            ).map(({ file, label, active }) => (
              <div
                key={file}
                style={{
                  position: "relative",
                  width: "clamp(52px,6vw,80px)",
                  height: "clamp(36px,4vw,54px)",
                  borderRadius: 3,
                  overflow: "hidden",
                  flexShrink: 0,
                  outline: active ? "2px solid var(--red)" : "none",
                  outlineOffset: active ? 2 : 0,
                  opacity: active ? 1 : 0.65,
                } satisfies React.CSSProperties}
              >
                <img
                  src={`${P}/${file}.webp`}
                  alt={label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  } satisfies React.CSSProperties}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          2 — Split editorial sticky
          40/60 split, 100svh. Left off-white #f7f7f7: vertically-centred meta
          in Poppins; right: full-height photo (river-haven) bleeding to edge.
          A slim vertical red rail on the divider. White ground.
          ───────────────────────────────────────────────────────────────────── */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "40fr 60fr",
        } satisfies React.CSSProperties}
      >
        <Tag section="Featured" n={2} label="Split editorial sticky" />

        {/* Left meta panel */}
        <div
          style={{
            background: "var(--paper-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(48px,7vw,120px) var(--gutter)",
          } satisfies React.CSSProperties}
        >
          <div style={{ maxWidth: 380 } satisfies React.CSSProperties}>
            <p
              className="eyebrow"
              style={{ marginBottom: "1.6em" } satisfies React.CSSProperties}
            >
              Selected Work
            </p>
            <h2
              className="ff-mont caps"
              style={{
                fontWeight: 700,
                fontSize: "clamp(20px,2.2vw,34px)",
                lineHeight: 1.1,
                letterSpacing: "0.01em",
                color: "var(--ink)",
                margin: 0,
              } satisfies React.CSSProperties}
            >
              River Haven
            </h2>
            <p
              className="ff-poppins"
              style={{
                marginTop: "0.9em",
                fontSize: "clamp(13px,1.05vw,16px)",
                lineHeight: 1.55,
                color: "var(--ink-soft)",
              } satisfies React.CSSProperties}
            >
              Custom waterfront home, Noosa hinterland.
            </p>
            <p
              className="ff-quick"
              style={{
                marginTop: "0.6em",
                fontSize: 13,
                color: "var(--ink-soft)",
                letterSpacing: "0.04em",
              } satisfies React.CSSProperties}
            >
              Noosaville &middot; 2024
            </p>
            <div
              style={{
                height: 1,
                background: "var(--line)",
                margin: "2em 0",
              } satisfies React.CSSProperties}
            />
            <a href="#" className="redlink">
              View project <span className="ar">&rarr;</span>
            </a>
          </div>
        </div>

        {/* Red divider rail */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "40%",
            width: 3,
            background: "var(--red)",
            zIndex: 4,
          } satisfies React.CSSProperties}
        />

        {/* Right photo panel — bleeding to right edge */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
          } satisfies React.CSSProperties}
        >
          <Photo src={`${P}/river-haven.webp`} pos="center" drift={false} />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          3 — Pinned horizontal gallery
          100svh; "OUR WORK" title centred top; a visual overflow row of 3 large
          landscape plates with caption under each; final tile a CTA card on
          off-white. (Pins + scrolls horizontally in the real build — noted.)
          ───────────────────────────────────────────────────────────────────── */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(28px,4vw,56px)",
        } satisfies React.CSSProperties}
      >
        <Tag section="Featured" n={3} label="Pinned horizontal gallery" />

        {/* Centred section header */}
        <div
          className="frame"
          style={{
            textAlign: "center",
            paddingTop: "clamp(52px,7vw,96px)",
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{ marginBottom: "0.9em" } satisfies React.CSSProperties}
          >
            Noosa Hinterland &middot; Sunshine Coast
          </p>
          <h2
            className="ff-mont caps"
            style={{
              fontWeight: 700,
              fontSize: "clamp(28px,3.6vw,52px)",
              lineHeight: 1.04,
              letterSpacing: "-0.01em",
              margin: 0,
              color: "var(--ink)",
            } satisfies React.CSSProperties}
          >
            Our Work
          </h2>
        </div>

        {/*
         * Horizontal strip of tiles.
         * NOTE: In the real build this section is sticky + its inner track
         * translates horizontally via a scroll-driven animation, giving the
         * "pinned horizontal gallery" effect. Here we show it as a static
         * overflow row for the chooser preview.
         */}
        <div
          style={{
            display: "flex",
            gap: "clamp(14px,1.4vw,22px)",
            paddingInline: "var(--gutter)",
            overflowX: "auto",
            paddingBottom: "clamp(40px,5vw,72px)",
            scrollbarWidth: "none",
          } satisfies React.CSSProperties}
        >
          {(
            [
              {
                file: "modern-thai",
                name: "Modern Thai House",
                loc: "Noosa Heads",
              },
              {
                file: "noosaville",
                name: "Riverside",
                loc: "Noosaville",
              },
              {
                file: "sunshine-beach",
                name: "Sunrise Beach",
                loc: "Sunshine Beach",
              },
            ] as const
          ).map(({ file, name, loc }) => (
            <div
              key={file}
              style={{
                flex: "0 0 clamp(280px,44vw,640px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(10px,1vw,16px)",
              } satisfies React.CSSProperties}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/9",
                  overflow: "hidden",
                  borderRadius: 2,
                } satisfies React.CSSProperties}
              >
                <img
                  src={`${P}/${file}.webp`}
                  alt={name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  } satisfies React.CSSProperties}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.75em",
                } satisfies React.CSSProperties}
              >
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--red)",
                    flexShrink: 0,
                    marginBottom: 1,
                  } satisfies React.CSSProperties}
                />
                <span
                  className="ff-mont caps"
                  style={{
                    fontWeight: 700,
                    fontSize: "clamp(11px,1vw,14px)",
                    letterSpacing: "0.1em",
                    color: "var(--ink)",
                  } satisfies React.CSSProperties}
                >
                  {name}
                </span>
                <span
                  className="ff-poppins"
                  style={{
                    fontSize: 12,
                    color: "var(--ink-soft)",
                    marginLeft: "auto",
                  } satisfies React.CSSProperties}
                >
                  {loc}
                </span>
              </div>
            </div>
          ))}

          {/* CTA tile */}
          <div
            style={{
              flex: "0 0 clamp(180px,18vw,260px)",
              background: "var(--paper-2)",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.2em",
              padding: "2em",
            } satisfies React.CSSProperties}
          >
            <p
              className="ff-mont caps"
              style={{
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.14em",
                color: "var(--ink)",
                textAlign: "center",
                margin: 0,
              } satisfies React.CSSProperties}
            >
              See every project
            </p>
            <a href="#" className="redlink">
              View all <span className="ar">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          4 — Hover-to-fullscreen index
          100svh, near-empty white. Centred column of 4 project names in
          ff-mont caps; location in small ff-quick beside. On :hover a
          full-bleed photo fades in behind (CSS only via sibling combinator on
          a hidden checkbox + label, or per-item :hover background via a
          pseudo-element). "View all projects" centred bottom.
          ───────────────────────────────────────────────────────────────────── */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        } satisfies React.CSSProperties}
      >
        <Tag section="Featured" n={4} label="Hover-to-fullscreen index" />

        {/*
         * CSS-only hover reveal: each .brd-fp-item sits in a wrapper that
         * carries a full-bleed ::before pseudo covering the whole section.
         * Since pseudo-elements can&apos;t escape their containing block easily,
         * we instead show a sibling <div> photo layer that fades in when the
         * item is hovered, using the adjacent-sibling pattern below.
         *
         * Implementation note: we stack each photo absolutely, all hidden at
         * opacity-0. A CSS rule of the form
         *   .brd-fp-item:hover ~ .brd-fp-photos .brd-fp-photo--N { opacity: 1 }
         * won&apos;t work when photos are a sibling AFTER the list (~ only reaches
         * forward siblings). So we use individual :hover::before pseudo overlays
         * on each item, each with its own background-image. This is 100% CSS,
         * no JS, and degrades gracefully (photos just don&apos;t show pre-hover).
         */}
        <style>{`
          .brd-fp-item {
            position: relative;
            cursor: default;
          }
          .brd-fp-item::before {
            content: "";
            position: fixed;
            inset: 0;
            background-size: cover;
            background-position: center;
            opacity: 0;
            transition: opacity 0.55s cubic-bezier(0.16,1,0.3,1);
            z-index: 0;
            pointer-events: none;
          }
          .brd-fp-item:hover::before { opacity: 1; }

          .brd-fp-item--1::before { background-image: url("${P}/modern-thai.webp"); }
          .brd-fp-item--2::before { background-image: url("${P}/river-haven.webp"); }
          .brd-fp-item--3::before { background-image: url("${P}/noosaville.webp"); }
          .brd-fp-item--4::before { background-image: url("${P}/peregian.webp"); }

          .brd-fp-item .brd-fp-scrim {
            position: fixed;
            inset: 0;
            background: rgba(20,20,22,0.46);
            opacity: 0;
            transition: opacity 0.55s cubic-bezier(0.16,1,0.3,1);
            z-index: 0;
            pointer-events: none;
          }
          .brd-fp-item:hover .brd-fp-scrim { opacity: 1; }

          .brd-fp-name {
            position: relative;
            z-index: 2;
            font-weight: 700;
            font-size: clamp(22px, 2.8vw, 44px);
            letter-spacing: -0.01em;
            text-transform: uppercase;
            color: var(--ink-soft);
            transition: color 0.35s ease;
            line-height: 1;
          }
          .brd-fp-item:hover .brd-fp-name { color: var(--red); }
          .brd-fp-loc {
            position: relative;
            z-index: 2;
            font-size: 12px;
            letter-spacing: 0.06em;
            color: var(--ink-soft);
            transition: color 0.35s ease;
            white-space: nowrap;
          }
          .brd-fp-item:hover .brd-fp-loc { color: rgba(255,255,255,0.75); }
        `}</style>

        <p
          className="eyebrow"
          style={{
            marginBottom: "clamp(32px,5vw,64px)",
            position: "relative",
            zIndex: 2,
          } satisfies React.CSSProperties}
        >
          Selected Work
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(18px,2.4vw,36px)",
            width: "100%",
            maxWidth: 820,
            paddingInline: "var(--gutter)",
          } satisfies React.CSSProperties}
        >
          {(
            [
              { cls: "brd-fp-item--1", name: "Modern Thai House", loc: "Noosa Heads" },
              { cls: "brd-fp-item--2", name: "River Haven", loc: "Noosa Hinterland" },
              { cls: "brd-fp-item--3", name: "Riverside", loc: "Noosaville" },
              { cls: "brd-fp-item--4", name: "Peregian Beach House", loc: "Peregian Beach" },
            ] as const
          ).map(({ cls, name, loc }) => (
            <div
              key={name}
              className={`brd-fp-item ${cls}`}
            >
              <div className="brd-fp-scrim" />
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "clamp(16px,2vw,32px)",
                  borderTop: "1px solid var(--line)",
                  paddingTop: "clamp(14px,1.6vw,24px)",
                } satisfies React.CSSProperties}
              >
                <span className="ff-mont brd-fp-name">{name}</span>
                <span className="ff-quick brd-fp-loc">{loc}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "clamp(28px,4vw,52px)",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 4,
          } satisfies React.CSSProperties}
        >
          <a href="#" className="redlink">
            View all projects <span className="ar">&rarr;</span>
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          5 — Hero plate + restrained row
          100svh; centred red eyebrow above; top ~62%: one large landscape hero
          (modern-thai) with caption block overlapping lower-left (name + loc +
          award line in red); a --line rule; bottom ~30%: row of 3 smaller
          project cards (image + name + loc) with "View all projects" redlink
          at the row&apos;s right end. White ground, charcoal, award in red.
          ───────────────────────────────────────────────────────────────────── */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        } satisfies React.CSSProperties}
      >
        <Tag section="Featured" n={5} label="Hero plate + restrained row" />

        {/* Eyebrow + hero plate — top ~62% */}
        <div
          className="frame"
          style={{
            paddingTop: "clamp(52px,7vw,96px)",
            flex: "0 0 auto",
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{
              textAlign: "center",
              marginBottom: "clamp(16px,2vw,28px)",
            } satisfies React.CSSProperties}
          >
            Selected Work
          </p>
        </div>

        <div
          className="frame"
          style={{
            position: "relative",
            flex: "1 0 auto",
            maxHeight: "clamp(280px,50vh,560px)",
            overflow: "hidden",
          } satisfies React.CSSProperties}
        >
          {/* Hero image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              minHeight: "clamp(240px,44vh,520px)",
              overflow: "hidden",
              borderRadius: 2,
            } satisfies React.CSSProperties}
          >
            <Photo src={`${P}/modern-thai.webp`} pos="center 42%" drift={false} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: BOTTOM_SCRIM,
              } satisfies React.CSSProperties}
            />

            {/* Caption block overlapping lower-left */}
            <div
              style={{
                position: "absolute",
                bottom: "clamp(18px,2.4vw,36px)",
                left: "clamp(18px,2.4vw,36px)",
                color: "#fff",
                maxWidth: "32ch",
              } satisfies React.CSSProperties}
            >
              <h2
                className="ff-mont caps"
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(17px,2vw,28px)",
                  lineHeight: 1.08,
                  letterSpacing: "0.02em",
                  margin: 0,
                  color: "#fff",
                } satisfies React.CSSProperties}
              >
                Modern Thai House
              </h2>
              <p
                className="ff-quick"
                style={{
                  marginTop: "0.35em",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.72)",
                } satisfies React.CSSProperties}
              >
                Noosa Heads
              </p>
              <p
                className="ff-poppins"
                style={{
                  marginTop: "0.4em",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--red)",
                  letterSpacing: "0.03em",
                } satisfies React.CSSProperties}
              >
                MBA Queensland House of the Year
              </p>
            </div>
          </div>
        </div>

        {/* Rule */}
        <div
          aria-hidden
          style={{
            height: 1,
            background: "var(--line)",
            marginInline: "var(--gutter)",
            flexShrink: 0,
          } satisfies React.CSSProperties}
        />

        {/* Bottom row of 3 smaller project cards */}
        <div
          className="frame"
          style={{
            display: "flex",
            gap: "clamp(12px,1.4vw,22px)",
            alignItems: "stretch",
            padding: "clamp(18px,2.4vw,36px) var(--gutter)",
            flexShrink: 0,
          } satisfies React.CSSProperties}
        >
          {(
            [
              { file: "river-haven", name: "River Haven", loc: "Noosa Hinterland" },
              { file: "noosaville", name: "Riverside", loc: "Noosaville" },
              { file: "peregian", name: "Peregian", loc: "Peregian Beach" },
            ] as const
          ).map(({ file, name, loc }) => (
            <div
              key={file}
              style={{
                flex: "1 1 0",
                display: "flex",
                flexDirection: "column",
                gap: "0.65em",
              } satisfies React.CSSProperties}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4/3",
                  overflow: "hidden",
                  borderRadius: 2,
                  background: "var(--paper-2)",
                } satisfies React.CSSProperties}
              >
                <img
                  src={`${P}/${file}.webp`}
                  alt={name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  } satisfies React.CSSProperties}
                />
              </div>
              <p
                className="ff-mont caps"
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(10px,0.85vw,13px)",
                  letterSpacing: "0.1em",
                  color: "var(--ink)",
                  margin: 0,
                } satisfies React.CSSProperties}
              >
                {name}
              </p>
              <p
                className="ff-quick"
                style={{
                  fontSize: 12,
                  color: "var(--ink-soft)",
                  margin: 0,
                } satisfies React.CSSProperties}
              >
                {loc}
              </p>
            </div>
          ))}

          {/* "View all" at the row&apos;s right end */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flexShrink: 0,
              paddingLeft: "clamp(8px,1vw,16px)",
            } satisfies React.CSSProperties}
          >
            <a href="#" className="redlink" style={{ whiteSpace: "nowrap" } satisfies React.CSSProperties}>
              View all projects <span className="ar">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          6 — Offset overlapping stack
          100svh, off-white #fafafa. Asymmetric real grid: large plate
          left-of-centre (modern-thai), smaller plate overlapping its lower-right
          (noosaville), a third upper-right higher (peregian). Project names in
          the negative space beside each in ff-mont caps + ff-grotesk caption.
          Centred title top; "View all" bottom-right; one red location dot on
          the topmost only.
          ───────────────────────────────────────────────────────────────────── */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "#fafafa",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        } satisfies React.CSSProperties}
      >
        <Tag section="Featured" n={6} label="Offset overlapping stack" />

        {/* Section title centred at top */}
        <div
          className="frame"
          style={{
            textAlign: "center",
            paddingTop: "clamp(52px,7vw,96px)",
            paddingBottom: "clamp(24px,3vw,44px)",
            flexShrink: 0,
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{ marginBottom: "0.8em" } satisfies React.CSSProperties}
          >
            Selected Work
          </p>
          <h2
            className="ff-mont caps"
            style={{
              fontWeight: 700,
              fontSize: "clamp(22px,2.6vw,40px)",
              lineHeight: 1.06,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
              margin: 0,
            } satisfies React.CSSProperties}
          >
            Featured Projects
          </h2>
        </div>

        {/* Asymmetric composition — uses a shared 12-column grid container */}
        <div
          className="frame"
          style={{
            position: "relative",
            flex: "1 1 auto",
            display: "grid",
            gridTemplateColumns: "repeat(12,1fr)",
            gridTemplateRows: "1fr 1fr",
            gap: "clamp(10px,1.2vw,18px)",
            paddingBottom: "clamp(52px,7vw,80px)",
          } satisfies React.CSSProperties}
        >
          {/* Plate A — large, left-of-centre: col 1-7, both rows */}
          <div
            style={{
              gridColumn: "1 / 8",
              gridRow: "1 / 3",
              position: "relative",
              overflow: "hidden",
              borderRadius: 2,
            } satisfies React.CSSProperties}
          >
            <Photo src={`${P}/modern-thai.webp`} pos="center 42%" drift={false} />
          </div>

          {/* Plate A label — negative space col 8-10, row 1 (upper) */}
          <div
            style={{
              gridColumn: "8 / 11",
              gridRow: "1 / 2",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              paddingBottom: "0.6em",
            } satisfies React.CSSProperties}
          >
            <h3
              className="ff-mont caps"
              style={{
                fontWeight: 700,
                fontSize: "clamp(12px,1.1vw,17px)",
                letterSpacing: "0.08em",
                color: "var(--ink)",
                margin: 0,
                lineHeight: 1.2,
              } satisfies React.CSSProperties}
            >
              Modern Thai House
            </h3>
            <p
              className="ff-grotesk"
              style={{
                fontSize: 12,
                color: "var(--ink-soft)",
                marginTop: "0.3em",
                display: "flex",
                alignItems: "center",
                gap: "0.45em",
              } satisfies React.CSSProperties}
            >
              <span
                aria-hidden
                style={{
                  display: "inline-block",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--red)",
                  flexShrink: 0,
                } satisfies React.CSSProperties}
              />
              Noosa Heads
            </p>
          </div>

          {/* Plate B — smaller, upper-right: col 11-13, row 1 */}
          <div
            style={{
              gridColumn: "11 / 13",
              gridRow: "1 / 2",
              position: "relative",
              overflow: "hidden",
              borderRadius: 2,
              alignSelf: "end",
            } satisfies React.CSSProperties}
          >
            <img
              src={`${P}/peregian.webp`}
              alt="Peregian"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              } satisfies React.CSSProperties}
            />
          </div>

          {/* Plate C — overlapping lower-right: col 8-12, row 2 */}
          <div
            style={{
              gridColumn: "8 / 13",
              gridRow: "2 / 3",
              position: "relative",
              overflow: "hidden",
              borderRadius: 2,
            } satisfies React.CSSProperties}
          >
            <Photo src={`${P}/noosaville.webp`} pos="center 35%" drift={false} />
          </div>

          {/* Plate B label — below plate B, col 11-13 in row 2 */}
          {/* Plate C + B labels stacked in a tight column right of Plate A */}
          {/* We use absolute positioning inside the grid for the two right captions */}
          {/* Plate B caption sits at col 11-13 row 1 bottom; handled above */}

          {/* Plate C caption — bottom of col 8-10, row 2 */}
          <div
            style={{
              gridColumn: "8 / 11",
              gridRow: "2 / 3",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingTop: "0.6em",
            } satisfies React.CSSProperties}
          >
            <h3
              className="ff-mont caps"
              style={{
                fontWeight: 700,
                fontSize: "clamp(12px,1.1vw,17px)",
                letterSpacing: "0.08em",
                color: "var(--ink)",
                margin: 0,
                lineHeight: 1.2,
              } satisfies React.CSSProperties}
            >
              Riverside
            </h3>
            <p
              className="ff-grotesk"
              style={{
                fontSize: 12,
                color: "var(--ink-soft)",
                marginTop: "0.3em",
              } satisfies React.CSSProperties}
            >
              Noosaville
            </p>
            <p
              className="ff-grotesk"
              style={{
                fontSize: 11,
                color: "var(--ink-soft)",
                marginTop: "0.2em",
                fontStyle: "italic",
              } satisfies React.CSSProperties}
            >
              MBA Sunshine Coast Best Individual Home 2025
            </p>
          </div>
        </div>

        {/* "View all projects" bottom-right */}
        <div
          className="frame"
          style={{
            position: "absolute",
            bottom: "clamp(20px,2.4vw,36px)",
            right: "var(--gutter)",
            left: "auto",
          } satisfies React.CSSProperties}
        >
          <a href="#" className="redlink">
            View all projects <span className="ar">&rarr;</span>
          </a>
        </div>
      </section>
    </>
  );
}
