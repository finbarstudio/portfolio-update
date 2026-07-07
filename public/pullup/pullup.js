/* ============================================================
   GemFest hero — real 3D icon field
   1. preloader: logo mask-reveal in centre
   2. video revealed through logo-shaped mask; icons are real
      extruded 3D objects (Three.js SVGLoader -> ExtrudeGeometry)
      scattered on a Vogel spiral, idle float + tumble
   3. scroll (Lenis): icons tumble + disperse, mask fully clears,
      then full-viewport video holds with a slow zoom cue
   ============================================================ */

import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Lenis smooth scroll ---------- */
const lenis = new Lenis({ lerp: 0.12 });
window.__lenis = lenis;   // nav uses it for smooth scroll
lenis.stop(); // no scrolling until the intro hands over
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const ICONS = [
  "/pullup/SVG/Asset 10.svg", "/pullup/SVG/Asset 11.svg", "/pullup/SVG/Asset 12.svg",
  "/pullup/SVG/Asset 13.svg", "/pullup/SVG/Asset 14.svg", "/pullup/SVG/Asset 15.svg",
  "/pullup/SVG/Asset 17.svg", "/pullup/SVG/Asset 18.svg", "/pullup/SVG/Asset 19.svg",
  "/pullup/SVG/Asset 20.svg", "/pullup/SVG/Asset 24.svg", "/pullup/SVG/Asset 25.svg",
  "/pullup/SVG/Asset 26.svg", "/pullup/SVG/Asset 27.svg", "/pullup/SVG/Asset 28.svg",
  "/pullup/SVG/Asset 29.svg", "/pullup/SVG/Asset 30.svg",
];

const N_ICONS = 92;    // GemFest count
const maskEl = document.getElementById("videoMask");
const preloader = document.getElementById("preloader");
const preLogo = document.getElementById("preloaderLogo");

/* ---------- seeded rng ---------- */
/* time-bucketed seed — re-rolls every 30s, so practically every visitor
   gets their own constellation */
let s = (Math.floor(Date.now() / 30000) % 2147483645) + 1;
function rnd() { s = (s * 16807 + 19) % 2147483647; return (s & 0xfffffff) / 0x10000000 % 1; }

/* ---------- mask helpers ---------- */
const isSmall = () => window.innerWidth <= 760;

/* The logo shape is applied as an SVG clipPath window (geometry) on EVERY
   device — CSS mask-image over live <video> is unreliable across WebKit
   (iPhone AND iPad showed the raw unmasked stack). One code path, all sizes,
   driven by the same setMask(px) so the intro + scrub don't care. */
const LOGO_RATIO = 716 / 1500; // pullup-logo.svg viewBox aspect
const CLIP_URL = "url(#pullupLogoClip)";
/* mask zoom centre as logo fractions (0.5,0.5 = true centre). Nudged to
   the nearest solid-ink point in buildOccupancy so the FULL zoom lands on
   video, not a white gap between letters — imperceptible at rest. */
let maskCX = 0.5, maskCY = 0.5;
let clipWin = null, clipInner = null;
{
  const strip = document.getElementById("videoStrip");
  clipWin = document.createElement("div");
  clipWin.className = "clip-window";
  clipInner = document.createElement("div");
  clipInner.className = "clip-inner";
  clipInner.appendChild(strip);
  clipWin.appendChild(clipInner);
  clipWin.style.clipPath = CLIP_URL;
  clipWin.style.webkitClipPath = CLIP_URL;
  maskEl.appendChild(clipWin);
  // the CSS mask comes off everywhere — the clip window does the shaping
  maskEl.style.webkitMaskImage = "none";
  maskEl.style.maskImage = "none";
}
function setMask(px) {
  if (clipWin) {
    // window = logo-shaped hole of width px; inner counter-offsets so the video
    // stays viewport-fixed while the hole grows (identical to mask-size math)
    const w = px, h = px * LOGO_RATIO;
    const vw = window.innerWidth, vh = window.innerHeight;
    // shift the hole so logo point (maskCX,maskCY) sits at viewport centre;
    // the video counter-offsets so it stays viewport-fixed
    const Dx = (0.5 - maskCX) * w, Dy = (0.5 - maskCY) * h;
    clipWin.style.width = `${w}px`;
    clipWin.style.height = `${h}px`;
    clipWin.style.transform = `translate(calc(-50% + ${Dx.toFixed(1)}px), calc(-50% + ${Dy.toFixed(1)}px))`;
    clipInner.style.width = `${vw}px`;
    clipInner.style.height = `${vh}px`;
    clipInner.style.left = `${(w - vw) / 2 - Dx}px`;
    clipInner.style.top = `${(h - vh) / 2 - Dy}px`;
    return;
  }
  maskEl.style.webkitMaskSize = `${px}px`;
  maskEl.style.maskSize = `${px}px`;
}
const baseMask = () => window.innerWidth * (isSmall() ? 0.5 : 0.62);  // pullup wordmark is taller
const fullMask = () => window.innerWidth * 30;

/* ---------- adaptive strip layout ----------
   Measures the real side gap between the 4/3 strip and the viewport
   every resize. Wide viewports get mirrors + edge blur sized to the
   actual gap (via --sideW); when the strip covers the screen (portrait
   phones/tablets) the mirror layer and blur strips switch off. */
const stickyEl = document.getElementById("heroSticky");
function layoutStrip() {
  const stripW = window.innerHeight * (4 / 3);
  const sideW = (window.innerWidth - stripW) / 2;
  if (sideW < 12) {
    stickyEl.classList.add("no-side");
  } else {
    stickyEl.classList.remove("no-side");
    stickyEl.style.setProperty("--sideW", `${Math.round(sideW)}px`);
  }
}
layoutStrip();

const MASK_OFF_AT = 0.95;
let maskOff = false;
let lastMaskP = 0;
function setMaskProgress(p) {
  lastMaskP = p;
  if (p >= MASK_OFF_AT && !maskOff) {
    maskOff = true;
    if (clipWin) { clipWin.style.webkitClipPath = "none"; clipWin.style.clipPath = "none"; }
    else { maskEl.style.webkitMaskImage = "none"; maskEl.style.maskImage = "none"; }
  } else if (p < MASK_OFF_AT && maskOff) {
    maskOff = false;
    if (clipWin) { clipWin.style.webkitClipPath = CLIP_URL; clipWin.style.clipPath = CLIP_URL; }
    else { maskEl.style.webkitMaskImage = ""; maskEl.style.maskImage = ""; }
  }
  if (!maskOff) {
    const b = baseMask();
    setMask(b + (fullMask() - b) * p);
  }
}
setMask(0);

/* ============================================================
   THREE setup — orthographic, 1 unit = 1 px, origin = centre
   ============================================================ */
const canvas = document.getElementById("gl");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
/* filmic tone mapping lets speculars blow out into a bloom-like glow */
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

const scene = new THREE.Scene();
/* custom "sparkle HDRI": what a Blender artist would build — a mostly
   DARK world with a few tiny, viciously bright emitters. Smooth metal
   reflecting this stays dark until a face's reflection vector sweeps
   across a hotspot, then the whole facet FLASHES. That sweep-flash is
   the twinkle; soft studio environments can never produce it. */
{
  const env = new THREE.Scene();
  // dim shell so unlit angles aren't dead black (keeps forms readable)
  env.add(new THREE.Mesh(
    new THREE.SphereGeometry(60, 16, 12),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.32, 0.35, 0.42), side: THREE.BackSide })
  ));
  // hot emitters: [direction xyz, radius, HDR colour multiplier]
  const spots = [
    [[ 0.5,  0.8,  0.4], 2.4, [70, 70, 70]],   // big key sparkle
    [[-0.7,  0.4,  0.5], 1.1, [55, 55, 55]],
    [[ 0.8, -0.3,  0.6], 0.9, [45, 45, 45]],
    [[-0.4, -0.7,  0.4], 0.6, [40, 40, 40]],
    [[ 0.1,  0.3,  0.9], 1.8, [80, 80, 80]],   // big camera-adjacent glint
    [[-0.9, -0.1,  0.3], 0.7, [20, 45, 55]],   // cyan accent
    [[ 0.6,  0.6, -0.2], 0.8, [60, 8, 40]],    // magenta accent
    [[-0.2,  0.9,  0.3], 0.45, [60, 60, 60]],  // small pin
    [[ 0.9,  0.2,  0.35], 1.4, [50, 50, 50]],
    [[-0.55, -0.35, 0.75], 0.5, [75, 75, 75]], // tiny hot pin
    [[ 0.25, -0.85, 0.45], 1.0, [35, 50, 60]], // cool accent
    [[-0.15, 0.05, 0.98], 0.35, [90, 90, 90]], // pinprick dead ahead
  ];
  for (const [dir, rad, col] of spots) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(rad, 12, 8),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(...col) })
    );
    m.position.set(dir[0], dir[1], dir[2]).normalize().multiplyScalar(40);
    env.add(m);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(env, 0).texture;
  pmrem.dispose();
}
let W = window.innerWidth, H = window.innerHeight;
const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -3000, 3000);
camera.position.z = 1000;

scene.add(new THREE.AmbientLight(0xffffff, 0.45));
const key = new THREE.DirectionalLight(0xffffff, 1.1);
key.position.set(0.4, 0.7, 1);
scene.add(key);
const rim = new THREE.DirectionalLight(0x66d5ff, 0.5);
rim.position.set(-0.6, -0.3, 0.6);
scene.add(rim);

/* scroll sweep light: dark until you scroll, then a bright point
   source flies across the field close to the icons — light direction
   differs per icon, so the glint visibly travels across the
   constellation instead of lighting everything at once */
const sweep = new THREE.PointLight(0xffffff, 0, 0, 2);
sweep.position.set(0, 0, 320);
scene.add(sweep);

/* ---------- ASCII bloom overlay ----------
   The metal reflections' bright BLOOMS are drawn as sparse white ASCII
   sparkles (readback of the flare grid -> a glyph ramp). Char grid + the
   <pre> font metrics are sized here. */
const asciiEl = document.getElementById("ascii");
let A_COLS = 0, A_ROWS = 0;
function sizeAscii() {
  if (!asciiEl) return;
  const CELL = isSmall() ? 6 : 9;
  const FS = CELL / 0.6;
  A_COLS = Math.max(40, Math.round(W / CELL));
  A_ROWS = Math.max(24, Math.round(H / FS));
  asciiEl.style.fontSize = FS.toFixed(2) + "px";
  asciiEl.style.lineHeight = FS.toFixed(2) + "px";
}

function sizeRenderer() {
  W = window.innerWidth; H = window.innerHeight;
  renderer.setSize(W, H, false);
  camera.left = -W / 2; camera.right = W / 2;
  camera.top = H / 2; camera.bottom = -H / 2;
  camera.updateProjectionMatrix();
  sizeAscii();
  if (window.__postReady) sizePost();
}
sizeRenderer();
window.addEventListener("resize", sizeRenderer);

/* ---------- live responsive re-layout ----------
   On resize (debounced): re-fit the strip/mirror/blur composition,
   re-apply the mask at its current progress against the NEW viewport,
   and re-flow the icon constellation proportionally (positions scale
   with the viewport, then re-clamp inside the padded bounds). */
let prevW = W, prevH = H, resizeT;
window.addEventListener("resize", () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    layoutStrip();
    setMaskProgress(lastMaskP);
    const fx = W / prevW, fy = H / prevH;
    if (fx !== 1 || fy !== 1) {
      const padX = Math.min(W, H) * 0.10;
      const padY = H * 0.16;
      for (const inst of instances) {
        const half = inst.size / 2 + 10;
        const bx = Math.max(1, W / 2 - padX - half);
        const by = Math.max(1, H / 2 - padY - half);
        inst.baseX = Math.max(-bx, Math.min(bx, inst.baseX * fx));
        inst.baseY = Math.max(-by, Math.min(by, inst.baseY * fy));
      }
      prevW = W; prevH = H;
    }
  }, 150);
});

/* ---------- build extruded prototypes from the SVGs ---------- */
const GRAD_DARK = new THREE.Color("#C4007A");
const GRAD_LIGHT = new THREE.Color("#FF7ACB");
/* pink wash swept across the WHOLE constellation (screen space):
   injected into every icon material's shader, keyed on world position,
   so one continuous gradient flows over the entire field while still
   wrapping each icon's 3d surface (sides shade under the lights) */
const PINK_DARK = new THREE.Color("#FF3DAE");
const PINK_LIGHT = new THREE.Color("#FF9AD8");
const washViewport = { value: new THREE.Vector2(window.innerWidth, window.innerHeight) };
window.addEventListener("resize", () => washViewport.value.set(window.innerWidth, window.innerHeight));

function pinkWash(mat) {
  mat.customProgramCacheKey = () => "pinkwash"; // share one compiled program
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uPinkA = { value: PINK_DARK };
    sh.uniforms.uPinkB = { value: PINK_LIGHT };
    sh.uniforms.uVp = washViewport;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWashPos;")
      .replace("#include <fog_vertex>", "#include <fog_vertex>\nvWashPos = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWashPos;\nuniform vec3 uPinkA;\nuniform vec3 uPinkB;\nuniform vec2 uVp;")
      .replace("#include <color_fragment>", `#include <color_fragment>
{
  // primary axis: 0 top-left -> 1 bottom-right
  float tWash = clamp((vWashPos.x / uVp.x - vWashPos.y / uVp.y) + 0.5, 0.0, 1.0);
  // secondary axis (the other diagonal) for the variation pass
  float tCross = clamp((vWashPos.x / uVp.x + vWashPos.y / uVp.y) + 0.5, 0.0, 1.0);
  // smooth low-frequency "random" field (~600px blobs) for organic edges
  float vari = sin(vWashPos.x * 0.009 + 1.7) * sin(vWashPos.y * 0.011 + 0.4);

  // magenta in BOTH far corners (bottom-right AND top-left), blue
  // between: 4 alternating sections. The noise wobbles the borders.
  float kWash = smoothstep(0.72, 0.95, tWash) + (1.0 - smoothstep(0.05, 0.28, tWash));
  kWash = clamp(kWash + vari * 0.14, 0.0, 1.0);

  vec3 washCol = mix(uPinkA, uPinkB, tWash);
  // full replacement in the corners — partial mixes with the blue base
  // were muddying the magenta into purple
  diffuseColor.rgb = mix(diffuseColor.rgb, washCol, smoothstep(0.0, 0.6, kWash));

  // variation overlay: linear sweep along the cross diagonal + the
  // noise field, gently lifting/dropping each section's brightness
  diffuseColor.rgb *= 1.0 + (tCross - 0.5) * 0.10 + vari * 0.07;

  // retro print finish: fragment grain dither + colour posterisation
  float gGrain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  diffuseColor.rgb += (gGrain - 0.5) * 0.09;
  diffuseColor.rgb = floor(diffuseColor.rgb * 14.0 + 0.5) / 14.0;
}`);
  };
}

function isWhiteFill(fill) {
  if (!fill) return false;
  const f = fill.toLowerCase().replace(/\s/g, "");
  return f === "#fff" || f === "#ffffff" || f === "white" || f === "rgb(255,255,255)";
}

function buildProto(svgData) {
  const group = new THREE.Group();
  const box = new THREE.Box3();

  svgData.paths.forEach((path) => {
    const fill = path.userData.style.fill;
    if (fill === "none") return;
    const white = isWhiteFill(fill);
    const shapes = SVGLoader.createShapes(path);
    shapes.forEach((shape) => {
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: white ? 34 : 32,        // slab thickness in svg units
        bevelEnabled: false,
        curveSegments: 16,       // 5 flattened beziers into visible chords; geometry is shared by all instances so this is cheap
      });
      const mat = new THREE.MeshStandardMaterial({
        transparent: true,
        vertexColors: !white,
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.5,
        envMapIntensity: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      if (white) mesh.position.z = 1.5;  // knockouts sit proud, avoid z-fight
      group.add(mesh);
    });
  });

  /* centre + gradient vertex colours across the whole icon */
  box.setFromObject(group);
  const c = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const norm = Math.max(size.x, size.y);

  group.children.forEach((mesh) => {
    mesh.geometry.translate(-c.x, -c.y, -size.z / 2);
    if (mesh.material.vertexColors) {
      const pos = mesh.geometry.attributes.position;
      const colors = new Float32Array(pos.count * 3);
      const tmp = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        // svg y grows downward: low y = top of icon = light cyan
        const t = THREE.MathUtils.clamp((pos.getY(i) + size.y / 2) / size.y, 0, 1);
        tmp.copy(GRAD_DARK).lerp(GRAD_LIGHT, t);
        colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
      }
      mesh.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }
  });

  group.scale.y = -1; // svg y-down -> three y-up
  return { group, norm };
}

/* ---------- size-aware placement ----------
   Sizes assigned first (few big), placed biggest-first via
   best-candidate sampling maximising the NORMALISED gap
   (distance / combined radii): big icons claim breathing room,
   small ones nestle close together and fill leftover pockets.  */
const instances = [];
const allMats = [];

/* ---------- logo distance field for placement ----------
   Rasterise the clip path (Path2D, synchronous + reliable), then compute a
   distance-to-ink field. Each icon's placement requires clearance >= its
   own radius, so BIG icons are pushed clear of the letters while SMALL
   icons may hug right up to the strokes — the small ones trace the wordmark
   and give the void its fidelity, the big ones stay in the outer field. */
const OCC_W = 560;
const OCC_H = Math.max(2, Math.round(OCC_W * LOGO_RATIO));
/* isolation frame: a simplified filled ARCH that follows the wordmark
   outline (from pullup-isolate.svg). Cleaner than fighting the thin
   blackletter strokes — icons are excluded from this solid band. */
const ISOLATE_D = "M0,174.56v415.46c46.25-25.43,93.57-48.08,141.73-67.95v53.72c304.41-167.35,673.27-167.35,977.67,0v-90.14c82.37,27,162.83,61.79,240.3,104.37V174.56C936.35-58.19,423.35-58.19,0,174.56Z";
const ISO_VB_W = 1359.7, ISO_VB_H = 590.02;
let distField = null;   // Float32, grid cells to nearest inked pixel
function buildOccupancy() {
  if (typeof Path2D === "undefined") return;

  /* zoom-centre target — searched on the WORDMARK LETTERS (the video
     mask), NOT the arch: the full zoom must land on inked letter (video),
     not a gap. Find the solid-letter cell nearest centre whose window is
     all ink so the tiny full-zoom patch stays on the letter. */
  const wmD = document.querySelector("#pullupLogoClip path")?.getAttribute("d");
  if (wmD) {
    const woc = document.createElement("canvas");
    woc.width = OCC_W; woc.height = OCC_H;
    const wc = woc.getContext("2d");
    wc.setTransform(OCC_W, 0, 0, OCC_H, 0, 0);   // wordmark is normalised 0..1
    wc.fillStyle = "#fff";
    wc.fill(new Path2D(wmD));
    const wa = wc.getImageData(0, 0, OCC_W, OCC_H).data;
    const wm = new Uint8Array(OCC_W * OCC_H);
    for (let i = 0; i < wm.length; i++) wm[i] = wa[i * 4 + 3] > 30 ? 1 : 0;
    const cx = OCC_W / 2, cy = OCC_H / 2, WX = 9, WY = 5; let bestD = Infinity;
    for (let y = WY; y < OCC_H - WY; y++) for (let x = WX; x < OCC_W - WX; x++) {
      if (!wm[y * OCC_W + x]) continue;
      let solid = true;
      for (let dy = -WY; dy <= WY && solid; dy++) for (let dx = -WX; dx <= WX && solid; dx++)
        if (!wm[(y + dy) * OCC_W + (x + dx)]) solid = false;
      if (!solid) continue;
      const dd = (x - cx) ** 2 + (y - cy) ** 2;
      if (dd < bestD) { bestD = dd; maskCX = x / OCC_W; maskCY = y / OCC_H; }
    }
  }

  const oc = document.createElement("canvas");
  oc.width = OCC_W; oc.height = OCC_H;
  const octx = oc.getContext("2d");
  // placement dialled in via place.html (normalised to the wordmark box)
  const ISO_BOX = { x: 0.0774, y: 0.2235, w: 0.8633, h: 0.6906, flip: false };
  const sx = (ISO_BOX.w * OCC_W) / ISO_VB_W, sy = (ISO_BOX.h * OCC_H) / ISO_VB_H;
  if (ISO_BOX.flip) octx.setTransform(sx, 0, 0, -sy, ISO_BOX.x * OCC_W, (ISO_BOX.y + ISO_BOX.h) * OCC_H);
  else octx.setTransform(sx, 0, 0, sy, ISO_BOX.x * OCC_W, ISO_BOX.y * OCC_H);
  octx.fillStyle = "#fff";
  octx.fill(new Path2D(ISOLATE_D));
  const a = octx.getImageData(0, 0, OCC_W, OCC_H).data;
  const N = OCC_W * OCC_H;
  const raw = new Uint8Array(N);
  for (let i = 0; i < N; i++) raw[i] = a[i * 4 + 3] > 30 ? 1 : 0;

  /* chamfer distance transform: dist[cell] = cells to nearest ink */
  const INF = 1e9, dist = new Float32Array(N);
  for (let i = 0; i < N; i++) dist[i] = raw[i] ? 0 : INF;
  const D1 = 1, D2 = 1.41421356;
  for (let y = 0; y < OCC_H; y++) for (let x = 0; x < OCC_W; x++) {
    const i = y * OCC_W + x; let v = dist[i];
    if (x > 0) v = Math.min(v, dist[i - 1] + D1);
    if (y > 0) v = Math.min(v, dist[i - OCC_W] + D1);
    if (x > 0 && y > 0) v = Math.min(v, dist[i - OCC_W - 1] + D2);
    if (x < OCC_W - 1 && y > 0) v = Math.min(v, dist[i - OCC_W + 1] + D2);
    dist[i] = v;
  }
  for (let y = OCC_H - 1; y >= 0; y--) for (let x = OCC_W - 1; x >= 0; x--) {
    const i = y * OCC_W + x; let v = dist[i];
    if (x < OCC_W - 1) v = Math.min(v, dist[i + 1] + D1);
    if (y < OCC_H - 1) v = Math.min(v, dist[i + OCC_W] + D1);
    if (x < OCC_W - 1 && y < OCC_H - 1) v = Math.min(v, dist[i + OCC_W + 1] + D2);
    if (x > 0 && y < OCC_H - 1) v = Math.min(v, dist[i + OCC_W - 1] + D2);
    dist[i] = v;
  }
  distField = dist;
}

const CLEAR_PAD = 3;   // extra grid-cell gap so icons never touch a stroke
/* returns true if an icon of world-radius r would overlap (get too near)
   the wordmark ink at world position (px, py) */
function insideLogo(px, py, r) {
  if (!distField) return (px / (W * 0.37)) ** 2 + (py / (H * 0.16)) ** 2 < 1;
  const bm = baseMask();
  const gpw = OCC_W / bm;                       // grid cells per world px
  // logo point under (px,py), accounting for the zoom-centre shift
  const u = maskCX + px / bm;
  const v = maskCY - py / (bm * LOGO_RATIO);
  if (u < 0 || u > 1 || v < 0 || v > 1) return false;   // outside the wordmark box
  const gx = Math.min(OCC_W - 1, Math.max(0, Math.floor(u * OCC_W)));
  const gy = Math.min(OCC_H - 1, Math.max(0, Math.floor(v * OCC_H)));
  return distField[gy * OCC_W + gx] < r * gpw + CLEAR_PAD;
}

/* world-px distance from (px,py) to the nearest wordmark ink.
   NOTE the +py: icons render at baseY = -y (vertical flip, for the
   dispersal), so the exclusion must be sampled in that same flipped
   space or the arch comes out upside-down vs the video wordmark. */
function distInkWorld(px, py) {
  if (!distField) return 1e9;
  const bm = baseMask();
  const u = maskCX + px / bm, v = maskCY + py / (bm * LOGO_RATIO);
  if (u < 0 || u > 1 || v < 0 || v > 1) return 1e9;
  const gx = Math.min(OCC_W - 1, Math.max(0, Math.floor(u * OCC_W)));
  const gy = Math.min(OCC_H - 1, Math.max(0, Math.floor(v * OCC_H)));
  return distField[gy * OCC_W + gx] * (bm / OCC_W);
}

function makeInstances(protos) {
  /* GemFest distribution: size tiers (58% small / 36% mid / 6% big),
     placed biggest-first by best-candidate (maximising the normalised
     gap) for even spacing. Clearance off the arch scales with icon
     size, so small icons hug the wordmark and big ones stay clear. */
  const SIZE_SCALE = isSmall() ? 0.5 : 1;
  const sizes = [];
  for (let i = 0; i < N_ICONS; i++) {
    const tier = rnd();
    sizes.push(SIZE_SCALE * (tier < 0.58 ? 20 + rnd() * 38
             : tier < 0.94 ? 58 + rnd() * 52
             : 118 + rnd() * 50));
  }
  sizes.sort((a, b) => b - a);

  const padX = Math.min(W, H) * 0.10, padY = H * 0.16;
  const GAP = 6;
  const placed = [];

  sizes.forEach((size) => {
    const r = size / 2;
    const bx = W / 2 - padX - r, by = H / 2 - padY - r;
    let best = null, bestScore = -Infinity;
    for (let c = 0; c < 80; c++) {
      const px = (rnd() * 2 - 1) * bx, py = (rnd() * 2 - 1) * by;
      if (distInkWorld(px, py) < r + GAP) continue;   // arch exclusion (size-scaled)
      let score = Infinity;
      for (const p of placed) score = Math.min(score, Math.hypot(px - p.x, py - p.y) / (r + p.r));
      if (score > bestScore) { bestScore = score; best = { x: px, y: py }; }
    }
    if (!best) return;   // skip rather than dump into a corner
    placed.push({ x: best.x, y: best.y, r, size });
  });

  placed.forEach(({ x, y, size }, i) => {
    const proto = protos[i % protos.length];

    const outer = new THREE.Group();               // position / scale / bob
    const inner = proto.group.clone(true);         // tumble rotation
    inner.traverse((o) => {
      if (o.isMesh) {
        o.material = o.material.clone();
        pinkWash(o.material); // constellation-wide gradient overlay
        allMats.push(o.material);
      }
    });

    /* gradient map across the FIELD: instances in the last 10% of the
       top-left -> bottom-right diagonal pick up a touch of brand pink */
    const diag = Math.min(1, Math.max(0, ((x + W / 2) / W + (H / 2 - y) / H) / 2));
    const pinkK = Math.max(0, (diag - 0.9) / 0.1);
    if (pinkK > 0) {
      const PINK = new THREE.Color("#FF0099");
      const tint = new THREE.Color();
      inner.traverse((o) => {
        if (o.isMesh && o.material.vertexColors && o.geometry.attributes.color) {
          o.geometry = o.geometry.clone();       // shared proto geometry stays blue
          const col = o.geometry.attributes.color;
          for (let vi = 0; vi < col.count; vi++) {
            tint.setRGB(col.getX(vi), col.getY(vi), col.getZ(vi));
            tint.lerp(PINK, pinkK * 0.75);
            col.setXYZ(vi, tint.r, tint.g, tint.b);
          }
          col.needsUpdate = true;
        }
      });
    }
    outer.add(inner);
    scene.add(outer);

    const angle = Math.atan2(y, x);                // disperse radially outward

    const mats = [];
    inner.traverse((o) => { if (o.isMesh) mats.push(o.material); });

    const inst = {
      outer, inner, mats,
      baseX: x, baseY: -y,
      size,
      pxScale: size / proto.norm,
      anim: { dx: 0, dy: 0, s: 0, rx: 0, ry: 0, rz: (rnd() * 50 - 25) * Math.PI / 180, op: 1 },
      bobAmp: 4 + rnd() * 9,
      bobSpeed: 0.5 + rnd() * 0.7,
      phase: rnd() * Math.PI * 2,
      wobble: 0.06 + rnd() * 0.08,
      angle,
      hoverRX: 0, hoverRY: 0,
      hoverStrength: 0.75 + rnd() * 0.6,  // per-icon rotation appetite
    };
    instances.push(inst);
  });
}

/* ---------- mouse repel ---------- */
const mouse = { x: 1e9, y: 1e9 };
window.addEventListener("pointermove", (e) => {
  mouse.x = e.clientX - W / 2;
  mouse.y = -(e.clientY - H / 2);
});
window.addEventListener("pointerleave", () => { mouse.x = 1e9; mouse.y = 1e9; });
const HOVER_R = 150;        // influence radius (px)
const HOVER_TILT = 0.9;     // max extra rotation (rad) at cursor centre

/* ---------- glare post pipeline ----------
   The Blender-glare approach: render the scene to a target, extract
   pixels above a luminance threshold (the metal flashes), smear them
   into long horizontal + vertical streaks, then composite the cross
   flare back over the canvas. The flare draws OUTSIDE the icon
   bounds — real light bleed, alpha handled manually so it stays
   correct over the white page. */
const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const quadScene = new THREE.Scene();
const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
quadScene.add(quad);

const rtScene = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: 4 });
const rtBright = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType });
const rtS1 = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType });
const rtS2 = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType });
const rtS3 = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType });

const QUAD_VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const threshMat = new THREE.ShaderMaterial({
  uniforms: { tDiffuse: { value: null }, uThresh: { value: 2.0 } },
  vertexShader: QUAD_VERT,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uThresh; varying vec2 vUv;
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      float l = max(max(c.r, c.g), c.b) * c.a;
      float k = smoothstep(uThresh, uThresh * 2.5, l);
      gl_FragColor = vec4(c.rgb * k, k);
    }`,
});

const streakMat = new THREE.ShaderMaterial({
  uniforms: { tDiffuse: { value: null }, uDir: { value: new THREE.Vector2() } },
  vertexShader: QUAD_VERT,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform vec2 uDir; varying vec2 vUv;
    void main(){
      vec3 acc = vec3(0.0); float wsum = 0.0;
      for (int i = -14; i <= 14; i++) {
        float w = pow(0.80, abs(float(i)));
        acc += texture2D(tDiffuse, vUv + uDir * float(i)).rgb * w;
        wsum += w;
      }
      gl_FragColor = vec4(acc / wsum, 1.0);
    }`,
});

const copyMat = new THREE.ShaderMaterial({
  uniforms: { tDiffuse: { value: null }, uExposure: { value: 1.25 } },
  vertexShader: QUAD_VERT,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uExposure; varying vec2 vUv;
    vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      c.rgb = pow(aces(c.rgb * uExposure), vec3(1.0/2.2));
      gl_FragColor = c;
    }`,
  blending: THREE.NoBlending,
});

const compMat = new THREE.ShaderMaterial({
  uniforms: { t1: { value: null }, t2: { value: null }, t3: { value: null }, uStrength: { value: 0.3 } },
  vertexShader: QUAD_VERT,
  fragmentShader: `
    uniform sampler2D t1; uniform sampler2D t2; uniform sampler2D t3; uniform float uStrength; varying vec2 vUv;
    void main(){
      vec3 s = texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb + texture2D(t3, vUv).rgb;
      float l = clamp(max(max(s.r, s.g), s.b) * uStrength, 0.0, 1.0);
      // brand-tinted flare (pure white would vanish on the white page)
      vec3 tint = mix(vec3(1.0, 0.35, 0.75), vec3(1.0, 0.85, 0.95), clamp(vUv.x - vUv.y + 0.5, 0.0, 1.0));
      gl_FragColor = vec4(mix(tint, vec3(1.0), 0.3), l);
    }`,
  transparent: true,
  depthTest: false,
  depthWrite: false,
});

/* flare -> intensity rendered straight into the CHAR GRID, read back and
   mapped to ASCII sparkles */
const flareMat = new THREE.ShaderMaterial({
  uniforms: { t1: { value: null }, t2: { value: null }, t3: { value: null }, uStrength: { value: 0.55 } },
  vertexShader: QUAD_VERT,
  fragmentShader: `
    uniform sampler2D t1; uniform sampler2D t2; uniform sampler2D t3; uniform float uStrength; varying vec2 vUv;
    void main(){
      vec3 s = texture2D(t1, vUv).rgb + texture2D(t2, vUv).rgb + texture2D(t3, vUv).rgb;
      float l = clamp(max(max(s.r, s.g), s.b) * uStrength, 0.0, 1.0);
      gl_FragColor = vec4(vec3(l), 1.0);
    }`,
  blending: THREE.NoBlending,
});
const rtFlare = new THREE.WebGLRenderTarget(2, 2, { type: THREE.UnsignedByteType });
const BLOOM_RAMP = " .·+*xX#";
let flareBuf = new Uint8Array(4);
function sampleBloomAscii() {
  if (!asciiEl || A_COLS < 2) return;
  const need = A_COLS * A_ROWS * 4;
  if (flareBuf.length !== need) flareBuf = new Uint8Array(need);
  renderer.readRenderTargetPixels(rtFlare, 0, 0, A_COLS, A_ROWS, flareBuf);
  const last = BLOOM_RAMP.length - 1;
  let out = "";
  for (let y = 0; y < A_ROWS; y++) {
    const sy = A_ROWS - 1 - y;              // RT origin is bottom-left
    let line = "";
    for (let x = 0; x < A_COLS; x++) {
      const v = flareBuf[(sy * A_COLS + x) * 4] / 255;
      line += v <= 0.06 ? " " : BLOOM_RAMP[Math.min(last, Math.floor(v * last) + 1)];
    }
    out += line + "\n";
  }
  asciiEl.textContent = out;
}

function sizePost() {
  const pr = renderer.getPixelRatio();
  rtScene.setSize(Math.round(W * pr), Math.round(H * pr));
  const qw = Math.max(2, Math.round(W * pr / 3)), qh = Math.max(2, Math.round(H * pr / 3));
  rtBright.setSize(qw, qh); rtS1.setSize(qw, qh); rtS2.setSize(qw, qh); rtS3.setSize(qw, qh);
  rtFlare.setSize(Math.max(2, A_COLS), Math.max(2, A_ROWS));
}

window.__postReady = true;
sizePost();

function renderPost() {
  // 1. scene -> target
  renderer.setRenderTarget(rtScene);
  renderer.clear();
  renderer.render(scene, camera);
  // 2. bright extract (third res)
  quad.material = threshMat;
  threshMat.uniforms.tDiffuse.value = rtScene.texture;
  renderer.setRenderTarget(rtBright);
  renderer.render(quadScene, quadCam);
  // 3. six-point star: three streak directions, 60 degrees apart
  quad.material = streakMat;
  streakMat.uniforms.tDiffuse.value = rtBright.texture;
  const STEP = 2.9;
  const dirs = [[1, 0], [0.5, 0.8660254], [-0.5, 0.8660254]];
  const rts = [rtS1, rtS2, rtS3];
  for (let i = 0; i < 3; i++) {
    streakMat.uniforms.uDir.value.set(
      (dirs[i][0] * STEP) / rtBright.width,
      (dirs[i][1] * STEP) / rtBright.height
    );
    renderer.setRenderTarget(rts[i]);
    renderer.render(quadScene, quadCam);
  }
  // 4. clean constellation to screen (the blooms become ASCII, not a
  //    smooth flare)
  renderer.setRenderTarget(null);
  quad.material = copyMat;
  copyMat.uniforms.tDiffuse.value = rtScene.texture;
  renderer.render(quadScene, quadCam);
  // 5. flare -> char grid -> readback -> ASCII sparkle blooms
  quad.material = flareMat;
  flareMat.uniforms.t1.value = rtS1.texture;
  flareMat.uniforms.t2.value = rtS2.texture;
  flareMat.uniforms.t3.value = rtS3.texture;
  renderer.setRenderTarget(rtFlare);
  renderer.render(quadScene, quadCam);
  renderer.setRenderTarget(null);
  sampleBloomAscii();
}

/* ---------- render loop ---------- */
const clock = new THREE.Clock();
gsap.ticker.add(() => {
  const t = clock.getElapsedTime();
  for (const inst of instances) {
    const { outer, inner, anim } = inst;
    const bob = Math.sin(t * inst.bobSpeed + inst.phase);

    const restX = inst.baseX + anim.dx + Math.cos(inst.phase) * bob * inst.bobAmp * 0.4;
    const restY = inst.baseY + anim.dy + bob * inst.bobAmp;

    // spring-eased 3d tilt toward the cursor: icons roll over in
    // place as the pointer approaches, settle back as it leaves
    let trx = 0, try_ = 0;
    const mdx = mouse.x - restX, mdy = mouse.y - restY;
    const md = Math.hypot(mdx, mdy);
    if (md < HOVER_R && md > 0.001) {
      // smoothstep falloff: zero slope at both ends, so entering and
      // leaving the radius has no perceptible onset edge
      const n = 1 - md / HOVER_R;
      const f = n * n * (3 - 2 * n) * HOVER_TILT * inst.hoverStrength * anim.op;
      trx = (mdy / md) * f;   // cursor above -> pitch back
      try_ = (mdx / md) * f;  // cursor right -> yaw right
    }
    // critically-damped spring: glassy ease-in AND ease-out, no snap
    const stiff = 0.0016, damp = 0.82;
    inst.hoverVX = (inst.hoverVX || 0) * damp + (trx - inst.hoverRX) * stiff * 16.7;
    inst.hoverVY = (inst.hoverVY || 0) * damp + (try_ - inst.hoverRY) * stiff * 16.7;
    inst.hoverRX += inst.hoverVX;
    inst.hoverRY += inst.hoverVY;

    outer.position.set(restX, restY, 0);
    const sc = anim.s * inst.pxScale;
    outer.scale.setScalar(Math.max(sc, 0.0001));
    inner.rotation.set(
      anim.rx + inst.hoverRX + Math.sin(t * inst.bobSpeed * 0.8 + inst.phase) * inst.wobble,
      anim.ry + inst.hoverRY + Math.cos(t * inst.bobSpeed * 0.6 + inst.phase) * inst.wobble,
      anim.rz
    );
    for (const m of inst.mats) m.opacity = anim.op;
  }
  renderPost();
});

/* ============================================================
   Timelines
   ============================================================ */
/* intro: gradient logo wipes in, grows to EXACTLY the video-mask
   footprint, then crossfades so it literally becomes the mask —
   only after that do icons pop in and scrolling unlocks */
const intro = gsap.timeline({ paused: true });

intro
  // 1. mask-reveal the gradient logo (tightened timings — control is
  //    handed back as early as possible)
  .to(preLogo, { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "power3.inOut" })
  // 2. grow in place to match the video mask size (72vw), and
  //    size the (still hidden) video mask behind it to the same
  .add(() => setMask(baseMask()))
  .to(preLogo, {
    /* match the CLIP WINDOW's real on-screen rect, not just its width:
       the preloader centres in the viewport (fixed, full width) but the
       clip window centres in the hero container (can differ by the
       scrollbar width / layout offsets) — measure and correct both
       position and scale so the handoff is pixel-aligned */
    scale: () => baseMask() / preLogo.offsetWidth, // layout width is unscaled
    x: () => {
      const c = clipWin.getBoundingClientRect();
      const l = preLogo.getBoundingClientRect();
      return (c.left + c.width / 2) - (l.left + l.width / 2);
    },
    y: () => {
      const c = clipWin.getBoundingClientRect();
      const l = preLogo.getBoundingClientRect();
      return (c.top + c.height / 2) - (l.top + l.height / 2);
    },
    transformOrigin: "50% 50%",
    duration: 0.7,
    ease: "power2.inOut",
  }, "+=0.1")
  // 3. crossfade: logo -> live video through the identical shape
  .to(preloader, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" })
  // unlock scroll the moment the crossfade starts landing — icons can
  // pop in while the user is already moving
  .add(() => lenis.start(), "-=0.3");

function buildScrub() {
  const scrub = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
    },
  });

  const scrollMask = { p: 0 };
  scrub.to(scrollMask, {
    p: 1, duration: 0.5, ease: "power3.out",
    onUpdate: () => setMaskProgress(scrollMask.p),
  }, 0);

  /* shininess: matte at rest, ramps up FAST with the first bit of
     scroll (fully shiny by ~14% of the runway), reverses on the way
     back up */
  const shiny = { k: 0 };
  scrub.fromTo(shiny, { k: 0 }, {
    k: 1, duration: 0.14, ease: "power2.out", immediateRender: false,
    onUpdate: () => {
      for (const m of allMats) {
        m.metalness = 0.1 + shiny.k * 0.8;
        m.roughness = 0.5 - shiny.k * 0.42;
        m.envMapIntensity = 0.15 + shiny.k * 1.45;
      }
    },
  }, 0);

  /* sweep light: rises fast, arcs across the scene left->right as the
     icons tumble, dies away as they fade — every surface catches a
     moving twinkle mid-dispersal */
  scrub.fromTo(sweep.position, { x: -W * 0.7, y: H * 0.35 }, {
    x: W * 0.7, y: -H * 0.35, duration: 0.5, ease: "none", immediateRender: false,
  }, 0);
  scrub.fromTo(sweep, { intensity: 0 }, {
    intensity: 200000, duration: 0.18, ease: "power2.in", immediateRender: false,
  }, 0);
  scrub.to(sweep, { intensity: 0, duration: 0.32, ease: "power2.out" }, 0.18);

  /* explicit from-values: this timeline is created BEFORE the intro
     plays, so plain .to() captures the pre-intro state (s: 0) as the
     top-of-page value and reverse scrolling collapses the icons */
  instances.forEach((inst) => {
    const total = Math.hypot(W, H) * 0.9;
    const spin = 1 + Math.floor(rnd() * 2);
    // dispersal
    scrub.fromTo(inst.anim, { dx: 0, dy: 0, s: 1 }, {
      dx: Math.cos(inst.angle) * total,
      dy: -Math.sin(inst.angle) * total,
      s: 1.5 + rnd() * 1.2,
      duration: 0.45,
      ease: "power1.in",
      immediateRender: false,
    }, 0);
    // 3d tumble — front-loaded
    scrub.fromTo(inst.anim, { rx: 0, ry: 0 }, {
      rx: (rnd() > 0.5 ? 1 : -1) * spin * Math.PI * 2 * (0.5 + rnd() * 0.5),
      ry: (rnd() > 0.5 ? 1 : -1) * spin * Math.PI * 2 * (0.5 + rnd() * 0.5),
      duration: 0.45,
      ease: "power2.out",
      immediateRender: false,
    }, 0);
    // fade late so thickness reads during the tumble
    scrub.fromTo(inst.anim, { op: 1 }, {
      op: 0, duration: 0.25, ease: "power1.in", immediateRender: false,
    }, 0.2);
  });

  /* central video grows over the mirrors across the whole scroll —
     much harder zoom on mobile (portrait viewport needs the 4:3
     strip blown up to feel full-bleed) */
  scrub.to("#stripCenter", {
    scale: isSmall() ? 2.6 : 1.45,
    transformOrigin: "50% 50%",
    duration: 1,
    ease: "none",
  }, 0);

  /* hold: slow zoom cue so scrolling stays legible */
  scrub.to("#videoStrip", {
    scale: isSmall() ? 1.1 : 1.05,
    transformOrigin: "50% 50%",
    duration: 0.5,
    ease: "none",
  }, 0.5);
}

/* ---------- load everything, then go ---------- */
const loader = new SVGLoader();
const svgReady = Promise.all(ICONS.map((u) => loader.loadAsync(u))).then((all) => {
  const protos = all.map(buildProto);
  buildOccupancy();        // sync: build the logo distance field first
  makeInstances(protos);   // placement now respects it (clearance by icon size)
  buildScrub();
  // 4. icons pop in (staggered scale-up) overlapping the crossfade —
  //    scroll is already unlocked by this point
  intro.to(instances.map(i => i.anim), {
    s: 1, duration: 0.9, ease: "power4.out",
    stagger: { each: 0.012, from: "random" },
  }, ">-0.35");
});

const pageReady = document.readyState === "complete"
  ? Promise.resolve()
  : new Promise((res) => window.addEventListener("load", res));

Promise.all([svgReady, pageReady]).then(() => intro.play());

/* ---------- video pacing + mirror sync ---------- */
const vMain = document.getElementById("vMain");
const vSlave = document.getElementById("vSlave");

/* significantly slowed — footage is fast/strobing at native speed */
const PLAYBACK_RATE = 0.65;

/* resting frame: the raw first frame is too light to contrast the logo
   mask, so seek to the dark blue night-stage shot (~28s). If autoplay is
   deferred/blocked (mobile until first interaction, iOS low-power), THIS
   is the frame sitting behind the logo; if playing, it just continues
   from here — the loop makes the entry point irrelevant. */
const REST_FRAME_T = 28;
[vMain, vSlave].forEach((v) => {
  v.playbackRate = PLAYBACK_RATE;
  const prime = () => {
    v.playbackRate = PLAYBACK_RATE;
    if (v.currentTime < REST_FRAME_T) v.currentTime = REST_FRAME_T;
  };
  if (v.readyState >= 1) prime();
  v.addEventListener("loadedmetadata", prime);
});

/* iOS: autoplay can be blocked (Low Power Mode / data saver) — retry on the
   first touch so the logo window never sits white */
const kickPlay = () => { [vMain, vSlave].forEach((v) => { if (v.paused) v.play().catch(() => {}); }); };
["touchstart", "click"].forEach((t) => window.addEventListener(t, kickPlay, { once: true, passive: true }));

setInterval(() => {
  if (!vMain.paused && Math.abs(vSlave.currentTime - vMain.currentTime) > 0.08) {
    vSlave.currentTime = vMain.currentTime;
  }
}, 500);
