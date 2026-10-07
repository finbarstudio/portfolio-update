/**
 * Email check (lab.finbar.studio/email): static checks on an HTML email's
 * source. Two halves:
 *
 *  - checkEmail(): email-specific checks written by hand (Outlook DPI, image
 *    gaps, stray non-breaking spaces, Gmail's size limit and so on).
 *  - matchFeatures(): finds the HTML and CSS the email uses and looks each one
 *    up in the caniemail.com dataset, so client support comes from their test
 *    results and not from memory.
 *
 * Everything works on the raw source with regular expressions, not a DOM, so
 * every finding can point at a line number and conditional comments (which a
 * DOM parser throws away) stay visible.
 */

export type Level = "fail" | "warn" | "info";

export interface Finding {
  id: string;
  level: Level;
  title: string;
  detail: string;
  lines: number[];
}

export interface Stats {
  bytes: number;
  lines: number;
  longestLine: number;
  nbsp: number;
  images: number;
  tables: number;
  indentPct: number;
}

interface Tag {
  name: string;
  attrs: Record<string, string>;
  line: number;
  /** inside an Outlook-only conditional comment */
  mso: boolean;
}

interface StyleBlock {
  css: string;
  offset: number;
}

interface Parsed {
  tags: Tag[];
  styles: StyleBlock[];
  lineOf: (offset: number) => number;
}

const GMAIL_CLIP_BYTES = 102 * 1024;
const SMTP_LINE_LIMIT = 998;

function lineIndex(src: string): (offset: number) => number {
  const starts = [0];
  for (let i = 0; i < src.length; i++) {
    if (src.charCodeAt(i) === 10) starts.push(i + 1);
  }
  return (offset) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
}

function parse(src: string): Parsed {
  const lineOf = lineIndex(src);

  // Comments: Outlook conditionals hold real markup, everything else is skipped.
  const msoRanges: [number, number][] = [];
  const skipRanges: [number, number][] = [];
  for (const m of src.matchAll(/<!--([\s\S]*?)-->/g)) {
    const range: [number, number] = [m.index, m.index + m[0].length];
    const cond = /^\[if([^\]]*)\]>/.exec(m[1]);
    if (cond && /mso/i.test(cond[1]) && !/!\s*mso/i.test(cond[1])) msoRanges.push(range);
    else skipRanges.push(range);
  }
  const within = (ranges: [number, number][], i: number) => ranges.some(([a, b]) => i >= a && i < b);

  const styles: StyleBlock[] = [];
  for (const m of src.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    if (within(skipRanges, m.index)) continue;
    styles.push({ css: m[1], offset: m.index + m[0].indexOf(m[1]) });
  }

  const tags: Tag[] = [];
  for (const m of src.matchAll(/<([a-zA-Z][a-zA-Z0-9:]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/g)) {
    if (within(skipRanges, m.index)) continue;
    const attrs: Record<string, string> = {};
    for (const a of m[2].matchAll(/([a-zA-Z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
      const key = a[1].toLowerCase();
      if (!(key in attrs)) attrs[key] = a[2] ?? a[3] ?? a[4] ?? "";
    }
    tags.push({
      name: m[1].toLowerCase(),
      attrs,
      line: lineOf(m.index),
      mso: within(msoRanges, m.index),
    });
  }

  return { tags, styles, lineOf };
}

function styleHas(style: string | undefined, prop: string): boolean {
  return !!style && new RegExp(`(^|;)\\s*${prop}\\s*:`, "i").test(style);
}

function styleGet(style: string | undefined, prop: string): string {
  if (!style) return "";
  const m = new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`, "i").exec(style);
  return m ? m[1].trim().toLowerCase() : "";
}

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function getStats(src: string): Stats {
  const lines = src.split("\n");
  let indent = 0;
  let longest = 0;
  for (const line of lines) {
    indent += line.length - line.trimStart().length;
    if (line.length > longest) longest = line.length;
  }
  return {
    bytes: new TextEncoder().encode(src).length,
    lines: lines.length,
    longestLine: longest,
    nbsp: (src.match(/&nbsp;|&#160;| /g) ?? []).length,
    images: (src.match(/<img\b/gi) ?? []).length,
    tables: (src.match(/<table\b/gi) ?? []).length,
    indentPct: src.length ? Math.round((indent / src.length) * 100) : 0,
  };
}

export function checkEmail(src: string): Finding[] {
  const out: Finding[] = [];
  if (!src.trim()) return out;

  const { tags, lineOf } = parse(src);
  const stats = getStats(src);
  const add = (id: string, level: Level, title: string, detail: string, lines: number[] = []) =>
    out.push({ id, level, title, detail, lines: [...new Set(lines)].sort((a, b) => a - b) });
  const linesOf = (re: RegExp) => [...src.matchAll(re)].map((m) => lineOf(m.index));

  // ── Size and transport ──────────────────────────────────────────────
  const kb = (stats.bytes / 1024).toFixed(1);
  if (stats.bytes > GMAIL_CLIP_BYTES) {
    add(
      "size",
      "fail",
      `${kb}KB is over Gmail's clip limit`,
      "Gmail cuts messages off at about 102KB and hides the rest behind a link. Whatever sits at the bottom (often the unsubscribe link and the tracking pixel) is lost.",
    );
  } else if (stats.bytes > GMAIL_CLIP_BYTES * 0.8) {
    add(
      "size",
      "warn",
      `${kb}KB is close to Gmail's 102KB clip limit`,
      "The sending platform adds link tracking and its own footer, so the delivered message will be larger than this file.",
    );
  }

  const longLines = src
    .split("\n")
    .map((line, i) => (line.length > SMTP_LINE_LIMIT ? i + 1 : 0))
    .filter(Boolean);
  if (longLines.length) {
    add(
      "line-length",
      "fail",
      `${plural(longLines.length, "line")} longer than 998 characters`,
      "The mail standard caps a line at 998 characters. A server that enforces it wraps the line wherever it falls, which can split a tag or add stray whitespace. Most platforms encode the message to avoid this, but not all.",
      longLines,
    );
  }

  const tail = /<\/html\s*>([\s\S]*)$/i.exec(src);
  if (tail && tail[1].trim()) {
    add(
      "after-html",
      "warn",
      "Content after the closing html tag",
      "Anything after </html> is rendered at the very bottom of the message by most clients.",
      [lineOf(src.length - tail[1].trimStart().length)],
    );
  }

  // ── Whitespace characters ───────────────────────────────────────────
  const nbspRuns = linesOf(/(?:(?:&nbsp;|&#160;| )\s*){3,}/g);
  if (nbspRuns.length) {
    add(
      "nbsp-runs",
      "warn",
      `${plural(nbspRuns.length, "run")} of three or more non-breaking spaces`,
      "Each one is a character that takes up a line of height, so a long run reads as a blank block. If you did not type them, a rich-text editor or the sending platform put them there.",
      nbspRuns,
    );
  }
  const rawNbsp = linesOf(/ /g);
  if (rawNbsp.length) {
    add(
      "nbsp-raw",
      "info",
      `${plural(rawNbsp.length, "raw non-breaking space character")}`,
      "These are the invisible character itself, not the &nbsp; entity. They usually arrive with text pasted from Word or a web page.",
      rawNbsp,
    );
  }
  const zeroWidth = linesOf(/[​‌‍﻿]|&zwnj;|&#8204;|&#847;|&#8203;/g);
  if (zeroWidth.length) {
    add(
      "zero-width",
      "info",
      `${plural(zeroWidth.length, "zero-width character")}`,
      "Normal in a hidden preheader, where they pad out the inbox preview. Anywhere else they are worth a look.",
      zeroWidth,
    );
  }
  if (stats.indentPct >= 30) {
    add(
      "indent",
      "info",
      `${stats.indentPct}% of the file is indentation`,
      "Harmless when the file is sent exactly as it is. If the platform passes templates through a rich-text editor, long runs of spaces are what can get turned into non-breaking spaces. Minifying the file removes the risk and the weight.",
    );
  }

  // ── Document basics ─────────────────────────────────────────────────
  if (!/^\s*<!doctype/i.test(src)) {
    add("doctype", "warn", "No doctype", "Without one, webmail clients fall back to quirks rendering and spacing changes.");
  }
  const html = tags.find((t) => t.name === "html");
  if (html && !html.attrs.lang) {
    add("lang", "info", "No lang on the html tag", "Screen readers use it to pick the right pronunciation.", [html.line]);
  }
  const metas = tags.filter((t) => t.name === "meta");
  if (!metas.some((t) => "charset" in t.attrs || /charset/i.test(t.attrs.content ?? ""))) {
    add("charset", "warn", "No charset meta tag", "Without it, accented letters, pound signs and curly quotes can arrive as garbage.");
  }
  if (!metas.some((t) => t.attrs.name?.toLowerCase() === "viewport")) {
    add("viewport", "info", "No viewport meta tag", "Mobile clients that honour it will lay the email out at desktop width and shrink it.");
  }
  if (!tags.some((t) => t.name === "title")) {
    add("title", "info", "No title tag", "Some clients and screen readers show it; it is also the browser tab name in the web version.");
  }
  const scripts = tags.filter((t) => t.name === "script");
  if (scripts.length) {
    add("script", "fail", "Script tags", "Every email client removes scripts, and they raise the spam score.", scripts.map((t) => t.line));
  }

  // ── Outlook on Windows ──────────────────────────────────────────────
  if (!/PixelsPerInch/i.test(src)) {
    add(
      "ppi",
      "warn",
      "No PixelsPerInch setting for Outlook",
      "On Windows displays scaled to 125% or 150%, Outlook resizes images and they go soft. The OfficeDocumentSettings block with PixelsPerInch 96 in the head stops it.",
    );
  } else if (html && !("xmlns:o" in html.attrs)) {
    add(
      "xmlns-o",
      "warn",
      "PixelsPerInch is set but the Office namespace is missing",
      'The setting needs xmlns:o="urn:schemas-microsoft-com:office:office" on the html tag to be read.',
      [html.line],
    );
  }

  const ghostNoCss = tags.filter(
    (t) =>
      t.mso &&
      (t.name === "table" || t.name === "td") &&
      /^\d+$/.test(t.attrs.width ?? "") &&
      !styleHas(t.attrs.style, "width"),
  );
  if (ghostNoCss.length) {
    add(
      "ghost-width",
      "warn",
      "Outlook-only tables sized by attribute alone",
      "On scaled Windows displays Outlook enlarges text and CSS sizes but not width attributes, so the layout stays narrow while its contents grow. Repeat the width in a style attribute as well.",
      ghostNoCss.map((t) => t.line),
    );
  }

  const maxWidth = tags.filter((t) => !t.mso && t.name === "table" && styleHas(t.attrs.style, "max-width"));
  if (maxWidth.length && !tags.some((t) => t.mso && t.name === "table")) {
    add(
      "max-width",
      "warn",
      "max-width with no fixed-width table for Outlook",
      "Outlook on Windows ignores max-width, so the email runs the full width of the window. Wrap it in a fixed-width table inside an mso conditional comment.",
      maxWidth.map((t) => t.line),
    );
  }

  const spacerCells = [...src.matchAll(/<td\b([^>]*)>\s*(?:&nbsp;|&#160;| )\s*<\/td>/gi)].filter((m) => {
    const sized = /\bheight\s*=/.test(m[1]) || /height\s*:/.test(m[1]);
    return sized && !/font-size\s*:/.test(m[1]) && !/line-height\s*:/.test(m[1]);
  });
  if (spacerCells.length) {
    add(
      "spacer-cells",
      "info",
      "Spacer cells with a height but no font size",
      "Outlook on Windows will not make a cell shorter than one line of text, so the non-breaking space sets the real height. Add font-size and line-height matching the height you want.",
      spacerCells.map((m) => lineOf(m.index)),
    );
  }

  // ── Images ──────────────────────────────────────────────────────────
  const imgs = tags.filter((t) => t.name === "img" && !t.mso);
  const imgLines = (test: (t: Tag) => boolean) => imgs.filter(test).map((t) => t.line);

  const noAlt = imgLines((t) => !("alt" in t.attrs));
  if (noAlt.length) {
    add(
      "img-alt",
      "warn",
      `${plural(noAlt.length, "image")} with no alt attribute`,
      'Screen readers read out the file name, and with images blocked the space is blank. Decorative images still need alt="".',
      noAlt,
    );
  }
  const noWidth = imgLines((t) => !/^\d+$/.test(t.attrs.width ?? ""));
  if (noWidth.length) {
    add(
      "img-width",
      "warn",
      `${plural(noWidth.length, "image")} with no width attribute`,
      "Outlook on Windows shows the image at its real pixel size, so a retina image comes out double size and breaks the layout.",
      noWidth,
    );
  }
  const emptyHeight = imgLines((t) => "height" in t.attrs && !t.attrs.height.trim());
  if (emptyHeight.length) {
    add(
      "img-height-empty",
      "warn",
      `${plural(emptyHeight.length, "image")} with an empty height attribute`,
      'height="" is not a valid value and clients disagree on what it means. Remove it or give it a number.',
      emptyHeight,
    );
  }
  const noHeight = imgLines((t) => !("height" in t.attrs) && !styleHas(t.attrs.style, "height"));
  if (noHeight.length) {
    add(
      "img-height",
      "info",
      `${plural(noHeight.length, "image")} with no height`,
      "The email changes height as each image loads. Apps that measure the message once, before images arrive, can end up with the wrong scroll length.",
      noHeight,
    );
  }
  const inlineImgs = imgLines((t) => styleGet(t.attrs.style, "display") !== "block");
  if (inlineImgs.length) {
    add(
      "img-inline",
      "info",
      `${plural(inlineImgs.length, "image")} without display:block`,
      "An inline image sits on the text baseline and leaves a few pixels of gap underneath. Fine for an icon in a row of text, visible as a line when images should sit flush.",
      inlineImgs,
    );
  }
  const isMergeTag = (v: string) => /^\s*(\{\{|\*\||%%|\[\[|<%)/.test(v);
  const badSrc = imgLines((t) => {
    const s = t.attrs.src ?? "";
    return !/^(https?:|cid:|data:)/i.test(s) && !isMergeTag(s);
  });
  if (badSrc.length) {
    add(
      "img-src",
      "fail",
      `${plural(badSrc.length, "image")} without a full web address`,
      "A relative path only works on your machine. Email images need an absolute https address.",
      badSrc,
    );
  }
  const httpSrc = imgLines((t) => /^http:/i.test(t.attrs.src ?? ""));
  if (httpSrc.length) {
    add(
      "img-http",
      "warn",
      `${plural(httpSrc.length, "image")} loaded over http`,
      "Webmail runs on https and can block or flag images served without it.",
      httpSrc,
    );
  }

  // ── Tables and links ────────────────────────────────────────────────
  const tables = tags.filter((t) => t.name === "table" && !t.mso);
  const noRole = tables.filter((t) => t.attrs.role !== "presentation").map((t) => t.line);
  if (noRole.length) {
    add(
      "table-role",
      "info",
      `${plural(noRole.length, "layout table")} without role="presentation"`,
      "Screen readers announce these as data tables and read out row and column counts.",
      noRole,
    );
  }
  const noReset = tables.filter((t) => t.attrs.cellpadding !== "0" || t.attrs.cellspacing !== "0").map((t) => t.line);
  if (noReset.length) {
    add(
      "table-reset",
      "info",
      `${plural(noReset.length, "table")} without cellpadding and cellspacing set to 0`,
      "Clients apply their own default spacing between cells when these are missing.",
      noReset,
    );
  }

  const links = tags.filter((t) => t.name === "a" && !t.mso);
  const deadLinks = links.filter((t) => !t.attrs.href || t.attrs.href.trim() === "#").map((t) => t.line);
  if (deadLinks.length) {
    add("link-empty", "warn", `${plural(deadLinks.length, "link")} going nowhere`, "The href is empty or just a # placeholder.", deadLinks);
  }
  const httpLinks = links.filter((t) => /^http:/i.test(t.attrs.href ?? "")).map((t) => t.line);
  if (httpLinks.length) {
    add("link-http", "info", `${plural(httpLinks.length, "link")} using http`, "Worth switching to https where the destination supports it.", httpLinks);
  }

  // ── Web fonts and merge tags ────────────────────────────────────────
  const declaredFamilies = [...src.matchAll(/font-family\s*:\s*([^;"}]+)/gi)].map((m) => m[1].toLowerCase()).join(",");
  for (const link of tags.filter((t) => t.name === "link" && /fonts\.googleapis\.com/.test(t.attrs.href ?? ""))) {
    for (const m of (link.attrs.href ?? "").matchAll(/family=([^:&]+)/g)) {
      const family = decodeURIComponent(m[1].replace(/\+/g, " "));
      if (!declaredFamilies.includes(family.toLowerCase())) {
        add(
          `font-unused-${family}`,
          "warn",
          `${family} is loaded but never used`,
          "The stylesheet link is in the head, but no font-family in the email names it. It is a wasted request, and the email is not using the font you expect.",
          [link.line],
        );
      }
    }
  }

  const mergeTags = [...new Set([...src.matchAll(/\{\{[^{}]+\}\}|\*\|[^|*]+\|\*|%%[^%]+%%/g)].map((m) => m[0]))];
  if (mergeTags.length) {
    add(
      "merge-tags",
      "info",
      `${plural(mergeTags.length, "merge tag")}: ${mergeTags.slice(0, 6).join(", ")}${mergeTags.length > 6 ? " and more" : ""}`,
      "These are filled in by the sending platform. Long values (a long place name, a long first name) are worth testing, because they change line wrapping and the height of the email.",
      linesOf(/\{\{[^{}]+\}\}|\*\|[^|*]+\|\*|%%[^%]+%%/g),
    );
  }

  const order: Record<Level, number> = { fail: 0, warn: 1, info: 2 };
  return out.sort((a, b) => order[a.level] - order[b.level]);
}

/* ── caniemail.com lookup ──────────────────────────────────────────────── */

export const CANIEMAIL_URL = "https://www.caniemail.com/api/data.json";

export interface CanIEmailFeature {
  slug: string;
  title: string;
  url: string;
  category: string;
  /** family → platform → version → "y" | "a #1" | "n" | "u" */
  stats: Record<string, Record<string, Record<string, string>>>;
  notes_by_num: Record<string, string> | null;
}

export interface CanIEmailData {
  last_update_date: string;
  nicenames: {
    family: Record<string, string>;
    platform: Record<string, string>;
  };
  data: CanIEmailFeature[];
}

export type Support = "y" | "a" | "n" | "u";

export interface ClientSupport {
  family: string;
  label: string;
  status: Support;
  notes: string[];
}

export interface FeatureUse {
  slug: string;
  title: string;
  url: string;
  count: number;
  lines: number[];
  support: ClientSupport[];
}

/** Longhands that caniemail only tests through their shorthand. */
const SHORTHAND_BASES = ["padding", "margin", "border", "background", "text-decoration", "list-style", "outline"];

const VALUE_FEATURES: [RegExp, string][] = [
  [/\bcalc\(/, "css-unit-calc"],
  [/\bclamp\(/, "css-function-clamp"],
  [/\bvar\(/, "css-variables"],
  [/linear-gradient\(/, "css-linear-gradient"],
  [/radial-gradient\(/, "css-radial-gradient"],
  [/\brgba\(/, "css-rgba"],
  [/\dvw\b/, "css-unit-vw"],
  [/\dvh\b/, "css-unit-vh"],
  [/\drem\b/, "css-unit-rem"],
  [/!important/, "css-important"],
];

const AT_RULES: Record<string, string> = {
  media: "css-at-media",
  "font-face": "css-at-font-face",
  import: "css-at-import",
  supports: "css-at-supports",
  keyframes: "css-at-keyframes",
};

const ELEMENT_FEATURES: Record<string, string> = {
  ul: "html-lists",
  ol: "html-lists",
  h1: "html-h1-h6",
  h2: "html-h1-h6",
  h3: "html-h1-h6",
  h4: "html-h1-h6",
  h5: "html-h1-h6",
  h6: "html-h1-h6",
  header: "html-semantics",
  footer: "html-semantics",
  main: "html-semantics",
  section: "html-semantics",
  article: "html-semantics",
  nav: "html-semantics",
  aside: "html-semantics",
};

const ATTRIBUTE_FEATURES: Record<string, string> = {
  background: "html-background",
  target: "html-target",
  srcset: "html-srcset",
  role: "html-role",
  lang: "html-lang",
  dir: "html-dir",
  hidden: "html-hidden",
  loading: "html-loading-attribute",
  align: "html-align",
  valign: "html-valign",
  cellpadding: "html-cellpadding",
  cellspacing: "html-cellspacing",
  width: "html-width",
  height: "html-height",
  "aria-label": "html-aria-label",
  "aria-hidden": "html-aria-hidden",
  "aria-describedby": "html-aria-describedby",
  "aria-labelledby": "html-aria-labelledby",
  "aria-live": "html-aria-live",
};

function plainNote(note: string): string {
  return note.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`/g, "");
}

export function matchFeatures(src: string, data: CanIEmailData): FeatureUse[] {
  if (!src.trim()) return [];
  const { tags, styles, lineOf } = parse(src);
  const bySlug = new Map(data.data.map((f) => [f.slug, f]));
  const uses = new Map<string, { count: number; lines: Set<number> }>();

  const hit = (slug: string | undefined, line: number) => {
    if (!slug || !bySlug.has(slug)) return;
    const use = uses.get(slug) ?? { count: 0, lines: new Set<number>() };
    use.count++;
    use.lines.add(line);
    uses.set(slug, use);
  };

  const propSlug = (prop: string): string | undefined => {
    if (prop.endsWith("-radius")) return "css-border-radius";
    if (bySlug.has(`css-${prop}`)) return `css-${prop}`;
    const base = SHORTHAND_BASES.find((b) => prop.startsWith(`${b}-`));
    return base && `css-${base}`;
  };

  const scanDeclarations = (css: string, line: (i: number) => number) => {
    for (const m of css.matchAll(/([a-zA-Z-]+)\s*:\s*([^;]+)/g)) {
      const prop = m[1].toLowerCase();
      const value = m[2].toLowerCase();
      const at = line(m.index);
      if (prop.startsWith("-") || prop.startsWith("mso-")) continue;
      if (prop === "display") {
        if (value.includes("flex")) hit("css-display-flex", at);
        else if (value.includes("grid")) hit("css-display-grid", at);
        else if (value.startsWith("none")) hit("css-display-none", at);
        else hit("css-display", at);
      } else {
        hit(propSlug(prop), at);
      }
      for (const [re, slug] of VALUE_FEATURES) if (re.test(value)) hit(slug, at);
    }
  };

  for (const { css, offset } of styles) {
    for (const m of css.matchAll(/@([a-z-]+)\b([^{;]*)/gi)) {
      const at = lineOf(offset + m.index);
      hit(AT_RULES[m[1].toLowerCase()], at);
      if (/prefers-color-scheme/i.test(m[2])) hit("css-at-media-prefers-color-scheme", at);
    }
    for (const m of css.matchAll(/:hover\b/g)) hit("css-pseudo-class-hover", lineOf(offset + m.index));
    for (const m of css.matchAll(/\{([^{}]*)\}/g)) {
      const start = offset + m.index + 1;
      scanDeclarations(m[1], (i) => lineOf(start + i));
    }
  }

  for (const tag of tags) {
    if (tag.mso) continue;
    hit(ELEMENT_FEATURES[tag.name] ?? `html-${tag.name}`, tag.line);
    for (const [name, value] of Object.entries(tag.attrs)) {
      hit(ATTRIBUTE_FEATURES[name], tag.line);
      if (name === "style") scanDeclarations(value, () => tag.line);
      if (name === "href" && tag.name === "a") {
        if (value.startsWith("#") && value.length > 1) hit("html-anchor-links", tag.line);
        if (/^mailto:/i.test(value)) hit("html-mailto-links", tag.line);
      }
    }
    if (tag.name === "img") {
      const src = tag.attrs.src ?? "";
      if (/^data:/i.test(src)) hit("image-base64", tag.line);
      const ext = /\.([a-z0-9]+)(?:[?#]|$)/i.exec(src)?.[1].toLowerCase();
      if (ext) hit(`image-${ext === "jpeg" ? "jpg" : ext}`, tag.line);
    }
  }

  return [...uses].map(([slug, use]) => {
    const feature = bySlug.get(slug)!;
    const support: ClientSupport[] = [];
    for (const [family, platforms] of Object.entries(feature.stats)) {
      for (const [platform, versions] of Object.entries(platforms)) {
        // Versions are listed oldest first; the last one is the current result.
        const latest = Object.values(versions).at(-1) ?? "u";
        const status = (["y", "a", "n"].includes(latest[0]) ? latest[0] : "u") as Support;
        support.push({
          family,
          label: `${data.nicenames.family[family] ?? family} ${data.nicenames.platform[platform] ?? platform}`,
          status,
          notes: [...latest.matchAll(/#(\d+)/g)]
            .map((n) => feature.notes_by_num?.[n[1]])
            .filter((n): n is string => !!n)
            .map(plainNote),
        });
      }
    }
    return {
      slug,
      title: feature.title,
      url: feature.url,
      count: use.count,
      lines: [...use.lines].sort((a, b) => a - b),
      support,
    };
  });
}
