/**
 * Serialise structured data for a `<script type="application/ld+json">` tag.
 *
 * `JSON.stringify` does NOT escape "<", so a literal "</script>" inside any
 * string value — e.g. remote LemonSqueezy product copy, or project content —
 * would close the tag early and let following markup execute. Escaping "<" to
 * its unicode form keeps the JSON valid while making it impossible to break out
 * of the script element.
 */
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
