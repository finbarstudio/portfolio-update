"use client";

/**
 * EmbedMac — the chromeless Studio Display mockup rendered inside `/embed/mac`.
 * Same engine and behaviour as the portfolio Mac thumbnails: a `flat` preset
 * renders front-on; otherwise it rests at the isometric angle and eases flat on
 * hover. A gentle turntable + screen cycle keep it alive.
 *
 * Watermark is forced on as a DOM overlay: a wordmark + a real, clickable backlink
 * to finbar.studio. Falls back to the public demo screens when no embeddable media
 * was supplied.
 */

import dynamic from "next/dynamic";
import { useMemo } from "react";

import type { MacMediaItem } from "@/components/mac/mac-config";
import { MAC_DEMO_MEDIA } from "@/lib/sandbox/media";
import { aspectToCss, type EmbedConfig } from "@/lib/sandbox/embed-config";

const MacScene = dynamic(() => import("@/components/mac/MacScene"), { ssr: false });

export default function EmbedMac({ config }: { config: EmbedConfig }) {
  const media: MacMediaItem[] = useMemo(() => {
    if (config.media.length > 0) return config.media.map((m) => ({ kind: m.kind, src: m.src }));
    return MAC_DEMO_MEDIA.map((m) => ({ kind: m.kind, src: m.src }));
  }, [config.media]);

  const hoverable = config.preset !== "flat";
  const presetOverride = config.preset === "flat" ? "flat" : undefined;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: config.background === "transparent" ? "transparent" : config.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", height: "100%", aspectRatio: aspectToCss(config.aspect), maxWidth: "100%", maxHeight: "100%" }}>
        <MacScene
          media={media}
          presetOverride={presetOverride}
          fit={config.fit}
          background={config.background}
          fill
          hoverable={hoverable}
          immediate
        />
      </div>

      {/* Forced watermark: wordmark + clickable backlink. */}
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
    </div>
  );
}
