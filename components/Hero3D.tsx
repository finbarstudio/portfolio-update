"use client";

// interactive={false} disables pointer events so the iframe doesn't swallow
// clicks when embedded inside a card Link (home page featured card).
// interactive={true} (default) enables full mouse-parallax on the case study page.

export default function Hero3D({
  src,
  interactive = true,
}: {
  src: string;
  interactive?: boolean;
}) {
  return (
    <div
      className="w-full"
      style={{ aspectRatio: "16/9", maxHeight: "72vh", position: "relative" }}
    >
      <iframe
        src={src}
        title="3D hero"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
          pointerEvents: interactive ? "auto" : "none",
        }}
        loading="lazy"
      />
    </div>
  );
}
