"use client";

/**
 * Loader — skeleton placeholder.
 *
 * Fills its parent (which carries the aspect ratio of the incoming media),
 * so the placeholder matches the exact geometry of the piece that's loading.
 * Soft pulse + slow shimmer sweep. See `.skeleton` in globals.css.
 *
 * `size` is retained for call-site compatibility but no longer used.
 */

type Props = {
  /** @deprecated retained for compatibility; skeleton fills the parent. */
  size?: number;
  /** Reserve the slot without showing the skeleton. */
  invisible?: boolean;
  className?: string;
};

export default function Loader({ invisible = false, className }: Props) {
  if (invisible) return null;
  return <div className={`skeleton ${className ?? ""}`} aria-hidden="true" />;
}
