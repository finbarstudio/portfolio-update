import "server-only";
import type postgres from "postgres";
import type { Sql } from "./db";
import { AVOID_KEY, avoidFromRows } from "./avoid";
import { fitScore } from "./fit";
import { OVERALL_WEIGHTS } from "./overall";
import { packInfo } from "./pack";
import { HIGH_PROTEIN_FLOOR_G, HIGH_PROTEIN_G, HIGH_PROTEIN_PER_100KCAL } from "./protein";
import { searchVariants } from "./search";
import { buildShelves, PROTEIN_SHELF_MAX_SAT, SHELF_SIZE } from "./shelves";
import { STOCK_FRESH_HOURS } from "./store";
import { scopeLabel, selectSimilar, similarScope, type Candidate } from "./similar";
import { applyTaste, buildTaste, likedKeys, type TasteProfile, type TasteRow } from "./taste";
import {
  PAGE_SIZE,
  type Deal,
  type DealLink,
  type DealPage,
  type Facets,
  type FindFilters,
  type ListItem,
  type ForYou,
  type OfferPage,
  type ProductCard,
  type ProductDetail,
  type Promo,
  type SeedOil,
  type SimilarSection,
  type StoreStatus,
  STORE_STATUSES,
  type Sort,
  type Nutrition,
} from "./types";

/**
 * Everything that reads the product catalogue. Parameterised SQL only.
 *
 * The heart is `scored()`: one CTE that works out, for every food product that
 * is on sale, the price he pays (Nectar taken as read), the best saving, and a
 * simple Value score (how cheap it is per 100g of protein, or per kg, against
 * the other products in its category, plus the size of any deal). Pages then
 * filter and sort on those columns.
 */

const SEED_OILS: readonly string[] = ["none", "likely", "yes", "unknown"];

function asSeedOil(v: string | null): SeedOil {
  return v !== null && SEED_OILS.includes(v) ? (v as SeedOil) : "unknown";
}

function asStoreStatus(v: string | null): StoreStatus {
  return v !== null && (STORE_STATUSES as readonly string[]).includes(v) ? (v as StoreStatus) : "unknown";
}

function asPromos(v: unknown): Promo[] {
  return Array.isArray(v) ? (v as Promo[]) : [];
}

function iso(v: Date | string | null): string | null {
  if (v == null) return null;
  return v instanceof Date ? v.toISOString() : String(v);
}

/** Escapes LIKE wildcards so what he types is matched literally. */
function likePattern(word: string): string {
  return `%${word.replace(/[\\%_]/g, "\\$&")}%`;
}

type Fragment = postgres.PendingQuery<postgres.Row[]>;

// ── The scored catalogue ────────────────────────────────────────────────────

/**
 * `ids` narrows the output to a few products while still ranking them against
 * everything else in their category. Without it, every product comes back.
 */
export function scored(sql: Sql, ids: string[] | null, by: "category" | "department" = "category"): Fragment {
  // A group can span categories, so its members come along with the category (or department): the value
  // benchmark (group first, then category) must see the same products it would on the whole catalogue.
  const scope = !ids
    ? sql``
    : by === "department"
      ? sql`and (coalesce(p.department, '') in (select coalesce(department, '') from products where id = any(${ids}::text[]))
        or p.product_group in (select product_group from products where id = any(${ids}::text[])))`
      : sql`and (coalesce(p.category, '') in (select coalesce(category, '') from products where id = any(${ids}::text[]))
        or p.product_group in (select product_group from products where id = any(${ids}::text[])))`;
  return sql`
    with b as (
      select p.id, p.slug, p.name, p.brand, p.image_url, p.zone, p.department, p.category,
        p.price::float8 as price, p.was_price::float8 as was_price, p.offer_price::float8 as offer_price,
        p.nectar_price::float8 as nectar_price, p.unit_price::float8 as unit_price, p.unit_measure,
        p.pack_grams::float8 as pack_grams, p.storage, p.promos, p.seed_oil, p.health::float8 as health,
        p.ingredient_count, p.ingredients, p.upf_markers, p.review_avg::float8 as review_avg, p.review_count,
        p.is_new, p.is_basic, p.ingredients_source, p.nutrition_source, p.animal, p.product_group, p.protein_main, p.store_status, p.store_reason, p.store_in_stock, p.store_stock_at, p.is_available, p.nutrition, p.seed_oils_found, p.reasons, p.listed_at,
        pr.now_price, pr.full_price,
        (case when jsonb_typeof(p.nutrition->'protein') = 'number' then (p.nutrition->>'protein')::float8 end) as protein,
        -- No saturates printed on a fat-free product counts as 0, as the pipeline scores it.
        (case when jsonb_typeof(p.nutrition->'sat') = 'number' then (p.nutrition->>'sat')::float8
              when jsonb_typeof(p.nutrition->'fat') = 'number' and (p.nutrition->>'fat')::float8 = 0 then 0 end) as sat,
        (case when jsonb_typeof(p.nutrition->'kcal') = 'number' then (p.nutrition->>'kcal')::float8 end) as kcal,
        coalesce(p.ingredients ~* 'folic acid', false) as folic_acid,
        (p.pack_grams * (case when jsonb_typeof(p.nutrition->'protein') = 'number' then (p.nutrition->>'protein')::float8 end) / 100)::float8 as pack_protein,
        (pr.now_price < pr.full_price - 0.004 or exists (
          select 1 from jsonb_array_elements(p.promos) e
          where coalesce(e->>'kind', '') <> 'mealdeal' and coalesce(e->>'text', '') !~* 'meal deal'
        )) as has_offer,
        exists (
          select 1 from jsonb_array_elements(p.promos) e where e->>'kind' = 'multibuy'
        ) as is_multi,
        dl.deal_unit
      from products p
      cross join lateral (
        select least(p.price, p.offer_price, p.nectar_price)::float8 as now_price,
               greatest(p.price, coalesce(p.was_price, p.price))::float8 as full_price
      ) pr
      left join lateral (
        select min(case
          when jsonb_typeof(e->'qty') = 'number' and (e->>'qty')::numeric >= 2 then
            case
              when jsonb_typeof(e->'getFree') = 'number' then pr.now_price * ((e->>'qty')::numeric - (e->>'getFree')::numeric) / (e->>'qty')::numeric
              when jsonb_typeof(e->'savePct') = 'number' then pr.full_price * (1 - (e->>'savePct')::numeric / 100)
              when jsonb_typeof(e->'dealPrice') = 'number' and (e->>'dealPrice')::numeric > 0 then (e->>'dealPrice')::numeric / (e->>'qty')::numeric
            end
        end)::float8 as deal_unit
        from jsonb_array_elements(p.promos) e
        where e->>'kind' = 'multibuy'
      ) dl on true
      where p.is_food and p.is_available and p.price > 0 ${scope}
    ),
    gc as (
      select product_group, count(*)::int as n from products
      where is_food and is_available and price > 0 and product_group is not null group by product_group
    ),
    m as (
      select b.*,
        greatest(0, 1 - least(b.now_price, coalesce(b.deal_unit, b.now_price)) / nullif(b.full_price, 0)) as discount,
        -- Value is judged against its own comparison group (deli chicken against deli chicken); a group with
        -- fewer than 4 products, or no group yet, falls back to its category.
        case when b.product_group is not null and coalesce(gc.n, 0) >= 4 then 'g:' || b.product_group
             else coalesce(b.category, b.department, b.zone, '') end as ckey,
        case
          when b.pack_protein >= 5 and b.protein >= 10 then b.now_price / b.pack_protein * 100
          when b.unit_price is not null and b.unit_price > 0 and b.unit_measure in ('kg', 'ltr') then b.unit_price * b.now_price / b.price
        end as metric,
        case
          when b.pack_protein >= 5 and b.protein >= 10 then 'protein'
          when b.unit_price is not null and b.unit_price > 0 and b.unit_measure in ('kg', 'ltr') then 'kg'
        end as basis
      from b left join gc on gc.product_group = b.product_group
    ),
    r as (
      select m.id,
        percent_rank() over (partition by m.ckey, m.basis order by m.metric desc) as pr,
        count(*) over (partition by m.ckey, m.basis) as n
      from m where m.metric is not null
    ),
    paid as (
      select distinct on (i->>'productId') i->>'productId' as pid,
        (i->>'paidEach')::float8 as each, sh.finished_at as at, i->>'offer' as offer
      from shops sh, jsonb_array_elements(sh.items) i
      where i->>'productId' is not null and jsonb_typeof(i->'paidEach') = 'number'
      order by i->>'productId', sh.finished_at desc
    ),
    s as (
      select m.*,
        case when r.n >= 4 then r.pr end as pct,
        rt.stars::int as stars,
        bv.vote::int as vote,
        (nas.product_id is not null) as not_at_store,
        -- His own report wins (the latest tick, button or "not at my store"), then the daily range feed.
        case when lr.status = 'found' then 'yes'
             when lr.status = 'missing' or nas.product_id is not null then 'no'
             else coalesce(m.store_status, 'unknown') end as store_eff,
        case when lr.status = 'found' then 'You found it here' when lr.status = 'missing' or nas.product_id is not null then 'You said it isn''t on the shelf here'
             else m.store_reason end as store_why,
        -- Live stock counts only for a yes or likely that nobody has overruled, and only while the reading is fresh.
        case when lr.status is null and nas.product_id is null and m.store_status in ('yes', 'likely')
                  and m.store_in_stock is not null and m.store_stock_at > now() - make_interval(hours => ${STOCK_FRESH_HOURS}::int)
             then case when m.store_in_stock then 'in' else 'out' end end as store_stock,
        m.store_stock_at,
        exists (select 1 from list_items li where li.product_id = m.id) as on_list,
        paid.each as paid_each, paid.at as paid_at, paid.offer as paid_offer,
        case
          when m.metric is null and m.discount <= 0.001 then null
          else round(10 * (0.7 * coalesce(case when r.n >= 4 then r.pr end, 0.5) + 0.3 * least(m.discount / 0.4, 1)))::int
        end as value,
        case
          when rt.stars is null then m.health
          when m.health is null then (case rt.stars when 1 then 0 when 2 then 2.5 when 3 then 5 when 4 then 7.5 else 10 end)
          else 0.6 * m.health + 0.4 * (case rt.stars when 1 then 0 when 2 then 2.5 when 3 then 5 when 4 then 7.5 else 10 end)
        end::float8 as fit
      from m
      left join r on r.id = m.id
      left join ratings rt on rt.product_id = m.id
      left join basket_votes bv on bv.product_id = m.id
      left join not_at_store nas on nas.product_id = m.id
      left join lateral (select sr.status from store_reports sr where sr.product_id = m.id order by sr.reported_at desc limit 1) lr on true
      left join paid on paid.pid = m.id
    )
  `;
}

export interface ScoredRow {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  zone: string | null;
  department: string | null;
  category: string | null;
  price: number;
  was_price: number | null;
  offer_price: number | null;
  nectar_price: number | null;
  unit_price: number | null;
  unit_measure: string | null;
  pack_grams: number | null;
  storage: string | null;
  promos: unknown;
  seed_oil: string;
  health: number | null;
  ingredient_count: number | null;
  ingredients: string | null;
  upf_markers: string[] | null;
  review_avg: number | null;
  review_count: number | null;
  is_new: boolean;
  is_basic: boolean;
  ingredients_source: string | null;
  nutrition_source: string | null;
  vote: number | null;
  animal: string | null;
  is_available: boolean;
  nutrition: Nutrition | null;
  seed_oils_found: string[] | null;
  reasons: unknown;
  listed_at: Date | string;
  now_price: number;
  full_price: number;
  protein: number | null;
  sat: number | null;
  kcal: number | null;
  folic_acid: boolean;
  pack_protein: number | null;
  discount: number;
  basis: string | null;
  pct: number | null;
  stars: number | null;
  not_at_store: boolean;
  store_eff: string;
  store_why: string | null;
  store_stock: string | null;
  store_stock_at: Date | string | null;
  product_group: string | null;
  protein_main: string | null;
  on_list: boolean;
  paid_each: number | null;
  paid_at: Date | string | null;
  paid_offer: string | null;
  value: number | null;
  fit: number | null;
}

/** Dinner meal deal promos are kept only for deals we know; lunch deals are dropped everywhere. */
function cleanPromos(v: unknown, dealIds: Set<string>): Promo[] {
  return asPromos(v).filter((p) => {
    const mealish = p.kind === "mealdeal" || /meal deal/i.test(p.text ?? "");
    return !mealish || dealIds.has(String(p.uid));
  });
}

export async function loadDealIds(sql: Sql): Promise<Set<string>> {
  const rows = await sql<{ id: string }[]>`
    select id from deals where ends_on is null or ends_on >= current_date
  `;
  return new Set(rows.map((r) => r.id));
}

/**
 * Everything he has told us, in one query: stars, Yes / No votes, what is on his
 * list, and what he bought in past shops. buildTaste (taste.ts) turns it into a profile.
 */
export async function loadTaste(sql: Sql): Promise<TasteProfile> {
  const rows = await sql<{ product_id: string; src: TasteRow["source"]; val: number; category: string | null; department: string | null; brand: string | null }[]>`
    select t.pid as product_id, t.src, t.val::float8 as val, p.category, p.department, p.brand
    from (
      select product_id as pid, 'rating' as src, stars::float8 as val from ratings
      union all select product_id, 'vote', vote::float8 from basket_votes
      union all select product_id, 'list', 1::float8 from list_items where product_id is not null
      union all select i->>'productId', 'shop', case when jsonb_typeof(i->'qty') = 'number' then (i->>'qty')::float8 else 1 end
        from shops sh, jsonb_array_elements(sh.items) i where i->>'productId' is not null
    ) t join products p on p.id = t.pid
  `;
  return buildTaste(rows.map((r) => ({ productId: r.product_id, source: r.src, value: r.val, category: r.category, department: r.department, brand: r.brand })));
}

export function mapCard(r: ScoredRow, dealIds: Set<string>): ProductCard {
  const pack = packInfo({ name: r.name, packGrams: r.pack_grams, unitMeasure: r.unit_measure, price: r.price, unitPrice: r.unit_price });
  const per100 = r.pack_protein != null && r.pack_protein >= 5 ? Math.round((r.now_price / r.pack_protein) * 10000) / 100 : null;
  return {
    id: r.id,
    name: r.name,
    brand: r.brand,
    imageUrl: r.image_url,
    zone: r.zone,
    department: r.department,
    category: r.category,
    price: r.price,
    wasPrice: r.was_price,
    offerPrice: r.offer_price,
    nectarPrice: r.nectar_price,
    promos: cleanPromos(r.promos, dealIds),
    unitPrice: r.unit_price,
    unitMeasure: r.unit_measure,
    packGrams: r.pack_grams,
    storage: r.storage,
    seedOil: asSeedOil(r.seed_oil),
    health: r.health,
    stars: r.stars,
    fit: fitScore(r.health, r.stars),
    protein: r.protein,
    sat: r.sat,
    ingredientCount: r.ingredient_count,
    upfCount: r.ingredients != null ? (r.upf_markers?.length ?? 0) : null,
    reviewAvg: r.review_avg,
    reviewCount: r.review_count,
    isNew: r.is_new,
    animal: r.animal,
    notAtStore: r.not_at_store,
    storeStatus: asStoreStatus(r.store_eff),
    storeReason: r.store_why,
    storeStock: r.store_stock === "in" || r.store_stock === "out" ? r.store_stock : null,
    storeStockAt: r.store_stock === "in" || r.store_stock === "out" ? iso(r.store_stock_at) : null,
    productGroup: r.product_group,
    proteinMain: r.protein_main,
    onList: r.on_list,
    isAvailable: r.is_available,
    value: r.value,
    valueBasis: r.basis === "protein" || r.basis === "kg" ? r.basis : null,
    valuePct: r.pct,
    discount: Math.round(r.discount * 1000) / 1000,
    per100Protein: per100,
    paidBefore: r.paid_each != null && r.paid_at ? { each: r.paid_each, at: iso(r.paid_at) ?? "", offer: r.paid_offer } : null,
    isBasic: r.is_basic === true,
    vote: r.vote === 1 || r.vote === -1 ? r.vote : null,
    ingredientsSource: r.ingredients_source,
    nutritionSource: r.nutrition_source,
    kcal: typeof r.nutrition?.kcal === "number" ? r.nutrition.kcal : null,
    folicAcid: r.folic_acid === true,
    packText: pack?.text ?? null,
    packEst: pack?.estimated === true,
    upfMarkers: r.upf_markers ?? [],
    seedOilsFound: r.seed_oils_found ?? [],
    reasons: Array.isArray(r.reasons) ? (r.reasons as unknown[]).filter((x): x is string => typeof x === "string") : [],
  };
}

// ── Sorting ─────────────────────────────────────────────────────────────────

/** Every sort is a number to sort high-to-low. */
function sortScore(sql: Sql, sort: Sort): Fragment {
  switch (sort) {
    case "best":
      // Best overall (overall.ts): health, value and his taste, weighted. Taste is his stars, then his Yes / No, else 5.
      return sql`(coalesce(s.health, 5) * ${OVERALL_WEIGHTS.health}::float8 + coalesce(s.value, 5) * ${OVERALL_WEIGHTS.value}::float8
        + coalesce(case s.stars when 1 then 0 when 2 then 2.5 when 3 then 5 when 4 then 7.5 when 5 then 10 end,
                   case s.vote when 1 then 8.5 when -1 then 1 end, 5)::float8 * ${OVERALL_WEIGHTS.taste}::float8
        - coalesce(array_length(s.upf_markers, 1), 0) * 0.01)`;
    case "rec":
      return sql`(coalesce(s.fit, 5) + 0.5 * coalesce(s.value, 5) + 2.5 * least(s.discount, 0.6) + coalesce((s.stars - 3) * 0.8, 0) + (case when s.protein >= 15 then 0.5 else 0 end))`;
    case "value":
      return sql`(coalesce(s.value, 0) * 100 + coalesce(s.fit, 5) * 8 + s.discount * 10)`;
    case "saving":
      return sql`(s.discount * 1000 + coalesce(s.value, 0))`;
    case "score":
      return sql`((coalesce(s.value, 0) + coalesce(s.health, 0)) * 100 + s.discount)`;
    case "price":
      return sql`(-s.now_price * 100)`;
    case "few":
      return sql`(-coalesce(s.ingredient_count, 999) * 100 + coalesce(s.value, 0))`;
    case "ppp":
      return sql`coalesce(s.pack_protein / nullif(s.now_price, 0), -1)`;
  }
}

// ── Filtering ───────────────────────────────────────────────────────────────

function collectionTest(sql: Sql, key: string): Fragment {
  switch (key) {
    case "meals":
      return sql`s.department in ('Ready meals', 'Fresh soup', 'Pizza', 'Pizza, pasta & garlic bread', 'Pies, pasties & quiche', 'Instant snack and meals')`;
    case "protein":
      return sql`(s.protein >= 15 and s.zone not in ('Hot drinks, soft drinks & water', 'Beer, wine and spirits'))`;
    case "freezer":
      return sql`(s.storage = 'frozen' and coalesce(s.department, '') not in ('Ice cream', 'Desserts', 'Fruit'))`;
    case "breakfast":
      return sql`(s.department in ('Breakfast cereals', 'Eggs', 'Yogurts', 'Bacon & sausages') or s.category ilike '%porridge%' or s.category ilike '%croissant%')`;
    case "ttd":
      return sql`(s.name ilike '%taste the difference%' or coalesce(s.brand, '') ilike '%taste the difference%')`;
    case "fancy":
      return sql`(s.name ilike '%taste the difference%' or exists (select 1 from deal_items di where di.product_id = s.id))`;
    case "ordered":
      return sql`(s.paid_each is not null)`;
    default:
      return sql`false`;
  }
}

const COLLECTION_KEYS = ["meals", "protein", "freezer", "breakfast", "ttd", "fancy", "ordered"] as const;

const OWN_BRAND = (sql: Sql) =>
  sql`((s.brand ilike 'sainsbury%' or s.name ilike 'sainsbury''s %') and s.name !~* 'taste the difference')`;

/**
 * Words he typed: every word must be somewhere in the name or brand, in any of
 * its spellings (search.ts: "piri" also tries "peri", "yoghurts" also "yogurt").
 */
function searchTests(sql: Sql, q: string): Fragment[] {
  return searchVariants(q).map((variants) => {
    const tests = variants.map((v) => sql`(s.name ilike ${likePattern(v)} or coalesce(s.brand, '') ilike ${likePattern(v)})`);
    return tests.length === 1 ? tests[0] : sql`(${or(sql, tests)})`;
  });
}

function or(sql: Sql, parts: Fragment[]): Fragment {
  return parts.reduce((all, c) => sql`${all} or ${c}`);
}

/** A whole food (breakdown.ts `isWholeFood`, same as the pipeline): a plain ingredient, or a known 3 or fewer ingredients with no ultra-processing marker and seed oil 'none'. */
function wholeFoodTest(sql: Sql): Fragment {
  return sql`(s.is_basic or (s.ingredient_count <= 3 and coalesce(array_length(s.upf_markers, 1), 0) = 0 and s.seed_oil = 'none'))`;
}

/** High protein (protein.ts `isHighProtein`). */
function highProteinTest(sql: Sql): Fragment {
  return sql`(s.protein >= ${HIGH_PROTEIN_G}::float8
    or (s.kcal > 0 and s.protein >= ${HIGH_PROTEIN_FLOOR_G}::float8 and s.protein / s.kcal * 100 >= ${HIGH_PROTEIN_PER_100KCAL}::float8))`;
}

/** The foods he doesn't eat (Settings), by main protein. Mixed meat and products with no main protein pass. */
function avoidedTest(sql: Sql, avoid: readonly string[]): Fragment {
  return avoid.length === 0 ? sql`true` : sql`(s.protein_main is null or s.protein_main <> all(${[...avoid]}::text[]))`;
}

/** His "Foods you don't eat" setting. Pork until he changes it. */
export async function loadAvoid(sql: Sql): Promise<string[]> {
  const rows = await sql<{ key: string; value: unknown }[]>`select key, value from settings where key = ${AVOID_KEY}`;
  return avoidFromRows(rows);
}

function and(sql: Sql, parts: Fragment[]): Fragment {
  if (parts.length === 0) return sql`true`;
  return parts.reduce((all, c) => sql`${all} and ${c}`);
}

interface WhereOpts {
  /** Leave the category / collection choice out (for the menu counts). */
  noCategory?: boolean;
  /** Leave the animal choice out. */
  noAnimal?: boolean;
  /** Leave the group choice out (for the group tabs' counts). */
  noGroup?: boolean;
  /** Leave the protein choice out (for the protein pills' counts). */
  noProtein?: boolean;
  /** The foods he doesn't eat, for "Hide foods I don't eat". */
  avoid?: readonly string[];
}

/**
 * The "Only show" / "Hide" filters and the category choice. Inside Offers,
 * Multi-buys and Meal deals these never run: only search, category and sort do.
 */
function whereFor(sql: Sql, f: FindFilters, opts: WhereOpts = {}): Fragment {
  const parts: Fragment[] = [...searchTests(sql, f.q)];
  const dealish = f.view === "offers" || f.view === "multibuys" || f.view === "deals";
  // A typed search ignores the three filters that are on by default, so a brand he likes is always found.
  // Anything he switched on himself still applies.
  const searching = f.q.trim().length > 0;
  if (!dealish) {
    if (f.noSeedOil && !searching) parts.push(sql`s.seed_oil = 'none'`);
    if (f.good) parts.push(sql`(s.discount >= 0.25 and coalesce(s.value, 0) >= 6)`);
    if (f.frozen) parts.push(sql`(s.storage = 'frozen' or s.zone = 'Frozen')`);
    if (f.rated) parts.push(sql`s.stars is not null`);
    if (f.onList) parts.push(sql`s.on_list`);
    if (f.fewIngredients) parts.push(sql`(s.ingredient_count is not null and s.ingredient_count <= 5)`);
    // Saturated fat only counts against processed food: a whole food stays.
    if (f.hideSat && !searching) parts.push(sql`(s.sat is null or s.sat <= 5 or ${wholeFoodTest(sql)})`);
    if (f.hideAvoided && !searching) parts.push(avoidedTest(sql, opts.avoid ?? []));
    if (f.hideFolic) parts.push(sql`not s.folic_acid`);
    if (f.highProtein) parts.push(highProteinTest(sql));
    if (f.maxUpf != null) parts.push(sql`((s.ingredients is not null or s.is_basic) and coalesce(array_length(s.upf_markers, 1), 0) <= ${f.maxUpf}::int)`);
    if (f.hideOwn) parts.push(sql`not ${OWN_BRAND(sql)}`);
    if (f.hideSingle) parts.push(sql`(not s.is_basic and coalesce(s.ingredient_count, 2) <> 1)`);
    if (f.tasteDiff) parts.push(collectionTest(sql, "ttd"));
    if (f.onOffer) parts.push(sql`s.has_offer`);
    if (f.atStoreSure) parts.push(sql`s.store_eff in ('yes', 'likely')`);
    else if (f.atStore) parts.push(sql`s.store_eff <> 'no'`);
  }
  if (!opts.noCategory) {
    if (f.coll) parts.push(collectionTest(sql, f.coll));
    if (f.zone) parts.push(sql`s.zone = ${f.zone}`);
    if (f.dept) parts.push(sql`s.department = ${f.dept}`);
    if (f.cat) parts.push(sql`s.category = ${f.cat}`);
  }
  if (!opts.noGroup && f.group) parts.push(sql`s.product_group = ${f.group}`);
  if (!opts.noProtein && f.protein && f.protein !== "any") parts.push(sql`s.protein_main = ${f.protein}`);
  if (!opts.noAnimal && f.animal) parts.push(sql`s.animal = ${f.animal}`);
  return and(sql, parts);
}

function viewTest(sql: Sql, f: FindFilters): Fragment {
  switch (f.view) {
    case "offers":
      return sql`s.has_offer`;
    case "multibuys":
      return sql`s.is_multi`;
    case "deals":
      return sql`exists (
        select 1 from deal_items di join deals d on d.id = di.deal_id
        where di.product_id = s.id and (d.ends_on is null or d.ends_on >= current_date))`;
    default:
      return sql`true`;
  }
}

function sortFor(f: FindFilters): Sort {
  return f.sort;
}

// ── Find ────────────────────────────────────────────────────────────────────

export async function searchProducts(
  sql: Sql,
  f: FindFilters,
  limit: number,
): Promise<{ items: ProductCard[]; hasMore: boolean }> {
  const avoid = await loadAvoid(sql);
  const [rows, dealIds, profile] = await Promise.all([
    sql<ScoredRow[]>`
      ${scored(sql, null)}
      select s.* from s
      where ${viewTest(sql, f)} and ${whereFor(sql, f, { avoid })}
      order by ${sortScore(sql, sortFor(f))} desc nulls last, s.id
      limit ${limit + 1} offset ${f.page * limit}
    `,
    loadDealIds(sql),
    loadTaste(sql),
  ]);
  return { items: applyTaste(rows.slice(0, limit).map((r) => mapCard(r, dealIds)), profile), hasMore: rows.length > limit };
}

/** Counts for the category menu, the type tabs and the animal pills. They follow every filter that is on. */
export async function getFacets(sql: Sql, f: FindFilters): Promise<Facets> {
  const avoid = await loadAvoid(sql);
  const pool = sql`${viewTest(sql, f)} and ${whereFor(sql, f, { noCategory: true, noAnimal: true, noGroup: true, noProtein: true, avoid })}`;
  const colls = COLLECTION_KEYS.map((k) => sql`count(*) filter (where ${collectionTest(sql, k)})::int as ${sql("c_" + k)}`);
  const collCols = colls.reduce((all, c) => sql`${all}, ${c}`);
  const rows = await sql<({ zone: string | null; department: string | null; category: string | null; n: number } & Record<string, unknown>)[]>`
    ${scored(sql, null)}
    select s.zone, s.department, s.category, count(*)::int as n, ${collCols}
    from s where ${pool}
    group by s.zone, s.department, s.category
  `;

  const zones = new Map<string, number>();
  const depts = new Map<string, { zone: string; dept: string; n: number }>();
  const cats: Facets["cats"] = [];
  const colMap: Record<string, number> = {};
  const collDepts = new Map<string, Map<string, { zone: string; dept: string; n: number }>>();
  let total = 0;
  for (const r of rows) {
    const zone = r.zone ?? "Other";
    const dept = r.department ?? "Other";
    const cat = r.category ?? dept;
    total += r.n;
    zones.set(zone, (zones.get(zone) ?? 0) + r.n);
    const dk = `${zone}\u0000${dept}`;
    depts.set(dk, { zone, dept, n: (depts.get(dk)?.n ?? 0) + r.n });
    cats.push({ zone, dept, cat, n: r.n });
    for (const k of COLLECTION_KEYS) {
      const c = Number(r["c_" + k] ?? 0);
      if (c <= 0) continue;
      colMap[k] = (colMap[k] ?? 0) + c;
      const m = collDepts.get(k) ?? new Map();
      m.set(dk, { zone, dept, n: (m.get(dk)?.n ?? 0) + c });
      collDepts.set(k, m);
    }
  }

  // Animal pills follow the current category choice.
  let animals: Facets["animals"] = [];
  if (f.zone || f.dept || f.cat || f.coll) {
    const arows = await sql<{ animal: string; n: number }[]>`
      ${scored(sql, null)}
      select s.animal, count(*)::int as n from s
      where ${viewTest(sql, f)} and ${whereFor(sql, f, { noAnimal: true, avoid })} and s.animal is not null
      group by s.animal order by n desc
    `;
    animals = arows.map((a) => ({ animal: a.animal, n: a.n }));
  }

  // Group tabs and protein pills follow the chosen category (and, for proteins, the chosen group).
  let groups: Facets["groups"] = [];
  let proteins: Facets["proteins"] = [];
  if (f.zone || f.dept || f.cat || f.coll) {
    const [grows, prows] = await Promise.all([
      sql<{ product_group: string; n: number }[]>`
        ${scored(sql, null)}
        select s.product_group, count(*)::int as n from s
        where ${viewTest(sql, f)} and ${whereFor(sql, f, { noGroup: true, noProtein: true, avoid })} and s.product_group is not null
        group by s.product_group order by n desc, s.product_group
      `,
      sql<{ protein_main: string; n: number }[]>`
        ${scored(sql, null)}
        select s.protein_main, count(*)::int as n from s
        where ${viewTest(sql, f)} and ${whereFor(sql, f, { noProtein: true, avoid })} and s.protein_main is not null
        group by s.protein_main order by n desc, s.protein_main
      `,
    ]);
    groups = grows.map((g) => ({ group: g.product_group, n: g.n }));
    proteins = prows.map((p) => ({ protein: p.protein_main, n: p.n }));
  }

  return {
    total,
    zones: [...zones.entries()].map(([zone, n]) => ({ zone, n })),
    depts: [...depts.values()],
    cats,
    colls: colMap,
    collDepts: Object.fromEntries([...collDepts.entries()].map(([k, m]) => [k, [...m.values()]])),
    animals,
    groups,
    proteins,
  };
}

// ── Deal manager: everything sharing one offer ──────────────────────────────

export async function getOffer(sql: Sql, uid: string): Promise<OfferPage | null> {
  const [rows, dealIds, profile] = await Promise.all([
    sql<ScoredRow[]>`
      ${scored(sql, null)}
      select s.* from s
      where s.promos @> ${JSON.stringify([{ uid }])}::text::jsonb
      order by ${sortScore(sql, "best")} desc nulls last, s.id
      limit 200
    `,
    loadDealIds(sql),
    loadTaste(sql),
  ]);
  if (rows.length === 0) return null;
  const items = applyTaste(
    rows.map((r) => mapCard(r, dealIds)),
    profile,
  );
  const promo = items[0].promos.find((p) => p.uid === uid) ?? asPromos(rows[0].promos).find((p) => p.uid === uid);
  if (!promo) return null;
  return {
    uid,
    text: promo.text,
    kind: promo.kind,
    qty: promo.qty ?? null,
    endsOn: promo.end || null,
    items,
  };
}

// ── Meal deals ──────────────────────────────────────────────────────────────

interface DealRow {
  id: string;
  slug: string;
  title: string;
  strap: string;
  price: number;
  nectar: boolean;
  ends_on: Date | string | null;
  parts: { listId: number; label: string; qty: number }[] | null;
  products: number;
  typical: number | null;
}

function mapDeal(r: DealRow): Deal {
  const ends = iso(r.ends_on);
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    strap: r.strap,
    price: r.price,
    nectar: r.nectar,
    endsOn: ends ? ends.slice(0, 10) : null,
    parts: r.parts ?? [],
    products: r.products,
    typical: r.typical != null && r.typical > r.price ? r.typical : null,
  };
}

function dealSelect(sql: Sql): Fragment {
  return sql`
    select d.id, d.slug, d.title, d.strap, d.price::float8 as price, d.nectar, d.ends_on,
      (select jsonb_agg(jsonb_build_object('listId', dp.list_id, 'label', dp.label, 'qty', dp.qty) order by dp.list_id)
         from deal_parts dp where dp.deal_id = d.id) as parts,
      (select count(distinct di.product_id)::int from deal_items di where di.deal_id = d.id) as products,
      (select case when bool_and(pa.avg_price is not null) then sum(dp.qty * pa.avg_price)::float8 end from deal_parts dp
         join lateral (select avg(p.price) as avg_price from deal_items di join products p on p.id = di.product_id
                       where di.deal_id = dp.deal_id and di.list_id = dp.list_id and p.is_available) pa on true
         where dp.deal_id = d.id) as typical
    from deals d
  `;
}

export async function getDeals(sql: Sql): Promise<Deal[]> {
  const rows = await sql<DealRow[]>`
    ${dealSelect(sql)}
    where d.ends_on is null or d.ends_on >= current_date
    order by d.price desc, d.title
  `;
  return rows.filter((r) => r.products > 0).map(mapDeal);
}

export async function getDealPage(sql: Sql, id: string): Promise<DealPage | null> {
  const drows = await sql<DealRow[]>`${dealSelect(sql)} where d.id = ${id}`;
  if (!drows[0]) return null;
  const links = await sql<{ product_id: string; list_id: number }[]>`
    select di.product_id, di.list_id from deal_items di where di.deal_id = ${id}
  `;
  const ids = [...new Set(links.map((l) => l.product_id))];
  const [rows, dealIds, profile] = await Promise.all([
    ids.length === 0
      ? Promise.resolve([] as ScoredRow[])
      : sql<ScoredRow[]>`
          ${scored(sql, ids)}
          select s.* from s where s.id = any(${ids}::text[])
          order by ${sortScore(sql, "best")} desc nulls last, s.id
        `,
    loadDealIds(sql),
    loadTaste(sql),
  ]);
  const byId = new Map(rows.map((r) => [r.id, r]));
  const items: DealPage["items"] = [];
  for (const l of links) {
    const r = byId.get(l.product_id);
    if (r) items.push({ ...applyTaste([mapCard(r, dealIds)], profile)[0], listId: l.list_id });
  }
  // Same best-overall order as the rows came in.
  const order = new Map(rows.map((r, i) => [r.id, i]));
  items.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  return { deal: mapDeal(drows[0]), items };
}

// ── For you ─────────────────────────────────────────────────────────────────

/** Dinner meal deals where every part has something that is not ruled out for him. */
async function dealsThatFit(sql: Sql, avoid: readonly string[]): Promise<Deal[]> {
  const avoided = [...avoid];
  const rows = await sql<DealRow[]>`
    ${dealSelect(sql)}
    where (d.ends_on is null or d.ends_on >= current_date)
      and not exists (
        select 1 from deal_parts dp where dp.deal_id = d.id and not exists (
          select 1 from deal_items di join products p on p.id = di.product_id
          where di.deal_id = dp.deal_id and di.list_id = dp.list_id
            and p.is_food and p.is_available and p.seed_oil <> 'yes'
            and (p.health is null or p.health >= 5)
            and (case when jsonb_typeof(p.nutrition->'sat') = 'number' then (p.nutrition->>'sat')::float8 end is null
                 or (p.nutrition->>'sat')::float8 <= 5)
            and not exists (select 1 from not_at_store n where n.product_id = p.id)
            and (p.protein_main is null or p.protein_main <> all(${avoided}::text[]))
        ))
    order by d.price desc, d.title
  `;
  return rows.filter((r) => r.products > 0).map(mapDeal);
}

/**
 * For you. A handful of queries, run together: his taste signals, the live deal
 * ids, the dinner deals that fit, then ONE candidate query; the shelves are
 * worked out in JS (shelves.ts) so nothing runs once per shelf or per product.
 */
export async function getShelves(sql: Sql, f: FindFilters): Promise<ForYou> {
  const avoid = await loadAvoid(sql);
  const [profile, dealIds, fitting] = await Promise.all([loadTaste(sql), loadDealIds(sql), dealsThatFit(sql, avoid)]);
  const liked = likedKeys(profile);
  const likedTests: Fragment[] = [];
  if (liked.categories.length > 0) likedTests.push(sql`lower(s.category) = any(${liked.categories}::text[])`);
  if (liked.departments.length > 0) likedTests.push(sql`lower(s.department) = any(${liked.departments}::text[])`);
  if (liked.brands.length > 0) likedTests.push(sql`lower(s.brand) = any(${liked.brands}::text[])`);
  const likedAny = likedTests.length > 0 ? likedTests.reduce((all, c) => sql`${all} or ${c}`) : sql`false`;

  const rows = await sql<ScoredRow[]>`
    ${scored(sql, null)}
    select s.* from s
    where ${whereFor(sql, f, { avoid })} and not s.not_at_store and not s.on_list
      -- The foods he doesn't eat never show on For you, whatever the filter says.
      and ${avoidedTest(sql, avoid)}
      and coalesce(s.stars, 3) >= 3 and coalesce(s.vote, 0) >= 0
      and (
        ((s.stars >= 4 or s.vote = 1) and s.has_offer)
        or s.vote = 1
        or (s.health >= 7 and s.seed_oil = 'none' and coalesce(s.value, 5) >= 5)
        or s.is_new
        or s.discount >= 0.25
        or s.paid_each is not null
        or (${highProteinTest(sql)} and s.seed_oil = 'none' and (s.sat is null or s.sat <= ${PROTEIN_SHELF_MAX_SAT}::float8 or ${wholeFoodTest(sql)}))
        or ${likedAny}
      )
    order by ${sortScore(sql, "best")} desc nulls last, s.id
    limit ${SHELF_SIZE * 30}
  `;
  return buildShelves({ cards: rows.map((r) => mapCard(r, dealIds)), profile, dealsThatFit: fitting });
}

// ── Single products ─────────────────────────────────────────────────────────

export async function getProduct(sql: Sql, id: string): Promise<ProductDetail | null> {
  const [rows, dealIds, profile] = await Promise.all([
    sql<ScoredRow[]>`${scored(sql, [id])} select s.* from s where s.id = ${id}`,
    loadDealIds(sql),
    loadTaste(sql),
  ]);
  const r = rows[0];
  if (!r) return null;
  return {
    ...applyTaste([mapCard(r, dealIds)], profile)[0],
    slug: r.slug,
    nutrition: r.nutrition,
    ingredients: r.ingredients,
    listedAt: iso(r.listed_at) ?? "",
  };
}

/**
 * The "Similar products" section: every product of the same type, this one
 * pinned first. Same type means the same category, narrowed to the same animal
 * when it is known, widened to the department when the category is small
 * (similar.ts). The filters and sort are the Find ones; what they hide is
 * counted, not lost. The whole group is read (it is a few dozen products) and
 * ordered in similar.ts so the rank on Best overall never moves with the filters.
 */
export async function getSimilarSection(sql: Sql, id: string, f: FindFilters): Promise<SimilarSection | null> {
  // Light candidates: the product's comparison group, or (not classified yet) its department. Names and
  // categories only. What counts as similar is decided in similar.ts.
  const cands = await sql<(Candidate & { is_me: boolean })[]>`
    with me as (select department, product_group from products where id = ${id})
    select p.id, p.name, p.zone, p.department, p.category, p.animal, p.product_group as "productGroup", p.protein_main as "proteinMain",
      (p.id = ${id}) as is_me
    from products p, me
    where p.id = ${id}
      or (p.is_food and p.is_available and p.price > 0
          and (case when me.product_group is not null then p.product_group = me.product_group
                    else p.department is not distinct from me.department end))
  `;
  const me = cands.find((c) => c.is_me);
  if (!me) return null;
  const { scope, ids, prep, group, proteins, protein } = similarScope(me, cands, f.protein);

  // Only the toggles apply here: no search, category or animal choice.
  const toggles: FindFilters = { ...f, view: "all", q: "", coll: "", zone: "", dept: "", cat: "", animal: "", page: 0 };

  const avoid = await loadAvoid(sql);
  const [rows, dealIds, profile] = await Promise.all([
    sql<(ScoredRow & { passes: boolean; bscore: number | null; sscore: number | null })[]>`
      ${scored(sql, [id], scope === "department" ? "department" : "category")}
      select s.*, (${whereFor(sql, toggles, { avoid })}) as passes,
        ${sortScore(sql, "best")}::float8 as bscore, ${sortScore(sql, f.sort)}::float8 as sscore
      from s
      where s.id = ${id} or s.id = any(${ids}::text[])
    `,
    loadDealIds(sql),
    loadTaste(sql),
  ]);

  const pick = selectSimilar(
    rows.map((r) => ({ id: r.id, passes: r.passes, best: r.bscore, score: r.sscore })),
    id,
  );
  const cards = new Map(applyTaste(rows.map((r) => mapCard(r, dealIds)), profile).map((c) => [c.id, c]));
  const items = pick.ids.map((i) => cards.get(i)).filter((c): c is ProductCard => c !== undefined);
  return { items, total: pick.total, hidden: pick.hidden, capped: pick.capped, rank: pick.rank, ranks: pick.ranks, scopeLabel: scopeLabel(scope, me, prep, protein), group, proteins, protein };
}

export async function getZones(sql: Sql): Promise<string[]> {
  const rows = await sql<{ zone: string }[]>`
    select distinct zone from products where is_food and zone is not null order by zone
  `;
  return rows.map((r) => r.zone);
}

// ── Shopping list ───────────────────────────────────────────────────────────

interface ListRow {
  id: number;
  product_id: string | null;
  label: string | null;
  qty: number;
  ticked: boolean;
  name: string | null;
  brand: string | null;
  image_url: string | null;
  zone: string | null;
  price: number | null;
  was_price: number | null;
  offer_price: number | null;
  nectar_price: number | null;
  promos: unknown;
  seed_oil: string | null;
  pack_protein: number | null;
}

interface DealLinkRow {
  product_id: string;
  id: string;
  title: string;
  price: number;
  list_id: number;
  parts: { listId: number; label: string; qty: number }[] | null;
}

export async function getList(sql: Sql, only?: "ticked"): Promise<ListItem[]> {
  const rows = await sql<ListRow[]>`
    select li.id::int as id, li.product_id, li.label, li.qty::int as qty, li.ticked,
      p.name, p.brand, p.image_url, p.zone,
      p.price::float8 as price, p.was_price::float8 as was_price, p.offer_price::float8 as offer_price,
      p.nectar_price::float8 as nectar_price, p.promos, p.seed_oil,
      (p.pack_grams * (case when jsonb_typeof(p.nutrition->'protein') = 'number' then (p.nutrition->>'protein')::float8 end) / 100)::float8 as pack_protein
    from list_items li
    left join products p on p.id = li.product_id
    ${only === "ticked" ? sql`where li.ticked` : sql``}
    order by li.added_at, li.id
  `;
  const ids = [...new Set(rows.map((r) => r.product_id).filter((x): x is string => x !== null))];
  const [links, values, dealIds] =
    ids.length === 0
      ? [[] as DealLinkRow[], [] as { id: string; value: number | null }[], new Set<string>()]
      : await Promise.all([
          sql<DealLinkRow[]>`
            select di.product_id, d.id, d.title, d.price::float8 as price, di.list_id,
              (select jsonb_agg(jsonb_build_object('listId', dp.list_id, 'label', dp.label, 'qty', dp.qty) order by dp.list_id)
                 from deal_parts dp where dp.deal_id = d.id) as parts
            from deal_items di join deals d on d.id = di.deal_id
            where di.product_id = any(${ids}::text[]) and (d.ends_on is null or d.ends_on >= current_date)
          `,
          sql<{ id: string; value: number | null }[]>`
            ${scored(sql, ids)} select s.id, s.value from s where s.id = any(${ids}::text[])
          `,
          loadDealIds(sql),
        ]);
  const valueOf = new Map(values.map((v) => [v.id, v.value]));
  const dealsOf = new Map<string, DealLink[]>();
  for (const l of links) {
    const link: DealLink = { id: l.id, title: l.title, price: l.price, listId: l.list_id, parts: l.parts ?? [] };
    dealsOf.set(l.product_id, [...(dealsOf.get(l.product_id) ?? []), link]);
  }
  return rows.map((r) => ({
    id: r.id,
    productId: r.product_id,
    name: r.name ?? r.label ?? "Item",
    brand: r.brand,
    imageUrl: r.image_url,
    zone: r.zone,
    qty: r.qty,
    ticked: r.ticked,
    price: r.price,
    wasPrice: r.was_price,
    offerPrice: r.offer_price,
    nectarPrice: r.nectar_price,
    promos: cleanPromos(r.promos, dealIds),
    seedOil: r.seed_oil === null ? null : asSeedOil(r.seed_oil),
    packProtein: r.pack_protein,
    value: r.product_id ? (valueOf.get(r.product_id) ?? null) : null,
    deals: r.product_id ? (dealsOf.get(r.product_id) ?? []) : [],
  }));
}

export { PAGE_SIZE };
