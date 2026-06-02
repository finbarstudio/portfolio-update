"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGroupHover } from "./useGroupHover";

/* ── Tunables ──────────────────────────────────────────── */
const CARD_W = 0.28;    // card width as fraction of container
const GAP    = 0.05;    // gap between cards (fraction of container)
const S_MIN  = 0.78;    // scale at far edges
const S_MAX  = 1.06;    // scale at center
const TILT   = 0.03;    // rotateY degrees per px from center (3D depth)
const SPEED  = 0.032;   // scroll px per ms

type Props = { images: string[]; aspectRatio?: string; fill?: boolean; sizes?: string };

/**
 * HeroSlideshow — continuous right-to-left cover carousel.
 * All images visible at once; center card scales up with smoothstep easing.
 * Subtle perspective tilt + white gradient masks on edges.
 */
export default function HeroSlideshow({ images, aspectRatio = "3/2", fill = false, sizes }: Props) {
  const { ref: containerRef, hovered } = useGroupHover<HTMLDivElement>(true);
  const offsetRef    = useRef(0);
  const lastTRef     = useRef<number | null>(null);
  const rafRef       = useRef<number>(0);

  // Triple the images so there are always cards filling the viewport during loop
  const tiles = [...images, ...images, ...images];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-c]"));

    let inited = false;

    const tick = (now: number) => {
      const cw     = el.offsetWidth;
      const cardW  = cw * CARD_W;
      const stride = cardW + cw * GAP;
      const loopW  = stride * images.length;

      // On first valid frame, centre the middle card of the first set
      if (!inited && cw > 0) {
        const k = Math.floor(images.length / 2);
        offsetRef.current = k * stride - cw / 2 + cardW / 2;
        inited = true;
      }

      const dt = lastTRef.current !== null ? now - lastTRef.current : 0;
      lastTRef.current = now;

      offsetRef.current += SPEED * dt;
      // Seamless loop: when we've scrolled 2 full sets, step back one set
      if (offsetRef.current >= loopW * 2) offsetRef.current -= loopW;

      const cx = cw / 2;

      cards.forEach((card, i) => {
        const x  = i * stride - offsetRef.current;   // card left edge
        const cX = x + cardW / 2;                     // card centre x
        const d  = Math.abs(cX - cx);
        const n  = Math.max(0, 1 - d / (cw * 0.52)); // normalised proximity
        const e  = n * n * (3 - 2 * n);               // smoothstep
        const sc = S_MIN + e * (S_MAX - S_MIN);
        const ry = (cX - cx) * TILT;                  // perspective tilt

        card.style.transform = `translateX(${x}px) translateY(-50%) perspective(1200px) rotateY(${-ry}deg) scale(${sc})`;
        card.style.zIndex    = String(Math.round(e * 10));
        card.style.opacity   = String(0.5 + e * 0.5);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTRef.current = null;
    };
  }, [images.length]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        ...(fill ? { height: "100%" } : { aspectRatio }),
        overflow: "hidden",
        background: "var(--color-bg, #FAFAF8)",
      }}
    >
      {/* Soft pink wash on hover, behind the cards */}
      <div className="mockup-pink-bg" aria-hidden="true" style={{ opacity: hovered ? 1 : 0 }} />

      {tiles.map((src, i) => (
        <div
          key={`${i}-${src}`}
          data-c=""
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: `${CARD_W * 100}%`,
            aspectRatio: "3/4",
            transformOrigin: "center center",
            willChange: "transform, opacity",
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            style={{ objectFit: "contain" }}
            sizes={sizes ?? "(max-width: 640px) 100vw, 30vw"}
          />
        </div>
      ))}

    </div>
  );
}
