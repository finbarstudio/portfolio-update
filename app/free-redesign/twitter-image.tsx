/**
 * Twitter share card for /free-redesign. Next.js does not reuse
 * opengraph-image for Twitter automatically, so we re-export the same
 * generator to keep one source of truth — identical 1200×630 PNG.
 */
export { alt, size, contentType } from "./opengraph-image";
export { default } from "./opengraph-image";
