"use client";

/**
 * Loader — skeleton placeholder + brand star spinner.
 *
 * Fills its parent (which carries the aspect ratio of the incoming media), so
 * the placeholder matches the exact geometry of the piece that's loading: a
 * soft pulse/shimmer (see `.skeleton` in globals.css) with the finbar✶studio
 * star spinner (LoaderThree) centred on top.
 *
 * `size` is retained for call-site compatibility but no longer used.
 */

import { LoaderThree } from "@/components/ui/loader";

type Props = {
  /** @deprecated retained for compatibility; skeleton fills the parent. */
  size?: number;
  /** Reserve the slot without showing the skeleton. */
  invisible?: boolean;
  className?: string;
  /** Hide the centred star spinner (skeleton-only). */
  hideSpinner?: boolean;
  /** Transparent: just the star, no skeleton box. For transparent 3D thumbnails
   *  + detail-page models, where the page must show through while it loads. */
  bare?: boolean;
};

export default function Loader({ invisible = false, className, hideSpinner = false, bare = false }: Props) {
  if (invisible) return null;
  // Bare: only the star spinner, on a transparent ground (no opaque skeleton).
  if (bare) return hideSpinner ? null : <LoaderThree />;
  // Star renders as a SIBLING of the skeleton (not a child) so the skeleton's
  // opacity pulse doesn't dim the spinner — only the placeholder breathes.
  return (
    <>
      <div className={`skeleton ${className ?? ""}`} aria-hidden="true" />
      {!hideSpinner && <LoaderThree />}
    </>
  );
}
