/**
 * Braeden Constructions wordmark — a typeface lockup in their real brand face
 * (Montserrat, heavy, tracked caps), set as SVG text so it inherits
 * `currentColor` and scales with the nav/footer sizing. (Their existing logo is
 * a dated stacked mark; this keeps their Montserrat-caps identity, refined.)
 */
export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 680 124" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Braeden Constructions">
      <text
        x="340"
        y="92"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif", fontSize: "96px", fontWeight: 800, letterSpacing: "4px" }}
      >
        BRAEDEN
      </text>
    </svg>
  );
}
