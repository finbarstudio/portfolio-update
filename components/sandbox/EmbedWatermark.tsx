import BrandStar from "@/components/BrandStar";

/**
 * The forced watermark for live embeds: a large, centred finbar✶studio wordmark
 * at ~30% opacity (the real brand star, not a glyph) plus a subtle clickable
 * finbar.studio backlink in the bottom-right. Mirrors the export watermark.
 */
export default function EmbedWatermark() {
  return (
    <>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            opacity: 0.05,
            fontWeight: 700,
            fontSize: "clamp(22px, 11vw, 110px)",
            color: "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            letterSpacing: "0.01em",
          }}
        >
          finbar
          <BrandStar size="0.78em" style={{ color: "#E8718B", margin: "0 0.06em" }} />
          studio
        </span>
      </div>

      <a
        href="https://www.finbar.studio"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          right: 10,
          bottom: 8,
          font: "700 11px ui-monospace, 'Space Mono', Menlo, monospace",
          color: "#ffffff",
          textDecoration: "none",
          letterSpacing: "0.02em",
          // Legible on white (dark text-stroke) and on black (harsh shadow).
          WebkitTextStroke: "0.4px rgba(0,0,0,0.55)",
          textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.9)",
        }}
      >
        finbar.studio
      </a>
    </>
  );
}
