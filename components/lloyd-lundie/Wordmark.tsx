/**
 * The Lloyd Lundie wordmark: "Lloyd Lundie" in Cal Sans (tight tracking),
 * "Building Contractors" beneath in small tracked Questrial. Replaces the
 * client's clip-art logo everywhere: nav, footer, preloader-equivalent.
 *
 * `size` picks the scale (nav bar vs a larger standalone use); the footer's
 * giant rising wordmark is its own component (Footer.tsx) since it animates
 * per letter, but shares the same two-line structure and classes.
 */
export default function Wordmark({
  size = "nav",
  href,
}: {
  size?: "nav" | "lg";
  href?: string;
}) {
  const inner = (
    <span className={`ll-wordmark ll-wordmark-${size}`}>
      <span className="ll-wordmark-name">Lloyd Lundie</span>
      <span className="ll-wordmark-descriptor">Building Contractors</span>
    </span>
  );

  if (!href) return inner;

  return (
    <a href={href} className="ll-wordmark-link" aria-label="Lloyd Lundie Building Contractors, home">
      {inner}
    </a>
  );
}
