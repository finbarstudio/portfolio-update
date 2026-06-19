/**
 * Tiny duotone flag marks in the site palette (ink field + pink detail) — sit
 * beside the AUS/BNE and ENG/LON footer location codes. Simplified, ~1em tall.
 */

const wrap: React.CSSProperties = {
  width: "1.45em",
  height: "0.97em",
  display: "inline-block",
  verticalAlign: "-0.1em",
  flex: "0 0 auto",
};

/** Australia — ink field, pink Union-Jack canton + Commonwealth star + Southern Cross. */
export function AusFlag() {
  return (
    <svg viewBox="0 0 30 20" style={wrap} aria-hidden="true" focusable="false">
      <rect width="30" height="20" fill="var(--ink)" />
      <g stroke="var(--pink)" strokeWidth="1.4">
        <line x1="0" y1="0" x2="15" y2="10" />
        <line x1="15" y1="0" x2="0" y2="10" />
        <line x1="7.5" y1="0" x2="7.5" y2="10" />
        <line x1="0" y1="5" x2="15" y2="5" />
      </g>
      <circle cx="7.5" cy="15" r="2" fill="var(--pink)" />
      <circle cx="22" cy="6" r="1.1" fill="var(--pink)" />
      <circle cx="26" cy="10" r="1.1" fill="var(--pink)" />
      <circle cx="22" cy="15" r="1.1" fill="var(--pink)" />
      <circle cx="19.5" cy="10.5" r="0.9" fill="var(--pink)" />
    </svg>
  );
}

/** England — St George's cross: ink field, pink cross. */
export function EngFlag() {
  return (
    <svg viewBox="0 0 30 20" style={wrap} aria-hidden="true" focusable="false">
      <rect width="30" height="20" fill="var(--ink)" />
      <rect x="12.5" y="0" width="5" height="20" fill="var(--pink)" />
      <rect x="0" y="7.5" width="30" height="5" fill="var(--pink)" />
    </svg>
  );
}
