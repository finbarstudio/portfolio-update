"use client";

/**
 * ClientLogoMarquee — a continuously scrolling wall of client logos. The row is
 * duplicated so the CSS translateX loop is seamless; hovering the track pauses
 * it and hovering a logo lifts it to full colour and shows the client's name in
 * a token pill (the site's .tag treatment). Logos sit desaturated at rest so a
 * mix of brand colours reads as one cohesive wall.
 *
 * Plain <img> (not next/image): these are small, mixed-format logo marks (SVG/
 * PNG/webp) that just need to scale to a common height.
 */

const CLIENTS: { name: string; logo: string; slug: string }[] = [
  { name: "Lows Design + Build", logo: "/images/lows-design-build/logomark.svg", slug: "lows-design-build" },
  { name: "Plated with Issy", logo: "/images/plated-with-issy/wordmark.png", slug: "plated-with-issy" },
  { name: "KinAya", logo: "/images/kinaya/logo.svg", slug: "kinaya" },
  { name: "Salesmasters", logo: "/images/salesmasters/logo.webp", slug: "salesmasters" },
  { name: "Share to Buy", logo: "/images/tmyr/STB%20Logo.svg", slug: "tmyr" },
  { name: "Momentum Mentoring", logo: "/images/momentum-mentoring/Logo2.svg", slug: "momentum-mentoring" },
  { name: "TasWater", logo: "/images/taswater/logo.png", slug: "taswater" },
  { name: "The London Home Show", logo: "/images/london-home-show/LHS%20Logo.svg", slug: "london-home-show" },
];

export default function ClientLogoMarquee() {
  // Two copies back-to-back → the -50% keyframe lands exactly on the seam.
  const loop = [...CLIENTS, ...CLIENTS];
  return (
    <div className="cl-marquee" aria-label="Clients I've worked with">
      <ul className="cl-track">
        {loop.map((c, i) => (
          <li key={`${c.name}-${i}`} className="cl-item">
            {/* New tab: the about page stays put behind the case study. */}
            <a
              href={`/case-studies/${c.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cl-link"
              aria-label={`${c.name} case study (opens in a new tab)`}
            >
              <span className="cl-name tag tag-default" aria-hidden="true">{c.name}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.logo} alt={c.name} className="cl-logo" loading="lazy" draggable={false} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
