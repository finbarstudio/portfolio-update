/**
 * The Dino's story: what fills the white half of the split hero.
 *
 * An editorial spread rather than a column. Each beat has its own shape and its
 * own width, so the eye is given something different every screen:
 *
 *   masthead   the price, set as wide as the panel will take it
 *   facts      three small facts on one rule, like a caption line
 *   quote      Jay Leno, his last sentence set large and pushed right
 *   gallery    four photographs, edge to edge of the panel, uneven on purpose
 *   figures    three oversized numbers, stepped down the page, not in a row
 *   spec       the quieter facts, two to a line
 *   details    a margin label and four short lines
 *   closer     Kevin's last words large, over a photograph, with the links
 *
 * The panel has no side padding of its own, so the photographs can run to its
 * edges. Blocks that hold type take the shared padding from `.mt-story-pad`.
 *
 * Both quotes are verbatim: `lead` then `punch` is the original sentence in
 * order (see the content file). This component never edits a word, it only
 * decides how large each part is set.
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
  closer: { image: string; alt: string };
  links: { label: string; href: string }[];
};

export default function DinoStory({ sale }: { sale: Sale }) {
  return (
    <>
      <header className="mt-story-mast mt-story-pad">
        <span className="mt-eyebrow">{sale.eyebrow}</span>
        <p className="mt-story-price">{sale.price}</p>
        <p className="mt-story-car">{sale.car}</p>
      </header>

      <dl className="mt-story-facts mt-story-pad">
        {sale.facts.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      <blockquote className="mt-story-quote mt-story-pad">
        <p className="mt-story-quote-lead">“{sale.quote.lead}</p>
        <p className="mt-story-quote-punch">{sale.quote.punch}”</p>
        <cite>{sale.quote.by}</cite>
      </blockquote>

      <div className="mt-story-gallery">
        {sale.gallery.map((g) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={g.image} src={g.image} alt={g.alt} loading="lazy" decoding="async" />
        ))}
      </div>

      <dl className="mt-story-figures mt-story-pad">
        {sale.figures.map((f) => (
          <div key={f.unit} className="mt-story-figure">
            <dt>
              {f.value}
              <span>{f.unit}</span>
            </dt>
            <dd>{f.note}</dd>
          </div>
        ))}
      </dl>

      <dl className="mt-story-spec mt-story-pad">
        {sale.spec.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-story-details mt-story-pad">
        <span className="mt-story-margin">{sale.detailsTitle}</span>
        <ul>
          {sale.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>

      {/* dark, so the bar above it knows to stay white while this is under it */}
      <div className="mt-story-closer" data-tone="dark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sale.closer.image} alt={sale.closer.alt} loading="lazy" decoding="async" />
        <blockquote className="mt-story-pad">
          <p className="mt-story-closer-lead">“{sale.closing.lead}</p>
          <p className="mt-story-closer-punch">{sale.closing.punch}”</p>
          <cite>{sale.closing.by}</cite>
        </blockquote>
        <p className="mt-story-links mt-story-pad">
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
