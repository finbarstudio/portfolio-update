"use client";

/**
 * AlbumThumb — the Joe Devine card thumbnail. On a hover-capable desktop it's
 * the interactive 3D AlbumRow; on touch / small screens it's a static 4-cover
 * grid (no WebGL — lighter and no hover glitches).
 */

import { useEffect, useState } from "react";
import AlbumRow from "./AlbumRow";

export default function AlbumThumb({ images }: { images: string[] }) {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (min-width: 768px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (desktop) return <AlbumRow images={images} fill />;

  return (
    <div className="album-grid" aria-hidden="true">
      {images.slice(0, 4).map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt="" loading="lazy" />
      ))}
    </div>
  );
}
