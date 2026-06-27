/**
 * Braeden homepage CHOOSER — HERO, six options.
 *
 * Each option is a full ~100svh hero grounded in a real gallery archetype (see
 * tasks/wapsw0cc5.output), exploring a different display font + colour shift but
 * all within ~20% of Braeden's DNA: light ground, charcoal ink #222, the brand
 * red #E1251B as sparing punctuation, Montserrat/Quicksand as the system, photos
 * leading. Copy is faithful to Braeden (Mick Devlin, est. 1996, Noosa, "we
 * listen…"). A small tag names each option so Finbar can pick one.
 */

const P = "/braeden/projects";

function Tag({ n, label }: { n: number; label: string }) {
  return (
    <div className="brd-opt-tag"><b>Hero · {n}</b> {label}</div>
  );
}

function Photo({ src, pos = "center", drift = true }: { src: string; pos?: string; drift?: boolean }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: pos,
        animation: drift ? "brdKen 22s ease-in-out infinite alternate" : undefined,
      }}
    />
  );
}

const RADIAL_SCRIM =
  "radial-gradient(120% 90% at 50% 54%, rgba(20,20,22,0.62) 0%, rgba(20,20,22,0.30) 42%, rgba(20,20,22,0) 78%)";
const TOP_WASH = "linear-gradient(to bottom, rgba(20,20,22,0.45), rgba(20,20,22,0) 160px)";
const BOTTOM_SCRIM = "linear-gradient(to top, rgba(20,20,22,0.55), rgba(20,20,22,0) 46%)";

export default function HeroOptions() {
  return (
    <>
      {/* 1 — Full-bleed drift: cinematic photo hero, centred Montserrat statement
          over a radial scrim. The DNA baseline; imagery leads, story is one line. */}
      <section className="brd-opt" style={{ position: "relative", minHeight: "100svh", overflow: "hidden", background: "#161618", display: "grid", placeItems: "center" }}>
        <Tag n={1} label="Full-bleed drift" />
        <Photo src={`${P}/modern-thai.webp`} pos="center 42%" />
        <div style={{ position: "absolute", inset: 0, background: RADIAL_SCRIM }} />
        <div style={{ position: "absolute", inset: 0, background: TOP_WASH }} />
        <div className="frame" style={{ position: "relative", textAlign: "center", color: "#fff", maxWidth: 980 }}>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.78)", marginBottom: "1.4em" }}>Award-winning custom homes · Noosa hinterland, since 1996</p>
          <h1 className="ff-mont" style={{ fontWeight: 700, fontSize: "clamp(34px,4.8vw,76px)", lineHeight: 1.04, letterSpacing: "-0.01em", maxWidth: "18ch", margin: "0 auto", color: "#fff" }}>
            We listen. We build.<br />You come home.
          </h1>
        </div>
        <span style={{ position: "absolute", bottom: "clamp(20px,3vw,36px)", left: 0, right: 0, textAlign: "center", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-montserrat)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}>Scroll</span>
      </section>

      {/* 2 — Editorial wordmark: type-led title card on warm off-white, a big
          Fraunces serif statement, the project imagery deferred to a band at 100vh. */}
      <section className="brd-opt" style={{ position: "relative", minHeight: "100svh", background: "var(--paper-warm)", display: "grid", placeItems: "center", overflow: "hidden" }}>
        <Tag n={2} label="Editorial wordmark" />
        <div className="frame" style={{ textAlign: "center", maxWidth: 1100 }}>
          <p className="eyebrow" style={{ marginBottom: "1.8em" }}>Bespoke homes · Sunshine Coast</p>
          <h1 className="ff-fraunces" style={{ fontWeight: 300, fontSize: "clamp(40px,6.2vw,108px)", lineHeight: 1.02, letterSpacing: "-0.015em", maxWidth: "15ch", margin: "0 auto", color: "var(--ink)" }}>
            Homes that make the most of the land
          </h1>
          <p className="lead" style={{ marginTop: "1.7em", maxWidth: "44ch", marginInline: "auto" }}>
            Deal direct with Mick on every build, start to finish.
          </p>
          <span aria-hidden style={{ display: "block", width: 1, height: 46, background: "var(--line-2)", margin: "2.4em auto 0" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "14vh" }}>
          <Photo src={`${P}/noosaville.webp`} pos="center 40%" drift={false} />
        </div>
      </section>

      {/* 3 — Split editorial: statement column left (Poppins, the DNA-sanctioned
          Montserrat sibling), one tall project photo bleeding off the right. */}
      <section className="brd-opt" style={{ position: "relative", minHeight: "100svh", background: "#f4f4f2", overflow: "hidden" }}>
        <Tag n={3} label="Split editorial" />
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", minHeight: "100svh" }}>
          <div className="frame" style={{ display: "grid", placeItems: "center", textAlign: "center" }}>
            <div style={{ maxWidth: 560 }}>
              <p className="eyebrow" style={{ marginBottom: "1.5em" }}>Custom builder · Noosa hinterland</p>
              <h1 className="ff-poppins" style={{ fontWeight: 700, fontSize: "clamp(32px,3.4vw,60px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--ink)" }}>
                Built around your block, not a template
              </h1>
              <p className="lead" style={{ marginTop: "1.4em", maxWidth: "38ch", marginInline: "auto" }}>
                Thirty years of bespoke homes on the Sunshine Coast.
              </p>
            </div>
          </div>
          <div style={{ position: "relative", borderLeft: "1px solid var(--line)" }}>
            <Photo src={`${P}/river-haven.webp`} pos="center" />
          </div>
        </div>
      </section>

      {/* 4 — Warm clay light: bright daylight photo, soft warm scrim, an airy
          Cormorant serif statement in charcoal (dark-on-light), luxury-Noosa. */}
      <section className="brd-opt" style={{ position: "relative", minHeight: "100svh", overflow: "hidden", background: "#efe9df", display: "grid", placeItems: "center" }}>
        <Tag n={4} label="Warm clay light" />
        <Photo src={`${P}/sunshine-beach.webp`} pos="center 60%" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(250,246,239,0.30), rgba(250,246,239,0.05) 38%, rgba(40,30,24,0.18))" }} />
        <div className="frame" style={{ position: "relative", textAlign: "center", maxWidth: 980 }}>
          <p className="eyebrow" style={{ color: "var(--ink)", marginBottom: "1.4em" }}>Sunshine Coast · since 1996</p>
          <h1 className="ff-cormorant" style={{ fontWeight: 400, fontSize: "clamp(38px,5.4vw,92px)", lineHeight: 1.02, letterSpacing: "0", maxWidth: "16ch", margin: "0 auto", color: "var(--ink)" }}>
            A home that belongs to its place
          </h1>
        </div>
      </section>

      {/* 5 — Quiet monogram: maximal negative space, a compact Space Grotesk
          statement, the photo entering only as a slim horizon strip at the base. */}
      <section className="brd-opt" style={{ position: "relative", minHeight: "100svh", background: "#fcfbf9", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Tag n={5} label="Quiet monogram" />
        <div className="frame" style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", paddingTop: "8vh" }}>
          <div style={{ maxWidth: 760 }}>
            <p className="eyebrow" style={{ marginBottom: "1.6em" }}>Est. 1996</p>
            <h1 className="ff-grotesk" style={{ fontWeight: 500, fontSize: "clamp(28px,3.4vw,52px)", lineHeight: 1.12, letterSpacing: "-0.01em", maxWidth: "20ch", margin: "0 auto", color: "var(--ink)" }}>
              Custom homes, built once and built right
            </h1>
            <span aria-hidden style={{ display: "block", width: 26, height: 2, background: "var(--red)", margin: "1.8em auto 0" }} />
          </div>
        </div>
        <div style={{ position: "relative", height: "22vh", minHeight: 150 }}>
          <Photo src={`${P}/peregian.webp`} pos="center 45%" drift={false} />
        </div>
      </section>

      {/* 6 — Centred frame: a mounted-print photo inset in a wide matte, type set
          in the lower matte (Fraunces), corner ticks as a craft detail. */}
      <section className="brd-opt" style={{ position: "relative", minHeight: "100svh", background: "#f2efe9", display: "grid", placeItems: "center" }}>
        <Tag n={6} label="Centred frame" />
        <div style={{ position: "relative", width: "100%", minHeight: "100svh", padding: "clamp(20px,4vw,64px)", display: "flex", flexDirection: "column", gap: "clamp(20px,3vw,40px)" }}>
          <div style={{ position: "relative", flex: 1, overflow: "hidden", minHeight: "46vh" }}>
            <Photo src={`${P}/noosa-heads.webp`} pos="center 44%" />
            {[
              { top: 10, left: 10, b: "border-top,border-left" },
              { top: 10, right: 10, b: "border-top,border-right" },
              { bottom: 10, left: 10, b: "border-bottom,border-left" },
              { bottom: 10, right: 10, b: "border-bottom,border-right" },
            ].map((c, i) => (
              <span key={i} aria-hidden style={{ position: "absolute", width: 18, height: 18, top: c.top, left: c.left, right: c.right, bottom: c.bottom, borderTop: c.b.includes("border-top") ? "1.5px solid rgba(255,255,255,0.85)" : undefined, borderBottom: c.b.includes("border-bottom") ? "1.5px solid rgba(255,255,255,0.85)" : undefined, borderLeft: c.b.includes("border-left") ? "1.5px solid rgba(255,255,255,0.85)" : undefined, borderRight: c.b.includes("border-right") ? "1.5px solid rgba(255,255,255,0.85)" : undefined }} />
            ))}
          </div>
          <div style={{ textAlign: "center", paddingBottom: "clamp(6px,1.5vw,20px)" }}>
            <p className="eyebrow" style={{ marginBottom: "0.9em" }}>Multi-award-winning · Noosa</p>
            <h1 className="ff-fraunces" style={{ fontWeight: 300, fontSize: "clamp(26px,3.2vw,52px)", lineHeight: 1.08, letterSpacing: "-0.01em", maxWidth: "22ch", margin: "0 auto", color: "var(--ink)" }}>
              Three decades of homes the coast remembers
            </h1>
          </div>
        </div>
      </section>
    </>
  );
}
