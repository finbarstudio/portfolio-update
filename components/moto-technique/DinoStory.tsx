import DeskImg from "./DeskImg";

/**
 * The Dino's story: what fills the white half of the split hero.
 *
 * As little as it can be. Text and photographs, one after the other, in the
 * order the content file gives them. No headings, labels, captions, tables or
 * figures, and nothing animates in: it is simply there as the panel scrolls.
 *
 * TWO TYPE TREATMENTS, and only two:
 *   .mt-story-say    the title face, larger. The two quotes.
 *   .mt-story-text   the reading face. Everything else, including who said a
 *                    quote and the two links, which differ only in colour.
 *
 * ONE MEASURE. Every block of type sits on the same left edge at the same
 * width, so the panel has a single column the eye can run down. Photographs
 * break out of it and run to the panel's edges, which is the only variation.
 *
 * This component never edits a word. See the content file for sources.
 */

/** `imagePhone` is a smaller cut of the same photograph; only the phone page uses it. */
type Shot = { image: string; imagePhone?: string; alt: string };

export type StoryBlock =
  | { kind: "text"; text: string }
  | { kind: "say"; text: string; by: string }
  | { kind: "image"; image: string; imagePhone?: string; alt: string }
  | { kind: "pair"; images: Shot[] };

export type Sale = { blocks: StoryBlock[]; links: { label: string; href: string }[] };

/**
 * Not lazy-loaded, on purpose. This panel scrolls by being moved with a
 * transform, not by the page scrolling, and the browser's lazy loading judges
 * "nearly on screen" badly for that: photographs arrived blank and filled in
 * late. They load with the page instead, at low priority, so the hero's own
 * photograph still comes first. DeskImg keeps a phone from fetching them at all.
 */
function Photo({ shot }: { shot: Shot }) {
  return <DeskImg src={shot.image} alt={shot.alt} eager />;
}

export default function DinoStory({ sale }: { sale: Sale }) {
  return (
    <div className="mt-story">
      {sale.blocks.map((b, i) => {
        if (b.kind === "text")
          return (
            <p key={i} className="mt-story-text mt-story-col">
              {b.text}
            </p>
          );
        if (b.kind === "say")
          return (
            <blockquote key={i} className="mt-story-col">
              <p className="mt-story-say">“{b.text}”</p>
              <cite className="mt-story-text mt-story-quiet">{b.by}</cite>
            </blockquote>
          );
        if (b.kind === "image")
          return (
            <div key={i} className="mt-story-shot">
              <Photo shot={b} />
            </div>
          );
        return (
          <div key={i} className="mt-story-shot mt-story-shot-pair">
            {b.images.map((s) => (
              <Photo key={s.image} shot={s} />
            ))}
          </div>
        );
      })}

      <p className="mt-story-text mt-story-col mt-story-links">
        {sale.links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" data-cursor="Open">
            {l.label}
          </a>
        ))}
      </p>
    </div>
  );
}
