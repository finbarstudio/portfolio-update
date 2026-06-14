/**
 * CardThumb — the project thumbnail shell. At rest it's invisible (white card,
 * no outline). On hover (tap on touch) a reveal grows horizontally from the
 * centre behind the media as THREE staggered colour channels (teal → pink →
 * light pink), giving a chromatic, channel-offset reveal, and the card outline
 * turns pink. The media (.card-media, 3D mockups) stays on top, unchanged.
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
      <span className="card-reveal" aria-hidden="true">
        <span className="card-rev c1" />
        <span className="card-rev c2" />
        <span className="card-rev c3" />
      </span>
      <div className="card-media">{children}</div>
    </div>
  );
}
