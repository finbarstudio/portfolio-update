/**
 * embed-config — serialise the mockup config to/from `/embed/phone` query params
 * and build the copy-paste `<iframe>` snippet.
 *
 * Embeds need **public** media URLs (uploaded blob: URLs only live in the user's
 * tab), so only non-blob sources are embeddable — the tool surfaces this. The
 * embed always shows the watermark wordmark + a real backlink to finbar.studio.
 */

import type { AnimationPreset, FitMode, PhoneMediaKind } from "@/components/phone/phone-config";

export type EmbedMedia = { src: string; kind: PhoneMediaKind };

export type EmbedConfig = {
  media: EmbedMedia[];
  preset: AnimationPreset;
  /** Phone continuous pose blend (Angle slider). Overrides preset when present. */
  pose?: number;
  /** Phone carousel speed multiplier. */
  speed?: number;
  /** Phone main-phone prominence 0..1. */
  prominence?: number;
  /** Mac whole-display scale (Size slider). 1 = natural framed size. */
  scale?: number;
  fit: FitMode;
  /** Aspect ratio token, e.g. "9:16" | "1:1" | "16:9". */
  aspect: string;
  /** "transparent" or a CSS color. */
  background: string;
};

export const DEFAULT_EMBED: EmbedConfig = {
  media: [],
  preset: "carousel",
  fit: "cover",
  aspect: "16:9",
  background: "transparent",
};

/** Only public (non-blob, non-data) URLs can be embedded. Generated placeholder
 *  cards (`gen:<n>`) aren't real assets, so they're excluded too. */
export function isEmbeddableSrc(src: string): boolean {
  return !src.startsWith("blob:") && !src.startsWith("data:") && !src.startsWith("gen:");
}

/** Absolutise a src against an origin so the snippet works on any host. */
function absolutise(src: string, origin: string): string {
  if (/^https?:\/\//.test(src)) return src;
  return `${origin.replace(/\/$/, "")}${src.startsWith("/") ? "" : "/"}${src}`;
}

export function encodeEmbedConfig(config: EmbedConfig, origin = ""): URLSearchParams {
  const sp = new URLSearchParams();
  for (const m of config.media) {
    if (!isEmbeddableSrc(m.src)) continue;
    sp.append("m", origin ? absolutise(m.src, origin) : m.src);
    sp.append("t", m.kind);
  }
  sp.set("p", config.preset);
  if (config.pose != null) sp.set("h", String(config.pose));
  if (config.speed != null) sp.set("spd", String(config.speed));
  if (config.prominence != null) sp.set("pr", String(config.prominence));
  if (config.scale != null) sp.set("sc", String(config.scale));
  sp.set("f", config.fit);
  sp.set("a", config.aspect);
  sp.set("bg", config.background);
  return sp;
}

type RawParams = Record<string, string | string[] | undefined>;

function asArray(v: string | string[] | undefined): string[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

/** A media src is only honoured in an embed if it's an absolute http(s) URL or a
 *  root-relative path. This rejects `javascript:`, `data:` and other schemes that
 *  could be smuggled in via the (attacker-craftable) embed query string. */
function isSafeEmbedSrc(src: string): boolean {
  return /^https?:\/\//i.test(src) || src.startsWith("/");
}

export function decodeEmbedConfig(params: RawParams): EmbedConfig {
  const srcs = asArray(params.m);
  const kinds = asArray(params.t);
  const media: EmbedMedia[] = srcs
    .map((src, i) => ({
      src,
      kind: kinds[i] === "image" ? ("image" as const) : ("video" as const),
    }))
    .filter((m) => isSafeEmbedSrc(m.src));

  const preset: AnimationPreset = params.p === "flat" ? "flat" : "carousel";
  const fit: FitMode =
    params.f === "contain" ? "contain" : params.f === "stretch" ? "stretch" : "cover";
  const aspect = typeof params.a === "string" ? params.a : DEFAULT_EMBED.aspect;
  const background = typeof params.bg === "string" ? params.bg : DEFAULT_EMBED.background;
  const pose = typeof params.h === "string" && params.h !== "" ? Number(params.h) : undefined;
  const speed = typeof params.spd === "string" && params.spd !== "" ? Number(params.spd) : undefined;
  const prominence = typeof params.pr === "string" && params.pr !== "" ? Number(params.pr) : undefined;
  const scale = typeof params.sc === "string" && params.sc !== "" ? Number(params.sc) : undefined;

  return {
    media,
    preset,
    pose: Number.isFinite(pose) ? pose : undefined,
    speed: Number.isFinite(speed) ? speed : undefined,
    prominence: Number.isFinite(prominence) ? prominence : undefined,
    scale: Number.isFinite(scale) ? scale : undefined,
    fit,
    aspect,
    background,
  };
}

/** Aspect token "9:16" -> CSS aspect-ratio "9 / 16". */
export function aspectToCss(aspect: string): string {
  const [w, h] = aspect.split(/[:/]/);
  if (w && h) return `${w} / ${h}`;
  return "16 / 9";
}

export function buildEmbedUrl(origin: string, config: EmbedConfig, toolPath = "/embed/phone"): string {
  const sp = encodeEmbedConfig(config, origin);
  return `${origin.replace(/\/$/, "")}${toolPath}?${sp.toString()}`;
}

/**
 * The ~1KB responsive iframe snippet + "Made with finbar.studio" backlink.
 * Padding-top trick keeps the embed responsive without JS.
 */
export function buildEmbedSnippet(origin: string, config: EmbedConfig, toolPath = "/embed/phone"): string {
  const url = buildEmbedUrl(origin, config, toolPath);
  const [w, h] = config.aspect.split(/[:/]/).map((n) => parseFloat(n));
  const pct = w && h ? ((h / w) * 100).toFixed(2) : "56.25";
  return `<div style="position:relative;width:100%;max-width:640px;margin:auto">
  <div style="position:relative;width:100%;padding-top:${pct}%">
    <iframe src="${url}" title="finbar.studio mockup" loading="lazy"
      style="position:absolute;inset:0;width:100%;height:100%;border:0"
      allowtransparency="true"></iframe>
  </div>
  <a href="https://www.finbar.studio" target="_blank" rel="noopener"
    style="display:block;text-align:right;font:11px ui-monospace,monospace;color:#6B6B6B;margin-top:4px;text-decoration:none">
    Made with finbar.studio
  </a>
</div>`;
}
