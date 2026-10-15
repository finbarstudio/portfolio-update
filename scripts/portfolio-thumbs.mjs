// Makes the contents page's thumbnails (the Projects page in thumbnail view):
// one per chapter, 1200 by 480 (5:2), cut from the middle of a still of its
// work, into public/media/images/portfolio/thumbs/<chapter id>.webp.
//
//   node scripts/portfolio-thumbs.mjs      after node scripts/portfolio-pdf.mjs (it cuts the clip stills)
import { mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";

const MAGICK = "/opt/homebrew/bin/magick";
const CWEBP = "/opt/homebrew/bin/cwebp";
const IMG = "public/media/images";
const OUT = `${IMG}/portfolio/thumbs`;

// chapter id (content/portfolio.ts) -> the picture it is cut from. The 3D
// pieces are screenshots on black (globe-black, phones-black), taken by hand
// with the page colour set to black; the globe is trimmed of its black margin
// and shown whole, nearly the full height, on black.
const FROM = {
  lola: "portfolio/print/lola-audio-brand.webp",
  "rennen-plus": "portfolio/print/rennen-plus-website.webp",
  plated: { src: "portfolio/print/globe-black.webp", whole: "black" },
  // lifted, so the overlaid title has its own space under the lockup
  lows: { src: "portfolio/print/lows-logo-zoom.webp", whole: "black", h: 190, lift: 40 },
  "share-to-buy": "portfolio/print/phones-black.webp",
  taswater: "portfolio/taswater/map-mockup.webp",
  "london-home-show": "portfolio/print/london-home-show-event-deck.webp",
  other: "joe-devine/hero.webp",
};

mkdirSync(OUT, { recursive: true });
for (const [id, from] of Object.entries(FROM)) {
  const { src, whole, h = 440, lift = 0 } = typeof from === "string" ? { src: from } : from;
  const png = `${OUT}/${id}.png`;
  // fill 1200 by 480, cropping the middle (or trim it and fit it whole, on a colour)
  const size = whole ? ["-fuzz", "4%", "-trim", "+repage", "-resize", `1200x${h}`, "-background", whole] : ["-resize", "1200x480^"];
  // `lift` moves the picture up that many px: centre it in a shorter box, then pad the foot
  const box = lift ? ["-gravity", "center", "-extent", `1200x${480 - 2 * lift}`, "-gravity", "north", "-extent", "1200x480"] : ["-gravity", "center", "-extent", "1200x480"];
  execFileSync(MAGICK, [`${IMG}/${src}`, ...size, ...box, png]);
  execFileSync(CWEBP, ["-quiet", "-q", "82", "-m", "6", "-sharp_yuv", png, "-o", `${OUT}/${id}.webp`]);
  rmSync(png);
  console.log(`${id}  <- ${src}`);
}
