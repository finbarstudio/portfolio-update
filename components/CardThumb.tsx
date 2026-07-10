/**
 * CardThumb — the project thumbnail shell. At rest it's invisible (transparent,
 * no outline); on hover the hairline border quietly tints (see .card-thumb in
 * globals.css). The media (.card-media, 3D mockups) sits on top, unchanged.
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
      <div className="card-media">{children}</div>
    </div>
  );
}
