import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion, isSanityConfigured } from "./env";

/**
 * Read-only Sanity client. `null` until configured (so imports never throw at
 * build with no env). `useCdn: true` = served from Sanity's cached API edge.
 */
export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;

/**
 * Tagged fetch. Results are cached by Next and tagged "post"; the /api/revalidate
 * webhook calls revalidateTag("post") when Finbar publishes, so a built page is
 * served from Vercel's edge and Sanity is queried only at build + on publish —
 * never per visitor (the free-tier bandwidth safeguard).
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = ["post"],
): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params, { next: { tags } });
  } catch (err) {
    console.error("sanityFetch failed:", err);
    return null;
  }
}
