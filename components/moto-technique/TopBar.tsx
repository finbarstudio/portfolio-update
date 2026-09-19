/**
 * The bar: the wordmark, fixed to the top, and nothing else. The logomark is
 * the preloader's, not the bar's (see Preloader.tsx).
 *
 * It lives in the layout rather than inside the hero because it stays put while
 * the page scrolls, and because the stylesheet blends it against whatever is
 * underneath so it turns from white to near-black as the white section arrives.
 * A blend cannot see out of the hero, which isolates its own stacking context.
 */
export default function TopBar({ name }: { name: string }) {
  return (
    <>
      {/* What keeps the wordmark readable once there is text scrolling under
          it. A separate layer: it must sit behind the blended bar, not in it. */}
      <div className="mt-bar-veil" aria-hidden="true" />
      <header className="mt-bar">
        <a href="#top" className="mt-wordmark" aria-label={`${name}, back to the top`}>
          {name}
        </a>
      </header>
    </>
  );
}
