/**
 * Braeden Constructions wordmark — a typeface lockup in the brand display serif
 * (Cormorant), tracked caps, set as SVG text so it inherits `currentColor` and
 * scales with the nav/footer sizing. (Their existing logo is a dated stacked
 * mark; this is the cleaner typeface direction, like Lindon.)
 */
export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 680 132" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Braeden Constructions">
      <text
        x="340"
        y="98"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: "var(--font-braeden-display), Georgia, serif", fontSize: "108px", fontWeight: 400, letterSpacing: "12px" }}
      >
        BRAEDEN
      </text>
    </svg>
  );
}
