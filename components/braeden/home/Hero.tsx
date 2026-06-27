/**
 * Braeden homepage (final, cohesive) — HERO.
 *
 * Finbar's pick + refinement: full-bleed, image-led, the statement set in the
 * bold Montserrat wordmark treatment (800, uppercase, tracked, like the logo),
 * no eyebrow subheading, and a Lindon-style awards strip. The brightest build in
 * the set (the Peregian home) leads. Cohesion system: Montserrat + Quicksand,
 * white/#222/red #E1251B, imagery first.
 */

import { Fragment } from "react";

const P = "/braeden/projects";
const AWARDS = ["Est. 1996", "5× House of the Year", "National Master Builder of the Year"];

export default function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100svh", overflow: "hidden", background: "#2b2b2e", display: "grid", placeItems: "center" }}>
      <img
        src={`${P}/peregian.webp`}
        alt="A Braeden custom home on the Sunshine Coast"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 54%", animation: "brdKen 22s ease-in-out infinite alternate" }}
      />
      {/* Lighter image, so a soft radial pool + bottom anchor keeps it airy while
          the bold white type still reads (helped by a faint text-shadow). */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(125% 105% at 50% 48%, rgba(18,18,20,0.50) 0%, rgba(18,18,20,0.22) 46%, rgba(18,18,20,0) 82%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(18,18,20,0.40), rgba(18,18,20,0) 150px), linear-gradient(to top, rgba(18,18,20,0.42), rgba(18,18,20,0) 34%)" }} />
      <div className="frame" style={{ position: "relative", textAlign: "center", color: "#fff", maxWidth: 1080, textShadow: "0 1px 24px rgba(15,15,18,0.34)" }}>
        <h1 className="ff-mont" style={{ fontWeight: 800, fontSize: "clamp(38px,6vw,104px)", lineHeight: 1.0, letterSpacing: "0.005em", textTransform: "uppercase", maxWidth: "15ch", margin: "0 auto", color: "#fff" }}>
          We listen. We build.<br />You come home.
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", columnGap: "clamp(16px,2.1vw,30px)", rowGap: 8, marginTop: "clamp(26px,3.4vw,44px)" }}>
          {AWARDS.map((a, i) => (
            <Fragment key={a}>
              {i > 0 && <span aria-hidden style={{ width: 5, height: 5, borderRadius: 999, background: "var(--red)", display: "inline-block" }} />}
              <span className="ff-mont" style={{ fontSize: "clamp(10px,1vw,12px)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.17em", color: "rgba(255,255,255,0.88)" }}>{a}</span>
            </Fragment>
          ))}
        </div>
      </div>
      <span style={{ position: "absolute", bottom: "clamp(20px,3vw,36px)", left: 0, right: 0, textAlign: "center", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-montserrat)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}>Scroll</span>
    </section>
  );
}
