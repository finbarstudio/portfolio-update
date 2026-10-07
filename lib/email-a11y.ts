/**
 * Accessibility audit of a rendered email, run against the preview frame's
 * document. Source checks (lib/email-check.ts) can see attributes; this sees
 * what a reader gets: computed colours for contrast, real link sizes for
 * touch targets, and the accessible name a link ends up with.
 */

export interface ContrastIssue {
  text: string;
  color: string;
  background: string;
  ratio: number;
  required: number;
  /** the nearest shade of the text colour that passes on this background */
  suggestion: string;
  /** text under 24px, or under 18.66px bold, needs 4.5:1; larger needs 3:1 */
  large: boolean;
}

export interface TargetIssue {
  text: string;
  width: number;
  height: number;
}

export interface A11yReport {
  /** text whose background could not be known (an image or gradient behind it) */
  contrastUnknown: number;
  contrast: ContrastIssue[];
  /** standalone links (buttons, image links) smaller than 24px on a side */
  targets: TargetIssue[];
  /** standalone links between 24px and 44px: pass WCAG, below the common 44px guide */
  smallTargets: number;
  linksWithoutName: string[];
  imagesWithoutAlt: string[];
  headings: number;
  smallText: { text: string; size: number }[];
  textNodes: number;
  /** how far the content runs past the right edge at this width; 0 when it fits */
  overflow: number;
  viewport: number;
}

export interface FixedWidthOffender {
  /** what it is, in words: "image hero.png, fixed at 600px" */
  label: string;
  /** the opening tag as written, to find its line in the source */
  openTag: string;
}

export interface NarrowProbe {
  viewport: number;
  /** the width the email actually takes */
  contentWidth: number;
  offenders: FixedWidthOffender[];
}

const MAX_OFFENDERS = 8;

function openTag(el: Element): string {
  const html = el.outerHTML;
  return html.slice(0, html.indexOf(">") + 1);
}

/**
 * For a document laid out at phone width with its style blocks removed (what
 * a client without media-query support shows): how wide the email really is,
 * and which fixed-width images and rows of fixed-width cells hold it open.
 */
export function measureNarrow(doc: Document): NarrowProbe {
  const root = doc.documentElement;
  const viewport = root.clientWidth;
  const probe: NarrowProbe = { viewport, contentWidth: Math.max(root.scrollWidth, doc.body?.scrollWidth ?? 0), offenders: [] };
  if (probe.contentWidth <= viewport + 1) return probe;

  for (const img of doc.querySelectorAll("img")) {
    const w = Math.round(img.getBoundingClientRect().width);
    if (w > viewport) probe.offenders.push({ label: `image ${(img.getAttribute("src") ?? "").split("/").pop()?.slice(0, 24) ?? ""}, fixed at ${w}px`, openTag: openTag(img) });
  }
  for (const row of doc.querySelectorAll("tr")) {
    const cells = [...row.children].filter((c) => c.tagName === "TD" || c.tagName === "TH");
    // Only pixel widths count; a percentage shrinks with the screen.
    const fixed = cells.filter((c) => /^\d+$/.test(c.getAttribute("width") ?? ""));
    const total = fixed.reduce((n, c) => n + Number(c.getAttribute("width")), 0);
    if (fixed.length > 1 && total > viewport) {
      probe.offenders.push({ label: `row of fixed-width cells: ${fixed.map((c) => c.getAttribute("width")).join(" + ")} = ${total}px`, openTag: openTag(fixed[0]) });
    }
  }
  probe.offenders = probe.offenders.slice(0, MAX_OFFENDERS);
  return probe;
}

const WCAG_MIN_TARGET = 24;
const GUIDE_TARGET = 44;
const SMALL_TEXT = 12;

function parseColor(value: string): [number, number, number, number] | null {
  const m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)/.exec(value);
  if (!m) return null;
  let a = m[4] === undefined ? 1 : Number.parseFloat(m[4]);
  if (m[4]?.endsWith("%")) a /= 100;
  return [Number(m[1]), Number(m[2]), Number(m[3]), a];
}

function luminance([r, g, b]: [number, number, number, number]): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: [number, number, number, number], b: [number, number, number, number]): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function hex([r, g, b]: [number, number, number, number]): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

/**
 * The closest colour to `color` that reaches `required` against `background`,
 * found by moving it towards black or white (whichever the background is
 * further from) in small steps. Keeps the hue, changes only the lightness.
 */
export function passingShade(color: [number, number, number, number], background: [number, number, number, number], required: number): string {
  const target = luminance(background) > 0.5 ? 0 : 255;
  for (let step = 0; step <= 100; step++) {
    const t = step / 100;
    // Rounded to whole channel values first: the hex is what gets used, so the hex is what must pass.
    const mixed: [number, number, number, number] = [
      Math.round(color[0] + (target - color[0]) * t),
      Math.round(color[1] + (target - color[1]) * t),
      Math.round(color[2] + (target - color[2]) * t),
      1,
    ];
    if (contrastRatio(mixed, background) >= required) return hex(mixed);
  }
  return target === 0 ? "#000000" : "#ffffff";
}

/** Walks up for the first opaque background. Null when an image or gradient sits in the way. */
function effectiveBackground(el: Element, view: Window): [number, number, number, number] | null {
  for (let node: Element | null = el; node; node = node.parentElement) {
    const style = view.getComputedStyle(node);
    if (style.backgroundImage !== "none") return null;
    const bg = parseColor(style.backgroundColor);
    if (bg && bg[3] >= 0.99) return bg;
  }
  return [255, 255, 255, 1];
}

function isVisible(el: Element, view: Window): boolean {
  for (let node: Element | null = el; node; node = node.parentElement) {
    const style = view.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || Number.parseFloat(style.opacity) === 0) return false;
    if (Number.parseFloat(style.fontSize) === 0 && node === el) return false;
    if (style.overflow === "hidden" && (node as HTMLElement).offsetHeight === 0) return false;
  }
  return true;
}

function snippet(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 60 ? `${clean.slice(0, 57)}…` : clean;
}

function accessibleName(link: HTMLAnchorElement): string {
  const label = link.getAttribute("aria-label") || link.getAttribute("title");
  if (label?.trim()) return label.trim();
  const text = (link.textContent ?? "").replace(/\s+/g, " ").trim();
  if (text) return text;
  return [...link.querySelectorAll("img")]
    .map((img) => (img.getAttribute("alt") ?? "").trim())
    .filter(Boolean)
    .join(" ");
}

/** A link that sits in running text is exempt from target size rules. */
function isInlineInText(link: HTMLAnchorElement): boolean {
  const parent = link.parentElement;
  if (!parent) return false;
  const others = [...parent.childNodes].filter((n) => n !== link);
  return others.some((n) => (n.textContent ?? "").trim().length > 0);
}

export function auditDocument(doc: Document): A11yReport {
  const view = doc.defaultView;
  const report: A11yReport = {
    contrastUnknown: 0,
    contrast: [],
    targets: [],
    smallTargets: 0,
    linksWithoutName: [],
    imagesWithoutAlt: [],
    headings: doc.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='heading']").length,
    smallText: [],
    textNodes: 0,
    overflow: Math.max(0, Math.max(doc.documentElement.scrollWidth, doc.body?.scrollWidth ?? 0) - doc.documentElement.clientWidth),
    viewport: doc.documentElement.clientWidth,
  };
  if (!view || !doc.body) return report;

  const seenPairs = new Set<string>();
  const seenSmall = new Set<string>();
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? "";
    if (!text.trim() || !node.parentElement) continue;
    const el = node.parentElement;
    if (["STYLE", "SCRIPT", "TITLE"].includes(el.tagName) || !isVisible(el, view)) continue;
    report.textNodes++;

    const style = view.getComputedStyle(el);
    const size = Number.parseFloat(style.fontSize);
    const weight = Number.parseInt(style.fontWeight, 10) || (style.fontWeight === "bold" ? 700 : 400);
    if (size < SMALL_TEXT && !seenSmall.has(snippet(text))) {
      seenSmall.add(snippet(text));
      report.smallText.push({ text: snippet(text), size });
    }

    const color = parseColor(style.color);
    if (!color) continue;
    const background = effectiveBackground(el, view);
    if (!background) {
      report.contrastUnknown++;
      continue;
    }
    const ratio = contrastRatio(color, background);
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const required = large ? 3 : 4.5;
    const key = `${hex(color)}/${hex(background)}/${large}`;
    if (ratio < required && !seenPairs.has(key)) {
      seenPairs.add(key);
      report.contrast.push({ text: snippet(text), color: hex(color), background: hex(background), ratio: Math.round(ratio * 100) / 100, required, large, suggestion: passingShade(color, background, required) });
    }
  }
  report.contrast.sort((a, b) => a.ratio - b.ratio);

  for (const link of doc.querySelectorAll<HTMLAnchorElement>("a[href]")) {
    // Hidden from screen readers on purpose (a duplicate of the link beside it).
    if (!isVisible(link, view) || link.getAttribute("aria-hidden") === "true") continue;
    const name = accessibleName(link);
    if (!name) {
      report.linksWithoutName.push(link.getAttribute("href") ?? "");
      continue;
    }
    if (isInlineInText(link)) continue;
    const rect = link.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    if (width === 0 || height === 0) continue;
    if (width < WCAG_MIN_TARGET || height < WCAG_MIN_TARGET) report.targets.push({ text: snippet(name), width, height });
    else if (width < GUIDE_TARGET || height < GUIDE_TARGET) report.smallTargets++;
  }

  for (const img of doc.querySelectorAll("img")) {
    if (!img.hasAttribute("alt") && isVisible(img, view)) report.imagesWithoutAlt.push(img.getAttribute("src")?.split("/").pop() ?? "");
  }

  return report;
}
