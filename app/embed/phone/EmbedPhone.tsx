"use client";

/**
 * EmbedPhone — the chromeless phone mockup rendered inside `/embed/phone`. Same
 * engine and the same hover effect as the portfolio TMYR thumbnail (a `flat`
 * preset renders static; otherwise it cycles at rest and flattens on hover).
 *
 * Watermark is forced on as a DOM overlay: a wordmark + a real, clickable
 * backlink to finbar.studio (attribution + SEO value). Falls back to the public
 * demo reels when no embeddable media was supplied.
 */

import dynamic from "next/dynamic";
import { useMemo } from "react";

import type { PhoneMediaItem } from "@/components/phone/phone-config";
import { DEMO_MEDIA } from "@/lib/sandbox/media";
import { aspectToCss, type EmbedConfig } from "@/lib/sandbox/embed-config";
import EmbedWatermark from "@/components/sandbox/EmbedWatermark";

const PhoneScene = dynamic(() => import("@/components/phone/PhoneScene"), { ssr: false });

const MODEL = "/models/iphone/iphone-15-pro-max.glb";

export default function EmbedPhone({ config }: { config: EmbedConfig }) {
  const media: PhoneMediaItem[] = useMemo(() => {
    if (config.media.length > 0) return config.media.map((m) => ({ kind: m.kind, src: m.src }));
    return DEMO_MEDIA.slice(0, 7).map((m) => ({ kind: m.kind, src: m.src }));
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
        <PhoneScene
          model={MODEL}
          media={media}
          presetOverride={presetOverride}
          fit={config.fit}
          background={config.background}
          fill
          hoverable={hoverable}
          immediate
        />
      </div>

      {/* Forced watermark: big centred mark + subtle clickable backlink. */}
      <EmbedWatermark />
    </div>
  );
}
