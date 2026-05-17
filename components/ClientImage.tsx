"use client";

// Wraps next/image with an onError handler so broken/missing images
// disappear cleanly instead of showing the browser's broken-image icon.
// The parent .img-wrap has background-color: var(--line) so a grey box
// shows automatically when the image fails or hasn't been uploaded yet.

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export default function ClientImage({ src, alt, fill, sizes, priority, className }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
