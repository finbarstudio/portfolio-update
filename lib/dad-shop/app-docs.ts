import type { Sql } from "./db";
import { isRecord, type Result } from "./validate";

/**
 * The app's whole-document state, in the app_docs table (schema v9): ratings, removals, locked deals, the basket and
 * past orders, with the same meaning as the Tesco app's server.ts. Validation and the basket maths are PURE (tested in
 * app-docs.test.ts); the SQL functions take a postgres.js `sql` and use parameters only.
 *
 * The basket is never written whole: a stale tab used to overwrite newer changes. `basketOp` changes one item in a
 * single SQL statement (the row is locked for the read, so two phones can't lose each other's change).
 */

export type DocName = "ratings" | "removals" | "locks" | "basket" | "orders";
/** The documents a client may replace whole (the basket and orders have their own writes). */
export type WholeDocName = "ratings" | "removals" | "locks";

export const MAX_DOC_BYTES = 512 * 1024;
export const MAX_QTY = 99;
const MAX_KEYS = 5000;
const MAX_KEY_LENGTH = 200;
const MAX_ORDER_ITEMS = 300;

const DIGITS = /^\d{1,20}$/;
const ORDER_ID = /^[0-9A-Za-z_.:+-]{1,64}$/;

function fail<T>(error: string): Result<T> {
  return { ok: false, error };
}

function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function isProductDigits(v: unknown): v is string {
  return typeof v === "string" && DIGITS.test(v);
}

// ── Shapes ───────────────────────────────────────────────────────────────────

export interface BasketDoc {
  items: Record<string, number>;
  /** Ticked off in the shop. */
  ticked: Record<string, true>;
  updated: string;
}

export interface RatingEntry {
  /** 1-10 */
  fit: number;
  name: string;
  at: string;
}

export type RatingsDoc = Record<string, RatingEntry>;

export interface OrderDoc extends Record<string, unknown> {
  id: string;
  items: unknown[];
}

export function emptyBasket(now: string): BasketDoc {
  return { items: {}, ticked: {}, updated: now };
}

// ── Reading a request body (bigger cap than validate.ts: a whole ratings document is a few hundred KB) ──────────

export type BodyResult = { ok: true; body: Record<string, unknown> } | { ok: false; status: number; error: string };

/** A JSON object body of at most `maxBytes`, rejected on Content-Length first, then counted as it streams in. */
export async function readBodyUpTo(request: Request, maxBytes: number): Promise<BodyResult> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false, status: 413, error: "That is too big." };
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().includes("application/json")) return { ok: false, status: 415, error: "Send JSON." };
  if (!request.body) return { ok: false, status: 400, error: "Nothing was sent." };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => undefined);
      return { ok: false, status: 413, error: "That is too big." };
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) {
    bytes.set(c, at);
    at += c.byteLength;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return { ok: false, status: 400, error: "That wasn't valid JSON." };
  }
  if (!isRecord(parsed)) return { ok: false, status: 400, error: "Send a JSON object." };
  return { ok: true, body: parsed };
}

// ── Validation (PURE) ────────────────────────────────────────────────────────

function textUpTo(v: unknown, max: number): string | null {
  return typeof v === "string" && v.length <= max ? v : null;
}

function parseRatings(body: Record<string, unknown>): Result<RatingsDoc> {
  const out: RatingsDoc = {};
  for (const [id, raw] of Object.entries(body)) {
    if (!DIGITS.test(id)) return fail("That rating isn't for a product.");
    if (!isRecord(raw)) return fail("That rating isn't valid.");
    const fit = raw.fit;
    if (typeof fit !== "number" || !Number.isFinite(fit) || fit < 1 || fit > 10) return fail("A rating is 1 to 10.");
    const name = raw.name === undefined ? "" : textUpTo(raw.name, 200);
    const at = raw.at === undefined ? "" : textUpTo(raw.at, 40);
    if (name === null || at === null) return fail("That rating isn't valid.");
    out[id] = { fit, name, at };
  }
  return ok(out);
}

function parseRemovals(body: Record<string, unknown>): Result<Record<string, unknown>> {
  for (const [id, raw] of Object.entries(body)) {
    if (!DIGITS.test(id)) return fail("That removal isn't for a product.");
    if (!isRecord(raw)) return fail("That removal isn't valid.");
  }
  return ok(body);
}

function parseLocks(body: Record<string, unknown>): Result<Record<string, unknown>> {
  for (const [label, raw] of Object.entries(body)) {
    if (label.length < 1) return fail("That deal isn't valid.");
    if (!isRecord(raw)) return fail("That deal isn't valid.");
    const items = raw.items;
    if (items !== undefined) {
      if (!isRecord(items)) return fail("That deal isn't valid.");
      for (const [id, q] of Object.entries(items)) {
        if (!DIGITS.test(id) || typeof q !== "number" || !Number.isInteger(q) || q < 1 || q > MAX_QTY) return fail("That deal isn't valid.");
      }
    }
  }
  return ok(body);
}

/** A whole-document write: an object, bounded in keys, key length and size, with each document's own shape checked. */
export function parseWholeDoc(name: WholeDocName, body: Record<string, unknown>): Result<Record<string, unknown>> {
  const keys = Object.keys(body);
  if (keys.length > MAX_KEYS) return fail("That is too big.");
  if (keys.some((k) => k.length > MAX_KEY_LENGTH)) return fail("That isn't valid.");
  if (JSON.stringify(body).length > MAX_DOC_BYTES) return fail("That is too big.");
  switch (name) {
    case "ratings":
      return parseRatings(body);
    case "removals":
      return parseRemovals(body);
    case "locks":
      return parseLocks(body);
  }
}

export type BasketOp = { kind: "delta"; id: string; delta: number } | { kind: "tick"; id: string; tick: boolean };

/** `{id, delta}` (whole number, -99 to 99, not 0) or `{id, tick: true|false}`. */
export function parseBasketOp(body: Record<string, unknown>): Result<BasketOp> {
  if (!isProductDigits(body.id)) return fail("That product isn't valid.");
  if (body.tick !== undefined) {
    if (typeof body.tick !== "boolean") return fail("That should be on or off.");
    if (body.delta !== undefined) return fail("Send either a change or a tick, not both.");
    return ok<BasketOp>({ kind: "tick", id: body.id, tick: body.tick });
  }
  const d = body.delta;
  if (typeof d !== "number" || !Number.isInteger(d) || d === 0 || d < -MAX_QTY || d > MAX_QTY) return fail("How many? Pick 1 to 99.");
  return ok<BasketOp>({ kind: "delta", id: body.id, delta: d });
}

export interface OrderPost {
  order: OrderDoc;
  fresh: boolean;
}

/** `{order: {id, items: [...]}, fresh?}`: the same "empty order" refusal as the Tesco server. */
export function parseOrderPost(body: Record<string, unknown>): Result<OrderPost> {
  const order = body.order;
  if (!isRecord(order) || typeof order.id !== "string" || !ORDER_ID.test(order.id)) return fail("That order isn't valid.");
  if (!Array.isArray(order.items) || order.items.length < 1) return fail("empty order");
  if (order.items.length > MAX_ORDER_ITEMS) return fail("That order is too big.");
  if (JSON.stringify(order).length > MAX_DOC_BYTES / 4) return fail("That order is too big.");
  if (body.fresh !== undefined && typeof body.fresh !== "boolean") return fail("That should be on or off.");
  return ok<OrderPost>({ order: { ...order, id: order.id, items: order.items }, fresh: body.fresh === true });
}

export function parseOrderDelete(body: Record<string, unknown>): Result<string> {
  if (typeof body.id !== "string" || !ORDER_ID.test(body.id)) return fail("That order isn't valid.");
  return ok(body.id);
}

export interface StoreReportPost {
  id: string;
  status: "found" | "missing";
  source: "button" | "tick";
}

/** `{id, status: "found"|"missing", source: "button"|"tick"}` (source defaults to "button"). */
export function parseStoreReportPost(body: Record<string, unknown>): Result<StoreReportPost> {
  if (!isProductDigits(body.id)) return fail("That product isn't valid.");
  if (body.status !== "found" && body.status !== "missing") return fail("Say found or missing.");
  const source = body.source === undefined ? "button" : body.source;
  if (source !== "button" && source !== "tick") return fail("That source isn't valid.");
  return ok<StoreReportPost>({ id: body.id, status: body.status, source });
}

// ── The basket maths in JS (the SQL in basketOp does the same; this is the reference the tests pin) ────────────

/**
 * One basket change. A delta adds to (or takes from) the quantity: at 0 the item leaves the basket and loses its tick.
 * A tick only sticks on an item that is in the basket; un-ticking always works.
 */
export function applyBasketOp(doc: BasketDoc, op: BasketOp, now: string): BasketDoc {
  const items = { ...doc.items };
  const ticked = { ...doc.ticked };
  if (op.kind === "delta") {
    const q = Math.max(0, Math.min(MAX_QTY, (items[op.id] ?? 0) + op.delta));
    if (q > 0) items[op.id] = q;
    else {
      delete items[op.id];
      delete ticked[op.id];
    }
  } else if (op.tick && items[op.id] !== undefined) ticked[op.id] = true;
  else delete ticked[op.id];
  return { items, ticked, updated: now };
}

// ── First-read seeding (PURE parts) ──────────────────────────────────────────

/** His 1-5 stars from the old ratings table become Tesco-style 1-10 fits (stars x 2). */
export function ratingsSeed(rows: { product_id: string; stars: number; name: string; at: string }[]): RatingsDoc {
  const out: RatingsDoc = {};
  for (const r of rows) out[r.product_id] = { fit: r.stars * 2, name: r.name, at: r.at };
  return out;
}

/** What is on his shopping list (unticked rows with a product) becomes the first basket, quantities added up. */
export function basketSeed(rows: { product_id: string; qty: number }[], now: string): BasketDoc {
  const items: Record<string, number> = {};
  for (const r of rows) items[r.product_id] = Math.min(MAX_QTY, (items[r.product_id] ?? 0) + r.qty);
  return { items, ticked: {}, updated: now };
}

// ── SQL ──────────────────────────────────────────────────────────────────────

const nowIso = (): string => new Date().toISOString();

function iso(v: Date | string): string {
  return v instanceof Date ? v.toISOString() : String(v);
}

function emptyOf(name: DocName, now: string): unknown {
  return name === "orders" ? [] : name === "basket" ? emptyBasket(now) : {};
}

async function seedFor(sql: Sql, name: DocName, now: string): Promise<unknown> {
  if (name === "ratings") {
    const rows = await sql<{ product_id: string; stars: number; name: string; at: Date | string }[]>`
      select r.product_id, r.stars::int as stars, p.name, r.updated_at as at
      from ratings r join products p on p.id = r.product_id
    `;
    return ratingsSeed(rows.map((r) => ({ product_id: r.product_id, stars: r.stars, name: r.name, at: iso(r.at) })));
  }
  if (name === "basket") {
    const rows = await sql<{ product_id: string; qty: number }[]>`
      select product_id, qty::int as qty from list_items where product_id is not null and not ticked
    `;
    return basketSeed(rows, now);
  }
  return emptyOf(name, now);
}

/** Creates the document from what we already know when it has never been written. Safe to race: the first insert wins. */
async function seedIfMissing(sql: Sql, name: DocName): Promise<void> {
  const have = await sql`select 1 from app_docs where name = ${name}`;
  if (have.length > 0) return;
  const seed = await seedFor(sql, name, nowIso());
  await sql`
    insert into app_docs (name, value) values (${name}, ${JSON.stringify(seed)}::text::jsonb)
    on conflict (name) do nothing
  `;
}

/** A document, seeded on its first read (ratings from the ratings table, basket from the unticked list). */
export async function getDoc(sql: Sql, name: DocName): Promise<unknown> {
  await seedIfMissing(sql, name);
  const rows = await sql<{ value: unknown }[]>`select value from app_docs where name = ${name}`;
  return rows[0]?.value ?? emptyOf(name, nowIso());
}

/** Replaces a whole document (ratings, removals, locks only). The caller has validated it. */
export async function putDoc(sql: Sql, name: WholeDocName, value: unknown): Promise<void> {
  await sql`
    insert into app_docs (name, value, updated_at) values (${name}, ${JSON.stringify(value)}::text::jsonb, now())
    on conflict (name) do update set value = excluded.value, updated_at = now()
  `;
}

/**
 * One basket change in ONE statement. The CTE locks the basket row for its read, so a second request waits and then
 * works from the first one's result: two phones adding at once both land. Returns the whole basket after the change.
 */
export async function basketOp(sql: Sql, op: BasketOp, now: Date = new Date()): Promise<BasketDoc> {
  await seedIfMissing(sql, "basket");
  const stamp = now.toISOString();
  const rows =
    op.kind === "delta"
      ? await sql<{ value: BasketDoc }[]>`
          with cur as (select value from app_docs where name = 'basket' for update),
          nq as (
            select greatest(0, least(${MAX_QTY}::int, coalesce((value->'items'->>${op.id}::text)::int, 0) + ${op.delta}::int)) as n,
              coalesce(value->'items', '{}'::jsonb) as items,
              coalesce(value->'ticked', '{}'::jsonb) as ticked
            from cur
          )
          update app_docs set
            value = jsonb_build_object(
              'items', case when nq.n > 0 then jsonb_set(nq.items, array[${op.id}::text], to_jsonb(nq.n)) else nq.items - ${op.id}::text end,
              'ticked', case when nq.n > 0 then nq.ticked else nq.ticked - ${op.id}::text end,
              'updated', ${stamp}::text),
            updated_at = now()
          from nq
          where app_docs.name = 'basket'
          returning app_docs.value as value
        `
      : await sql<{ value: BasketDoc }[]>`
          update app_docs set
            value = jsonb_build_object(
              'items', coalesce(value->'items', '{}'::jsonb),
              'ticked', case
                when ${op.tick}::boolean and (coalesce(value->'items', '{}'::jsonb) ->> ${op.id}::text) is not null
                  then coalesce(value->'ticked', '{}'::jsonb) || jsonb_build_object(${op.id}::text, true)
                else coalesce(value->'ticked', '{}'::jsonb) - ${op.id}::text end,
              'updated', ${stamp}::text),
            updated_at = now()
          where name = 'basket'
          returning value
        `;
  return rows[0]?.value ?? emptyBasket(stamp);
}

/**
 * Saves a checked-out shop at the front of the list (a repeat of the same id replaces it, as in the Tesco server).
 * `fresh` empties the basket and the locked deals in the same transaction: the order keeps both.
 */
export async function addOrder(sql: Sql, post: OrderPost, now: Date = new Date()): Promise<void> {
  const order = JSON.stringify(post.order);
  const stamp = now.toISOString();
  await sql.begin(async (tx) => {
    await tx`
      insert into app_docs (name, value, updated_at)
      values ('orders', jsonb_build_array(${order}::text::jsonb), now())
      on conflict (name) do update set
        value = jsonb_build_array(${order}::text::jsonb) || coalesce((
          select jsonb_agg(t.e order by t.ord)
          from jsonb_array_elements(app_docs.value) with ordinality as t(e, ord)
          where t.e->>'id' is distinct from ${post.order.id}::text
        ), '[]'::jsonb),
        updated_at = now()
    `;
    if (post.fresh) {
      await tx`
        insert into app_docs (name, value, updated_at) values ('basket', ${JSON.stringify(emptyBasket(stamp))}::text::jsonb, now())
        on conflict (name) do update set value = excluded.value, updated_at = now()
      `;
      await tx`
        insert into app_docs (name, value, updated_at) values ('locks', '{}'::jsonb, now())
        on conflict (name) do update set value = excluded.value, updated_at = now()
      `;
    }
  });
}

/** Undoes a checkout saved by mistake. */
export async function deleteOrder(sql: Sql, id: string): Promise<void> {
  await sql`
    update app_docs set
      value = coalesce((
        select jsonb_agg(t.e order by t.ord)
        from jsonb_array_elements(app_docs.value) with ordinality as t(e, ord)
        where t.e->>'id' is distinct from ${id}::text
      ), '[]'::jsonb),
      updated_at = now()
    where name = 'orders'
  `;
}
