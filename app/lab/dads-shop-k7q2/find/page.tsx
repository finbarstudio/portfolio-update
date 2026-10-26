import FindView from "@/components/dad-shop/FindView";
import NotConnected from "@/components/dad-shop/NotConnected";
import { nowIso } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { getZones, searchProducts } from "@/lib/dad-shop/queries";
import { PAGE_SIZE, type FindFilters } from "@/lib/dad-shop/types";
import { parseFindParams } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

const DEFAULTS: FindFilters = {
  q: "",
  noSeedOil: true,
  highProtein: false,
  lowSat: false,
  fewIngredients: false,
  onOffer: false,
  zone: "",
  sort: "best",
  page: 0,
};

/** Find. The address holds the search, so Back from a product returns to it. */
export default async function FindPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sql = getDb();
  if (!sql) return <NotConnected />;

  const raw = await searchParams;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(raw)) {
    const first = Array.isArray(v) ? v[0] : v;
    if (typeof first === "string") params.set(k, first);
  }
  // "No seed oils" is on unless the address says otherwise.
  if (!params.has("noSeedOil")) params.set("noSeedOil", "1");
  const parsed = parseFindParams(params);
  const filters = parsed.ok ? parsed.value : DEFAULTS;

  // "Show more" asks for page N: render pages 0..N together so nothing vanishes.
  const [found, zones] = await Promise.all([
    searchProducts(sql, { ...filters, page: 0 }, PAGE_SIZE * (filters.page + 1)),
    getZones(sql),
  ]);

  return <FindView filters={filters} zones={zones} items={found.items} hasMore={found.hasMore} nowIso={nowIso()} />;
}
