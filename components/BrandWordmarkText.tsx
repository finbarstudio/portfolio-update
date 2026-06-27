import { forwardRef, type Ref } from "react";

/**
 * BrandWordmarkText — the finbar studio wordmark with the asterisk set as Space
 * Mono's own `*` glyph (type), NOT an SVG. Used for the small "Concept site by"
 * credits in the demo-site footers (A Rolley / Braeden / Lindon / OJ Pippin),
 * where the inline SVG asterisk threw off the baseline + letter-spacing at the
 * ~9-11px credit size. The main site keeps `BrandWordmark` (the rectangular SVG
 * asterisk) — don't swap that one. Styling: .brand-wordmark / .brand-wordmark-star. */
const BrandWordmarkText = forwardRef<HTMLSpanElement, { className?: string; markRef?: Ref<HTMLSpanElement> }>(
  function BrandWordmarkText({ className, markRef }, ref) {
    return (
      <span ref={ref} className={`brand-wordmark ${className ?? ""}`}>
        FINBARSTUDIO
        <span ref={markRef} className="brand-wordmark-star" aria-hidden="true">*</span>
      </span>
    );
  },
);

export default BrandWordmarkText;
