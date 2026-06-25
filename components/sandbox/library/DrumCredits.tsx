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
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

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
  const cream = "#ece3d2";
  const soft = "#b9ad96";
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

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
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

    // Plane width matched to the canvas aspect so letters aren't stretched:
    // arc visible height is 2·R·sin(ARC/2); width = that × (canvasW / (canvasH·WINDOW)).
    const visibleH = 2 * RADIUS * Math.sin(ARC / 2);
    const cnv = tex.image as HTMLCanvasElement;
    const planeW = visibleH * (cnv.width / (cnv.height * WINDOW));

    const geo = curvedPlane(planeW, 16, 220);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Frame the arc with a little breathing room top and bottom.
    const fit = () => {
      const w = wrap.clientWidth || 1;
      const h = wrap.clientHeight || 1;
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Distance so the visible arc fills ~78% of frame height.
      const margin = 0.78;
      camera.position.z = (visibleH / margin / 2) / Math.tan((camera.fov * Math.PI) / 360);
      camera.updateProjectionMatrix();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);

    let raf = 0;
    let last = 0;
    let running = true;
    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      tex.offset.y -= SPEED * dt; // negative scrolls the type upward
      renderer.render(scene, camera);
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
