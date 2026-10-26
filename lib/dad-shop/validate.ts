import {
  ANIMALS,
  COLLECTIONS,
  PAGE_SIZE,
  SORTS,
  VIEWS,
  type FindFilters,
  type Settings,
  type Sort,
  type View,
} from "./types";

/**
 * Input validation for every API route. Each validator takes `unknown` and
 * returns a result, never throws. Bounds follow SPEC.md.
 */

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export const MAX_BODY_BYTES = 10 * 1024;
export const MAX_TEXT = 120;
const ID_RE = /^[0-9A-Za-z_-]{1,40}$/;
const MAX_LIST_ID = 2_147_483_647;
const MAX_PAGE = 200;

function fail<T>(error: string): Result<T> {
  return { ok: false, error };
}

function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** A product id (Sainsbury's uid). */
export function parseProductId(v: unknown): Result<string> {
  if (typeof v !== "string" || !ID_RE.test(v)) return fail("That product isn't valid.");
  return ok(v);
}

/** A list row id: a positive 32-bit integer. */
export function parseListId(v: unknown): Result<number> {
  if (typeof v !== "number" || !Number.isInteger(v) || v < 1 || v > MAX_LIST_ID) return fail("That item isn't valid.");
  return ok(v);
}

/** Free text: trimmed, 1-120 characters, no control characters. */
export function parseLabel(v: unknown): Result<string> {
  if (typeof v !== "string") return fail("Type what you want to add.");
   
  const text = v.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  if (text.length < 1) return fail("Type what you want to add.");
  if (text.length > MAX_TEXT) return fail(`That is too long (most ${MAX_TEXT} letters).`);
  return ok(text);
}

export function parseQty(v: unknown): Result<number> {
  if (typeof v !== "number" || !Number.isInteger(v) || v < 1 || v > 50) return fail("How many? Pick 1 to 50.");
  return ok(v);
}

export function parseBool(v: unknown): Result<boolean> {
  if (typeof v !== "boolean") return fail("That should be on or off.");
  return ok(v);
}

/** 1-5, or null to clear the rating. */
export function parseStars(v: unknown): Result<number | null> {
  if (v === null) return ok<number | null>(null);
  if (typeof v !== "number" || !Number.isInteger(v) || v < 1 || v > 5) return fail("Stars must be 1 to 5.");
  return ok<number | null>(v);
}

/** Yes (1), No (-1), or null to take his answer back. */
export function parseVote(v: unknown): Result<1 | -1 | null> {
  if (v === null) return ok<1 | -1 | null>(null);
  if (v === 1 || v === -1) return ok<1 | -1 | null>(v);
  return fail("Say yes or no.");
}

export type ListAction =
  | { action: "finish" }
  | { action: "add"; productId: string; qty: number }
  | { action: "add"; label: string; qty: number }
  | { action: "tick"; id: number; ticked: boolean }
  | { action: "qty"; id: number; qty: number }
  | { action: "remove"; id: number }
  | { action: "clear_ticked" };

export function parseListAction(body: Record<string, unknown>): Result<ListAction> {
  switch (body.action) {
    case "add": {
      const qty = body.qty === undefined ? ok(1) : parseQty(body.qty);
      if (!qty.ok) return fail(qty.error);
      if (body.productId !== undefined) {
        const id = parseProductId(body.productId);
        if (!id.ok) return fail(id.error);
        return ok<ListAction>({ action: "add", productId: id.value, qty: qty.value });
      }
      const label = parseLabel(body.label);
      if (!label.ok) return fail(label.error);
      return ok<ListAction>({ action: "add", label: label.value, qty: qty.value });
    }
    case "tick": {
      const id = parseListId(body.id);
      if (!id.ok) return fail(id.error);
      const ticked = parseBool(body.ticked);
      if (!ticked.ok) return fail(ticked.error);
      return ok<ListAction>({ action: "tick", id: id.value, ticked: ticked.value });
    }
    case "qty": {
      const id = parseListId(body.id);
      if (!id.ok) return fail(id.error);
      const qty = parseQty(body.qty);
      if (!qty.ok) return fail(qty.error);
      return ok<ListAction>({ action: "qty", id: id.value, qty: qty.value });
    }
    case "remove": {
      const id = parseListId(body.id);
      if (!id.ok) return fail(id.error);
      return ok<ListAction>({ action: "remove", id: id.value });
    }
    case "clear_ticked":
      return ok<ListAction>({ action: "clear_ticked" });
    case "finish":
      return ok<ListAction>({ action: "finish" });
    default:
      return fail("I don't know what to do with that.");
  }
}

function numberIn(v: unknown, lo: number, hi: number, label: string, whole: boolean): Result<number> {
  if (typeof v !== "number" || !Number.isFinite(v)) return fail(`${label} should be a number.`);
  if (whole && !Number.isInteger(v)) return fail(`${label} should be a whole number.`);
  if (v < lo || v > hi) return fail(`${label} should be between ${lo} and ${hi}.`);
  return ok(whole ? v : Math.round(v * 100) / 100);
}

export type SettingsPatch = Partial<Pick<Settings, "budget_gbp" | "people" | "protein_g_per_day">>;

/** Only the three settings he can change. Unknown keys are ignored. */
export function parseSettingsPatch(body: Record<string, unknown>): Result<SettingsPatch> {
  const patch: SettingsPatch = {};
  if (body.budget_gbp !== undefined) {
    const r = numberIn(body.budget_gbp, 1, 1000, "Budget", false);
    if (!r.ok) return fail(r.error);
    patch.budget_gbp = r.value;
  }
  if (body.people !== undefined) {
    const r = numberIn(body.people, 1, 10, "People", true);
    if (!r.ok) return fail(r.error);
    patch.people = r.value;
  }
  if (body.protein_g_per_day !== undefined) {
    const r = numberIn(body.protein_g_per_day, 20, 300, "Protein", true);
    if (!r.ok) return fail(r.error);
    patch.protein_g_per_day = r.value;
  }
  if (Object.keys(patch).length === 0) return fail("Nothing to save.");
  return ok(patch);
}

function flag(v: string | null): boolean {
  return v === "1";
}

function pick(params: URLSearchParams, key: string): Result<string> {
  const v = (params.get(key) ?? "").trim();
  if (v.length > MAX_TEXT) return fail("That choice isn't valid.");
  return ok(v);
}

/** Query string for Find and the add-item search. Flags are off unless the address says "1". */
export function parseFindParams(params: URLSearchParams): Result<FindFilters> {
  const q = (params.get("q") ?? "").replace(/\s+/g, " ").trim();
  if (q.length > MAX_TEXT) return fail("That search is too long.");
  const viewRaw = params.get("view") ?? "all";
  if (!(VIEWS as readonly string[]).includes(viewRaw)) return fail("That view isn't valid.");
  const sortRaw = params.get("sort") ?? "rec";
  if (!(SORTS as readonly string[]).includes(sortRaw)) return fail("That sort isn't valid.");
  const pageRaw = params.get("page") ?? "0";
  if (!/^\d{1,3}$/.test(pageRaw) || Number(pageRaw) > MAX_PAGE) return fail("That page isn't valid.");
  const zone = pick(params, "zone");
  const dept = pick(params, "dept");
  const cat = pick(params, "cat");
  const coll = pick(params, "coll");
  const animal = pick(params, "animal");
  for (const r of [zone, dept, cat, coll, animal]) if (!r.ok) return fail(r.error);
  if (!zone.ok || !dept.ok || !cat.ok || !coll.ok || !animal.ok) return fail("That choice isn't valid.");
  if (coll.value !== "" && !COLLECTIONS.some((c) => c.key === coll.value)) return fail("That collection isn't valid.");
  if (animal.value !== "" && !(ANIMALS as readonly string[]).includes(animal.value)) return fail("That choice isn't valid.");
  return ok<FindFilters>({
    q,
    view: viewRaw as View,
    coll: coll.value,
    zone: zone.value,
    dept: dept.value,
    cat: cat.value,
    animal: animal.value,
    sort: sortRaw as Sort,
    page: Number(pageRaw),
    noSeedOil: flag(params.get("noSeedOil")),
    good: flag(params.get("good")),
    frozen: flag(params.get("frozen")),
    rated: flag(params.get("rated")),
    onList: flag(params.get("onList")),
    fewIngredients: flag(params.get("few")),
    hideSat: flag(params.get("hideSat")),
    hideOwn: flag(params.get("hideOwn")),
    hideSingle: flag(params.get("hideSingle")),
    tasteDiff: flag(params.get("ttd")),
  });
}

/** Rows per request: Find uses a full page, the add-item dropdown asks for fewer. */
export function parseLimit(params: URLSearchParams): number {
  const raw = params.get("limit");
  if (raw === null || !/^\d{1,2}$/.test(raw)) return PAGE_SIZE;
  return Math.min(PAGE_SIZE, Math.max(1, Number(raw)));
}

export type BodyResult = { ok: true; body: Record<string, unknown> } | { ok: false; status: number; error: string };

/**
 * Reads a JSON object body, never more than MAX_BODY_BYTES. Rejects on the
 * Content-Length header first, then counts bytes as they stream in so a body
 * with no (or a lying) length is still cut off.
 */
export async function readJsonBody(request: Request): Promise<BodyResult> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return { ok: false, status: 413, error: "That is too big." };
  }
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().includes("application/json")) {
    return { ok: false, status: 415, error: "Send JSON." };
  }
  if (!request.body) return { ok: false, status: 400, error: "Nothing was sent." };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
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
