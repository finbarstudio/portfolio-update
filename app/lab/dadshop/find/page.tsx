import FindView from "@/components/dad-shop/FindView";
import NotConnected from "@/components/dad-shop/NotConnected";
import { nowIso } from "@/lib/dad-shop/api";
import { getDeals, getFacets, getList, getOfferGroups, getShelves, searchProducts } from "@/lib/dad-shop/catalog";
import { getDb } from "@/lib/dad-shop/db";
import { defaultSort } from "@/lib/dad-shop/find";
import { PAGE_SIZE, VIEWS, type Deal, type Facets, type FindFilters, type OfferGroup, type ProductCard, type Shelf, type View } from "@/lib/dad-shop/types";
import { parseFindParams } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

const EMPTY_FACETS: Facets = { total: 0, zones: [], depts: [], cats: [], colls: {}, collDepts: {}, animals: [] };

const DEFAULTS: FindFilters = {
  q: "",
  view: "all",
  coll: "",
  zone: "",
  dept: "",
  cat: "",
  animal: "",
  sort: "rec",
  page: 0,
  noSeedOil: true,
  good: false,
  frozen: false,
  rated: false,
  onList: false,
  fewIngredients: false,
  hideSat: true,
  hideOwn: false,
  hideSingle: false,
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
  // "No seed oils" and "Hide high sat fat" are on unless the address says otherwise.
  if (!params.has("noSeedOil")) params.set("noSeedOil", "1");
  if (!params.has("hideSat")) params.set("hideSat", "1");
  const view = (VIEWS as readonly string[]).includes(params.get("view") ?? "") ? (params.get("view") as View) : "all";
  if (!params.has("sort")) params.set("sort", defaultSort(view));
  const parsed = parseFindParams(params);
  const filters = parsed.ok ? parsed.value : DEFAULTS;

  let items: ProductCard[] = [];
  let hasMore = false;
  let groups: OfferGroup[] | null = null;
  let groupsMore = false;
  let shelves: Shelf[] | null = null;
  let deals: Deal[] | null = null;

  // "Show more" asks for page N: render pages 0..N together so nothing vanishes.
  const facetsP = filters.view === "deals" ? Promise.resolve(EMPTY_FACETS) : getFacets(sql, filters);
  const listP = getList(sql);
  if (filters.view === "multibuys") {
    const g = await getOfferGroups(sql, filters);
    groups = g.groups;
    groupsMore = g.hasMore;
  } else if (filters.view === "foryou") {
    shelves = await getShelves(sql, filters);
  } else {
    if (filters.view === "deals") deals = await getDeals(sql);
    const found = await searchProducts(sql, { ...filters, page: 0 }, PAGE_SIZE * (filters.page + 1));
    items = found.items;
    hasMore = found.hasMore;
  }
  const [facets, list] = await Promise.all([facetsP, listP]);

  return (
    <FindView
      filters={filters}
      facets={facets}
      items={items}
      hasMore={hasMore}
      groups={groups}
      groupsMore={groupsMore}
      shelves={shelves}
      deals={deals}
      list={list}
      nowIso={nowIso()}
    />
  );
}
