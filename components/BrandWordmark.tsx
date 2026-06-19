import { forwardRef, type Ref } from "react";

/**
 * BrandWordmark — the canonical logo, used everywhere: FINBARSTUDIO (Space Mono,
 * caps, no space) with the pink brand asterisk (U+1F7BE, Noto Sans Symbols 2) on
 * the end. Styling lives in the .brand-wordmark / .brand-wordmark-mark token. */
const BrandWordmark = forwardRef<HTMLSpanElement, { className?: string; markRef?: Ref<HTMLSpanElement> }>(
  function BrandWordmark({ className, markRef }, ref) {
    return (
      <span ref={ref} className={`brand-wordmark ${className ?? ""}`}>
        FINBARSTUDIO
        <span ref={markRef} className="brand-wordmark-mark" aria-hidden="true">
          {String.fromCodePoint(0x1f7be)}
        </span>
      </span>
    );
  },
);

export default BrandWordmark;
