"use client";
import { media } from "@/lib/media";

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
  { name: "Rennen Plus", logo: media("/media/images/rennen-plus/logo.svg"), slug: "rennen-plus" },
  { name: "Lows Design + Build", logo: media("/media/images/lows-design-build/logomark.svg"), slug: "lows-design-build" },
  { name: "Plated with Issy", logo: media("/media/images/plated-with-issy/wordmark.webp"), slug: "plated-with-issy" },
  { name: "KinAya", logo: media("/media/images/kinaya/logo.svg"), slug: "kinaya" },
  { name: "Salesmasters", logo: media("/media/images/salesmasters/logo.webp"), slug: "salesmasters" },
  { name: "Share to Buy", logo: media("/media/images/tmyr/stb-logo.svg"), slug: "tmyr" },
  { name: "Momentum Mentoring", logo: media("/media/images/momentum-mentoring/logo2.svg"), slug: "momentum-mentoring" },
  { name: "TasWater", logo: media("/media/images/taswater/logo.webp"), slug: "taswater" },
  { name: "The London Home Show", logo: media("/media/images/london-home-show/lhs-logo.svg"), slug: "london-home-show" },
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
