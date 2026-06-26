import MaskReveal from "../MaskReveal";

/** Brief heritage strip: the four-generation line as a short timeline. The full
 *  story lives on the About page; here it stays a tight, confident note. */
const STEPS = [
  { year: "1943", text: "Albert and Arthur Rolley start out as furniture-makers in Brisbane." },
  { year: "1968", text: "The family moves to Caloundra and turns to building homes on the Coast." },
  { year: "2006", text: "Dan and Lee Rolley take the reins, the third generation at the helm." },
  { year: "Today", text: "The fourth generation is on the tools. Same name, same standard." },
];

export default function Heritage() {
  return (
    <section className="frame pad-y" style={{ background: "var(--paper-2)" }}>
      <div className="wrap grid grid-cols-1 md:grid-cols-12" style={{ gap: "clamp(28px,4vw,64px)" }}>
        <div className="md:col-span-5">
          <p className="eyebrow">Since 1943</p>
          <h2 className="display" style={{ fontSize: "var(--step-h2)", marginTop: "0.5em" }}>
            Four generations, <span className="display-italic accent">built to last.</span>
          </h2>
          <p className="lead" style={{ marginTop: "clamp(18px,2vw,28px)", maxWidth: "40ch" }}>
            The Rolley name has been handed down with the tools, from a Brisbane workshop to the Coast.
          </p>
        </div>

        <ol className="md:col-span-7 md:col-start-6" style={{ display: "grid", gap: "clamp(2px,0.4vw,6px)" }}>
          {STEPS.map((s, i) => (
            <MaskReveal key={s.year} delay={i * 0.06}>
              <li
                className="grid items-baseline"
                style={{
                  gridTemplateColumns: "minmax(64px, 0.2fr) 1fr",
                  gap: "clamp(16px,3vw,40px)",
                  padding: "clamp(18px,2.2vw,30px) 0",
                  borderTop: "1px solid var(--line)",
                }}
              >
                <span className="display accent" style={{ fontSize: "var(--step-h3)" }}>{s.year}</span>
                <span style={{ fontSize: "var(--step-body)", lineHeight: 1.55, color: "var(--ink)" }}>{s.text}</span>
              </li>
            </MaskReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
