/**
 * CardThumb — the thumbnail shell for project cards, in the new sticker style:
 * a white card with a 1px outline by default. On hover a coloured panel reveals
 * from the centre outward (grey → pink) with a pink outline drawing in, sitting
 * BEHIND the media (the 3D mockups stay on top, unchanged). For 3D thumbnails
 * the canvas is transparent so the reveal shows around the model; static images
 * fill the card, so they just get the white card + outline.
 */

import type { CSSProperties, ReactNode } from "react";

export default function CardThumb({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`card-thumb ${className ?? ""}`} style={style}>
      <span className="card-reveal" aria-hidden="true" />
      <div className="card-media">{children}</div>
    </div>
  );
}
