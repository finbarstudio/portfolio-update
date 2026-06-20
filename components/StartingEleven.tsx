/**
 * StartingEleven — a thin-line SVG pitch with the XI placed by formation, each
 * player a 🚹 (Noto Sans Symbols 2) glyph in pink with their name beneath.
 * Coordinates (x,y as % of the pitch) come from content/worldcup.json.
 */
import wc from "@/content/worldcup.json";

export default function StartingEleven() {
  const lineup = wc.lineup as { name: string; x: number; y: number }[];
  return (
    <div className="wc-pitch" role="img" aria-label={`England starting eleven, ${wc.formation}`}>
      <svg className="wc-pitch-lines" viewBox="0 0 68 105" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <g fill="none" stroke="var(--line)" strokeWidth="0.5">
          <rect x="1" y="1" width="66" height="103" />
          <line x1="1" y1="52.5" x2="67" y2="52.5" />
          <circle cx="34" cy="52.5" r="9" />
          <circle cx="34" cy="52.5" r="0.6" fill="var(--line)" stroke="none" />
          <rect x="13.8" y="1" width="40.4" height="16.5" />
          <rect x="13.8" y="87.5" width="40.4" height="16.5" />
          <rect x="24.8" y="1" width="18.4" height="5.5" />
          <rect x="24.8" y="98.5" width="18.4" height="5.5" />
        </g>
      </svg>
      {lineup.map((p) => (
        <span key={p.name} className="wc-player" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <span className="wc-player-icon" aria-hidden="true">{"\u{1F6B9}"}</span>
          <span className="wc-player-name">{p.name}</span>
        </span>
      ))}
    </div>
  );
}
