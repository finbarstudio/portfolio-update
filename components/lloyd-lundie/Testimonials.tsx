import Reveal from "./Reveal";

/**
 * Reviews as cards, three across and one row (stacked on a phone): five gold
 * stars, the customer's words verbatim, and their name beside an initials
 * badge. The shape of a classic shadcn reviews section, in this site's navy
 * and white.
 */

const STAR =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

function Stars() {
  return (
    <div className="ll-review-stars" role="img" aria-label="Five stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d={STAR} />
        </svg>
      ))}
    </div>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function Testimonials({ testimonials }: { testimonials: { quote: string; name: string }[] }) {
  return (
    <section className="ll-testimonials" id="feedback">
      <div className="ll-wrap">
        <Reveal as="h2" className="ll-section-title">
          What our customers say
        </Reveal>

        <div className="ll-review-grid">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} as="figure" className="ll-review" delay={i * 0.08}>
              <Stars />
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption>
                <span className="ll-review-avatar" aria-hidden="true">
                  {initials(t.name)}
                </span>
                <span className="ll-review-name">{t.name}</span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
