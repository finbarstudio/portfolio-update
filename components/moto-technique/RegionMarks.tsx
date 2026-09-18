"use client";

/**
 * The four markets Moto Technique works for, as one-colour flags.
 *
 * The home page says their projects come "from all over the UK, Europe, Asia
 * and North America", which is a real credential buried in a paragraph nobody
 * reads. These put it under the laurel in the hero.
 *
 * Everything is drawn in `currentColor` so there is no red, white and blue
 * fighting the photograph. Asia has no flag, so it gets its landmass in the
 * same rectangle: same weight, same size, reads as one set.
 */

/** Five-point star, centred, pointing up. */
function star(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.382;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

/** Every flag sits in the same 60x40 rectangle with a hairline edge. */
function Flag({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 60 40" className="mt-flag" role="img" aria-label={label}>
      {children}
      <rect x="0.5" y="0.5" width="59" height="39" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
    </svg>
  );
}

/** Union Jack: the crosses, outlined so they still read in one colour. */
function UK() {
  return (
    <Flag label="United Kingdom">
      <g fill="currentColor">
        <path d="M0 0 L7 0 L60 35 L60 40 L53 40 L0 5 Z" opacity="0.8" />
        <path d="M60 0 L60 5 L7 40 L0 40 L0 35 L53 0 Z" opacity="0.8" />
        <rect x="0" y="15" width="60" height="10" />
        <rect x="24" y="0" width="12" height="40" />
      </g>
      <g fill="none" stroke="var(--mt-ground)" strokeWidth="1.4">
        <rect x="0" y="15" width="60" height="10" />
        <rect x="24" y="0" width="12" height="40" />
      </g>
    </Flag>
  );
}

/** Europe: the ring of twelve stars. */
function EU() {
  return (
    <Flag label="Europe">
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI / 6) * i - Math.PI / 2;
        return (
          <polygon
            key={i}
            points={star(30 + 12 * Math.cos(a), 20 + 12 * Math.sin(a), 2.6)}
            fill="currentColor"
          />
        );
      })}
    </Flag>
  );
}

/** North America: the canton and stripes. */
function USA() {
  return (
    <Flag label="North America">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x="24" y={i * 6.15 + 1.6} width="36" height="3.1" fill="currentColor" />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={`l${i}`} x="0" y={i * 6.15 + 20} width="24" height="3.1" fill="currentColor" opacity="0" />
      ))}
      {[3, 4, 5].map((i) => (
        <rect key={`b${i}`} x="0" y={i * 6.15 + 1.6} width="24" height="3.1" fill="currentColor" />
      ))}
      <rect x="0" y="0" width="24" height="21.5" fill="currentColor" opacity="0.2" />
      {[
        [5, 5],
        [12, 5],
        [19, 5],
        [8.5, 11],
        [15.5, 11],
        [5, 17],
        [12, 17],
        [19, 17],
      ].map(([x, y], i) => (
        <polygon key={i} points={star(x, y, 2.1)} fill="currentColor" />
      ))}
    </Flag>
  );
}

/**
 * Asia: the landmass, simplified to read at flag size rather than to survey a
 * coastline. The mainland, the Indian and Arabian peninsulas, Indochina, then
 * Japan and the archipelago off the east coast.
 */
function Asia() {
  return (
    <Flag label="Asia">
      <g fill="currentColor">
        {/* the mainland, wide and flat, with Siberia tapering east */}
        <path
          d="M5.6 14.2 C7.4 10.8 12 9 17.6 9 C23.6 9 29.6 8.2 35.4 8.8
             C41.8 9.4 47.4 11 50.2 13.8 C51.8 15.4 51 17.4 48.8 18.4
             C46.4 19.5 43.6 20 40.4 20.2 L33.6 20.6 L20 20.8
             C11.6 20.8 6.4 19.4 5.4 17 C5 16 5.2 15 5.6 14.2 Z"
        />
        {/* India, the one peninsula that has to read */}
        <path d="M22.6 20.2 L32.4 20.2 C32 25.6 30.2 30.4 27.4 33.8 C24.4 30 22.8 25.2 22.6 20.2 Z" />
        {/* Arabia */}
        <path d="M13 19.8 L18.4 19.8 C18.2 23 17.2 25.8 15.8 27.6 C14.2 25.6 13.2 22.8 13 19.8 Z" />
        {/* Indochina */}
        <path d="M35 20.2 L39.2 20.2 C39 23.6 38.2 26.6 37 28.6 C35.8 26.4 35.1 23.4 35 20.2 Z" />
        {/* Japan, an arc off the east coast */}
        <path d="M46.4 16.8 C48.4 17.8 49.8 20.2 49.6 22.8 C49.4 25 48.2 25.8 47.2 24.4 C45.8 22.6 45.6 18.8 46.4 16.8 Z" />
        {/* the archipelago */}
        <circle cx="42.6" cy="26.2" r="1.4" />
        <circle cx="44.6" cy="29" r="1.1" />
        <circle cx="41" cy="30" r="1" />
      </g>
    </Flag>
  );
}

const MARKS: Record<string, () => React.ReactElement> = { uk: UK, eu: EU, asia: Asia, usa: USA };

export default function RegionMarks({ regions }: { regions: { id: string; label: string }[] }) {
  return (
    <ul className="mt-regions" aria-label="Where our work goes">
      {regions.map(({ id, label }) => {
        const Mark = MARKS[id];
        if (!Mark) return null;
        return (
          <li key={id} className="mt-region" title={label}>
            <Mark />
          </li>
        );
      })}
    </ul>
  );
}
