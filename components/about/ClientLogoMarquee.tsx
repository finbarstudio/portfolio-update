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

const CLIENTS: { name: string; logo: string }[] = [
  { name: "Lows Design + Build", logo: "/images/lows-design-build/logomark.svg" },
  { name: "Plated with Issy", logo: "/images/plated-with-issy/wordmark.png" },
  { name: "KinAya", logo: "/images/kinaya/logo.svg" },
  { name: "Salesmasters", logo: "/images/salesmasters/logo.webp" },
  { name: "Share to Buy", logo: "/images/tmyr/STB%20Logo.svg" },
  { name: "Momentum Mentoring", logo: "/images/momentum-mentoring/Logo2.svg" },
  { name: "TasWater", logo: "/images/taswater/logo.png" },
  { name: "The London Home Show", logo: "/images/london-home-show/LHS%20Logo.svg" },
];

export default function ClientLogoMarquee() {
  // Two copies back-to-back → the -50% keyframe lands exactly on the seam.
  const loop = [...CLIENTS, ...CLIENTS];
  return (
    <div className="cl-marquee" aria-label="Clients I've worked with">
      <ul className="cl-track">
        {loop.map((c, i) => (
          <li key={`${c.name}-${i}`} className="cl-item">
            <span className="cl-name tag tag-default" aria-hidden="true">{c.name}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.logo} alt={c.name} className="cl-logo" loading="lazy" draggable={false} />
          </li>
        ))}
      </ul>
    </div>
  );
}
