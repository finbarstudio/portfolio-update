import { badRequest, failed, json, notConnected } from "@/lib/dad-shop/api";
import { addOrder, deleteOrder, getDoc, MAX_DOC_BYTES, parseOrderDelete, parseOrderPost, readBodyUpTo } from "@/lib/dad-shop/app-docs";
import { getDb } from "@/lib/dad-shop/db";

export const dynamic = "force-dynamic";

/** Checked-out shops, newest first. */
export async function GET(): Promise<Response> {
  const sql = getDb();
  if (!sql) return json([]);
  try {
    return json(await getDoc(sql, "orders"));
  } catch (err) {
    return failed(err);
  }
}

/** `{ order: { id, items: [...] }, fresh? }`: saves the snapshot first in the list; `fresh` empties the basket and locked deals for next week. */
export async function POST(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readBodyUpTo(request, MAX_DOC_BYTES);
  if (!body.ok) return badRequest(body.error, body.status);
  const post = parseOrderPost(body.body);
  if (!post.ok) return badRequest(post.error);
  try {
    await addOrder(sql, post.value);
    return json({ ok: true });
  } catch (err) {
    return failed(err);
  }
}

/** `{ id }`: undoes a checkout saved by mistake. */
export async function DELETE(request: Request): Promise<Response> {
  const sql = getDb();
  if (!sql) return notConnected();
  const body = await readBodyUpTo(request, 1024);
  if (!body.ok) return badRequest(body.error, body.status);
  const id = parseOrderDelete(body.body);
  if (!id.ok) return badRequest(id.error);
  try {
    await deleteOrder(sql, id.value);
    return json({ ok: true });
  } catch (err) {
    return failed(err);
  }
}
