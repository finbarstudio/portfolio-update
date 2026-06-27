import { forwardRef, type Ref } from "react";

/**
 * BrandWordmark — the canonical logo, used everywhere: FINBARSTUDIO (Space Mono,
 * caps, no space) with the pink asterisk on the end. The asterisk is Space Mono's
 * own `*` glyph, set as type — NOT an SVG. The inline SVG polygon threw off the
 * baseline and letter-spacing at small sizes (the footer credits); a real glyph
 * sits on the line naturally at any size. The rectangular SVG asterisk still
 * lives in brand-asterisk.ts for the favicon / OG image / animated home intro /
 * canvas effects, where it's drawn large and alignment isn't an issue.
 * Styling lives in .brand-wordmark / .brand-wordmark-star. */
const BrandWordmark = forwardRef<HTMLSpanElement, { className?: string; markRef?: Ref<HTMLSpanElement> }>(
  function BrandWordmark({ className, markRef }, ref) {
    return (
      <span ref={ref} className={`brand-wordmark ${className ?? ""}`}>
        FINBARSTUDIO
        <span ref={markRef} className="brand-wordmark-star" aria-hidden="true">*</span>
      </span>
    );
  },
);

export default BrandWordmark;
