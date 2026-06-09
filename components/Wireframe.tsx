/**
 * Wireframe — lightweight outline placeholders shown while a mockup loads,
 * preferred over a spinner. Gently pulsing via the .mockup-wire class.
 */

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="mockup-wire" aria-hidden="true">
      <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" fill="none">{children}</svg>
    </div>
  );
}

/* Studio-display mac: screen + stand. */
export function MacWireframe() {
  return (
    <Wrap>
      <rect x="70" y="30" width="160" height="96" rx="8" stroke="currentColor" strokeWidth="2.4" />
      <rect x="78" y="38" width="144" height="80" rx="4" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <path d="M150 126v18M126 150h48" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="138" y="144" width="24" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" opacity="0.7" />
    </Wrap>
  );
}

/* Row of album covers. */
export function AlbumWireframe() {
  return (
    <Wrap>
      {[40, 100, 160, 220].map((x, i) => (
        <rect key={x} x={x} y="55" width="56" height="56" rx="5" stroke="currentColor" strokeWidth="2.2" opacity={i === 1 || i === 2 ? 1 : 0.6} />
      ))}
    </Wrap>
  );
}

/* Single document page. */
export function PageWireframe() {
  return (
    <div className="mockup-wire" aria-hidden="true">
      <svg viewBox="0 0 210 160" preserveAspectRatio="xMidYMid meet" fill="none">
        <rect x="60" y="14" width="90" height="132" rx="6" stroke="currentColor" strokeWidth="2" />
        <rect x="72" y="34" width="50" height="6" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="72" y="52" width="66" height="3" rx="1.5" fill="currentColor" opacity="0.28" />
        <rect x="72" y="60" width="66" height="3" rx="1.5" fill="currentColor" opacity="0.28" />
        <rect x="72" y="74" width="66" height="40" rx="3" fill="currentColor" opacity="0.16" />
        <rect x="72" y="122" width="50" height="3" rx="1.5" fill="currentColor" opacity="0.28" />
      </svg>
    </div>
  );
}
