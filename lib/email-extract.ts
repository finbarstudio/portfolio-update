/**
 * Pulls an email's HTML back out of a sending platform's "view online" page.
 *
 * ActiveCampaign's web copy drops the email's html, head and body tags and
 * pours the head's children (Outlook xml, font links, style blocks) and the
 * body's children into one <div class="message-body-container">, wrapped in
 * its own share bar and footer. This finds that container, splits the head
 * parts from the body parts again, and rebuilds a standalone document.
 *
 * What cannot come back: the original meta tags, the body tag's own
 * attributes, and merge tags, which the page shows already filled in.
 */

export interface Extracted {
  src: string;
  platform: string;
  /** what was lost or changed on the way, for the person to know */
  notes: string[];
}

const AC_CONTAINER = /<div\b[^>]*class="[^"]*\bmessage-body-container\b[^"]*"[^>]*>/i;

/** Index just past the </div> that closes the div opening at `openEnd`. */
function matchingDivClose(html: string, openEnd: number): number {
  const re = /<\/?div\b[^>]*>/gi;
  re.lastIndex = openEnd;
  let depth = 1;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    depth += m[0][1] === "/" ? -1 : 1;
    if (depth === 0) return m.index;
  }
  return -1;
}

/**
 * Splits a run of markup into the part that belongs in the head (comments,
 * xml, link, style, meta, title) and the first thing that belongs in the body.
 */
function splitHead(inner: string): { head: string; body: string } {
  const re = /\s*(?:<!--[\s\S]*?-->|<(link|meta)\b[^>]*>|<(style|title|xml)\b[^>]*>[\s\S]*?<\/\2>)/giy;
  let end = 0;
  for (let m = re.exec(inner); m; m = re.exec(inner)) end = re.lastIndex;
  return { head: inner.slice(0, end).trim(), body: inner.slice(end).trim() };
}

function pageTitle(html: string): string {
  const og = /<meta\b[^>]*property="og:title"[^>]*content="([^"]*)"/i.exec(html)?.[1];
  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1];
  return (og ?? title ?? "Email").replace(/\s+/g, " ").trim();
}

export function isActiveCampaignPage(html: string): boolean {
  return AC_CONTAINER.test(html);
}

export function extractActiveCampaign(html: string): Extracted | null {
  const open = AC_CONTAINER.exec(html);
  if (!open) return null;
  const start = open.index + open[0].length;
  const close = matchingDivClose(html, start);
  if (close === -1) return null;

  let inner = html.slice(start, close).replace(/\r\n/g, "\n");
  const notes: string[] = [];

  // The tracking pixel and the trailing <br> the page adds under the email.
  inner = inner.replace(/<img\b[^>]*(?:\/lt\.php|open\.php|\/track\/)[^>]*>\s*$/i, () => {
    notes.push("Removed the tracking pixel the page adds at the end.");
    return "";
  });
  inner = inner.replace(/(?:\s*<br\s*\/?>)+\s*$/i, "");

  const { head, body } = splitHead(inner);
  const usesOffice = /urn:schemas-microsoft-com:office|<o:/i.test(head);

  if (/class="perstag_address"/.test(body)) notes.push("The sender address is shown filled in; in the template it is %SENDER-INFO-SINGLELINE%.");
  if (/activehosted\.com\/unsubscribe\//.test(body)) notes.push("The unsubscribe link is shown resolved; in the template it is %UNSUBSCRIBELINK%.");
  notes.push("Merge tags such as %FIRSTNAME% and %EMAIL% appear filled in with the recipient's details.");
  notes.push("The original meta tags, title and body attributes are not in the page, so standard ones are used.");

  const src = [
    "<!DOCTYPE html>",
    `<html lang="en" xmlns="http://www.w3.org/1999/xhtml"${usesOffice ? ' xmlns:o="urn:schemas-microsoft-com:office:office"' : ""}>`,
    "<head>",
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${pageTitle(html).replace(/</g, "&lt;")}</title>`,
    head,
    "</head>",
    '<body style="margin:0; padding:0;">',
    body,
    "</body>",
    "</html>",
    "",
  ].join("\n");

  return { src, platform: "ActiveCampaign", notes };
}

/** Tries every platform extractor; null when the markup is not a known preview page. */
export function extractFromPreviewPage(html: string): Extracted | null {
  return extractActiveCampaign(html);
}

/** Hosts the fetch route will read from; anything else is refused. */
export const PREVIEW_HOSTS = [/\.activehosted\.com$/i];

export function isPreviewUrl(text: string): URL | null {
  const trimmed = text.trim();
  if (!/^https?:\/\/\S+$/i.test(trimmed)) return null;
  try {
    const url = new URL(trimmed);
    return PREVIEW_HOSTS.some((re) => re.test(url.hostname)) ? url : null;
  } catch {
    return null;
  }
}
