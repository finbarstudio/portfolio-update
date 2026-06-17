"use client";

/**
 * MacMockupTool — the Studio Display customizer. Same concept (and the same
 * panels + export pipeline) as the Phone Mockup, driving a single Apple Studio
 * Display instead of an iPhone carousel: drop a screenshot or screen recording
 * onto the display, pick the angle + aspect + background, and export a looping
 * turntable video, stills, a GIF or an embed.
 *
 * Seeded with public demo screens so the canvas is never empty; uploaded object
 * URLs are revoked on remove + unmount (no leaks).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { PhoneSceneController } from "@/components/phone/PhoneScene";
import type { FitMode } from "@/components/mac/mac-config";
import {
  CYCLE_SPEED as MAC_CYCLE_SPEED,
  macPoseFromAngle,
  DEFAULT_MAC_ANGLE,
} from "@/components/mac/mac-config";
import { loopSeconds } from "@/components/phone/phone-config";
import {
  MAC_DEMO_MEDIA,
  ingestFiles,
  ingestImageUrl,
  revokeAsset,
  type MediaAsset,
} from "@/lib/sandbox/media";
import { useMockupExport, type ExportConfig } from "@/lib/sandbox/useMockupExport";
import {
  buildEmbedSnippet,
  isEmbeddableSrc,
  type EmbedConfig,
} from "@/lib/sandbox/embed-config";

import MacStage from "./MacStage";
import ControlPanel, { type AspectToken } from "./ControlPanel";
import UploadDropzone from "./UploadDropzone";
import ExportPanel from "./ExportPanel";

const MAC_EMBED_PATH = "/embed/mac";
const MAC_MAX = 1; // the Studio Display shows a single screen

export default function MacMockupTool() {
  const [assets, setAssets] = useState<MediaAsset[]>(() => MAC_DEMO_MEDIA.slice());
  const [angle, setAngle] = useState(DEFAULT_MAC_ANGLE);
  const [aspect] = useState<AspectToken>("16:9"); // locked to widescreen
  const [fit, setFit] = useState<FitMode>("cover");
  const [background, setBackground] = useState<string>("transparent");
  const [paused, setPaused] = useState(false);
  const [focus, setFocus] = useState(0);
  const [messages, setMessages] = useState<{ errors: string[]; warnings: string[] }>({
    errors: [],
    warnings: [],
  });

  const controllerRef = useRef<PhoneSceneController | null>(null);

  // Continuous Angle → pose blend; the export captures it as the hover.
  const pose = macPoseFromAngle(angle);
  const poseHover = pose;
  const configRef = useRef<ExportConfig>({ media: assets, poseHover, fit, aspect, background });
  const assetsRef = useRef(assets);
  useEffect(() => {
    configRef.current = { media: assets, poseHover, fit, aspect, background };
    assetsRef.current = assets;
  });
  useEffect(() => () => assetsRef.current.forEach(revokeAsset), []);
  const getConfig = useCallback(() => configRef.current, []);

  const safeFocus = Math.min(focus, Math.max(0, assets.length - 1));

  const exp = useMockupExport({ controllerRef, setPaused, getConfig });

  const handleAddFiles = useCallback(async (files: File[]) => {
    // The Studio Display shows one screen — a single media item replaces the
    // placeholder card (and any prior pick).
    const result = await ingestFiles(files, 0, MAC_MAX);
    setMessages({ errors: result.errors, warnings: result.warnings });
    if (result.assets.length) setAssets(result.assets.slice(0, MAC_MAX));
  }, []);

  const handleAddUrl = useCallback(async (url: string) => {
    const result = await ingestImageUrl(url, 0, MAC_MAX);
    setMessages({ errors: result.errors, warnings: result.warnings });
    if (result.assets.length) setAssets(result.assets.slice(0, MAC_MAX));
  }, []);

  const handleReorder = useCallback((id: string, toIndex: number) => {
    setAssets((prev) => {
      const from = prev.findIndex((a) => a.id === id);
      if (from < 0 || toIndex === from) return prev;
      const next = prev.slice();
      const [item] = next.splice(from, 1);
      next.splice(Math.max(0, Math.min(next.length, toIndex)), 0, item);
      return next;
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setAssets((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) revokeAsset(target);
      return prev.filter((a) => a.id !== id);
    });
    setMessages({ errors: [], warnings: [] });
  }, []);

  const handleMove = useCallback((id: string, dir: -1 | 1) => {
    setAssets((prev) => {
      const i = prev.findIndex((a) => a.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }, []);

  const embeddableCount = useMemo(
    () => assets.filter((a) => isEmbeddableSrc(a.src)).length,
    [assets],
  );

  const handleCopyEmbed = useCallback((): boolean => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return false;
    const config: EmbedConfig = {
      media: assets.filter((a) => isEmbeddableSrc(a.src)).map((a) => ({ src: a.src, kind: a.kind })),
      preset: "flat",
      pose,
      fit,
      aspect,
      background,
    };
    const origin = window.location.origin;
    const snippet = buildEmbedSnippet(origin, config, MAC_EMBED_PATH);
    navigator.clipboard.writeText(snippet).catch(() => {});
    return true;
  }, [assets, pose, fit, aspect, background]);

  return (
    <div className="sb-tool">
      <header className="sb-tool-head">
        <div>
          <p className="mono-label sb-eyebrow">Sandbox / Tool</p>
          <h1 className="sb-tool-title">Mac Mockup</h1>
          <p className="sb-tool-sub">
            Drop a screenshot or screen recording onto a 3D Studio Display, pick the angle, and
            export a looping turntable video, stills, a GIF, or an embed. Free, watermarked.
          </p>
        </div>
      </header>

      <div className="sb-tool-grid">
        <div className="sb-stage-col">
          <MacStage
            media={assets}
            pose={pose}
            fit={fit}
            background={background}
            aspect={aspect}
            paused={paused}
            controllerRef={controllerRef}
          />
        </div>

        <div className="sb-controls-col">
          <UploadDropzone
            assets={assets}
            onAddFiles={handleAddFiles}
            onAddUrl={handleAddUrl}
            onRemove={handleRemove}
            onMove={handleMove}
            onReorder={handleReorder}
            messages={messages}
            maxItems={MAC_MAX}
            landscapeThumbs
            hint="A looping video works best — a still image is fine too"
          />
          <ControlPanel
            aspect={aspect}
            onAspect={() => {}}
            fit={fit}
            onFit={setFit}
            background={background}
            onBackground={setBackground}
            motion={{ angle, onAngle: setAngle }}
            showAspect={false}
          />
          <ExportPanel
            exp={exp}
            mediaCount={assets.length}
            focus={safeFocus}
            onFocus={setFocus}
            onCopyEmbed={handleCopyEmbed}
            embeddableCount={embeddableCount}
            transparentBg={background === "transparent"}
            loopSeconds={loopSeconds(Math.max(1, assets.length), MAC_CYCLE_SPEED)}
          />
        </div>
      </div>
    </div>
  );
}
