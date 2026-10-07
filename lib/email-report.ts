/**
 * The email check report as compact plain text, small enough to paste into a
 * chat with an assistant: one line per finding, no explanations (the reader
 * can ask), no HTML. A legend at the top says how to read it.
 */
import type { A11yReport, NarrowProbe } from "@/lib/email-a11y";
import { formatShare, type AppliedFix, type CanIEmailData, type FeatureUse, type Finding, type Stats } from "@/lib/email-check";

export interface ReportInput {
  fileName: string;
  stats: Stats;
  findings: Finding[];
  a11y: A11yReport | null;
  /** the email at phone width with its style blocks removed */
  narrow: NarrowProbe | null;
  features: FeatureUse[];
  families: string[];
  data: CanIEmailData | null;
  applied: AppliedFix[];
  transactional: boolean;
  /** preview width the height and accessibility audit were measured at; 0 is fluid */
  width: number;
  height: number | null;
}

const LEVEL = { fail: "P", warn: "W", info: "N" } as const;
const MAX_LINES = 8;

function lines(list: number[], insertAfter?: number): string {
  if (!list.length) return insertAfter ? `add after L${insertAfter}` : "whole email";
  const shown = list.slice(0, MAX_LINES).join(",");
  return `L${shown}${list.length > MAX_LINES ? `+${list.length - MAX_LINES}` : ""}`;
}

/** "Gmail (all), Outlook (Windows, macOS)": clients grouped by family to keep the line short. */
function clients(feature: FeatureUse, status: "n" | "a", families: string[], data: CanIEmailData): string {
  const groups: string[] = [];
  for (const family of families) {
    const all = feature.support.filter((s) => s.family === family && s.status !== "u");
    const hit = all.filter((s) => s.status === status);
    if (!hit.length) continue;
    const name = data.nicenames.family[family] ?? family;
    groups.push(hit.length === all.length ? name : `${name} (${hit.map((s) => data.nicenames.platform[s.platform] ?? s.platform).join(", ")})`);
  }
  return groups.join("; ");
}

export function buildReport(input: ReportInput): string {
  const { stats, findings, a11y, narrow, features, families, data, applied } = input;
  const out: string[] = [];
  const at = input.width ? `${input.width}px` : "full width";

  out.push("# Email check report");
  out.push(
    [
      input.fileName || "pasted email",
      `${(stats.bytes / 1024).toFixed(1)}KB`,
      stats.width ? `${stats.width}px wide` : "fluid width",
      input.height ? `${input.height}px tall at ${at}` : "",
      stats.platform ? `sent via ${stats.platform.split(" (")[0]}` : "",
      input.transactional ? "transactional" : "marketing",
      `${stats.images} images`,
      `${stats.tables} tables`,
      `${(stats.styleBytes / 1024).toFixed(1)}KB CSS in style blocks`,
    ]
      .filter(Boolean)
      .join(" | "),
  );
  out.push(`Inbox preview line: "${stats.previewText}"`);
  const done = applied.filter((a) => a.note);
  out.push(`Fixes already applied: ${done.length ? done.map((a) => a.note).join("; ") : "none"}`);
  out.push("Key: P problem, W warning, N note; a11y = accessibility; L = line of the HTML; % = share of email opens reached; autofix = the tool can fix it.");

  for (const [group, heading] of [["content", "Content and links"], ["code", "Code"]] as const) {
    const inGroup = findings.filter((f) => f.group === group);
    out.push("", `## ${heading} (${inGroup.length})`);
    for (const f of inGroup) {
      out.push([`${LEVEL[f.level]}${f.a11y ? " a11y" : ""}`, f.title, lines(f.lines, f.insertAfter), formatShare(f.share), f.fix ? "autofix" : ""].filter(Boolean).join(" | "));
    }
  }

  if (a11y) {
    out.push("", `## As rendered (${at})`);
    if (a11y.overflow > 0) out.push(`P | scrolls sideways: content is ${a11y.viewport + a11y.overflow}px wide in a ${a11y.viewport}px view`);
    if (narrow && narrow.contentWidth > narrow.viewport + 1) {
      out.push(`W | without style blocks (no media queries) the email is ${narrow.contentWidth}px wide on a ${narrow.viewport}px phone | ${narrow.offenders.map((o) => o.label).join("; ")}`);
    } else if (narrow) {
      out.push(`without style blocks the email still fits a ${narrow.viewport}px phone`);
    }
    for (const c of a11y.contrast) {
      out.push(`P | contrast ${c.ratio}:1, needs ${c.required}:1 | ${c.color} on ${c.background} | "${c.text}" | passing shade ${c.suggestion}`);
    }
    if (!a11y.contrast.length) out.push("contrast: all measured text passes WCAG AA");
    if (a11y.contrastUnknown) out.push(`N | ${a11y.contrastUnknown} text blocks over a background image, contrast not measurable`);
    for (const href of a11y.linksWithoutName) out.push(`P | link with no accessible name | ${href}`);
    for (const name of a11y.imagesWithoutAlt) out.push(`P | image with no alt | ${name}`);
    if (a11y.targets.length) {
      out.push(`W | ${a11y.targets.length} links or buttons with a tap area under 24px | ${a11y.targets.map((t) => `"${t.text}" ${t.width}x${t.height}`).join(", ")}`);
    }
    if (a11y.smallTargets) out.push(`N | ${a11y.smallTargets} links or buttons between 24 and 44px`);
  }

  if (data) {
    const shareIn = (f: FeatureUse, status: "n" | "a") =>
      f.support.filter((s) => families.includes(s.family) && s.status === status).reduce((n, s) => n + s.share, 0);
    const unsupported = features.filter((f) => shareIn(f, "n") > 0).sort((a, b) => shareIn(b, "n") - shareIn(a, "n"));
    const partial = features.filter((f) => shareIn(f, "n") === 0 && shareIn(f, "a") > 0);
    out.push("", `## Client support (caniemail.com, ${data.last_update_date.slice(0, 10)}; clients: ${families.map((f) => data.nicenames.family[f] ?? f).join(", ")})`);
    out.push("feature | uses | not supported in | % of opens that cannot show it");
    for (const f of unsupported) {
      out.push([f.title, `x${f.count}`, clients(f, "n", families, data), formatShare(shareIn(f, "n")), f.fix ? "autofix" : ""].filter(Boolean).join(" | "));
    }
    if (!unsupported.length) out.push("nothing unsupported in these clients");
    if (partial.length) out.push(`Partial support only: ${partial.map((f) => f.title).join(", ")}`);
  }

  return `${out.join("\n")}\n`;
}
