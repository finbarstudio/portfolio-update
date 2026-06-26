/**
 * bezier-path — turn any SVG path/shape into normalised bezier geometry so the
 * Bezier Studio can draw its anchors, control points and handles.
 *
 * The hard parts handled here:
 *  - a tolerant `d` tokenizer (implicit repeats, exponent floats, packed arc
 *    flags like `a5 5 0 016 0`),
 *  - every command lowered to absolute `line` / `quad` / `cubic` segments,
 *  - elliptical arcs converted to ≤90° cubic spans (SVG impl-notes F.6),
 *  - primitive shapes (rect/circle/ellipse/line/poly*) lowered to path data,
 *  - an affine transform baker so a logo's nested `transform=`/`<g>` matrices can
 *    be flattened into one coordinate space before we draw the nodes.
 */

export type Pt = { x: number; y: number };

export type Seg =
  | { kind: "line"; p0: Pt; p1: Pt }
  | { kind: "quad"; p0: Pt; c: Pt; p1: Pt }
  | { kind: "cubic"; p0: Pt; c1: Pt; c2: Pt; p1: Pt };

export type SubPath = { segs: Seg[]; closed: boolean };

export type Matrix = { a: number; b: number; c: number; d: number; e: number; f: number };

/** Parse a path `d` string into absolute line/quad/cubic sub-paths. */
export function parsePath(d: string): SubPath[] {
  const subs: SubPath[] = [];
  let segs: Seg[] = [];   // segments of the sub-path being built
  let closed = false;
  let i = 0;
  const n = d.length;
  let x = 0, y = 0;       // current point
  let sx = 0, sy = 0;     // sub-path start (for Z)
  let lastCmd = "";       // for S/T reflection + implicit repeats
  let lastC2x = 0, lastC2y = 0; // previous cubic's 2nd control (absolute)
  let lastQx = 0, lastQy = 0;   // previous quad's control (absolute)

  const isWS = (ch: string) =>
    ch === " " || ch === "\t" || ch === "\n" || ch === "\r" || ch === "\f" || ch === ",";
  const skipWS = () => { while (i < n && isWS(d[i])) i++; };
  function num(): number {
    skipWS();
    const start = i;
    if (d[i] === "+" || d[i] === "-") i++;
    while (i < n && d[i] >= "0" && d[i] <= "9") i++;
    if (d[i] === ".") { i++; while (i < n && d[i] >= "0" && d[i] <= "9") i++; }
    if (d[i] === "e" || d[i] === "E") { i++; if (d[i] === "+" || d[i] === "-") i++; while (i < n && d[i] >= "0" && d[i] <= "9") i++; }
    return parseFloat(d.slice(start, i)) || 0;
  }
  function flag(): number { skipWS(); const ch = d[i]; i++; return ch === "1" ? 1 : 0; }
  function hasMore(): boolean {
    skipWS();
    const ch = d[i];
    return i < n && (ch === "+" || ch === "-" || ch === "." || (ch >= "0" && ch <= "9"));
  }
  function flush() { if (segs.length) subs.push({ segs, closed }); segs = []; closed = false; }
  const push = (seg: Seg) => segs.push(seg);

  while (i < n) {
    skipWS();
    if (i >= n) break;
    const ch = d[i];
    let cmd: string;
    if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) { cmd = ch; i++; }
    else if (lastCmd) { cmd = lastCmd === "M" ? "L" : lastCmd === "m" ? "l" : lastCmd; }
    else { i++; continue; }
    const rel = cmd >= "a";
    const U = cmd.toUpperCase();

    if (U === "M") {
      let nx = num(), ny = num();
      if (rel) { nx += x; ny += y; }
      x = nx; y = ny; sx = x; sy = y;
      flush();
      while (hasMore()) {
        let lx = num(), ly = num();
        if (rel) { lx += x; ly += y; }
        push({ kind: "line", p0: { x, y }, p1: { x: lx, y: ly } });
        x = lx; y = ly;
      }
    } else if (U === "L") {
      do {
        let lx = num(), ly = num();
        if (rel) { lx += x; ly += y; }
        push({ kind: "line", p0: { x, y }, p1: { x: lx, y: ly } });
        x = lx; y = ly;
      } while (hasMore());
    } else if (U === "H") {
      do { let lx = num(); if (rel) lx += x; push({ kind: "line", p0: { x, y }, p1: { x: lx, y } }); x = lx; } while (hasMore());
    } else if (U === "V") {
      do { let ly = num(); if (rel) ly += y; push({ kind: "line", p0: { x, y }, p1: { x, y: ly } }); y = ly; } while (hasMore());
    } else if (U === "C") {
      do {
        let x1 = num(), y1 = num(), x2 = num(), y2 = num(), ex = num(), ey = num();
        if (rel) { x1 += x; y1 += y; x2 += x; y2 += y; ex += x; ey += y; }
        push({ kind: "cubic", p0: { x, y }, c1: { x: x1, y: y1 }, c2: { x: x2, y: y2 }, p1: { x: ex, y: ey } });
        lastC2x = x2; lastC2y = y2; x = ex; y = ey;
      } while (hasMore());
    } else if (U === "S") {
      do {
        let x2 = num(), y2 = num(), ex = num(), ey = num();
        if (rel) { x2 += x; y2 += y; ex += x; ey += y; }
        const reflect = lastCmd.toUpperCase() === "C" || lastCmd.toUpperCase() === "S";
        const x1 = reflect ? 2 * x - lastC2x : x;
        const y1 = reflect ? 2 * y - lastC2y : y;
        push({ kind: "cubic", p0: { x, y }, c1: { x: x1, y: y1 }, c2: { x: x2, y: y2 }, p1: { x: ex, y: ey } });
        lastC2x = x2; lastC2y = y2; x = ex; y = ey; lastCmd = cmd;
      } while (hasMore());
    } else if (U === "Q") {
      do {
        let x1 = num(), y1 = num(), ex = num(), ey = num();
        if (rel) { x1 += x; y1 += y; ex += x; ey += y; }
        push({ kind: "quad", p0: { x, y }, c: { x: x1, y: y1 }, p1: { x: ex, y: ey } });
        lastQx = x1; lastQy = y1; x = ex; y = ey;
      } while (hasMore());
    } else if (U === "T") {
      do {
        let ex = num(), ey = num();
        if (rel) { ex += x; ey += y; }
        const reflect = lastCmd.toUpperCase() === "Q" || lastCmd.toUpperCase() === "T";
        const cxp = reflect ? 2 * x - lastQx : x;
        const cyp = reflect ? 2 * y - lastQy : y;
        push({ kind: "quad", p0: { x, y }, c: { x: cxp, y: cyp }, p1: { x: ex, y: ey } });
        lastQx = cxp; lastQy = cyp; x = ex; y = ey; lastCmd = cmd;
      } while (hasMore());
    } else if (U === "A") {
      do {
        let rx = num(), ry = num(), rot = num();
        const laf = flag(), sf = flag();
        let ex = num(), ey = num();
        if (rel) { ex += x; ey += y; }
        for (const cb of arcToCubics(x, y, rx, ry, rot, laf, sf, ex, ey)) {
          push({ kind: "cubic", p0: { x, y }, c1: cb.c1, c2: cb.c2, p1: cb.p1 });
          x = cb.p1.x; y = cb.p1.y;
        }
        x = ex; y = ey;
      } while (hasMore());
    } else if (U === "Z") {
      if (segs.length) {
        if (x !== sx || y !== sy) push({ kind: "line", p0: { x, y }, p1: { x: sx, y: sy } });
        closed = true; flush();
      }
      x = sx; y = sy;
    } else {
      continue; // unknown command letter — skip
    }
    if (U !== "Z") lastCmd = cmd;
  }
  flush();
  return subs;
}

/** Elliptical arc → array of cubic spans (SVG implementation notes F.6). */
function arcToCubics(x0: number, y0: number, rx: number, ry: number, angleDeg: number, laf: number, sf: number, x: number, y: number) {
  const out: { c1: Pt; c2: Pt; p1: Pt }[] = [];
  if (rx === 0 || ry === 0 || (x0 === x && y0 === y)) {
    out.push({ c1: { x: x0, y: y0 }, c2: { x, y }, p1: { x, y } });
    return out;
  }
  rx = Math.abs(rx); ry = Math.abs(ry);
  const phi = (angleDeg % 360) * Math.PI / 180;
  const cosP = Math.cos(phi), sinP = Math.sin(phi);
  const dx = (x0 - x) / 2, dy = (y0 - y) / 2;
  const x1p = cosP * dx + sinP * dy;
  const y1p = -sinP * dx + cosP * dy;
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) { const s = Math.sqrt(lambda); rx *= s; ry *= s; }
  const sign = laf === sf ? -1 : 1;
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const co = sign * Math.sqrt(Math.max(0, num / den));
  const cxp = co * (rx * y1p) / ry;
  const cyp = co * (-ry * x1p) / rx;
  const cx = cosP * cxp - sinP * cyp + (x0 + x) / 2;
  const cy = sinP * cxp + cosP * cyp + (y0 + y) / 2;
  const ang = (ux: number, uy: number, vx: number, vy: number) => {
    const dot = ux * vx + uy * vy;
    const len = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy)) || 1;
    let a = Math.acos(Math.min(1, Math.max(-1, dot / len)));
    if (ux * vy - uy * vx < 0) a = -a;
    return a;
  };
  const theta1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dtheta = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!sf && dtheta > 0) dtheta -= 2 * Math.PI;
  if (sf && dtheta < 0) dtheta += 2 * Math.PI;
  const count = Math.max(1, Math.ceil(Math.abs(dtheta) / (Math.PI / 2)));
  const delta = dtheta / count;
  const t = (4 / 3) * Math.tan(delta / 4);
  let th = theta1, px = x0, py = y0;
  for (let s = 0; s < count; s++) {
    const th2 = th + delta;
    const sin1 = Math.sin(th), cos1 = Math.cos(th);
    const sin2 = Math.sin(th2), cos2 = Math.cos(th2);
    const e2x = cosP * rx * cos2 - sinP * ry * sin2 + cx;
    const e2y = sinP * rx * cos2 + cosP * ry * sin2 + cy;
    const d1x = cosP * (-rx * sin1) - sinP * (ry * cos1);
    const d1y = sinP * (-rx * sin1) + cosP * (ry * cos1);
    const d2x = cosP * (-rx * sin2) - sinP * (ry * cos2);
    const d2y = sinP * (-rx * sin2) + cosP * (ry * cos2);
    out.push({ c1: { x: px + t * d1x, y: py + t * d1y }, c2: { x: e2x - t * d2x, y: e2y - t * d2y }, p1: { x: e2x, y: e2y } });
    px = e2x; py = e2y; th = th2;
  }
  return out;
}

/** Lower a primitive shape element to path `d`. Returns "" if unsupported. */
export function shapeToPathData(tag: string, attr: (name: string) => string): string {
  const f = (name: string, def = 0) => { const v = parseFloat(attr(name)); return Number.isFinite(v) ? v : def; };
  switch (tag) {
    case "rect": {
      const x = f("x"), y = f("y"), w = f("width"), h = f("height");
      if (w <= 0 || h <= 0) return "";
      let rx = attr("rx") ? f("rx") : NaN, ry = attr("ry") ? f("ry") : NaN;
      if (!Number.isFinite(rx) && Number.isFinite(ry)) rx = ry;
      if (!Number.isFinite(ry) && Number.isFinite(rx)) ry = rx;
      rx = Math.min(Number.isFinite(rx) ? rx : 0, w / 2);
      ry = Math.min(Number.isFinite(ry) ? ry : 0, h / 2);
      if (rx <= 0 || ry <= 0) return `M${x},${y} H${x + w} V${y + h} H${x} Z`;
      return `M${x + rx},${y} H${x + w - rx} A${rx},${ry} 0 0 1 ${x + w},${y + ry} V${y + h - ry} ` +
        `A${rx},${ry} 0 0 1 ${x + w - rx},${y + h} H${x + rx} A${rx},${ry} 0 0 1 ${x},${y + h - ry} ` +
        `V${y + ry} A${rx},${ry} 0 0 1 ${x + rx},${y} Z`;
    }
    case "circle": {
      const cx = f("cx"), cy = f("cy"), r = f("r");
      if (r <= 0) return "";
      return `M${cx - r},${cy} A${r},${r} 0 1 0 ${cx + r},${cy} A${r},${r} 0 1 0 ${cx - r},${cy} Z`;
    }
    case "ellipse": {
      const cx = f("cx"), cy = f("cy"), rx = f("rx"), ry = f("ry");
      if (rx <= 0 || ry <= 0) return "";
      return `M${cx - rx},${cy} A${rx},${ry} 0 1 0 ${cx + rx},${cy} A${rx},${ry} 0 1 0 ${cx - rx},${cy} Z`;
    }
    case "line":
      return `M${f("x1")},${f("y1")} L${f("x2")},${f("y2")}`;
    case "polyline":
    case "polygon": {
      const nums = (attr("points").match(/-?\d*\.?\d+(?:[eE][-+]?\d+)?/g) || []).map(Number);
      if (nums.length < 4) return "";
      let dd = `M${nums[0]},${nums[1]}`;
      for (let k = 2; k + 1 < nums.length; k += 2) dd += ` L${nums[k]},${nums[k + 1]}`;
      return tag === "polygon" ? dd + " Z" : dd;
    }
    default:
      return "";
  }
}

const apply = (m: Matrix, p: Pt): Pt => ({ x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f });

/** Bake an affine matrix into every point of every segment. */
export function transformSubPaths(subs: SubPath[], m: Matrix): SubPath[] {
  return subs.map((sp) => ({
    closed: sp.closed,
    segs: sp.segs.map((s): Seg =>
      s.kind === "line" ? { kind: "line", p0: apply(m, s.p0), p1: apply(m, s.p1) }
        : s.kind === "quad" ? { kind: "quad", p0: apply(m, s.p0), c: apply(m, s.c), p1: apply(m, s.p1) }
          : { kind: "cubic", p0: apply(m, s.p0), c1: apply(m, s.c1), c2: apply(m, s.c2), p1: apply(m, s.p1) }),
  }));
}

/** Serialise normalised sub-paths back to a `d` string (absolute commands). */
export function subPathsToD(subs: SubPath[]): string {
  const r = (v: number) => (Math.round(v * 1000) / 1000).toString();
  return subs.map((sp) => {
    if (!sp.segs.length) return "";
    let dd = `M${r(sp.segs[0].p0.x)} ${r(sp.segs[0].p0.y)}`;
    for (const s of sp.segs) {
      if (s.kind === "line") dd += ` L${r(s.p1.x)} ${r(s.p1.y)}`;
      else if (s.kind === "quad") dd += ` Q${r(s.c.x)} ${r(s.c.y)} ${r(s.p1.x)} ${r(s.p1.y)}`;
      else dd += ` C${r(s.c1.x)} ${r(s.c1.y)} ${r(s.c2.x)} ${r(s.c2.y)} ${r(s.p1.x)} ${r(s.p1.y)}`;
    }
    return sp.closed ? dd + " Z" : dd;
  }).join(" ");
}

/** Anchor (on-curve) points across all sub-paths, de-duplicated per sub-path. */
export function anchorsOf(subs: SubPath[]): Pt[] {
  const out: Pt[] = [];
  for (const sp of subs) {
    if (!sp.segs.length) continue;
    out.push(sp.segs[0].p0);
    for (let k = 0; k < sp.segs.length; k++) {
      const isLast = k === sp.segs.length - 1;
      // For a closed loop, the final endpoint coincides with the start anchor — skip it.
      if (isLast && sp.closed) continue;
      out.push(sp.segs[k].p1);
    }
  }
  return out;
}

/** Off-curve control points + the handle lines that join them to their anchors. */
export function handlesOf(subs: SubPath[]): { from: Pt; to: Pt }[] {
  const out: { from: Pt; to: Pt }[] = [];
  for (const sp of subs) {
    for (const s of sp.segs) {
      if (s.kind === "cubic") { out.push({ from: s.p0, to: s.c1 }, { from: s.p1, to: s.c2 }); }
      else if (s.kind === "quad") { out.push({ from: s.p0, to: s.c }, { from: s.p1, to: s.c }); }
    }
  }
  return out;
}

/** Axis-aligned bounds of every point we will draw (anchors + controls). */
export function boundsOf(subs: SubPath[]): { x: number; y: number; w: number; h: number } {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const eat = (p: Pt) => { if (p.x < minX) minX = p.x; if (p.y < minY) minY = p.y; if (p.x > maxX) maxX = p.x; if (p.y > maxY) maxY = p.y; };
  for (const sp of subs) for (const s of sp.segs) {
    eat(s.p0); eat(s.p1);
    if (s.kind === "cubic") { eat(s.c1); eat(s.c2); }
    else if (s.kind === "quad") eat(s.c);
  }
  if (!Number.isFinite(minX)) return { x: 0, y: 0, w: 100, h: 100 };
  return { x: minX, y: minY, w: Math.max(1e-3, maxX - minX), h: Math.max(1e-3, maxY - minY) };
}
