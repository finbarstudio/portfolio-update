import "server-only";
import { toItem, toItemDetail, DAD_NEEDS, type Item, type ItemDeal, type ItemDetail } from "./app-catalog";
import { loadDealIds, mapCard, scored, type ScoredRow } from "./catalog";
import type { Sql } from "./db";
import taxonomy from "./group-taxonomy.json";
import { INGREDIENT_RULES, type IngredientRules } from "./ingredient-rules";
import { getFreshness, getSettings } from "./queries";

/**
 * The database side of the app's catalogue. The scored query and mapCard (catalog.ts) are the only scoring path;
 * app-catalog.ts reshapes their cards into the app's Item.
 */

interface DealLinkRow {
  product_id: string;
  id: string;
  title: string;
  part: string;
}

/** The running dinner meal deal each product is in (the first, when it is in several). */
async function loadDealLinks(sql: Sql, ids: string[] | null): Promise<Map<string, ItemDeal>> {
  const rows = await sql<DealLinkRow[]>`
    select di.product_id, d.id, d.title, dp.label as part
    from deal_items di
    join deals d on d.id = di.deal_id
    join deal_parts dp on dp.deal_id = di.deal_id and dp.list_id = di.list_id
    where (d.ends_on is null or d.ends_on >= current_date)
      ${ids ? sql`and di.product_id = any(${ids}::text[])` : sql``}
    order by d.price desc, d.id, di.list_id
  `;
  const out = new Map<string, ItemDeal>();
  for (const r of rows) if (!out.has(r.product_id)) out.set(r.product_id, { id: r.id, title: r.title, part: r.part });
  return out;
}

/** Every available food product, as slim items. */
export async function loadCatalogItems(sql: Sql, now: Date = new Date()): Promise<Item[]> {
  const [rows, dealIds, links] = await Promise.all([
    sql<ScoredRow[]>`${scored(sql, null)} select s.* from s order by s.id`,
    loadDealIds(sql),
    loadDealLinks(sql, null),
  ]);
  return rows.map((r) => toItem(mapCard(r, dealIds), { slug: r.slug, nutrition: r.nutrition, deal: links.get(r.id) ?? null }, now));
}

/** One product with its ingredients, raw nutrition, Fit working and price history. Null when it isn't an available food. */
export async function loadItemDetail(sql: Sql, id: string, now: Date = new Date()): Promise<ItemDetail | null> {
  const [rows, dealIds, links, history] = await Promise.all([
    sql<ScoredRow[]>`${scored(sql, [id])} select s.* from s where s.id = ${id}`,
    loadDealIds(sql),
    loadDealLinks(sql, [id]),
    sql<{ on: string; price: number; nectar: number | null }[]>`
      select seen_on::text as "on", price::float8 as price, nectar_price::float8 as nectar
      from price_history where product_id = ${id} order by seen_on desc limit 120
    `,
  ]);
  const r = rows[0];
  if (!r) return null;
  return toItemDetail(
    mapCard(r, dealIds),
    { slug: r.slug, nutrition: r.nutrition, deal: links.get(id) ?? null },
    { ingredients: r.ingredients, history: [...history].reverse() },
    now,
  );
}

export interface AppMeta {
  taxonomy: typeof taxonomy;
  ingredientRules: IngredientRules;
  needs: string[];
  /** When the product list was last read from Sainsbury's. */
  scrapedAt: string | null;
  /** When Chislehurst's live stock was last read. */
  stockAt: string | null;
  budget: number;
}

export async function loadMeta(sql: Sql): Promise<AppMeta> {
  const [fresh, settings, stock] = await Promise.all([
    getFreshness(sql),
    getSettings(sql),
    sql<{ at: Date | string | null }[]>`select max(store_stock_at) as at from products where is_food`,
  ]);
  const at = stock[0]?.at ?? null;
  return {
    taxonomy,
    ingredientRules: INGREDIENT_RULES,
    needs: [...DAD_NEEDS],
    scrapedAt: fresh.lastListed,
    stockAt: at == null ? null : at instanceof Date ? at.toISOString() : String(at),
    budget: settings.budget_gbp,
  };
}
