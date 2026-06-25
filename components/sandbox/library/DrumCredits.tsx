"use client";

/**
 * DrumCredits — the 1950s "credits on a rotating drum" look.
 *
 * Old title sequences were sometimes shot off a physical drum: the credits were
 * printed around the circumference of a large-radius cylinder lying on its side,
 * and a camera filmed the front of it as it turned. The signature is that the
 * type isn't a flat sheet sliding up — near the top and bottom of frame the
 * surface curves away from the lens, so lines foreshorten and bow ever so
 * slightly as they enter and leave.
 *
 * We reproduce it faithfully but cheaply: a fixed curved mesh (a tall, gentle arc
 * of a horizontal-axis cylinder, large radius → subtle curve) facing the camera,
 * with the credits rendered to a canvas texture that scrolls vertically through
 * it. The camera window is fixed; the type travels through the curved lens, which
 * is exactly what a fixed camera sees off a real drum. Reference video stored on
 * the page.
 *
 * The analogue treatment is all post: subtle UnrealBloom for emulsion halation
 * (the cream type bleeding light on black), a grain + warm-vignette + flicker
 * shader for the projected-film texture, and a slow gate weave that drifts the
 * whole frame like an unsteady projector.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/** Grain + warm tint + vignette + flicker — the projected-film look, in one pass. */
const FilmShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uGrain: { value: 0.09 },
    uVignette: { value: 0.9 },
    uFlicker: { value: 0.05 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes;
    uniform float uGrain; uniform float uVignette; uniform float uFlicker;
    varying vec2 vUv;
    float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p + 19.19); return fract((p.x + p.y) * p.x); }
    void main(){
      vec3 col = texture2D(tDiffuse, vUv).rgb;
      col *= vec3(1.06, 1.0, 0.90);                                   // warm cast
      float fl = 1.0 - uFlicker * hash(vec2(floor(uTime * 20.0), 3.0)); // exposure flicker
      col *= fl;
      float g = hash(vUv * uRes + fract(uTime) * vec2(91.7, 113.3)) - 0.5;
      col += g * uGrain;                                              // film grain
      vec2 d = vUv - 0.5;
      float vig = smoothstep(0.85, 0.18, dot(d, d) * 2.4);            // warm vignette
      col *= mix(1.0, vig, uVignette);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

/** Gentle arc of a large-radius drum. Bigger ARC = more pronounced curl. */
const ARC = 0.82; // radians of cylinder visible (~47°)
const RADIUS = 6;
/** How much of the credits canvas fills the visible arc (smaller = more lines). */
const WINDOW = 0.2;
/** Vertical scroll speed, in texture-units per second. */
const SPEED = 0.018;

/** The credits roll. Each entry is either a centred title or a role/name pair. */
type Credit = { role?: string; name: string; big?: boolean; gap?: number };
const CREDITS: Credit[] = [
  { name: "finbar✶studio", big: true, gap: 1.4 },
  { name: "PRESENTS", gap: 2.2 },
  { role: "Directed by", name: "Finbar Skitini", gap: 1.4 },
  { role: "Produced by", name: "The Studio", gap: 1.4 },
  { role: "Director of Photography", name: "A. Cinematographer", gap: 1.4 },
  { role: "Original Music by", name: "The Orchestra", gap: 1.4 },
  { role: "Edited by", name: "The Cutting Room", gap: 2.2 },
  { name: "STARRING", gap: 1.4 },
  { name: "The Leading Player", gap: 0.7 },
  { name: "A Supporting Cast", gap: 0.7 },
  { name: "And the Ensemble", gap: 2.2 },
  { role: "Art Direction", name: "The Set Department", gap: 1.4 },
  { role: "Costumes by", name: "Wardrobe", gap: 1.4 },
  { role: "Filmed at", name: "Brisbane Studios", gap: 2.4 },
  { name: "THE END", big: true, gap: 3 },
];

/** Render the credits to a tall canvas, return it plus its content metrics. */
function buildCreditsCanvas(): HTMLCanvasElement {
  const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
  const W = 1100;
  const unit = 64; // one "line" of vertical rhythm
  const roleSize = 30;
  const nameSize = 46;
  const bigSize = 78;

  // Measure total height first (top pad + each line + its gap + bottom pad).
  const topPad = unit * 3;
  let h = topPad;
  for (const c of CREDITS) {
    if (c.role) h += roleSize * 1.4 + nameSize * 1.3;
    else h += (c.big ? bigSize : nameSize) * 1.3;
    h += unit * (c.gap ?? 1);
  }
  // Trailing blank so the loop has a clean dark gap before it repeats.
  const tailPad = unit * 10;
  h += tailPad;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, W, h);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const cream = "#f1e6cc";
  const soft = "#c2b294";
  const serif = "Georgia, 'Times New Roman', 'Hoefler Text', serif";

  let y = topPad;
  for (const c of CREDITS) {
    if (c.role) {
      ctx.fillStyle = soft;
      ctx.font = `400 ${roleSize}px ${serif}`;
      // small-caps-ish: letter-spacing via manual tracking
      drawTracked(ctx, c.role.toUpperCase(), W / 2, y, 4);
      y += roleSize * 1.4;
      ctx.fillStyle = cream;
      ctx.font = `500 ${nameSize}px ${serif}`;
      ctx.fillText(c.name, W / 2, y);
      y += nameSize * 1.3;
    } else {
      const size = c.big ? bigSize : nameSize;
      ctx.fillStyle = cream;
      ctx.font = `${c.big ? 600 : 500} ${size}px ${serif}`;
      const tracking = c.big ? 2 : c.name === c.name.toUpperCase() ? 8 : 0;
      if (tracking) drawTracked(ctx, c.name, W / 2, y, tracking);
      else ctx.fillText(c.name, W / 2, y);
      y += size * 1.3;
    }
    y += unit * (c.gap ?? 1);
  }
  return canvas;
}

/** Draw centred text with manual letter-spacing (canvas has no tracking). */
function drawTracked(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, tracking: number) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width + tracking);
  const total = widths.reduce((a, b) => a + b, 0) - tracking;
  let x = cx - total / 2;
  const prev = ctx.textAlign;
  ctx.textAlign = "left";
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], x, y);
    x += widths[i];
  }
  ctx.textAlign = prev;
}

/** Bend a flat plane into a vertical arc of a horizontal-axis cylinder. */
function curvedPlane(width: number, segW: number, segH: number): THREE.PlaneGeometry {
  const geo = new THREE.PlaneGeometry(width, 1, segW, segH);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const v = pos.getY(i) + 0.5; // 0..1 bottom→top
    const theta = (v - 0.5) * ARC; // -ARC/2 .. ARC/2
    pos.setY(i, RADIUS * Math.sin(theta));
    pos.setZ(i, RADIUS * Math.cos(theta) - RADIUS); // front (centre) at z=0, edges recede
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

export default function DrumCredits() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080706); // opaque film black (clean for post)
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

    // The credits texture.
    const tex = new THREE.CanvasTexture(buildCreditsCanvas());
    tex.wrapT = THREE.RepeatWrapping;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    tex.repeat.set(1, WINDOW);
    tex.generateMipmaps = true;
    tex.colorSpace = THREE.SRGBColorSpace;

    // Plane width matched to the canvas aspect so letters aren't stretched:
    // arc visible height is 2·R·sin(ARC/2); width = that × (canvasW / (canvasH·WINDOW)).
    const visibleH = 2 * RADIUS * Math.sin(ARC / 2);
    const cnv = tex.image as HTMLCanvasElement;
    const planeW = visibleH * (cnv.width / (cnv.height * WINDOW));

    const geo = curvedPlane(planeW, 16, 220);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Post: bloom (emulsion halation) → film grain/vignette/flicker → output.
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.5, 0.18);
    composer.addPass(bloom);
    const film = new ShaderPass(FilmShader);
    composer.addPass(film);
    composer.addPass(new OutputPass());

    const baseFov = camera.fov;

    // Frame the arc with a little breathing room top and bottom.
    const fit = () => {
      const w = wrap.clientWidth || 1;
      const h = wrap.clientHeight || 1;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      composer.setPixelRatio(dpr);
      composer.setSize(w, h);
      bloom.setSize(w, h);
      film.uniforms.uRes.value.set(w * dpr, h * dpr);
      camera.aspect = w / h;
      // Distance so the visible arc fills ~78% of frame height.
      const margin = 0.78;
      camera.position.z = (visibleH / margin / 2) / Math.tan((baseFov * Math.PI) / 360);
      camera.updateProjectionMatrix();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);

    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let running = true;
    const camZ = () => (visibleH / 0.78 / 2) / Math.tan((baseFov * Math.PI) / 360);
    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      elapsed += dt;
      tex.offset.y -= SPEED * dt; // negative scrolls the type upward
      film.uniforms.uTime.value = elapsed;
      // Gate weave: drift the whole frame like an unsteady projector.
      const A = visibleH * 0.004;
      camera.position.x = (Math.sin(elapsed * 2.1) + 0.6 * Math.sin(elapsed * 3.7)) * A;
      camera.position.y = (Math.sin(elapsed * 1.7) + 0.5 * Math.sin(elapsed * 2.9)) * A;
      camera.position.z = camZ(); // camera keeps looking down -Z, so x/y drift the frame
      composer.render();
    };
    raf = requestAnimationFrame(loop);

    // Pause when the tab/section is hidden (saves the GPU + keeps the loop seamless).
    const io = new IntersectionObserver(([e]) => {
      const vis = e.isIntersecting;
      if (vis && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(loop);
      } else if (!vis) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(wrap);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      geo.dispose();
      mat.dispose();
      tex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="sb-fx-stage" ref={wrapRef}>
      <canvas ref={canvasRef} className="sb-fx-canvas" />
      <div className="sb-fx-vignette" aria-hidden="true" />
    </div>
  );
}
