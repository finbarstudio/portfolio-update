/**
 * Braeden homepage CHOOSER — STORY, six options.
 *
 * Each option is a short heritage teaser (~100svh) exploring a different display
 * font + colour shift, all within ~20% of Braeden DNA: light grounds, #222 ink,
 * brand red #e1251b as sparing punctuation, Montserrat/Quicksand as the system.
 * Copy is faithful to Braeden (Mick Devlin, est. 1996, Noosa, "we listen...").
 */

import { Tag, Photo, P, BOTTOM_SCRIM } from "./_kit";
import React from "react";

export default function StoryOptions() {
  return (
    <>
      {/* ─── 1 · Split editorial ───────────────────────────────────────────────
          Large photo across the top third; below: 60/40 split with Fraunces
          statement left, Quicksand bio + red link right. White ground. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Story" n={1} label="Split editorial" />

        {/* Top-third photo */}
        <div style={{ position: "relative", height: "38svh", flexShrink: 0, overflow: "hidden" } satisfies React.CSSProperties}>
          <Photo src={`${P}/modern-thai.webp`} pos="center 40%" />
        </div>

        {/* Below-photo content */}
        <div
          className="frame"
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "60fr 40fr",
            gap: "clamp(32px,5vw,80px)",
            alignItems: "start",
            paddingTop: "clamp(40px,6vw,80px)",
            paddingBottom: "clamp(40px,6vw,80px)",
          } satisfies React.CSSProperties}
        >
          {/* LEFT — Fraunces statement, period marks in red */}
          <div>
            <h2
              className="ff-fraunces"
              style={{
                fontWeight: 300,
                fontSize: "clamp(32px,4.2vw,68px)",
                lineHeight: 1.08,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                maxWidth: "18ch",
              } satisfies React.CSSProperties}
            >
              We listen
              <span className="accent">.</span> We ask you questions
              <span className="accent">.</span> We listen again
              <span className="accent">.</span>
            </h2>
          </div>

          {/* RIGHT — Quicksand bio + caps credit + link */}
          <div style={{ paddingTop: "0.5em" } satisfies React.CSSProperties}>
            <p
              className="ff-quick"
              style={{
                fontSize: "clamp(15px,1.1vw,17px)",
                lineHeight: 1.65,
                color: "var(--ink-soft)",
                marginBottom: "1.4em",
              } satisfies React.CSSProperties}
            >
              Founded by Mick Devlin in 1996, based in the Noosa hinterland. You
              deal direct with Mick on every build, start to finish.
            </p>
            <p
              className="eyebrow"
              style={{ marginBottom: "1.6em", color: "var(--ink-soft)" } satisfies React.CSSProperties}
            >
              Mick Devlin &middot; Founder
            </p>
            <a href="#" className="redlink">
              Our history <span className="ar">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 2 · Full-bleed drift ──────────────────────────────────────────────
          One viewport full-bleed photo (cooroy-mountain); lower-left caption
          on a bottom scrim. White text on photo. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          overflow: "hidden",
          background: "#161618",
          display: "grid",
          alignItems: "flex-end",
        } satisfies React.CSSProperties}
      >
        <Tag section="Story" n={2} label="Full-bleed drift" />
        <Photo src={`${P}/cooroy-mountain.webp`} pos="center 50%" />
        <div style={{ position: "absolute", inset: 0, background: BOTTOM_SCRIM } satisfies React.CSSProperties} />

        <div
          className="frame"
          style={{
            position: "relative",
            paddingBottom: "clamp(48px,7vw,96px)",
            maxWidth: 680,
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{ color: "var(--red)", marginBottom: "1em" } satisfies React.CSSProperties}
          >
            Since 1996 &middot; Noosa hinterland
          </p>
          <p
            className="ff-poppins"
            style={{
              fontWeight: 400,
              fontSize: "clamp(19px,2vw,28px)",
              lineHeight: 1.45,
              color: "#fff",
              marginBottom: "1.6em",
              maxWidth: "36ch",
            } satisfies React.CSSProperties}
          >
            Custom homes that make the most of the land, built direct with Mick,
            start to finish.
          </p>
          <a href="#" className="redlink">
            Read our story <span className="ar">&rarr;</span>
          </a>
        </div>
      </section>

      {/* ─── 3 · Generations ledger ────────────────────────────────────────────
          Off-white panel. Caps heading + 4 timeline rows divided by hairlines.
          2010 row year in red. Space Grotesk numerals + Quicksand phrases. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper-2)",
          display: "grid",
          placeItems: "center",
        } satisfies React.CSSProperties}
      >
        <Tag section="Story" n={3} label="Generations ledger" />

        <div
          className="frame wrap"
          style={{
            width: "100%",
            paddingTop: "clamp(72px,10vw,140px)",
            paddingBottom: "clamp(72px,10vw,140px)",
          } satisfies React.CSSProperties}
        >
          <p className="eyebrow" style={{ marginBottom: "0.9em" } satisfies React.CSSProperties}>
            Our history
          </p>
          <p
            className="ff-quick"
            style={{
              fontSize: "clamp(15px,1.05vw,17px)",
              color: "var(--ink-soft)",
              marginBottom: "clamp(32px,4vw,56px)",
              maxWidth: "46ch",
            } satisfies React.CSSProperties}
          >
            Three decades on the Sunshine Coast, built on referrals and repeat
            clients.
          </p>

          {/* Timeline rows */}
          {[
            { year: "1996", text: "Founded by Mick Devlin", red: false },
            { year: "2001", text: "Moved to Noosa with Sally and family", red: false },
            {
              year: "2010",
              text: "First Sunshine Coast builder to win National House of the Year",
              red: true,
            },
            {
              year: "Today",
              text: "Still mostly word of mouth, you deal direct with Mick",
              red: false,
            },
          ].map(({ year, text, red }) => (
            <div
              key={year}
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(80px,12vw,160px) 1fr",
                gap: "clamp(16px,3vw,48px)",
                alignItems: "center",
                borderTop: "1px solid var(--line)",
                paddingTop: "clamp(20px,2.6vw,36px)",
                paddingBottom: "clamp(20px,2.6vw,36px)",
              } satisfies React.CSSProperties}
            >
              <span
                className="ff-grotesk"
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(22px,2.8vw,40px)",
                  lineHeight: 1,
                  color: red ? "var(--red)" : "var(--ink)",
                  letterSpacing: "-0.02em",
                } satisfies React.CSSProperties}
              >
                {year}
              </span>
              <span
                className="ff-quick"
                style={{
                  fontSize: "clamp(15px,1.1vw,18px)",
                  color: "var(--ink-soft)",
                  lineHeight: 1.5,
                } satisfies React.CSSProperties}
              >
                {text}
              </span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--line)" } satisfies React.CSSProperties} />
        </div>
      </section>

      {/* ─── 4 · Sticky label, running story ───────────────────────────────────
          Sticky left label; right wide column with pull-line + photo anchored
          bottom-right. White ground, red label underline + link. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Story" n={4} label="Sticky label, running story" />

        <div
          className="frame"
          style={{
            display: "grid",
            gridTemplateColumns: "clamp(120px,16vw,200px) 1fr",
            gap: "clamp(32px,5vw,80px)",
            minHeight: "100svh",
            paddingTop: "clamp(80px,12vw,160px)",
            paddingBottom: "clamp(80px,12vw,160px)",
          } satisfies React.CSSProperties}
        >
          {/* LEFT — sticky label */}
          <div style={{ position: "relative" } satisfies React.CSSProperties}>
            <div
              style={{
                position: "sticky",
                top: "clamp(80px,12vw,140px)",
              } satisfies React.CSSProperties}
            >
              <p
                className="ff-mont caps"
                style={{
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  color: "var(--red)",
                  borderBottom: "2px solid var(--red)",
                  paddingBottom: "0.5em",
                  marginBottom: "0.6em",
                } satisfies React.CSSProperties}
              >
                Our story
              </p>
              <p
                className="ff-mont caps"
                style={{
                  fontWeight: 600,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: "var(--ink-soft)",
                } satisfies React.CSSProperties}
              >
                Est. 1996
              </p>
            </div>
          </div>

          {/* RIGHT — content column */}
          <div style={{ position: "relative" } satisfies React.CSSProperties}>
            <h2
              className="ff-grotesk"
              style={{
                fontWeight: 700,
                fontSize: "clamp(26px,3.2vw,52px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                maxWidth: "22ch",
                marginBottom: "1.4em",
              } satisfies React.CSSProperties}
            >
              More than 35 years building on the Sunshine Coast, and most of our
              work still comes by referral.
            </h2>
            <p
              className="ff-quick"
              style={{
                fontSize: "clamp(15px,1.05vw,17px)",
                lineHeight: 1.7,
                color: "var(--ink-soft)",
                maxWidth: "44ch",
                marginBottom: "0.9em",
              } satisfies React.CSSProperties}
            >
              Mick Devlin founded Braeden in Victoria in 1996, then brought the
              business to Noosa in 2001. He is on every project, from the first
              meeting through to handover.
            </p>
            <p
              className="ff-quick"
              style={{
                fontSize: "clamp(15px,1.05vw,17px)",
                lineHeight: 1.7,
                color: "var(--ink-soft)",
                maxWidth: "44ch",
                marginBottom: "2.4em",
              } satisfies React.CSSProperties}
            >
              Every project starts with listening. Most clients come back a second
              time, or send someone they know.
            </p>
            <a href="#" className="redlink">
              About Mick <span className="ar">&rarr;</span>
            </a>

            {/* Anchored photo bottom-right */}
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: "clamp(180px,28vw,380px)",
                aspectRatio: "4/3",
                overflow: "hidden",
                borderRadius: 2,
              } satisfies React.CSSProperties}
            >
              <Photo src={`${P}/river-haven.webp`} pos="center" drift={false} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5 · Stat trio ─────────────────────────────────────────────────────
          Short lead line + three columns with vertical rules. Archivo numerals.
          "5x" numeral in red. White / paper-2 ground. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper-2)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Story" n={5} label="Stat trio" />

        <div
          className="frame wrap"
          style={{
            width: "100%",
            textAlign: "center",
            paddingTop: "clamp(72px,10vw,140px)",
            paddingBottom: "clamp(72px,10vw,140px)",
          } satisfies React.CSSProperties}
        >
          <p className="eyebrow" style={{ marginBottom: "0.9em" } satisfies React.CSSProperties}>
            Heritage
          </p>
          <p
            className="ff-quick lead"
            style={{
              maxWidth: "48ch",
              marginInline: "auto",
              marginBottom: "clamp(48px,7vw,96px)",
            } satisfies React.CSSProperties}
          >
            Award-winning custom homes on the Sunshine Coast since 1996.
          </p>

          {/* Three stat columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 0,
            } satisfies React.CSSProperties}
          >
            {[
              {
                num: "1996",
                red: false,
                caption: "Founded in Victoria, Noosa since 2001",
              },
              {
                num: "35+",
                red: false,
                caption: "Years in the building industry",
              },
              {
                num: "5x",
                red: true,
                caption: "House of the Year (3x Coast, 2x QLD)",
              },
            ].map(({ num, red, caption }, i) => (
              <div
                key={num}
                style={{
                  borderLeft: i > 0 ? "1px solid var(--line)" : undefined,
                  padding: "clamp(24px,4vw,56px) clamp(16px,3vw,48px)",
                } satisfies React.CSSProperties}
              >
                <p
                  className="ff-archivo"
                  style={{
                    fontWeight: 700,
                    fontSize: "clamp(40px,6vw,96px)",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    color: red ? "var(--red)" : "var(--ink)",
                    marginBottom: "0.5em",
                  } satisfies React.CSSProperties}
                >
                  {num}
                </p>
                <p
                  className="eyebrow"
                  style={{
                    fontSize: 10,
                    lineHeight: 1.5,
                    color: "var(--ink-soft)",
                  } satisfies React.CSSProperties}
                >
                  {caption}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "clamp(40px,5vw,72px)" } satisfies React.CSSProperties}>
            <a href="#" className="redlink">
              See the awards <span className="ar">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 6 · Portrait beat ─────────────────────────────────────────────────
          Asymmetric two-column: left ~45% framed photo, right ~55% Mick bio
          with Poppins statement + Fraunces italic signature. White ground. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Story" n={6} label="Portrait beat" />

        <div
          className="frame"
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "45fr 55fr",
            gap: "clamp(32px,5vw,80px)",
            alignItems: "center",
            paddingTop: "clamp(72px,10vw,140px)",
            paddingBottom: "clamp(72px,10vw,140px)",
          } satisfies React.CSSProperties}
        >
          {/* LEFT — framed photo with generous margin (not full-bleed) */}
          <div
            style={{
              position: "relative",
              aspectRatio: "3/4",
              overflow: "hidden",
              margin: "0 clamp(12px,2vw,32px)",
              borderRadius: 2,
            } satisfies React.CSSProperties}
          >
            <Photo src={`${P}/sunrise-beach.webp`} pos="center" drift={false} />
          </div>

          {/* RIGHT — bio content */}
          <div>
            <p className="eyebrow" style={{ marginBottom: "1.2em" } satisfies React.CSSProperties}>
              The builder
            </p>
            <h2
              className="ff-poppins"
              style={{
                fontWeight: 600,
                fontSize: "clamp(22px,2.6vw,42px)",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                maxWidth: "20ch",
                marginBottom: "1.2em",
              } satisfies React.CSSProperties}
            >
              You deal direct with me, start to finish.
            </h2>
            <p
              className="ff-quick"
              style={{
                fontSize: "clamp(15px,1.05vw,17px)",
                lineHeight: 1.7,
                color: "var(--ink-soft)",
                maxWidth: "42ch",
                marginBottom: "1.8em",
              } satisfies React.CSSProperties}
            >
              Mick Devlin founded Braeden in 1996 and has built it into one of
              the coast&apos;s most decorated custom-home companies, most of it
              on referral.
            </p>
            <p
              className="ff-fraunces"
              style={{
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(22px,2.2vw,34px)",
                color: "var(--ink)",
                marginBottom: "2em",
              } satisfies React.CSSProperties}
            >
              Mick
            </p>
            <a href="#" className="redlink">
              More about Mick <span className="ar">&rarr;</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
