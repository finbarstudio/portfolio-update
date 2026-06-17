"use client";

/**
 * PhoneStage — mounts the PhoneScene engine for the sandbox (SSR-safe via the
 * existing dynamic(ssr:false) pattern) and owns nothing but the wiring: it forces
 * the chosen preset/fit/background/aspect, mounts immediately (single canvas, no
 * staggered queue), keeps the drawing buffer readable for export, and threads the
 * controller ref up so the export hook can drive it.
 */

import dynamic from "next/dynamic";
import { useMemo } from "react";

import type { PhoneSceneController } from "@/components/phone/PhoneScene";
import type { FitMode, PhoneMediaItem } from "@/components/phone/phone-config";
import type { MediaAsset } from "@/lib/sandbox/media";
import { aspectToCss } from "@/lib/sandbox/embed-config";

const PhoneScene = dynamic(() => import("@/components/phone/PhoneScene"), {
  ssr: false,
  loading: () => <div style={{ position: "absolute", inset: 0 }} />,
});

const MODEL = "/models/iphone/iphone-15-pro-max.glb";

export default function PhoneStage({
  media,
  pose,
  speed,
  fit,
  background,
  aspect,
  paused,
  controllerRef,
  onReady,
}: {
  media: MediaAsset[];
  pose: number;
  speed: number;
  fit: FitMode;
  background: string;
  aspect: string;
  paused: boolean;
  controllerRef: React.RefObject<PhoneSceneController | null>;
  onReady?: () => void;
}) {
  const items: PhoneMediaItem[] = useMemo(
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
        maxWidth: "min(100%, 70vh)",
        margin: "0 auto",
        aspectRatio: aspectToCss(aspect),
        borderRadius: 12,
        overflow: "hidden",
        // A checkerboard reads "transparent" in the preview; solid colors paint flat.
        background: checker
          ? "repeating-conic-gradient(#ececea 0% 25%, #f8f8f6 0% 50%) 50% / 22px 22px"
          : background,
        border: "1px solid var(--line)",
      }}
    >
      {items.length > 0 ? (
        <PhoneScene
          model={MODEL}
          media={items}
          pose={pose}
          speed={speed}
          fit={fit}
          background={background}
          fill
          hoverable={false}
          immediate
          preserveDrawingBuffer
          paused={paused}
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
