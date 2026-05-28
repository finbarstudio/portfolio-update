"use client";

/**
 * ParallaxImage — gives a flat thumbnail the same "comes alive on hover" feel
 * as the 3D mockups. On pointer move it tilts in 3D toward the cursor and zooms
 * in slightly; on leave it eases back to flat. A generous overscan (scale) means
 * the tilt never reveals the card's background behind the corners.
 *
 * Pointer-driven only (no effect on touch / no-hover devices, where the image
 * simply renders static). Respects prefers-reduced-motion.
 */

import { useCallback, useRef, useState } from "react";
import ClientImage from "./ClientImage";

const MAX_TILT = 6;     // degrees of rotation at the edges
const HOVER_SCALE = 1.12; // overscan so tilt never exposes card background

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export default function ParallaxImage({ src, alt, sizes, priority, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>("");

  const handleMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 … 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(1000px) rotateX(${(-py * MAX_TILT).toFixed(2)}deg) ` +
      `rotateY(${(px * MAX_TILT).toFixed(2)}deg) scale(${HOVER_SCALE})`
    );
  }, []);

  const reset = useCallback(() => setTransform(""), []);

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <div
        className="parallax-inner"
        style={{
          position: "absolute",
          inset: 0,
          transform,
          transition: "transform 0.3s var(--ease, ease-out)",
          willChange: "transform",
        }}
      >
        <ClientImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={className}
        />
      </div>
    </div>
  );
}
