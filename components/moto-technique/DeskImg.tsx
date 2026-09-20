import type { CSSProperties } from "react";

/** A 1x1 transparent GIF: something to hand a browser that must not fetch the real file. */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/**
 * A photograph that only the desktop page shows.
 *
 * On a phone the desktop sections are hidden and the phone page (MobileHome)
 * shows its own, smaller cuts. But hiding an element with CSS does not reliably
 * stop an image inside it from downloading, so a phone was fetching megabytes
 * of full-size photographs it never displayed. A <source> is chosen BEFORE
 * anything is requested: at phone widths the browser takes the blank below and
 * never asks for the real file. Keep the width in step with PHONE in phone.ts.
 *
 * <picture> is given `display: contents` by the stylesheet, so it leaves no box
 * of its own and the <img> lays out exactly as if it were not wrapped.
 */
export default function DeskImg({
  src,
  alt,
  className,
  style,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** Load with the page at low priority, instead of lazily. See DinoStory. */
  eager?: boolean;
}) {
  return (
    <picture className="mt-deskimg">
      <source media="(max-width: 760px)" srcSet={BLANK} />
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "low" : undefined}
        decoding="async"
      />
    </picture>
  );
}
