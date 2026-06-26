import MaskReveal from "../MaskReveal";

/** Client words, kept verbatim and short. Two large pull-quotes over the paper
 *  ground, terracotta quote marks, restrained attributions. */
const QUOTES = [
  { quote: "I love my new home. Professional team, with real attention to detail.", who: "J.O.", where: "Homeowner" },
  { quote: "Nothing was too difficult, and we were never made to feel like we were asking too much.", who: "L.C.", where: "Homeowner" },
];

export default function Testimonials() {
  return (
    <section className="frame pad-y">
      <div className="wrap">
        <p className="eyebrow" style={{ marginBottom: "clamp(28px,4vw,56px)" }}>In their words</p>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "clamp(36px,5vw,80px)" }}>
          {QUOTES.map((q, i) => (
            <MaskReveal key={q.who} delay={i * 0.08}>
              <figure>
                <span className="display accent" aria-hidden style={{ fontSize: "clamp(40px,5vw,72px)", lineHeight: 0.6, display: "block" }}>&ldquo;</span>
                <blockquote className="display" style={{ fontSize: "var(--step-h3)", lineHeight: 1.25, marginTop: "0.3em" }}>
                  {q.quote}
                </blockquote>
                <figcaption className="eyebrow" style={{ marginTop: "clamp(18px,2vw,28px)" }}>
                  {q.who} <span style={{ opacity: 0.5 }}>· {q.where}</span>
                </figcaption>
              </figure>
            </MaskReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
