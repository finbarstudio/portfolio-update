"use client";

import { useId } from "react";
import { STACK_PATHS, STACK_VIEWBOX, STACK_GRADIENT } from "./brand-wordmark-stacked";

/**
 * BrandWordmarkStacked — FINBARSTUDIO as a 3x4 block (FIN / BAR / STU / DIO),
 * dark at the top fading to the main pink at the bottom. The small, dense
 * companion to BrandMark: it reads as a logo at sizes where the full lockup
 * would be a smear, which is why it's the sandbox link's mark.
 *
 * Like BrandMark it carries its own colours and ignores `currentColor` — the
 * gradient IS the mark.
 *
 * Sizes off its box, not its font-size (unlike BrandMark's 1em square): the
 * block is wider than it is tall (531:427), so give it a height and let the
 * width follow.
 *
 * Client-only because the gradient needs a document-unique id. Two of these
 * render inside FooterNav (the placeholder and the pin), and a shared literal
 * id would be a duplicate-id document, with every instance resolving to
 * whichever <defs> the browser saw first.
 */
export default function BrandWordmarkStacked({
  className = "",
  title,
}: {
  className?: string;
  /** Give it a title only when the mark stands alone as the logo. */
  title?: string;
}) {
  // useId's own format is not url(#...)-safe (React 18 wraps in colons, 19 in
  // guillemets), so keep only the characters an id can rely on.
  const gid = `fs-stack-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg
      viewBox={STACK_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient
          id={gid}
          x1={STACK_GRADIENT.x1}
          y1={STACK_GRADIENT.y1}
          x2={STACK_GRADIENT.x2}
          y2={STACK_GRADIENT.y2}
          gradientUnits="userSpaceOnUse"
        >
          {STACK_GRADIENT.stops.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      {STACK_PATHS.map((d, i) => (
        <path key={i} d={d} fill={`url(#${gid})`} />
      ))}
    </svg>
  );
}
