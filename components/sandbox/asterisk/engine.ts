/**
 * Asterisk Studio — core renderer (framework-agnostic).
 *
 * Ported from the standalone reference (CLAUDE/3dsandbox/index.html): extrudes an
 * SVG into 3D, lights it, runs a stackable post-process FX shader, supports a
 * keyframe timeline, and exports video / PNG / embed HTML. No GUI here — the
 * sandbox studio shell (AsteriskStudio.tsx) builds native controls and drives
 * this via `config` + the returned methods. `onSync` fires whenever the engine
 * mutates config itself (timeline playback, orbit-dolly → zoom) so the UI can
 * refresh its inputs; `onStatus` surfaces the status line.
 */

import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const ASTERISK_POINTS: [number, number][] = [
  [42, 2], [58, 2], [54.97, 37.99], [78.28, 10.4], [89.6, 21.72], [62.01, 45.03],
  [98, 42], [98, 58], [62.01, 54.97], [89.6, 78.28], [78.28, 89.6], [54.97, 62.01],
  [58, 98], [42, 98], [45.03, 62.01], [21.72, 89.6], [10.4, 78.28], [37.99, 54.97],
  [2, 58], [2, 42], [37.99, 45.03], [10.4, 21.72], [21.72, 10.4], [45.03, 37.99],
];

export const PRESETS: Record<string, [number, number]> = {
  "1:1 Square (1080)": [1080, 1080],
  "16:9 Landscape (1920)": [1920, 1080],
  "9:16 Vertical (1080)": [1080, 1920],
  "LinkedIn (1200x627)": [1200, 627],
  "Instagram Portrait (1080x1350)": [1080, 1350],
};

export type Config = {
  preset: string;
  bg: string;
  shapeColor: string;
  metalness: number; roughness: number;
  depth: number; bevelAmount: number;
  autoRotate: boolean;
  rotSpeedX: number; rotSpeedY: number; rotSpeedZ: number; wobble: number;
  rotX: number; rotY: number; rotZ: number;
  posX: number; posY: number; zoom: number;
  bloom: number; glass: number; ripple: number; rippleSpeed: number;
  pixelate: number; chroma: number; scanlines: number; vignette: number;
  grain: number; hueShift: number; twist: number; kaleidoscope: number; halftone: number;
  wireframe: boolean; iridescent: number;
  duration: number; fps: number; transparentBg: boolean;
};

export function defaultConfig(): Config {
  return {
    preset: "1:1 Square (1080)",
    bg: "#16110c",
    shapeColor: "#e8718b",
    metalness: 0.4, roughness: 0.25,
    depth: 18, bevelAmount: 1.6,
    autoRotate: true,
    rotSpeedX: 0, rotSpeedY: 0.6, rotSpeedZ: 0, wobble: 0.15,
    rotX: 0, rotY: 0, rotZ: 0,
    posX: 0, posY: 0, zoom: 220,
    bloom: 0.6, glass: 0, ripple: 0, rippleSpeed: 1.5,
    pixelate: 0, chroma: 0, scanlines: 0, vignette: 0.3,
    grain: 0.06, hueShift: 0, twist: 0, kaleidoscope: 0, halftone: 0,
    wireframe: false, iridescent: 0,
    duration: 6, fps: 60, transparentBg: false,
  };
}

export type TimelineKey = { t: number; vals: Record<string, number | string> };
export type Timeline = {
  keys: TimelineKey[];
  duration: number; time: number;
  playing: boolean; loop: boolean; drive: boolean; xform: boolean;
  selected: number;
};

const NUM_PROPS = ["metalness", "roughness", "bloom", "glass", "ripple", "rippleSpeed",
  "pixelate", "chroma", "scanlines", "vignette", "grain", "hueShift", "twist",
  "kaleidoscope", "halftone", "iridescent"] as const;
const COLOR_PROPS = ["shapeColor", "bg"] as const;
const GEO_PROPS = ["depth", "bevelAmount"] as const;

const FXShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) },
    uGlass: { value: 0 }, uRipple: { value: 0 }, uRippleSpeed: { value: 1.5 },
    uPixel: { value: 0 }, uChroma: { value: 0 }, uScan: { value: 0 },
    uVignette: { value: 0.3 }, uGrain: { value: 0.06 }, uHue: { value: 0 },
    uTwist: { value: 0 }, uKaleido: { value: 0 }, uHalftone: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
  `,
  fragmentShader: `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float uTime, uGlass, uRipple, uRippleSpeed, uPixel, uChroma, uScan, uVignette, uGrain;
    uniform float uHue, uTwist, uKaleido, uHalftone;
    uniform vec2 uRes;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    vec3 hueShift(vec3 c, float a){
      const vec3 k = vec3(0.57735);
      float ca = cos(a), sa = sin(a);
      return c*ca + cross(k,c)*sa + k*dot(k,c)*(1.0-ca);
    }
    void main(){
      vec2 uv = vUv;
      if(uKaleido > 0.5){
        vec2 c = uv - 0.5; float ang = atan(c.y, c.x); float rad = length(c);
        float seg = 3.14159265 / uKaleido; ang = abs(mod(ang, 2.0*seg) - seg);
        uv = 0.5 + vec2(cos(ang), sin(ang)) * rad;
      }
      if(uTwist != 0.0){
        vec2 c = uv - 0.5; float r = length(c); float a = uTwist * r * 3.0;
        float s = sin(a), co = cos(a); uv = 0.5 + mat2(co,-s,s,co) * c;
      }
      if(uPixel > 0.5){ vec2 px = vec2(uPixel) / uRes; uv = (floor(uv / px) + 0.5) * px; }
      if(uRipple > 0.0){
        vec2 c = uv - 0.5; float d = length(c);
        float w = sin(d*40.0 - uTime*uRippleSpeed*3.0) * 0.5 + 0.5;
        uv += normalize(c + 1e-5) * w * uRipple * 0.03;
      }
      if(uGlass > 0.0){
        float n = sin(uv.y*30.0 + uTime)*cos(uv.x*28.0 - uTime*0.7);
        uv += vec2(n) * uGlass * 0.01;
      }
      vec4 col;
      if(uChroma > 0.0){
        vec2 dir = (uv - 0.5); float a = uChroma * 0.01;
        col.r = texture2D(tDiffuse, uv + dir*a).r;
        col.g = texture2D(tDiffuse, uv).g;
        col.b = texture2D(tDiffuse, uv - dir*a).b; col.a = 1.0;
      } else { col = texture2D(tDiffuse, uv); }
      if(uHue != 0.0){ col.rgb = hueShift(col.rgb, uHue); }
      if(uHalftone > 0.5){
        vec2 g = vUv * uRes / uHalftone; vec2 f = fract(g) - 0.5;
        float lum = dot(col.rgb, vec3(0.299,0.587,0.114));
        float d = step(length(f), lum*0.75);
        col.rgb = mix(col.rgb*0.15, col.rgb, d);
      }
      if(uScan > 0.0){ float s = sin(vUv.y * uRes.y * 1.4) * 0.5 + 0.5; col.rgb *= 1.0 - uScan * 0.35 * s; }
      if(uGrain > 0.0){ float g = hash(vUv * uRes + uTime) - 0.5; col.rgb += g * uGrain; }
      if(uVignette > 0.0){ float v = smoothstep(0.9, 0.2, length(vUv-0.5)); col.rgb *= mix(1.0, v, uVignette); }
      gl_FragColor = col;
    }
  `,
};

const ease = (t: number) => t * t * (3 - 2 * t);

export type EngineOpts = {
  onStatus?: (msg: string) => void;
  onSync?: () => void;
  /** Long-running work (record / transcode / save). A string shows a busy badge; null clears it. */
  onBusy?: (msg: string | null) => void;
};

export function createAsteriskEngine(canvas: HTMLCanvasElement, stage: HTMLElement, opts: EngineOpts = {}) {
  const config = defaultConfig();
  const timeline: Timeline = {
    keys: [], duration: 6, time: 0, playing: false, loop: true, drive: false, xform: false, selected: -1,
  };
  const status = (m: string) => opts.onStatus?.(m);
  const sync = () => opts.onSync?.();
  const busy = (m: string | null) => opts.onBusy?.(m);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
  camera.position.set(0, 0, 220);
  // The preview is display-only: no mouse/touch orbit or zoom on the canvas (so it
  // never hijacks a tap or a page scroll). The camera looks at a fixed target and
  // distance is driven solely by the Zoom slider.
  const target = new THREE.Vector3(0, 0, 0);
  camera.lookAt(target);

  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(80, 120, 160);
  const fill = new THREE.DirectionalLight(0xffffff, 0.8); fill.position.set(-120, -40, 60);
  const rim = new THREE.PointLight(0xff8ccb, 1.5, 0, 0.5); rim.position.set(-60, 60, -120);
  const amb = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(key, fill, rim, amb);

  let mesh: THREE.Mesh | undefined;
  let material: THREE.MeshPhysicalMaterial | undefined;
  let geometry: THREE.BufferGeometry | undefined;

  function asteriskShapes() {
    const shape = new THREE.Shape();
    ASTERISK_POINTS.forEach(([x, y], i) => {
      const px = x - 50, py = -(y - 50);
      i === 0 ? shape.moveTo(px, py) : shape.lineTo(px, py);
    });
    shape.closePath();
    return { shapes: [shape], flipY: false };
  }
  let currentSource: { shapes: THREE.Shape[]; flipY: boolean } = asteriskShapes();
  const ASTERISK_SVG = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="' +
    ASTERISK_POINTS.map((p) => p.join(",")).join(" ") + '" fill="#ffffff"/></svg>';
  let currentSVG = ASTERISK_SVG;

  function buildShape() {
    const { shapes, flipY } = currentSource;
    const ext = {
      depth: config.depth, bevelEnabled: config.bevelAmount > 0.01,
      bevelThickness: config.bevelAmount * 1.4, bevelSize: config.bevelAmount,
      bevelSegments: 4, steps: 1,
    };
    const geos = shapes.map((s) => new THREE.ExtrudeGeometry(s, ext));
    geometry?.dispose();
    geometry = geos.length > 1 ? mergeGeometries(geos, false) : geos[0];
    if (geos.length > 1) geos.forEach((g) => g.dispose());
    if (flipY) geometry.scale(1, -1, 1);
    geometry.center();
    geometry.computeBoundingBox();
    const bb = geometry.boundingBox!;
    const maxDim = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y) || 1;
    geometry.scale(130 / maxDim, 130 / maxDim, 130 / maxDim);
    geometry.center();
    geometry.computeVertexNormals();
    if (!material) material = new THREE.MeshPhysicalMaterial({ color: config.shapeColor, side: THREE.DoubleSide });
    if (!mesh) { mesh = new THREE.Mesh(geometry, material); scene.add(mesh); }
    else mesh.geometry = geometry;
  }

  function loadSVG(svgText: string) {
    try {
      const data = new SVGLoader().parse(svgText);
      const shapes: THREE.Shape[] = [];
      data.paths.forEach((path) => SVGLoader.createShapes(path).forEach((s) => shapes.push(s)));
      if (!shapes.length) throw new Error("No fillable shapes found in SVG.");
      currentSource = { shapes, flipY: true };
      currentSVG = svgText;
      buildShape();
      mesh?.rotation.set(0, 0, 0);
      status("Loaded SVG — " + shapes.length + " shape(s).");
    } catch (e) {
      status("SVG error: " + (e as Error).message);
    }
  }
  function resetToAsterisk() {
    currentSource = asteriskShapes(); currentSVG = ASTERISK_SVG;
    buildShape(); mesh?.rotation.set(0, 0, 0); status("Reset to asterisk.");
  }

  let composer: EffectComposer, bloomPass: UnrealBloomPass, fxPass: ShaderPass;
  function buildComposer() {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), config.bloom, 0.6, 0.85);
    composer.addPass(bloomPass);
    fxPass = new ShaderPass(FXShader);
    composer.addPass(fxPass);
    composer.addPass(new OutputPass());
  }

  let W = 1080, H = 1080;
  function applyPreset() {
    [W, H] = PRESETS[config.preset];
    renderer.setSize(W, H, false);
    composer.setSize(W, H);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    bloomPass.setSize(W, H);
    fxPass.uniforms.uRes.value.set(W, H);
    fitToStage();
  }
  function fitToStage() {
    const availW = stage.clientWidth;
    const availH = stage.clientHeight;
    if (availW <= 0 || availH <= 0) return;
    const scale = Math.min(availW / W, availH / H, 1);
    canvas.style.width = W * scale + "px";
    canvas.style.height = H * scale + "px";
  }
  const ro = new ResizeObserver(fitToStage);
  ro.observe(stage);

  function syncMaterial() {
    if (!material) return;
    material.color.set(config.shapeColor);
    material.metalness = config.metalness;
    material.roughness = config.roughness;
    material.wireframe = config.wireframe;
    material.iridescence = config.iridescent;
    material.iridescenceIOR = 1.6;
    material.needsUpdate = true;
    scene.background = config.transparentBg ? null : new THREE.Color(config.bg);
  }
  function syncFX() {
    bloomPass.strength = config.bloom;
    const u = fxPass.uniforms;
    u.uGlass.value = config.glass; u.uRipple.value = config.ripple;
    u.uRippleSpeed.value = config.rippleSpeed; u.uPixel.value = config.pixelate;
    u.uChroma.value = config.chroma; u.uScan.value = config.scanlines;
    u.uVignette.value = config.vignette; u.uGrain.value = config.grain;
    u.uHue.value = config.hueShift; u.uTwist.value = config.twist;
    u.uKaleido.value = config.kaleidoscope; u.uHalftone.value = config.halftone;
  }
  function setZoom(v: number) {
    const dir = camera.position.clone().sub(target);
    if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1);
    dir.normalize();
    camera.position.copy(target).addScaledVector(dir, Math.max(1, v));
    camera.lookAt(target);
  }
  function applyZoomFromConfig() { setZoom(config.zoom); }
  function resetTransform() {
    config.rotX = config.rotY = config.rotZ = 0;
    config.posX = config.posY = 0; config.zoom = 220;
    mesh?.rotation.set(0, 0, 0); mesh?.position.set(0, 0, 0);
    camera.position.set(0, 0, 220); target.set(0, 0, 0); camera.lookAt(target);
    status("Transform reset."); sync();
  }

  // ---------- Timeline ----------
  // Rotation + position only. Zoom is captured separately (below) as a first-class
  // keyframed scalar, so it animates with "Drive scene" alone — it no longer needs
  // the "Keyframe rotation" toggle, which is what made zoom keyframes appear broken.
  const TRANSFORM_GET = () => ({
    rotX: mesh!.rotation.x, rotY: mesh!.rotation.y, rotZ: mesh!.rotation.z,
    posX: mesh!.position.x, posY: mesh!.position.y,
  });
  function captureVals(): Record<string, number | string> {
    const v: Record<string, number | string> = {};
    NUM_PROPS.forEach((p) => (v[p] = config[p]));
    GEO_PROPS.forEach((p) => (v[p] = config[p]));
    COLOR_PROPS.forEach((p) => (v[p] = config[p]));
    v.zoom = config.zoom;                                  // always keyframe zoom
    if (timeline.xform && mesh) Object.assign(v, TRANSFORM_GET());
    return v;
  }
  function addKeyframe() {
    const t = +timeline.time.toFixed(3);
    const i = timeline.keys.findIndex((k) => Math.abs(k.t - t) < 0.01);
    const key = { t, vals: captureVals() };
    if (i >= 0) timeline.keys[i] = key; else timeline.keys.push(key);
    timeline.keys.sort((a, b) => a.t - b.t);
    timeline.selected = timeline.keys.indexOf(key);
    timeline.drive = true;
    status("Keyframe @ " + t.toFixed(2) + "s (" + timeline.keys.length + " total)");
    sync();
  }
  const _ca = new THREE.Color(), _cb = new THREE.Color(), _cc = new THREE.Color();
  function applyAtTime(t: number) {
    const keys = timeline.keys;
    if (!keys.length) return;
    let a = keys[0], b = keys[0];
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].t <= t) a = keys[i];
      if (keys[i].t >= t) { b = keys[i]; break; }
    }
    const span = b.t - a.t;
    const f = span > 0 ? ease(Math.min(1, Math.max(0, (t - a.t) / span))) : 0;
    const lerp = (x: number, y: number) => x + (y - x) * f;
    NUM_PROPS.forEach((p) => { (config[p] as number) = lerp(a.vals[p] as number, b.vals[p] as number); });
    let geoChanged = false;
    GEO_PROPS.forEach((p) => {
      if (a.vals[p] === undefined) return;
      const nv = lerp(a.vals[p] as number, b.vals[p] as number);
      if (Math.abs(nv - (config[p] as number)) > 1e-3) geoChanged = true;
      (config[p] as number) = nv;
    });
    if (geoChanged) buildShape();
    // Zoom interpolates on its own — independent of the rotation/position keyframes.
    if (a.vals.zoom !== undefined && b.vals.zoom !== undefined) {
      config.zoom = lerp(a.vals.zoom as number, b.vals.zoom as number);
      setZoom(config.zoom);
    }
    COLOR_PROPS.forEach((p) => {
      _ca.set(a.vals[p] as string); _cb.set(b.vals[p] as string);
      _cc.copy(_ca).lerp(_cb, f);
      (config[p] as string) = "#" + _cc.getHexString();
    });
    if (a.vals.rotX !== undefined && b.vals.rotX !== undefined && mesh) {
      mesh.rotation.set(lerp(a.vals.rotX as number, b.vals.rotX as number), lerp(a.vals.rotY as number, b.vals.rotY as number), lerp(a.vals.rotZ as number, b.vals.rotZ as number));
      mesh.position.set(lerp(a.vals.posX as number, b.vals.posX as number), lerp(a.vals.posY as number, b.vals.posY as number), 0);
    }
    syncMaterial(); syncFX();
  }
  let suppressAutoKey = false;
  function autoKey() {
    if (suppressAutoKey || timeline.playing || !timeline.drive || !timeline.keys.length) return;
    const t = +timeline.time.toFixed(3);
    const i = timeline.keys.findIndex((k) => Math.abs(k.t - t) < 0.01);
    const vals = captureVals();
    if (i >= 0) timeline.keys[i].vals = vals;
    else { timeline.keys.push({ t, vals }); timeline.keys.sort((a, b) => a.t - b.t); }
    timeline.selected = timeline.keys.findIndex((k) => Math.abs(k.t - t) < 0.01);
    sync();
  }
  function tlTick(dt: number) {
    if (timeline.playing) {
      timeline.time += dt;
      if (timeline.time >= timeline.duration) {
        if (timeline.loop) timeline.time %= timeline.duration;
        else { timeline.time = timeline.duration; timeline.playing = false; }
      }
    }
    if (timeline.drive && timeline.keys.length) applyAtTime(timeline.time);
  }
  function deleteSelectedKey() {
    if (timeline.selected < 0) { status("Select a keyframe first."); return; }
    timeline.keys.splice(timeline.selected, 1);
    timeline.selected = -1; sync();
  }
  function clearKeys() {
    timeline.keys = []; timeline.selected = -1; timeline.playing = false; timeline.drive = false; sync();
  }
  function togglePlay(force?: boolean) {
    if (!timeline.keys.length) { status("Add some keyframes first."); return; }
    timeline.playing = force !== undefined ? force : !timeline.playing;
    timeline.drive = true;
    if (timeline.playing && timeline.time >= timeline.duration - 1e-3) timeline.time = 0;
    sync();
  }
  function setDrive(on: boolean) { timeline.drive = on; if (on && timeline.keys.length) applyAtTime(timeline.time); sync(); }
  function setXform(on: boolean) {
    timeline.xform = on;
    if (on) timeline.keys.forEach((k) => { if (k.vals.rotX === undefined) Object.assign(k.vals, TRANSFORM_GET()); });
    else timeline.keys.forEach((k) => ["rotX", "rotY", "rotZ", "posX", "posY"].forEach((p) => delete k.vals[p]));
    sync();
  }
  function setTime(t: number) {
    timeline.time = Math.min(timeline.duration, Math.max(0, t));
    if (timeline.keys.length) { timeline.drive = true; applyAtTime(timeline.time); }
    sync();
  }
  function setDuration(d: number) { timeline.duration = Math.max(1, d || 6); config.duration = timeline.duration; sync(); }
  function setSelectedKeyTime(t: number) {
    const k = timeline.keys[timeline.selected]; if (!k) return;
    k.t = Math.min(timeline.duration, Math.max(0, t));
    timeline.keys.sort((a, b) => a.t - b.t);
    timeline.selected = timeline.keys.indexOf(k); sync();
  }
  function selectKey(i: number) { timeline.selected = i; sync(); }

  // ---------- Loop ----------
  const clock = new THREE.Clock();
  let elapsed = 0;
  let raf = 0;
  function animate() {
    raf = requestAnimationFrame(animate);
    const dt = clock.getDelta();
    elapsed += dt;
    const xformDriven = timeline.drive && timeline.keys.length > 0 && timeline.xform &&
      timeline.keys.every((k) => k.vals.rotX !== undefined);
    if (!xformDriven && mesh) {
      if (config.autoRotate) {
        mesh.rotation.x += config.rotSpeedX * dt;
        mesh.rotation.y += config.rotSpeedY * dt;
        mesh.rotation.z += config.rotSpeedZ * dt;
      } else {
        mesh.rotation.set(
          THREE.MathUtils.degToRad(config.rotX),
          THREE.MathUtils.degToRad(config.rotY),
          THREE.MathUtils.degToRad(config.rotZ));
      }
      mesh.position.x = config.posX;
      mesh.position.y = config.posY + (config.wobble > 0 ? Math.sin(elapsed * 1.2) * config.wobble * 10 : 0);
    }
    tlTick(dt);
    fxPass.uniforms.uTime.value = elapsed;
    config.zoom = camera.position.distanceTo(target);
    composer.render();
  }

  // ---------- Exports ----------
  function downloadBlob(blob: Blob, name: string) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  function savePNG() {
    if (config.transparentBg) {
      const prevBg = scene.background;
      scene.background = null;
      renderer.setClearColor(0x000000, 0);
      renderer.render(scene, camera);
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a"); a.href = url; a.download = "asterisk.png"; a.click();
      scene.background = prevBg; renderer.setClearColor(0x000000, 1);
      status("Saved transparent asterisk.png");
    } else {
      composer.render();
      canvas.toBlob((b) => b && downloadBlob(b, "asterisk.png"), "image/png");
      status("Saved asterisk.png");
    }
  }
  let _ffmpeg: any;
  async function toMP4(webmBlob: Blob): Promise<Blob> {
    if (!_ffmpeg) {
      // Variable specifiers so the bundler leaves these as runtime imports.
      const base = "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/esm";
      const utilUrl = "https://unpkg.com/@ffmpeg/util@0.12.1/dist/esm/index.js";
      const { FFmpeg } = await import(/* webpackIgnore: true */ base + "/index.js");
      const { toBlobURL, fetchFile } = await import(/* webpackIgnore: true */ utilUrl);
      const core = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      _ffmpeg = new FFmpeg();
      // classWorkerURL MUST be a same-origin (blob) URL: the default loads
      // ./worker.js from unpkg as a cross-origin Worker, which every browser
      // blocks — that's why the transcode always failed and we fell back to .webm.
      await _ffmpeg.load({
        classWorkerURL: await toBlobURL(base + "/worker.js", "text/javascript"),
        coreURL: await toBlobURL(core + "/ffmpeg-core.js", "text/javascript"),
        wasmURL: await toBlobURL(core + "/ffmpeg-core.wasm", "application/wasm"),
      });
      _ffmpeg._fetchFile = fetchFile;
    }
    const ff = _ffmpeg;
    await ff.writeFile("in.webm", await ff._fetchFile(webmBlob));
    await ff.exec(["-i", "in.webm", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-r", String(config.fps), "out.mp4"]);
    const data = await ff.readFile("out.mp4");
    return new Blob([data.buffer], { type: "video/mp4" });
  }
  /** Best supported recorder MIME for this browser, preferring MP4 when asked.
      Safari and Chromium ≥130 record MP4 natively (Chrome advertises the `avc1`
      codec) — when they do we skip the ffmpeg transcode entirely. iOS Safari only
      records MP4, so this is also what makes .mp4 work on mobile. */
  function pickRecordMime(preferMp4: boolean): string {
    const mp4 = ["video/mp4;codecs=avc1.42E01E", "video/mp4;codecs=avc1", "video/mp4;codecs=h264", "video/mp4"];
    const webm = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
    const order = preferMp4 ? [...mp4, ...webm] : [...webm, ...mp4];
    for (const t of order) {
      try { if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) return t; } catch { /* old browser */ }
    }
    return "";
  }
  function recordVideo(toMp4 = false) {
    if (typeof MediaRecorder === "undefined" || typeof canvas.captureStream !== "function") {
      status("Recording isn’t supported in this browser.");
      return;
    }
    const fps = config.fps;
    const stream = canvas.captureStream(fps);
    const mime = pickRecordMime(toMp4);
    let rec: MediaRecorder;
    try {
      rec = mime
        ? new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 16_000_000 })
        : new MediaRecorder(stream);
    } catch {
      try { rec = new MediaRecorder(stream); }
      catch (e) { status("Couldn’t start the recorder: " + (e as Error).message); return; }
    }
    const recMime = rec.mimeType || mime || "video/webm";
    const nativeMp4 = /mp4/i.test(recMime);
    const chunks: BlobPart[] = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);

    const useTl = timeline.keys.length > 0;
    let prevLoop = timeline.loop;
    rec.onstop = async () => {
      if (useTl) { togglePlay(false); timeline.loop = prevLoop; sync(); }
      const blob = new Blob(chunks, { type: recMime });
      if (!blob.size) { busy(null); status("Recording produced no data — try again."); return; }
      try {
        if (toMp4 && !nativeMp4) {
          // Desktop path: recorded WebM, transcode to MP4 with ffmpeg.wasm.
          busy("Saving — transcoding to MP4 (first run downloads ffmpeg ~30 MB)…");
          downloadBlob(await toMP4(blob), "asterisk.mp4");
          status("Saved asterisk.mp4");
        } else {
          const ext = nativeMp4 ? "mp4" : "webm";
          busy("Saving asterisk." + ext + "…");
          downloadBlob(blob, "asterisk." + ext);
          status("Saved asterisk." + ext);
        }
      } catch (e) {
        // MP4 was asked for but neither native recording nor the ffmpeg transcode
        // worked — save the raw WebM and say so plainly (no silent mislabelling).
        const ext = nativeMp4 ? "mp4" : "webm";
        downloadBlob(blob, "asterisk." + ext);
        status(toMp4 && ext === "webm"
          ? "This browser can’t make MP4 here — saved .webm instead (" + (e as Error).message + ")."
          : "Export issue (" + (e as Error).message + ") — saved the raw ." + ext + ".");
      } finally {
        busy(null);
      }
    };

    if (useTl) { prevLoop = timeline.loop; timeline.loop = false; timeline.time = 0; timeline.drive = true; togglePlay(true); }
    try { rec.start(); }
    catch (e) { busy(null); status("Recorder failed to start: " + (e as Error).message); return; }
    const total = (useTl ? timeline.duration : config.duration) * 1000;
    const t0 = performance.now();
    const tick = () => {
      if (rec.state !== "recording") return;
      const left = total - (performance.now() - t0);
      if (left <= 0) { busy("Saving…"); rec.stop(); return; }
      busy(`Recording — ${(left / 1000).toFixed(1)}s left`);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function exportSettings() {
    const data = { config, timeline: { keys: timeline.keys, duration: timeline.duration, loop: timeline.loop } };
    downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), "asterisk-settings.json");
    status("Saved settings JSON.");
  }
  function exportCode() {
    const cfg = JSON.stringify(config);
    const dims = PRESETS[config.preset];
    const T = "three@0.160.0";
    const html = `<!-- Asterisk Studio embed -->
<div id="ast-embed" style="width:100%;aspect-ratio:${dims[0]}/${dims[1]};"></div>
<script type="module">
import * as THREE from 'https://unpkg.com/${T}/build/three.module.js';
import { EffectComposer } from 'https://unpkg.com/${T}/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/${T}/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://unpkg.com/${T}/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/${T}/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'https://unpkg.com/${T}/examples/jsm/postprocessing/OutputPass.js';
import { SVGLoader } from 'https://unpkg.com/${T}/examples/jsm/loaders/SVGLoader.js';
import { mergeGeometries } from 'https://unpkg.com/${T}/examples/jsm/utils/BufferGeometryUtils.js';
const CFG=${cfg};const SVG=${JSON.stringify(currentSVG)};const FLIPY=${currentSource.flipY};
const FX=${JSON.stringify(FXShader.fragmentShader)};const VX=${JSON.stringify(FXShader.vertexShader)};
const host=document.getElementById('ast-embed');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:CFG.transparentBg});
if(CFG.transparentBg)renderer.setClearColor(0x000000,0);
host.appendChild(renderer.domElement);
const scene=new THREE.Scene();if(!CFG.transparentBg)scene.background=new THREE.Color(CFG.bg);
const camera=new THREE.PerspectiveCamera(45,${dims[0]}/${dims[1]},0.1,2000);camera.position.set(0,0,220);
scene.add(new THREE.AmbientLight(0xffffff,0.35));
const k=new THREE.DirectionalLight(0xffffff,2.2);k.position.set(80,120,160);scene.add(k);
const f=new THREE.DirectionalLight(0xffffff,0.8);f.position.set(-120,-40,60);scene.add(f);
const r=new THREE.PointLight(0xff8ccb,1.5);r.position.set(-60,60,-120);scene.add(r);
const shapes=[];new SVGLoader().parse(SVG).paths.forEach(p=>SVGLoader.createShapes(p).forEach(s=>shapes.push(s)));
const ext={depth:CFG.depth,bevelEnabled:CFG.bevelAmount>0.01,bevelThickness:CFG.bevelAmount*1.4,bevelSize:CFG.bevelAmount,bevelSegments:4,steps:1};
const gs=shapes.map(s=>new THREE.ExtrudeGeometry(s,ext));
let geo=gs.length>1?mergeGeometries(gs,false):gs[0];
if(FLIPY)geo.scale(1,-1,1);geo.center();geo.computeBoundingBox();
const bb=geo.boundingBox,md=Math.max(bb.max.x-bb.min.x,bb.max.y-bb.min.y)||1;
geo.scale(130/md,130/md,130/md);geo.center();geo.computeVertexNormals();
const mat=new THREE.MeshPhysicalMaterial({color:CFG.shapeColor,metalness:CFG.metalness,roughness:CFG.roughness,side:THREE.DoubleSide,wireframe:CFG.wireframe,iridescence:CFG.iridescent,iridescenceIOR:1.6});
const mesh=new THREE.Mesh(geo,mat);scene.add(mesh);
const FXS={uniforms:{tDiffuse:{value:null},uTime:{value:0},uRes:{value:new THREE.Vector2(1,1)},uGlass:{value:CFG.glass},uRipple:{value:CFG.ripple},uRippleSpeed:{value:CFG.rippleSpeed},uPixel:{value:CFG.pixelate},uChroma:{value:CFG.chroma},uScan:{value:CFG.scanlines},uVignette:{value:CFG.vignette},uGrain:{value:CFG.grain},uHue:{value:CFG.hueShift},uTwist:{value:CFG.twist},uKaleido:{value:CFG.kaleidoscope},uHalftone:{value:CFG.halftone}},vertexShader:VX,fragmentShader:FX};
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),CFG.bloom,0.6,0.85);composer.addPass(bloom);
const fx=new ShaderPass(FXS);composer.addPass(fx);composer.addPass(new OutputPass());
function size(){const w=host.clientWidth,h=host.clientHeight;renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(w,h,false);composer.setSize(w,h);bloom.setSize(w,h);fx.uniforms.uRes.value.set(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
addEventListener('resize',size);size();
let t=0,last=performance.now();
function loop(){requestAnimationFrame(loop);const now=performance.now(),dt=(now-last)/1000;last=now;t+=dt;
if(CFG.autoRotate){mesh.rotation.x+=CFG.rotSpeedX*dt;mesh.rotation.y+=CFG.rotSpeedY*dt;mesh.rotation.z+=CFG.rotSpeedZ*dt;}
mesh.position.y=Math.sin(t*1.2)*CFG.wobble*10;fx.uniforms.uTime.value=t;composer.render();}
loop();
<\/script>`;
    downloadBlob(new Blob([html], { type: "text/html" }), "asterisk-embed.html");
    status("Exported asterisk-embed.html");
  }

  // init
  buildShape(); buildComposer(); syncMaterial(); syncFX(); applyPreset();
  animate();

  function dispose() {
    cancelAnimationFrame(raf);
    ro.disconnect();
    geometry?.dispose();
    material?.dispose();
    composer?.dispose?.();
    renderer.dispose();
  }

  return {
    config, timeline,
    buildShape, syncMaterial, syncFX, applyPreset, applyZoomFromConfig, resetTransform,
    loadSVG, resetToAsterisk, autoKey,
    // timeline
    addKeyframe, deleteSelectedKey, clearKeys, togglePlay, setDrive, setXform, setTime, setDuration, setSelectedKeyTime, selectKey,
    // export
    savePNG, recordVideo, exportSettings, exportCode,
    dispose,
  };
}

export type AsteriskEngine = ReturnType<typeof createAsteriskEngine>;
