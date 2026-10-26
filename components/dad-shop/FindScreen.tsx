import FindView from "@/components/dad-shop/FindView";
import NotConnected from "@/components/dad-shop/NotConnected";
import { nowIso } from "@/lib/dad-shop/api";
import { getDeals, getFacets, getList, getShelves, searchProducts } from "@/lib/dad-shop/catalog";
import { getDb } from "@/lib/dad-shop/db";
import { defaultSort } from "@/lib/dad-shop/find";
import {
  PAGE_SIZE,
  VIEWS,
  type Deal,
  type Facets,
  type FindFilters,
  type ForYou,
  type ProductCard,
  type View,
} from "@/lib/dad-shop/types";
import { parseFindParams } from "@/lib/dad-shop/validate";

const EMPTY_FACETS: Facets = { total: 0, zones: [], depts: [], cats: [], colls: {}, collDepts: {}, animals: [] };

const DEFAULTS: FindFilters = {
  q: "",
  view: "all",
  coll: "",
  zone: "",
  dept: "",
  cat: "",
  animal: "",
  sort: "best",
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
  tasteDiff: false,
  onOffer: false,
};

/**
 * Find. The address holds the search, so Back from a product returns to it.
 * The home page (/dadshop) shows this with For you as the view; /dadshop/find
 * shows it with All. Both are this one screen.
 */
export default async function FindScreen({
  searchParams,
  defaultView,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  defaultView: View;
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
  const asked = params.get("view") ?? defaultView;
  const view = (VIEWS as readonly string[]).includes(asked) ? (asked as View) : defaultView;
  params.set("view", view);
  if (!params.has("sort")) params.set("sort", defaultSort(view));
  const parsed = parseFindParams(params);
  const filters = parsed.ok ? parsed.value : DEFAULTS;

  let items: ProductCard[] = [];
  let hasMore = false;
  let forYou: ForYou | null = null;
  let deals: Deal[] | null = null;

  // "Show more" asks for page N: render pages 0..N together so nothing vanishes.
  const facetsP = filters.view === "deals" || filters.view === "foryou" ? Promise.resolve(EMPTY_FACETS) : getFacets(sql, filters);
  const listP = getList(sql);
  if (filters.view === "foryou") {
    forYou = await getShelves(sql, filters);
  } else {
    if (filters.view === "deals") deals = await getDeals(sql);
    const found = await searchProducts(sql, { ...filters, page: 0 }, PAGE_SIZE * (filters.page + 1));
    items = found.items;
    hasMore = found.hasMore;
  }
  const [facets, list] = await Promise.all([facetsP, listP]);

  return <FindView filters={filters} facets={facets} items={items} hasMore={hasMore} forYou={forYou} deals={deals} list={list} nowIso={nowIso()} />;
}
