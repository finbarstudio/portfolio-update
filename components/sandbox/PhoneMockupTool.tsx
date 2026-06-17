"use client";

/**
 * PhoneMockupTool — the customizer orchestrator. Owns all config state (media,
 * preset, aspect, fit, background, export focus), the PhoneScene controller ref,
 * and wires the export hook. The stage and the three panels are otherwise dumb.
 *
 * Media is seeded with the public TMYR reels so the canvas is never empty; object
 * URLs from uploads are revoked on remove + unmount (no leaks).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { PhoneSceneController } from "@/components/phone/PhoneScene";
import type { FitMode } from "@/components/phone/phone-config";
import { poseFromAngle, DEFAULT_ANGLE, DEFAULT_SPEED } from "@/components/phone/phone-config";
import {
  DEMO_MEDIA,
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

import PhoneStage from "./PhoneStage";
import ControlPanel, { type AspectToken } from "./ControlPanel";
import UploadDropzone from "./UploadDropzone";
import ExportPanel from "./ExportPanel";

export default function PhoneMockupTool() {
  const [assets, setAssets] = useState<MediaAsset[]>(() => DEMO_MEDIA.slice());
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [angle, setAngle] = useState(DEFAULT_ANGLE);
  const [aspect, setAspect] = useState<AspectToken>("16:9");
  const [fit, setFit] = useState<FitMode>("cover");
  const [background, setBackground] = useState<string>("transparent");
  const [paused, setPaused] = useState(false);
  const [focus, setFocus] = useState(0);
  const [messages, setMessages] = useState<{ errors: string[]; warnings: string[] }>({
    errors: [],
    warnings: [],
  });

  const pose = poseFromAngle(angle);
  const controllerRef = useRef<PhoneSceneController | null>(null);

  // Latest-value refs for the export hook + unmount cleanup, synced after render.
  const configRef = useRef<ExportConfig>({ media: assets, poseHover: pose, fit, aspect, background });
  const assetsRef = useRef(assets);
  useEffect(() => {
    configRef.current = { media: assets, poseHover: pose, fit, aspect, background };
    assetsRef.current = assets;
  });
  useEffect(() => () => assetsRef.current.forEach(revokeAsset), []);
  const getConfig = useCallback(() => configRef.current, []);

  // Keep the still-focus index in range as media changes (derived, no effect).
  const safeFocus = Math.min(focus, Math.max(0, assets.length - 1));

  const exp = useMockupExport({ controllerRef, setPaused, getConfig });

  const handleAddFiles = useCallback(async (files: File[]) => {
    // The default reel is placeholder cards — the first real upload replaces them
    // wholesale (so 1 upload loops alone, 2 loop together, etc.).
    const current = assetsRef.current;
    const replacingDemos = current.length > 0 && current.every((a) => a.isDemo);
    const result = await ingestFiles(files, replacingDemos ? 0 : current.length);
    setMessages({ errors: result.errors, warnings: result.warnings });
    if (result.assets.length) {
      setAssets((prev) => {
        const onlyDemos = prev.length > 0 && prev.every((a) => a.isDemo);
        return onlyDemos ? result.assets : [...prev, ...result.assets];
      });
    }
  }, []);

  const handleAddUrl = useCallback(async (url: string) => {
    const current = assetsRef.current;
    const replacingDemos = current.length > 0 && current.every((a) => a.isDemo);
    const result = await ingestImageUrl(url, replacingDemos ? 0 : current.length);
    setMessages({ errors: result.errors, warnings: result.warnings });
    if (result.assets.length) {
      setAssets((prev) => {
        const onlyDemos = prev.length > 0 && prev.every((a) => a.isDemo);
        return onlyDemos ? result.assets : [...prev, ...result.assets];
      });
    }
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

  const embeddableCount = useMemo(
    () => assets.filter((a) => isEmbeddableSrc(a.src)).length,
    [assets],
  );

  const handleCopyEmbed = useCallback((): boolean => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return false;
    const config: EmbedConfig = {
      media: assets.filter((a) => isEmbeddableSrc(a.src)).map((a) => ({ src: a.src, kind: a.kind })),
      preset: "carousel",
      pose,
      speed,
      fit,
      aspect,
      background,
    };
    const origin = window.location.origin;
    const snippet = buildEmbedSnippet(origin, config);
    navigator.clipboard.writeText(snippet).catch(() => {});
    return true;
  }, [assets, pose, speed, fit, aspect, background]);

  return (
    <div className="sb-tool">
      <header className="sb-tool-head">
        <div>
          <p className="mono-label sb-eyebrow">Sandbox / Tool</p>
          <h1 className="sb-tool-title">Phone Mockup</h1>
          <p className="sb-tool-sub">
            Drop your images or videos onto the phones, pick the motion, and export a looping video,
            stills, a GIF, or an embed. Free, watermarked.
          </p>
        </div>
      </header>

      <div className="sb-tool-grid">
        <div className="sb-stage-col">
          <PhoneStage
            media={assets}
            pose={pose}
            speed={speed}
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
          />
          <ControlPanel
            aspect={aspect}
            onAspect={setAspect}
            fit={fit}
            onFit={setFit}
            background={background}
            onBackground={setBackground}
            motion={{ speed, angle, onSpeed: setSpeed, onAngle: setAngle }}
          />
          <ExportPanel
            exp={exp}
            mediaCount={assets.length}
            focus={safeFocus}
            onFocus={setFocus}
            onCopyEmbed={handleCopyEmbed}
            embeddableCount={embeddableCount}
            transparentBg={background === "transparent"}
          />
        </div>
      </div>
    </div>
  );
}
