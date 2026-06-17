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
import type { AnimationPreset, FitMode } from "@/components/mac/mac-config";
import { CYCLE_SPEED as MAC_CYCLE_SPEED } from "@/components/mac/mac-config";
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
  const [preset, setPreset] = useState<AnimationPreset>("carousel"); // carousel = Angle (iso)
  const [aspect, setAspect] = useState<AspectToken>("16:9");
  const [fit, setFit] = useState<FitMode>("cover");
  const [background, setBackground] = useState<string>("transparent");
  const [paused, setPaused] = useState(false);
  const [focus, setFocus] = useState(0);
  const [messages, setMessages] = useState<{ errors: string[]; warnings: string[] }>({
    errors: [],
    warnings: [],
  });

  const controllerRef = useRef<PhoneSceneController | null>(null);

  // Mac pose: flat (front-on) = 1, angled = 0 — the export captures it as the hover.
  const poseHover = preset === "flat" ? 1 : 0;
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
      preset,
      fit,
      aspect,
      background,
    };
    const origin = window.location.origin;
    const snippet = buildEmbedSnippet(origin, config, MAC_EMBED_PATH);
    navigator.clipboard.writeText(snippet).catch(() => {});
    return true;
  }, [assets, preset, fit, aspect, background]);

  return (
    <div className="sb-tool">
      <header className="sb-tool-head">
        <p className="sb-tool-sub">Your screen on a 3D Studio Display, ready to export. Free, watermarked.</p>
      </header>

      <div className="sb-tool-grid">
        <div className="sb-stage-col">
          <MacStage
            media={assets}
            preset={preset}
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
            preset={preset}
            onPreset={setPreset}
            aspect={aspect}
            onAspect={setAspect}
            fit={fit}
            onFit={setFit}
            background={background}
            onBackground={setBackground}
            presetLabels={{ carousel: "Angle", flat: "Flat" }}
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
