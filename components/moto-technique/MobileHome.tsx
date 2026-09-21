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
 * WHAT IT IS. Sections, one after another, scrolled natively. Text, photographs,
 * a photo grid and a swipe gallery. No script of its own: the galleries are CSS scroll-snap,
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

/** A 1x1 transparent GIF, handed to desktops in place of files only a phone shows. */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/**
 * The mirror of DeskImg: a picture only the PHONE page shows. The lazy
 * photographs further down never load on a desktop (a hidden lazy image is not
 * fetched), but these two are wanted at once on a phone, so they are not lazy,
 * and a desktop would fetch them for nothing. Keep the width in step with
 * PHONE in phone.ts.
 */
function PhoneOnly({ children }: { children: React.ReactNode }) {
  return (
    <picture className="mt-deskimg">
      <source media="(min-width: 761px)" srcSet={BLANK} />
      {children}
    </picture>
  );
}

function Photo({ shot }: { shot: Shot }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={shot.image}
      alt={shot.alt}
      loading="lazy"
      decoding="async"
    />
  );
}

export default function MobileHome({
  hero,
  heroPhone,
  heroMark,
  marks,
  sale,
  why,
  projects,
  services,
  h1,
}: {
  hero: { id: string; car: string; imagePhone: string }[];
  /** Which slide the phone holds still, its 1600px file, and where a tall crop should look. */
  heroPhone: { slide: string; image: string; focus: string };
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
  const first = hero.find((s) => s.id === heroPhone.slide) ?? hero[0];
  const frames = hero.filter((s) => s !== first);
  // The hero's other frames. Some are also in the story below; those are left
  // out so nothing is shown twice. What remains joins the story's first
  // photograph to make one 2 x 2 grid (see `grid`).
  const told = new Set(
    sale.blocks.flatMap((b) =>
      b.kind === "image" ? [b.imagePhone ?? b.image] : b.kind === "pair" ? b.images.map((s) => s.imagePhone ?? s.image) : [],
    ),
  );
  const spare = frames.filter((s) => !told.has(s.imagePhone)).map((s) => ({ image: s.imagePhone, alt: s.car }));
  const lead = sale.blocks.findIndex((b) => b.kind === "image");
  const disciplines = [...services.quarters, services.hub];

  return (
    <div className="mt-mob">
      {/* The car, its name, and the two credentials. One photograph, held still. */}
      <section className="mt-m-hero" data-tone="dark">
        <h1 className="mt-sr">{h1}</h1>
        {first ? (
          <PhoneOnly>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroPhone.image}
              alt={first.car}
              className="mt-m-hero-photo"
              style={{ objectPosition: heroPhone.focus }}
              fetchPriority="high"
              decoding="async"
            />
          </PhoneOnly>
        ) : null}
        <div className="mt-m-hero-shade" aria-hidden="true" />
        {heroMark ? (
          <PhoneOnly>
            {/* A plain request, on the plain address. The desktop badge asks for
                the same file WITH CORS and so uses an address of its own
                (corsMedia in lib/media.ts); the two must never share one. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroMark.image}
              alt={heroMark.alt}
              width={heroMark.width}
              height={heroMark.height}
              className="mt-m-hero-name"
              decoding="async"
            />
          </PhoneOnly>
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

      {/* The Dino's story: text and photographs, in the order the content gives
          them, on black so it reads as one chapter with the hero above it. */}
      <section className="mt-m-section mt-m-dark" data-tone="dark">
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
          if (b.kind === "image" && i === lead && spare.length >= 3) {
            // four photographs, two by two: the story's own, then the spare frames
            const grid = [{ image: b.imagePhone ?? b.image, alt: b.alt }, ...spare].slice(0, 4);
            return (
              <div key={i} className="mt-m-bleed mt-m-four">
                {grid.map((shot) => (
                  <Photo key={shot.image} shot={shot} />
                ))}
              </div>
            );
          }
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

      {/* Services: one block each, the photograph behind and the words at its foot.
          The wheel needs a pointer to hover; these do not. */}
      <section className="mt-m-section mt-m-rule" id="m-services" data-tone="light">
        <h2 className="mt-m-label">{services.title}</h2>
        <ul className="mt-m-blocks">
          {disciplines.map((s) => (
            <li key={s.id}>
              <a href={s.href} className="mt-m-block">
                <Photo shot={{ image: s.imagePhone, alt: "" }} />
                <span className="mt-m-block-say">
                  <span className="mt-m-display">{s.name}</span>
                  <span className="mt-m-body">{s.blurb}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
