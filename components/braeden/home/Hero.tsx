/**
 * Braeden homepage — HERO (cohesive card system, based on the Awards section).
 * Type-led: the bold Montserrat statement, a Space Mono awards strip, one CTA,
 * centred in the shared card. No full-bleed photo; the work leads in Featured.
 */

import { Fragment } from "react";

const AWARDS = ["Est. 1996", "5× House of the Year", "National Master Builder of the Year"];

export default function Hero() {
  return (
    <section className="bsec">
      <div className="bcard" style={{ display: "grid", placeItems: "center", textAlign: "center", minHeight: "min(80vh, 820px)" }}>
        <div style={{ maxWidth: 960 }}>
          <p className="eyebrow" style={{ marginBottom: "1.9em" }}>Braeden Constructions · Noosa, since 1996</p>
          <h1 className="ff-mont" style={{ fontWeight: 800, fontSize: "clamp(36px,5.4vw,94px)", lineHeight: 1.0, letterSpacing: "0.005em", textTransform: "uppercase", color: "var(--ink)", margin: 0 }}>
            We listen. We build.<br />You come home.
          </h1>
          <p className="ff-quick" style={{ fontSize: "clamp(15px,1.2vw,19px)", lineHeight: 1.6, color: "var(--ink-soft)", maxWidth: "46ch", margin: "1.5em auto 0" }}>
            Custom homes on the Sunshine Coast. You deal direct with Mick, start to finish.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", columnGap: "clamp(16px,2.1vw,30px)", rowGap: 8, margin: "clamp(28px,3.6vw,46px) 0 0" }}>
            {AWARDS.map((a, i) => (
              <Fragment key={a}>
                {i > 0 && <span aria-hidden style={{ width: 5, height: 5, borderRadius: 999, background: "var(--red)", display: "inline-block" }} />}
                <span className="ff-mono" style={{ fontSize: "clamp(9.5px,0.8vw,11px)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-soft)" }}>{a}</span>
              </Fragment>
            ))}
          </div>
          <div style={{ marginTop: "clamp(28px,3.4vw,44px)" }}>
            <a href="#contact" className="brd-btn">Start a conversation</a>
          </div>
        </div>
      </div>
    </section>
  );
}
