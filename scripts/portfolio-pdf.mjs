// Makes the downloadable portfolio PDF: public/downloads/Finbar-Skitini-Portfolio.pdf
//
//   node scripts/portfolio-pdf.mjs [site]     site defaults to http://portfolio.localhost:3000
//
// Run it with the dev server up (or point it at a running build). It
//  1. cuts a still of every portfolio clip into public/media/images/portfolio/print/,
//     at the second set for it in content/portfolio-print.json (first frame if
//     not listed). The two live 3D pieces' stills (globe.webp, phones.webp) are
//     screenshots kept in the same folder; retake them by hand if those change.
//  2. prints the print view (<site>/?print, see components/portfolio/print.ts)
//     with the installed Google Chrome: one 1600 by 900 page per sheet, text
//     and links kept live.
// After a new PDF, bump the ?v= on /portfolio.pdf in next.config.ts.
import { readFileSync, mkdirSync, rmSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";

const FFMPEG = "/opt/homebrew/bin/ffmpeg";
const CWEBP = "/opt/homebrew/bin/cwebp";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "public/downloads/Finbar-Skitini-Portfolio.pdf";
const DIR = "public/media/images/portfolio/print";
const site = (process.argv[2] ?? "http://portfolio.localhost:3000").replace(/\/$/, "");

// the same naming as stillName() in components/portfolio/print.ts
const stillName = (p) => `${p.replace(/^portfolio\//, "").replace(/\.(webm|mp4)$/, "").replace(/\//g, "-")}.webp`;

const dims = JSON.parse(readFileSync("content/portfolio-dims.json", "utf8"));
const at = JSON.parse(readFileSync("content/portfolio-print.json", "utf8"));
mkdirSync(DIR, { recursive: true });

// the desktop clips only: phone files (-mobile) and phone copies (.sm) never print
const clips = Object.keys(dims).filter((p) => /\.(webm|mp4)$/.test(p) && !p.includes(".sm.") && !/-mobile\.\w+$/.test(p));
for (const p of clips) {
  const t = at[p] ?? 0;
  const png = `${DIR}/${stillName(p)}.png`;
  execFileSync(FFMPEG, ["-v", "error", "-y", "-ss", String(t), "-i", `public/media/images/${p}`, "-frames:v", "1", "-vf", "scale='min(2000,iw)':-2:flags=lanczos", png]);
  execFileSync(CWEBP, ["-quiet", "-q", "84", "-m", "6", "-sharp_yuv", png, "-o", `${DIR}/${stillName(p)}`]);
  rmSync(png);
  console.log(`still ${String(t).padStart(2)}s  ${p}`);
}

execFileSync(CHROME, [
  "--headless",
  "--disable-gpu",
  "--hide-scrollbars",
  "--window-size=1600,900",
  "--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=30000",
  `--print-to-pdf=${OUT}`,
  `${site}/?print`,
], { stdio: "inherit" });
console.log(`${OUT}  ${(statSync(OUT).size / 1e6).toFixed(1)} MB`);
