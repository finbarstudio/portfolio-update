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

export function MdOpenInNew(props: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <Base
      path="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
      {...props}
    />
  );
}
