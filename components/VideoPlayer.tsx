"use client";

// Looping muted autoplay video — used for case study hero and gallery images.
// Gracefully degrades: if video fails, poster image shows.
export default function VideoPlayer({
  src,
  poster,
  className = "",
  style,
}: {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      className={className}
      style={{ width: "100%", height: "100%", objectFit: "contain", background: "white", display: "block", ...style }}
    />
  );
}
