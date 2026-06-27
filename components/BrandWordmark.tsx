import { forwardRef, type Ref } from "react";
import { ASTERISK_POINTS } from "./brand-asterisk";

/**
 * BrandWordmark — the canonical logo, used everywhere: FINBARSTUDIO (Space Mono,
 * caps, no space) with the pink brand asterisk (SVG polygon) on the end.
 * Styling lives in the .brand-wordmark / .brand-wordmark-mark token. */
const BrandWordmark = forwardRef<HTMLSpanElement, { className?: string; markRef?: Ref<HTMLSpanElement> }>(
  function BrandWordmark({ className, markRef }, ref) {
    return (
      <span ref={ref} className={`brand-wordmark ${className ?? ""}`}>
        FINBARSTUDIO
        <span ref={markRef} className="brand-wordmark-mark" aria-hidden="true">
          <svg viewBox="0 0 100 100" className="brand-wordmark-asterisk">
            <polygon points={ASTERISK_POINTS} fill="currentColor" />
          </svg>
        </span>
      </span>
    );
  },
);

export default BrandWordmark;
