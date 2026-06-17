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
            opacity: 0.3,
            fontWeight: 700,
            fontSize: "clamp(22px, 11vw, 110px)",
            color: "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            letterSpacing: "0.01em",
            textShadow: "0 2px 10px rgba(0,0,0,0.18)",
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
          font: "11px ui-monospace, 'Space Mono', Menlo, monospace",
          color: "rgba(20,20,20,0.62)",
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(4px)",
          padding: "3px 8px",
          borderRadius: 6,
          textDecoration: "none",
          letterSpacing: "0.02em",
        }}
      >
        finbar.studio
      </a>
    </>
  );
}
