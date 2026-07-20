/**
 * Material (Design) icons as inline SVG. Finbar prefers Material UI iconography,
 * but this is a Tailwind/CSS site with no MUI — pulling @mui/icons-material (and
 * its @mui/material + emotion peers) in for a couple of glyphs isn't worth the
 * bundle. These are the official Material Symbols paths (Apache-2.0), inlined so
 * they inherit currentColor and add nothing to the dependency tree. Add more
 * paths here as needed.
 */
import type { SVGProps } from "react";

function Base({ path, size = 20, ...rest }: { path: string; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={path} />
    </svg>
  );
}

export function MdArrowForward(props: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Base path="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" {...props} />;
}

// Material Symbols "ads_click" — a cursor with radiating click marks. THE click
// affordance glyph (used on the "Free website" CTA pill).
export function MdAdsClick(props: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <Base
      path="M11.71 17.99C8.53 17.84 6 15.22 6 12c0-3.31 2.69-6 6-6 3.22 0 5.84 2.53 5.99 5.71l-2.1-.63C15.48 9.31 13.89 8 12 8c-2.21 0-4 1.79-4 4 0 1.89 1.31 3.48 3.06 3.89l.65 2.1zM22 12c0 .3-.01.6-.04.9l-1.97-.59c.01-.1.01-.21.01-.31 0-4.42-3.58-8-8-8s-8 3.58-8 8 3.58 8 8 8c.1 0 .21 0 .31-.01l.59 1.97c-.3.03-.6.04-.9.04-5.52 0-10-4.48-10-10S6.48 2 12 2s10 4.48 10 10zm-3.77 4.26L22 15l-10-3 3 10 1.26-3.77 4.27 4.27 1.98-1.98-4.28-4.26z"
      {...props}
    />
  );
}

export function MdOpenInNew(props: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <Base
      path="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
      {...props}
    />
  );
}

export function MdArrowBack(props: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Base path="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" {...props} />;
}

export function MdArrowOutward(props: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Base path="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z" {...props} />;
}

export function MdArrowUpward(props: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Base path="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z" {...props} />;
}

export function MdArrowDownward(props: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Base path="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z" {...props} />;
}
