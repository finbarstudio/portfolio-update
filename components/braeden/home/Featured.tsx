/**
 * Braeden homepage (final, cohesive) — FEATURED WORK.
 *
 * Option 6 "Offset overlapping stack" restyled to the unified cohesion system:
 * Montserrat + Quicksand only, white ground, red sparingly, generous white space.
 * Three full-colour project plates on an asymmetric 12-column grid with project
 * names + award microdetail in the negative space beside each plate.
 */

const P = "/braeden/projects";

export default function Featured() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        background: "#ffffff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      } satisfies React.CSSProperties}
    >
      {/* ── Section label: centred Montserrat caps eyebrow, no top rule ── */}
      <div
        className="frame"
        style={{
          textAlign: "center",
          paddingTop: "clamp(72px,9vw,140px)",
          paddingBottom: "clamp(32px,4vw,56px)",
          flexShrink: 0,
        } satisfies React.CSSProperties}
      >
        <p
          className="eyebrow"
          style={{ margin: 0 } satisfies React.CSSProperties}
        >
          Selected work
        </p>
      </div>

      {/* ── Asymmetric composition: 12-column grid ──────────────────────────
          Layout:
            col 1-7, rows 1-2 = Plate A (Modern Thai House) — large, left-of-centre
            col 8-10, row 1   = Plate A label (negative space above Plate C)
            col 11-13, row 1  = Plate B (Peregian) — upper-right smaller plate
            col 8-10, row 2   = Plate C (Riverside / Noosaville) — lower-right overlap
            col 11-13, row 2  = Plate B label (negative space below Plate B)
         ── */}
      <div
        className="frame"
        style={{
          position: "relative",
          flex: "1 1 auto",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "1fr 1fr",
          gap: "clamp(10px, 1.2vw, 18px)",
          paddingBottom: "clamp(80px, 10vw, 140px)",
          minHeight: "clamp(480px, 64vh, 840px)",
        } satisfies React.CSSProperties}
      >
        {/* ── Plate A: Modern Thai House — large, col 1-7, rows 1-2 ── */}
        <div
          style={{
            gridColumn: "1 / 8",
            gridRow: "1 / 3",
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
          } satisfies React.CSSProperties}
        >
          <img
            src={`${P}/modern-thai.webp`}
            alt="Modern Thai House, Noosa Heads"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 42%",
              display: "block",
            } satisfies React.CSSProperties}
          />
          {/* Red location dot — only on the primary/topmost plate */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: "clamp(14px, 1.6vw, 22px)",
              left: "clamp(14px, 1.6vw, 22px)",
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--red)",
              zIndex: 2,
            } satisfies React.CSSProperties}
          />
        </div>

        {/* ── Plate A label: negative space col 8-10, row 1 ── */}
        <div
          style={{
            gridColumn: "8 / 11",
            gridRow: "1 / 2",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: "clamp(10px, 1.2vw, 18px)",
            paddingLeft: "clamp(4px, 0.5vw, 8px)",
          } satisfies React.CSSProperties}
        >
          <h2
            className="ff-mont caps"
            style={{
              fontWeight: 800,
              fontSize: "clamp(12px, 1.15vw, 17px)",
              letterSpacing: "0.08em",
              color: "var(--ink)",
              margin: 0,
              lineHeight: 1.18,
            } satisfies React.CSSProperties}
          >
            Modern Thai House
          </h2>
          <p
            className="ff-quick"
            style={{
              fontSize: "clamp(10px, 0.9vw, 13px)",
              color: "var(--ink-soft)",
              marginTop: "0.5em",
              lineHeight: 1.5,
            } satisfies React.CSSProperties}
          >
            Noosa Heads &middot; MBA Queensland House of the Year
          </p>
        </div>

        {/* ── Plate B: Peregian — upper-right, col 11-13, row 1 ── */}
        <div
          style={{
            gridColumn: "11 / 13",
            gridRow: "1 / 2",
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
          } satisfies React.CSSProperties}
        >
          <img
            src={`${P}/peregian.webp`}
            alt="Peregian Beach House, Sunshine Coast"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
              display: "block",
            } satisfies React.CSSProperties}
          />
        </div>

        {/* ── Plate C: Riverside (Noosaville) — overlapping lower-right, col 8-10, row 2 ── */}
        <div
          style={{
            gridColumn: "8 / 11",
            gridRow: "2 / 3",
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
          } satisfies React.CSSProperties}
        >
          <img
            src={`${P}/noosaville.webp`}
            alt="Riverside, Noosaville"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 35%",
              display: "block",
            } satisfies React.CSSProperties}
          />
        </div>

        {/* ── Plate B + C labels: col 11-13, row 2 — stacked in negative space ── */}
        <div
          style={{
            gridColumn: "11 / 13",
            gridRow: "2 / 3",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingLeft: "clamp(4px, 0.5vw, 8px)",
            paddingBlock: "clamp(8px, 1vw, 14px)",
          } satisfies React.CSSProperties}
        >
          {/* Peregian label — top of this negative-space cell */}
          <div>
            <h2
              className="ff-mont caps"
              style={{
                fontWeight: 800,
                fontSize: "clamp(11px, 1vw, 15px)",
                letterSpacing: "0.08em",
                color: "var(--ink)",
                margin: 0,
                lineHeight: 1.18,
              } satisfies React.CSSProperties}
            >
              Peregian
            </h2>
            <p
              className="ff-quick"
              style={{
                fontSize: "clamp(9px, 0.82vw, 12px)",
                color: "var(--ink-soft)",
                marginTop: "0.4em",
                lineHeight: 1.45,
              } satisfies React.CSSProperties}
            >
              Sunshine Coast
            </p>
          </div>

          {/* Riverside label — bottom of this negative-space cell */}
          <div>
            <h2
              className="ff-mont caps"
              style={{
                fontWeight: 800,
                fontSize: "clamp(11px, 1vw, 15px)",
                letterSpacing: "0.08em",
                color: "var(--ink)",
                margin: 0,
                lineHeight: 1.18,
              } satisfies React.CSSProperties}
            >
              Riverside
            </h2>
            <p
              className="ff-quick"
              style={{
                fontSize: "clamp(9px, 0.82vw, 12px)",
                color: "var(--ink-soft)",
                marginTop: "0.4em",
                lineHeight: 1.5,
              } satisfies React.CSSProperties}
            >
              Noosaville &middot; 2025 Best Individual Home
            </p>
            <p
              className="ff-mono"
              style={{
                fontSize: "clamp(8px, 0.7vw, 10px)",
                color: "var(--ink-soft)",
                marginTop: "0.35em",
                letterSpacing: "0.04em",
              } satisfies React.CSSProperties}
            >
              MBA Sunshine Coast
            </p>
          </div>
        </div>
      </div>

      {/* ── "View all projects" — bottom-right, red link ── */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(24px, 3vw, 44px)",
          right: "var(--gutter)",
        } satisfies React.CSSProperties}
      >
        <a href="/projects" className="redlink">
          View all projects <span className="ar">&rarr;</span>
        </a>
      </div>
    </section>
  );
}
