/**
 * Braeden homepage (final, cohesive) — STORY.
 *
 * Based on chooser option 4 "Sticky label, running story", restyled to the
 * cohesion spec: Montserrat + Quicksand + Space Mono only, white ground,
 * brand red sparingly, shared frame/wrap/pad-y classes.
 */

const P = "/braeden/projects";

export default function Story() {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--paper)",
        overflow: "hidden",
      } satisfies React.CSSProperties}
    >
      <div
        className="frame wrap"
        style={{
          display: "grid",
          gridTemplateColumns: "clamp(120px,16vw,200px) 1fr",
          gap: "clamp(32px,5vw,80px)",
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
              className="ff-mont"
              style={{
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--red)",
                borderBottom: "2px solid var(--red)",
                paddingBottom: "0.5em",
                marginBottom: "0.6em",
              } satisfies React.CSSProperties}
            >
              Our story
            </p>
            <p
              className="ff-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                color: "var(--ink-soft)",
                textTransform: "uppercase",
              } satisfies React.CSSProperties}
            >
              Est. 1996
            </p>
          </div>
        </div>

        {/* RIGHT — content column */}
        <div style={{ position: "relative" } satisfies React.CSSProperties}>
          {/* Pull-line headline */}
          <h2
            className="ff-mont"
            style={{
              fontWeight: 800,
              fontSize: "clamp(26px,3.2vw,52px)",
              lineHeight: 1.1,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              color: "var(--ink)",
              maxWidth: "22ch",
              marginBottom: "1.4em",
            } satisfies React.CSSProperties}
          >
            More than 35 years building on the Sunshine Coast, and most of our
            work still comes by referral.
          </h2>

          {/* Body copy — Quicksand, sentence case */}
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
            Mick Devlin started Braeden in 1996 and moved to Noosa in 2001.
          </p>
          <p
            className="ff-quick"
            style={{
              fontSize: "clamp(15px,1.05vw,17px)",
              lineHeight: 1.7,
              color: "var(--ink-soft)",
              maxWidth: "44ch",
              marginBottom: "1.6em",
            } satisfies React.CSSProperties}
          >
            On every build you deal directly with Mick, start to finish.
          </p>

          {/* Space Mono microdetail — awards note */}
          <p
            className="ff-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
              marginBottom: "2.4em",
              lineHeight: 1.6,
            } satisfies React.CSSProperties}
          >
            5&times; House of the Year &middot; National Master Builder of the Year, 2010
          </p>

          {/* Red CTA link */}
          <a href="/braeden/about" className="redlink">
            About Mick <span className="ar">&rarr;</span>
          </a>

          {/* Landscape photo anchored bottom-right */}
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "clamp(200px,30vw,420px)",
              aspectRatio: "4/3",
              overflow: "hidden",
              borderRadius: 2,
            } satisfies React.CSSProperties}
          >
            <img
              src={`${P}/cooroy-mountain.webp`}
              alt="Cooroy Mountain custom home by Braeden Constructions"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              } satisfies React.CSSProperties}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
