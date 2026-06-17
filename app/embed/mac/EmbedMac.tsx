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
import EmbedWatermark from "@/components/sandbox/EmbedWatermark";

const MacScene = dynamic(() => import("@/components/mac/MacScene"), { ssr: false });

export default function EmbedMac({ config }: { config: EmbedConfig }) {
  const media: MacMediaItem[] = useMemo(() => {
    if (config.media.length > 0) return config.media.map((m) => ({ kind: m.kind, src: m.src }));
    return MAC_DEMO_MEDIA.map((m) => ({ kind: m.kind, src: m.src }));
  }, [config.media]);

  // New embeds carry a continuous pose; fall back to the old preset.
  const pose = config.pose != null ? config.pose : config.preset === "flat" ? 1 : 0;

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
          pose={pose}
          fit={config.fit}
          background={config.background}
          fill
          hoverable={false}
          immediate
        />
      </div>

      {/* Forced watermark: big centred mark + subtle clickable backlink. */}
      <EmbedWatermark />
    </div>
  );
}
