"use client";

import { useRef, useEffect, useState } from "react";
import Loader from "./Loader";

// Looping muted video, plays only while visible in the viewport.
// Uses IntersectionObserver instead of autoPlay so off-screen videos
// don't buffer memory. preload="metadata" fetches just enough to start
// quickly without pulling the full file.
//
// While buffering: the brand loader over a plain grey box — never over a
// poster image (a still behind the pulsing mark read as "loaded but frozen").
export default function VideoPlayer({
  src,
  className = "",
  style,
  onReady,
  eager,
}: {
  src: string;
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
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        // The empty loading frame: ink at 8% reads as a quiet grey on the cream.
        background: ready ? "transparent" : "rgba(33, 30, 26, 0.08)",
      }}
    >
      {!ready && <Loader bare />}
      <video
        ref={ref}
        src={src}
        loop
        muted
        playsInline
        preload={eager ? "auto" : "metadata"}
        // Ready = actually PLAYING, not just first-frame-loaded: on slow
        // fetches the frame used to sit there looking frozen with no
        // indicator while the file buffered. The loader stays up until
        // frames are really moving.
        onPlaying={() => { setReady(true); onReady?.(); }}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          background: "transparent",
          display: "block",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.3s ease",
          ...style,
        }}
      />
    </div>
  );
}
