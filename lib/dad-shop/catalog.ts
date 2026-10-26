import "server-only";
import type postgres from "postgres";
import type { Sql } from "./db";
import { fitScore } from "./fit";
import {
  PAGE_SIZE,
  type Deal,
  type DealLink,
  type DealPage,
  type Facets,
  type FindFilters,
  type ListItem,
  type OfferGroup,
  type OfferPage,
  type ProductCard,
  type ProductDetail,
  type Promo,
  type SeedOil,
  type Shelf,
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
function scored(sql: Sql, ids: string[] | null): Fragment {
  const scope = ids ? sql`and coalesce(p.category, '') in (select coalesce(category, '') from products where id = any(${ids}::text[]))` : sql``;
  return sql`
    with b as (
      select p.id, p.slug, p.name, p.brand, p.image_url, p.zone, p.department, p.category,
        p.price::float8 as price, p.was_price::float8 as was_price, p.offer_price::float8 as offer_price,
        p.nectar_price::float8 as nectar_price, p.unit_price::float8 as unit_price, p.unit_measure,
        p.pack_grams::float8 as pack_grams, p.storage, p.promos, p.seed_oil, p.health::float8 as health,
        p.ingredient_count, p.ingredients, p.upf_markers, p.review_avg::float8 as review_avg, p.review_count,
        p.is_new, p.animal, p.is_available, p.nutrition, p.seed_oils_found, p.reasons, p.listed_at,
        pr.now_price, pr.full_price,
        (case when jsonb_typeof(p.nutrition->'protein') = 'number' then (p.nutrition->>'protein')::float8 end) as protein,
        (case when jsonb_typeof(p.nutrition->'sat') = 'number' then (p.nutrition->>'sat')::float8 end) as sat,
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
    m as (
      select b.*,
        greatest(0, 1 - least(b.now_price, coalesce(b.deal_unit, b.now_price)) / nullif(b.full_price, 0)) as discount,
        coalesce(b.category, b.department, b.zone, '') as ckey,
        case
          when b.pack_protein >= 5 and b.protein >= 10 then b.now_price / b.pack_protein * 100
          when b.unit_price is not null and b.unit_price > 0 and b.unit_measure in ('kg', 'ltr') then b.unit_price * b.now_price / b.price
        end as metric,
        case
          when b.pack_protein >= 5 and b.protein >= 10 then 'protein'
          when b.unit_price is not null and b.unit_price > 0 and b.unit_measure in ('kg', 'ltr') then 'kg'
        end as basis
      from b
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
        (nas.product_id is not null) as not_at_store,
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
      left join not_at_store nas on nas.product_id = m.id
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
  pack_protein: number | null;
  discount: number;
  basis: string | null;
  pct: number | null;
  stars: number | null;
  not_at_store: boolean;
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

async function loadDealIds(sql: Sql): Promise<Set<string>> {
  const rows = await sql<{ id: string }[]>`
    select id from deals where ends_on is null or ends_on >= current_date
  `;
  return new Set(rows.map((r) => r.id));
}

export function mapCard(r: ScoredRow, dealIds: Set<string>): ProductCard {
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
    onList: r.on_list,
    isAvailable: r.is_available,
    value: r.value,
    valueBasis: r.basis === "protein" || r.basis === "kg" ? r.basis : null,
    valuePct: r.pct,
    discount: Math.round(r.discount * 1000) / 1000,
    per100Protein: per100,
    paidBefore: r.paid_each != null && r.paid_at ? { each: r.paid_each, at: iso(r.paid_at) ?? "", offer: r.paid_offer } : null,
  };
}

// ── Sorting ─────────────────────────────────────────────────────────────────

/** Every sort is a number to sort high-to-low. */
function sortScore(sql: Sql, sort: Sort | "round"): Fragment {
  switch (sort) {
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
    case "round":
      return sql`((coalesce(s.fit, 5) + coalesce(s.value, 5) * 0.5) * 100 - coalesce(array_length(s.upf_markers, 1), 0))`;
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
    case "fancy":
      return sql`(s.name ilike '%taste the difference%' or exists (select 1 from deal_items di where di.product_id = s.id))`;
    case "ordered":
      return sql`(s.paid_each is not null)`;
    default:
      return sql`false`;
  }
}

const COLLECTION_KEYS = ["meals", "protein", "freezer", "breakfast", "fancy", "ordered"] as const;

const OWN_BRAND = (sql: Sql) =>
  sql`((s.brand ilike 'sainsbury%' or s.name ilike 'sainsbury''s %') and s.name !~* 'taste the difference')`;

/** Words he typed: every word must be somewhere in the name or brand. */
function searchTests(sql: Sql, q: string): Fragment[] {
  return q
    .split(" ")
    .filter(Boolean)
    .slice(0, 6)
    .map((w) => sql`(s.name ilike ${likePattern(w)} or coalesce(s.brand, '') ilike ${likePattern(w)})`);
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
}

/**
 * The "Only show" / "Hide" filters and the category choice. Inside Offers,
 * Multi-buys and Meal deals these never run: only search, category and sort do.
 */
function whereFor(sql: Sql, f: FindFilters, opts: WhereOpts = {}): Fragment {
  const parts: Fragment[] = [...searchTests(sql, f.q)];
  const dealish = f.view === "offers" || f.view === "multibuys" || f.view === "deals";
  if (!dealish) {
    if (f.noSeedOil) parts.push(sql`s.seed_oil = 'none'`);
    if (f.good) parts.push(sql`(s.discount >= 0.25 and coalesce(s.value, 0) >= 6)`);
    if (f.frozen) parts.push(sql`(s.storage = 'frozen' or s.zone = 'Frozen')`);
    if (f.rated) parts.push(sql`s.stars is not null`);
    if (f.onList) parts.push(sql`s.on_list`);
    if (f.fewIngredients) parts.push(sql`(s.ingredient_count is not null and s.ingredient_count <= 5)`);
    if (f.hideSat) parts.push(sql`(s.sat is null or s.sat <= 5)`);
    if (f.hideOwn) parts.push(sql`not ${OWN_BRAND(sql)}`);
    if (f.hideSingle) parts.push(sql`(s.ingredient_count is null or s.ingredient_count > 1)`);
  }
  if (!opts.noCategory) {
    if (f.coll) parts.push(collectionTest(sql, f.coll));
    if (f.zone) parts.push(sql`s.zone = ${f.zone}`);
    if (f.dept) parts.push(sql`s.department = ${f.dept}`);
    if (f.cat) parts.push(sql`s.category = ${f.cat}`);
  }
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
  const [rows, dealIds] = await Promise.all([
    sql<ScoredRow[]>`
      ${scored(sql, null)}
      select s.* from s
      where ${viewTest(sql, f)} and ${whereFor(sql, f)}
      order by ${sortScore(sql, sortFor(f))} desc nulls last, s.id
      limit ${limit + 1} offset ${f.page * limit}
    `,
    loadDealIds(sql),
  ]);
  return { items: rows.slice(0, limit).map((r) => mapCard(r, dealIds)), hasMore: rows.length > limit };
}

/** Counts for the category menu, the type tabs and the animal pills. They follow every filter that is on. */
export async function getFacets(sql: Sql, f: FindFilters): Promise<Facets> {
  const pool = sql`${viewTest(sql, f)} and ${whereFor(sql, f, { noCategory: true, noAnimal: true })}`;
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
      where ${viewTest(sql, f)} and ${whereFor(sql, f, { noAnimal: true })} and s.animal is not null
      group by s.animal order by n desc
    `;
    animals = arows.map((a) => ({ animal: a.animal, n: a.n }));
  }

  return {
    total,
    zones: [...zones.entries()].map(([zone, n]) => ({ zone, n })),
    depts: [...depts.values()],
    cats,
    colls: colMap,
    collDepts: Object.fromEntries([...collDepts.entries()].map(([k, m]) => [k, [...m.values()]])),
    animals,
  };
}

// ── Multi-buys, grouped by offer ────────────────────────────────────────────

export const OFFER_GROUPS_PER_PAGE = 8;
const PER_GROUP = 4;

export async function getOfferGroups(
  sql: Sql,
  f: FindFilters,
): Promise<{ groups: OfferGroup[]; hasMore: boolean }> {
  const cap = OFFER_GROUPS_PER_PAGE * (f.page + 1);
  const [rows, dealIds] = await Promise.all([
    sql<(ScoredRow & { g_uid: string; g_text: string; g_end: string | null; g_count: number; g_rank: number; rn: number })[]>`
      ${scored(sql, null)},
      x as (
        select s.id, e->>'uid' as g_uid, e->>'text' as g_text, e->>'end' as g_end,
          row_number() over (partition by e->>'uid' order by ${sortScore(sql, sortFor(f))} desc nulls last, s.id) as rn,
          count(*) over (partition by e->>'uid') as g_count,
          max(${sortScore(sql, sortFor(f))}) over (partition by e->>'uid') as g_top
        from s, jsonb_array_elements(s.promos) e
        where e->>'kind' = 'multibuy' and ${whereFor(sql, f)}
      ),
      y as (
        select x.*, dense_rank() over (order by x.g_top desc nulls last, x.g_uid) as g_rank from x
      )
      select s.*, y.g_uid, y.g_text, y.g_end, y.g_count::int as g_count, y.g_rank::int as g_rank, y.rn::int as rn
      from y join s on s.id = y.id
      where y.rn <= ${PER_GROUP} and y.g_rank <= ${cap + 1}
      order by y.g_rank, y.rn
    `,
    loadDealIds(sql),
  ]);
  const groups = new Map<string, OfferGroup & { rank: number }>();
  for (const r of rows) {
    let g = groups.get(r.g_uid);
    if (!g) {
      g = { uid: r.g_uid, text: r.g_text, count: r.g_count, endsOn: r.g_end, items: [], rank: r.g_rank };
      groups.set(r.g_uid, g);
    }
    g.items.push(mapCard(r, dealIds));
  }
  const all = [...groups.values()].sort((a, b) => a.rank - b.rank);
  const page: OfferGroup[] = all.slice(0, cap).map((g) => ({ uid: g.uid, text: g.text, count: g.count, endsOn: g.endsOn, items: g.items }));
  return { groups: page, hasMore: all.length > cap };
}

// ── Deal manager: everything sharing one offer ──────────────────────────────

export async function getOffer(sql: Sql, uid: string): Promise<OfferPage | null> {
  const [rows, dealIds] = await Promise.all([
    sql<ScoredRow[]>`
      ${scored(sql, null)}
      select s.* from s
      where s.promos @> ${JSON.stringify([{ uid }])}::text::jsonb
      order by ${sortScore(sql, "round")} desc nulls last, s.id
      limit 200
    `,
    loadDealIds(sql),
  ]);
  if (rows.length === 0) return null;
  const items = rows.map((r) => mapCard(r, dealIds));
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
  const [rows, dealIds] = await Promise.all([
    ids.length === 0
      ? Promise.resolve([] as ScoredRow[])
      : sql<ScoredRow[]>`
          ${scored(sql, ids)}
          select s.* from s where s.id = any(${ids}::text[])
          order by ${sortScore(sql, "round")} desc nulls last, s.id
        `,
    loadDealIds(sql),
  ]);
  const byId = new Map(rows.map((r) => [r.id, r]));
  const items: DealPage["items"] = [];
  for (const l of links) {
    const r = byId.get(l.product_id);
    if (r) items.push({ ...mapCard(r, dealIds), listId: l.list_id });
  }
  // Same all-round order as the rows came in.
  const order = new Map(rows.map((r, i) => [r.id, i]));
  items.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  return { deal: mapDeal(drows[0]), items };
}

// ── For you: sideways shelves ───────────────────────────────────────────────

const SHELF_SIZE = 16;

export async function getShelves(sql: Sql, f: FindFilters): Promise<Shelf[]> {
  const base = sql`${whereFor(sql, f)} and not s.not_at_store and not s.on_list and coalesce(s.stars, 3) >= 3`;
  const order = sql`order by ${sortScore(sql, "rec")} desc nulls last, s.id limit ${SHELF_SIZE + 12}`;
  const [fav, top, fresh, deals, dealIds] = await Promise.all([
    sql<ScoredRow[]>`${scored(sql, null)} select s.* from s where ${base} and s.stars >= 4 and s.has_offer ${order}`,
    sql<ScoredRow[]>`${scored(sql, null)} select s.* from s where ${base} and s.health >= 7 and s.seed_oil = 'none' and coalesce(s.value, 5) >= 5 ${order}`,
    sql<ScoredRow[]>`${scored(sql, null)} select s.* from s where ${base} and s.is_new ${order}`,
    sql<ScoredRow[]>`${scored(sql, null)} select s.* from s where ${base} and s.discount >= 0.3
      and s.department in (select p2.department from ratings r2 join products p2 on p2.id = r2.product_id where r2.stars >= 4 and p2.department is not null) ${order}`,
    loadDealIds(sql),
  ]);

  const seen = new Set<string>();
  const take = (rows: ScoredRow[], why: (c: ProductCard) => string): (ProductCard & { why: string })[] => {
    const out: (ProductCard & { why: string })[] = [];
    for (const r of rows) {
      if (seen.has(r.id) || out.length >= SHELF_SIZE) continue;
      seen.add(r.id);
      const c = mapCard(r, dealIds);
      out.push({ ...c, why: why(c) });
    }
    return out;
  };
  const pct = (c: ProductCard) => `${Math.round(c.discount * 100)}% off`;
  const shelves: Shelf[] = [
    {
      key: "fav",
      title: "Your favourites on offer",
      sub: "Things you rated 4 or 5 stars, on offer now",
      items: take(fav, (c) => `you gave it ${c.stars} stars${c.discount >= 0.05 ? ` · ${pct(c)}` : ""}`),
    },
    {
      key: "top",
      title: "Top picks for your rules",
      sub: "Healthy, no seed oils and good value",
      items: take(top, (c) => `${c.health != null ? `health ${Math.round(c.health)}/10 · ` : ""}no seed oils${c.discount >= 0.1 ? ` · ${pct(c)}` : ""}`),
    },
    {
      key: "new",
      title: "New in",
      sub: "Just arrived at Sainsbury's",
      items: take(fresh, () => "new in"),
    },
    {
      key: "deals",
      title: "Big deals on things you like",
      sub: "30% or more off, in types of food you rate well",
      items: take(deals, (c) => `${pct(c)} · you like ${(c.department ?? "this kind of food").toLowerCase()}`),
    },
  ];
  return shelves.filter((s) => s.items.length > 0);
}

// ── Single products ─────────────────────────────────────────────────────────

export async function getProduct(sql: Sql, id: string): Promise<ProductDetail | null> {
  const [rows, dealIds] = await Promise.all([
    sql<ScoredRow[]>`${scored(sql, [id])} select s.* from s where s.id = ${id}`,
    loadDealIds(sql),
  ]);
  const r = rows[0];
  if (!r) return null;
  return {
    ...mapCard(r, dealIds),
    slug: r.slug,
    nutrition: r.nutrition,
    ingredients: r.ingredients,
    seedOilsFound: r.seed_oils_found ?? [],
    upfMarkers: r.upf_markers ?? [],
    reasons: Array.isArray(r.reasons) ? (r.reasons as unknown[]).filter((x): x is string => typeof x === "string") : [],
    listedAt: iso(r.listed_at) ?? "",
  };
}

/** Other products in the same category (or department), best value first. */
export async function getSimilar(sql: Sql, id: string, limit: number): Promise<{ items: ProductCard[]; total: number }> {
  const [rows, dealIds] = await Promise.all([
    sql<(ScoredRow & { total: number })[]>`
      ${scored(sql, [id])},
      me as (select coalesce(category, department) as k from products where id = ${id})
      select s.*, count(*) over ()::int as total from s, me
      where s.id <> ${id} and coalesce(s.category, s.department) = me.k
      order by ${sortScore(sql, "round")} desc nulls last, s.id
      limit ${limit}
    `,
    loadDealIds(sql),
  ]);
  return { items: rows.map((r) => mapCard(r, dealIds)), total: rows[0]?.total ?? 0 };
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
