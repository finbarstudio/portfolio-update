import Reveal from "./Reveal";

/** Navy band, an elegant stacked list of verbatim quotes (not a one-at-a-time carousel: simpler, no JS state, reads fine at any length). */
export default function Testimonials({
  testimonials,
}: {
  testimonials: { quote: string; name: string }[];
}) {
  return (
    <section className="ll-testimonials" id="feedback">
      <div className="ll-wrap">
        <Reveal as="h2" className="ll-section-title ll-section-title-inverse">
          What our customers say
        </Reveal>

        <div className="ll-testimonial-list">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} as="figure" className="ll-testimonial" delay={i * 0.05}>
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption>{t.name}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
