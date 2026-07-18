/**
 * Sanity connection, read from public env. Everything downstream is GATED on
 * `isSanityConfigured`: with the vars unset the site still builds and /journal
 * renders an empty state — nothing throws. Finbar adds these once his new
 * (blog-only) Sanity project exists:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID   — the new project's id
 *   NEXT_PUBLIC_SANITY_DATASET      — "production"
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Pinned API date — bump deliberately, never floating.
export const apiVersion = "2024-10-01";

export const isSanityConfigured = Boolean(projectId);
