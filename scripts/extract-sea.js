// Extract per-country path data from the traced SE Asia SVG into a TS module.
// Run: node scripts/extract-sea.js   (after editing public/SVG/SE Asia SVG.svg)
const fs = require("fs");
const src = fs.readFileSync("public/SVG/SE Asia SVG.svg", "utf8");
const groupPaths = (id) => {
  const m = src.match(new RegExp('<g id="' + id + '"[^>]*>([\\s\\S]*?)</g>'));
  return m ? [...m[1].matchAll(/\sd="([^"]+)"/g)].map((x) => x[1]) : [];
};
const singlePath = (id) => {
  const m = src.match(new RegExp('<path id="' + id + '"[^>]*\\sd="([^"]+)"'));
  return m ? [m[1]] : [];
};
const out = { th: groupPaths("th"), vn: groupPaths("vn"), kh: groupPaths("kh"), la: singlePath("la") };
const ts = `// AUTO-GENERATED from public/SVG/SE Asia SVG.svg — accurate SE Asia country outlines.
// Each country is an array of SVG path "d" strings in the 0 0 92.38 153.26 viewBox.
// Regenerate after editing the source SVG: node scripts/extract-sea.js
export const TH_PATHS: string[] = ${JSON.stringify(out.th)};
export const VN_PATHS: string[] = ${JSON.stringify(out.vn)};
export const KH_PATHS: string[] = ${JSON.stringify(out.kh)};
export const LA_PATHS: string[] = ${JSON.stringify(out.la)};
`;
fs.writeFileSync("components/imogen/sea-geo.ts", ts);
console.log("regenerated sea-geo.ts — th:", out.th.length, "vn:", out.vn.length, "kh:", out.kh.length, "la:", out.la.length);
