import { readFile } from "node:fs/promises";
import type postgres from "postgres";
import { badRequest, failed, json, notConnected, unauthorized } from "@/lib/food-shop/api";
import { type CurrentUser, getCurrentUser, readGuardedJson } from "@/lib/food-shop/auth";
import { CATALOG_CACHE_FILE } from "@/lib/food-shop/catalog";
import { getDb, type Sql } from "@/lib/food-shop/db";
import { BASE_PATH } from "@/lib/food-shop/paths";
import { areaOf, DEFAULT_SETTINGS, parseSettings } from "@/lib/food-shop/settings";

export const dynamic = "force-dynamic";

/**
 * The cloned app's server, one route for all of it. It answers what Finbar's local server.ts answers, with
 * the same shapes, but per account:
 *   GET  me                          who's here, their settings, where the product file is, what their area hid
 *   GET  basket · POST basket/op     { items: { id: qty }, updated }, changed one item at a time
 *   GET/POST ratings|removals|locks  whole JSON documents, as the page keeps them
 *   GET/POST/DELETE orders           past shops, newest first; POST { order, fresh } may also empty the basket
 *   GET  catalog                     dev only: the product file, when it isn't on R2 yet
 */

type Kind = "basket" | "ratings" | "removals" | "locks" | "orders";
const DOCS = new Set(["ratings", "removals", "locks"]);
const EMPTY: Record<Kind, unknown> = { basket: { items: {} }, ratings: {}, removals: {}, locks: {}, orders: [] };
const MAX_DOC = 2 * 1024 * 1024;
const isId = (v: unknown): v is string => typeof v === "string" && /^\d{1,20}$/.test(v);

async function readDoc(sql: Sql, user: CurrentUser, kind: Kind): Promise<unknown> {
  const [row] = await sql<{ data: unknown }[]>`select data from user_docs where user_id = ${user.id} and kind = ${kind}`;
  return row?.data ?? EMPTY[kind];
}

async function writeDoc(sql: Sql | postgres.TransactionSql, user: CurrentUser, kind: Kind, data: unknown): Promise<void> {
  await sql`
    insert into user_docs (user_id, kind, data, updated_at) values (${user.id}, ${kind}, ${JSON.stringify(data)}::text::jsonb, now())
    on conflict (user_id, kind) do update set data = excluded.data, updated_at = now()`;
}

async function me(sql: Sql, user: CurrentUser): Promise<Response> {
  const [row] = await sql<{ data: unknown; v: unknown; scraped: unknown }[]>`
    select (select data from settings where user_id = ${user.id}) as data,
           (select value from meta where key = 'updated_at') as v,
           (select value from meta where key = 'scraped_at') as scraped`;
  const parsed = row?.data == null ? null : parseSettings(row.data);
  const settings = parsed?.ok ? parsed.value : DEFAULT_SETTINGS;
  const area = areaOf(settings);
  const reported = area ? await sql<{ id: string }[]>`select distinct product_id as id from unavailable_reports where area = ${area}` : [];
  const v = typeof row?.v === "string" ? row.v : "";
  const base = process.env.FOOD_SHOP_CATALOG_URL ?? `${BASE_PATH}/api/app/catalog`;
  return json({
    user: { name: user.name, email: user.email },
    settings,
    area,
    unavailable: reported.map((r) => r.id),
    catalog: { url: `${base}?v=${encodeURIComponent(v)}`, updatedAt: v, scrapedAt: typeof row?.scraped === "string" ? row.scraped : v },
  });
}

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const path = (await params).path.join("/");
  if (path === "catalog") {
    // Production reads the product file straight from R2 (FOOD_SHOP_CATALOG_URL). Locally the publish step
    // leaves a copy on disk, served from here so the clone works before R2 is public.
    if (process.env.NODE_ENV === "production") return badRequest("Not here.", 404);
    try {
      const body = await readFile(CATALOG_CACHE_FILE);
      return new Response(body, { headers: { "content-type": "application/json", "content-encoding": "gzip", "cache-control": "no-store" } });
    } catch {
      return badRequest("No product file yet: run the publish script.", 404);
    }
  }
  const sql = getDb();
  if (!sql) return notConnected();
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  try {
    if (path === "me") return await me(sql, user);
    if (path === "basket" || path === "orders" || DOCS.has(path)) return json(await readDoc(sql, user, path as Kind));
    return badRequest("Not here.", 404);
  } catch (err) {
    return failed(err);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const path = (await params).path.join("/");
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readGuardedJson(request, MAX_DOC);
  if (!body.ok) return badRequest(body.error, body.status);
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const b = body.body;
  try {
    if (DOCS.has(path)) {
      await writeDoc(sql, user, path as Kind, b);
      return json({ ok: true });
    }
    if (path === "basket") return json({ error: "reload the page — use /api/basket/op" }, 409);
    if (path === "basket/op") {
      // one item at a time, merged under a row lock, so two tabs never overwrite each other
      if (!isId(b.id) || !Number.isInteger(b.delta) || Math.abs(b.delta as number) > 50) return badRequest("That basket change doesn't look right.");
      const doc = await sql.begin(async (tx) => {
        await tx`insert into user_docs (user_id, kind, data) values (${user.id}, 'basket', '{"items":{}}') on conflict do nothing`;
        const [row] = await tx<{ data: { items?: Record<string, number> } }[]>`select data from user_docs where user_id = ${user.id} and kind = 'basket' for update`;
        const items = { ...(row?.data.items ?? {}) };
        const q = (items[b.id as string] ?? 0) + (b.delta as number);
        if (q > 0) items[b.id as string] = Math.min(q, 99);
        else delete items[b.id as string];
        const next = { items, updated: new Date().toISOString() };
        await writeDoc(tx, user, "basket", next);
        return next;
      });
      return json(doc);
    }
    if (path === "orders") {
      const order = b.order as { id?: unknown; items?: unknown } | undefined;
      if (!order || typeof order.id !== "string" || !Array.isArray(order.items) || order.items.length === 0) return json({ error: "empty order" }, 400);
      await sql.begin(async (tx) => {
        const [row] = await tx<{ data: { id: string }[] }[]>`select data from user_docs where user_id = ${user.id} and kind = 'orders' for update`;
        const orders = Array.isArray(row?.data) ? row.data : [];
        await writeDoc(tx, user, "orders", [order, ...orders.filter((o) => o.id !== order.id)].slice(0, 200));
        if (b.fresh === true) {
          await writeDoc(tx, user, "basket", { items: {}, updated: new Date().toISOString() });
          await writeDoc(tx, user, "locks", {});
        }
      });
      return json({ ok: true });
    }
    return badRequest("Not here.", 404);
  } catch (err) {
    return failed(err);
  }
}

/** DELETE orders { id }: undo a checkout saved by mistake. */
export async function DELETE(request: Request, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  if ((await params).path.join("/") !== "orders") return badRequest("Not here.", 404);
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readGuardedJson(request);
  if (!body.ok) return badRequest(body.error, body.status);
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  if (typeof body.body.id !== "string") return badRequest("Which shop?");
  try {
    const orders = (await readDoc(sql, user, "orders")) as { id: string }[];
    await writeDoc(sql, user, "orders", orders.filter((o) => o.id !== body.body.id));
    return json({ ok: true });
  } catch (err) {
    return failed(err);
  }
}
