"use client";

/**
 * AlbumShowcase — a slow horizontal marquee of the album covers. Covers scroll
 * continuously, multiple in view at once, with edge-faded mask so they melt
 * into the page. Pauses on hover; per-cover hover lift for detail. The list is
 * doubled so the loop is seamless.
 */

import ClientImage from "./ClientImage";

type Img = { src: string; alt: string };

export default function AlbumShowcase({ images }: { images: Img[] }) {
  // Double the list so translateX(-50%) lands the second copy exactly where the
  // first started — seamless infinite loop with pure CSS.
  const loop = [...images, ...images];
  return (
    <div className="album-marquee" aria-label="Album cover showcase">
      <div className="album-track">
        {loop.map((img, i) => (
          <div key={i} className="album-card" aria-hidden={i >= images.length}>
            <ClientImage
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 70vw, 42vh"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {/* Touch-only swipe hint. */}
      <div className="album-swipe-hint" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M10 4 6 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span>Swipe</span>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}
