/**
 * Email check (lab.finbar.studio/email): static checks on an HTML email's
 * source. Four parts:
 *
 *  - checkEmail(): email-specific checks written by hand (Outlook DPI, image
 *    gaps, stray non-breaking spaces, Gmail's limits and so on). Each finding
 *    names the clients it affects, so it can be weighted by market share.
 *  - FIXES / applyFixes(): the fixes that have one right answer, each one a
 *    pure rewrite of the source so it can be applied, undone and re-applied.
 *  - matchFeatures(): finds the HTML and CSS the email uses and looks each one
 *    up in the caniemail.com dataset, so client support comes from their test
 *    results and not from memory.
 *  - SHARE: email client market share, to say who an issue reaches.
 *
 * Everything works on the raw source with regular expressions, not a DOM, so
 * every finding can point at a line number, conditional comments (which a
 * DOM parser throws away) stay visible, and a fix rewrites only the tag it
 * is about.
 */

export type Level = "fail" | "warn" | "info";

export type FixId =
  | "ppi"
  | "xmlns-o"
  | "ghost-width"
  | "img-height-empty"
  | "table-role"
  | "table-reset"
  | "spacer-cells"
  | "line-height-rule"
  | "table-align-mso"
  | "text-size-adjust"
  | "apple-reformat"
  | "unused-fonts"
  | "minify"
  | "styles-to-head"
  | "font-fallbacks"
  | "bg-color-fallback"
  | "outlook-typography"
  | "html-lang"
  | "preheader"
  | "preheader-pad";

export interface Finding {
  id: string;
  level: Level;
  title: string;
  detail: string;
  lines: number[];
  /** the fix that clears this finding, if it has one right answer */
  fix?: FixId;
  /** client families (caniemail keys) this reaches; empty means everyone */
  affects: string[];
  /** share of opens reached, 0 to 100 */
  share: number;
  /** an accessibility finding: who it reaches is about people, not clients */
  a11y?: boolean;
  /** where the claim comes from; empty when it rests on common practice only */
  sources: Source[];
  /** which report section it belongs in: the words and links, or the markup */
  group: Group;
  /** what the finding rests on; see Basis */
  basis: Basis;
  /** for something missing: the line to add it after */
  insertAfter?: number;
  /** what to change, with the code to use where there is one */
  howTo?: HowTo;
}

export type Group = "content" | "code";

/**
 * What a finding rests on, shown beside it so nothing is taken on trust:
 *  - sourced: a standard, published test results or the client maker's own
 *    documentation says so, and the page was loaded and checked for it;
 *  - checked: true by looking at this email (a link is empty, a date has
 *    passed, two widths differ); it makes no claim about how clients behave;
 *  - practice: what email developers commonly do or believe, with no source
 *    that could be checked. These are never shown above a note.
 */
export type Basis = "sourced" | "checked" | "practice";

/** Findings that only state something visible in the file itself. */
const CHECKED_IDS = new Set([
  "after-html",
  "empty-blocks",
  "br-runs",
  "nbsp-runs",
  "nbsp-raw",
  "indent",
  "title",
  "css-selector",
  "img-src",
  "link-empty",
  "link-http",
  "social-mismatch",
  "unused-fonts",
  "link-text-mismatch",
  "link-same-text",
  "link-tracking",
  "link-utm-empty",
  "preconnect-orphan",
  "fonts-mixed",
  "ghost-mismatch",
  "line-height-zero",
  "img-height",
  "small-text",
  "img-alt-long",
  "width",
]);

/** Findings about what the email says and where its links go, as opposed to how it is built. */
const CONTENT_IDS = new Set([
  "link-empty",
  "link-http",
  "link-generic",
  "link-text-mismatch",
  "link-same-text",
  "link-tracking",
  "social-mismatch",
  "unsubscribe",
  "unsubscribe-empty",
  "ac-unsubscribe",
  "ac-sender",
  "bare-placeholder",
  "merge-tags",
  "preheader",
  "title",
  "img-alt",
  "img-alt-weak",
  "img-alt-long",
  "text-markdown",
  "text-spacing-after",
  "text-spacing-before",
  "text-repeat",
  "text-placeholder",
  "text-old-year",
  "text-weekday",
  "text-date-passed",
  "text-copyright-year",
  "text-footnote-†",
  "text-footnote-‡",
  "text-footnote-§",
  "link-query",
  "link-utm-empty",
  "link-tel",
  "preheader-unpadded",
]);

export interface HowTo {
  text: string;
  code?: string;
}


export type SourceKind = "standard" | "test data" | "client docs" | "vendor research";

export interface Source {
  label: string;
  url: string;
  /** how much weight it carries: a standard, published test results, the client maker's own docs, or a testing vendor's write-up */
  kind: SourceKind;
}

/**
 * Sourcing rule: only standards bodies, caniemail's test results, the client
 * maker's own documentation, or research published by the email-testing
 * vendors (Litmus, Email on Acid) and the original write-up of a technique.
 * Every link here was loaded and searched for the claim it backs. A check
 * with no entry is unsourced: it rests on common practice, and the report
 * says so.
 */
const wcag = (path: string, label: string): Source => ({ label, url: `https://www.w3.org/WAI/${path}`, kind: "standard" });
const cie = (slug: string, label: string): Source => ({ label: `caniemail: ${label}`, url: `https://www.caniemail.com/features/${slug}/`, kind: "test data" });

const SRC = {
  gmailCss: { label: "Google: Gmail CSS support", url: "https://developers.google.com/workspace/gmail/design/css", kind: "client docs" },
  gmailSenders: { label: "Google: email sender guidelines", url: "https://support.google.com/a/answer/81126", kind: "client docs" },
  gmailEoa: {
    label: "Email on Acid: developing for Gmail",
    url: "https://www.emailonacid.com/blog/article/email-development/12-things-you-must-know-when-developing-for-gmail-and-gmail-mobile-apps-2/",
    kind: "vendor research",
  },
  rfc5322: { label: "RFC 5322 §2.1.1, line length limits", url: "https://www.rfc-editor.org/rfc/rfc5322#section-2.1.1", kind: "standard" },
  dpi: { label: "Courtney Fantinato: correcting Outlook DPI scaling", url: "https://www.courtneyfantinato.com/correcting-outlook-dpi-scaling-issues/", kind: "vendor research" },
  wordEngine: {
    label: "Microsoft: Word 2007 HTML and CSS rendering in Outlook",
    url: "https://learn.microsoft.com/en-us/previous-versions/office/developer/office-2007/aa338201(v=office.12)",
    kind: "client docs",
  },
  pageBreak: {
    label: "Email on Acid: spacing issues in Outlook (the 23.7 inch limit)",
    url: "https://www.emailonacid.com/blog/article/email-development/horizontal_spacing_issues_in_outlook_2007_and_2010/",
    kind: "vendor research",
  },
  owaGap: {
    label: "Email on Acid: image spacing in Outlook Web App",
    url: "https://www.emailonacid.com/blog/article/email-development/two_fixes_for_image_spacing_in_outlook_web_app_owa/",
    kind: "vendor research",
  },
  vml: {
    label: "Email on Acid: VML and backgrounds",
    url: "https://www.emailonacid.com/blog/article/email-development/emailology_vector_markup_language_and_backgrounds/",
    kind: "vendor research",
  },
  buttons: { label: "Litmus: bulletproof buttons", url: "https://www.litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design", kind: "vendor research" },
  darkMode: { label: "Litmus: guide to dark mode for email", url: "https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers", kind: "vendor research" },
  preheader: { label: "Litmus: the preview text hack", url: "https://www.litmus.com/blog/the-little-known-preview-text-hack-you-may-want-to-use-in-every-email", kind: "vendor research" },
  share: { label: "Litmus: email client market share", url: "https://www.litmus.com/email-client-market-share", kind: "vendor research" },
  textSize: { label: "MDN: text-size-adjust", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust", kind: "standard" },
  sesTemplates: { label: "AWS: SES templates and rendering failures", url: "https://docs.aws.amazon.com/ses/latest/dg/send-personalized-email-api.html", kind: "client docs" },
  sesHandlebars: { label: "AWS: SES advanced personalisation (Handlebars)", url: "https://docs.aws.amazon.com/ses/latest/dg/send-personalized-email-advanced.html", kind: "client docs" },
  htmlOptionalTags: { label: "HTML standard: optional tags (a td may be left unclosed)", url: "https://html.spec.whatwg.org/multipage/syntax.html#optional-tags", kind: "standard" },
  htmlTable: { label: "HTML standard: the table element", url: "https://html.spec.whatwg.org/multipage/tables.html#the-table-element", kind: "standard" },
  htmlDimensions: { label: "HTML standard: width and height attributes", url: "https://html.spec.whatwg.org/multipage/embedded-content-other.html#dimension-attributes", kind: "standard" },
  html4Valign: { label: "HTML 4.01: the valign attribute", url: "https://www.w3.org/TR/html401/struct/tables.html#adef-valign", kind: "standard" },
  cssErrors: { label: "CSS 2: rules for handling parsing errors", url: "https://www.w3.org/TR/CSS2/syndata.html#parsing-errors", kind: "standard" },
  rfc3986: { label: "RFC 3986 §3.4, the query part of an address", url: "https://www.rfc-editor.org/rfc/rfc3986#section-3.4", kind: "standard" },
  rfc3966: { label: "RFC 3966, the tel: address", url: "https://www.rfc-editor.org/rfc/rfc3966#section-3", kind: "standard" },
  mailchimpCss: { label: "Mailchimp: client-specific CSS (iOS and the 13px minimum)", url: "https://templates.mailchimp.com/development/css/client-specific-styles", kind: "vendor research" },
  acUnsub: { label: "ActiveCampaign: why unsubscribe links are required", url: "https://help.activecampaign.com/hc/en-us/articles/115001227004", kind: "client docs" },
} satisfies Record<string, Source>;

/** Reading behind each check, keyed by finding id. No entry means unsourced. */
export const SOURCES: Record<string, Source[]> = {
  size: [SRC.gmailEoa],
  "style-size": [cie("html-style", "<style>, the 16KB note"), SRC.gmailCss],
  "styles-in-body": [cie("html-style", "<style>, not supported in the body"), SRC.gmailCss],
  "line-length": [SRC.rfc5322],
  preheader: [SRC.preheader],
  "zero-width": [SRC.preheader],
  unsubscribe: [SRC.gmailSenders],
  "ac-unsubscribe": [SRC.acUnsub],
  doctype: [cie("html-doctype", "HTML5 doctype")],
  "nested-td": [SRC.htmlOptionalTags],
  "empty-table": [SRC.htmlTable],
  "img-height-invalid": [SRC.htmlDimensions],
  "img-height-empty": [SRC.htmlDimensions],
  valign: [SRC.html4Valign],
  "css-unknown": [SRC.cssErrors],
  "css-colour-hash": [SRC.cssErrors],
  "link-query": [SRC.rfc3986],
  "link-tel": [SRC.rfc3966],
  "link-same-text": [wcag("WCAG21/Understanding/link-purpose-in-context.html", "WCAG 2.4.4, link purpose")],
  "preheader-unpadded": [SRC.preheader],

  "unsubscribe-empty": [SRC.gmailSenders, SRC.acUnsub],
  "bare-placeholder": [SRC.sesTemplates, SRC.sesHandlebars],
  "merge-tags": [SRC.sesHandlebars],
  "text-size-adjust": [SRC.mailchimpCss, SRC.textSize],
  "color-scheme": [cie("html-meta-color-scheme", "color-scheme meta"), SRC.darkMode],
  "pure-black": [SRC.darkMode],
  ppi: [SRC.dpi, cie("html-width", "width attribute, the 120 dpi note")],
  "xmlns-o": [SRC.dpi],
  "ghost-width": [cie("html-width", "width attribute, the 120 dpi note"), SRC.dpi],
  "line-height-rule": [cie("css-line-height", "line-height, the Outlook note")],
  "bg-no-vml": [cie("css-background-image", "background-image"), SRC.vml],
  "outlook-spacing": [cie("css-padding", "padding, table cells only in Outlook"), cie("css-margin", "margin")],
  "img-width": [cie("css-width", "width property, not supported on images in Outlook"), cie("html-width", "width attribute")],
  "img-inline": [SRC.owaGap],
  "img-alt": [wcag("tutorials/images/", "W3C: images tutorial")],
  "img-alt-weak": [wcag("tutorials/images/informative/", "W3C: informative images")],
  lang: [wcag("WCAG21/Understanding/language-of-page.html", "WCAG 3.1.1, language of page")],
  "table-role": [wcag("tutorials/tables/tips/", "W3C: tables, layout tables"), cie("html-role", "role attribute")],
  "link-no-name": [wcag("WCAG21/Understanding/link-purpose-in-context.html", "WCAG 2.4.4, link purpose")],
  "link-generic": [wcag("WCAG21/Understanding/link-purpose-in-context.html", "WCAG 2.4.4, link purpose")],
  headings: [wcag("WCAG21/Understanding/headings-and-labels.html", "WCAG 2.4.6, headings and labels"), cie("html-h1-h6", "h1 to h6")],
  "font-fallbacks": [cie("css-at-font-face", "@font-face, the Times New Roman note")],
};

/** Reading behind the preview notes and the rendered audit. */
export const NOTE_SOURCES = {
  height: [SRC.pageBreak, SRC.wordEngine],
  dark: [SRC.darkMode, cie("css-at-media-prefers-color-scheme", "prefers-color-scheme")],
  stylesOff: [cie("html-style", "<style>, non-Google accounts"), cie("css-at-media", "@media"), SRC.gmailCss],
  imagesOff: [wcag("tutorials/images/", "W3C: images tutorial")],
  contrast: [wcag("WCAG21/Understanding/contrast-minimum.html", "WCAG 1.4.3, contrast minimum")],
  target: [wcag("WCAG22/Understanding/target-size-minimum.html", "WCAG 2.5.8, target size minimum"), SRC.buttons],
  linkName: [wcag("WCAG21/Understanding/link-purpose-in-context.html", "WCAG 2.4.4, link purpose")],
  alt: [wcag("tutorials/images/", "W3C: images tutorial")],
  headings: [wcag("WCAG21/Understanding/headings-and-labels.html", "WCAG 2.4.6, headings and labels")],
  share: [SRC.share],
  caniemail: [{ label: "caniemail.com", url: "https://www.caniemail.com/", kind: "test data" }],
} satisfies Record<string, Source[]>;

export interface Stats {
  bytes: number;
  lines: number;
  longestLine: number;
  nbsp: number;
  images: number;
  tables: number;
  indentPct: number;
  styleBytes: number;
  /** the widest fixed width given to a table, in px */
  width: number | null;
  /** what an inbox preview line is likely to show */
  previewText: string;
  /** the sending platform, guessed from the merge-tag syntax */
  platform: string | null;
}

interface Tag {
  name: string;
  attrs: Record<string, string>;
  /** the attribute text exactly as written, for rewriting */
  rawAttrs: string;
  /** offsets of the whole tag and of its attribute text in the source */
  start: number;
  end: number;
  attrsStart: number;
  line: number;
  /** inside an Outlook-only conditional comment */
  mso: boolean;
  /** inside the body rather than the head */
  inBody: boolean;
}

interface StyleBlock {
  css: string;
  offset: number;
  /** offsets of the whole element, tags included */
  start: number;
  end: number;
  inBody: boolean;
}

interface Parsed {
  tags: Tag[];
  styles: StyleBlock[];
  lineOf: (offset: number) => number;
}

/* ── Market share ──────────────────────────────────────────────────────── */

/**
 * Share of email opens by client family, from Litmus Email Analytics for
 * July 2026 (litmus.com/email-client-market-share). Keys are caniemail
 * family names. "Apple" is Mail on iPhone, iPad and Mac together, inflated by
 * Mail Privacy Protection opening everything; Gmail includes the Android app.
 */
export const SHARE_DATE = "July 2026";
export const SHARE: Record<string, number> = {
  "apple-mail": 62.26,
  gmail: 28.48,
  outlook: 6.25,
  yahoo: 2.59,
  thunderbird: 0.23,
  orange: 0.09,
  "samsung-email": 0.02,
  aol: 0.01,
  protonmail: 0.01,
};

/** Rough split of a family's share between its apps. Litmus does not publish this; treat it as a guide. */
const PLATFORM_SPLIT: Record<string, Record<string, number>> = {
  "apple-mail": { ios: 0.92, macos: 0.08 },
  gmail: { "desktop-webmail": 0.5, ios: 0.22, android: 0.26, "mobile-webmail": 0.02 },
  outlook: { windows: 0.55, macos: 0.1, "outlook-com": 0.15, ios: 0.1, android: 0.07, "windows-mail": 0.03 },
};

export type Environment = "mobile" | "webmail" | "desktop";

export function platformEnvironment(platform: string): Environment {
  if (platform === "ios" || platform === "android" || platform === "mobile-webmail") return "mobile";
  if (platform === "desktop-webmail" || platform === "outlook-com" || platform === "webmail") return "webmail";
  return "desktop";
}

export function shareOf(family: string, platform?: string, platformsInFamily = 1): number {
  const family_ = SHARE[family] ?? 0;
  if (!platform) return family_;
  const split = PLATFORM_SPLIT[family];
  return family_ * (split ? (split[platform] ?? 0) : 1 / platformsInFamily);
}

export function formatShare(share: number): string {
  if (share >= 10) return `${Math.round(share)}%`;
  if (share >= 0.1) return `${share.toFixed(1)}%`;
  return "<0.1%";
}

/**
 * What each client does to an email in dark mode, from Litmus's dark mode
 * guide: leaves it alone and honours the email's own prefers-color-scheme
 * styles, inverts the light colours only, or inverts everything. Clients not
 * in their table (Gmail on the web, Yahoo, Samsung) are left out, not guessed.
 */
export type DarkBehaviour = "own styles" | "partial invert" | "full invert";
export const DARK_CLIENTS: { family: string; platform: string; label: string; behaviour: DarkBehaviour }[] = [
  { family: "apple-mail", platform: "ios", label: "Apple Mail on iPhone and iPad", behaviour: "own styles" },
  { family: "apple-mail", platform: "macos", label: "Apple Mail on Mac", behaviour: "own styles" },
  { family: "gmail", platform: "ios", label: "Gmail app on iOS", behaviour: "full invert" },
  { family: "gmail", platform: "android", label: "Gmail app on Android", behaviour: "partial invert" },
  { family: "outlook", platform: "windows", label: "Outlook on Windows", behaviour: "full invert" },
  { family: "outlook", platform: "windows-mail", label: "Windows Mail", behaviour: "full invert" },
  { family: "outlook", platform: "outlook-com", label: "Outlook.com", behaviour: "partial invert" },
  { family: "outlook", platform: "ios", label: "Outlook app on iOS", behaviour: "partial invert" },
  { family: "outlook", platform: "android", label: "Outlook app on Android", behaviour: "partial invert" },
  { family: "outlook", platform: "macos", label: "Outlook on Mac", behaviour: "partial invert" },
];

/** Litmus: of the opens it tracked in 2022, an average of 35% were in dark mode. */
export const DARK_MODE_USE = 0.35;

/** Share of all opens going to clients with this dark mode behaviour, and their names. */
export function darkReach(behaviour: DarkBehaviour): { share: number; clients: string[] } {
  const clients = DARK_CLIENTS.filter((c) => c.behaviour === behaviour);
  return { share: clients.reduce((n, c) => n + shareOf(c.family, c.platform), 0), clients: clients.map((c) => c.label) };
}

const ALL_FAMILIES = Object.keys(SHARE);
const sumShare = (families: string[]) => families.reduce((n, f) => n + (SHARE[f] ?? 0), 0);

/* ── Parsing ───────────────────────────────────────────────────────────── */

const OFFICE_NS = "urn:schemas-microsoft-com:office:office";
const PPI_BLOCK =
  "<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->";
const TEXT_SIZE_STYLE = "<style>body{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}</style>";
const APPLE_REFORMAT_META = '<meta name="x-apple-disable-message-reformatting">';
const NBSP = /&nbsp;|&#160;|\xa0/;
const SPACER_CELL = new RegExp(`<td\\b([^>]*)>(\\s*(?:${NBSP.source})\\s*)</td>`, "gi");
const EMPTY_PARAGRAPH = new RegExp(`<(p|div)\\b[^>]*>(?:\\s|<br\\s*/?>|${NBSP.source})*</\\1>`, "gi");
const BR_RUN = /(?:<br\s*\/?>\s*){3,}/gi;
const GENERIC_FONTS = /\b(serif|sans-serif|monospace|cursive|fantasy|system-ui)\b/i;
/** {{x}} (most platforms), *|X|* (Mailchimp), %%x%% (SendGrid), %X% (ActiveCampaign) */
const MERGE_TAG = /\{\{[^{}]+\}\}|\*\|[^|*]+\|\*|%%[^%\s]+%%|%[A-Z][A-Z0-9_-]*%/g;
const OUTLOOK_TYPOGRAPHY_BLOCK =
  '<!--[if mso]><xml><w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"><w:DontUseAdvancedTypographyReadingMail/></w:WordDocument></xml><![endif]-->';
const HTML_ELEMENTS = new Set(
  "html body head table thead tbody tfoot tr td th a img p div span ul ol li h1 h2 h3 h4 h5 h6 strong em b i u s br hr center font small big sup sub blockquote pre code label button input form v o w".split(" "),
);

const GMAIL_CLIP_BYTES = 102 * 1024;
const GMAIL_STYLE_BYTES = 16 * 1024;
const SMTP_LINE_LIMIT = 998;
const USUAL_WIDTH = 700;

/** Outlook on Windows draws a page-break line through content taller than this. */
export const OUTLOOK_PAGE_HEIGHT = 1790;

const SPACER_ROW = '<tr>\n  <td height="20" style="font-size:1px; line-height:20px; mso-line-height-rule:exactly;">&nbsp;</td>\n</tr>';

/**
 * The suggested change for each check, keyed by finding id. Each follows the
 * same sources as the check it belongs to; where the check is unsourced, so
 * is the suggestion.
 */
const HOW_TO: Record<string, HowTo> = {
  size: { text: "Minify the file, delete CSS rules nothing uses, and shorten long tracking URLs. If it is still over, split the content across two emails." },
  "style-size": { text: "Delete rules nothing uses (most templates carry a lot), and put anything that is not a media query inline on the element." },
  "styles-in-body": { text: "Move the block into the head. Gmail only reads style blocks there." },
  "nested-at-rules": {
    text: "Give the at-rule its own style block at the top level, before the media queries.",
    code: "<style>\n  @font-face { font-family: 'Brand'; src: url(https://…/brand.woff2) format('woff2'); }\n</style>\n<style>\n  @media only screen and (max-width: 599px) { … }\n</style>",
  },
  "line-length": { text: "Break the line. A line break between tags or between attributes is safe; inside a long paragraph, break at a space." },
  "after-html": { text: "Move it inside the body, or delete it." },
  "empty-blocks": {
    text: "Delete it. If the gap is wanted, use a spacer row with a fixed height so it is the same in every client. If it keeps coming back, the editor is adding it: turn off automatic paragraphs in the editor's settings.",
    code: SPACER_ROW,
  },
  "br-runs": { text: "Replace the run with one spacer row of the height you want.", code: SPACER_ROW },
  "nbsp-runs": { text: "Delete the run. For horizontal space use padding on the cell; for vertical space use a spacer row.", code: SPACER_ROW },
  "nbsp-raw": { text: "Replace each with a normal space, or with &nbsp; where two words must stay together." },
  "zero-width": { text: "Delete them unless they are padding out a preheader." },
  indent: { text: "Minify before sending and keep the indented file as your working copy." },
  doctype: { text: "Make it the first line of the file.", code: "<!DOCTYPE html>" },
  lang: { text: "Set it to the language the email is written in.", code: '<html lang="en">' },
  charset: { text: "Add it as the first thing in the head.", code: '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' },
  viewport: { text: "Add it to the head.", code: '<meta name="viewport" content="width=device-width, initial-scale=1">' },
  title: { text: "Add it to the head. The subject line is a good default.", code: "<title>Your subject line</title>" },
  script: { text: "Delete it. Nothing in an email can run script." },
  preheader: {
    text: "Type the line into Set the preview line in the source panel, or add this straight after the body tag. Aim for 40 to 90 characters that add to the subject, not repeat it.",
    code: '<div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">Your preview line</div>',
  },
  unsubscribe: { text: "Add a visible unsubscribe link in the footer. Gmail and Yahoo also expect bulk senders to support one-click unsubscribe, which the sending platform sets up in the message headers." },
  "ac-unsubscribe": { text: "Add ActiveCampaign's tag as the link address in the footer.", code: '<a href="%UNSUBSCRIBELINK%" style="color:#e2187c;">unsubscribe</a>' },
  "ac-sender": { text: "Add the tag to the footer; ActiveCampaign fills in the postal address from the account.", code: "%SENDER-INFO-SINGLELINE%" },
  "text-size-adjust": { text: "Add the rule to a style block in the head.", code: "body { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }" },
  "apple-reformat": { text: "Add it to the head.", code: '<meta name="x-apple-disable-message-reformatting">' },
  "data-detectors": {
    text: "Add the rule to a style block in the head.",
    code: "a[x-apple-data-detectors] {\n  color: inherit !important;\n  text-decoration: none !important;\n  font: inherit !important;\n}",
  },
  "color-scheme": {
    text: "Add both tags to the head, then write your dark colours in a prefers-color-scheme media query. Without the tags the media query is ignored.",
    code: '<meta name="color-scheme" content="light dark">\n<meta name="supported-color-schemes" content="light dark">\n<style>\n  @media (prefers-color-scheme: dark) {\n    .bg { background-color: #0a0a33 !important; }\n    .text { color: #ffffff !important; }\n  }\n</style>',
  },
  "pure-black": { text: "There is no setting that stops a full invert. Check the email in Dark: inverted, and make sure logos and icons still read on a light background (a transparent PNG with a pale outline survives both)." },
  ppi: {
    text: "Add this as the first thing in the head, and the Office namespace to the html tag.",
    code: `<html xmlns:o="${OFFICE_NS}">\n<head>\n<!--[if gte mso 9]><xml>\n  <o:OfficeDocumentSettings>\n    <o:AllowPNG/>\n    <o:PixelsPerInch>96</o:PixelsPerInch>\n  </o:OfficeDocumentSettings>\n</xml><![endif]-->`,
  },
  "xmlns-o": { text: "Add the namespace to the html tag.", code: `<html xmlns:o="${OFFICE_NS}">` },
  "ghost-width": { text: "Repeat every width attribute inside the Outlook conditional as a CSS width.", code: '<table width="650" style="width:650px;" …>\n<td width="650" style="width:650px;" …>' },
  "max-width": {
    text: "Wrap the fluid table in a fixed-width one that only Outlook sees.",
    code: '<!--[if (gte mso 9)|(IE)]>\n<table role="presentation" align="center" width="650" style="width:650px;" cellpadding="0" cellspacing="0" border="0"><tr><td>\n<![endif]-->\n<table role="presentation" width="100%" style="max-width:650px;" …>\n  …\n</table>\n<!--[if (gte mso 9)|(IE)]>\n</td></tr></table>\n<![endif]-->',
  },
  width: { text: "Bring the outer table down to 600 to 650px." },
  "spacer-cells": { text: "Give the cell a line-height equal to its height and a 1px font-size.", code: '<td height="16" style="font-size:1px; line-height:16px; mso-line-height-rule:exactly;">&nbsp;</td>' },
  "line-height-rule": { text: "Add the rule beside every pixel line-height.", code: "line-height: 20px; mso-line-height-rule: exactly;" },
  "outlook-typography": {
    text: "Add this to the head.",
    code: OUTLOOK_TYPOGRAPHY_BLOCK.replace(/></g, ">\n<"),
  },
  "table-align-mso": { text: "Add both properties to the floated table.", code: '<table align="left" style="mso-table-lspace:0pt; mso-table-rspace:0pt;" …>' },
  "bg-no-vml": {
    text: "Keep the CSS background for everyone else and repeat the image in VML for Outlook. Set the width and height to the size of the area, and a fill colour for when images are off.",
    code: '<td background="https://…/bg.png" bgcolor="#080830" style="background-image:url(https://…/bg.png); background-size:cover;">\n<!--[if gte mso 9]>\n<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:650px; height:300px;">\n<v:fill type="frame" src="https://…/bg.png" color="#080830" />\n<v:textbox inset="0,0,0,0">\n<![endif]-->\n  … content …\n<!--[if gte mso 9]>\n</v:textbox>\n</v:rect>\n<![endif]-->\n</td>',
  },
  "outlook-spacing": { text: "Move the spacing onto the table cell that holds the element. Outlook only honours padding on cells.", code: '<td style="padding: 20px 0 10px 0;">\n  <p style="margin:0;">…</p>\n</td>' },
  "img-alt": { text: "Describe what the image says or shows. If it is purely decorative, give it an empty alt so screen readers skip it.", code: '<img src="…" alt="Find your space" …>\n<img src="…" alt="" …>  <!-- decorative -->' },
  "img-alt-weak": { text: "Rewrite it as what a person would say the image shows.", code: '<img src="…" alt="Couple collecting the keys to their first home" …>' },
  "img-alt-long": { text: "Cut it to a short description and move the detail into the body copy." },
  "img-width": { text: "Add the width you want it displayed at, in pixels. For a retina image that is half the file's pixel width.", code: '<img src="…" width="90" style="display:block;" alt="…">' },
  "img-height-empty": { text: "Remove the attribute." },
  "img-height-invalid": { text: 'Take it out of the attribute and put it in the style.', code: '<img src="…" width="650" style="display:block; width:100%; height:auto;" alt="…">' },
  "img-height": { text: "For fixed-size images such as logos and icons, add the height as an attribute so the space is reserved before the image loads. Leave it off images that scale with the screen." },
  "img-inline": {
    text: "Add display:block to images that should sit flush. For Outlook.com, which ignores it, also add align.",
    code: '<img src="…" width="650" align="left" style="display:block; margin:0;" alt="…">',
  },
  "img-src": { text: "Upload the image and use its full https address." },
  "img-http": { text: "Change the address to https." },
  "table-role": { text: "Add it to every table used for layout.", code: '<table role="presentation" cellpadding="0" cellspacing="0" border="0" …>' },
  "table-reset": { text: "Add both attributes to every table.", code: '<table role="presentation" cellpadding="0" cellspacing="0" border="0" …>' },
  "link-empty": { text: "Give the link a real address, or remove the link." },
  "link-http": { text: "Change the address to https if the site supports it." },
  "link-color": { text: "Put the colour, and the underline if you want one, on the link itself.", code: '<a href="…" style="color:#e2187c; text-decoration:underline;">…</a>' },
  "link-no-name": {
    text: "Say where the link goes, in the image's alt text or an aria-label. If it is an arrow beside a text link to the same place, hide the duplicate from screen readers instead.",
    code: '<a href="…"><img src="arrow.png" alt="Read about the new scheme" …></a>\n<a href="…" aria-hidden="true" tabindex="-1"><img src="arrow.png" alt="" …></a>  <!-- duplicate -->',
  },
  "link-generic": { text: "Rewrite the link text so it makes sense on its own.", code: '<a href="…">View my account</a>' },
  headings: {
    text: "Mark the main title and section titles as headings. Reset the margins so they look the same as now.",
    code: '<h1 style="margin:0; font-size:32px; line-height:38px; font-weight:bold;">You\'re in</h1>\n<td role="heading" aria-level="2" …>What happens next</td>  <!-- or, on a cell -->',
  },
  "small-text": { text: "Raise it to at least 12px, with a line-height of about 1.4 times the size." },
  "unused-fonts": { text: "Remove the link, or name the font first in the font-family where you want it used." },
  "font-fallbacks": { text: "End every font-family with fonts every device has and a generic family.", code: "font-family: Poppins, Verdana, Arial, sans-serif;" },
  "merge-tags": {
    text: "Send yourself a test with the longest realistic value in each tag, and check the layout holds. With Amazon SES templates, every tag must be given a value when the email is sent, or SES accepts the message and then fails to deliver it.",
  },
};

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
  const bodyStart = /<body\b/i.exec(src)?.index ?? Number.POSITIVE_INFINITY;

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
    styles.push({
      css: m[1],
      offset: m.index + m[0].indexOf(m[1]),
      start: m.index,
      end: m.index + m[0].length,
      inBody: m.index > bodyStart,
    });
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
      rawAttrs: m[2],
      start: m.index,
      end: m.index + m[0].length,
      attrsStart: m.index + 1 + m[1].length,
      line: lineOf(m.index),
      mso: within(msoRanges, m.index),
      inBody: m.index > bodyStart,
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

/** The height a spacer cell asks for, if it has one and sets no text size. */
function spacerHeight(rawAttrs: string): number | null {
  if (/font-size\s*:/.test(rawAttrs) || /line-height\s*:/.test(rawAttrs)) return null;
  const m = /\bheight\s*=\s*["']?(\d+)/.exec(rawAttrs) ?? /height\s*:\s*(\d+)px/.exec(rawAttrs);
  return m ? Number(m[1]) : null;
}

function declaredFamilies(src: string): string {
  return [...src.matchAll(/font-family\s*:\s*([^;"}]+)/gi)].map((m) => m[1].toLowerCase()).join(",");
}

function isGoogleFontLink(tag: Tag): boolean {
  return tag.name === "link" && !tag.mso && /fonts\.googleapis\.com\/css/.test(tag.attrs.href ?? "");
}

function linkFamilies(link: Tag): string[] {
  return [...(link.attrs.href ?? "").matchAll(/family=([^:&]+)/g)].map((m) => decodeURIComponent(m[1].replace(/\+/g, " ")));
}

/** A font-family value that names real fonts but ends without a generic family. */
function needsFallback(value: string): boolean {
  return !GENERIC_FONTS.test(value) && !/\b(inherit|initial|unset|revert)\b|var\(/i.test(value);
}

function isUnusedFontLink(tag: Tag, declared: string): boolean {
  return isGoogleFontLink(tag) && linkFamilies(tag).every((f) => !declared.includes(f.toLowerCase()));
}

/** A line-height in px on an element that does not tell Outlook to keep it exact. */
function needsLineHeightRule(tag: Tag): boolean {
  return !tag.mso && !isHiddenElement(tag) && /line-height\s*:\s*\d+(\.\d+)?px/i.test(tag.attrs.style ?? "") && !styleHas(tag.attrs.style, "mso-line-height-rule");
}

function isAlignedTable(tag: Tag): boolean {
  return !tag.mso && tag.name === "table" && /^(left|right)$/i.test(tag.attrs.align ?? "") && !styleHas(tag.attrs.style, "mso-table-lspace");
}

function isHiddenElement(tag: Tag): boolean {
  return styleGet(tag.attrs.style, "display").startsWith("none");
}

function isHiddenPreheader(tag: Tag): boolean {
  const s = tag.attrs.style ?? "";
  return styleGet(s, "display").startsWith("none") && (styleHas(s, "max-height") || styleHas(s, "mso-hide") || styleHas(s, "max-width"));
}

function hasBackgroundImage(tag: Tag): boolean {
  return styleHas(tag.attrs.style, "background-image") || "background" in tag.attrs || /url\(/i.test(styleGet(tag.attrs.style, "background"));
}

function hasBackgroundColor(tag: Tag): boolean {
  return "bgcolor" in tag.attrs || styleHas(tag.attrs.style, "background-color") || /(^|\s)(#[0-9a-f]{3,8}|rgb)/i.test(styleGet(tag.attrs.style, "background"));
}

function isTextLink(tag: Tag, src: string): boolean {
  return tag.name === "a" && !tag.mso && !/^\s*<img\b/i.test(src.slice(tag.end, tag.end + 200));
}

function decodeEntities(text: string): string {
  return text
    .replace(new RegExp(NBSP.source, "g"), " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&zwnj;|&#8204;|&#847;|&#8203;|[​‌‍͏﻿]/g, "");
}

/** The first visible text, which is what inbox preview lines show when there is no preheader. */
function previewText(src: string): string {
  const body = /<body\b[^>]*>([\s\S]*)<\/body>/i.exec(src)?.[1] ?? src;
  const text = body
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(style|script|title)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(text).replace(/\s+/g, " ").trim().slice(0, 110);
}

function widestTable(tags: Tag[]): number | null {
  let widest: number | null = null;
  for (const t of tags) {
    if (t.name !== "table") continue;
    const candidates = [t.attrs.width ?? "", styleGet(t.attrs.style, "width"), styleGet(t.attrs.style, "max-width")];
    for (const c of candidates) {
      const m = /^(\d+)(px)?$/.exec(c.trim());
      if (m && Number(m[1]) >= 320 && (widest === null || Number(m[1]) > widest)) widest = Number(m[1]);
    }
  }
  return widest;
}

/** Stand-in values for the preview, so a merge tag shows as it would once delivered. */
const SAMPLE_VALUES: [RegExp, string][] = [
  [/^(FIRSTNAME|FNAME|FIRST)$/, "Nick"],
  [/^(LASTNAME|LNAME|SURNAME|LAST)$/, "Lieb"],
  [/^(FULLNAME|NAME|CONTACTNAME)$/, "Nick Lieb"],
  [/^(EMAIL|EMAILADDRESS)$/, "nick.lieb@example.com"],
  [/^(LOCATION|DEVELOPMENT|PROPERTY|PROPERTYNAME)$/, "Seaburn, Sunderland"],
  [/^(CODE|OTP|PASSCODE|VERIFICATIONCODE)$/, "482913"],
  [/^(POSTCODE)$/, "CR0 2AB"],
];

/**
 * An all-capitals placeholder word sitting in the text with no merge syntax
 * round it, such as "Dear FIRSTNAME,". Either the sender swaps the bare word
 * itself, or it reaches the reader exactly like that.
 */
const BARE_PLACEHOLDER = /(?<![%{|*\w-])(FIRSTNAME|FIRST_NAME|LASTNAME|LAST_NAME|SURNAME|FULLNAME|USERNAME|EMAIL|LOCATION|POSTCODE|CODE)(?![%}|*\w-])/g;

/** The body's visible text as runs between tags, each with its offset in the source. */
function textRuns(src: string): { text: string; index: number }[] {
  const bodyStart = /<body\b[^>]*>/i.exec(src);
  const from = bodyStart ? bodyStart.index + bodyStart[0].length : 0;
  const runs: { text: string; index: number }[] = [];
  let last = from;
  const push = (end: number) => {
    const raw = src.slice(last, end);
    if (raw.trim()) runs.push({ text: raw, index: last });
  };
  for (const m of src.matchAll(/<!--[\s\S]*?-->|<(style|script|title)\b[^>]*>[\s\S]*?<\/\1>|<[^>]+>/gi)) {
    if (m.index < from) continue;
    push(m.index);
    last = m.index + m[0].length;
  }
  push(src.length);
  return runs;
}

/** Matches of BARE_PLACEHOLDER that are in the body's visible text, not inside a tag, style block or comment. */
function barePlaceholders(src: string): { word: string; index: number }[] {
  const bodyStart = /<body\b/i.exec(src)?.index ?? 0;
  const hidden: [number, number][] = [...src.matchAll(/<!--[\s\S]*?-->|<(style|script|title)\b[^>]*>[\s\S]*?<\/\1>|<[^>]+>/gi)].map((m) => [m.index, m.index + m[0].length]);
  return [...src.matchAll(BARE_PLACEHOLDER)]
    .filter((m) => m.index > bodyStart && !hidden.some(([a, b]) => m.index >= a && m.index < b))
    .filter((m) => {
      // In a line set in capitals ("USE CODE SAVE10") the word is just a word.
      const before = /([A-Za-z]{2,})[^A-Za-z<>]*$/.exec(src.slice(Math.max(0, m.index - 40), m.index))?.[1];
      const after = /^[^A-Za-z<>]*([A-Za-z]{2,})/.exec(src.slice(m.index + m[1].length, m.index + m[1].length + 40))?.[1];
      return ![before, after].some((w) => w && w === w.toUpperCase());
    })
    .map((m) => ({ word: m[1], index: m.index }));
}

export interface SampleFill {
  src: string;
  /** "%FIRSTNAME% as Nick" */
  filled: string[];
  /** tags with no stand-in, shown as written */
  left: string[];
  /** bare placeholder words filled in too: "FIRSTNAME as Nick" */
  bare: string[];
}

/** For the preview only: the output keeps its merge tags. */
export function fillMergeTags(src: string): SampleFill {
  const filled = new Set<string>();
  const left = new Set<string>();
  const out = src.replace(MERGE_TAG, (tag) => {
    const key = tag.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const value = SAMPLE_VALUES.find(([re]) => re.test(key))?.[1];
    if (!value) {
      left.add(tag);
      return tag;
    }
    filled.add(`${tag} as ${value}`);
    return value;
  });
  // Bare words next, from the end so earlier offsets stay true.
  const bare = new Set<string>();
  let withBare = out;
  for (const hit of barePlaceholders(out).reverse()) {
    const value = SAMPLE_VALUES.find(([re]) => re.test(hit.word.replace(/_/g, "")))?.[1];
    if (!value) continue;
    bare.add(`${hit.word} as ${value}`);
    withBare = withBare.slice(0, hit.index) + value + withBare.slice(hit.index + hit.word.length);
  }
  return { src: withBare, filled: [...filled], left: [...left], bare: [...bare] };
}


/* ── Dates in the copy ─────────────────────────────────────────────────── */

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONTH_RE = "(January|February|March|April|May|June|July|August|September|October|November|December)";
const DAY_RE = "(\\d{1,2})(?:st|nd|rd|th)?";
const WEEKDAY_RE = "(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)";
/** "Saturday 19th September", "September 19th", "19 September 2026"; groups: weekday, day, month, month, day, year */
const WRITTEN_DATE = new RegExp(`(?:${WEEKDAY_RE},?\\s+)?(?:${DAY_RE}\\s+(?:of\\s+)?${MONTH_RE}|${MONTH_RE}\\s+${DAY_RE})(?:,?\\s+(20\\d{2}))?`, "gi");
/** 31.10.26 or 31/10/2026, day first */
const NUMERIC_DATE = /\b(\d{1,2})[./](\d{1,2})[./](\d{2}|20\d{2})\b/g;

interface FoundDate {
  text: string;
  weekday: number | null;
  day: number;
  month: number;
  year: number | null;
}

function findDates(text: string): FoundDate[] {
  const found: FoundDate[] = [];
  for (const m of text.matchAll(WRITTEN_DATE)) {
    const day = Number(m[2] ?? m[5]);
    const month = MONTHS.indexOf((m[3] ?? m[4]).toLowerCase());
    if (day < 1 || day > 31 || month < 0) continue;
    found.push({ text: m[0].trim(), weekday: m[1] ? WEEKDAYS.indexOf(m[1].toLowerCase()) : null, day, month, year: m[6] ? Number(m[6]) : null });
  }
  for (const m of text.matchAll(NUMERIC_DATE)) {
    const day = Number(m[1]);
    const month = Number(m[2]) - 1;
    if (day < 1 || day > 31 || month < 0 || month > 11) continue;
    found.push({ text: m[0], weekday: null, day, month, year: m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]) });
  }
  return found;
}

/** CSS properties email markup actually uses; anything else in an inline style is probably a typo. */
const KNOWN_CSS = new Set(
  `align-content align-items align-self background background-attachment background-clip background-color background-image background-origin background-position background-repeat background-size border border-bottom border-bottom-color border-bottom-left-radius border-bottom-right-radius border-bottom-style border-bottom-width border-collapse border-color border-left border-left-color border-left-style border-left-width border-radius border-right border-right-color border-right-style border-right-width border-spacing border-style border-top border-top-color border-top-left-radius border-top-right-radius border-top-style border-top-width border-width bottom box-shadow box-sizing clear color color-scheme cursor direction display empty-cells flex flex-direction flex-wrap float font font-family font-size font-style font-variant font-weight gap height hyphens justify-content left letter-spacing line-height list-style list-style-position list-style-type margin margin-bottom margin-left margin-right margin-top max-height max-width min-height min-width object-fit object-position opacity outline overflow overflow-wrap padding padding-bottom padding-left padding-right padding-top position right table-layout text-align text-decoration text-decoration-color text-decoration-line text-decoration-style text-decoration-thickness text-indent text-overflow text-shadow text-size-adjust text-transform text-underline-offset top transition vertical-align visibility white-space width word-break word-spacing word-wrap z-index zoom`.split(
    " ",
  ),
);

function detectPlatform(src: string): string | null {
  if (/%[A-Z][A-Z0-9_-]*%/.test(src)) return "ActiveCampaign";
  if (/\*\|[^|*]+\|\*/.test(src)) return "Mailchimp";
  if (/%%[^%\s]+%%/.test(src)) return "SendGrid";
  if (/\{\{[^{}]+\}\}/.test(src)) return "Amazon SES or another Handlebars sender ({{ }} tags)";
  return null;
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
  const { tags, styles } = parse(src);
  return {
    bytes: new TextEncoder().encode(src).length,
    lines: lines.length,
    longestLine: longest,
    nbsp: (src.match(new RegExp(NBSP.source, "g")) ?? []).length,
    images: (src.match(/<img\b/gi) ?? []).length,
    tables: (src.match(/<table\b/gi) ?? []).length,
    indentPct: src.length ? Math.round((indent / src.length) * 100) : 0,
    styleBytes: styles.reduce((n, s) => n + s.css.length, 0),
    width: widestTable(tags),
    previewText: previewText(src),
    platform: detectPlatform(src),
  };
}

/* ── Checks ────────────────────────────────────────────────────────────── */

/** Checks for something missing from the head: the fix goes after the head tag. */
const HEAD_INSERTS = new Set(["charset", "viewport", "title", "text-size-adjust", "apple-reformat", "data-detectors", "color-scheme", "ppi", "outlook-typography"]);

const OUTLOOK = ["outlook"];
const APPLE = ["apple-mail"];
const GMAIL = ["gmail"];
const INVERTERS = ["gmail", "outlook"];

export interface CheckOptions {
  /** receipts, codes and confirmations: the unsubscribe and sender-address rules do not apply */
  transactional?: boolean;
}

/** A guess at whether the email is transactional, for when the person has not said. */
export function looksTransactional(src: string): boolean {
  if (/%UNSUBSCRIBELINK%|unsubscribe/i.test(src)) return false;
  return /\{\{[^{}]+\}\}/.test(src) || /\b(verification code|one[- ]time|passcode|reset your password|order (number|confirmation)|receipt)\b/i.test(src);
}

export function checkEmail(src: string, options: CheckOptions = {}): Finding[] {
  const out: Finding[] = [];
  if (!src.trim()) return out;

  const { tags, styles, lineOf } = parse(src);
  const stats = getStats(src);
  const add = (
    id: string,
    level: Level,
    title: string,
    detail: string,
    opts: { lines?: number[]; fix?: FixId; affects?: string[]; a11y?: boolean; insertAfter?: number; howTo?: HowTo } = {},
  ) => {
    const affects = opts.affects ?? [];
    const sources = SOURCES[id] ?? [];
    const basis: Basis = sources.length ? "sourced" : CHECKED_IDS.has(id) || id.startsWith("text-") ? "checked" : "practice";
    out.push({
      id,
      // Common practice with nothing to cite is never more than a note.
      level: basis === "practice" ? "info" : level,
      basis,
      title,
      detail,
      lines: [...new Set(opts.lines ?? [])].sort((a, b) => a - b),
      fix: opts.fix,
      affects,
      share: affects.length ? sumShare(affects) : sumShare(ALL_FAMILIES),
      a11y: opts.a11y,
      sources,
      group: CONTENT_IDS.has(id) ? "content" : "code",
      insertAfter: opts.insertAfter ?? (HEAD_INSERTS.has(id) ? head?.line : id === "preheader" ? bodyTag?.line : undefined),
      howTo: opts.howTo ?? HOW_TO[id],
    });
  };
  const linesOf = (re: RegExp) => [...src.matchAll(re)].map((m) => lineOf(m.index));
  const html = tags.find((t) => t.name === "html");
  const head = tags.find((t) => t.name === "head" && !t.mso);
  const metas = tags.filter((t) => t.name === "meta");
  const bodyTag = tags.find((t) => t.name === "body" && !t.mso);
  const hasMeta = (name: string) => metas.some((t) => t.attrs.name?.toLowerCase() === name);

  // ── Size and transport ──────────────────────────────────────────────
  const kb = (stats.bytes / 1024).toFixed(1);
  if (stats.bytes > GMAIL_CLIP_BYTES) {
    add(
      "size",
      "fail",
      `${kb}KB is over Gmail's clip limit`,
      "Gmail cuts messages off at about 102KB and hides the rest behind a link. Whatever sits at the bottom (often the unsubscribe link and the tracking pixel) is lost.",
      { affects: GMAIL, fix: stats.indentPct > 0 ? "minify" : undefined },
    );
  } else if (stats.bytes > GMAIL_CLIP_BYTES * 0.8) {
    add(
      "size",
      "warn",
      `${kb}KB is close to Gmail's 102KB clip limit`,
      "The sending platform adds link tracking and its own footer, so the delivered message will be larger than this file.",
      { affects: GMAIL, fix: stats.indentPct > 0 ? "minify" : undefined },
    );
  }

  if (stats.styleBytes > GMAIL_STYLE_BYTES) {
    add(
      "style-size",
      "warn",
      `${(stats.styleBytes / 1024).toFixed(1)}KB of CSS in style blocks`,
      "Gmail drops a style block that is over about 16KB, and with it every media query and class rule in it. Move what you can inline and cut the rest.",
      { lines: styles.map((s) => lineOf(s.offset)), affects: GMAIL },
    );
  }

  const bodyStyles = styles.filter((s) => s.inBody);
  if (bodyStyles.length) {
    add(
      "styles-in-body",
      "warn",
      `${plural(bodyStyles.length, "style block")} inside the body`,
      "Gmail only reads style blocks in the head. Anything in these is ignored there.",
      { lines: bodyStyles.map((s) => lineOf(s.start)), fix: "styles-to-head", affects: GMAIL },
    );
  }

  const nestedAt = styles.flatMap((s) =>
    [...s.css.matchAll(/@media[^{]*\{([\s\S]*?)\}\s*\}/gi)]
      .filter((m) => /@(font-face|import|keyframes)/i.test(m[1]))
      .map((m) => lineOf(s.offset + m.index)),
  );
  if (nestedAt.length) {
    add(
      "nested-at-rules",
      "warn",
      "An at-rule nested inside a media query",
      "Gmail throws away the whole style block when it finds @font-face, @import or @keyframes inside @media. Put them at the top level, in their own style block.",
      { lines: nestedAt, affects: GMAIL },
    );
  }

  const longLines = src
    .split("\n")
    .map((line, i) => (line.length > SMTP_LINE_LIMIT ? i + 1 : 0))
    .filter(Boolean);
  if (longLines.length) {
    add(
      "line-length",
      "warn",
      `${plural(longLines.length, "line")} longer than 998 characters`,
      "The mail standard caps a line at 998 characters. A server that enforces it wraps the line wherever it falls, which can split a tag or add stray whitespace. Most platforms encode the message to avoid this, but not all.",
      { lines: longLines },
    );
  }

  const tail = /<\/html\s*>([\s\S]*)$/i.exec(src);
  if (tail && tail[1].trim()) {
    add(
      "after-html",
      "info",
      "Content after the closing html tag",
      "Anything after </html> is rendered at the very bottom of the message by most clients.",
      { lines: [lineOf(src.length - tail[1].trimStart().length)] },
    );
  }

  // ── Blank space ─────────────────────────────────────────────────────
  const emptyParagraphs = linesOf(EMPTY_PARAGRAPH);
  if (emptyParagraphs.length) {
    add(
      "empty-blocks",
      "info",
      `${plural(emptyParagraphs.length, "empty paragraph or div")}`,
      "Each one shows as a blank line of space. Where they sit at the end of the email they are a gap under the footer. Some editors add them on their own when an email is saved.",
      { lines: emptyParagraphs },
    );
  }
  const brRuns = linesOf(BR_RUN);
  if (brRuns.length) {
    add(
      "br-runs",
      "info",
      `${plural(brRuns.length, "run")} of three or more line breaks`,
      "Stacked <br> tags are blank lines whose height depends on the client's font size, so the gap is a different size everywhere. Use a spacer cell with a fixed height instead.",
      { lines: brRuns },
    );
  }
  const nbspRuns = linesOf(new RegExp(`(?:(?:${NBSP.source})\\s*){3,}`, "g"));
  if (nbspRuns.length) {
    add(
      "nbsp-runs",
      "info",
      `${plural(nbspRuns.length, "run")} of three or more non-breaking spaces`,
      "Each one is a character that takes up a line of height, so a long run reads as a blank block. If you did not type them, a rich-text editor or the sending platform put them there.",
      { lines: nbspRuns },
    );
  }
  const rawNbsp = linesOf(/\xa0/g);
  if (rawNbsp.length) {
    add(
      "nbsp-raw",
      "info",
      `${plural(rawNbsp.length, "raw non-breaking space character")}`,
      "These are the invisible character itself, not the &nbsp; entity. They usually arrive with text pasted from Word or a web page.",
      { lines: rawNbsp },
    );
  }
  const zeroWidth = linesOf(/[​‌‍͏﻿]|&zwnj;|&#8204;|&#847;|&#8203;/g);
  const preheaders = tags.filter((t) => !t.mso && isHiddenPreheader(t));
  if (zeroWidth.length && !preheaders.length) {
    add(
      "zero-width",
      "info",
      `${plural(zeroWidth.length, "zero-width character")}`,
      "Normal in a hidden preheader, where they pad out the inbox preview. This email has no hidden preheader, so they are worth a look.",
      { lines: zeroWidth },
    );
  }
  if (stats.indentPct >= 30) {
    add(
      "indent",
      "info",
      `${stats.indentPct}% of the file is indentation`,
      "Harmless when the file is sent exactly as it is. If the platform passes templates through a rich-text editor, long runs of spaces are what can get turned into non-breaking spaces. Minifying removes the risk and the weight; it is left out of Fix all because it makes the source harder to read.",
      { fix: "minify" },
    );
  }

  // ── Document basics ─────────────────────────────────────────────────
  if (!/^\s*<!doctype/i.test(src)) {
    add("doctype", "info", "No doctype", "Clients that honour the doctype use it to pick standards rendering; without one they use the older quirks rules, where sizes and spacing are worked out differently. Outlook on Windows ignores it either way.");
  }
  if (html && !html.attrs.lang) {
    add(
      "lang",
      "warn",
      "No lang on the html tag",
      'Screen readers use it to pick the voice and pronunciation; without it they guess from the reader\'s settings. The fix adds lang="en"; change it if the email is in another language.',
      { lines: [html.line], fix: "html-lang", a11y: true },
    );
  }
  if (!metas.some((t) => "charset" in t.attrs || /charset/i.test(t.attrs.content ?? ""))) {
    add("charset", "warn", "No charset meta tag", "Without it, accented letters, pound signs and curly quotes can arrive as garbage.");
  }
  if (!hasMeta("viewport")) {
    add("viewport", "info", "No viewport meta tag", "Mobile clients that honour it will lay the email out at desktop width and shrink it.");
  }
  if (!tags.some((t) => t.name === "title")) {
    add("title", "info", "No title tag", "Some clients and screen readers show it; it is also the browser tab name in the web version.");
  }
  const scripts = tags.filter((t) => t.name === "script");
  if (scripts.length) {
    add("script", "fail", "Script tags", "Every email client removes scripts, and they raise the spam score.", { lines: scripts.map((t) => t.line) });
  }
  if (!preheaders.length) {
    add(
      "preheader",
      "info",
      "No hidden preheader",
      `The inbox preview line will show the first text in the email: "${stats.previewText}". Type a preview line in the source panel to add a hidden preheader.`,
      { a11y: false },
    );
  }
  if (!options.transactional && !/unsubscribe|opt[\s-]?out|manage (your )?preferences|\{\{\s*unsub|%unsub|\*\|unsub/i.test(src)) {
    add(
      "unsubscribe",
      "info",
      "No unsubscribe link found",
      "Marketing email needs one by law and for inbox placement. Transactional email (receipts, codes, confirmations) is exempt.",
    );
  }
  if (stats.platform === "ActiveCampaign" && !options.transactional) {
    if (!/%UNSUBSCRIBELINK%/.test(src)) {
      add(
        "ac-unsubscribe",
        "warn",
        "No %UNSUBSCRIBELINK% tag",
        "ActiveCampaign will not send a campaign or automation email without its own unsubscribe tag in the HTML.",
      );
    }
    if (!/%SENDER-INFO/.test(src)) {
      add(
        "ac-sender",
        "info",
        "No %SENDER-INFO% tag",
        "ActiveCampaign expects the sender's postal address in every campaign; %SENDER-INFO-SINGLELINE% fills it in from the account.",
      );
    }
  }

  const badSelectors = styles.flatMap((s) =>
    [...s.css.matchAll(/(?:^|[}{;]\s*|\n\s*)([a-zA-Z][\w-]*)\s*\{/g)]
      .filter((m) => !HTML_ELEMENTS.has(m[1].toLowerCase()))
      .map((m) => ({ name: m[1], line: lineOf(s.offset + m.index + m[0].indexOf(m[1])) })),
  );
  if (badSelectors.length) {
    add(
      "css-selector",
      "warn",
      `${plural(badSelectors.length, "CSS rule")} aimed at an element that does not exist: ${[...new Set(badSelectors.map((b) => b.name))].join(", ")}`,
      "This looks like a class selector missing its dot, so the rule applies to nothing.",
      {
        lines: badSelectors.map((b) => b.line),
        howTo: { text: "Add the dot so it matches the class.", code: [...new Set(badSelectors.map((b) => `.${b.name} { … }`))].join("\n") },
      },
    );
  }

  // ── Apple Mail and iOS ──────────────────────────────────────────────
  if (!/text-size-adjust/i.test(src)) {
    add(
      "text-size-adjust",
      "info",
      "No text-size-adjust rule",
      "iOS Mail enlarges any text under 13px and can rescale the rest. body { -webkit-text-size-adjust: 100% } keeps your sizes.",
      { fix: head ? "text-size-adjust" : undefined, affects: APPLE },
    );
  }
  if (head && !hasMeta("x-apple-disable-message-reformatting")) {
    add(
      "apple-reformat",
      "info",
      "No x-apple-disable-message-reformatting meta tag",
      "Without it, iOS Mail can shrink the whole layout to fit the screen width instead of letting the media queries do their job.",
      { fix: "apple-reformat", affects: APPLE },
    );
  }
  if (!/x-apple-data-detectors/i.test(src)) {
    add(
      "data-detectors",
      "info",
      "No rule for Apple's data detectors",
      "iOS Mail turns dates, addresses and phone numbers into blue underlined links. A rule for a[x-apple-data-detectors] with color: inherit keeps them looking like the text around them.",
      { affects: APPLE },
    );
  }

  // ── Dark mode ───────────────────────────────────────────────────────
  if (!hasMeta("color-scheme")) {
    add(
      "color-scheme",
      "info",
      "No color-scheme meta tag",
      'Without <meta name="color-scheme" content="light dark"> and its supported-color-schemes twin, clients that support dark mode will not apply your prefers-color-scheme styles.',
      { affects: [...APPLE, ...OUTLOOK] },
    );
  }
  const pureBlack = linesOf(/background(?:-color)?\s*:\s*(?:#000(?:000)?|black)\b|bgcolor\s*=\s*["']?(?:#000(?:000)?|black)\b/gi);
  if (pureBlack.length) {
    add(
      "pure-black",
      "info",
      `${plural(pureBlack.length, "pure black background")}`,
      "Clients that fully invert colours in dark mode (the Gmail app on iOS, Outlook on Windows) flip dark backgrounds as well as light ones, so pure black can come out white.",
      { lines: pureBlack, affects: INVERTERS },
    );
  }

  // ── Outlook on Windows ──────────────────────────────────────────────
  if (!/PixelsPerInch/i.test(src)) {
    add(
      "ppi",
      "warn",
      "No PixelsPerInch setting for Outlook",
      "On Windows displays scaled to 125% or 150%, Outlook resizes images and they go soft. The OfficeDocumentSettings block with PixelsPerInch 96 in the head stops it.",
      { fix: head ? "ppi" : undefined, affects: OUTLOOK },
    );
  } else if (html && !("xmlns:o" in html.attrs)) {
    add(
      "xmlns-o",
      "warn",
      "PixelsPerInch is set but the Office namespace is missing",
      'The setting needs xmlns:o="urn:schemas-microsoft-com:office:office" on the html tag to be read.',
      { lines: [html.line], fix: "xmlns-o", affects: OUTLOOK },
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
      { lines: ghostNoCss.map((t) => t.line), fix: "ghost-width", affects: OUTLOOK },
    );
  }

  if (stats.width !== null && stats.width > USUAL_WIDTH) {
    add(
      "width",
      "info",
      `${stats.width}px wide`,
      "Wider than the usual 600 to 650px. Outlook's reading pane and most webmail clients show that width without scrolling; anything wider is cropped or shrunk.",
    );
  }

  const spacerCells = [...src.matchAll(SPACER_CELL)].filter((m) => spacerHeight(m[1]) !== null);
  if (spacerCells.length) {
    add(
      "spacer-cells",
      "info",
      "Spacer cells with a height but no font size",
      "Outlook on Windows will not make a cell shorter than one line of text, so the non-breaking space sets the real height. Give the cell a line-height matching the height you want and a 1px font-size.",
      { lines: spacerCells.map((m) => lineOf(m.index)), fix: "spacer-cells", affects: OUTLOOK },
    );
  }

  const lineHeightRule = tags.filter(needsLineHeightRule).map((t) => t.line);
  if (lineHeightRule.length) {
    add(
      "line-height-rule",
      "info",
      `${plural(lineHeightRule.length, "line-height")} without mso-line-height-rule`,
      "Outlook on Windows treats line-height as a minimum and rounds it to its own grid. mso-line-height-rule: exactly makes it use the value you gave.",
      { lines: lineHeightRule, fix: "line-height-rule", affects: OUTLOOK },
    );
  }

  if (!/DontUseAdvancedTypographyReadingMail/i.test(src)) {
    add(
      "outlook-typography",
      "info",
      "No DontUseAdvancedTypographyReadingMail setting",
      "Newer Outlook on Windows applies Word's kerning and ligatures to email text, which changes the letter spacing from what you designed. This Word setting in the head turns that off.",
      { fix: head ? "outlook-typography" : undefined, affects: OUTLOOK },
    );
  }

  const alignedTables = tags.filter(isAlignedTable).map((t) => t.line);
  if (alignedTables.length) {
    add(
      "table-align-mso",
      "info",
      `${plural(alignedTables.length, "floated table")} without mso-table-lspace`,
      "Outlook on Windows adds a few pixels either side of a table with align left or right, which breaks side-by-side columns. mso-table-lspace: 0 and mso-table-rspace: 0 remove it.",
      { lines: alignedTables, fix: "table-align-mso", affects: OUTLOOK },
    );
  }

  const bgImages = tags.filter((t) => !t.mso && ["td", "table", "body"].includes(t.name) && hasBackgroundImage(t));
  if (bgImages.length && !/<v:(rect|fill|image|background)/i.test(src)) {
    const noColour = bgImages.some((t) => !hasBackgroundColor(t));
    add(
      "bg-no-vml",
      "warn",
      `${plural(bgImages.length, "background image")} with no VML fallback`,
      `Outlook on Windows does not show CSS background images. It shows the background colour instead, unless the image is repeated in a v:rect or v:fill block inside an mso conditional comment.${noColour ? " Some of these have no background colour either, so Outlook shows nothing behind the text." : ""}`,
      { lines: bgImages.map((t) => t.line), fix: noColour ? "bg-color-fallback" : undefined, affects: OUTLOOK },
    );
  }

  const outlookIgnores = tags
    .filter((t) => !t.mso && ["div", "p", "span", "img"].includes(t.name) && (styleHas(t.attrs.style, "margin") || styleHas(t.attrs.style, "padding") || /(^|;)\s*(margin|padding)-/i.test(t.attrs.style ?? "")))
    .map((t) => t.line);
  if (outlookIgnores.length) {
    add(
      "outlook-spacing",
      "info",
      `Margin or padding on ${plural(outlookIgnores.length, "div, p, span or image")}`,
      "Outlook on Windows drops margin and padding on these. Put the spacing on the table cell around them instead.",
      { lines: outlookIgnores, affects: OUTLOOK },
    );
  }

  // ── Images ──────────────────────────────────────────────────────────
  const imgs = tags.filter((t) => t.name === "img" && !t.mso);
  const imgLines = (test: (t: Tag) => boolean) => imgs.filter(test).map((t) => t.line);

  const noAlt = imgLines((t) => !("alt" in t.attrs));
  if (noAlt.length) {
    add(
      "img-alt",
      "fail",
      `${plural(noAlt.length, "image")} with no alt attribute`,
      'Screen readers read out the file name instead, and with images blocked (Outlook\'s default) the space is blank. Describe what the image says or shows; a purely decorative image gets alt="".',
      { lines: noAlt, a11y: true },
    );
  }
  const badAlt = imgLines((t) => {
    const alt = (t.attrs.alt ?? "").trim();
    return alt.length > 0 && (/\.(png|jpe?g|gif|webp|svg)$/i.test(alt) || /^(image|img|photo|picture|banner|graphic|spacer|untitled|alt[_ -]?text|alt|placeholder)\b/i.test(alt) || /^[\w-]{20,}$/.test(alt));
  });
  if (badAlt.length) {
    add(
      "img-alt-weak",
      "warn",
      `${plural(badAlt.length, "image")} with alt text that says nothing`,
      "A file name or a word like \"image\" is read aloud as it is. Say what the image shows, or use an empty alt if it is decorative.",
      { lines: badAlt, a11y: true },
    );
  }
  const longAlt = imgLines((t) => (t.attrs.alt ?? "").length > 125);
  if (longAlt.length) {
    add(
      "img-alt-long",
      "info",
      `${plural(longAlt.length, "image")} with alt text over 125 characters`,
      "Some screen readers cut alt text off around there. Keep the description short and put the rest in the body copy.",
      { lines: longAlt, a11y: true },
    );
  }
  const noWidth = imgLines((t) => !/^\d+$/.test(t.attrs.width ?? ""));
  if (noWidth.length) {
    add(
      "img-width",
      "warn",
      `${plural(noWidth.length, "image")} with no width attribute`,
      "Outlook on Windows does not apply a CSS width to an image, so without the attribute it shows the image at the file's own pixel size. An image saved at double size for sharp screens comes out double size.",
      { lines: noWidth, affects: OUTLOOK },
    );
  }
  const emptyHeight = imgLines((t) => "height" in t.attrs && !t.attrs.height.trim());
  if (emptyHeight.length) {
    add(
      "img-height-empty",
      "info",
      `${plural(emptyHeight.length, "image")} with an empty height attribute`,
      'Usually a leftover from a width/height pair where the value was dropped so height:auto could take over on mobile; ActiveCampaign\'s editor then writes it as a bare "height". The attribute takes a whole number, so an empty one is not valid and browsers ignore it. Removing it is a tidy-up.',
      { lines: emptyHeight, fix: "img-height-empty" },
    );
  }
  const badHeight = imgLines((t) => "height" in t.attrs && !!t.attrs.height.trim() && !/^\d+$/.test(t.attrs.height.trim()));
  if (badHeight.length) {
    add(
      "img-height-invalid",
      "info",
      `${plural(badHeight.length, "image")} with a non-numeric height attribute`,
      'The attribute only takes a whole number of pixels, so a value like "auto" is not valid here and is ignored. height:auto belongs in the style attribute.',
      { lines: badHeight },
    );
  }
  const noHeight = imgLines((t) => !("height" in t.attrs) && !styleHas(t.attrs.style, "height"));
  if (noHeight.length) {
    add(
      "img-height",
      "info",
      `${plural(noHeight.length, "image")} with no height`,
      "The email changes height as each image loads. Apps that measure the message once, before images arrive, can end up with the wrong scroll length.",
      { lines: noHeight },
    );
  }
  const inlineImgs = imgLines((t) => styleGet(t.attrs.style, "display") !== "block");
  if (inlineImgs.length) {
    add(
      "img-inline",
      "info",
      `${plural(inlineImgs.length, "image")} without display:block`,
      'An inline image sits on the text baseline and leaves a few pixels of gap underneath. Fine for an icon in a row of text, visible as a line when images should sit flush. Outlook.com ignores this and needs align="left" or a div of the image\'s height instead.',
      { lines: inlineImgs },
    );
  }
  const isMergeTag = (v: string) => /^\s*(\{\{|\*\||%|\[\[|<%)/.test(v);
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
      { lines: badSrc },
    );
  }
  const httpSrc = imgLines((t) => /^http:/i.test(t.attrs.src ?? ""));
  if (httpSrc.length) {
    add(
      "img-http",
      "warn",
      `${plural(httpSrc.length, "image")} loaded over http`,
      "Webmail runs on https and can block or flag images served without it.",
      { lines: httpSrc },
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
      "Screen readers announce these as data tables and read out row and column counts before any content.",
      { lines: noRole, fix: "table-role", a11y: true },
    );
  }
  const noReset = tables.filter((t) => !("cellpadding" in t.attrs) || !("cellspacing" in t.attrs)).map((t) => t.line);
  if (noReset.length) {
    add(
      "table-reset",
      "info",
      `${plural(noReset.length, "table")} missing cellpadding or cellspacing`,
      "Clients apply their own default spacing between cells when these are missing.",
      { lines: noReset, fix: "table-reset" },
    );
  }

  const links = tags.filter((t) => t.name === "a" && !t.mso);
  const deadLinks = links.filter((t) => !t.attrs.href || t.attrs.href.trim() === "#").map((t) => t.line);
  if (deadLinks.length) {
    add("link-empty", "info", `${plural(deadLinks.length, "link")} going nowhere`, "The href is empty or just a # placeholder.", { lines: deadLinks });
  }
  const linkText = (t: Tag) => {
    const close = src.indexOf("</a>", t.end);
    return close === -1 ? "" : src.slice(t.end, close);
  };
  const isUnsubscribe = (t: Tag) => /%UNSUBSCRIBELINK%|unsub/i.test(t.attrs.href ?? "");
  const invisibleUnsub = links.filter((t) => isUnsubscribe(t) && !decodeEntities(linkText(t).replace(/<[^>]+>/g, " ")).trim() && !/<img\b/i.test(linkText(t)));
  if (invisibleUnsub.length) {
    add(
      "unsubscribe-empty",
      "fail",
      "The unsubscribe link has no text",
      "The link is in the email but there is nothing between its opening and closing tags, so nobody can see it or click it. For a marketing email that is the same as having no unsubscribe link.",
      {
        lines: invisibleUnsub.map((t) => t.line),
        howTo: { text: "Put the word inside the link.", code: `<a href="${invisibleUnsub[0].attrs.href}" style="color:#161514; text-decoration:underline;">Unsubscribe</a>` },
      },
    );
  }
  const SOCIAL: [RegExp, RegExp][] = [
    [/facebook/i, /facebook\.com|fb\.com/i],
    [/instagram/i, /instagram\.com/i],
    [/linkedin/i, /linkedin\.com/i],
    [/youtube/i, /youtube\.com|youtu\.be/i],
    [/tiktok/i, /tiktok\.com/i],
    [/^(x|twitter)$/i, /twitter\.com|x\.com/i],
  ];
  const wrongSocial = links.filter((t) => {
    const alt = /<img\b[^>]*\balt\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(linkText(t));
    const name = (alt?.[1] ?? alt?.[2] ?? "").trim();
    const rule = SOCIAL.find(([label]) => label.test(name));
    return !!rule && /^https?:/i.test(t.attrs.href ?? "") && !rule[1].test(t.attrs.href ?? "");
  });
  if (wrongSocial.length) {
    add(
      "social-mismatch",
      "warn",
      `${plural(wrongSocial.length, "social icon")} linking to a different site than its label`,
      "The icon's alt text names one network and the link goes to another, which usually means a link was copied and not updated.",
      { lines: wrongSocial.map((t) => t.line), howTo: { text: "Point the link at the network the icon shows." } },
    );
  }
  const emptyLinks = links
    .filter((t) => !invisibleUnsub.includes(t))
    .filter((t) => {
      const inner = linkText(t);
      const text = decodeEntities(inner.replace(/<[^>]+>/g, " ")).trim();
      const imgAlt = [...inner.matchAll(/<img\b[^>]*\balt\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)].some((m) => (m[1] ?? m[2] ?? "").trim());
      return !text && !imgAlt && !t.attrs["aria-label"] && !t.attrs.title && t.attrs["aria-hidden"] !== "true";
    })
    .map((t) => t.line);
  if (emptyLinks.length) {
    add(
      "link-no-name",
      "fail",
      `${plural(emptyLinks.length, "link")} with no accessible name`,
      "A link wrapping only an image with empty alt, or no text at all, is announced as \"link\" with nowhere to go. Give the image alt text that says where the link leads, or add aria-label. If it is an arrow icon beside a text link to the same place, put the icon inside that link instead, or add aria-hidden=\"true\" to the icon link.",
      { lines: emptyLinks, a11y: true },
    );
  }
  const genericLinks = links
    .filter((t) => /^\s*(click here|here|read more|learn more|more|link|this)\s*[.!]?\s*$/i.test(decodeEntities(linkText(t).replace(/<[^>]+>/g, " "))))
    .map((t) => t.line);
  if (genericLinks.length) {
    add(
      "link-generic",
      "info",
      `${plural(genericLinks.length, "link")} that just says "click here" or similar`,
      "Screen reader users often jump between links and hear them out of context. Say where the link goes: \"View my account\", not \"click here\".",
      { lines: genericLinks, a11y: true },
    );
  }
  const httpLinks = links.filter((t) => /^http:/i.test(t.attrs.href ?? "")).map((t) => t.line);
  if (httpLinks.length) {
    add("link-http", "info", `${plural(httpLinks.length, "link")} using http`, "Worth switching to https where the destination supports it.", { lines: httpLinks });
  }
  const uncolouredLinks = links.filter((t) => !styleHas(t.attrs.style, "color") && isTextLink(t, src)).map((t) => t.line);
  if (uncolouredLinks.length) {
    add(
      "link-color",
      "info",
      `${plural(uncolouredLinks.length, "text link")} without an inline colour`,
      "Gmail and Outlook ignore link colours set in a style block and show their own blue, purple once visited. Set color on the a tag itself.",
      { lines: uncolouredLinks, affects: [...GMAIL, ...OUTLOOK] },
    );
  }
  // ── Reading ─────────────────────────────────────────────────────────
  if (!tags.some((t) => !t.mso && (/^h[1-6]$/.test(t.name) || t.attrs.role === "heading"))) {
    add(
      "headings",
      "info",
      "No headings",
      'Screen reader users navigate by headings. Styled table cells are not headings; use <h1> and <h2> with the margins reset, or add role="heading" aria-level="2" to the cell.',
      { a11y: true },
    );
  }
  const tinyText = tags.filter((t) => !t.mso && ["td", "p", "span", "div", "a", "li", "sup", "sub", "small", "font"].includes(t.name) && Number.parseFloat(styleGet(t.attrs.style, "font-size")) < 12 && Number.parseFloat(styleGet(t.attrs.style, "font-size")) >= 2 && !isHiddenElement(t)).map((t) => t.line);
  if (tinyText.length) {
    add(
      "small-text",
      "info",
      `Text under 12px on ${plural(tinyText.length, "element")}`,
      "Hard to read on a phone, and iOS Mail enlarges anything under 13px on its own. Footers are the usual place; 12px with a decent line-height is the floor most guides use.",
      { lines: tinyText, a11y: true },
    );
  }

  // ── Fonts and merge tags ────────────────────────────────────────────
  const declared = declaredFamilies(src);
  const unusedFonts = tags.filter((t) => isUnusedFontLink(t, declared));
  if (unusedFonts.length) {
    add(
      "unused-fonts",
      "info",
      `${unusedFonts.flatMap(linkFamilies).join(", ")} loaded but never used`,
      "The stylesheet link is in the head, but no font-family in the email names it. It is a wasted request, and the email is not using the font you expect.",
      { lines: unusedFonts.map((t) => t.line), fix: "unused-fonts" },
    );
  }
  const noFallback = [...src.matchAll(/font-family\s*:\s*([^;"}]+)/gi)].filter((m) => needsFallback(m[1])).map((m) => lineOf(m.index));
  if (noFallback.length) {
    add(
      "font-fallbacks",
      "info",
      `${plural(noFallback.length, "font-family")} without a generic fallback`,
      "Most clients do not load web fonts, and Outlook on Windows swaps an unknown font for Times New Roman. End every font-family with Arial, Helvetica, sans-serif or similar.",
      { lines: noFallback, fix: "font-fallbacks" },
    );
  }

  // ── The words ───────────────────────────────────────────────────────
  const runs = textRuns(src);
  // Entities are turned into the characters they stand for first, so "&nbsp;full" is not read as "sp;fu".
  const readable = (raw: string) => raw.replace(/&(nbsp|#160);/gi, " ").replace(/&amp;/gi, "&").replace(/&[a-z#0-9]+;/gi, "'");
  const inRuns = (re: RegExp, keep: (m: RegExpMatchArray, run: string) => boolean = () => true) =>
    runs.flatMap((run) => {
      const text = readable(run.text);
      const firstLine = lineOf(run.index);
      return [...text.matchAll(re)]
        .filter((m) => keep(m, text))
        .map((m) => ({ match: m[0].trim(), line: firstLine + (text.slice(0, m.index).match(/\n/g) ?? []).length }));
    });
  const quote = (hits: { match: string }[]) =>
    [...new Set(hits.map((h) => `"${h.match.slice(0, 40)}"`))].slice(0, 4).join(", ");

  const markdown = inRuns(/\[[^\]\n]{1,80}\]\(\s*https?:[^)\s]+\s*\)|\*\*[^*\n]{1,80}\*\*/g);
  if (markdown.length) {
    add(
      "text-markdown",
      "warn",
      `Markdown showing in the text: ${quote(markdown)}`,
      "Square brackets, round brackets or asterisks from Markdown are in the copy as plain characters, so readers see the symbols. It usually comes from pasting text out of a chat or notes app.",
      { lines: markdown.map((h) => h.line), howTo: { text: "Replace it with the plain words, and make the link with an a tag.", code: '<a href="https://www.sharetobuy.com" style="color:#ff0066;">www.sharetobuy.com</a>' } },
    );
  }

  const isAddress = (token: string) => /@|\/\/|www\.|\.(com|co|org|net|uk|io|gov)\b/i.test(token);
  const tokenAround = (m: RegExpMatchArray, run: string) => {
    const start = run.lastIndexOf(" ", m.index ?? 0) + 1;
    const end = run.indexOf(" ", (m.index ?? 0) + m[0].length);
    return run.slice(start, end === -1 ? undefined : end);
  };
  const noSpaceAfter = inRuns(/[A-Za-z]*[a-z]{2}[.!?,;:][A-Za-z]{2,}/g, (m, run) => !isAddress(tokenAround(m, run)) && !/\d/.test(m[0]));
  if (noSpaceAfter.length) {
    add(
      "text-spacing-after",
      "info",
      `Missing space after punctuation: ${quote(noSpaceAfter)}`,
      "A full stop, comma or similar runs straight into the next word.",
      { lines: noSpaceAfter.map((h) => h.line), howTo: { text: "Add the space." } },
    );
  }
  const spaceBefore = inRuns(/[A-Za-z]+ +[,;:!?](?=\s|$)|[A-Za-z]+ +\.(?=\s|$)/g);
  if (spaceBefore.length) {
    add(
      "text-spacing-before",
      "info",
      `Space before punctuation: ${quote(spaceBefore)}`,
      "There is a space between a word and the punctuation that follows it.",
      { lines: spaceBefore.map((h) => h.line), howTo: { text: "Remove the space." } },
    );
  }
  const repeated = inRuns(/\b([A-Za-z]{2,})\s+\1\b/gi, (m) => !/^(had|that|very|so|bye|no|ha)$/i.test(m[1]));
  if (repeated.length) {
    add("text-repeat", "info", `Repeated word: ${quote(repeated)}`, "The same word appears twice in a row.", {
      lines: repeated.map((h) => h.line),
      howTo: { text: "Delete one." },
    });
  }
  const placeholder = inRuns(
    /lorem ipsum|\bTBC\b|\bTBD\b|\bTODO\b|\bXX+\b|insert [a-z ]{1,20} here|\[(name|date|link|url|text|copy|headline)[^\]]{0,20}\]|£0{1,3}(?:,0{3})+|\b0{2,}%|\b[A-Za-z]+ name(?:\s*\/\s*[a-z]+)? here\b|\b[a-z]+ here$/gi,
    (m) => !/^(click|tap|right|over|from|out|in|is|are|up|down) here$/i.test(m[0].trim()),
  );
  if (placeholder.length) {
    add(
      "text-placeholder",
      "info",
      `Placeholder text left in: ${quote(placeholder)}`,
      "This reads like copy that was meant to be replaced before sending.",
      { lines: placeholder.map((h) => h.line), howTo: { text: "Replace it with the final copy." } },
    );
  }
  const thisYear = new Date().getFullYear();
  const oldYears = inRuns(/\b20\d{2}\b/g, (m, run) => {
    const before = run.slice(Math.max(0, (m.index ?? 0) - 24), m.index);
    return Number(m[0]) < thisYear - 1 && !/(Act|Regulations?|Order|Rules|Directive|since|established|founded|est\.?|©|copyright)\s*\(?$/i.test(before);
  });
  if (oldYears.length) {
    add(
      "text-old-year",
      "info",
      `Mentions an earlier year: ${[...new Set(oldYears.map((h) => h.match))].join(", ")}`,
      `It is ${thisYear}. If these are figures or dates carried over from an older version of the email, they may need updating.`,
      { lines: oldYears.map((h) => h.line), howTo: { text: "Check the figures are the latest, and update the year if so." } },
    );
  }

  // ── Where the links go ──────────────────────────────────────────────
  const plainText = (t: Tag) => decodeEntities(linkText(t).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  const hostOf = (value: string) => {
    try {
      return new URL(/^https?:/i.test(value) ? value : `https://${value}`).hostname.replace(/^www\./, "").toLowerCase();
    } catch {
      return "";
    }
  };
  const textMismatch = links.filter((t) => {
    const text = plainText(t);
    const href = t.attrs.href ?? "";
    if (!/^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+\/?$/i.test(text) || !/^https?:/i.test(href)) return false;
    return hostOf(text) !== "" && hostOf(text) !== hostOf(href);
  });
  if (textMismatch.length) {
    add(
      "link-text-mismatch",
      "info",
      `${plural(textMismatch.length, "link")} showing one web address and going to another`,
      "The visible text is a web address, and the link behind it goes to a different site. That is usually a copy and paste slip. Showing one address and linking to another is also the pattern phishing emails use, so it is worth avoiding even when both sites are yours.",
      { lines: textMismatch.map((t) => t.line), howTo: { text: "Make the address in the text and the address in the link the same." } },
    );
  }
  const byText = new Map<string, Map<string, number>>();
  for (const t of links) {
    const text = plainText(t).toLowerCase();
    const href = (t.attrs.href ?? "").split(/[?#]/)[0].replace(/\/$/, "");
    if (text.length < 4 || !/^https?:/i.test(href)) continue;
    const seen = byText.get(text) ?? new Map<string, number>();
    if (!seen.has(href)) seen.set(href, t.line);
    byText.set(text, seen);
  }
  const sameText = [...byText].filter(([, hrefs]) => hrefs.size > 1);
  if (sameText.length) {
    add(
      "link-same-text",
      "info",
      `Same link text, different destinations: ${sameText.map(([text]) => `"${text.slice(0, 30)}"`).slice(0, 3).join(", ")}`,
      "Links with identical wording go to different pages. That may be intended; it is also what a missed update looks like, and screen reader users cannot tell the links apart.",
      { lines: sameText.flatMap(([, hrefs]) => [...hrefs.values()]), howTo: { text: "Check each destination, and reword one of them if both are right." } },
    );
  }
  const tracking = new Map<string, number[]>();
  for (const t of links) {
    for (const m of (t.attrs.href ?? "").matchAll(/[?&](utm_(?:source|campaign))=([^&#"]+)/gi)) {
      const key = `${m[1].toLowerCase()}=${decodeURIComponent(m[2].replace(/\+/g, " "))}`;
      tracking.set(key, [...(tracking.get(key) ?? []), t.line]);
    }
  }
  if (tracking.size) {
    add(
      "link-tracking",
      "info",
      `Tracking tags in the links: ${[...tracking.keys()].slice(0, 6).join(", ")}`,
      "Listed so you can check they name this email. A tag naming a different email or campaign is a sign the link was copied from another template, and its clicks will be counted there.",
      { lines: [...tracking.values()].flat(), howTo: { text: "Update any tag that names another email." } },
    );
  }

  // ── Dates ───────────────────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dated = [
    ...runs.map((run) => ({ text: readable(run.text), line: lineOf(run.index) })),
    ...tags.filter((t) => t.name === "img" && t.attrs.alt).map((t) => ({ text: t.attrs.alt, line: t.line })),
  ].flatMap(({ text, line }) => findDates(text).map((d) => ({ ...d, line })));
  const wrongDay = dated.filter((d) => {
    if (d.weekday === null) return false;
    const years = d.year ? [d.year] : [today.getFullYear(), today.getFullYear() + 1];
    return years.every((y) => new Date(y, d.month, d.day).getDay() !== d.weekday);
  });
  if (wrongDay.length) {
    add(
      "text-weekday",
      "warn",
      `Day and date do not match: ${[...new Set(wrongDay.map((d) => `"${d.text}"`))].join(", ")}`,
      `That date does not fall on that day of the week${wrongDay.some((d) => !d.year) ? " this year or next" : ""}. One of the two is wrong.`,
      { lines: wrongDay.map((d) => d.line), howTo: { text: "Check the date against a calendar and correct the day or the date." } },
    );
  }
  const passed = dated.filter((d) => new Date(d.year ?? today.getFullYear(), d.month, d.day) < today);
  if (passed.length) {
    add(
      "text-date-passed",
      "info",
      `Mentions a date that has passed: ${[...new Set(passed.map((d) => `"${d.text}"`))].slice(0, 4).join(", ")}`,
      `Today is ${today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}. If this email is about to be sent, an event or deadline on that date is already over. A date with no year is read as this year.`,
      { lines: passed.map((d) => d.line), howTo: { text: "Update the date, or confirm this is an old email being reviewed." } },
    );
  }
  const copyright = inRuns(/(?:©|&copy;|\(c\)|copyright)\s*(20\d{2})/gi, (m) => Number(m[1]) < thisYear);
  if (copyright.length) {
    add("text-copyright-year", "info", `Copyright year is out of date: ${quote(copyright)}`, `It is ${thisYear}.`, {
      lines: copyright.map((h) => h.line),
      howTo: { text: "Update the year." },
    });
  }
  for (const mark of ["†", "‡", "§"]) {
    const uses = inRuns(new RegExp(mark, "g"));
    if (uses.length === 1) {
      add(
        `text-footnote-${mark}`,
        "info",
        `Footnote mark ${mark} appears only once`,
        "A footnote mark normally appears twice: once in the text and once beside the note it points to. One of the pair is missing.",
        { lines: uses.map((h) => h.line), howTo: { text: "Add the mark where the note applies, or remove the note." } },
      );
    }
  }

  // ── Link addresses ──────────────────────────────────────────────────
  const twoQueries = links.filter((t) => ((t.attrs.href ?? "").match(/\?/g) ?? []).length > 1);
  if (twoQueries.length) {
    add(
      "link-query",
      "warn",
      `${plural(twoQueries.length, "link")} with two question marks in the address`,
      "Only the first question mark starts the list of tags. A second one is read as an ordinary character, so the tag straight after it is swallowed into the value before it, and the tags that follow repeat ones already set earlier in the address. Which of the repeated values the destination site counts is up to that site. It usually comes from pasting one tracked link on the end of another.",
      { lines: twoQueries.map((t) => t.line), howTo: { text: "Keep one set of tracking tags, and join the rest with & instead of a second question mark.", code: "https://example.com/page?utm_source=SHARE_TO_BUY&utm_medium=Email&utm_campaign=name" } },
    );
  }
  const emptyTag = links.filter((t) => /[?&]utm_[a-z]+=(?:&|#|$)/i.test(t.attrs.href ?? ""));
  if (emptyTag.length) {
    add(
      "link-utm-empty",
      "info",
      `${plural(emptyTag.length, "link")} with an empty tracking tag`,
      "A utm tag is present with nothing after the equals sign, so the click is recorded with a blank value.",
      { lines: emptyTag.map((t) => t.line), howTo: { text: "Give the tag a value or remove it." } },
    );
  }
  const badTel = links.filter((t) => /^tel:.*\s/i.test(t.attrs.href ?? ""));
  if (badTel.length) {
    add(
      "link-tel",
      "info",
      `${plural(badTel.length, "phone link")} with spaces in the number`,
      "The standard for tel: links does not allow spaces; hyphens, dots and brackets are the permitted separators. Most phones cope with spaces anyway, but it is not guaranteed. The visible number can keep its spaces; the link should not.",
      { lines: badTel.map((t) => t.line), howTo: { text: "Remove the spaces from the link only.", code: '<a href="tel:03336664747">0333 666 4747</a>' } },
    );
  }

  // ── Preheader ───────────────────────────────────────────────────────
  const firstTableAt = tags.find((t) => !t.mso && t.inBody && t.name === "table")?.start ?? src.length;
  const preheaderTag = tags.find((t) => !t.mso && t.inBody && t.start < firstTableAt && isHiddenElement(t));
  if (preheaderTag) {
    const close = src.indexOf(`</${preheaderTag.name}>`, preheaderTag.end);
    const inner = close === -1 ? "" : src.slice(preheaderTag.end, close);
    if (inner.trim() && !/&zwnj;|&#8204;|&#847;|&#8199;|&#8203;|[​‌‍͏ ﻿]/.test(inner)) {
      add(
        "preheader-unpadded",
        "info",
        "The preheader has no padding after it",
        `Inbox lists show about 90 to 130 characters. This preheader is ${decodeEntities(inner).trim().length}, so the preview carries on into the next text in the email ("${stats.previewText.slice(decodeEntities(inner).trim().length, decodeEntities(inner).trim().length + 40).trim()}…"). Invisible padding after the preheader stops it there.`,
        { lines: [preheaderTag.line], fix: "preheader-pad" },
      );
    }
  }

  // ── Markup slips ────────────────────────────────────────────────────
  const msoTable = tags.find((t) => t.mso && t.name === "table" && /^\d+$/.test(t.attrs.width ?? ""));
  const msoCell = tags.find((t) => t.mso && t.name === "td" && /^\d+$/.test(t.attrs.width ?? ""));
  if (msoTable && msoCell && msoTable.attrs.width !== msoCell.attrs.width) {
    add(
      "ghost-mismatch",
      "info",
      `Outlook-only table is ${msoTable.attrs.width}px but its cell is ${msoCell.attrs.width}px`,
      "The table that sets the email's width for Outlook and the cell inside it give different widths. That is an inconsistency in the file. What Outlook does with it has not been verified here: it may be harmless. Worth making them match, and worth a look in Outlook if the email's width matters.",
      { lines: [msoTable.line, msoCell.line], howTo: { text: "Give both the same width, matching the max-width of the email." }, affects: OUTLOOK },
    );
  }
  const nestedCells = linesOf(/<td\b[^>]*>\s*<td\b/gi);
  if (nestedCells.length) {
    add(
      "nested-td",
      "info",
      `${plural(nestedCells.length, "empty table cell")} with no closing tag, straight before another cell`,
      "This is valid HTML: a td may be left unclosed when another td follows, and the result is an extra empty cell in the row. It is flagged because an empty cell written this way is almost always a leftover, and it adds a column the layout does not need.",
      { lines: nestedCells, howTo: { text: "Delete the stray opening <td>." } },
    );
  }
  const emptyTables = linesOf(/<table\b[^>]*>\s*<\/table>/gi);
  if (emptyTables.length) {
    add(
      "empty-table",
      "info",
      `${plural(emptyTables.length, "table")} with nothing inside`,
      "A table with no rows is allowed, and it shows nothing. It is flagged as a leftover that can be removed.",
      { lines: emptyTables, howTo: { text: "Remove it, or remove the cell that holds it if that is empty too." } },
    );
  }
  const unknownProps: { prop: string; line: number }[] = [];
  const bareColours: number[] = [];
  const zeroLineText: number[] = [];
  for (const t of tags) {
    const style = t.attrs.style;
    if (!style || t.mso) continue;
    for (const m of style.matchAll(/(?:^|;)\s*([a-zA-Z-]+)\s*:/g)) {
      const prop = m[1].toLowerCase();
      if (!prop.startsWith("-") && !prop.startsWith("mso-") && !KNOWN_CSS.has(prop)) unknownProps.push({ prop, line: t.line });
    }
    if (/(?:^|;)\s*(?:background-)?color\s*:\s*[0-9a-f]{6}\s*(?:;|$)/i.test(style)) bareColours.push(t.line);
    // Hidden elements and zero-size spacers use this on purpose; only visible words are a problem.
    const wordsFollow = /[A-Za-z]{3}/.test(readable(/^[^<]*/.exec(src.slice(t.end, t.end + 200))?.[0] ?? ""));
    if (/(?:^|;)\s*line-height\s*:\s*0(?:px)?\s*(?:;|$)/i.test(style) && wordsFollow && !isHiddenElement(t) && Number.parseFloat(styleGet(style, "font-size") || "16") > 0) zeroLineText.push(t.line);
  }
  if (unknownProps.length) {
    add(
      "css-unknown",
      "warn",
      `Unknown CSS property: ${[...new Set(unknownProps.map((u) => u.prop))].join(", ")}`,
      "This is not a CSS property, so the rule is ignored. It is usually a typing slip.",
      { lines: unknownProps.map((u) => u.line), howTo: { text: "Correct the property name." } },
    );
  }
  if (bareColours.length) {
    add(
      "css-colour-hash",
      "warn",
      `${plural(bareColours.length, "colour")} written without the # sign`,
      "A hex colour needs a # in front. Without it the colour is ignored and the text falls back to the client's default.",
      { lines: bareColours, howTo: { text: "Add the #.", code: "color: #000000;" } },
    );
  }
  if (zeroLineText.length) {
    add(
      "line-height-zero",
      "info",
      `Text inside ${plural(zeroLineText.length, "cell")} with a line-height of 0`,
      "A line-height of 0 is a trick for removing the gap around an image. On a cell that holds words it means the text has no line of its own: one line still shows, but if the words wrap, the lines sit on top of each other.",
      { lines: zeroLineText, howTo: { text: "Give the text cell a real line-height, about 1.4 times the font size." } },
    );
  }
  const badValign = tags.filter((t) => t.attrs.valign && !/^(top|middle|bottom|baseline)$/i.test(t.attrs.valign.trim())).map((t) => t.line);
  if (badValign.length) {
    add(
      "valign",
      "info",
      `${plural(badValign.length, "cell")} with a valign value that does not exist`,
      'valign takes top, middle, bottom or baseline. "center" is not one of them, so it is ignored. The default is middle, so the cell looks the same; the attribute is just not doing anything.',
      { lines: badValign, howTo: { text: 'Use valign="middle".' } },
    );
  }
  const preconnects = tags.filter((t) => t.name === "link" && /preconnect/i.test(t.attrs.rel ?? "") && /fonts\.(googleapis|gstatic)\.com/.test(t.attrs.href ?? ""));
  if (preconnects.length && !tags.some(isGoogleFontLink)) {
    add(
      "preconnect-orphan",
      "info",
      "Google Fonts connection hints with no font loaded",
      "The head tells the client to connect to Google Fonts, but no font is requested from it. The hints are left over from a removed font.",
      { lines: preconnects.map((t) => t.line), howTo: { text: "Remove the two preconnect lines." } },
    );
  }
  // First-named font on each text element; images are left out (their font only styles alt text).
  const fontCounts = new Map<string, number>();
  for (const t of tags) {
    if (t.mso || !t.inBody || t.name === "img") continue;
    const name = styleGet(t.attrs.style, "font-family").split(",")[0].replace(/['"]/g, "").trim();
    if (name && !/^(inherit|sans-serif|serif|monospace)$/.test(name)) fontCounts.set(name, (fontCounts.get(name) ?? 0) + 1);
  }
  if (fontCounts.size > 1) {
    add(
      "fonts-mixed",
      "info",
      `${fontCounts.size} different fonts in use: ${[...fontCounts].sort((x, y) => y[1] - x[1]).map(([name, n]) => `${name} (${n})`).join(", ")}`,
      "The first font named differs between parts of the email. That may be the design; it is also what a block pasted in from another template looks like.",
      { howTo: { text: "Check the smaller group is meant to differ, and match it to the rest if not." } },
    );
  }

  const bare = barePlaceholders(src);
  if (bare.length) {
    const words = [...new Set(bare.map((b) => b.word))];
    const example = stats.platform === "ActiveCampaign" ? `%${words[0]}%` : `{{${words[0]}}}`;
    add(
      "bare-placeholder",
      "info",
      `${words.join(", ")} written as a plain word, not a merge tag`,
      `It reads like a placeholder but has no merge syntax round it, unlike the other variables in this email. If the sending system does not replace the bare word itself, readers get it exactly as written ("Dear ${words[0]},"). Worth confirming with whoever sends it.`,
      {
        lines: bare.map((b) => lineOf(b.index)),
        howTo: {
          text: "If the sender already swaps the bare word, leave it. Otherwise wrap it in the platform's merge syntax, and make sure the sender supplies a value for it: Amazon SES does not deliver a templated email when a variable in the template has no value.",
          code: example,
        },
      },
    );
  }

  const mergeTags = [...new Set([...src.matchAll(MERGE_TAG)].map((m) => m[0]))];
  if (mergeTags.length) {
    add(
      "merge-tags",
      "info",
      `${plural(mergeTags.length, "merge tag")}: ${mergeTags.slice(0, 6).join(", ")}${mergeTags.length > 6 ? " and more" : ""}`,
      `Filled in by ${stats.platform ?? "the sending platform"}. Long values (a long place name, a long first name) are worth testing, because they change line wrapping and the height of the email.`,
      { lines: linesOf(MERGE_TAG) },
    );
  }

  const order: Record<Level, number> = { fail: 0, warn: 1, info: 2 };
  return out.sort((a, b) => order[a.level] - order[b.level] || b.share - a.share);
}

/* ── Fixes ─────────────────────────────────────────────────────────────── */

function addAttr(raw: string, name: string, value: string): string {
  // Before a self-closing slash, if the tag has one.
  return raw.replace(/\s*\/?\s*$/, (tail) => ` ${name}="${value}"${tail}`);
}

function removeAttr(raw: string, name: string): string {
  // The attribute may be bare (`height`), which some editors leave behind.
  return raw.replace(new RegExp(`\\s+${name}(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s"'>/]*))?(?=[\\s/]|$)`, "i"), "");
}

function addStyle(raw: string, declarations: string): string {
  const existing = /(\bstyle\s*=\s*)(["'])([\s\S]*?)\2/i.exec(raw);
  if (!existing) return addAttr(raw, "style", declarations);
  const value = existing[3].trim();
  const joined = value ? `${value}${value.endsWith(";") ? "" : ";"} ${declarations}` : declarations;
  return raw.replace(existing[0], `${existing[1]}${existing[2]}${joined}${existing[2]}`);
}

interface Edit {
  start: number;
  end: number;
  text: string;
}

function applyEdits(src: string, edits: Edit[]): string {
  let out = src;
  for (const edit of [...edits].sort((x, y) => y.start - x.start)) {
    out = out.slice(0, edit.start) + edit.text + out.slice(edit.end);
  }
  return out;
}

/** Rewrites the attributes of every tag `test` picks out. Returns the new source and how many changed. */
function rewriteTags(src: string, test: (t: Tag) => boolean, rewrite: (raw: string, t: Tag) => string): [string, number] {
  const { tags } = parse(src);
  const edits: Edit[] = [];
  for (const tag of tags) {
    if (!test(tag)) continue;
    const raw = rewrite(tag.rawAttrs, tag);
    if (raw !== tag.rawAttrs) edits.push({ start: tag.attrsStart, end: tag.attrsStart + tag.rawAttrs.length, text: raw });
  }
  return [applyEdits(src, edits), edits.length];
}

function insertBeforeHeadClose(src: string, text: string): string | null {
  const m = /<\/head\s*>/i.exec(src);
  return m ? `${src.slice(0, m.index)}${text}\n${src.slice(m.index)}` : null;
}

export interface FixOutcome {
  src: string;
  /** what changed, in plain words; empty when nothing did */
  note: string;
}

/** Values a fix needs from the person, by fix id. */
export interface FixParams {
  preheader?: string;
}

export interface Fix {
  label: string;
  /** part of Fix all; false for the ones a person should choose */
  bulk: boolean;
  apply: (src: string, params: FixParams) => FixOutcome;
}

/**
 * The hidden preheader clients show as the inbox preview line. Invisible in
 * every client that honours display:none, mso-hide for Outlook, and padded
 * with zero-width characters so the preview line stops at the end of the
 * text instead of running on into the body copy.
 */
const PREHEADER_STYLE = "display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;font-family:sans-serif;";
// Broken over lines so the padding never builds a line past the 998 character limit.
const PREHEADER_PAD = `\n${Array.from({ length: 10 }, () => "&#847;&zwnj;&nbsp;".repeat(8)).join("\n")}\n`;

function escapeText(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const same = (src: string): FixOutcome => ({ src, note: "" });

export const FIXES: Record<FixId, Fix> = {
  ppi: {
    label: "Add the PixelsPerInch setting",
    bulk: true,
    apply(src) {
      if (/PixelsPerInch/i.test(src)) return same(src);
      const { tags } = parse(src);
      const head = tags.find((t) => t.name === "head" && !t.mso);
      if (!head) return same(src);
      let out = applyEdits(src, [{ start: head.end, end: head.end, text: `\n${PPI_BLOCK}` }]);
      out = FIXES["xmlns-o"].apply(out, {}).src;
      return { src: out, note: "Added the PixelsPerInch setting for Outlook" };
    },
  },
  "xmlns-o": {
    label: "Add the Office namespace",
    bulk: true,
    apply(src) {
      const [out, n] = rewriteTags(
        src,
        (t) => t.name === "html" && !("xmlns:o" in t.attrs),
        (raw) => addAttr(raw, "xmlns:o", OFFICE_NS),
      );
      return { src: out, note: n ? "Added the Office namespace to the html tag" : "" };
    },
  },
  "ghost-width": {
    label: "Add CSS widths to Outlook-only tables",
    bulk: true,
    apply(src) {
      const [out, n] = rewriteTags(
        src,
        (t) => t.mso && (t.name === "table" || t.name === "td") && /^\d+$/.test(t.attrs.width ?? "") && !styleHas(t.attrs.style, "width"),
        (raw, t) => addStyle(raw, `width:${t.attrs.width}px;`),
      );
      return { src: out, note: n ? `Added CSS widths to ${plural(n, "Outlook-only table or cell", "Outlook-only tables and cells")}` : "" };
    },
  },
  "img-height-empty": {
    label: "Remove empty height attributes",
    bulk: true,
    apply(src) {
      const [out, n] = rewriteTags(
        src,
        (t) => !t.mso && t.name === "img" && "height" in t.attrs && !t.attrs.height.trim(),
        (raw) => removeAttr(raw, "height"),
      );
      return { src: out, note: n ? `Removed ${plural(n, "empty height attribute")}` : "" };
    },
  },
  "table-role": {
    label: 'Add role="presentation" to tables',
    bulk: true,
    apply(src) {
      const [out, n] = rewriteTags(
        src,
        (t) => !t.mso && t.name === "table" && !("role" in t.attrs),
        (raw) => addAttr(raw, "role", "presentation"),
      );
      return { src: out, note: n ? `Added role="presentation" to ${plural(n, "table")}` : "" };
    },
  },
  "table-reset": {
    label: "Add cellpadding and cellspacing",
    bulk: true,
    apply(src) {
      const [out, n] = rewriteTags(
        src,
        (t) => !t.mso && t.name === "table" && (!("cellpadding" in t.attrs) || !("cellspacing" in t.attrs)),
        (raw, t) => {
          if (!("cellpadding" in t.attrs)) raw = addAttr(raw, "cellpadding", "0");
          if (!("cellspacing" in t.attrs)) raw = addAttr(raw, "cellspacing", "0");
          return raw;
        },
      );
      return { src: out, note: n ? `Added missing cellpadding and cellspacing to ${plural(n, "table")}` : "" };
    },
  },
  "spacer-cells": {
    label: "Set spacer cell heights for Outlook",
    bulk: true,
    apply(src) {
      let n = 0;
      const out = src.replace(SPACER_CELL, (cell, rawAttrs: string, content: string) => {
        const height = spacerHeight(rawAttrs);
        if (height === null) return cell;
        n++;
        return `<td${addStyle(rawAttrs, `font-size:1px; line-height:${height}px; mso-line-height-rule:exactly;`)}>${content}</td>`;
      });
      return { src: out, note: n ? `Set the height of ${plural(n, "spacer cell")} for Outlook` : "" };
    },
  },
  "line-height-rule": {
    label: "Add mso-line-height-rule",
    bulk: true,
    apply(src) {
      const [out, n] = rewriteTags(src, needsLineHeightRule, (raw) => addStyle(raw, "mso-line-height-rule:exactly;"));
      return { src: out, note: n ? `Added mso-line-height-rule to ${plural(n, "line-height")}` : "" };
    },
  },
  "table-align-mso": {
    label: "Remove Outlook's side spacing on floated tables",
    bulk: true,
    apply(src) {
      const [out, n] = rewriteTags(src, isAlignedTable, (raw) => addStyle(raw, "mso-table-lspace:0pt; mso-table-rspace:0pt;"));
      return { src: out, note: n ? `Removed Outlook's side spacing on ${plural(n, "floated table")}` : "" };
    },
  },
  "text-size-adjust": {
    label: "Add a text-size-adjust rule",
    bulk: true,
    apply(src) {
      if (/text-size-adjust/i.test(src)) return same(src);
      const out = insertBeforeHeadClose(src, TEXT_SIZE_STYLE);
      return out ? { src: out, note: "Added a text-size-adjust rule for iOS Mail" } : same(src);
    },
  },
  "apple-reformat": {
    label: "Add the Apple reformatting meta tag",
    bulk: true,
    apply(src) {
      if (/x-apple-disable-message-reformatting/i.test(src)) return same(src);
      const out = insertBeforeHeadClose(src, APPLE_REFORMAT_META);
      return out ? { src: out, note: "Added the x-apple-disable-message-reformatting meta tag" } : same(src);
    },
  },
  "unused-fonts": {
    label: "Remove unused font links",
    bulk: true,
    apply(src) {
      const declared = declaredFamilies(src);
      const { tags } = parse(src);
      const edits: Edit[] = [];
      for (const tag of tags) {
        if (!isUnusedFontLink(tag, declared)) continue;
        // Take the whole line with it when the tag is alone on one.
        let start = tag.start;
        let end = tag.end;
        const lineStart = src.lastIndexOf("\n", start - 1) + 1;
        if (!src.slice(lineStart, start).trim()) {
          const lineEnd = src.indexOf("\n", end);
          if (lineEnd !== -1 && !src.slice(end, lineEnd).trim()) {
            start = lineStart;
            end = lineEnd + 1;
          }
        }
        edits.push({ start, end, text: "" });
      }
      if (!edits.length) return same(src);
      let out = applyEdits(src, edits);
      // With no Google font left, the preconnect hints for it are dead weight too.
      if (!/fonts\.googleapis\.com\/css/.test(out)) {
        out = out.replace(/[ \t]*<link\b[^>]*>[ \t]*\n?/gi, (link) =>
          /preconnect/i.test(link) && /fonts\.(googleapis|gstatic)\.com/.test(link) ? "" : link,
        );
      }
      return { src: out, note: `Removed ${plural(edits.length, "unused font link")}` };
    },
  },
  minify: {
    label: "Minify",
    bulk: false,
    apply(src) {
      const keep: string[] = [];
      const guarded = src.replace(/<(pre|textarea)\b[^>]*>[\s\S]*?<\/\1>/gi, (block) => {
        keep.push(block);
        return `\u0000${keep.length - 1}\u0000`;
      });
      const slim = guarded
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join("\n")
        .replace(/\u0000(\d+)\u0000/g, (_, i: string) => keep[Number(i)]);
      if (slim === src) return same(src);
      const before = new TextEncoder().encode(src).length;
      const after = new TextEncoder().encode(slim).length;
      return { src: slim, note: `Minified from ${(before / 1024).toFixed(1)}KB to ${(after / 1024).toFixed(1)}KB` };
    },
  },
  "styles-to-head": {
    label: "Move style blocks into the head",
    bulk: true,
    apply(src) {
      const { styles } = parse(src);
      const inBody = styles.filter((s) => s.inBody);
      const headClose = /<\/head\s*>/i.exec(src);
      if (!inBody.length || !headClose) return same(src);
      const moved = inBody.map((s) => src.slice(s.start, s.end)).join("\n");
      const edits: Edit[] = inBody.map((s) => ({ start: s.start, end: s.end, text: "" }));
      edits.push({ start: headClose.index, end: headClose.index, text: `${moved}\n` });
      return { src: applyEdits(src, edits), note: `Moved ${plural(inBody.length, "style block")} into the head` };
    },
  },
  "font-fallbacks": {
    label: "Add generic font fallbacks",
    bulk: true,
    apply(src) {
      let n = 0;
      const out = src.replace(/(font-family\s*:\s*)([^;"}]+)/gi, (whole, prefix: string, value: string) => {
        if (!needsFallback(value)) return whole;
        n++;
        const fallback = /mono|courier|consolas|menlo/i.test(value) ? "monospace" : /georgia|times|garamond|serif/i.test(value) ? "serif" : "sans-serif";
        const [fonts, important = ""] = value.split(/\s*(!important)\s*$/i);
        return `${prefix}${fonts.trim()}, ${fallback}${important ? ` ${important}` : ""}`;
      });
      return { src: out, note: n ? `Added a generic fallback to ${plural(n, "font-family")}` : "" };
    },
  },
  "bg-color-fallback": {
    label: "Add a background colour behind background images",
    bulk: true,
    apply(src) {
      const [out, n] = rewriteTags(
        src,
        (t) => !t.mso && ["td", "table", "body"].includes(t.name) && hasBackgroundImage(t) && !hasBackgroundColor(t),
        (raw) => addAttr(raw, "bgcolor", "#ffffff"),
      );
      return { src: out, note: n ? `Added a white bgcolor behind ${plural(n, "background image")} (change it to suit)` : "" };
    },
  },
  preheader: {
    label: "Set the inbox preview line",
    bulk: false,
    apply(src, params) {
      const text = (params.preheader ?? "").replace(/\s+/g, " ").trim();
      if (!text) return same(src);
      const content = `${escapeText(text)}${PREHEADER_PAD}`;
      const { tags } = parse(src);
      // Only a hidden span or div of plain text, ahead of the first table, is a preheader.
      // A hidden block further down is mobile-only content and must not be overwritten.
      const firstTable = tags.find((t) => !t.mso && t.inBody && t.name === "table")?.start ?? Number.POSITIVE_INFINITY;
      const existing = tags.find((t) => {
        if (t.mso || !t.inBody || t.start > firstTable || !isHiddenElement(t) || (t.name !== "span" && t.name !== "div")) return false;
        const close = src.indexOf(`</${t.name}>`, t.end);
        return close !== -1 && !src.slice(t.end, close).includes("<");
      });
      if (existing) {
        // Replace what is inside the preheader element, keeping its tag and styles.
        const close = src.indexOf(`</${existing.name}>`, existing.end);
        const current = src.slice(existing.end, close);
        if (current === content) return same(src);
        return { src: `${src.slice(0, existing.end)}${content}${src.slice(close)}`, note: `Set the inbox preview line to "${text}"` };
      }
      const body = /<body\b[^>]*>/i.exec(src);
      if (!body) return same(src);
      const at = body.index + body[0].length;
      const block = `\n<div style="${PREHEADER_STYLE}">${content}</div>`;
      return { src: `${src.slice(0, at)}${block}${src.slice(at)}`, note: `Added a hidden preheader: "${text}"` };
    },
  },
  "preheader-pad": {
    label: "Pad the preheader",
    bulk: true,
    apply(src) {
      const { tags } = parse(src);
      const firstTable = tags.find((t) => !t.mso && t.inBody && t.name === "table")?.start ?? src.length;
      const pre = tags.find((t) => !t.mso && t.inBody && t.start < firstTable && isHiddenElement(t));
      if (!pre) return same(src);
      const close = src.indexOf(`</${pre.name}>`, pre.end);
      if (close === -1) return same(src);
      const inner = src.slice(pre.end, close);
      if (!inner.trim() || inner.includes("<") || /&zwnj;|&#847;|&#8199;|&#8204;/.test(inner)) return same(src);
      return { src: `${src.slice(0, close)}${PREHEADER_PAD}${src.slice(close)}`, note: "Padded the preheader so the inbox preview stops at the end of it" };
    },
  },
  "html-lang": {
    label: 'Add lang="en"',
    bulk: true,
    apply(src) {
      const [out, n] = rewriteTags(
        src,
        (t) => t.name === "html" && !("lang" in t.attrs),
        (raw) => addAttr(raw, "lang", "en"),
      );
      return { src: out, note: n ? 'Added lang="en" to the html tag' : "" };
    },
  },
  "outlook-typography": {
    label: "Turn off Outlook's advanced typography",
    bulk: true,
    apply(src) {
      if (/DontUseAdvancedTypographyReadingMail/i.test(src)) return same(src);
      const out = insertBeforeHeadClose(src, OUTLOOK_TYPOGRAPHY_BLOCK);
      return out ? { src: out, note: "Turned off Outlook's advanced typography" } : same(src);
    },
  },
};

export const FIX_IDS = Object.keys(FIXES) as FixId[];

export interface AppliedFix {
  id: FixId;
  note: string;
}

/** Folds the fixes over the source in order. Fixes that change nothing are reported with an empty note. */
export function applyFixes(src: string, ids: FixId[], params: FixParams = {}): { src: string; applied: AppliedFix[] } {
  const applied: AppliedFix[] = [];
  let out = src;
  for (const id of ids) {
    const result = FIXES[id].apply(out, params);
    out = result.src;
    applied.push({ id, note: result.note });
  }
  return { src: out, applied };
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
  platform: string;
  label: string;
  status: Support;
  notes: string[];
  /** share of opens, 0 to 100, approximate below family level */
  share: number;
  environment: Environment;
}

export interface FeatureUse {
  slug: string;
  title: string;
  url: string;
  count: number;
  lines: number[];
  support: ClientSupport[];
  /** a fix that removes the dependency on this feature, where one exists */
  fix?: FixId;
}

/** Features whose use can be removed or backed up automatically. The test says whether the fix would do anything. */
const FEATURE_FIXES: Partial<Record<string, { fix: FixId; applies: (src: string) => boolean }>> = {
  "html-style": { fix: "styles-to-head", applies: (src) => parse(src).styles.some((s) => s.inBody) },
  "html-link": { fix: "unused-fonts", applies: (src) => parse(src).tags.some((t) => isUnusedFontLink(t, declaredFamilies(src))) },
  "css-at-font-face": { fix: "font-fallbacks", applies: (src) => FIXES["font-fallbacks"].apply(src, {}).note !== "" },
  "css-background-image": { fix: "bg-color-fallback", applies: (src) => FIXES["bg-color-fallback"].apply(src, {}).note !== "" },
  "css-background": { fix: "bg-color-fallback", applies: (src) => FIXES["bg-color-fallback"].apply(src, {}).note !== "" },
  "html-role": { fix: "table-role", applies: (src) => FIXES["table-role"].apply(src, {}).note !== "" },
};

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

  for (const { css, offset, start, inBody } of styles) {
    if (inBody) hit("html-style", lineOf(start));
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
      if (name !== "target") hit(ATTRIBUTE_FEATURES[name], tag.line);
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
      const count = Object.keys(platforms).length;
      for (const [platform, versions] of Object.entries(platforms)) {
        // Versions are listed oldest first; the last one is the current result.
        const latest = Object.values(versions).at(-1) ?? "u";
        const status = (["y", "a", "n"].includes(latest[0]) ? latest[0] : "u") as Support;
        support.push({
          family,
          platform,
          label: `${data.nicenames.family[family] ?? family} ${data.nicenames.platform[platform] ?? platform}`,
          status,
          notes: [...latest.matchAll(/#(\d+)/g)]
            .map((n) => feature.notes_by_num?.[n[1]])
            .filter((n): n is string => !!n)
            .map(plainNote),
          share: shareOf(family, platform, count),
          environment: platformEnvironment(platform),
        });
      }
    }
    const fixer = FEATURE_FIXES[slug];
    return {
      slug,
      title: feature.title,
      url: feature.url,
      count: use.count,
      lines: [...use.lines].sort((a, b) => a - b),
      support,
      fix: fixer && fixer.applies(src) ? fixer.fix : undefined,
    };
  });
}
