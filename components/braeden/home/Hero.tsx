/**
 * Braeden homepage — HERO (Finbar's pick: option C, the bento). Image-led: a big
 * project tile beside a statement tile and an awards / CTA tile, on theme with
 * the bento projects below. Aligned to the shared content column (.bcol) so its
 * left/right edges match every other section. Visible immediately (not reveal-gated).
 */

import { Fragment } from "react";

const P = "/braeden/projects";
const AWARDS = ["Est. 1996", "5× House of the Year", "National Master Builder of the Year"];

const tile: React.CSSProperties = {
  background: "var(--paper-2)",
  border: "1px solid var(--line)",
  borderRadius: "clamp(12px,1.1vw,18px)",
  padding: "clamp(24px,2.6vw,46px)",
  display: "grid",
  alignContent: "center",
};

export default function Hero() {
  return (
    <section className="bhero" style={{ background: "var(--paper)", display: "grid", placeItems: "center", padding: "clamp(80px,10vh,120px) var(--gutter)" }}>
      <div className="bcol">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gridAutoRows: "minmax(0, 1fr)", gap: "clamp(10px,1.1vw,16px)", height: "min(70vh, 700px)" }}>
          <a href="/braeden/site/projects" data-cursor="View project" className="b-bento-cell" style={{ gridRow: "span 2" }}>
            <img src={`${P}/modern-thai.webp`} alt="Modern Thai House, Noosa Heads" />
            <div className="b-bento-cap"><span className="n">Modern Thai House</span><span className="m">Noosa Heads</span></div>
          </a>

          <div style={tile}>
            <p className="eyebrow" style={{ marginBottom: "1.3em" }}>Braeden Constructions · since 1996</p>
            <h1 className="ff-mont" style={{ fontWeight: 800, fontSize: "clamp(24px,2.3vw,46px)", lineHeight: 1.03, letterSpacing: "0.005em", textTransform: "uppercase", color: "var(--ink)", margin: 0 }}>
              We listen. We build. You come home.
            </h1>
          </div>

          <div style={{ ...tile, gap: "1.5em" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: "clamp(14px,1.8vw,24px)", rowGap: 8 }}>
              {AWARDS.map((a, i) => (
                <Fragment key={a}>
                  {i > 0 && <span aria-hidden style={{ width: 5, height: 5, borderRadius: 999, background: "var(--red)", display: "inline-block" }} />}
                  <span className="ff-mono" style={{ fontSize: "clamp(9px,0.74vw,10.5px)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-soft)" }}>{a}</span>
                </Fragment>
              ))}
            </div>
            <a href="#contact" className="brd-btn" style={{ justifySelf: "start" }}>Start a conversation</a>
          </div>
        </div>
      </div>
    </section>
  );
}
