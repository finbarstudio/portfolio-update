import "server-only";
import { generateBasket, type BasketDeal, type Candidate, type VoteInfo } from "./basket";
import { getList, loadTaste } from "./catalog";
import type { Sql } from "./db";
import { offerLabel, priceList, type PricedRow, livePromos, nowPence, fullPence } from "./pricing";
import type { ListAction, SettingsPatch } from "./validate";
import { STOCK_FRESH_HOURS } from "./store";
import { describeVotes } from "./votes";
import {
  DEFAULT_SETTINGS,
  type BasketItem,
  type BasketLine,
  type BasketView,
  type MealCoverage,
  type Freshness,
  type Promo,
  type SeedOil,
  type Settings,
  type StoreStatus,
  STORE_STATUSES,
} from "./types";

export { getList, getProduct, getZones, searchProducts } from "./catalog";

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
      // Ticking something off is proof it is on the shelf here: tell the store feed (his reports beat it).
      if (a.ticked) {
        await sql`
          insert into store_reports (product_id, status, source)
          select li.product_id, 'found', 'tick' from list_items li
          where li.id = ${a.id} and li.product_id is not null and not li.ticked
        `;
        await sql`delete from not_at_store where product_id = (select product_id from list_items where id = ${a.id})`;
      }
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
    case "finish": {
      await finishShopping(sql);
      return { id: null, found: true };
    }
  }
}

/**
 * "Finished shopping": saves what is ticked as a past shop (what he paid for
 * each thing, with the offers worked out as the shelf would), then takes it off
 * the list. Nothing ticked means nothing to save, so a repeated request after
 * a dropped answer does no harm.
 */
export async function finishShopping(sql: Sql, now: Date = new Date()): Promise<{ saved: boolean }> {
  const ticked = await getList(sql, "ticked");
  if (ticked.length === 0) return { saved: false };

  const priced = ticked.filter((i) => i.price != null);
  const rows: PricedRow[] = priced.map((i) => ({
    id: i.id,
    qty: i.qty,
    item: {
      price: i.price ?? 0,
      wasPrice: i.wasPrice ?? null,
      offerPrice: i.offerPrice ?? null,
      nectarPrice: i.nectarPrice,
      promos: i.promos,
      deals: i.deals,
    },
  }));
  const pricing = priceList(rows, now);
  const groupLabel = new Map(pricing.groups.map((g) => [g.uid, g.label]));

  const items = ticked.map((i) => {
    const line = pricing.lines.get(i.id);
    const paidEach = line && i.qty > 0 ? Math.round(line.cost / i.qty) / 100 : 0;
    const groupKey = pricing.groupOfRow.get(i.id);
    let offer: string | null = groupKey ? (groupLabel.get(groupKey) ?? null) : null;
    if (!offer && i.price != null) {
      const single = nowPence({ price: i.price, wasPrice: i.wasPrice, offerPrice: i.offerPrice, nectarPrice: i.nectarPrice, promos: i.promos }, now);
      if (single < fullPence({ price: i.price, wasPrice: i.wasPrice })) {
        const cut = livePromos(i.promos, now).find((p) => p.kind === "price_cut" && p.text);
        offer = cut ? offerLabel(cut) : "Nectar price";
      }
    }
    return { productId: i.productId, label: i.productId ? null : i.name, name: i.name, qty: i.qty, paidEach, offer };
  });
  const protein = ticked.reduce((n, i) => n + (i.packProtein ?? 0) * i.qty, 0);

  await sql.begin(async (tx) => {
    await tx`
      insert into shops (total, full_price, protein_g, items)
      values (${pricing.total / 100}, ${pricing.full / 100}, ${Math.round(protein)}, ${JSON.stringify(items)}::text::jsonb)
    `;
    await tx`delete from list_items where ticked`;
  });
  return { saved: true };
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

/**
 * "Found it here" / "Not here". Writes his report (the pipeline reads these, and
 * they beat the store feed) and keeps the older not_at_store list in step, which
 * the weekly basket and the For you shelves still read. False when the product does not exist.
 */
export async function setStoreReport(sql: Sql, productId: string, status: "found" | "missing", source: "button" | "tick"): Promise<boolean> {
  const rows = await sql<{ id: number }[]>`
    insert into store_reports (product_id, status, source)
    select p.id, ${status}, ${source} from products p where p.id = ${productId}
    returning id::int as id
  `;
  if (rows.length === 0) return false;
  await setNotAtStore(sql, productId, status === "missing");
  return true;
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
  /** The settings it was made with. `meals` rides along here (there is no column for it). */
  settings: Settings & { meals?: MealCoverage[] };
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
      : await sql<
          { id: string; name: string; brand: string | null; image_url: string | null; zone: string | null; store_eff: string; store_why: string | null; store_stock: string | null; store_stock_at: Date | string | null }[]
        >`
          select p.id, p.name, p.brand, p.image_url, p.zone,
            case when lr.status = 'found' then 'yes' when lr.status = 'missing' or nas.product_id is not null then 'no'
                 else coalesce(p.store_status, 'unknown') end as store_eff,
            case when lr.status = 'found' then 'You found it here' when lr.status = 'missing' or nas.product_id is not null then 'You said it isn''t on the shelf here'
                 else p.store_reason end as store_why,
            case when lr.status is null and nas.product_id is null and p.store_status in ('yes', 'likely')
                      and p.store_in_stock is not null and p.store_stock_at > now() - make_interval(hours => ${STOCK_FRESH_HOURS}::int)
                 then case when p.store_in_stock then 'in' else 'out' end end as store_stock,
            p.store_stock_at
          from products p
          left join not_at_store nas on nas.product_id = p.id
          left join lateral (select sr.status from store_reports sr where sr.product_id = p.id order by sr.reported_at desc limit 1) lr on true
          where p.id = any(${ids}::text[])
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
      store: p
        ? {
            status: (STORE_STATUSES as readonly string[]).includes(p.store_eff) ? (p.store_eff as StoreStatus) : "unknown",
            reason: p.store_why,
            stock: p.store_stock === "in" || p.store_stock === "out" ? p.store_stock : null,
            stockAt: p.store_stock === "in" || p.store_stock === "out" ? iso(p.store_stock_at) : null,
          }
        : undefined,
    };
  });
}

interface VoteDbRow {
  product_id: string;
  vote: number;
  voted_at: Date | string;
  department: string | null;
  category: string | null;
}

/** All his Yes / No answers, with what kind of food each was. */
async function loadVotes(sql: Sql): Promise<VoteDbRow[]> {
  return sql<VoteDbRow[]>`
    select bv.product_id, bv.vote::int as vote, bv.voted_at, p.department, p.category
    from basket_votes bv join products p on p.id = bv.product_id
  `;
}

function voteMap(rows: VoteDbRow[]): Record<string, VoteInfo> {
  const out: Record<string, VoteInfo> = {};
  for (const r of rows) if (r.vote === 1 || r.vote === -1) out[r.product_id] = { vote: r.vote, at: iso(r.voted_at) ?? "" };
  return out;
}

function taughtLines(rows: VoteDbRow[]): string[] {
  return describeVotes(rows.filter((r) => r.vote === 1 || r.vote === -1).map((r) => ({ vote: r.vote === 1 ? 1 : -1, department: r.department, category: r.category })));
}

async function toView(sql: Sql, row: BasketRow, fromHistory: boolean): Promise<BasketView> {
  const items = Array.isArray(row.items) ? row.items : [];
  const { meals, ...settings } = row.settings ?? ({} as BasketRow["settings"]);
  const [lines, votes] = await Promise.all([hydrate(sql, items), loadVotes(sql)]);
  const shown = new Set(items.map((i) => i.productId));
  return {
    id: row.id,
    createdAt: iso(row.created_at),
    settings: { ...DEFAULT_SETTINGS, ...settings },
    items: lines,
    total: row.total,
    proteinG: row.protein_g,
    warnings: stringArray(row.warnings),
    fromHistory,
    votes: Object.fromEntries(Object.entries(voteMap(votes)).filter(([id]) => shown.has(id)).map(([id, v]) => [id, v.vote])),
    taught: taughtLines(votes),
    meals: Array.isArray(meals) ? meals : [],
  };
}

export async function getLastBasket(sql: Sql): Promise<BasketView | null> {
  const row = await lastBasketRow(sql, null);
  return row ? toView(sql, row, false) : null;
}

/** Saves his Yes (1), No (-1), or takes it back (null). False when the product does not exist. */
export async function setVote(sql: Sql, productId: string, vote: 1 | -1 | null): Promise<boolean> {
  if (vote === null) {
    await sql`delete from basket_votes where product_id = ${productId}`;
    return true;
  }
  const rows = await sql<{ product_id: string }[]>`
    insert into basket_votes (product_id, vote)
    select p.id, ${vote}::smallint from products p where p.id = ${productId}
    on conflict (product_id) do update set vote = excluded.vote, voted_at = now()
    returning product_id
  `;
  return rows.length > 0;
}

interface CandidateRow {
  id: string;
  name: string;
  zone: string | null;
  department: string | null;
  category: string | null;
  brand: string | null;
  price: number;
  nectar_price: number | null;
  pack_grams: number | null;
  promos: unknown;
  is_available: boolean;
  is_food: boolean;
  storage: string | null;
  protein: number | null;
  sat: number | null;
  seed_oil: string;
  health: number | null;
  listed_at: Date | string;
  has_detail: boolean;
  ingredient_count: number | null;
  whole_food: boolean;
  review_avg: number | null;
  review_count: number | null;
  store_eff: string;
}

const PRODUCE = ["Fresh fruit", "Fresh vegetables"];

/** Everything the generator may pick from. The generator applies his rules again, so this only keeps the list small. */
async function loadCandidates(sql: Sql): Promise<Candidate[]> {
  const rows = await sql<CandidateRow[]>`
    select p.id, p.name, p.zone, p.department, p.category, p.brand,
      p.price::float8 as price, p.nectar_price::float8 as nectar_price,
      p.pack_grams::float8 as pack_grams, p.promos, p.is_available, p.is_food, p.storage,
      (case when jsonb_typeof(p.nutrition->'protein') = 'number' then (p.nutrition->>'protein')::float8 end) as protein,
      (case when jsonb_typeof(p.nutrition->'sat') = 'number' then (p.nutrition->>'sat')::float8 end) as sat,
      p.seed_oil, p.health::float8 as health, p.listed_at,
      (p.nutrition is not null and p.ingredients is not null) as has_detail,
      p.ingredient_count, p.review_avg::float8 as review_avg, p.review_count,
      (p.ingredient_count = 1 or (p.ingredient_count is null and p.department = any(${PRODUCE}::text[])
        and p.name !~* '(salad|kit|dip|dressing|prepared|stir.?fry|ready|soup|juice|slaw|mash|chips|wedges|roast)')) as whole_food,
      -- His latest report wins, then the daily range feed (same rule as the cards).
      case when lr.status = 'found' then 'yes' when lr.status = 'missing' then 'no' else coalesce(p.store_status, 'unknown') end as store_eff
    from products p
    left join lateral (select sr.status from store_reports sr where sr.product_id = p.id order by sr.reported_at desc limit 1) lr on true
    where p.is_food and p.is_available and p.price > 0 and p.seed_oil not in ('yes', 'likely')
      and (p.seed_oil = 'none' or p.department = any(${PRODUCE}::text[]) or p.ingredient_count = 1)
      and (p.health >= 5
           or (p.health is null and p.department = any(${PRODUCE}::text[]))
           or exists (select 1 from ratings r where r.product_id = p.id and r.stars >= 4)
           or exists (select 1 from basket_votes v where v.product_id = p.id and v.vote = 1))
    order by p.id
    limit 8000
  `;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    zone: r.zone,
    department: r.department,
    category: r.category,
    brand: r.brand,
    price: r.price,
    nectarPrice: r.nectar_price,
    packGrams: r.pack_grams,
    promos: asPromos(r.promos),
    isAvailable: r.is_available,
    isFood: r.is_food,
    storage: r.storage,
    protein: r.protein,
    sat: r.sat,
    seedOil: asSeedOil(r.seed_oil),
    health: r.health,
    listedAt: iso(r.listed_at) ?? "",
    hasDetail: r.has_detail,
    ingredientCount: r.ingredient_count,
    wholeFood: r.whole_food === true,
    reviewAvg: r.review_avg,
    reviewCount: r.review_count,
    storeStatus: (STORE_STATUSES as readonly string[]).includes(r.store_eff) ? (r.store_eff as StoreStatus) : "unknown",
  }));
}

/** The dinner meal deals that are on now, with the products that fill each part. */
async function loadBasketDeals(sql: Sql): Promise<BasketDeal[]> {
  const rows = await sql<{ id: string; title: string; price: number; parts: BasketDeal["parts"] | null; items: BasketDeal["items"] | null }[]>`
    select d.id, d.title, d.price::float8 as price,
      (select jsonb_agg(jsonb_build_object('listId', dp.list_id, 'label', dp.label, 'qty', dp.qty) order by dp.list_id)
         from deal_parts dp where dp.deal_id = d.id) as parts,
      (select jsonb_agg(jsonb_build_object('listId', di.list_id, 'productId', di.product_id))
         from deal_items di where di.deal_id = d.id) as items
    from deals d
    where d.ends_on is null or d.ends_on >= current_date
  `;
  return rows.map((r) => ({ id: r.id, title: r.title, price: r.price, parts: r.parts ?? [], items: r.items ?? [] }));
}

/**
 * Makes this week's basket and saves it. Never throws: if anything goes wrong,
 * or there is nothing to choose from, it returns the last saved basket with a
 * warning, or an empty basket with a plain-English message.
 *
 * This is also "Regenerate": his Yes picks from the last basket stay, his No
 * picks stay out for 28 days, and the rest is refilled.
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
      votes: {},
      taught: [],
      meals: [],
    };
  };

  try {
    const settings = await getSettings(sql);
    const [candidates, ratingRows, notAtRows, voteRows, deals, taste] = await Promise.all([
      loadCandidates(sql),
      sql<{ product_id: string; stars: number }[]>`select product_id, stars::int as stars from ratings`,
      sql<{ product_id: string }[]>`select product_id from not_at_store`,
      loadVotes(sql),
      loadBasketDeals(sql),
      loadTaste(sql),
    ]);
    const ratings: Record<string, number> = {};
    for (const r of ratingRows) ratings[r.product_id] = r.stars;

    const result = generateBasket({
      candidates,
      ratings,
      notAtStore: notAtRows.map((r) => r.product_id),
      votes: voteMap(voteRows),
      taste,
      deals,
      settings,
      previous: last && Array.isArray(last.items) ? { items: last.items } : null,
      now,
    });
    if (result.items.length === 0) return await fallback(result.warnings);

    const saved = await sql<{ id: number; created_at: Date | string }[]>`
      insert into baskets (settings, items, total, protein_g, warnings)
      values (
        ${JSON.stringify({ ...result.settings, meals: result.meals })}::text::jsonb,
        ${JSON.stringify(result.items)}::text::jsonb,
        ${result.total},
        ${result.proteinG},
        ${JSON.stringify(result.warnings)}::text::jsonb
      )
      returning id::int as id, created_at
    `;
    const shown = new Set(result.items.map((i) => i.productId));
    return {
      id: saved[0]?.id ?? null,
      createdAt: iso(saved[0]?.created_at ?? null),
      settings: result.settings,
      items: await hydrate(sql, result.items),
      total: result.total,
      proteinG: result.proteinG,
      warnings: result.warnings,
      fromHistory: false,
      votes: Object.fromEntries(Object.entries(voteMap(voteRows)).filter(([id]) => shown.has(id)).map(([id, v]) => [id, v.vote])),
      taught: taughtLines(voteRows),
      meals: result.meals,
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
