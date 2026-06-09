"use client";

import { useRef, useEffect, useState } from "react";
import Loader from "./Loader";

// Looping muted video, plays only while visible in the viewport.
// Uses IntersectionObserver instead of autoPlay so off-screen videos
// don't buffer memory. preload="metadata" fetches just enough for
// the poster frame without pulling the full file.
export default function VideoPlayer({
  src,
  poster,
  className = "",
  style,
  onReady,
  eager,
}: {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  onReady?: () => void;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {!ready && <Loader size={24} />}
      <video
        ref={ref}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        preload={eager ? "auto" : "metadata"}
        onLoadedData={() => { setReady(true); onReady?.(); }}
        className={className}
        style={{ width: "100%", height: "100%", objectFit: "contain", background: "white", display: "block", ...style }}
      />
    </div>
  );
}
