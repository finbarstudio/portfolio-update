"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOGO_PATH, LOGO_TRACE_TRANSFORM, LOGO_W, LOGO_H } from "@/components/qldpools/logoPath";

/**
 * Logo-cutout preloader — ported from the Lows keyhole entrance.
 *
 * A white curtain covers the page from the first paint. The QPI logo (wave +
 * wordmark, traced to a single SVG path) fades in as a see-through CUT in the
 * curtain, so the hero image shows through the logo shape. After a beat the
 * whole cut zooms into the thick of the bottom wave sweep until the viewport
 * is inside it and the hero is fully revealed. Dispatches `qpi:intro-done`
 * (SmoothScroll unlocks, Nav slides in, hero text staggers up).
 *
 * Plays once per real document load (module flag survives client-side nav).
 * Reduced motion skips straight to the page. Fail-open: a timeout tears the
 * curtain down even if rAF stalls.
 */

// Logo-space geometry (605 × 412 viewBox): centre of the mark, the zoom anchor
// inside the solid bottom wave sweep, and that sweep's rough thickness.
const CX = LOGO_W / 2,
  CY = LOGO_H / 2,
  ANCHOR_X = 300,
  ANCHOR_Y = 335,
  FEATURE = 55;

// timeline (ms): cut fades in on white → hold → zoom through the cut.
const APPEAR = 900,
  HOLD = 450,
  REVEAL = 1150;
const revealStart = APPEAR + HOLD;
const endAll = revealStart + REVEAL + 40;

// Claimed this document load? Module scope resets on a real reload only.
let started = false;

export default function Preloader() {
  const pathname = usePathname();

  // Decide once, during render (server + client agree), so the curtain is in
  // the server HTML and covers from the very first paint.
  const [play] = useState(() => pathname === "/qldpools/site" && !started);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!play || hidden) return;
    started = true;
    const root = rootRef.current;
    if (!root) return;

    const finish = () => {
      setHidden(true);
      const w = window as unknown as { __qpiPreloaderLifted?: boolean };
      if (w.__qpiPreloaderLifted) return;
      w.__qpiPreloaderLifted = true;
      window.dispatchEvent(new Event("qpi:intro-done"));
    };

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(finish, 0);
      return () => window.clearTimeout(id);
    }

    const aperture = root.querySelector<SVGGElement>(".qpi-pl-aperture");
    const cut = root.querySelector<SVGPathElement>(".qpi-pl-cut");
    if (!aperture || !cut) return;

    const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
    const easeInOutCubic = (x: number) =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let W = 0,
      H = 0,
      baseScale = 1,
      endScale = 40,
      anchorScreenX = 0,
      anchorScreenY = 0;

    // Shared transform: at rp=0 it's the logo centred at base size; as rp→1 the
    // cut scales exponentially (natural dolly) while the anchor pans to centre.
    const xf = (rp: number, settle: number) => {
      const e = easeInOutCubic(rp);
      const s = baseScale * (1.05 - 0.05 * settle) * Math.pow(endScale / baseScale, e);
      const px = lerp(anchorScreenX, W / 2, e);
      const py = lerp(anchorScreenY, H / 2, e);
      const ox = lerp(CX, ANCHOR_X, e === 0 ? 0 : 1);
      const oy = lerp(CY, ANCHOR_Y, e === 0 ? 0 : 1);
      // Before the zoom starts, pivot on the logo centre; once it starts, pivot
      // on the anchor. The two transforms coincide at rp=0 by construction.
      if (rp === 0) {
        return `translate(${(W / 2).toFixed(2)} ${(H / 2).toFixed(2)}) scale(${s.toFixed(4)}) translate(${-CX} ${-CY})`;
      }
      return `translate(${px.toFixed(2)} ${py.toFixed(2)}) scale(${s.toFixed(4)}) translate(${-ox} ${-oy})`;
    };

    const layout = () => {
      const r = root.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      const desiredPx = clamp(Math.min(W, H) * 0.52, 240, 520);
      baseScale = desiredPx / LOGO_W;
      endScale = (1.5 * Math.max(W, H)) / FEATURE; // viewport well inside the sweep
      anchorScreenX = W / 2 + (ANCHOR_X - CX) * baseScale;
      anchorScreenY = H / 2 + (ANCHOR_Y - CY) * baseScale;
    };

    const render = (t: number) => {
      const ap = clamp(t / APPEAR, 0, 1);
      const rp = clamp((t - revealStart) / REVEAL, 0, 1);
      cut.setAttribute("fill-opacity", easeOutCubic(ap).toFixed(3));
      aperture.setAttribute("transform", xf(rp, easeOutCubic(ap)));
    };

    let raf = 0;
    let cancelled = false;
    const start = () => {
      const t0 = performance.now();
      const frame = (now: number) => {
        const t = now - t0;
        render(t);
        if (t >= endAll) {
          finish();
          return;
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(layout);
    ro.observe(root);
    layout();
    render(0); // settle the masked curtain before the first tick
    // the SVG curtain is settled — drop the opaque backdrop so the cut can see
    // through to the hero
    root.style.background = "transparent";

    // Don't open the cut onto a blank frame: hold the plain white curtain until
    // the hero <img> has decoded (its base64 blur paints instantly underneath,
    // so even the timeout path shows the sunset colours, just softer). Capped
    // wait so a slow connection can't stall the entrance.
    const heroImg = document.querySelector<HTMLImageElement>("img[data-qpi-hero]");
    const decoded =
      heroImg && !heroImg.complete
        ? heroImg.decode().catch(() => {})
        : Promise.resolve();
    const capped = new Promise<void>((r) => {
      window.setTimeout(r, 1800);
    });
    Promise.race([decoded, capped]).then(() => {
      if (cancelled) return;
      start();
    });

    // Absolute fail-safe: curtain always comes down, decode wait included.
    const failsafe = window.setTimeout(finish, endAll + 2800);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [play, hidden]);

  if (!play || hidden) return null;

  return (
    // Covering styles inline so the curtain holds from the first paint, before
    // any stylesheet applies. Pure white to match the demo's ground.
    <div
      className="qpi-preloader"
      ref={rootRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 80, background: "#ffffff" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          {/* white rect = curtain shows; the logo (black) is the see-through cut */}
          <mask id="qpi-pl-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
            <g className="qpi-pl-aperture">
              <g transform={LOGO_TRACE_TRANSFORM}>
                <path className="qpi-pl-cut" d={LOGO_PATH} fill="#000" fillOpacity={0} />
              </g>
            </g>
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" mask="url(#qpi-pl-mask)" />
      </svg>
    </div>
  );
}
