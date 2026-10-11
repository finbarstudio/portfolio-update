/**
 * A rough simulation of what one mail client does to an email before showing
 * it. The source is rewritten the way the client is known to rewrite it:
 * CSS the client does not support is taken out (from caniemail's test data),
 * style blocks it drops are dropped, and for classic Outlook the Outlook-only
 * markup in conditional comments is switched on and everything marked "not
 * for Outlook" is switched off.
 *
 * It shows what a client REMOVES and REVEALS. It does not reproduce how the
 * client then lays the page out: classic Outlook draws with Word, and no
 * browser can imitate that. Every result is an approximation and says so.
 */
import type { CanIEmailData } from "@/lib/email-check";

export interface ClientProfile {
  id: string;
  label: string;
  /** caniemail family and platform the support data is read from */
  family: string;
  platform: string;
  /** one line on what is special about this client */
  about: string;
}

export const AS_BUILT = "browser";

export const CLIENTS: ClientProfile[] = [
  { id: "gmail-web", label: "Gmail (web)", family: "gmail", platform: "desktop-webmail", about: "Keeps style blocks in the head, drops any in the body, and drops a block that is too large or holds rules it rejects." },
  { id: "gmail-app", label: "Gmail app", family: "gmail", platform: "android", about: "As Gmail on the web, for a Google account." },
  { id: "gmail-app-other", label: "Gmail app, non-Google account", family: "gmail", platform: "android", about: "An Outlook, Yahoo or work mailbox read in the Gmail app: every style block is dropped, so only inline styles are left and no media query runs." },
  { id: "outlook-classic", label: "Classic Outlook (Windows)", family: "outlook", platform: "windows", about: "Reads the Outlook-only markup in conditional comments, ignores what is marked not for Outlook, and has no media queries, background images or rounded corners outside VML." },
  { id: "outlook-web", label: "Outlook.com", family: "outlook", platform: "outlook-com", about: "The web version of Outlook. Renders like a browser with some CSS removed." },
  { id: "yahoo", label: "Yahoo Mail", family: "yahoo", platform: "desktop-webmail", about: "Supports style blocks and simple media queries, with some CSS removed." },
  { id: "samsung", label: "Samsung Email", family: "samsung-email", platform: "android", about: "Android's Samsung mail app. Close to a browser." },
];

export interface Simulation {
  html: string;
  /** what was changed, in words, most significant first */
  changes: string[];
}

const GMAIL_STYLE_LIMIT = 16 * 1024;

/** caniemail features that are not a single CSS property and so are not stripped by name. */
const NOT_A_PROPERTY = /^(at-|pseudo-|selector-|unit-|function-|display-|.*-gradient$)|^(comments|important|variables|nesting|modern-color|rgb|rgba|sytem-ui|inert-attribute|column-layout-properties|intrinsic-size|border-radius-logical)$/;

/** Feature names that stand for several properties. */
const PROPERTY_GROUPS: Record<string, string[]> = {
  "left-right-top-bottom": ["left", "right", "top", "bottom"],
  "border-radius": ["border-radius", "border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius"],
};

function latestStatus(data: CanIEmailData, slug: string, family: string, platform: string): string {
  const feature = data.data.find((f) => f.slug === slug);
  const versions = feature?.stats?.[family]?.[platform];
  if (!versions) return "u";
  const keys = Object.keys(versions);
  return versions[keys[keys.length - 1]] ?? "u";
}

const unsupported = (data: CanIEmailData, slug: string, client: ClientProfile) => latestStatus(data, slug, client.family, client.platform).startsWith("n");

/** Every CSS property this client is recorded as not supporting. */
function unsupportedProperties(data: CanIEmailData, client: ClientProfile): Set<string> {
  const props = new Set<string>();
  for (const feature of data.data) {
    if (!feature.slug.startsWith("css-")) continue;
    const name = feature.slug.slice(4);
    if (NOT_A_PROPERTY.test(name)) continue;
    if (!unsupported(data, feature.slug, client)) continue;
    for (const prop of PROPERTY_GROUPS[name] ?? [name]) props.add(prop);
  }
  return props;
}

interface Counter {
  add(label: string, n?: number): void;
  list(): string[];
}

function counter(): Counter {
  const counts = new Map<string, number>();
  return {
    add(label, n = 1) {
      if (n > 0) counts.set(label, (counts.get(label) ?? 0) + n);
    },
    list() {
      return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([label, n]) => (n > 1 ? `${label} (${n})` : label));
    },
  };
}

/** Filters the declarations of one rule body or style attribute. */
function filterDeclarations(css: string, keep: (prop: string, value: string) => string | null): string {
  return css
    .split(";")
    .map((decl) => {
      const colon = decl.indexOf(":");
      if (colon === -1) return decl;
      const prop = decl.slice(0, colon).trim().toLowerCase();
      if (!/^[a-z-]+$/.test(prop)) return decl;
      const value = keep(prop, decl.slice(colon + 1));
      return value === null ? null : `${decl.slice(0, colon)}:${value}`;
    })
    .filter((decl): decl is string => decl !== null)
    .join(";");
}

/** Removes whole at-rule blocks (with their nested rules) whose opening line matches. */
function removeAtBlocks(css: string, test: (prelude: string) => boolean, onRemove: () => void): string {
  let out = "";
  let i = 0;
  while (i < css.length) {
    const at = css.indexOf("@", i);
    if (at === -1) break;
    const brace = css.indexOf("{", at);
    const semi = css.indexOf(";", at);
    if (brace === -1 || (semi !== -1 && semi < brace)) {
      // A statement at-rule such as @import, ended by a semicolon.
      const end = semi === -1 ? css.length : semi + 1;
      const statement = css.slice(at, end);
      out += css.slice(i, at);
      if (test(statement)) onRemove();
      else out += statement;
      i = end;
      continue;
    }
    const prelude = css.slice(at, brace);
    let depth = 1;
    let j = brace + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }
    out += css.slice(i, at);
    if (test(prelude)) onRemove();
    else out += css.slice(at, j);
    i = j;
  }
  return out + css.slice(i);
}

/** Would Outlook 2016 and later (Office version 16) show the content of this conditional comment? */
export function msoCondition(expr: string): boolean {
  const or = expr.split("|");
  if (or.length > 1) return or.some((part) => msoCondition(part));
  const and = expr.split("&");
  if (and.length > 1) return and.every((part) => msoCondition(part));
  let term = expr.trim().replace(/^\(([\s\S]*)\)$/, "$1").trim();
  if (/[|&]/.test(term)) return msoCondition(term);
  let negate = false;
  while (term.startsWith("!")) {
    negate = !negate;
    term = term.slice(1).trim().replace(/^\(([\s\S]*)\)$/, "$1").trim();
  }
  const lower = term.toLowerCase();
  let result = false;
  if (lower === "true" || lower === "mso" || lower === "vml") result = true;
  else {
    const m = /^(gte|gt|lte|lt)?\s*mso\s*(\d+)?$/.exec(lower);
    if (m) {
      const version = m[2] ? Number(m[2]) : null;
      if (version === null) result = true;
      else if (m[1] === "gte") result = 16 >= version;
      else if (m[1] === "gt") result = 16 > version;
      else if (m[1] === "lte") result = 16 <= version;
      else if (m[1] === "lt") result = 16 < version;
      else result = version === 16;
    }
  }
  return negate ? !result : result;
}

const attr = (tag: string, name: string) => new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i").exec(tag)?.slice(1).find((v) => v !== undefined) ?? "";
const styleValue = (style: string, prop: string) => new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`, "i").exec(style)?.[1].trim() ?? "";

/** Turns the common VML shapes into plain boxes a browser can draw, and drops the rest of the Office markup. */
function vmlToHtml(html: string, changes: Counter): string {
  let out = html.replace(/<xml\b[\s\S]*?<\/xml>/gi, "");
  out = out.replace(/<v:(roundrect|rect|oval)\b([^>]*)>([\s\S]*?)<\/v:\1>/gi, (_whole, shape: string, attrs: string, inner: string) => {
    const style = attr(attrs, "style");
    const href = attr(attrs, "href");
    const fillTag = /<v:fill\b[^>]*>/i.exec(inner)?.[0] ?? "";
    const image = attr(fillTag, "src");
    const fill = attr(attrs, "fillcolor") || attr(fillTag, "color");
    const stroke = /\bstroke(?:d)?\s*=\s*["']?(?:f|false)/i.test(attrs) ? "" : attr(attrs, "strokecolor");
    const width = styleValue(style, "width");
    const height = styleValue(style, "height");
    const arc = attr(attrs, "arcsize");
    const radius = shape.toLowerCase() === "oval" ? "50%" : shape.toLowerCase() === "roundrect" && arc ? (arc.endsWith("%") ? `${Math.min(50, Number.parseFloat(arc))}%` : `${Math.round((Number.parseFloat(arc) / 65536) * 100)}%`) : "0";
    const css = [
      "display:inline-block",
      "box-sizing:border-box",
      "vertical-align:middle",
      "overflow:hidden",
      width && `width:${width}`,
      height && `min-height:${height}`,
      fill && `background-color:${fill}`,
      image && `background-image:url('${image}');background-size:cover;background-position:center`,
      stroke && `border:1px solid ${stroke}`,
      radius !== "0" && `border-radius:${radius}`,
      href && height && `line-height:${height}`,
      href && "text-decoration:none",
    ]
      .filter(Boolean)
      .join(";");
    // What the shape holds: the textbox's content, or the bare text of a button.
    const body = inner
      .replace(/<v:fill\b[^>]*\/?>(?:<\/v:fill>)?/gi, "")
      .replace(/<v:stroke\b[^>]*\/?>(?:<\/v:stroke>)?/gi, "")
      .replace(/<w:anchorlock\s*\/?>/gi, "")
      .replace(/<\/?v:textbox\b[^>]*>/gi, "");
    changes.add("Drew a VML shape as a plain box");
    return href ? `<a data-ec-vml href="${href}" style="${css}">${body}</a>` : `<div data-ec-vml style="${css}">${body}</div>`;
  });
  out = out.replace(/<v:image\b([^>]*)\/?>(?:<\/v:image>)?/gi, (_whole, attrs: string) => {
    const style = attr(attrs, "style");
    changes.add("Drew a VML image as a plain image");
    return `<img data-ec-vml src="${attr(attrs, "src")}" alt="${attr(attrs, "alt")}" style="display:block;width:${styleValue(style, "width") || "auto"};height:${styleValue(style, "height") || "auto"};">`;
  });
  // Anything else from the Office namespaces has no browser equivalent.
  return out.replace(/<\/?(?:v|o|w):[a-z]+\b[^>]*>/gi, "");
}

/** Classic Outlook: switch on the Outlook-only markup, switch off what is hidden from it. */
function applyConditionalComments(src: string, changes: Counter): string {
  // <!--[if !mso]><!--> shown everywhere else <!--<![endif]-->
  let out = src.replace(/<!--\[if([^\]]*)\]>\s*<!\s*-->([\s\S]*?)<!--\s*<!\[endif\]-->/gi, (_whole, cond: string, content: string) => {
    if (msoCondition(cond)) return content;
    changes.add("Hid a block marked not for Outlook");
    return "";
  });
  // <!--[if mso]> Outlook only <![endif]-->
  out = out.replace(/<!--\[if([^\]]*)\]>([\s\S]*?)<!\[endif\]-->/gi, (_whole, cond: string, content: string) => {
    if (!msoCondition(cond)) return "";
    if (/<(?!\/?(?:xml|o:|w:))[a-z]/i.test(content)) changes.add("Showed an Outlook-only block");
    return content;
  });
  return out;
}

const CELL = /^(td|th)$/;

/** caniemail's notes for classic Outlook that depend on the element, applied to inline styles. */
function classicElementRules(tag: string, prop: string): string | null {
  // padding: "Only supported on table cells".
  if ((prop === "padding" || prop.startsWith("padding-")) && !CELL.test(tag) && tag !== "table") return "padding on an element that is not a table cell";
  // width and height: "Not supported on body, span, div, p or img elements".
  if ((prop === "width" || prop === "height") && /^(body|span|div|p|img)$/.test(tag)) return `${prop} set in CSS on a ${tag}`;
  // max-width: "Only works on table elements".
  if (prop === "max-width" && tag !== "table") return "max-width on an element that is not a table";
  // margin: "Not supported on span and body elements".
  if ((prop === "margin" || prop.startsWith("margin-")) && /^(span|body)$/.test(tag)) return `margin on a ${tag}`;
  return null;
}

export function simulate(src: string, clientId: string, data: CanIEmailData | null): Simulation {
  const client = CLIENTS.find((c) => c.id === clientId);
  if (!client || !data) return { html: src, changes: [] };
  const changes = counter();
  const classic = client.id === "outlook-classic";
  const gmail = client.family === "gmail";
  let html = src;

  if (classic) {
    html = applyConditionalComments(html, changes);
    html = vmlToHtml(html, changes);
  }

  // ── Style blocks the client throws away whole ─────────────────────────
  const bodyAt = () => /<body\b/i.exec(html)?.index ?? Number.POSITIVE_INFINITY;
  if (client.id === "gmail-app-other") {
    html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, () => {
      changes.add("Dropped a style block (non-Google account)");
      return "";
    });
  } else if (gmail) {
    const start = bodyAt();
    html = html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (whole, css: string, index: number) => {
      if (index > start) {
        changes.add("Dropped a style block placed in the body");
        return "";
      }
      if (new TextEncoder().encode(css).length > GMAIL_STYLE_LIMIT) {
        changes.add("Dropped a style block over 16KB");
        return "";
      }
      if (/@media[^{]*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*@(?:font-face|import|keyframes)/i.test(css)) {
        changes.add("Dropped a style block with @font-face, @import or @keyframes inside @media");
        return "";
      }
      return whole;
    });
  }

  // ── Linked stylesheets and at-rules ───────────────────────────────────
  if (unsupported(data, "html-link", client)) {
    html = html.replace(/<link\b[^>]*rel\s*=\s*["']?stylesheet[^>]*>/gi, () => {
      changes.add("Ignored a linked stylesheet (web fonts fall back)");
      return "";
    });
  }
  const dropProps = unsupportedProperties(data, client);
  const noMedia = unsupported(data, "css-at-media", client);
  const noDarkQuery = unsupported(data, "css-at-media-prefers-color-scheme", client);
  const noFontFace = unsupported(data, "css-at-font-face", client);
  const noImport = unsupported(data, "css-at-import", client);
  const noFlex = unsupported(data, "css-display-flex", client);
  const noGrid = unsupported(data, "css-display-grid", client);
  const noGradient = unsupported(data, "css-linear-gradient", client);
  const heightBecomesMin = client.family === "yahoo" || client.family === "aol";
  const renameHeight = (css: string) =>
    heightBecomesMin
      ? css.replace(/(^|[;{\s])height(\s*:)/gi, (_m, lead: string, colon: string) => {
          changes.add("Turned height into min-height");
          return `${lead}min-height${colon}`;
        })
      : css;

  const cleanDeclarations = (css: string, tag: string | null) =>
    filterDeclarations(css, (prop, value) => {
      // caniemail's note for Yahoo and AOL: "Replaces height by min-height". Handled below, not removed.
      if (prop === "height" && heightBecomesMin) return value;
      if (dropProps.has(prop)) {
        changes.add(`Removed ${prop}`);
        return null;
      }
      if (prop === "background" && dropProps.has("background-image") && /url\(/i.test(value)) {
        changes.add("Removed background-image");
        return value.replace(/url\([^)]*\)/gi, "").trim() || null;
      }
      if (prop === "display" && ((noFlex && /flex/i.test(value)) || (noGrid && /grid/i.test(value)))) {
        changes.add(`Removed display:${value.trim().split(/[\s!]/)[0]}`);
        return null;
      }
      if (noGradient && /gradient\(/i.test(value)) {
        changes.add("Removed a gradient");
        return null;
      }
      if (classic && tag) {
        if (prop === "mso-hide" && /all/i.test(value)) return value;
        const why = classicElementRules(tag, prop);
        if (why) {
          changes.add(`Ignored ${why}`);
          return null;
        }
      }
      return value;
    });

  html = html.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (_whole, open: string, css: string, close: string) => {
    let out = css;
    if (noImport) out = removeAtBlocks(out, (p) => /^@import\b/i.test(p), () => changes.add("Removed @import"));
    if (noFontFace) out = removeAtBlocks(out, (p) => /^@font-face\b/i.test(p), () => changes.add("Removed @font-face (web fonts fall back)"));
    if (noMedia) out = removeAtBlocks(out, (p) => /^@media\b/i.test(p), () => changes.add("Removed a media query"));
    else if (noDarkQuery) out = removeAtBlocks(out, (p) => /^@media\b[^{]*prefers-color-scheme/i.test(p), () => changes.add("Removed a prefers-color-scheme query"));
    if (client.family === "yahoo") out = out.replace(/@media\s+screen\s+yahoo\s*\{/gi, "@media screen {").replace(/\.&\s+/g, "");
    if (client.id === "outlook-web") out = out.replace(/\[class~=(["'])x_([^"']+)\1\]/g, ".$2").replace(/\\0(\s*\{)/g, "$1");
    out = out.replace(/\{([^{}]*)\}/g, (_rule, body: string) => `{${renameHeight(cleanDeclarations(body, null))}}`);
    return `${open}${out}${close}`;
  });

  // ── Inline styles ─────────────────────────────────────────────────────
  html = html.replace(/<([a-zA-Z][a-zA-Z0-9]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/g, (whole, name: string, attrs: string) => {
    // Boxes drawn in place of VML already show what Outlook shows; leave their styles alone.
    if (/\sdata-ec-vml\b/.test(attrs)) return whole;
    const m = /(\sstyle\s*=\s*)("([^"]*)"|'([^']*)')/i.exec(attrs);
    if (!m) return whole;
    const quote = m[2][0];
    let style = renameHeight(cleanDeclarations(m[3] ?? m[4] ?? "", name.toLowerCase()));
    if (classic) {
      // mso-hide:all hides the element in Outlook; mso-padding-alt is the padding Outlook uses.
      if (/mso-hide\s*:\s*all/i.test(style)) style += ";display:none";
      const alt = styleValue(style, "mso-padding-alt");
      if (alt) style += `;padding:${alt}`;
    }
    return `<${name}${attrs.slice(0, m.index)}${m[1]}${quote}${style}${quote}${attrs.slice(m.index + m[0].length)}>`;
  });

  // ── The wrappers a client puts round the email, which targeting selectors rely on ──
  const wrapBody = (before: string, open: (cls: string, id: string, style: string) => string, close: string) => {
    html = html.replace(/(<body\b)([^>]*)(>)([\s\S]*?)(<\/body>)/i, (_whole, a: string, attrs: string, c: string, inner: string, e: string) => {
      return `${a}${attrs}${c}${before}${open(attr(attrs, "class"), attr(attrs, "id"), attr(attrs, "style"))}${inner}${close}${e}`;
    });
  };
  if (gmail && client.id !== "gmail-app-other") {
    // Gmail swaps the doctype for <u></u> beside a div that takes the body's class and id.
    wrapBody("<div><u></u>", (cls, id, style) => `<div${cls ? ` class="${cls}"` : ""}${id ? ` id="${id}"` : ""}${style ? ` style="${style}"` : ""}>`, "</div></div>");
  } else if (client.id === "samsung") {
    wrapBody("", () => '<div id="MessageViewBody">', "</div>");
  }

  return { html, changes: changes.list() };
}
