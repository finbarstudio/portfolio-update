"use client";

/**
 * ScrollThumb — a full-bleed looping scroll capture of the live site, used as
 * the card/thumbnail for web projects (the same clips the home featured grid
 * and case-study mac screens use). Autoplays muted, fills the CardThumb.
 */

export default function ScrollThumb({ src }: { src: string }) {
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}
