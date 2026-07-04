/* ============================================================
   GemFest icon lab v2
   4 pinned keepers (gem actual, daisy #40, heart #100, flower #138)
   + 200 new: ~100 categories x 2 variations
   Technique: jittered anchors -> closed Catmull-Rom spline,
   gradient fill, exact-offset white keyline (3-layer paint)
   ============================================================ */

/* ---------- seeded RNG ---------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- closed Catmull-Rom spline ---------- */
function spline(points, tension = 1) {
  const n = points.length;
  const p = (i) => points[(i + n) % n];
  let d = `M ${p(0).x.toFixed(2)} ${p(0).y.toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d + " Z";
}

const TAU = Math.PI * 2;
function jit(rng, amt) { return 1 + (rng() * 2 - 1) * amt; }

/* ---------- point transforms (perspective toolkit) ----------
   rot (deg), sx/sy scale, skx skew-x, taper: +ve shrinks top    */
function xform(pts, { rot = 0, sx = 1, sy = 1, skx = 0, taper = 0 } = {}) {
  const rad = rot * Math.PI / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  return pts.map(({ x, y }) => {
    let x0 = x - 50, y0 = y - 50;
    let rx = x0 * cos - y0 * sin, ry = x0 * sin + y0 * cos;
    rx *= 1 + taper * (ry / 50);       // pseudo-perspective taper
    rx += skx * ry;                    // skew
    rx *= sx; ry *= sy;
    return { x: 50 + rx, y: 50 + ry };
  });
}

function bbox(pts) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const p of pts) {
    x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y);
    x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y);
  }
  return { x0, y0, x1, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
}

/* ---------- radial anchor builders ---------- */
function radial(rng, radii, angleJit = 0.06) {
  return radii.map(({ a, r }) => ({
    x: 50 + Math.cos(a + (rng() * 2 - 1) * angleJit) * r,
    y: 50 + Math.sin(a + (rng() * 2 - 1) * angleJit) * r,
  }));
}

function scallopPts(rng, { petals, rv, rt, jr = 0.12 }) {
  const radii = [];
  for (let i = 0; i < petals; i++) {
    const base = (i / petals) * TAU;
    radii.push({ a: base, r: rv * jit(rng, jr * 0.8) });
    radii.push({ a: base + TAU / petals / 2, r: rt * jit(rng, jr) });
  }
  return radial(rng, radii);
}

function spikePts(rng, { arms, rIn, rOut, swirl = 0, jr = 0.12, armMul = null }) {
  const radii = [];
  for (let i = 0; i < arms; i++) {
    const base = (i / arms) * TAU - Math.PI / 2;
    const mul = armMul ? armMul[i % armMul.length] : 1;
    radii.push({ a: base, r: rOut * mul * jit(rng, jr) });
    radii.push({ a: base + (TAU / arms) * (0.5 + swirl * 0.35), r: rIn * jit(rng, jr) });
  }
  return radial(rng, radii, 0.04);
}

function bumpPts(rng, { n, base, amp }) {
  const radii = [];
  for (let i = 0; i < n; i++) radii.push({ a: (i / n) * TAU, r: base * jit(rng, amp) });
  return radial(rng, radii, 0.1);
}

/* ---------- cartesian anchor presets ---------- */
const PRESETS = {
  gem: [{x:20,y:26},{x:38,y:19},{x:64,y:19},{x:82,y:26},{x:91,y:40},{x:68,y:66},{x:50,y:88},{x:31,y:68},{x:9,y:41}],
  diamondCut: [{x:30,y:18},{x:70,y:18},{x:88,y:38},{x:69,y:62},{x:50,y:88},{x:31,y:62},{x:12,y:38}],
  crescent: [{x:62,y:10},{x:38,y:12},{x:18,y:28},{x:12,y:50},{x:18,y:72},{x:38,y:88},{x:62,y:90},{x:50,y:76},{x:41,y:63},{x:38,y:50},{x:41,y:37},{x:50,y:24}],
  crescentThin: [{x:66,y:12},{x:42,y:12},{x:22,y:26},{x:14,y:50},{x:22,y:74},{x:42,y:88},{x:66,y:88},{x:56,y:78},{x:47,y:65},{x:44,y:50},{x:47,y:35},{x:56,y:22}],
  drop: [{x:47,y:12},{x:50,y:8},{x:53,y:12},{x:66,y:36},{x:72,y:56},{x:66,y:76},{x:50,y:86},{x:34,y:76},{x:28,y:56},{x:34,y:36}],
  egg: [{x:50,y:10},{x:66,y:20},{x:74,y:42},{x:72,y:64},{x:60,y:84},{x:40,y:84},{x:28,y:64},{x:26,y:42},{x:34,y:20}],
  bolt: [{x:60,y:6},{x:34,y:48},{x:48,y:52},{x:38,y:94},{x:72,y:44},{x:56,y:40}],
  cross: [{x:40,y:12},{x:60,y:12},{x:61,y:38},{x:88,y:40},{x:88,y:60},{x:61,y:61},{x:60,y:88},{x:40,y:88},{x:39,y:61},{x:12,y:60},{x:12,y:40},{x:39,y:38}],
  butterfly: [{x:50,y:32},{x:66,y:14},{x:86,y:18},{x:88,y:40},{x:66,y:50},{x:84,y:62},{x:78,y:82},{x:58,y:78},{x:50,y:62},{x:42,y:78},{x:22,y:82},{x:16,y:62},{x:34,y:50},{x:12,y:40},{x:14,y:18},{x:34,y:14}],
  mushroom: [{x:50,y:12},{x:74,y:20},{x:86,y:38},{x:78,y:50},{x:62,y:50},{x:64,y:68},{x:68,y:86},{x:50,y:92},{x:32,y:86},{x:36,y:68},{x:38,y:50},{x:22,y:50},{x:14,y:38},{x:26,y:20}],
  shield: [{x:50,y:10},{x:76,y:17},{x:84,y:29},{x:80,y:52},{x:66,y:74},{x:50,y:88},{x:34,y:74},{x:20,y:52},{x:16,y:29},{x:24,y:17}],
  arrow: [{x:50,y:8},{x:80,y:44},{x:62,y:44},{x:64,y:88},{x:36,y:88},{x:38,y:44},{x:20,y:44}],
  peanut: [{x:36,y:14},{x:56,y:16},{x:62,y:34},{x:56,y:48},{x:62,y:62},{x:70,y:78},{x:56,y:90},{x:36,y:88},{x:28,y:70},{x:34,y:50},{x:26,y:32}],
  ribbon: [{x:10,y:38},{x:28,y:28},{x:44,y:42},{x:60,y:28},{x:76,y:42},{x:90,y:32},{x:92,y:52},{x:74,y:64},{x:58,y:50},{x:42,y:64},{x:26,y:50},{x:10,y:60}],
};

function presetPts(rng, name, j = 4) {
  return PRESETS[name].map(p => ({ x: p.x + (rng() * 2 - 1) * j, y: p.y + (rng() * 2 - 1) * j }));
}

/* ---------- heart (parametric) ---------- */
function heartPts(rng, { rot = 0, sx = 1, sy = 1, jr = 0.06 } = {}) {
  const n = 16, pts = [];
  const s = 2.55 + rng() * 0.3;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * TAU;
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    pts.push({ x: 50 + x * s * jit(rng, jr), y: 50 + y * s * jit(rng, jr) + 2 });
  }
  return xform(pts, { rot, sx, sy });
}

/* ---------- white cutout decos (%%G%% = gradient url token) ---------- */
function decoSparkle(rng, cx, cy, size, rot) {
  const a = size * jit(rng, 0.3), b = size * 0.9 * jit(rng, 0.3);
  const c = size * jit(rng, 0.3), d = size * 0.9 * jit(rng, 0.3);
  const w = size * 0.16;
  const pts = [
    { x: 0, y: -a }, { x: w, y: -w }, { x: b, y: 0 }, { x: w, y: w },
    { x: 0, y: c }, { x: -w, y: w }, { x: -d, y: 0 }, { x: -w, y: -w },
  ];
  return `<path fill="#fff" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${rot.toFixed(1)})" d="${spline(pts, 0.9)}"/>`;
}

function decoStar5(rng, cx, cy, size, rot) {
  const radii = [];
  for (let i = 0; i < 5; i++) {
    const base = (i / 5) * TAU - Math.PI / 2;
    radii.push({ a: base, r: size * jit(rng, 0.15) });
    radii.push({ a: base + TAU / 10, r: size * 0.45 * jit(rng, 0.15) });
  }
  const pts = radii.map(({ a, r }) => ({ x: Math.cos(a) * r, y: Math.sin(a) * r }));
  return `<path fill="#fff" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${rot.toFixed(1)})" d="${spline(pts, 0.8)}"/>`;
}

function decoFace(rng, cx, cy, size) {
  const e = size * 0.22;
  return `<circle cx="${(cx - size * 0.42).toFixed(1)}" cy="${(cy - size * 0.18).toFixed(1)}" r="${e.toFixed(1)}" fill="#fff"/>
    <circle cx="${(cx + size * 0.42).toFixed(1)}" cy="${(cy - size * 0.22).toFixed(1)}" r="${(e * jit(rng, 0.2)).toFixed(1)}" fill="#fff"/>
    <path fill="none" stroke="#fff" stroke-width="${(size * 0.18).toFixed(1)}" stroke-linecap="round"
      d="M ${(cx - size * 0.5).toFixed(1)} ${(cy + size * 0.3).toFixed(1)} Q ${cx.toFixed(1)} ${(cy + size * 0.75).toFixed(1)} ${(cx + size * 0.52).toFixed(1)} ${(cy + size * 0.26).toFixed(1)}"/>`;
}

function decoRing(rng, cx, cy, size) {
  return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${size.toFixed(1)}" fill="#fff"/>
    <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(size * 0.55).toFixed(1)}" fill="%%G%%"/>`;
}

function decoDots(rng, cx, cy, size) {
  let s = "";
  const n = 2 + Math.floor(rng() * 3);
  for (let i = 0; i < n; i++) {
    s += `<circle cx="${(cx + (rng() * 2 - 1) * size * 1.4).toFixed(1)}" cy="${(cy + (rng() * 2 - 1) * size * 1.4).toFixed(1)}" r="${(size * (0.25 + rng() * 0.3)).toFixed(1)}" fill="#fff"/>`;
  }
  return s;
}

function pickDeco(rng, cx, cy, scale, style) {
  const size = 10 * scale;
  const ox = (rng() * 2 - 1) * 6 * scale, oy = (rng() * 2 - 1) * 6 * scale;
  const x = cx + ox, y = cy + oy;
  switch (style) {
    case "face": return decoFace(rng, cx, cy, size * 1.5);
    case "ring": return decoRing(rng, x, y, size * 0.9);
    case "star5": return decoStar5(rng, x, y, size, rng() * 50 - 25);
    case "dots": return decoDots(rng, cx, cy, size);
    case "ellipse": {
      const r = size * 1.05;
      return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * (0.8 + rng() * 0.2)).toFixed(1)}" fill="#fff" transform="rotate(${(rng() * 24 - 12).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
    case "dot": return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(size * 0.5).toFixed(1)}" fill="#fff"/>`;
    case "pair": {
      let s = decoSparkle(rng, x, y, size, rng() * 40 - 20);
      const ang = rng() * TAU;
      s += decoSparkle(rng, x + Math.cos(ang) * size * 1.7, y + Math.sin(ang) * size * 1.7, size * 0.45, rng() * 60 - 30);
      return s;
    }
    default: return decoSparkle(rng, x, y, size, rng() * 40 - 20);
  }
}

function randDecoStyle(rng) {
  const r = rng();
  if (r < 0.42) return "sparkle";
  if (r < 0.62) return "pair";
  if (r < 0.74) return "star5";
  if (r < 0.84) return "dot";
  if (r < 0.94) return "ellipse";
  return "dots";
}

/* ---------- category factories ---------- */
function catScallop(o) {
  return (rng) => {
    const pts = xform(scallopPts(rng, o), { rot: (o.rot || 0) + (rng() * 14 - 7), sx: o.sx, sy: o.sy, taper: o.taper, skx: o.skx });
    return { pts, tension: o.tension || 1, deco: o.deco };
  };
}
function catSpike(o) {
  return (rng) => {
    const pts = xform(spikePts(rng, o), { rot: (o.rot || 0) + (rng() * 10 - 5), sx: o.sx, sy: o.sy, taper: o.taper, skx: o.skx });
    return { pts, tension: o.tension || 0.85, deco: o.deco };
  };
}
function catBumps(o) {
  return (rng) => {
    const pts = xform(bumpPts(rng, o), { rot: rng() * 360, sx: o.sx, sy: o.sy });
    return { pts, tension: 1, deco: o.deco };
  };
}
function catPreset(name, o = {}) {
  return (rng) => {
    const pts = xform(presetPts(rng, name, o.j), { rot: (o.rot || 0) + (rng() * (o.rj || 8) - (o.rj || 8) / 2), sx: o.sx, sy: o.sy, taper: o.taper, skx: o.skx });
    return { pts, tension: o.tension || 0.9, deco: o.deco };
  };
}
function catHeart(o = {}) {
  return (rng) => {
    const pts = heartPts(rng, { rot: (o.rot || 0) + (rng() * 10 - 5), sx: o.sx || 1, sy: o.sy || 1 });
    return { pts, tension: 1, deco: o.deco };
  };
}

/* ---------- the ~100 categories ---------- */
const CATS = [
  /* -- flowers & scallops -- */
  ["clover-3",       catScallop({ petals: 3, rv: 16, rt: 45, jr: 0.14 })],
  ["clover-4",       catScallop({ petals: 4, rv: 18, rt: 45, jr: 0.14 })],
  ["bloom-5",        catScallop({ petals: 5, rv: 22, rt: 45 })],
  ["flower-6",       catScallop({ petals: 6, rv: 21, rt: 45 })],
  ["flower-7",       catScallop({ petals: 7, rv: 24, rt: 45 })],
  ["daisy-8",        catScallop({ petals: 8, rv: 27, rt: 44, deco: "ellipse" })],
  ["daisy-10",       catScallop({ petals: 10, rv: 28, rt: 44, deco: "ellipse" })],
  ["daisy-12",       catScallop({ petals: 12, rv: 30, rt: 44, deco: "ellipse" })],
  ["daisy-14",       catScallop({ petals: 14, rv: 31, rt: 44, deco: "ellipse" })],
  ["daisy-16",       catScallop({ petals: 16, rv: 32, rt: 44, deco: "ellipse" })],
  ["poppy-5",        catScallop({ petals: 5, rv: 15, rt: 46, jr: 0.16 })],
  ["poppy-6",        catScallop({ petals: 6, rv: 16, rt: 46, jr: 0.16 })],
  ["bloom-8-soft",   catScallop({ petals: 8, rv: 33, rt: 44 })],
  ["flower-6-wide",  catScallop({ petals: 6, rv: 21, rt: 42, sx: 1.22, sy: 0.9 })],
  ["flower-8-squat", catScallop({ petals: 8, rv: 26, rt: 44, sy: 0.78 })],
  ["daisy-oval",     catScallop({ petals: 10, rv: 28, rt: 43, sx: 1.15, sy: 0.82, deco: "ellipse" })],

  /* -- stars, sparkles, suns -- */
  ["star-3",         catSpike({ arms: 3, rIn: 17, rOut: 46, tension: 0.8 })],
  ["sparkle-4-fat",  catSpike({ arms: 4, rIn: 15, rOut: 46 })],
  ["sparkle-4-thin", catSpike({ arms: 4, rIn: 9, rOut: 48, tension: 0.7 })],
  ["star-5-puffy",   catSpike({ arms: 5, rIn: 26, rOut: 46, tension: 1 })],
  ["star-5",         catSpike({ arms: 5, rIn: 21, rOut: 46 })],
  ["star-6",         catSpike({ arms: 6, rIn: 23, rOut: 46 })],
  ["star-7",         catSpike({ arms: 7, rIn: 25, rOut: 45 })],
  ["star-8",         catSpike({ arms: 8, rIn: 27, rOut: 45 })],
  ["sun-10",         catSpike({ arms: 10, rIn: 31, rOut: 45, tension: 0.9 })],
  ["sun-12",         catSpike({ arms: 12, rIn: 33, rOut: 45, tension: 0.9, deco: "face" })],
  ["burst-9",        catSpike({ arms: 9, rIn: 16, rOut: 47, tension: 0.7 })],
  ["burst-11",       catSpike({ arms: 11, rIn: 18, rOut: 46, tension: 0.7 })],
  ["pinwheel-4",     catSpike({ arms: 4, rIn: 16, rOut: 46, swirl: 0.9 })],
  ["pinwheel-6",     catSpike({ arms: 6, rIn: 20, rOut: 45, swirl: 0.9 })],
  ["gear-8",         catSpike({ arms: 8, rIn: 34, rOut: 44, tension: 0.55 })],
  ["gear-10",        catSpike({ arms: 10, rIn: 35, rOut: 44, tension: 0.55 })],
  ["twinkle-5",      catSpike({ arms: 5, rIn: 12, rOut: 47, tension: 0.65 })],
  ["star-4-square",  catSpike({ arms: 4, rIn: 24, rOut: 45, tension: 1 })],
  ["sun-14",         catSpike({ arms: 14, rIn: 35, rOut: 45, tension: 0.85 })],
  ["burst-7",        catSpike({ arms: 7, rIn: 14, rOut: 47, tension: 0.7 })],

  /* -- PERSPECTIVE set -- */
  ["zoom-star-4",     catSpike({ arms: 4, rIn: 11, rOut: 40, sx: 1.7, sy: 0.78, rot: 0, deco: "sparkle" })],
  ["zoom-star-4-xl",  catSpike({ arms: 4, rIn: 9, rOut: 38, sx: 2.1, sy: 0.62 })],
  ["zoom-star-5",     catSpike({ arms: 5, rIn: 18, rOut: 40, sx: 1.6, sy: 0.8 })],
  ["zoom-star-6",     catSpike({ arms: 6, rIn: 20, rOut: 40, sx: 1.55, sy: 0.72 })],
  ["zoom-burst-8",    catSpike({ arms: 8, rIn: 15, rOut: 40, sx: 1.5, sy: 0.7, tension: 0.7 })],
  ["zoom-sparkle-sk", catSpike({ arms: 4, rIn: 11, rOut: 42, sx: 1.4, skx: 0.35 })],
  ["skew-star-l",     catSpike({ arms: 5, rIn: 20, rOut: 44, skx: -0.4 })],
  ["skew-star-r",     catSpike({ arms: 5, rIn: 20, rOut: 44, skx: 0.4 })],
  ["taper-star-up",   catSpike({ arms: 5, rIn: 21, rOut: 45, taper: 0.5 })],
  ["taper-star-dn",   catSpike({ arms: 5, rIn: 21, rOut: 45, taper: -0.5 })],
  ["comet-4",         catSpike({ arms: 4, rIn: 11, rOut: 30, armMul: [1, 0.9, 2.6, 0.9], rot: 45, sx: 1.25, tension: 0.7 })],
  ["comet-5",         catSpike({ arms: 5, rIn: 14, rOut: 32, armMul: [1, 1, 2.4, 1, 0.9], rot: 20, tension: 0.7 })],
  ["flower-persp",    catScallop({ petals: 8, rv: 26, rt: 44, sy: 0.55, deco: "ellipse" })],
  ["daisy-flat",      catScallop({ petals: 12, rv: 30, rt: 44, sy: 0.45, sx: 1.2, deco: "ellipse" })],
  ["heart-persp",     catHeart({ sx: 1.35, sy: 0.78 })],
  ["heart-zoom",      catHeart({ sx: 1.6, sy: 0.6 })],
  ["gem-persp",       catPreset("gem", { sx: 1.35, sy: 0.75 })],
  ["gem-zoom",        catPreset("gem", { sx: 1.6, sy: 0.6 })],
  ["clover-persp",    catScallop({ petals: 4, rv: 18, rt: 44, sy: 0.6, sx: 1.3 })],
  ["bolt-persp",      catPreset("bolt", { sx: 1.4, sy: 0.8, tension: 0.6 })],

  /* -- blobs, pebbles, clouds -- */
  ["pebble-5",       catBumps({ n: 5, base: 38, amp: 0.2 })],
  ["pebble-6",       catBumps({ n: 6, base: 38, amp: 0.22 })],
  ["blob-7",         catBumps({ n: 7, base: 38, amp: 0.25 })],
  ["blob-8",         catBumps({ n: 8, base: 38, amp: 0.25 })],
  ["splat-9",        catBumps({ n: 9, base: 38, amp: 0.38 })],
  ["splat-11",       catBumps({ n: 11, base: 38, amp: 0.42 })],
  ["cloud",          (rng) => ({ pts: xform([{x:20,y:60},{x:13,y:48},{x:22,y:37},{x:35,y:33},{x:42,y:23},{x:56,y:20},{x:68,y:26},{x:76,y:34},{x:87,y:40},{x:90,y:52},{x:83,y:62},{x:68,y:66},{x:50,y:67},{x:32,y:67}].map(p => ({ x: p.x + (rng()*2-1)*3.5, y: p.y + (rng()*2-1)*3.5 })), { sx: 1.05 }), tension: 1, deco: "dot" })],
  ["cloud-long",     (rng) => ({ pts: xform([{x:20,y:60},{x:13,y:48},{x:22,y:37},{x:35,y:33},{x:42,y:23},{x:56,y:20},{x:68,y:26},{x:76,y:34},{x:87,y:40},{x:90,y:52},{x:83,y:62},{x:68,y:66},{x:50,y:67},{x:32,y:67}].map(p => ({ x: p.x + (rng()*2-1)*3.5, y: p.y + (rng()*2-1)*3.5 })), { sx: 1.45, sy: 0.85 }), tension: 1, deco: "sparkle" })],

  /* -- cartesian motifs -- */
  ["gem-soft",       catPreset("gem")],
  ["diamond-cut",    catPreset("diamondCut", { tension: 0.75 })],
  ["crescent",       catPreset("crescent", { tension: 1, j: 3 })],
  ["crescent-thin",  catPreset("crescentThin", { tension: 1, j: 3 })],
  ["drop",           catPreset("drop", { tension: 0.9 })],
  ["leaf",           catPreset("drop", { rot: 42, tension: 0.9, deco: "dot" })],
  ["egg",            catPreset("egg")],
  ["bolt",           catPreset("bolt", { tension: 0.6, j: 3 })],
  ["bolt-chunky",    catPreset("bolt", { tension: 0.9, j: 5, sx: 1.15 })],
  ["cross",          catPreset("cross", { tension: 0.7, j: 3 })],
  ["cross-round",    catPreset("cross", { tension: 1.1, j: 3 })],
  ["butterfly",      catPreset("butterfly", { tension: 0.8, j: 3, rj: 4 })],
  ["mushroom",       catPreset("mushroom", { tension: 0.8, j: 3, rj: 4, deco: "dots" })],
  ["shield",         catPreset("shield")],
  ["arrow-up",       catPreset("arrow", { tension: 0.7, j: 3 })],
  ["peanut",         catPreset("peanut", { tension: 1 })],
  ["ribbon",         catPreset("ribbon", { tension: 0.9, j: 3, rj: 4 })],

  /* -- hearts -- */
  ["heart-tilt-l",   catHeart({ rot: -14 })],
  ["heart-tilt-r",   catHeart({ rot: 14 })],
  ["heart-wide",     catHeart({ sx: 1.25 })],
  ["heart-slim",     catHeart({ sx: 0.85, sy: 1.08 })],

  /* -- deco-led novelty -- */
  ["smiley",         catBumps({ n: 8, base: 36, amp: 0.12, deco: "face" })],
  ["smiley-star",    catSpike({ arms: 5, rIn: 26, rOut: 46, tension: 1, deco: "face" })],
  ["smiley-flower",  catScallop({ petals: 8, rv: 28, rt: 44, deco: "face" })],
  ["smiley-heart",   catHeart({ deco: "face" })],
  ["donut",          catBumps({ n: 8, base: 37, amp: 0.14, deco: "ring" })],
  ["donut-star",     catSpike({ arms: 6, rIn: 25, rOut: 45, tension: 1, deco: "ring" })],
  ["ringed-gem",     catPreset("gem", { deco: "ring" })],
  ["dotty-sparkle",  catSpike({ arms: 4, rIn: 13, rOut: 46, deco: "dots" })],
  ["star-dotty",     catSpike({ arms: 5, rIn: 22, rOut: 46, deco: "dots" })],
  ["moon-face",      catPreset("crescent", { tension: 1, j: 3, deco: "dot" })],

  /* -- extra perspective explorations -- */
  ["heart-skew",     catHeart({ rot: -6, sx: 1.2, sy: 0.9 })],
  ["sun-persp",      catSpike({ arms: 12, rIn: 32, rOut: 42, sx: 1.4, sy: 0.65, tension: 0.85 })],
  ["burst-taper",    catSpike({ arms: 9, rIn: 16, rOut: 45, taper: 0.55, tension: 0.7 })],
  ["pinwheel-8",     catSpike({ arms: 8, rIn: 24, rOut: 44, swirl: 0.9 })],
  ["butterfly-persp",catPreset("butterfly", { tension: 0.8, j: 3, rj: 4, sy: 0.7, sx: 1.25 })],
];

/* ---------- gradients ---------- */
const GRADS = `
  <linearGradient id="g0" x1="0%" y1="100%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#1E7BF0"/><stop offset="55%" stop-color="#00B8F5"/><stop offset="100%" stop-color="#00F0FF"/>
  </linearGradient>
  <linearGradient id="g1" x1="10%" y1="90%" x2="80%" y2="5%">
    <stop offset="0%" stop-color="#2568E8"/><stop offset="60%" stop-color="#00AEF2"/><stop offset="100%" stop-color="#2FF3FF"/>
  </linearGradient>
  <linearGradient id="g2" x1="0%" y1="80%" x2="100%" y2="20%">
    <stop offset="0%" stop-color="#1787F2"/><stop offset="100%" stop-color="#00E4FC"/>
  </linearGradient>`;

/* ---------- icon assembly (3-layer keyline paint) ---------- */
function iconFromCat(rng, gen) {
  const { pts, tension, deco } = gen(rng);
  const d = spline(pts, tension);
  const grad = `url(#g${Math.floor(rng() * 3)})`;
  const b = bbox(pts);
  const scale = Math.min(b.w, b.h) / 76;
  const rim = (9 + rng() * 3) * Math.max(scale, 0.7);
  const key = (3.4 + rng() * 1.2) * Math.max(scale, 0.7);
  const style = deco || randDecoStyle(rng);
  const decoStr = pickDeco(rng, b.cx, b.cy, Math.max(scale, 0.55), style).replaceAll("%%G%%", grad);
  const pad = rim + 8;
  const vb = `${(b.x0 - pad).toFixed(1)} ${(b.y0 - pad).toFixed(1)} ${(b.w + pad * 2).toFixed(1)} ${(b.h + pad * 2).toFixed(1)}`;
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">
    <path d="${d}" fill="${grad}" stroke="${grad}" stroke-width="${rim.toFixed(1)}" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="#fff" stroke-width="${key.toFixed(1)}" stroke-linejoin="round"/>
    <path d="${d}" fill="${grad}"/>
    ${decoStr}
  </svg>`;
}

/* ============================================================
   PINNED KEEPERS — exact reproductions from v1 (seed 1)
   ============================================================ */
function v1_cutoutSparkle(rng, cx, cy, size, rot) {
  const a = size * jit(rng, 0.3), b = size * jit(rng, 0.3) * 0.9;
  const c = size * jit(rng, 0.3), d = size * jit(rng, 0.3) * 0.9;
  const w = size * 0.16;
  const pts = [
    { x: 0, y: -a }, { x: w, y: -w }, { x: b, y: 0 }, { x: w, y: w },
    { x: 0, y: c }, { x: -w, y: w }, { x: -d, y: 0 }, { x: -w, y: -w },
  ];
  return `<path fill="#fff" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${rot.toFixed(1)})" d="${spline(pts, 0.9)}"/>`;
}
function v1_cutouts(rng, cx, cy) {
  let s = "";
  const bigR = 9 + rng() * 4;
  const ox = (rng() * 2 - 1) * 8, oy = (rng() * 2 - 1) * 8;
  s += v1_cutoutSparkle(rng, cx + ox, cy + oy, bigR, rng() * 40 - 20);
  if (rng() > 0.45) {
    const ang = rng() * TAU;
    s += v1_cutoutSparkle(rng, cx + ox + Math.cos(ang) * 16, cy + oy + Math.sin(ang) * 16, bigR * 0.45, rng() * 60 - 30);
  }
  return s;
}
function v1_radialPoints(rng, cx, cy, radii, angleJit = 0.12) {
  return radii.map(({ a, r }) => ({
    x: cx + Math.cos(a + (rng() * 2 - 1) * angleJit) * r,
    y: cy + Math.sin(a + (rng() * 2 - 1) * angleJit) * r,
  }));
}
function v1_genDaisy(rng) {
  const petals = 8 + Math.floor(rng() * 6);
  const cx = 50 + (rng() * 2 - 1) * 3, cy = 50 + (rng() * 2 - 1) * 3;
  const Rt = 42 + rng() * 5, Rv = 26 + rng() * 5;
  const radii = [];
  for (let i = 0; i < petals; i++) {
    const base = (i / petals) * TAU;
    radii.push({ a: base, r: Rv * jit(rng, 0.1) });
    radii.push({ a: base + TAU / petals / 2, r: Rt * jit(rng, 0.13) });
  }
  const d = spline(v1_radialPoints(rng, cx, cy, radii, 0.05), 1);
  const erx = 9 + rng() * 4;
  const deco = `<ellipse cx="${(cx + (rng() * 2 - 1) * 4).toFixed(1)}" cy="${(cy + (rng() * 2 - 1) * 4).toFixed(1)}" rx="${erx.toFixed(1)}" ry="${(erx * (0.82 + rng() * 0.2)).toFixed(1)}" fill="#fff" transform="rotate(${(rng() * 24 - 12).toFixed(1)} ${cx} ${cy})"/>`;
  return { d, deco };
}
function v1_genHeart(rng) {
  const cx = 50 + (rng() * 2 - 1) * 2, cy = 48 + (rng() * 2 - 1) * 2;
  const s = 2.55 + rng() * 0.3;
  const rot = (rng() * 24 - 12) * Math.PI / 180;
  const n = 16;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * TAU;
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    x *= s * jit(rng, 0.06); y *= s * jit(rng, 0.06);
    const rx = x * Math.cos(rot) - y * Math.sin(rot);
    const ry = x * Math.sin(rot) + y * Math.cos(rot);
    pts.push({ x: cx + rx, y: cy + ry + 2 });
  }
  return { d: spline(pts, 1), deco: v1_cutouts(rng, cx, cy - 4) };
}
function v1_genFlower(rng) {
  const petals = 5 + Math.floor(rng() * 4);
  const cx = 50 + (rng() * 2 - 1) * 3, cy = 50 + (rng() * 2 - 1) * 3;
  const Rt = 44 + rng() * 4, Rv = 18 + rng() * 6;
  const radii = [];
  for (let i = 0; i < petals; i++) {
    const base = (i / petals) * TAU;
    radii.push({ a: base, r: Rv * jit(rng, 0.12) });
    radii.push({ a: base + TAU / petals / 2, r: Rt * jit(rng, 0.15) });
  }
  const d = spline(v1_radialPoints(rng, cx, cy, radii, 0.06), 1);
  return { d, deco: v1_cutouts(rng, cx, cy) };
}
function v1_iconSVG(rng, gen) {
  const { d, deco } = gen(rng);
  const grad = `url(#g${Math.floor(rng() * 3)})`;
  const rim = 9 + rng() * 3;
  const key = 3.4 + rng() * 1.4;
  return `<svg viewBox="-10 -10 120 120" xmlns="http://www.w3.org/2000/svg">
    <path d="${d}" fill="${grad}" stroke="${grad}" stroke-width="${rim.toFixed(1)}" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="#fff" stroke-width="${key.toFixed(1)}" stroke-linejoin="round"/>
    <path d="${d}" fill="${grad}"/>
    ${deco}
  </svg>`;
}
const PINNED_SEED = 1;
function pinnedIcon(idx, gen) {
  const rng = mulberry32(PINNED_SEED * 7919 + idx * 104729);
  return v1_iconSVG(rng, gen);
}
/* their actual gem — hand recreation of the reference mark */
const GEM_ACTUAL = `<svg viewBox="-4 -4 108 108" xmlns="http://www.w3.org/2000/svg">
  <path id="pg" d="M24 22 L74 17 Q83 16.5 87 24 L93 35 Q95.5 41 90 47 L57 86 Q50.5 94 44 87 L10 49 Q4.5 43 7 36 L12 27 Q16 22.5 24 22 Z" fill="url(#g0)" stroke="url(#g0)" stroke-width="11" stroke-linejoin="round"/>
  <path d="M24 22 L74 17 Q83 16.5 87 24 L93 35 Q95.5 41 90 47 L57 86 Q50.5 94 44 87 L10 49 Q4.5 43 7 36 L12 27 Q16 22.5 24 22 Z" fill="none" stroke="#fff" stroke-width="4.5" stroke-linejoin="round"/>
  <path d="M24 22 L74 17 Q83 16.5 87 24 L93 35 Q95.5 41 90 47 L57 86 Q50.5 94 44 87 L10 49 Q4.5 43 7 36 L12 27 Q16 22.5 24 22 Z" fill="url(#g0)"/>
  <path fill="#fff" transform="rotate(-7 39 42)" d="M39 26 L43 37.5 L54 41 L42.5 45 L38.5 58 L35.5 45.5 L25 42.5 L35 38 Z"/>
  <path fill="#fff" transform="rotate(18 57 54)" d="M57 46 L59 51.5 L65 53.5 L59.5 56 L57.5 62 L55 56.5 L49.5 54 L55 52 Z"/>
</svg>`;

/* ---------- build ---------- */
function build(seed) {
  const sheet = document.getElementById("sheet");
  let html = `<svg width="0" height="0" aria-hidden="true"><defs>${GRADS}</defs></svg>`;

  /* keepers */
  html += `<figure class="icon-card icon-card--keep" title="gem — actual mark">${GEM_ACTUAL}<figcaption>★ gem (actual)</figcaption></figure>`;
  html += `<figure class="icon-card icon-card--keep" title="daisy #40 (v1 seed 1)">${pinnedIcon(40, v1_genDaisy)}<figcaption>★ daisy 40</figcaption></figure>`;
  html += `<figure class="icon-card icon-card--keep" title="heart #100 (v1 seed 1)">${pinnedIcon(100, v1_genHeart)}<figcaption>★ heart 100</figcaption></figure>`;
  html += `<figure class="icon-card icon-card--keep" title="flower #138 (v1 seed 1)">${pinnedIcon(138, v1_genFlower)}<figcaption>★ flower 138</figcaption></figure>`;

  /* 100 categories x 2 */
  CATS.forEach(([name, gen], ci) => {
    for (let v = 0; v < 2; v++) {
      const rng = mulberry32(seed * 104729 + ci * 7919 + v * 337 + 17);
      html += `<figure class="icon-card" title="${name} ${v === 0 ? "a" : "b"} (seed ${seed})">
        ${iconFromCat(rng, gen)}
        <figcaption>${name} · ${v === 0 ? "a" : "b"}</figcaption>
      </figure>`;
    }
  });

  sheet.innerHTML = html;
  document.getElementById("count").textContent = `${CATS.length} categories · ${CATS.length * 2} icons + 4 pinned`;
}

const params = new URLSearchParams(location.search);
let seed = parseInt(params.get("seed") || "1", 10);
build(seed);

document.getElementById("regen").addEventListener("click", () => {
  seed++;
  history.replaceState(null, "", `?seed=${seed}`);
  build(seed);
});
