/**
 * Twitter share card. Next.js does not reuse `opengraph-image` for Twitter
 * automatically, so we re-export the same generator to keep one source of
 * truth. Produces the identical 1200×630 PNG used for `twitter:image`.
 */
export { alt, size, contentType } from "./opengraph-image";
export { default } from "./opengraph-image";
