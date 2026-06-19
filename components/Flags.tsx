/**
 * Tiny flag marks in the site palette — transparent fill, 1px pink line-art.
 * Sit beside the AUS/BNE and ENG/LON footer location codes. ~1em tall.
 */

const wrap: React.CSSProperties = {
  width: "1.45em",
  height: "0.97em",
  display: "inline-block",
  verticalAlign: "-0.1em",
  flex: "0 0 auto",
};

const stroke = {
  fill: "none",
  stroke: "var(--pink)",
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke" as const,
};

/** Australia — pink outline + Union-Jack canton lines + Commonwealth star. */
export function AusFlag() {
  return (
    <svg viewBox="0 0 30 20" style={wrap} aria-hidden="true" focusable="false">
      <g {...stroke}>
        <rect x="0.5" y="0.5" width="29" height="19" />
        <line x1="0" y1="0" x2="15" y2="10" />
        <line x1="15" y1="0" x2="0" y2="10" />
        <line x1="7.5" y1="0" x2="7.5" y2="10" />
        <line x1="0" y1="5" x2="15" y2="5" />
        <circle cx="7.5" cy="15" r="1.7" />
        <circle cx="23" cy="11" r="1.3" />
      </g>
    </svg>
  );
}

/** England — St George's cross: pink outline + cross lines. */
export function EngFlag() {
  return (
    <svg viewBox="0 0 30 20" style={wrap} aria-hidden="true" focusable="false">
      <g {...stroke}>
        <rect x="0.5" y="0.5" width="29" height="19" />
        <line x1="15" y1="0" x2="15" y2="20" />
        <line x1="0" y1="10" x2="30" y2="10" />
      </g>
    </svg>
  );
}
