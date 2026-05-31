"use client";

/**
 * AlbumShowcase — an editorial display of square cover artwork. Each cover sits
 * on its own row at a different width and offset, so they read as a deliberate
 * composition rather than a uniform grid. No captions or text. Subtle hover
 * lift on each tile. Falls back to a single-column stack on mobile (and for any
 * count other than 5).
 */

import ClientImage from "./ClientImage";

type Img = { src: string; alt: string };

export default function AlbumShowcase({ images }: { images: Img[] }) {
  return (
    <div className="album-showcase">
      {images.map((img, i) => (
        <div key={img.src} className={`album-tile album-tile-${i + 1}`}>
          <ClientImage
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
