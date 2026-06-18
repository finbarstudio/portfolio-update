"use client";

/**
 * MacStage — mounts the MacScene engine for the sandbox (SSR-safe via the existing
 * dynamic(ssr:false) pattern) and owns nothing but the wiring: it forces the chosen
 * preset/fit/background/aspect, mounts immediately, keeps the drawing buffer
 * readable for export, and threads the controller ref up to the export hook.
 */

import dynamic from "next/dynamic";
import { useMemo } from "react";

import type { PhoneSceneController } from "@/components/phone/PhoneScene";
import type { FitMode, MacMediaItem } from "@/components/mac/mac-config";
import { MAC_MODEL } from "@/components/mac/mac-config";
import type { MediaAsset } from "@/lib/sandbox/media";
import { aspectToCss } from "@/lib/sandbox/embed-config";

const MacScene = dynamic(() => import("@/components/mac/MacScene"), {
  ssr: false,
  loading: () => <div style={{ position: "absolute", inset: 0 }} />,
});

export default function MacStage({
  media,
  pose,
  scale,
  fit,
  background,
  aspect,
  paused,
  controllerRef,
  onReady,
}: {
  media: MediaAsset[];
  pose: number;
  scale: number;
  fit: FitMode;
  background: string;
  aspect: string;
  paused: boolean;
  controllerRef: React.RefObject<PhoneSceneController | null>;
  onReady?: () => void;
}) {
  const items: MacMediaItem[] = useMemo(
    () => media.map((m) => ({ kind: m.kind, src: m.src })),
    [media],
  );

  const checker = background === "transparent";

  return (
    <div
      className="sandbox-stage"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "min(100%, 86vh)",
        margin: "0 auto",
        aspectRatio: aspectToCss(aspect),
        borderRadius: 0,
        overflow: "hidden",
        background: checker
          ? "repeating-conic-gradient(#ececea 0% 25%, #f8f8f6 0% 50%) 50% / 22px 22px"
          : background,
        border: "1px solid var(--line)",
      }}
    >
      {items.length > 0 ? (
        <MacScene
          model={MAC_MODEL}
          media={items}
          pose={pose}
          scale={scale}
          fit={fit}
          background={background}
          fill
          hoverable={false}
          immediate
          preserveDrawingBuffer
          paused={paused}
          motion={false}
          controllerRef={controllerRef}
          onReady={onReady}
        />
      ) : (
        <div className="sandbox-stage-empty">
          <span className="mono-label">Add media to begin</span>
        </div>
      )}
    </div>
  );
}
