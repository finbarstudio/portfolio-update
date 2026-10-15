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

// chapter id (content/portfolio.ts) -> the picture it is cut from
const FROM = {
  lola: "portfolio/print/lola-audio-brand.webp",
  "rennen-plus": "portfolio/print/rennen-plus-website.webp",
  plated: "portfolio/print/globe.webp",
  lows: "portfolio/print/lows-macbook.webp",
  "share-to-buy": "portfolio/print/phones.webp",
  taswater: "portfolio/taswater/map-mockup.webp",
  "london-home-show": "portfolio/print/london-home-show-event-deck.webp",
  other: "joe-devine/hero.webp",
};

mkdirSync(OUT, { recursive: true });
for (const [id, src] of Object.entries(FROM)) {
  const png = `${OUT}/${id}.png`;
  // fill 1200 by 480, cropping the middle
  execFileSync(MAGICK, [`${IMG}/${src}`, "-resize", "1200x480^", "-gravity", "center", "-extent", "1200x480", png]);
  execFileSync(CWEBP, ["-quiet", "-q", "82", "-m", "6", "-sharp_yuv", png, "-o", `${OUT}/${id}.webp`]);
  rmSync(png);
  console.log(`${id}  <- ${src}`);
}
