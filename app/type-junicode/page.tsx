/**
 * The live home page, re-exported verbatim.
 *
 * Deliberately not a copy. /redesign keeps a hand-maintained 1:1 duplicate of
 * the home page because it iterates on the skin's structure; this sandbox only
 * changes the typeface, so the content should never diverge from the real page
 * by so much as a word. Re-exporting means it can't: the layout supplies the
 * Junicode scope and the noindex metadata, and the page underneath is the
 * genuine article rather than a snapshot that goes stale.
 */
export { default } from "@/app/(site)/page";
