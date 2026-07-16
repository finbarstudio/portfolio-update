import { forwardRef, type Ref } from "react";
import BrandMark from "./BrandMark";

/**
 * BrandWordmark — the canonical logo, used everywhere: FINBARSTUDIO (Host Grotesk,
 * caps, no space) with the brand asterisk on the end. The mark now carries its
 * own six-step gradient (see BrandMark), so it no longer inherits colour from
 * .brand-wordmark-mark. Styling otherwise lives in the .brand-wordmark /
 * .brand-wordmark-mark tokens. */
const BrandWordmark = forwardRef<HTMLSpanElement, { className?: string; markRef?: Ref<HTMLSpanElement> }>(
  function BrandWordmark({ className, markRef }, ref) {
    return (
      <span ref={ref} className={`brand-wordmark ${className ?? ""}`}>
        FINBARSTUDIO
        <span ref={markRef} className="brand-wordmark-mark" aria-hidden="true">
          <BrandMark className="brand-wordmark-asterisk" />
        </span>
      </span>
    );
  },
);

export default BrandWordmark;
