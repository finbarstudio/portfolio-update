/**
 * Braeden homepage — HERO options to choose from (image-focused, but in the same
 * theme: Montserrat-800 statement, Space Mono awards, red accent, the brand
 * tokens). Three directions, each tagged. Pick one and it becomes the hero.
 *   A — Full-bleed statement   B — Split   C — Bento
 */

import { Fragment } from "react";

const P = "/braeden/projects";
const STATEMENT = (
  <>
    We listen. We build.<br />You come home.
  </>
);
const AWARDS = ["Est. 1996", "5× House of the Year", "National Master Builder of the Year"];

function Tag({ label }: { label: string }) {
  return <div className="brd-opt-tag"><b>Hero</b> {label}</div>;
}

function Strip({ light }: { light?: boolean }) {
  const col = light ? "rgba(255,255,255,0.88)" : "var(--ink-soft)";
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: "clamp(15px,2vw,28px)", rowGap: 8 }}>
      {AWARDS.map((a, i) => (
        <Fragment key={a}>
          {i > 0 && <span aria-hidden style={{ width: 5, height: 5, borderRadius: 999, background: "var(--red)", display: "inline-block" }} />}
          <span className="ff-mono" style={{ fontSize: "clamp(9.5px,0.78vw,11px)", letterSpacing: "0.12em", textTransform: "uppercase", color: col }}>{a}</span>
        </Fragment>
      ))}
    </div>
  );
}

export default function HeroChoices() {
  return (
    <>
      {/* A — Full-bleed statement */}
      <section className="bhero brd-opt" style={{ display: "grid", placeItems: "center", background: "#2b2b2e" }}>
        <Tag label="A — Full-bleed statement" />
        <img className="bhero-photo" src={`${P}/peregian.webp`} alt="" aria-hidden />
        <div className="bhero-scrim-radial" />
        <div className="bhero-scrim-edge" />
        <div className="frame" style={{ position: "relative", textAlign: "center", color: "#fff", maxWidth: 1080, textShadow: "0 1px 24px rgba(15,15,18,0.4)" }}>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.82)", marginBottom: "1.7em" }}>Braeden Constructions · Noosa, since 1996</p>
          <h1 className="ff-mont" style={{ fontWeight: 800, fontSize: "clamp(38px,5.6vw,98px)", lineHeight: 1.0, letterSpacing: "0.005em", textTransform: "uppercase", maxWidth: "15ch", margin: "0 auto", color: "#fff" }}>{STATEMENT}</h1>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(26px,3.4vw,44px)" }}><Strip light /></div>
        </div>
      </section>

      {/* B — Split: text left, full-height image right */}
      <section className="bhero brd-opt" style={{ background: "var(--paper)" }}>
        <Tag label="B — Split" />
        <div className="bhero-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100svh" }}>
          <div style={{ display: "grid", placeItems: "center", padding: "clamp(40px,6vw,96px) var(--gutter)" }}>
            <div style={{ maxWidth: 560 }}>
              <p className="eyebrow" style={{ marginBottom: "1.7em" }}>Braeden Constructions · Noosa, since 1996</p>
              <h1 className="ff-mont" style={{ fontWeight: 800, fontSize: "clamp(34px,3.8vw,70px)", lineHeight: 1.0, letterSpacing: "0.005em", textTransform: "uppercase", color: "var(--ink)", margin: 0 }}>{STATEMENT}</h1>
              <p className="ff-quick" style={{ fontSize: "clamp(15px,1.1vw,18px)", lineHeight: 1.6, color: "var(--ink-soft)", maxWidth: "42ch", margin: "1.4em 0 0" }}>Custom homes on the Sunshine Coast. You deal direct with Mick, start to finish.</p>
              <div style={{ margin: "clamp(24px,3vw,38px) 0" }}><Strip /></div>
              <a href="#contact" className="brd-btn">Start a conversation</a>
            </div>
          </div>
          <div style={{ position: "relative", overflow: "hidden", minHeight: "46vh" }}>
            <img className="bhero-photo" src={`${P}/modern-thai.webp`} alt="A Braeden custom home" style={{ animation: "none" }} />
          </div>
        </div>
      </section>

      {/* C — Bento: a big image with two stacked tiles */}
      <section className="bhero brd-opt" style={{ background: "var(--paper)", display: "grid", placeItems: "center", padding: "clamp(26px,4.5vh,60px) var(--gutter)" }}>
        <Tag label="C — Bento" />
        <div style={{ width: "100%", maxWidth: 1280 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gridAutoRows: "minmax(0, 1fr)", gap: "clamp(10px,1.1vw,16px)", height: "min(82vh, 820px)" }}>
            <a href="/braeden/site/projects" data-cursor="View project" className="b-bento-cell" style={{ gridRow: "span 2" }}>
              <img src={`${P}/modern-thai.webp`} alt="Modern Thai House, Noosa Heads" />
              <div className="b-bento-cap"><span className="n">Modern Thai House</span><span className="m">Noosa Heads</span></div>
            </a>
            <div style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "clamp(12px,1.1vw,18px)", padding: "clamp(22px,2.4vw,40px)", display: "grid", alignContent: "center" }}>
              <p className="eyebrow" style={{ marginBottom: "1.3em" }}>Since 1996</p>
              <h1 className="ff-mont" style={{ fontWeight: 800, fontSize: "clamp(24px,2.2vw,44px)", lineHeight: 1.02, letterSpacing: "0.005em", textTransform: "uppercase", color: "var(--ink)", margin: 0 }}>{STATEMENT}</h1>
            </div>
            <div style={{ background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: "clamp(12px,1.1vw,18px)", padding: "clamp(22px,2.4vw,40px)", display: "grid", alignContent: "center", gap: "1.4em" }}>
              <Strip />
              <a href="#contact" className="brd-btn" style={{ justifySelf: "start" }}>Start a conversation</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
