import { failed, notConnected } from "@/lib/dad-shop/api";
import { CATALOG_PARTS } from "@/lib/dad-shop/app-catalog";
import { loadCatalogItems } from "@/lib/dad-shop/app-catalog-db";
import { getDb } from "@/lib/dad-shop/db";

export const dynamic = "force-dynamic";

/**
 * Every available food product as a slim item (no ingredients, no fitWhy, no raw nutrition), downloaded once and worked
 * on in the browser. Served in CATALOG_PARTS parts (?part=0..N-1, id order) because a function response is capped at
 * 4.5MB; the browser fetches them all at once. Shared cache for ten minutes, then served stale while it refreshes.
 * Errors are never cached.
 */
export async function GET(req: Request): Promise<Response> {
  const raw = new URL(req.url).searchParams.get("part");
  const part = raw !== null && /^\d+$/.test(raw) ? Number(raw) : -1;
  if (part < 0 || part >= CATALOG_PARTS) {
    return Response.json({ error: `Ask for one part: ?part=0 to ${CATALOG_PARTS - 1}` }, { status: 400 });
  }
  const sql = getDb();
  if (!sql) return notConnected();
  try {
    const items = (await loadCatalogItems(sql)).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    const size = Math.ceil(items.length / CATALOG_PARTS);
    return Response.json(
      { part, parts: CATALOG_PARTS, items: items.slice(part * size, (part + 1) * size) },
      { headers: { "cache-control": "public, s-maxage=600, stale-while-revalidate=3600" } },
    );
  } catch (err) {
    return failed(err);
  }
}
