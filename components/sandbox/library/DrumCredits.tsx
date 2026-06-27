"use client";

/**
 * DrumCredits — the "credits on a rotating drum" mechanic, restyled in the studio
 * design tokens (no historical serif/film look) and composed as a 50/50 split:
 * a single drum on the left, three drums stacked on the right.
 *
 * Each drum is a fixed curved mesh (a tall, gentle arc of a horizontal-axis
 * cylinder) facing the camera, with the credits rendered to a canvas texture that
 * scrolls vertically through it — so near the top and bottom of frame the type
 * bows and foreshortens, exactly like a camera filming a real printed drum.
 *
 * Text uses the site tokens resolved at runtime: --font-primary (Archivo Narrow)
 * for display/names, --font-mono (Space Mono) for tracked caps labels, and the
 * sandbox --ink / --ink-soft / --pink colours.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ASTERISK_POINTS } from "@/components/brand-asterisk";

/** Tighter drum: more arc + smaller radius = a more pronounced curl. */
const ARC = 1.12; // radians of cylinder visible (~64°)
const RADIUS = 4;
/** How much of the credits canvas fills the visible arc (smaller = fewer lines). */
const W_NORMAL = 0.2; // the single "normal" drum: a classic multi-line roll
const W_TIGHT = 0.055; // each stacked drum: ~one large line, halves curling top + bottom
/** Vertical scroll speed, in texture-units per second. */
const SPEED = 0.018;

/** The brand asterisk polygon (0–100 viewBox) as [x,y] pairs, for canvas fill. */
const ASTER = ASTERISK_POINTS.trim().split(/\s+/).map((p) => p.split(",").map(Number) as [number, number]);

/** The credits roll. Each entry is either a centred title or a role/name pair.
    `logo` renders the canonical FINBARSTUDIO wordmark (Space Mono + asterisk). */
type Credit = { role?: string; name: string; big?: boolean; logo?: boolean; gap?: number };
const CREDITS: Credit[] = [
  { name: "FINBARSTUDIO", logo: true, gap: 1.8 },
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

type Tokens = { ink: string; inkSoft: string; pink: string; bg: string; primary: string; mono: string };

/** Resolve a CSS custom property to a canvas-usable value via a hidden probe
    (so color-mix() / next-font generated families collapse to a concrete value). */
function probe(scope: Element, prop: "color" | "fontFamily", varName: string, fallback: string): string {
  try {
    const el = document.createElement("span");
    el.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
    el.style[prop] = `var(${varName})`;
    scope.appendChild(el);
    const v = getComputedStyle(el)[prop];
    scope.removeChild(el);
    return v || fallback;
  } catch {
    return fallback;
  }
}
function readTokens(scope: Element): Tokens {
  return {
    ink: probe(scope, "color", "--ink", "#F6EFE1"),
    inkSoft: probe(scope, "color", "--ink-soft", "#b4ac9d"),
    pink: probe(scope, "color", "--pink", "#E8718B"),
    bg: probe(scope, "color", "--bg", "#211E1A"),
    primary: probe(scope, "fontFamily", "--font-primary", "system-ui, sans-serif"),
    mono: probe(scope, "fontFamily", "--font-mono", "ui-monospace, monospace"),
  };
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

/** Fill the brand asterisk polygon centred at (cx, cy) at the given pixel size. */
function drawAsterisk(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  const s = size / 100;
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < ASTER.length; i++) {
    const px = cx + (ASTER[i][0] - 50) * s;
    const py = cy + (ASTER[i][1] - 50) * s;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Render the credits to a tall canvas using the site tokens. Dimensions are
    derived from fixed sizes (not measureText), so they're identical whether or
    not the web fonts have loaded yet — a font-swap rebuild keeps the same size. */
function buildCreditsCanvas(t: Tokens, tight = false): HTMLCanvasElement {
  const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
  const W = 1100;
  // `tight` (the stacked drums) wants large type with low line + paragraph spacing;
  // the single drum keeps the classic proportions.
  const k = tight ? 1.34 : 1; // type scale
  const lineMul = tight ? 0.72 : 1; // leading inside a credit (role→name, after a line)
  const paraMul = tight ? 0.38 : 1; // blank gap between credits
  const unit = 64;
  const roleSize = 28 * k;
  const nameSize = 48 * k;
  const sectionSize = 34 * k;
  const bigSize = 84 * k;
  const logoSize = 70 * k;
  const isUpper = (s: string) => s === s.toUpperCase();

  const topPad = unit * 3;
  let h = topPad;
  for (const c of CREDITS) {
    if (c.role) h += (roleSize * 1.5 + nameSize * 1.25) * lineMul;
    else if (c.logo) h += logoSize * 1.3 * lineMul;
    else h += (c.big ? bigSize : isUpper(c.name) ? sectionSize : nameSize) * 1.3 * lineMul;
    h += unit * (c.gap ?? 1) * paraMul;
  }
  h += unit * 10 * paraMul; // trailing blank for a clean loop gap

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, h);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let y = topPad;
  for (const c of CREDITS) {
    if (c.role) {
      ctx.fillStyle = t.inkSoft;
      ctx.font = `400 ${roleSize}px ${t.mono}`;
      drawTracked(ctx, c.role.toUpperCase(), W / 2, y, 5);
      y += roleSize * 1.5 * lineMul;
      ctx.fillStyle = t.ink;
      ctx.font = `500 ${nameSize}px ${t.primary}`;
      ctx.fillText(c.name, W / 2, y);
      y += nameSize * 1.25 * lineMul;
    } else if (c.logo) {
      // Canonical wordmark: FINBARSTUDIO in Space Mono caps + the pink asterisk.
      const tracking = 1;
      ctx.font = `700 ${logoSize}px ${t.mono}`;
      const chars = [...c.name];
      const widths = chars.map((ch) => ctx.measureText(ch).width + tracking);
      const textW = widths.reduce((a, b) => a + b, 0) - tracking;
      const astSize = logoSize * 0.66;
      const gap = logoSize * 0.2;
      const totalW = textW + gap + astSize;
      let x = W / 2 - totalW / 2;
      ctx.fillStyle = t.ink;
      const prevAlign: CanvasTextAlign = ctx.textAlign;
      ctx.textAlign = "left";
      for (let i = 0; i < chars.length; i++) {
        ctx.fillText(chars[i], x, y);
        x += widths[i];
      }
      ctx.textAlign = prevAlign;
      drawAsterisk(ctx, x + gap + astSize / 2, y - logoSize * 0.04, astSize, t.pink);
      y += logoSize * 1.3 * lineMul;
    } else if (c.big) {
      ctx.fillStyle = t.ink;
      ctx.font = `700 ${bigSize}px ${t.primary}`;
      drawTracked(ctx, c.name, W / 2, y, 2);
      y += bigSize * 1.3 * lineMul;
    } else if (isUpper(c.name)) {
      ctx.fillStyle = t.pink;
      ctx.font = `700 ${sectionSize}px ${t.mono}`;
      drawTracked(ctx, c.name, W / 2, y, 9);
      y += sectionSize * 1.3 * lineMul;
    } else {
      ctx.fillStyle = t.ink;
      ctx.font = `400 ${nameSize}px ${t.primary}`;
      ctx.fillText(c.name, W / 2, y);
      y += nameSize * 1.3 * lineMul;
    }
    y += unit * (c.gap ?? 1) * paraMul;
  }
  return canvas;
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

/** One drum, filling its parent. `phase` offsets the starting credit so stacked
    drums show different lines. */
function Drum({ phase = 0, tight = false }: { phase?: number; tight?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const scope = wrap.closest(".sb-root") ?? document.documentElement;
    const tokens = readTokens(scope);
    const win = tight ? W_TIGHT : W_NORMAL;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(tokens.bg);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

    const tex = new THREE.CanvasTexture(buildCreditsCanvas(tokens, tight));
    tex.wrapT = THREE.RepeatWrapping;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    tex.repeat.set(1, win);
    tex.offset.y = phase; // stagger which credit each drum starts on
    tex.generateMipmaps = true;
    tex.colorSpace = THREE.SRGBColorSpace;

    const visibleH = 2 * RADIUS * Math.sin(ARC / 2);
    const cnv = tex.image as HTMLCanvasElement;
    const planeW = visibleH * (cnv.width / (cnv.height * win));

    const geo = curvedPlane(planeW, 16, 220);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const baseFov = camera.fov;
    const fit = () => {
      const w = wrap.clientWidth || 1;
      const h = wrap.clientHeight || 1;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const margin = 0.78; // visible arc fills ~78% of frame height
      camera.position.set(0, 0, (visibleH / margin / 2) / Math.tan((baseFov * Math.PI) / 360));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);

    // The web fonts may still be swapping in when we first rasterise; redraw once
    // they're ready (same canvas dimensions, so no geometry change needed).
    let disposed = false;
    document.fonts?.ready?.then(() => {
      if (disposed) return;
      tex.image = buildCreditsCanvas(tokens, tight);
      tex.needsUpdate = true;
    });

    let raf = 0;
    let running = true;
    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      // Absolute-time offset so stacked drums stay in lockstep: with phases WINDOW
      // apart their visible windows are contiguous, so the same roll flows up
      // through them (off the bottom drum, onto the middle, onto the top).
      tex.offset.y = (((phase - SPEED * (now / 1000)) % 1) + 1) % 1;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => {
      const vis = e.isIntersecting;
      if (vis && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!vis) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(wrap);

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      geo.dispose();
      mat.dispose();
      tex.dispose();
      renderer.dispose();
    };
  }, [phase, tight]);

  return (
    <div className="dc-drum" ref={wrapRef}>
      <canvas ref={canvasRef} className="dc-canvas" />
    </div>
  );
}

export default function DrumCredits() {
  return (
    // Left: the full roll on a single drum. Right: the same roll across three short,
    // wide drums (large type, tight leading) with a 20px gap, the windows W_TIGHT apart
    // so it reads as one roll travelling off the bottom, onto the middle, onto the top.
    <div className="sb-fx-stage dc-split">
      <Drum phase={0} />
      <div className="dc-stack">
        <Drum phase={2 * W_TIGHT} tight />
        <Drum phase={W_TIGHT} tight />
        <Drum phase={0} tight />
      </div>
    </div>
  );
}
