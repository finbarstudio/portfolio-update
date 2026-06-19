/**
 * The brand asterisk as a traceable polygon — an eight-spoked asterisk with
 * flat (rectangular) spoke tips, ≈ the U+1F7BE mark (not a pointed star). In a
 * 0–100 viewBox. Built from 8 spokes: each contributes two flat-tip corners
 * with a small notch between, so the outline reads as a chunky asterisk.
 */
function buildAsterisk(): string {
  const cx = 50, cy = 50;
  const R = 48;     // spoke length (tip radius)
  const w = 8;      // spoke half-width
  const ri = 13;    // notch radius between spokes
  const spokes = 8;
  const pts: string[] = [];
  for (let i = 0; i < spokes; i++) {
    const a = (Math.PI / 4) * i - Math.PI / 2;   // spoke centreline (start up)
    const ca = Math.cos(a), sa = Math.sin(a);
    const tx = cx + R * ca, ty = cy + R * sa;     // tip centre
    const px = -sa, py = ca;                       // unit perpendicular
    // flat tip: trailing corner, then leading corner
    pts.push(`${(tx - w * px).toFixed(2)},${(ty - w * py).toFixed(2)}`);
    pts.push(`${(tx + w * px).toFixed(2)},${(ty + w * py).toFixed(2)}`);
    // notch on the bisector with the next spoke
    const an = a + Math.PI / spokes;
    pts.push(`${(cx + ri * Math.cos(an)).toFixed(2)},${(cy + ri * Math.sin(an)).toFixed(2)}`);
  }
  return pts.join(" ");
}

export const ASTERISK_POINTS = buildAsterisk();

/**
 * Exact perimeter of the polygon in viewBox (0–100) units, including the closing
 * edge. Used as the stroke-dasharray for the preloader trace — getTotalLength()
 * under-measures polygons (it can omit the closing segment), which left the
 * outline a few % short; this is exact, so the trace draws smoothly and finishes.
 */
export const ASTERISK_PERIMETER = (() => {
  const coords = ASTERISK_POINTS.trim().split(/\s+/).map((p) => p.split(",").map(Number));
  let len = 0;
  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % coords.length];
    len += Math.hypot(x2 - x1, y2 - y1);
  }
  return len;
})();
