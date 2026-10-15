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

// Material Symbols "info" (outlined) — the little explainer affordance
// (used on /pricing rows for the why-this-price tooltips).
export function MdInfoOutline(props: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <Base
      path="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      {...props}
    />
  );
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

export function MdVolumeUp(props: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Base path="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" {...props} />;
}

export function MdVolumeOff(props: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Base path="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" {...props} />;
}

export function MdSwipe(props: { size?: number } & SVGProps<SVGSVGElement>) {
  return <Base path="M18.89 14.75l-4.09-2.04c-.28-.14-.58-.21-.89-.21H13v-6c0-.83-.67-1.5-1.5-1.5S10 5.67 10 6.5v10.74l-3.25-.68c-.33-.07-.68.03-.92.28l-.83.84 4.54 4.79c.38.39.9.53 1.43.53h6.1c1 0 1.84-.73 1.98-1.72l.63-4.47c.12-.85-.32-1.69-1.09-2.06zM20.13 3.87C18.69 2.17 15.6 1 12 1S5.31 2.17 3.87 3.87L2 2v5h5L4.93 4.93c1-1.29 3.7-2.43 7.07-2.43s6.07 1.14 7.07 2.43L17 7h5V2l-1.87 1.87z" {...props} />;
}
