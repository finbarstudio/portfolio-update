import BrandMark from "@/components/BrandMark";

/**
 * WebWordmark — web.finbar's own logo: WEBFINBAR in the studio's wordmark
 * lockup (same Host Grotesk caps and the asterisk mark, via the shared
 * .brand-wordmark tokens), read through the section's greyscale filter.
 */
export default function WebWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-wordmark wf-wordmark ${className}`}>
      WEBFINBAR
      <span className="brand-wordmark-mark" aria-hidden="true">
        <BrandMark className="brand-wordmark-asterisk" />
      </span>
    </span>
  );
}
