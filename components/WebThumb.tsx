"use client";

/**
 * WebThumb — a full-bleed website preview still (the same homepage screenshot
 * the home page shows for each site), used as the /work card thumbnail for web
 * projects. Fills the CardThumb, cover-cropped.
 */

export default function WebThumb({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}
