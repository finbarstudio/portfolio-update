import MaskReveal from "../MaskReveal";

const VALUES: { t: string; d: string }[] = [
  { t: "Client focus", d: "We listen first, and we keep you in the loop the whole way through." },
  { t: "Integrity", d: "Honest advice and honest pricing, with no surprises at the end." },
  { t: "Craft", d: "Workmanship we are happy to put the family name on." },
  { t: "Light & space", d: "Homes designed to sit easily in the subtropics, open and full of light." },
  { t: "Sustainability", d: "Energy-considered builds that cost less to live in and last longer." },
  { t: "Built to last", d: "Made for the long run, not the trend, and not the weather." },
];

const TEAM: { n: string; r: string }[] = [
  { n: "Dan Rolley", r: "Director & Principal Supervisor · fourth generation" },
  { n: "Lee Rolley", r: "Business Development · joined 2006" },
  { n: "Sarah Molyneux", r: "Office Manager" },
  { n: "Jarrod Goodwin", r: "Apprentice Carpenter" },
];

export default function Values() {
  return (
    <section className="frame pad-y">
      <div className="wrap">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "clamp(28px,3vw,56px)", marginTop: "clamp(28px,3.5vw,56px)" }}>
          {VALUES.map((v, i) => (
            <MaskReveal key={v.t} delay={(i % 3) * 0.05}>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "clamp(16px,1.6vw,22px)" }}>
                <h3 className="display" style={{ fontSize: "var(--step-h3)" }}>{v.t}</h3>
                <p style={{ marginTop: "0.6em", fontSize: "var(--step-body)", lineHeight: 1.55, color: "var(--ink-soft)", maxWidth: "30ch" }}>{v.d}</p>
              </div>
            </MaskReveal>
          ))}
        </div>

        <div style={{ marginTop: "clamp(56px,8vw,120px)" }}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "clamp(20px,2vw,32px)", marginTop: "clamp(24px,3vw,44px)" }}>
            {TEAM.map((m) => (
              <li key={m.n} style={{ borderTop: "1px solid var(--line)", paddingTop: "clamp(14px,1.4vw,20px)" }}>
                <p className="display" style={{ fontSize: "var(--step-h3)" }}>{m.n}</p>
                <p className="eyebrow" style={{ marginTop: "0.8em", lineHeight: 1.5 }}>{m.r}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
