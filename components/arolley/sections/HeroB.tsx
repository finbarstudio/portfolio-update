/**
 * Hero option B — asymmetric editorial split. A big left-aligned Spectral
 * statement against a right column carrying the brief story + a heritage meta
 * row, with a hairline across the top. Structured and grid-driven, no image.
 */
export default function HeroB() {
  return (
    <section className="frame flex flex-col justify-center relative" style={{ minHeight: "100svh", paddingTop: "clamp(96px,12vh,140px)", paddingBottom: "clamp(48px,7vh,96px)" }}>
      <span className="arl-opt">Hero option B · split</span>
      <div className="wrap w-full">
        <hr className="rule" />
        <p className="eyebrow" style={{ marginTop: "clamp(24px,3vw,40px)" }}>Fourth-generation Sunshine Coast builders</p>
        <div className="grid grid-cols-1 md:grid-cols-12 items-end" style={{ gap: "clamp(28px,4vw,64px)", marginTop: "clamp(20px,2.5vw,36px)" }}>
          <h1 className="display md:col-span-8" style={{ fontSize: "var(--step-display)", maxWidth: "14ch" }}>
            Homes you&rsquo;ll want to call <span className="display-italic accent">home</span>.
          </h1>
          <div className="md:col-span-4">
            <p className="lead" style={{ maxWidth: "34ch" }}>
              Light-filled, energy-considered homes that sit easily in the subtropics, built to last.
            </p>
            <ul className="grid grid-cols-2" style={{ gap: "clamp(16px,2vw,28px)", marginTop: "clamp(24px,3vw,40px)", borderTop: "1px solid var(--line)", paddingTop: "clamp(16px,2vw,24px)", width: "fit-content" }}>
              {[{ n: "1968", l: "On the Coast since" }, { n: "4", l: "Generations" }].map((s) => (
                <li key={s.l}>
                  <span className="display" style={{ fontSize: "var(--step-h3)", display: "block", lineHeight: 1 }}>{s.n}</span>
                  <span className="eyebrow" style={{ display: "block", marginTop: "0.6em" }}>{s.l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
