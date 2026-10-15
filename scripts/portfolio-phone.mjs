// Makes a lighter copy of every image and clip the portfolio shows, for phones
// on mobile data, and lists them in content/portfolio-phone.json. The portfolio
// swaps to these at 760px wide and under (content/portfolio.ts: m()).
//
//   node scripts/portfolio-phone.mjs          after node scripts/portfolio-dims.mjs
//
// Each copy sits next to its file as <name>.sm.<ext>. Clips: at most 960 px
// wide (720 for a tall or square one), VP9 at CRF 36 (H.264 CRF 30 for .mp4).
// A clip with sound keeps it. Images: at most 1280 px wide (900 tall or square), WebP quality 78. A copy is
// only kept if it is clearly smaller, and only remade when its file is newer.
import { existsSync, readFileSync, statSync, writeFileSync, renameSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";

const FFMPEG = "/opt/homebrew/bin/ffmpeg";
const MAGICK = "/opt/homebrew/bin/magick";
const CWEBP = "/opt/homebrew/bin/cwebp";

const dims = JSON.parse(readFileSync("content/portfolio-dims.json", "utf8"));
const sm = (p) => p.replace(/\.(\w+)$/, ".sm.$1");
const list = [];

for (const [p, [w, h]] of Object.entries(dims)) {
  if (p.includes(".sm.")) continue;
  const file = `public/media/images/${p}`;
  const out = `public/media/images/${sm(p)}`;
  const wide = w > h;
  const video = /\.(mp4|webm)$/.test(p);
  const cap = video ? (wide ? 960 : 720) : wide ? 1280 : 900;
  if (!existsSync(out) || statSync(out).mtimeMs < statSync(file).mtimeMs) {
    const tmp = out.replace(/(\.\w+)$/, ".part$1");
    const width = Math.min(w, cap);
    if (video) {
      const codec = p.endsWith(".mp4")
        ? ["-c:v", "libx264", "-preset", "slow", "-crf", "30", "-profile:v", "high", "-movflags", "+faststart"]
        : ["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-cpu-used", "2"];
      // a clip with a soundtrack keeps it (the page's Sound button needs it)
      const sound = execFileSync("/opt/homebrew/bin/ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", file]).toString().trim() !== "";
      const audio = sound ? (p.endsWith(".mp4") ? ["-c:a", "aac", "-b:a", "128k"] : ["-c:a", "libopus", "-b:a", "96k"]) : ["-an"];
      execFileSync(FFMPEG, ["-v", "error", "-y", "-i", file, "-vf", `scale=${width}:-2:flags=lanczos`, ...codec, "-pix_fmt", "yuv420p", ...audio, tmp]);
    } else {
      const png = tmp.replace(/\.\w+$/, ".png");
      execFileSync(MAGICK, [`${file}[0]`, "-resize", `${width}x`, png]);
      execFileSync(CWEBP, ["-quiet", "-q", "78", "-m", "6", "-sharp_yuv", png, "-o", tmp]);
      rmSync(png);
    }
    renameSync(tmp, out);
  }
  // not worth a second file unless it saves at least a quarter
  if (statSync(out).size < statSync(file).size * 0.75) list.push(p);
  else rmSync(out);
  console.log(`${(statSync(file).size / 1e6).toFixed(1).padStart(5)} MB -> ${existsSync(out) ? (statSync(out).size / 1e6).toFixed(1).padStart(5) + " MB" : "   kept"}  ${p}`);
}

writeFileSync("content/portfolio-phone.json", JSON.stringify(list.sort(), null, 1) + "\n");
console.log(list.length, "phone copies listed");
