import "server-only";
import { generateBasket, type Candidate } from "./basket";
import type { Sql } from "./db";
import { fitScore } from "./fit";
import type { ListAction, SettingsPatch } from "./validate";
import {
  DEFAULT_SETTINGS,
  FOOD_ZONES,
  type BasketItem,
  type BasketLine,
  type BasketView,
  type FindFilters,
  type Freshness,
  type ListItem,
  type Nutrition,
  type ProductCard,
  type ProductDetail,
  type Promo,
  type SeedOil,
  type Settings,
} from "./types";

/**
 * Every SQL statement for Dad's shop. Parameterised only: values go through
 * postgres.js template parameters, never string concatenation. Numeric and
 * bigint columns are cast in the SELECT so they arrive as JS numbers.
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

// ── Products ────────────────────────────────────────────────────────────────

interface CardRow {
  id: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  zone: string | null;
  category: string | null;
  price: number;
  nectar_price: number | null;
  unit_price: number | null;
  unit_measure: string | null;
  promos: unknown;
  seed_oil: string;
  health: number | null;
  protein: number | null;
  sat: number | null;
  ingredient_count: number | null;
  is_available: boolean;
  stars: number | null;
  not_at_store: boolean;
  on_list: boolean;
}

function cardCols(sql: Sql) {
  return sql`
    p.id, p.name, p.brand, p.image_url, p.zone, p.category,
    p.price::float8 as price, p.nectar_price::float8 as nectar_price,
    p.unit_price::float8 as unit_price, p.unit_measure, p.promos, p.seed_oil,
    p.health::float8 as health,
    (case when jsonb_typeof(p.nutrition->'protein') = 'number' then (p.nutrition->>'protein')::float8 end) as protein,
    (case when jsonb_typeof(p.nutrition->'sat') = 'number' then (p.nutrition->>'sat')::float8 end) as sat,
    p.ingredient_count, p.is_available,
    r.stars::int as stars,
    (n.product_id is not null) as not_at_store,
    exists (select 1 from list_items li where li.product_id = p.id) as on_list
  `;
}

function cardFrom(sql: Sql) {
  return sql`
    from products p
    left join ratings r on r.product_id = p.id
    left join not_at_store n on n.product_id = p.id
  `;
}

function mapCard(r: CardRow): ProductCard {
  return {
    id: r.id,
    name: r.name,
    brand: r.brand,
    imageUrl: r.image_url,
    zone: r.zone,
    category: r.category,
    price: r.price,
    nectarPrice: r.nectar_price,
    promos: asPromos(r.promos),
    unitPrice: r.unit_price,
    unitMeasure: r.unit_measure,
    seedOil: asSeedOil(r.seed_oil),
    health: r.health,
    stars: r.stars,
    fit: fitScore(r.health, r.stars),
    protein: r.protein,
    sat: r.sat,
    ingredientCount: r.ingredient_count,
    notAtStore: r.not_at_store,
    onList: r.on_list,
    isAvailable: r.is_available,
  };
}

/** Escapes LIKE wildcards so what he types is matched literally. */
function likePattern(word: string): string {
  return `%${word.replace(/[\\%_]/g, "\\$&")}%`;
}

export async function searchProducts(
  sql: Sql,
  f: FindFilters,
  limit: number,
): Promise<{ items: ProductCard[]; hasMore: boolean }> {
  const protein = sql`(case when jsonb_typeof(p.nutrition->'protein') = 'number' then (p.nutrition->>'protein')::float8 end)`;
  const sat = sql`(case when jsonb_typeof(p.nutrition->'sat') = 'number' then (p.nutrition->>'sat')::float8 end)`;
  const words = f.q.split(" ").filter(Boolean).slice(0, 6);

  const conditions = [
    sql`p.is_food and p.is_available`,
    ...words.map((w) => sql`(p.name ilike ${likePattern(w)} or coalesce(p.brand, '') ilike ${likePattern(w)})`),
    f.noSeedOil ? sql`p.seed_oil = 'none'` : null,
    f.highProtein ? sql`${protein} >= 12` : null,
    f.lowSat ? sql`${sat} <= 1.5` : null,
    f.fewIngredients ? sql`p.ingredient_count is not null and p.ingredient_count <= 5` : null,
    f.onOffer ? sql`(p.promos <> '[]'::jsonb or (p.nectar_price is not null and p.nectar_price < p.price))` : null,
    f.zone ? sql`p.zone = ${f.zone}` : null,
  ].filter((c): c is NonNullable<typeof c> => c !== null);
  const where = conditions.reduce((all, c) => sql`${all} and ${c}`);

  const fit = sql`(case when r.stars is null then p.health else 0.6 * p.health + 0.4 * (case r.stars when 1 then 0 when 2 then 2.5 when 3 then 5 when 4 then 7.5 else 10 end) end)`;
  const order =
    f.sort === "price"
      ? sql`coalesce(p.nectar_price, p.price) asc, p.id`
      : f.sort === "protein"
        ? sql`((p.pack_grams * ${protein} / 100) / nullif(coalesce(p.nectar_price, p.price), 0)) desc nulls last, p.id`
        : sql`${fit} desc nulls last, p.id`;

  const rows = await sql<CardRow[]>`
    select ${cardCols(sql)}
    ${cardFrom(sql)}
    where ${where}
    order by ${order}
    limit ${limit + 1} offset ${f.page * limit}
  `;
  return { items: rows.slice(0, limit).map(mapCard), hasMore: rows.length > limit };
}

interface DetailRow extends CardRow {
  slug: string;
  department: string | null;
  storage: string | null;
  pack_grams: number | null;
  nutrition: Nutrition | null;
  ingredients: string | null;
  seed_oils_found: string[] | null;
  upf_markers: string[] | null;
  reasons: unknown;
  listed_at: Date | string;
}

export async function getProduct(sql: Sql, id: string): Promise<ProductDetail | null> {
  const rows = await sql<DetailRow[]>`
    select ${cardCols(sql)},
      p.slug, p.department, p.storage, p.pack_grams::float8 as pack_grams,
      p.nutrition, p.ingredients, p.seed_oils_found, p.upf_markers, p.reasons, p.listed_at
    ${cardFrom(sql)}
    where p.id = ${id}
  `;
  const r = rows[0];
  if (!r) return null;
  return {
    ...mapCard(r),
    slug: r.slug,
    department: r.department,
    storage: r.storage,
    packGrams: r.pack_grams,
    nutrition: r.nutrition,
    ingredients: r.ingredients,
    seedOilsFound: r.seed_oils_found ?? [],
    upfMarkers: r.upf_markers ?? [],
    reasons: Array.isArray(r.reasons) ? (r.reasons as unknown[]).filter((x): x is string => typeof x === "string") : [],
    listedAt: iso(r.listed_at) ?? "",
  };
}

export async function getZones(sql: Sql): Promise<string[]> {
  const rows = await sql<{ zone: string }[]>`
    select distinct zone from products where is_food and zone is not null order by zone
  `;
  return rows.length > 0 ? rows.map((r) => r.zone) : [...FOOD_ZONES];
}

export async function getFreshness(sql: Sql): Promise<Freshness> {
  const rows = await sql<{ last_listed: Date | null; products: number; with_details: number }[]>`
    select max(listed_at) as last_listed,
      count(*)::int as products,
      (count(*) filter (where nutrition is not null and ingredients is not null))::int as with_details
    from products where is_food
  `;
  const r = rows[0];
  return { lastListed: iso(r?.last_listed ?? null), products: r?.products ?? 0, withDetails: r?.with_details ?? 0 };
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
  nectar_price: number | null;
  promos: unknown;
  seed_oil: string | null;
}

export async function getList(sql: Sql): Promise<ListItem[]> {
  const rows = await sql<ListRow[]>`
    select li.id::int as id, li.product_id, li.label, li.qty::int as qty, li.ticked,
      p.name, p.brand, p.image_url, p.zone,
      p.price::float8 as price, p.nectar_price::float8 as nectar_price, p.promos, p.seed_oil
    from list_items li
    left join products p on p.id = li.product_id
    order by li.added_at, li.id
  `;
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
    nectarPrice: r.nectar_price,
    promos: asPromos(r.promos),
    seedOil: r.seed_oil === null ? null : asSeedOil(r.seed_oil),
  }));
}

/**
 * Applies one list change. Safe to repeat: adding something already on the
 * list returns the row that is there, ticking twice is the same as once, and
 * changing or removing a row that is gone does nothing. That lets the phone
 * retry a request whose answer it never saw.
 */
export async function applyListAction(sql: Sql, a: ListAction): Promise<{ id: number | null; found: boolean }> {
  switch (a.action) {
    case "add": {
      if ("productId" in a) {
        const inserted = await sql<{ id: number }[]>`
          insert into list_items (product_id, label, qty, source)
          select p.id, left(p.name, 120), ${a.qty}::smallint, 'manual'
          from products p
          where p.id = ${a.productId}
            and not exists (select 1 from list_items li where li.product_id = p.id and not li.ticked)
          returning id::int as id
        `;
        if (inserted[0]) return { id: inserted[0].id, found: true };
        const existing = await sql<{ id: number }[]>`
          select id::int as id from list_items
          where product_id = ${a.productId} and not ticked
          order by id limit 1
        `;
        return existing[0] ? { id: existing[0].id, found: true } : { id: null, found: false };
      }
      const inserted = await sql<{ id: number }[]>`
        insert into list_items (label, qty, source)
        select ${a.label}::text, ${a.qty}::smallint, 'manual'
        where not exists (
          select 1 from list_items li
          where li.product_id is null and not li.ticked and lower(li.label) = lower(${a.label}::text)
        )
        returning id::int as id
      `;
      if (inserted[0]) return { id: inserted[0].id, found: true };
      const existing = await sql<{ id: number }[]>`
        select id::int as id from list_items
        where product_id is null and not ticked and lower(label) = lower(${a.label}::text)
        order by id limit 1
      `;
      return { id: existing[0]?.id ?? null, found: existing.length > 0 };
    }
    case "tick": {
      await sql`
        update list_items
        set ticked = ${a.ticked}::boolean,
            ticked_at = case when ${a.ticked}::boolean then now() else null end
        where id = ${a.id}
      `;
      return { id: a.id, found: true };
    }
    case "qty": {
      await sql`update list_items set qty = ${a.qty}::smallint where id = ${a.id}`;
      return { id: a.id, found: true };
    }
    case "remove": {
      await sql`delete from list_items where id = ${a.id}`;
      return { id: a.id, found: true };
    }
    case "clear_ticked": {
      await sql`delete from list_items where ticked`;
      return { id: null, found: true };
    }
  }
}

// ── Ratings and "not at my store" ───────────────────────────────────────────

/** Sets (1-5) or clears (null) a rating. False when the product does not exist. */
export async function setRating(sql: Sql, productId: string, stars: number | null): Promise<boolean> {
  if (stars === null) {
    await sql`delete from ratings where product_id = ${productId}`;
    return true;
  }
  const rows = await sql<{ stars: number }[]>`
    insert into ratings (product_id, stars)
    select p.id, ${stars}::smallint from products p where p.id = ${productId}
    on conflict (product_id) do update set stars = excluded.stars, updated_at = now()
    returning stars::int as stars
  `;
  return rows.length > 0;
}

export async function setNotAtStore(sql: Sql, productId: string, value: boolean): Promise<boolean> {
  if (!value) {
    await sql`delete from not_at_store where product_id = ${productId}`;
    return true;
  }
  const rows = await sql<{ product_id: string }[]>`
    insert into not_at_store (product_id)
    select p.id from products p where p.id = ${productId}
    on conflict (product_id) do update set marked_at = now()
    returning product_id
  `;
  return rows.length > 0;
}

// ── Settings ────────────────────────────────────────────────────────────────

export async function getSettings(sql: Sql): Promise<Settings> {
  const rows = await sql<{ key: string; value: unknown }[]>`select key, value from settings`;
  const out: Settings = { ...DEFAULT_SETTINGS };
  for (const r of rows) {
    if (typeof r.value !== "number" || !Number.isFinite(r.value)) continue;
    if (r.key === "budget_gbp") out.budget_gbp = r.value;
    else if (r.key === "people") out.people = r.value;
    else if (r.key === "protein_g_per_day") out.protein_g_per_day = r.value;
    else if (r.key === "max_per_category") out.max_per_category = r.value;
    else if (r.key === "include_unrated_share") out.include_unrated_share = r.value;
  }
  return out;
}

export async function saveSettings(sql: Sql, patch: SettingsPatch): Promise<void> {
  const entries = Object.entries(patch).filter((e): e is [string, number] => typeof e[1] === "number");
  if (entries.length === 0) return;
  const keys = entries.map(([k]) => k);
  const values = entries.map(([, v]) => JSON.stringify(v));
  await sql`
    insert into settings (key, value)
    select t.k, t.v::jsonb from unnest(${keys}::text[], ${values}::text[]) as t(k, v)
    on conflict (key) do update set value = excluded.value
  `;
}

// ── Baskets ─────────────────────────────────────────────────────────────────

interface BasketRow {
  id: number;
  created_at: Date | string;
  settings: Settings;
  items: BasketItem[];
  total: number;
  protein_g: number;
  warnings: unknown;
}

async function lastBasketRow(sql: Sql, id: number | null): Promise<BasketRow | null> {
  const rows =
    id === null
      ? await sql<BasketRow[]>`
          select id::int as id, created_at, settings, items, total::float8 as total,
            protein_g::float8 as protein_g, warnings
          from baskets order by id desc limit 1`
      : await sql<BasketRow[]>`
          select id::int as id, created_at, settings, items, total::float8 as total,
            protein_g::float8 as protein_g, warnings
          from baskets where id = ${id}`;
  return rows[0] ?? null;
}

function stringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

/** Adds names and pictures to a basket's items for display. */
async function hydrate(sql: Sql, items: BasketItem[]): Promise<BasketLine[]> {
  const ids = items.map((i) => i.productId);
  const rows =
    ids.length === 0
      ? []
      : await sql<{ id: string; name: string; brand: string | null; image_url: string | null; zone: string | null }[]>`
          select id, name, brand, image_url, zone from products where id = any(${ids}::text[])
        `;
  const byId = new Map(rows.map((r) => [r.id, r]));
  return items.map((i) => {
    const p = byId.get(i.productId);
    return {
      ...i,
      name: p?.name ?? "A product that is no longer listed",
      brand: p?.brand ?? null,
      imageUrl: p?.image_url ?? null,
      zone: p?.zone ?? null,
    };
  });
}

async function toView(sql: Sql, row: BasketRow, fromHistory: boolean): Promise<BasketView> {
  const items = Array.isArray(row.items) ? row.items : [];
  return {
    id: row.id,
    createdAt: iso(row.created_at),
    settings: { ...DEFAULT_SETTINGS, ...row.settings },
    items: await hydrate(sql, items),
    total: row.total,
    proteinG: row.protein_g,
    warnings: stringArray(row.warnings),
    fromHistory,
  };
}

export async function getLastBasket(sql: Sql): Promise<BasketView | null> {
  const row = await lastBasketRow(sql, null);
  return row ? toView(sql, row, false) : null;
}

interface CandidateRow {
  id: string;
  name: string;
  zone: string | null;
  category: string | null;
  price: number;
  nectar_price: number | null;
  pack_grams: number | null;
  promos: unknown;
  is_available: boolean;
  is_food: boolean;
  storage: string | null;
  protein: number | null;
  seed_oil: string;
  health: number | null;
  listed_at: Date | string;
  has_detail: boolean;
}

async function loadCandidates(sql: Sql): Promise<Candidate[]> {
  const rows = await sql<CandidateRow[]>`
    select p.id, p.name, p.zone, p.category,
      p.price::float8 as price, p.nectar_price::float8 as nectar_price,
      p.pack_grams::float8 as pack_grams, p.promos, p.is_available, p.is_food, p.storage,
      (case when jsonb_typeof(p.nutrition->'protein') = 'number' then (p.nutrition->>'protein')::float8 end) as protein,
      p.seed_oil, p.health::float8 as health, p.listed_at,
      (p.nutrition is not null and p.ingredients is not null) as has_detail
    from products p
    where p.is_food and p.is_available and p.price > 0 and p.seed_oil <> 'yes'
      and (p.health >= 5 or exists (select 1 from ratings r where r.product_id = p.id and r.stars >= 4))
    order by p.id
    limit 8000
  `;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    zone: r.zone,
    category: r.category,
    price: r.price,
    nectarPrice: r.nectar_price,
    packGrams: r.pack_grams,
    promos: asPromos(r.promos),
    isAvailable: r.is_available,
    isFood: r.is_food,
    storage: r.storage,
    protein: r.protein,
    seedOil: asSeedOil(r.seed_oil),
    health: r.health,
    listedAt: iso(r.listed_at) ?? "",
    hasDetail: r.has_detail,
  }));
}

/**
 * Makes this week's basket and saves it. Never throws: if anything goes wrong,
 * or there is nothing to choose from, it returns the last saved basket with a
 * warning, or an empty basket with a plain-English message.
 */
export async function buildWeeklyBasket(sql: Sql, now: Date = new Date()): Promise<BasketView> {
  let last: BasketRow | null = null;
  try {
    last = await lastBasketRow(sql, null);
  } catch {
    last = null;
  }

  const fallback = async (why: string[]): Promise<BasketView> => {
    if (last) {
      try {
        const view = await toView(sql, last, true);
        return { ...view, warnings: [...why, "Showing your last basket instead.", ...view.warnings] };
      } catch {
        // fall through to the empty basket
      }
    }
    return {
      id: null,
      createdAt: null,
      settings: { ...DEFAULT_SETTINGS },
      items: [],
      total: 0,
      proteinG: 0,
      warnings: why.length > 0 ? why : ["Couldn't make a basket just now. Try again in a minute."],
      fromHistory: false,
    };
  };

  try {
    const settings = await getSettings(sql);
    const [candidates, ratingRows, notAtRows] = await Promise.all([
      loadCandidates(sql),
      sql<{ product_id: string; stars: number }[]>`select product_id, stars::int as stars from ratings`,
      sql<{ product_id: string }[]>`select product_id from not_at_store`,
    ]);
    const ratings: Record<string, number> = {};
    for (const r of ratingRows) ratings[r.product_id] = r.stars;

    const result = generateBasket({
      candidates,
      ratings,
      notAtStore: notAtRows.map((r) => r.product_id),
      settings,
      previous: last && Array.isArray(last.items) ? { items: last.items } : null,
      now,
    });
    if (result.items.length === 0) return await fallback(result.warnings);

    const saved = await sql<{ id: number; created_at: Date | string }[]>`
      insert into baskets (settings, items, total, protein_g, warnings)
      values (
        ${JSON.stringify(result.settings)}::text::jsonb,
        ${JSON.stringify(result.items)}::text::jsonb,
        ${result.total},
        ${result.proteinG},
        ${JSON.stringify(result.warnings)}::text::jsonb
      )
      returning id::int as id, created_at
    `;
    return {
      id: saved[0]?.id ?? null,
      createdAt: iso(saved[0]?.created_at ?? null),
      settings: result.settings,
      items: await hydrate(sql, result.items),
      total: result.total,
      proteinG: result.proteinG,
      warnings: result.warnings,
      fromHistory: false,
    };
  } catch (err) {
    console.error("[dad-shop] basket generation failed:", err instanceof Error ? err.message : err);
    return await fallback(["Couldn't make a new basket just now."]);
  }
}

/** Adds a basket's items to the list, skipping products already on it. */
export async function addBasketToList(
  sql: Sql,
  basketId: number | null,
): Promise<{ added: number; skipped: number } | null> {
  const row = await lastBasketRow(sql, basketId);
  if (!row || !Array.isArray(row.items)) return null;
  const items = row.items;
  if (items.length === 0) return { added: 0, skipped: 0 };
  const ids = items.map((i) => i.productId);
  const qtys = items.map((i) => Math.min(50, Math.max(1, Math.round(i.qty) || 1)));
  const inserted = await sql<{ id: number }[]>`
    insert into list_items (product_id, label, qty, source)
    select p.id, left(p.name, 120), t.qty::smallint, 'basket'
    from unnest(${ids}::text[], ${qtys}::int[]) as t(id, qty)
    join products p on p.id = t.id
    where not exists (select 1 from list_items li where li.product_id = p.id)
    returning id::int as id
  `;
  return { added: inserted.length, skipped: items.length - inserted.length };
}
