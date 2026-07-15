/**
 * Braeden homepage CHOOSER — PROOF (awards + testimonials), six options.
 *
 * Braeden are one of the most decorated builders on the Sunshine Coast: first
 * to win MBA National Residential Master Builder of the Year + National House
 * of the Year (2010), multiple Sunshine Coast + Queensland House of the Year,
 * and the 2025 MBA Sunshine Coast awards for Riverside. Testimonials are
 * verbatim from real clients. Each option is a different display font + colour
 * shift, all within ~20% of the DNA: light ground, ink #222, red #e1251b as
 * punctuation, Montserrat/Quicksand as the system, imagery and type leading.
 */

import { Tag, Photo, P, BOTTOM_SCRIM } from "./_kit";
import React from "react";

export default function ProofOptions() {
  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────────
          1 — The single statement: maximum air, one testimonial centred in
          Fraunces, white ground, a short red rule, quiet attribution. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "88svh",
          background: "var(--paper)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Proof" n={1} label="The single statement" />
        <div
          className="frame"
          style={{
            textAlign: "center",
            maxWidth: 860,
            paddingBlock: "clamp(72px, 11vw, 140px)",
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{ marginBottom: "2.2em", color: "var(--ink-soft)" } satisfies React.CSSProperties}
          >
            In the clients&apos; words
          </p>
          <blockquote
            className="ff-fraunces"
            style={{
              fontWeight: 300,
              fontSize: "clamp(22px, 2.8vw, 42px)",
              lineHeight: 1.38,
              letterSpacing: "-0.01em",
              maxWidth: "26ch",
              margin: "0 auto",
              color: "var(--ink)",
              fontStyle: "italic",
            } satisfies React.CSSProperties}
          >
            &ldquo;Mick and his team are more than tradesmen, they are craftsmen
            whose attitude and application to their work produces outstanding
            results.&rdquo;
          </blockquote>
          <span
            aria-hidden
            style={{
              display: "block",
              width: 40,
              height: 2,
              background: "var(--red)",
              margin: "2.2em auto 1.8em",
            } satisfies React.CSSProperties}
          />
          <p
            className="ff-quick"
            style={{
              fontSize: "clamp(13px, 1vw, 15px)",
              letterSpacing: "0.04em",
              color: "var(--ink-soft)",
            } satisfies React.CSSProperties}
          >
            Brian and Dotty Knott, Noosa Heads
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          2 — Quiet stat row: off-white, vertically centred, four credential
          cells divided by hairlines. Big numbers in Archivo; key glyphs red. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "70svh",
          background: "var(--paper-2)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Proof" n={2} label="Quiet stat row" />
        <div
          className="frame wrap"
          style={{ width: "100%", paddingBlock: "clamp(56px, 9vw, 120px)" } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{
              textAlign: "center",
              marginBottom: "clamp(36px, 5vw, 72px)",
            } satisfies React.CSSProperties}
          >
            The record
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0,
            } satisfies React.CSSProperties}
          >
            {[
              { num: "1996", label: "Building on the coast since" },
              { num: "3×", label: "Sunshine Coast House of the Year" },
              { num: "2×", label: "Queensland House of the Year" },
              { num: "National", label: "Master Builder & House of the Year, 2010" },
            ].map((cell, i) => (
              <div
                key={i}
                style={{
                  borderLeft: i === 0 ? "none" : "1px solid var(--line)",
                  padding: "clamp(20px, 3vw, 40px) clamp(16px, 2.5vw, 36px)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.7em",
                } satisfies React.CSSProperties}
              >
                <span
                  className="ff-archivo"
                  style={{
                    fontWeight: 700,
                    fontSize: "clamp(28px, 3.6vw, 58px)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    color: i === 0 ? "var(--red)" : "var(--ink)",
                  } satisfies React.CSSProperties}
                >
                  {cell.num}
                </span>
                <span
                  className="eyebrow"
                  style={{
                    fontSize: "clamp(9px, 0.75vw, 10px)",
                    letterSpacing: "0.18em",
                    color: "var(--ink-soft)",
                    lineHeight: 1.5,
                  } satisfies React.CSSProperties}
                >
                  {cell.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          3 — Quote over the build: near-full-bleed Modern Thai House photo,
          bottom scrim, lower-left testimonial in Cormorant. Award lockup
          top-right. Red on a single underline accent. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "92svh",
          overflow: "hidden",
          background: "#161618",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        } satisfies React.CSSProperties}
      >
        <Tag section="Proof" n={3} label="Quote over the build" />
        <Photo src={`${P}/modern-thai.webp`} pos="center 40%" />
        <div style={{ position: "absolute", inset: 0, background: BOTTOM_SCRIM } satisfies React.CSSProperties} />

        {/* Award lockup top-right */}
        <div
          className="frame"
          style={{
            position: "absolute",
            top: "clamp(40px, 6vw, 80px)",
            right: 0,
            left: "auto",
            paddingInlineEnd: "var(--gutter)",
            textAlign: "right",
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{
              color: "rgba(255,255,255,0.7)",
              marginBottom: "0.5em",
            } satisfies React.CSSProperties}
          >
            MBA Queensland
          </p>
          <p
            className="ff-mont"
            style={{
              fontWeight: 700,
              fontSize: "clamp(11px, 0.9vw, 13px)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#fff",
              borderBottom: "1px solid var(--red)",
              paddingBottom: "0.4em",
              display: "inline-block",
            } satisfies React.CSSProperties}
          >
            House of the Year
          </p>
        </div>

        {/* Lower-left testimonial */}
        <div
          className="frame"
          style={{
            position: "relative",
            paddingBottom: "clamp(40px, 6vw, 80px)",
            maxWidth: 720,
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{
              color: "rgba(255,255,255,0.65)",
              marginBottom: "1em",
            } satisfies React.CSSProperties}
          >
            Testimonial
          </p>
          <blockquote
            className="ff-cormorant"
            style={{
              fontWeight: 300,
              fontSize: "clamp(22px, 2.6vw, 40px)",
              lineHeight: 1.32,
              color: "#fff",
              fontStyle: "italic",
              margin: 0,
              maxWidth: "32ch",
            } satisfies React.CSSProperties}
          >
            &ldquo;The end product is stunning. The craftsmanship exhibited in
            so many areas of the house is testament to the skill of the people
            Mick chooses to work with.&rdquo;
          </blockquote>
          <p
            className="ff-quick"
            style={{
              marginTop: "1.2em",
              fontSize: "clamp(12px, 0.9vw, 14px)",
              color: "rgba(255,255,255,0.68)",
              letterSpacing: "0.04em",
            } satisfies React.CSSProperties}
          >
            Mike and Sim Burgess, Noosa Heads
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          4 — Awards ledger: editorial two-column layout. Left: heading block.
          Right: a vertical list of award rows with hairline dividers, year in
          Space Mono, red accent on :hover via a CSS data attribute trick. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "85svh",
          background: "var(--paper)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Proof" n={4} label="Awards ledger" />
        <div
          className="frame wrap"
          style={{
            width: "100%",
            paddingBlock: "clamp(56px, 9vw, 120px)",
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "clamp(32px, 5vw, 80px)",
            alignItems: "start",
          } satisfies React.CSSProperties}
        >
          {/* Left: heading */}
          <div style={{ paddingTop: "clamp(4px, 0.5vw, 10px)" } satisfies React.CSSProperties}>
            <p
              className="eyebrow"
              style={{ marginBottom: "1.2em" } satisfies React.CSSProperties}
            >
              Recognition
            </p>
            <h2
              className="ff-mont"
              style={{
                fontWeight: 700,
                fontSize: "clamp(28px, 3.2vw, 50px)",
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
                color: "var(--ink)",
                marginBottom: "1em",
              } satisfies React.CSSProperties}
            >
              Awards
            </h2>
            <p
              className="ff-quick"
              style={{
                fontSize: "clamp(14px, 1vw, 16px)",
                lineHeight: 1.6,
                color: "var(--ink-soft)",
                maxWidth: "22ch",
              } satisfies React.CSSProperties}
            >
              A decorated record on the Sunshine Coast.
            </p>
          </div>

          {/* Right: ledger */}
          <div>
            {[
              { year: "2010", award: "National Residential Master Builder of the Year" },
              { year: "2010", award: "National House of the Year" },
              { year: "Decade", award: "House of the Year, Sunshine Coast ×3" },
              { year: "Decade", award: "House of the Year, Queensland ×2" },
              { year: "2025", award: "Best Individual Home, Riverside (Noosaville)" },
              { year: "2025", award: "Best Residential Kitchen, Riverside" },
            ].map((row, i) => (
              <div
                key={i}
                className="brd-award-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "clamp(64px,6vw,90px) 1fr",
                  gap: "clamp(12px, 2vw, 28px)",
                  alignItems: "center",
                  padding: "clamp(14px, 1.6vw, 22px) 0",
                  borderTop: "1px solid var(--line)",
                  transition: "border-color 0.25s var(--ease)",
                } satisfies React.CSSProperties}
              >
                <span
                  className="ff-mono"
                  style={{
                    fontSize: "clamp(9px, 0.75vw, 11px)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--ink-soft)",
                  } satisfies React.CSSProperties}
                >
                  {row.year}
                </span>
                <span
                  className="ff-quick"
                  style={{
                    fontSize: "clamp(14px, 1.05vw, 16px)",
                    lineHeight: 1.45,
                    color: "var(--ink)",
                  } satisfies React.CSSProperties}
                >
                  {row.award}
                </span>
              </div>
            ))}
            {/* Bottom border to close the last row */}
            <div
              aria-hidden
              style={{ borderTop: "1px solid var(--line)" } satisfies React.CSSProperties}
            />
          </div>
        </div>

        {/* CSS :hover tints award rows red */}
        <style>{`
          .brd-award-row:hover { border-color: var(--red) !important; }
          .brd-award-row:hover span:first-child { color: var(--red); }
        `}</style>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          5 — Founder's word: two-column off-white. Left: Fraunces display
          philosophy quote, Quicksand sentences, red italic signature. Right:
          portrait-ratio project photo framed with a thin border. Vertical
          hairline between columns. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "80svh",
          background: "var(--paper-2)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Proof" n={5} label="Founder&apos;s word" />
        <div
          className="wrap"
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            minHeight: "80svh",
          } satisfies React.CSSProperties}
        >
          {/* Left column */}
          <div
            className="frame"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingBlock: "clamp(56px, 8vw, 100px)",
              borderRight: "1px solid var(--line)",
            } satisfies React.CSSProperties}
          >
            <p
              className="eyebrow"
              style={{ marginBottom: "1.8em" } satisfies React.CSSProperties}
            >
              From Mick
            </p>
            <blockquote
              className="ff-fraunces"
              style={{
                fontWeight: 300,
                fontSize: "clamp(24px, 3vw, 46px)",
                lineHeight: 1.22,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                fontStyle: "italic",
                margin: "0 0 1.4em",
                maxWidth: "22ch",
              } satisfies React.CSSProperties}
            >
              &ldquo;We listen. We ask you questions. We listen again.&rdquo;
            </blockquote>
            <p
              className="ff-quick"
              style={{
                fontSize: "clamp(14px, 1vw, 16px)",
                lineHeight: 1.65,
                color: "var(--ink-soft)",
                maxWidth: "40ch",
                marginBottom: "2em",
              } satisfies React.CSSProperties}
            >
              Every build starts with understanding. Mick is on site, accessible,
              and accountable from the first conversation to handover and beyond.
            </p>
            <div>
              <p
                className="ff-fraunces"
                style={{
                  fontStyle: "italic",
                  fontSize: "clamp(16px, 1.3vw, 20px)",
                  color: "var(--red)",
                  lineHeight: 1,
                  marginBottom: "0.3em",
                } satisfies React.CSSProperties}
              >
                Mick Devlin
              </p>
              <p
                className="eyebrow"
                style={{
                  fontSize: "clamp(9px, 0.75vw, 10px)",
                  color: "var(--ink-soft)",
                } satisfies React.CSSProperties}
              >
                Founder, since 1996
              </p>
            </div>
          </div>

          {/* Right column: build photo as portrait-ratio placeholder */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              minHeight: "320px",
            } satisfies React.CSSProperties}
          >
            <Photo src={`${P}/noosa-heads.webp`} pos="center 30%" drift={false} />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          6 — Word-of-mouth marquee: ~62vh off-white band. Left fixed heading
          block; below, two rows of CSS marquee in opposite directions with red
          middot separators. Montserrat fragments, no JS. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "62svh",
          background: "var(--paper-warm)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Proof" n={6} label="Word-of-mouth marquee" />

        {/* Heading block */}
        <div
          className="frame"
          style={{
            paddingTop: "clamp(40px, 6vw, 72px)",
            paddingBottom: "clamp(28px, 4vw, 48px)",
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{ marginBottom: "0.6em" } satisfies React.CSSProperties}
          >
            Word of mouth
          </p>
          <p
            className="ff-quick"
            style={{
              fontSize: "clamp(14px, 1vw, 16px)",
              color: "var(--ink-soft)",
            } satisfies React.CSSProperties}
          >
            Most of our work comes by referral.
          </p>
        </div>

        {/* Marquee rows */}
        <div
          style={{
            overflow: "hidden",
            paddingBottom: "clamp(40px, 6vw, 72px)",
          } satisfies React.CSSProperties}
        >
          {/* Row 1: left to right */}
          <div
            aria-hidden
            style={{
              display: "flex",
              whiteSpace: "nowrap",
              animation: "brdMarqueeL 32s linear infinite",
              marginBottom: "clamp(10px, 1.2vw, 18px)",
              willChange: "transform",
            } satisfies React.CSSProperties}
          >
            {Array.from({ length: 3 }).map((_, rep) => (
              <span key={rep} style={{ display: "flex", alignItems: "center", gap: "0.7em" } satisfies React.CSSProperties}>
                {["Direct with Mick the whole way", "On budget, no surprises", "They listened", "We would build with them again", "Craftsmen, not just tradesmen"].map((frag, j) => (
                  <React.Fragment key={j}>
                    <span
                      className="ff-mont"
                      style={{
                        fontWeight: 600,
                        fontSize: "clamp(16px, 1.6vw, 24px)",
                        letterSpacing: "-0.01em",
                        textTransform: "uppercase",
                        color: "var(--ink)",
                        paddingInline: "clamp(12px, 1.5vw, 22px)",
                      } satisfies React.CSSProperties}
                    >
                      {frag}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--red)",
                        flexShrink: 0,
                      } satisfies React.CSSProperties}
                    />
                  </React.Fragment>
                ))}
              </span>
            ))}
          </div>

          {/* Row 2: right to left */}
          <div
            aria-hidden
            style={{
              display: "flex",
              whiteSpace: "nowrap",
              animation: "brdMarqueeR 38s linear infinite",
              willChange: "transform",
            } satisfies React.CSSProperties}
          >
            {Array.from({ length: 3 }).map((_, rep) => (
              <span key={rep} style={{ display: "flex", alignItems: "center", gap: "0.7em" } satisfies React.CSSProperties}>
                {["35+ years a qualified carpenter", "The smoothest project to date", "After handover, still there for us", "Referral only, for a reason", "A record on the Sunshine Coast"].map((frag, j) => (
                  <React.Fragment key={j}>
                    <span
                      className="ff-mont"
                      style={{
                        fontWeight: 500,
                        fontSize: "clamp(14px, 1.3vw, 20px)",
                        letterSpacing: "0.01em",
                        textTransform: "uppercase",
                        color: "var(--ink-soft)",
                        paddingInline: "clamp(12px, 1.5vw, 22px)",
                      } satisfies React.CSSProperties}
                    >
                      {frag}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "var(--red)",
                        flexShrink: 0,
                        opacity: 0.7,
                      } satisfies React.CSSProperties}
                    />
                  </React.Fragment>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Marquee keyframes */}
        <style>{`
          @keyframes brdMarqueeL {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
          @keyframes brdMarqueeR {
            from { transform: translateX(-33.333%); }
            to   { transform: translateX(0); }
          }
        `}</style>
      </section>
    </>
  );
}
