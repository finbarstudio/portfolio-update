// Makes the contents page's thumbnails (the Projects page in thumbnail view),
// into public/media/images/portfolio/thumbs/: a still per chapter, 1200 by 534
// (9:4), cut from the middle of a still of its work (<chapter id>.webp: the
// PDF and the posters use these), and a loop for the chapters that move
// (<chapter id>.webm, 960 by 426).
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
  "palms-motel": "palmsmotel/scene-2.webp", // the dusk pool: the sign is upright and crops badly to 9:4
  taswater: "portfolio/taswater/map-mockup.webp",
  "london-home-show": "portfolio/print/london-home-show-event-deck.webp",
  other: "joe-devine/hero.webp",
};

mkdirSync(OUT, { recursive: true });
for (const [id, from] of Object.entries(FROM)) {
  const { src, whole, h = 440, lift = 0 } = typeof from === "string" ? { src: from } : from;
  const png = `${OUT}/${id}.png`;
  // fill 1200 by 534, cropping the middle (or trim it and fit it whole, on a colour)
  const size = whole ? ["-fuzz", "4%", "-trim", "+repage", "-resize", `1200x${h}`, "-background", whole] : ["-resize", "1200x534^"];
  // `lift` moves the picture up that many px: centre it in a shorter box, then pad the foot
  const box = lift ? ["-gravity", "center", "-extent", `1200x${534 - 2 * lift}`, "-gravity", "north", "-extent", "1200x534"] : ["-gravity", "center", "-extent", "1200x534"];
  execFileSync(MAGICK, [`${IMG}/${src}`, ...size, ...box, png]);
  execFileSync(CWEBP, ["-quiet", "-q", "82", "-m", "6", "-sharp_yuv", png, "-o", `${OUT}/${id}.webp`]);
  rmSync(png);
  console.log(`${id}  <- ${src}`);
}

// ── the loops (thumbs/<id>.webm, 960 by 426, VP9, muted) ──────────────────
// The contents page plays these instead of the stills (components/portfolio/PfIndex.tsx).
const FFMPEG = "/opt/homebrew/bin/ffmpeg";
const VP9 = ["-c:v", "libvpx-vp9", "-crf", "41", "-b:v", "0", "-row-mt", "1", "-cpu-used", "2", "-pix_fmt", "yuv420p", "-an"];
const FILL = "fps=30,scale=960:-2:flags=lanczos,crop=960:426"; // a 2:1 clip, cropped top and bottom
const R = `${IMG}/tmyr/1080x1920-ig-reels`;
const reel = (i) => `[${i}]crop=504:930:18:96,scale=244:450,fps=30[r${i}]`; // a reel's photo area
const CLIPS = {
  // the coverflows loop on their own
  lola: [["-i", `${IMG}/portfolio/lola-audio/brand.webm`], ["-vf", FILL]],
  "london-home-show": [["-i", `${IMG}/portfolio/london-home-show/event-deck.webm`], ["-vf", FILL]],
  // the homepage once its intro has played
  "rennen-plus": [["-ss", "5", "-t", "16", "-i", `${IMG}/portfolio/rennen-plus/website.webm`], ["-vf", FILL]],
  // the logo builds (0 to 5.2s), then wipes back to the mark (9.6 to 11.9s), so it loops; smaller and lifted for the title
  lows: [
    ["-i", `${IMG}/portfolio/lows/logo-zoom.mp4`],
    ["-filter_complex", "[0]trim=start=0:end=5.2,setpts=PTS-STARTPTS[a];[0]trim=start=9.6:end=11.9,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,fps=30,scale=880:-2:flags=lanczos,pad=960:460:40:10:black,crop=960:426:0:22[out]", "-map", "[out]"],
  ],
  // the phones-on-black still with five reels playing in its screens' photo areas
  "share-to-buy": [
    ["-loop", "1", "-framerate", "30", "-i", `${IMG}/portfolio/print/phones-black.webp`, ...["molly", "anthony", "katie", "lauren", "olu"].flatMap((n) => ["-i", `${R}/${n}.webm`])],
    ["-filter_complex", `${[1, 2, 3, 4, 5].map(reel).join(";")};[0][r1]overlay=122:191[o1];[o1][r2]overlay=480:191[o2];[o2][r3]overlay=838:191[o3];[o3][r4]overlay=1197:191[o4];[o4][r5]overlay=1555:191,scale=963:-2:flags=lanczos,crop=960:426[out]`, "-map", "[out]", "-t", "10"],
  ],
};
for (const [id, [input, filter]] of Object.entries(CLIPS)) {
  execFileSync(FFMPEG, ["-v", "error", "-y", ...input, ...filter, ...VP9, `${OUT}/${id}.webm`]);
  console.log(`${id}.webm`);
}
