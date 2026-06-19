import { forwardRef, type Ref } from "react";

/**
 * BrandWordmark — the canonical logo, used everywhere: FINBARSTUDIO (Space Mono,
 * caps, no space) with a pink ❘ (U+2758, Noto Sans Symbols 2) butted on the end.
 * Styling lives in the .brand-wordmark / .brand-wordmark-mark token (globals).
 */
const BrandWordmark = forwardRef<HTMLSpanElement, { className?: string; markRef?: Ref<HTMLSpanElement> }>(
  function BrandWordmark({ className, markRef }, ref) {
    return (
      <span ref={ref} className={`brand-wordmark ${className ?? ""}`}>
        FINBARSTUDIO
        <span ref={markRef} className="brand-wordmark-mark" aria-hidden="true">
          {"❘"}
        </span>
      </span>
    );
  },
);

export default BrandWordmark;
