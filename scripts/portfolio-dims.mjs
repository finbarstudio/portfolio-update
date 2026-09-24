// Writes content/portfolio-dims.json: [width, height] for every image and clip
// content/portfolio.ts uses, so /portfolio can frame each one at its true
// proportions without cropping and without reading public/media at build time.
// Run after adding media to the portfolio: node scripts/portfolio-dims.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const src = readFileSync("content/portfolio.ts", "utf8");
const paths = [...new Set([...src.matchAll(/"([\w./-]+\.(?:webp|png|jpe?g|gif|mp4|webm))"/g)].map((x) => x[1]))].sort();
const dims = {};
for (const p of paths) {
  const file = `public/media/images/${p}`;
  if (p.endsWith(".svg")) continue;
  const out = /\.(mp4|webm)$/.test(p)
    ? execFileSync("/opt/homebrew/bin/ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", file])
    : execFileSync("/opt/homebrew/bin/magick", ["identify", "-format", "%wx%h", `${file}[0]`]);
  dims[p] = out.toString().trim().split("x").map(Number);
}
writeFileSync("content/portfolio-dims.json", JSON.stringify(dims, null, 1) + "\n");
console.log(Object.keys(dims).length, "media measured");
