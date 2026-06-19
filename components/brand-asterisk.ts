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
