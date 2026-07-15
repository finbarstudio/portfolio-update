import MaskReveal from "../MaskReveal";

/** The full four-generation narrative for the About page. Story-led: prose set
 *  large and calm, a generational timeline, and one supporting image. */
const TIMELINE = [
  { year: "1943", text: "Albert and Arthur Rolley open a furniture workshop in Brisbane, building a name for careful joinery, including a fit-out for Trittons." },
  { year: "1968", text: "The family moves north to Caloundra and turns the same hands to building homes. The Rolley name has been on Sunshine Coast houses ever since." },
  { year: "1970s", text: "Dan's father and uncle join the business. A Rolley and Son becomes A Rolley and Sons." },
  { year: "2006", text: "Dan and Lee Rolley take over from the previous generation, carrying the standard forward." },
  { year: "Today", text: "Dan's youngest son has finished his apprenticeship with the company. Four generations, still building." },
];

export default function Story() {
  return (
    <>
      <section className="frame pad-y">
        <div className="wrap grid grid-cols-1 md:grid-cols-12" style={{ gap: "clamp(28px,4vw,72px)" }}>
          <div className="md:col-span-7">
            <h2 className="display" style={{ fontSize: "var(--step-h2)", marginTop: "0.5em", maxWidth: "20ch" }}>
              The same hands, handed down.
            </h2>
            <div className="lead" style={{ marginTop: "clamp(20px,2.5vw,36px)", maxWidth: "58ch", display: "grid", gap: "1.1em" }}>
              <p>
                A Rolley &amp; Sons started in 1943, not on a building site but in a Brisbane furniture
                workshop, where Albert and Arthur Rolley earned a name for joinery you could trust.
              </p>
              <p>
                In the late 1960s the family moved to Caloundra and put the same care into houses.
                We have been building on the Sunshine Coast since 1968, through three more generations
                of Rolleys learning the trade from the one before.
              </p>
              <p>
                Dan and Lee Rolley run the business today, and Dan&rsquo;s youngest son has just finished
                his apprenticeship with us. The name on the sign is the name on the tools.
              </p>
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <MaskReveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/a-rolley/projects/macphee.webp" alt="A Rolley & Sons custom home detail" className="w-full h-auto block" style={{ aspectRatio: "3 / 4", objectFit: "cover" }} />
            </MaskReveal>
          </div>
        </div>
      </section>

      <section className="frame pad-y" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <ol style={{ display: "grid", gap: 0 }}>
            {TIMELINE.map((s, i) => (
              <MaskReveal key={s.year} delay={i * 0.05}>
                <li className="grid items-baseline" style={{ gridTemplateColumns: "minmax(72px, 0.18fr) 1fr", gap: "clamp(16px,3vw,48px)", padding: "clamp(20px,2.4vw,34px) 0", borderTop: "1px solid var(--line)" }}>
                  <span className="display accent" style={{ fontSize: "var(--step-h3)" }}>{s.year}</span>
                  <span style={{ fontSize: "var(--step-lead)", lineHeight: 1.45, maxWidth: "52ch" }}>{s.text}</span>
                </li>
              </MaskReveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
