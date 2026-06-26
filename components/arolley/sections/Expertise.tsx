import MaskReveal from "../MaskReveal";

/** Concise "what we do" strip for the home. Minimal and type-led: a short intro
 *  beside a numbered list of the core services, generous padding, hairlines. */
const SERVICES: { t: string; d: string }[] = [
  { t: "New custom homes", d: "Architect-led homes built from the ground up, designed around how you live." },
  { t: "Renovations & extensions", d: "Reworking and adding to the homes you already love, with as little disruption as we can manage." },
  { t: "Sustainable building", d: "Energy-considered homes that cost less to run and sit lighter on the block." },
  { t: "Knockdown & rebuild", d: "Starting fresh on a site you already own, in a suburb you already love." },
];

export default function Expertise() {
  return (
    <section id="expertise" className="frame pad-y">
      <div className="wrap grid grid-cols-1 md:grid-cols-12" style={{ gap: "clamp(28px,4vw,72px)" }}>
        <div className="md:col-span-4">
          <p className="eyebrow">What we do</p>
          <h2 className="display" style={{ fontSize: "var(--step-h2)", marginTop: "0.5em", maxWidth: "12ch" }}>
            One team, <span className="display-italic accent">start to finish.</span>
          </h2>
          <p className="lead" style={{ marginTop: "clamp(16px,2vw,26px)", maxWidth: "38ch" }}>
            We like to be in early, so the budget is real and the design is buildable. From there it is
            the same hands the whole way through.
          </p>
        </div>

        <ol className="md:col-span-7 md:col-start-6" style={{ display: "grid", gap: 0 }}>
          {SERVICES.map((s, i) => (
            <MaskReveal key={s.t} delay={i * 0.05}>
              <li className="grid items-baseline" style={{ gridTemplateColumns: "auto 1fr", gap: "clamp(16px,3vw,44px)", padding: "clamp(20px,2.4vw,32px) 0", borderTop: "1px solid var(--line)" }}>
                <span className="eyebrow accent" style={{ paddingTop: "0.4em" }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="display" style={{ fontSize: "var(--step-h3)" }}>{s.t}</h3>
                  <p style={{ marginTop: "0.5em", fontSize: "var(--step-body)", lineHeight: 1.55, color: "var(--ink-soft)", maxWidth: "48ch" }}>{s.d}</p>
                </div>
              </li>
            </MaskReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
