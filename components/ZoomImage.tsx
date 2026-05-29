/**
 * ZoomImage — a static card thumbnail that zooms in when its parent card is
 * hovered. Driven purely by the card's `.group:hover` state in CSS (see
 * `.card-zoom-inner` in globals.css), so it shares the exact same hover state
 * as the card border/elevation — one hover, both effects. No pointer tracking.
 *
 * Must be placed inside a positioned, overflow-hidden `.card-thumb`.
 */

import ClientImage from "./ClientImage";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export default function ZoomImage({ src, alt, sizes, priority, className }: Props) {
  return (
    <div className="card-zoom-inner" style={{ position: "absolute", inset: 0 }}>
      <ClientImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    </div>
  );
}
