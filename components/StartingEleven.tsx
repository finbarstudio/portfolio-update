/**
 * StartingEleven — a thin-line SVG of ONE half of the pitch with the XI placed by
 * formation. Each player is a 🚹 (Noto Sans Symbols 2) glyph in pink with their
 * shirt number, name and club beneath. Coordinates (x,y as % of the half-pitch)
 * come from content/worldcup.json.
 */
import wc from "@/content/worldcup.json";

type Player = { name: string; num: number; club: string; x: number; y: number };

export default function StartingEleven() {
  const lineup = wc.lineup as Player[];
  return (
    <div className="wc-pitch" role="img" aria-label={`England starting eleven, ${wc.formation}`}>
      <svg className="wc-pitch-lines" viewBox="0 0 68 56" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <g fill="none" stroke="var(--line)" strokeWidth="0.5">
          <rect x="1" y="1" width="66" height="54" />
          {/* halfway line is the top edge; centre-circle arc bulges down from it */}
          <path d="M25 1 A 9 9 0 0 0 43 1" />
          <circle cx="34" cy="1" r="0.6" fill="var(--line)" stroke="none" />
          {/* penalty + goal area at the bottom (own goal) */}
          <rect x="13.8" y="38.5" width="40.4" height="16.5" />
          <rect x="24.8" y="49.5" width="18.4" height="5.5" />
          <path d="M27 38.5 A 9 9 0 0 1 41 38.5" />
        </g>
      </svg>
      {lineup.map((p) => (
        <span key={p.name} className="wc-player" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <span className="wc-player-icon" aria-hidden="true">{"\u{1F6B9}"}</span>
          <span className="wc-player-meta">
            <span className="wc-player-num">{p.num}</span>
            <span className="wc-player-name">{p.name}</span>
          </span>
          <span className="wc-player-club">{p.club}</span>
        </span>
      ))}
    </div>
  );
}
