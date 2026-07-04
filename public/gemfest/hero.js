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
lenis.stop(); // no scrolling until the intro hands over
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const ICONS = [
  "/gemfest/SVG/Asset 10.svg", "/gemfest/SVG/Asset 11.svg", "/gemfest/SVG/Asset 12.svg",
  "/gemfest/SVG/Asset 13.svg", "/gemfest/SVG/Asset 14.svg", "/gemfest/SVG/Asset 15.svg",
  "/gemfest/SVG/Asset 17.svg", "/gemfest/SVG/Asset 18.svg", "/gemfest/SVG/Asset 19.svg",
  "/gemfest/SVG/Asset 20.svg",
];

const N_ICONS = 92;
const maskEl = document.getElementById("videoMask");
const preloader = document.getElementById("preloader");
const preLogo = document.getElementById("preloaderLogo");

/* ---------- seeded rng ---------- */
let s = 42;
function rnd() { s = (s * 16807 + 19) % 2147483647; return (s & 0xfffffff) / 0x10000000 % 1; }

/* ---------- mask helpers ---------- */
function setMask(px) {
  maskEl.style.webkitMaskSize = `${px}px`;
  maskEl.style.maskSize = `${px}px`;
}
const baseMask = () => window.innerWidth * 0.72;
const fullMask = () => window.innerWidth * 30;

const MASK_OFF_AT = 0.95;
let maskOff = false;
function setMaskProgress(p) {
  if (p >= MASK_OFF_AT && !maskOff) {
    maskOff = true;
    maskEl.style.webkitMaskImage = "none";
    maskEl.style.maskImage = "none";
  } else if (p < MASK_OFF_AT && maskOff) {
    maskOff = false;
    maskEl.style.webkitMaskImage = "";
    maskEl.style.maskImage = "";
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

const scene = new THREE.Scene();
let W = window.innerWidth, H = window.innerHeight;
const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -3000, 3000);
camera.position.z = 1000;

scene.add(new THREE.AmbientLight(0xffffff, 1.15));
const key = new THREE.DirectionalLight(0xffffff, 1.6);
key.position.set(0.4, 0.7, 1);
scene.add(key);
const rim = new THREE.DirectionalLight(0x66d5ff, 0.5);
rim.position.set(-0.6, -0.3, 0.6);
scene.add(rim);

function sizeRenderer() {
  W = window.innerWidth; H = window.innerHeight;
  renderer.setSize(W, H, false);
  camera.left = -W / 2; camera.right = W / 2;
  camera.top = H / 2; camera.bottom = -H / 2;
  camera.updateProjectionMatrix();
}
sizeRenderer();
window.addEventListener("resize", sizeRenderer);

/* ---------- build extruded prototypes from the SVGs ---------- */
const GRAD_DARK = new THREE.Color("#1E7BF0");
const GRAD_LIGHT = new THREE.Color("#00F0FF");

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
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 2,
        bevelSegments: 2,
        curveSegments: 16,       // 5 flattened beziers into visible chords; geometry is shared by all instances so this is cheap
      });
      const mat = new THREE.MeshLambertMaterial({
        transparent: true,
        vertexColors: !white,
        color: white ? 0xffffff : 0xffffff,
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

function makeInstances(protos) {
  // sizes: 58% small / 36% mid / 6% big
  const sizes = [];
  for (let i = 0; i < N_ICONS; i++) {
    const tier = rnd();
    sizes.push(tier < 0.58 ? 20 + rnd() * 38
             : tier < 0.94 ? 58 + rnd() * 52
             : 118 + rnd() * 50);
  }
  sizes.sort((a, b) => b - a);

  const padX = Math.min(W, H) * 0.10;
  const padY = H * 0.16;                           // generous top/bottom clearance
  const placed = [];

  sizes.forEach((size, i) => {
    const r = size / 2;
    const bx = W / 2 - padX - r, by = H / 2 - padY - r;
    let best = null, bestScore = -Infinity;
    for (let c = 0; c < 80; c++) {
      const px = (rnd() * 2 - 1) * bx;
      const py = (rnd() * 2 - 1) * by;
      // logo exclusion — squashed so icons crowd it above/below
      if ((px / (W * 0.37)) ** 2 + (py / (H * 0.16)) ** 2 < 1) continue;
      let score = Infinity;
      for (const p of placed) {
        score = Math.min(score, Math.hypot(px - p.x, py - p.y) / (r + p.r));
      }
      if (score > bestScore) { bestScore = score; best = { x: px, y: py }; }
    }
    if (!best) best = { x: (rnd() * 2 - 1) * bx, y: by * (rnd() > 0.5 ? 1 : -1) };
    placed.push({ x: best.x, y: best.y, r, size });
  });

  placed.forEach(({ x, y, size }, i) => {
    const proto = protos[i % protos.length];

    const outer = new THREE.Group();               // position / scale / bob
    const inner = proto.group.clone(true);         // tumble rotation
    inner.traverse((o) => { if (o.isMesh) o.material = o.material.clone(); });
    outer.add(inner);
    scene.add(outer);

    const angle = Math.atan2(y, x);                // disperse radially outward

    const mats = [];
    inner.traverse((o) => { if (o.isMesh) mats.push(o.material); });

    const inst = {
      outer, inner, mats,
      baseX: x, baseY: -y,
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
  renderer.render(scene, camera);
});

/* ============================================================
   Timelines
   ============================================================ */
/* intro: gradient logo wipes in, grows to EXACTLY the video-mask
   footprint, then crossfades so it literally becomes the mask —
   only after that do icons pop in and scrolling unlocks */
const intro = gsap.timeline({ paused: true });

intro
  // 1. mask-reveal the gradient logo
  .to(preLogo, { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "power3.inOut" })
  // 2. grow in place to match the video mask size (72vw), and
  //    size the (still hidden) video mask behind it to the same
  .add(() => setMask(baseMask()))
  .to(preLogo, {
    scale: () => baseMask() / preLogo.offsetWidth, // layout width is unscaled
    transformOrigin: "50% 50%",
    duration: 0.9,
    ease: "power2.inOut",
  }, "+=0.2")
  // 3. crossfade: logo -> live video through the identical shape
  .to(preloader, { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" });

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

  instances.forEach((inst) => {
    const total = Math.hypot(W, H) * 0.9;
    const spin = 1 + Math.floor(rnd() * 2);
    // dispersal
    scrub.to(inst.anim, {
      dx: Math.cos(inst.angle) * total,
      dy: -Math.sin(inst.angle) * total,
      s: 1.5 + rnd() * 1.2,
      duration: 0.45,
      ease: "power1.in",
    }, 0);
    // 3d tumble — front-loaded
    scrub.to(inst.anim, {
      rx: (rnd() > 0.5 ? 1 : -1) * spin * Math.PI * 2 * (0.5 + rnd() * 0.5),
      ry: (rnd() > 0.5 ? 1 : -1) * spin * Math.PI * 2 * (0.5 + rnd() * 0.5),
      duration: 0.45,
      ease: "power2.out",
    }, 0);
    // fade late so thickness reads during the tumble
    scrub.to(inst.anim, { op: 0, duration: 0.25, ease: "power1.in" }, 0.2);
  });

  /* central video grows over the mirrors across the whole scroll */
  scrub.to("#stripCenter", {
    scale: 1.45,
    transformOrigin: "50% 50%",
    duration: 1,
    ease: "none",
  }, 0);

  /* hold: slow zoom cue so scrolling stays legible */
  scrub.to("#videoStrip", {
    scale: 1.05,
    transformOrigin: "50% 50%",
    duration: 0.5,
    ease: "none",
  }, 0.5);
}

/* ---------- load everything, then go ---------- */
const loader = new SVGLoader();
const svgReady = Promise.all(ICONS.map((u) => loader.loadAsync(u))).then((all) => {
  const protos = all.map(buildProto);
  makeInstances(protos);
  buildScrub();
  // 4. icons pop in (staggered scale-up) AFTER the logo has become
  //    the mask, then 5. scrolling unlocks
  intro.to(instances.map(i => i.anim), {
    s: 1, duration: 0.9, ease: "back.out(2.2)",
    stagger: { each: 0.015, from: "random" },
  }, ">-0.15");
  intro.add(() => lenis.start());
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
[vMain, vSlave].forEach((v) => {
  v.playbackRate = PLAYBACK_RATE;
  v.addEventListener("loadedmetadata", () => { v.playbackRate = PLAYBACK_RATE; });
});

setInterval(() => {
  if (!vMain.paused && Math.abs(vSlave.currentTime - vMain.currentTime) > 0.08) {
    vSlave.currentTime = vMain.currentTime;
  }
}, 500);
