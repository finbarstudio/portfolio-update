"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// OJ Pippin homes — width fixed, height derived so nothing is cropped.
const W = 220;
const POOL = [
  { src: "/oj-pippin/homes/design-thames.jpg", r: 2048 / 1152 },
  { src: "/oj-pippin/homes/interior-living.jpg", r: 2048 / 1365 },
  { src: "/oj-pippin/homes/facade-monaco.jpg", r: 2048 / 1282 },
  { src: "/oj-pippin/homes/design-willow.jpg", r: 2200 / 1238 },
  { src: "/oj-pippin/homes/interior-kitchen.jpg", r: 1536 / 1025 },
  { src: "/oj-pippin/homes/design-shelby.jpg", r: 2200 / 1650 },
  { src: "/oj-pippin/homes/photo-real.jpg", r: 2000 / 1334 },
  { src: "/oj-pippin/homes/design-ava.jpg", r: 2200 / 1702 },
];

export default function ImageTrail({ children }: { children?: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const imgs = Array.from(root.querySelectorAll<HTMLImageElement>(".trail-img"));
    let last = { x: 0, y: 0 };
    let idx = 0;
    let z = 1;
    const threshold = 60;
    const zonePad = 30;
    let primed = false;

    const show = (el: HTMLImageElement, x: number, y: number) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      gsap.killTweensOf(el);
      gsap.set(el, { x: x - w / 2, y: y - h / 2, zIndex: 1 + (z++ % 8) });
      gsap
        .timeline()
        .fromTo(el, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" })
        .to(el, { opacity: 0, scale: 1.04, duration: 0.7, ease: "power2.in" }, 0.45);
    };

    const zone = root.querySelector<HTMLElement>("[data-trail-zone]");

    const onMove = (e: PointerEvent) => {
      const zr = (zone ?? root).getBoundingClientRect();
      const inside =
        e.clientX >= zr.left - zonePad &&
        e.clientX <= zr.right + zonePad &&
        e.clientY >= zr.top - zonePad &&
        e.clientY <= zr.bottom + zonePad;
      if (!inside) {
        primed = false;
        return;
      }
      const rect = root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!primed) {
        last = { x, y };
        primed = true;
        return;
      }
      const dist = Math.hypot(x - last.x, y - last.y);
      if (dist > threshold) {
        last = { x, y };
        show(imgs[idx % imgs.length], x, y);
        idx++;
      }
    };

    root.addEventListener("pointermove", onMove);
    return () => root.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden">
      {POOL.map((p, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={p.src}
          alt=""
          aria-hidden
          className="trail-img absolute top-0 left-0 will-change-transform pointer-events-none opacity-0 object-cover"
          style={{ width: W, height: Math.round(W / p.r) }}
        />
      ))}
      {children}
    </div>
  );
}
