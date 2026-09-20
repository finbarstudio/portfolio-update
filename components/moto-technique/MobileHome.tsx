import AwardLaurel from "./AwardLaurel";
import RegionMarks from "./RegionMarks";
import type { StoryBlock } from "./DinoStory";

/**
 * The phone page. The same content as the desktop page, laid out plainly.
 *
 * The desktop page is built on things a phone does badly: a pinned hero driven
 * by the scroll, a WebGL badge, stacked cross-fading photographs, an accordion,
 * a wheel that needs a pointer to hover. Thinning those down still left a page
 * that stuttered. So a phone gets this instead, and the stylesheet shows one or
 * the other (the desktop components also switch their scripts off, see
 * phone.ts).
 *
 * WHAT IT IS. Sections, one after another, scrolled natively. Text, photographs
 * and swipe galleries. No script of its own: the galleries are CSS scroll-snap,
 * which is the browser's own momentum scrolling and costs nothing. Nothing is
 * pinned, nothing reacts to the scroll, nothing animates in.
 *
 * STRICT SCALES, set once in the stylesheet on `.mt-mob` and used for
 * everything here. Four type sizes (label 12, body 16, lead 22, display 40) and
 * four spaces (8, 16, 32, 64) plus the one page margin. If something seems to
 * need a fifth size, it needs rethinking, not a fifth size.
 *
 * PHONE RULES IT FOLLOWS. Body text never under 16px (readable, and iOS zooms
 * the page on smaller inputs). Every tap target at least 44px tall. One column.
 * Nothing depends on hover. Galleries show the edge of the next picture so it
 * is obvious they swipe. Photographs are lazy-loaded and phone-sized: the 900px
 * and 1600px cuts, never the full files, which cost a phone most in decoding.
 *
 * Everything shown comes from content/moto-technique.ts, the same as desktop.
 */

type Shot = { image: string; alt: string };

function Photo({ shot, eager = false }: { shot: Shot; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={shot.image}
      alt={shot.alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
    />
  );
}

export default function MobileHome({
  hero,
  heroMark,
  marks,
  sale,
  why,
  projects,
  services,
  h1,
}: {
  hero: { id: string; car: string; imagePhone: string }[];
  heroMark: { image: string; alt: string; width: number; height: number } | null;
  marks: {
    laurel: { mark: string; unit: string; body: string; label: string };
    regions: { id: string; label: string }[];
  };
  sale: { blocks: StoryBlock[]; links: { label: string; href: string }[] };
  why: {
    title: string;
    heading: string[];
    body: string;
    cta: { label: string; href: string };
    figures: { value: string; label: string }[];
  };
  projects: { title: string; items: { id: string; name: string; line: string; imagePhone: string; href: string }[] };
  services: {
    title: string;
    quarters: { id: string; name: string; href: string; blurb: string; imagePhone: string }[];
    hub: { id: string; name: string; href: string; blurb: string; imagePhone: string };
  };
  h1: string;
}) {
  const [first, ...frames] = hero;
  // The story below shows some of the same photographs. On one narrow column a
  // repeat lands a thumb's scroll after the first showing, so the gallery gives
  // way and keeps only the frames the story does not use.
  const told = new Set(
    sale.blocks.flatMap((b) =>
      b.kind === "image" ? [b.imagePhone ?? b.image] : b.kind === "pair" ? b.images.map((s) => s.imagePhone ?? s.image) : [],
    ),
  );
  const rest = frames.filter((s) => !told.has(s.imagePhone));
  const disciplines = [...services.quarters, services.hub];

  return (
    <div className="mt-mob">
      {/* The car, its name, and the two credentials. One photograph, held still. */}
      <section className="mt-m-hero" data-tone="dark">
        <h1 className="mt-sr">{h1}</h1>
        {first ? <Photo shot={{ image: first.imagePhone, alt: first.car }} eager /> : null}
        <div className="mt-m-hero-shade" aria-hidden="true" />
        {heroMark ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroMark.image}
            alt={heroMark.alt}
            width={heroMark.width}
            height={heroMark.height}
            className="mt-m-hero-name"
            decoding="async"
            // the same request mode as the desktop badge's copy of this file, so the
            // browser fetches it once and the two never poison each other's cache
            crossOrigin="anonymous"
          />
        ) : null}
        <div className="mt-m-hero-marks">
          <AwardLaurel
            mark={marks.laurel.mark}
            unit={marks.laurel.unit}
            body={marks.laurel.body}
            label={marks.laurel.label}
            delay={0.3}
          />
          <RegionMarks regions={marks.regions} />
        </div>
      </section>

      {/* The rest of the car: a swipe gallery, straight under the hero. */}
      {rest.length ? (
        <div className="mt-m-gallery mt-m-gallery-flush" data-tone="light" role="group" aria-label="More photographs of the car">
          {rest.map((s) => (
            <Photo key={s.id} shot={{ image: s.imagePhone, alt: s.car }} />
          ))}
        </div>
      ) : null}

      {/* The Dino's story: text and photographs, in the order the content gives them. */}
      <section className="mt-m-section" data-tone="light">
        {sale.blocks.map((b, i) => {
          if (b.kind === "text")
            return (
              <p key={i} className="mt-m-body">
                {b.text}
              </p>
            );
          if (b.kind === "say")
            return (
              <blockquote key={i} className="mt-m-quote">
                <p className="mt-m-lead">“{b.text}”</p>
                <cite className="mt-m-label">{b.by}</cite>
              </blockquote>
            );
          if (b.kind === "image")
            return (
              <div key={i} className="mt-m-bleed">
                <Photo shot={{ image: b.imagePhone ?? b.image, alt: b.alt }} />
              </div>
            );
          return (
            <div key={i} className="mt-m-bleed mt-m-pair">
              {b.images.map((s) => (
                <Photo key={s.image} shot={{ image: s.imagePhone ?? s.image, alt: s.alt }} />
              ))}
            </div>
          );
        })}
        <p className="mt-m-links">
          {sale.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </p>
      </section>

      {/* Why Moto Technique. */}
      <section className="mt-m-section mt-m-rule" id="m-why" data-tone="light">
        <h2 className="mt-m-label">{why.title}</h2>
        <p className="mt-m-lead">{why.heading.join(" ")}</p>
        <p className="mt-m-body">{why.body}</p>
        <dl className="mt-m-figures">
          {why.figures.map((f) => (
            <div key={f.value}>
              <dt className="mt-m-display">{f.value}</dt>
              <dd className="mt-m-body mt-m-soft">{f.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Projects: a swipe gallery of cards. */}
      <section className="mt-m-section mt-m-rule" id="m-projects" data-tone="light">
        <h2 className="mt-m-label">{projects.title}</h2>
        <div className="mt-m-gallery" role="group" aria-label={projects.title}>
          {projects.items.map((p) => (
            <a key={p.id} href={p.href} className="mt-m-card">
              <Photo shot={{ image: p.imagePhone, alt: "" }} />
              <span className="mt-m-lead">{p.name}</span>
              {p.line ? <span className="mt-m-body mt-m-soft">{p.line}</span> : null}
            </a>
          ))}
        </div>
      </section>

      {/* Services: a plain list. The wheel needs a pointer to hover; a list does not. */}
      <section className="mt-m-section mt-m-rule" id="m-services" data-tone="light">
        <h2 className="mt-m-label">{services.title}</h2>
        <ul className="mt-m-list">
          {disciplines.map((s) => (
            <li key={s.id}>
              <a href={s.href}>
                <Photo shot={{ image: s.imagePhone, alt: "" }} />
                <span className="mt-m-lead">{s.name}</span>
                <span className="mt-m-body mt-m-soft">{s.blurb}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
