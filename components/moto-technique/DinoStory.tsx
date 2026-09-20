import Wipe from "./Wipe";

/**
 * The Dino's story: what fills the white half of the split hero.
 *
 * An editorial spread rather than a column. Each beat has its own shape and its
 * own width, so the eye is given something different every screen:
 *
 *   masthead   the price, set as wide as the panel will take it
 *   facts      three small facts on one rule, like a caption line
 *   quote      Jay Leno, his last sentence set large across the full width
 *   gallery    four photographs, edge to edge of the panel, uneven on purpose
 *   figures    three oversized numbers, stepped down the page, not in a row
 *   spec       the quieter facts, two to a line
 *   details    a margin label and four short lines
 *   closer     Kevin's words in a box of their own, then the links
 *
 * The panel has no side padding of its own, so the photographs can run to its
 * edges. Blocks that hold type take the shared padding from `.mt-story-pad`.
 *
 * Both quotes are verbatim: `lead` then `punch` is the original sentence in
 * order (see the content file). This component never edits a word, it only
 * decides how large each part is set.
 *
 * MOTION. Nothing here just fades in. Type rises inside its own mask; the
 * price, the large quote lines and the photographs are tied live to the scroll
 * (Wipe, scrub), so they open as you move and close again if you go back; the
 * smaller groups play once, staggered, so they follow one another.
 */

type Quote = { lead: string; punch: string; by: string };

export type Sale = {
  eyebrow: string;
  price: string;
  facts: { label: string; value: string }[];
  car: string;
  quote: Quote;
  gallery: { image: string; alt: string }[];
  figures: { value: string; unit: string; note: string }[];
  spec: { label: string; value: string }[];
  detailsTitle: string;
  details: string[];
  closing: Quote;
  links: { label: string; href: string }[];
};

export default function DinoStory({ sale }: { sale: Sale }) {
  return (
    <>
      <header className="mt-story-mast mt-story-pad">
        <Wipe className="mt-eyebrow">{sale.eyebrow}</Wipe>
        <Wipe as="p" scrub className="mt-story-price">
          {sale.price}
        </Wipe>
        <Wipe as="p" delay={0.15} className="mt-story-car">
          {sale.car}
        </Wipe>
      </header>

      <dl className="mt-story-facts mt-story-pad">
        {sale.facts.map((f, i) => (
          <Wipe as="div" key={f.label} delay={0.1 + i * 0.12}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </Wipe>
        ))}
      </dl>

      <blockquote className="mt-story-quote mt-story-pad">
        <Wipe as="p" className="mt-story-quote-lead">
          “{sale.quote.lead}
        </Wipe>
        <Wipe as="p" scrub className="mt-story-quote-punch">
          {sale.quote.punch}”
        </Wipe>
        <Wipe as="cite" delay={0.2}>
          {sale.quote.by}
        </Wipe>
      </blockquote>

      <div className="mt-story-gallery">
        {sale.gallery.map((g) => (
          <Wipe as="div" kind="curtain" scrub key={g.image}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.image} alt={g.alt} loading="lazy" decoding="async" />
          </Wipe>
        ))}
      </div>

      <dl className="mt-story-figures mt-story-pad">
        {sale.figures.map((f) => (
          <div key={f.unit} className="mt-story-figure">
            <Wipe as="dt" scrub>
              {f.value}
              <span>{f.unit}</span>
            </Wipe>
            <Wipe as="dd" delay={0.1}>
              {f.note}
            </Wipe>
          </div>
        ))}
      </dl>

      <dl className="mt-story-spec mt-story-pad">
        {sale.spec.map((row, i) => (
          <Wipe as="div" key={row.label} delay={(i % 2) * 0.12}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </Wipe>
        ))}
      </dl>

      <div className="mt-story-details mt-story-pad">
        <Wipe className="mt-story-margin">{sale.detailsTitle}</Wipe>
        <ul>
          {sale.details.map((d, i) => (
            <Wipe as="li" key={d} delay={i * 0.1}>
              {d}
            </Wipe>
          ))}
        </ul>
      </div>

      <div className="mt-story-pad">
        <Wipe as="blockquote" kind="curtain" className="mt-story-box">
          <p className="mt-story-box-lead">“{sale.closing.lead}</p>
          <p className="mt-story-box-punch">{sale.closing.punch}”</p>
          <cite>{sale.closing.by}</cite>
        </Wipe>

        <p className="mt-story-links">
          {sale.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" data-cursor="Open">
              {l.label}
            </a>
          ))}
        </p>
      </div>
    </>
  );
}
