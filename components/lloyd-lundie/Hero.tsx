import Laurel from "./Laurel";

/**
 * Full-bleed hero: the new-build photograph fills the screen, with navy
 * gradients at the top (behind the bar) and the bottom only, no overlay across
 * the middle. The white wordmark in the middle of it is not in here: it is the
 * travelling mark in Nav.tsx, which sits in the centre of the hero at the top of
 * the page and rides up into the bar as the page scrolls. This section only
 * holds the photograph and the laurel beneath the mark. Nothing here is a link.
 *
 * The client's photo was only 960x720; the file served here is a 4x Upscayl
 * pass (high-fidelity model) scaled back to 2560px, so it holds full bleed.
 */
export default function Hero({
  image,
  imageAlt,
  laurel,
}: {
  image: string;
  imageAlt: string;
  laurel: { mark: string; unit: string; award?: string };
}) {
  return (
    <section className="ll-hero" id="top">
      <img
        className="ll-hero-img"
        src={image}
        alt={imageAlt}
        width={2560}
        height={1920}
        loading="eager"
        decoding="sync"
        fetchPriority="high"
      />
      <div className="ll-hero-shade ll-hero-shade-top" aria-hidden="true" />
      <div className="ll-hero-shade ll-hero-shade-bottom" aria-hidden="true" />
      <h1 className="ll-sr-only">Lloyd Lundie Building Contractors, home extensions in Medway and Kent</h1>
      <div className="ll-hero-laurel">
        <Laurel mark={laurel.mark} unit={laurel.unit} award={laurel.award} delay={0.35} />
      </div>
    </section>
  );
}
