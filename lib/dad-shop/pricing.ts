import type { DealLink, PriceInfo, Promo } from "./types";

/**
 * Shelf pricing, shared by the basket generator (server) and the list total
 * (browser). Pure: no clock, no DB. Money is whole pence inside, pounds at the
 * edges.
 */

export function toPence(pounds: number): number {
  return Math.round(pounds * 100);
}

export function toPounds(pence: number): number {
  return Math.round(pence) / 100;
}

/**
 * The price of one unit. Dad always has a Nectar card, so a Nectar price or
 * Nectar offer is simply the price: the cheapest of shelf, offer price and
 * Nectar price.
 */
export function singlePence(p: Pick<PriceInfo, "price" | "nectarPrice"> & { offerPrice?: number | null }): number {
  let best = toPence(p.price);
  if (p.nectarPrice != null && p.nectarPrice > 0) best = Math.min(best, toPence(p.nectarPrice));
  if (p.offerPrice != null && p.offerPrice > 0) best = Math.min(best, toPence(p.offerPrice));
  return best;
}

function dayValue(s: string): number {
  const t = Date.parse(s);
  return Number.isNaN(t) ? Number.NaN : t;
}

/** Promos that are running at `now`. A promo with unreadable dates counts as running. */
export function activePromos(promos: Promo[], now: Date): Promo[] {
  const t = now.getTime();
  return promos.filter((p) => {
    const start = dayValue(p.start);
    const end = dayValue(p.end);
    // `end` is a date: it runs to the end of that day.
    if (!Number.isNaN(start) && t < start) return false;
    if (!Number.isNaN(end) && t > end + 24 * 3600 * 1000 - 1) return false;
    return true;
  });
}

/** The multi-buy that actually saves money per unit, if any. */
export function bestMultibuy(p: PriceInfo, now: Date): Promo | null {
  const single = singlePence(p);
  let best: Promo | null = null;
  let bestUnit = single;
  for (const promo of activePromos(p.promos, now)) {
    if (promo.kind !== "multibuy") continue;
    const qty = promo.qty;
    const deal = promo.dealPrice;
    if (!qty || qty < 2 || !deal || deal <= 0) continue;
    const unit = toPence(deal) / qty;
    if (unit < bestUnit - 0.0001) {
      best = promo;
      bestUnit = unit;
    }
  }
  return best;
}

export interface Line {
  pence: number;
  /** Set when at least one full multi-buy applies to this quantity. */
  dealGroup?: string;
}

/**
 * Price of `qty` units. A multi-buy only applies to complete groups: with a
 * "2 for £4" offer, 1 unit costs the single price, 2 cost £4, 3 cost £4 plus
 * one single.
 */
export function linePrice(p: PriceInfo, qty: number, now: Date): Line {
  const single = singlePence(p);
  const deal = bestMultibuy(p, now);
  if (!deal || !deal.qty || !deal.dealPrice) return { pence: single * qty };
  const groups = Math.floor(qty / deal.qty);
  const rest = qty - groups * deal.qty;
  const pence = groups * toPence(deal.dealPrice) + rest * single;
  return groups > 0 ? { pence, dealGroup: deal.uid } : { pence };
}

/** "2 for £4 with Nectar" */
export function dealLabel(promo: Promo): string {
  const price = promo.dealPrice ?? 0;
  const money = Number.isInteger(price) ? `£${price}` : `£${price.toFixed(2)}`;
  return `${promo.qty} for ${money}${promo.nectar ? " with Nectar" : ""}`;
}

// ── Reading promos written in the old or the new shape ──────────────────────

function num(v: string | undefined): number | undefined {
  if (v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Fills in what an older promo row never stored (kind, qty, dealPrice, savePct,
 * getFree, mixMatch) from its own wording. Fields that are already there win.
 * "Meal Deal" wording is always a meal deal, never a price cut.
 */
export function readPromo(p: Promo): Promo {
  const text = p.text ?? "";
  const out: Promo = { ...p };
  if (/meal deal/i.test(text)) {
    out.kind = "mealdeal";
    out.dealPrice ??= num(text.match(/£\s?(\d+(?:\.\d+)?)/)?.[1]);
    return out;
  }
  if (out.kind === "mealdeal") return out;

  const any = /\bany\b/i.test(text);
  let m = text.match(/\bbuy\s+(?:any\s+)?(\d+)\s+get\s+cheapest\s*(\d+)?\s*free/i);
  if (m) {
    out.kind = "multibuy";
    out.qty ??= Number(m[1]);
    out.getFree ??= m[2] ? Number(m[2]) : 1;
    out.mixMatch ??= true;
    return out;
  }
  m = text.match(/\bbuy\s+(?:any\s+)?(\d+)(?:\s+or\s+more)?\s+save\s+(\d+(?:\.\d+)?)\s*%/i);
  if (m) {
    out.kind = "multibuy";
    out.qty ??= Number(m[1]);
    out.savePct ??= Number(m[2]);
    out.mixMatch ??= true;
    return out;
  }
  m = text.match(/\bbuy\s+(?:any\s+)?(\d+)\s+for\s+£?\s?(\d*\.?\d+)/i);
  if (m) {
    const n = Number(m[1]);
    const price = num(m[2]);
    if (n <= 1) {
      out.kind = "price_cut";
      out.dealPrice ??= price;
    } else {
      out.kind = "multibuy";
      out.qty ??= n;
      out.dealPrice ??= price;
      out.mixMatch ??= any;
    }
    return out;
  }
  m = text.match(/\bsave\s+(\d+(?:\.\d+)?)\s*%/i);
  if (m) {
    out.kind = "price_cut";
    out.savePct ??= Number(m[1]);
    return out;
  }
  m = text.match(/\bsave\s+(\d+)\s*\/\s*(\d+)\b/i);
  if (m && Number(m[2]) > 0) {
    out.kind = "price_cut";
    out.savePct ??= Math.round((Number(m[1]) / Number(m[2])) * 10000) / 100;
    return out;
  }
  if (/^half price\b/i.test(text)) {
    out.kind = "price_cut";
    out.savePct ??= 50;
    return out;
  }
  m = text.match(/^only\s+£\s?(\d+(?:\.\d+)?)/i);
  if (m) {
    out.kind = "price_cut";
    out.dealPrice ??= Number(m[1]);
    return out;
  }
  return out;
}

/** The running promos, read into their full shape. */
export function livePromos(promos: Promo[], now: Date): Promo[] {
  return activePromos(promos, now).map(readPromo);
}

/** The shelf price before any offer. */
export function fullPence(p: Pick<PriceInfo, "price" | "wasPrice">): number {
  const shelf = toPence(p.price);
  return p.wasPrice != null && p.wasPrice > 0 ? Math.max(shelf, toPence(p.wasPrice)) : shelf;
}

/** What one unit costs him right now, counting running price cuts as well. */
export function nowPence(p: PriceInfo, now: Date): number {
  let best = singlePence(p);
  const full = fullPence(p);
  for (const promo of livePromos(p.promos, now)) {
    if (promo.kind !== "price_cut") continue;
    if (promo.dealPrice && promo.dealPrice > 0) best = Math.min(best, toPence(promo.dealPrice));
    else if (promo.savePct && promo.savePct > 0) best = Math.min(best, Math.round(full * (1 - promo.savePct / 100)));
  }
  return best;
}

export interface PriceView {
  nowPence: number;
  fullPence: number;
  /** The price he pays is lower than the usual one. */
  cut: boolean;
  /** The cut comes from a Nectar price or offer. */
  nectar: boolean;
}

export function priceView(p: PriceInfo, now: Date): PriceView {
  const n = nowPence(p, now);
  const f = fullPence(p);
  const cut = n < f - 0.0001;
  const nectar =
    cut &&
    (p.nectarPrice != null ||
      livePromos(p.promos, now).some((x) => x.nectar && (x.kind === "price_cut" || x.dealPrice != null || x.savePct != null)));
  return { nowPence: n, fullPence: f, cut, nectar };
}

/**
 * How an offer reads on screen. Nectar is taken as read, so "with Nectar" only
 * stays on a plain price: "Buy 1 for 1.7" becomes "£1.70 with Nectar", and
 * "Buy any 2 for £2.00 with Nectar, £1.20 / ltr" becomes "Any 2 for £2.00".
 */
export function offerLabel(promo: Promo): string {
  const read = readPromo(promo);
  if (read.kind === "price_cut" && read.dealPrice != null && /^buy\s+1\s+for\b/i.test(read.text ?? "")) {
    return `£${read.dealPrice.toFixed(2)} with Nectar`;
  }
  return offerWords(read.text ?? "");
}

/** The wording of an offer without the Nectar note or the per-kg price, first letter capital. */
export function offerWords(text: string): string {
  let t = text.replace(/\s*,\s*£\s?[\d.]+\s*\/\s*\w+\s*$/i, "");
  t = t.replace(/\s+with\s+nectar\b/gi, "").replace(/^buy\s+(?=any\b)/i, "").replace(/\s+/g, " ").trim();
  if (/^buy\s+\d+\s+for\b/i.test(t)) t = t.replace(/^buy\s+/i, "");
  return t.length > 0 ? t.charAt(0).toUpperCase() + t.slice(1) : "Offer";
}

/** "Any 2 for £2": whole pounds drop the pence. */
export function tidyMoney(text: string): string {
  return text.replace(/£(\d+)\.00\b/g, "£$1");
}

// ── The list as a basket: offers shared across different products ───────────

/** Colour pairs (tint, ink) for lettered offer groups, in order. */
export const GROUP_COLOURS: readonly [string, string][] = [
  ["#d0e4ff", "#0b4a99"],
  ["#ffe0b8", "#8a4b00"],
  ["#d9f2dc", "#17652a"],
  ["#f3dcff", "#6a2a8f"],
  ["#ffd6d6", "#9a1d1d"],
  ["#d6f3f2", "#0d5f5c"],
  ["#fff0a8", "#6b5800"],
  ["#e6e1d8", "#4b4237"],
];

export interface PricedRow {
  id: number;
  qty: number;
  item: PriceInfo & { deals?: DealLink[] };
}

export interface GroupInfo {
  uid: string;
  label: string;
  letter: string;
  colour: number;
  kind: "multibuy" | "mealdeal";
  /** How many items one set needs (a meal deal: all its parts). */
  size: number;
  have: number;
  /** More items to complete the next set; 0 once every item is in a full set. */
  need: number;
  unlocked: boolean;
  /** What the group costs, in pence. */
  total: number;
  /** What the same items cost at the usual price. */
  full: number;
  saving: number;
  rowIds: number[];
  /** A meal deal: "1 Main + 1 Side". */
  partsText: string | null;
}

export interface LineCost {
  /** What this row costs in pence (its share of its group). */
  cost: number;
  /** The usual price of this row in pence. */
  full: number;
}

export interface ListPricing {
  total: number;
  full: number;
  lines: Map<number, LineCost>;
  groups: GroupInfo[];
  /** Row id to the group (uid) it belongs to. */
  groupOfRow: Map<number, string>;
}

interface Unit {
  row: number;
  single: number;
  full: number;
  part: number | null;
}

interface Candidate {
  promo: Promo;
  /** Estimated pence per item at a full set; Infinity when unknown. */
  unit: number;
  kind: "multibuy" | "mealdeal";
  deal: DealLink | null;
}

function dealSize(d: DealLink): number {
  return d.parts.reduce((n, p) => n + p.qty, 0);
}

/** The group offer this product belongs to, if one is worth having. */
function chooseGroupOffer(item: PricedRow["item"], single: number, full: number, now: Date): Candidate | null {
  let best: Candidate | null = null;
  for (const promo of livePromos(item.promos, now)) {
    let cand: Candidate | null = null;
    if (promo.kind === "mealdeal") {
      // A bundle can only be priced when we know its parts; otherwise it is not guessed at.
      const deal = item.deals?.find((d) => d.id === promo.uid) ?? null;
      if (!deal || deal.parts.length === 0) continue;
      const size = dealSize(deal);
      cand = { promo, kind: "mealdeal", deal, unit: size > 0 ? toPence(deal.price) / size : Number.POSITIVE_INFINITY };
    } else if (promo.kind === "multibuy" && promo.qty && promo.qty >= 2) {
      let unit = Number.NaN;
      if (promo.getFree && promo.getFree > 0 && promo.getFree < promo.qty) unit = (single * (promo.qty - promo.getFree)) / promo.qty;
      else if (promo.savePct && promo.savePct > 0) unit = Math.min(single, full * (1 - promo.savePct / 100));
      else if (promo.dealPrice && promo.dealPrice > 0) unit = toPence(promo.dealPrice) / promo.qty;
      if (Number.isNaN(unit) || unit >= single - 0.0001) continue;
      cand = { promo, kind: "multibuy", deal: null, unit };
    }
    if (!cand) continue;
    if (!best || cand.unit < best.unit) best = cand;
  }
  return best;
}

/** Spreads a whole-pence total over weights so the shares add up exactly. */
function share(total: number, weights: number[]): number[] {
  const all = weights.reduce((a, b) => a + b, 0);
  if (all <= 0) return weights.map(() => 0);
  const raw = weights.map((w) => (total * w) / all);
  const floor = raw.map((r) => Math.floor(r));
  let left = total - floor.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => ({ i, frac: r - Math.floor(r) })).sort((a, b) => b.frac - a.frac || a.i - b.i);
  for (const o of order) {
    if (left <= 0) break;
    floor[o.i] += 1;
    left -= 1;
  }
  return floor;
}

interface GroupCost {
  total: number;
  size: number;
  need: number;
}

const sum = (xs: number[]): number => xs.reduce((a, b) => a + b, 0);
const dearestFirst = (units: Unit[]): Unit[] => [...units].sort((a, b) => b.single - a.single || a.row - b.row);

function priceMultibuy(units: Unit[], promo: Promo): GroupCost {
  const size = promo.qty ?? 2;
  const singles = sum(units.map((u) => u.single));
  const sorted = dearestFirst(units);
  const sets = Math.floor(units.length / size);
  let total = singles;
  let need = units.length % size === 0 ? 0 : size - (units.length % size);

  if (promo.getFree && promo.getFree > 0) {
    // Each set of `size` (dearest first) gets its cheapest `getFree` free.
    let free = 0;
    for (let s = 0; s < sets; s++) {
      for (const u of sorted.slice(s * size, (s + 1) * size).slice(size - promo.getFree)) free += u.single;
    }
    total = singles - free;
  } else if (promo.savePct && promo.savePct > 0) {
    if (units.length >= size) {
      total = sum(units.map((u) => Math.min(u.single, Math.round(u.full * (1 - (promo.savePct ?? 0) / 100)))));
    }
    need = Math.max(0, size - units.length);
  } else if (promo.dealPrice && promo.dealPrice > 0 && sets > 0) {
    const rest = sorted.slice(sets * size);
    // A set only counts when it beats buying the same items one by one.
    total = Math.min(singles, sets * toPence(promo.dealPrice) + sum(rest.map((u) => u.single)));
  }
  return { total, size, need };
}

function priceMealDeal(units: Unit[], deal: DealLink): GroupCost {
  const singles = sum(units.map((u) => u.single));
  const bundle = toPence(deal.price);
  const size = dealSize(deal);
  const byPart = new Map<number, Unit[]>();
  for (const u of units) byPart.set(u.part ?? -1, [...(byPart.get(u.part ?? -1) ?? []), u]);
  let sets = Number.POSITIVE_INFINITY;
  for (const part of deal.parts) sets = Math.min(sets, Math.floor((byPart.get(part.listId)?.length ?? 0) / part.qty));
  if (!Number.isFinite(sets)) sets = 0;
  let total = singles;
  if (bundle > 0 && sets > 0) {
    let used = 0;
    for (const part of deal.parts) used += sum(dearestFirst(byPart.get(part.listId) ?? []).slice(0, sets * part.qty).map((u) => u.single));
    total = Math.min(singles, sets * bundle + (singles - used));
  }
  const leftover = units.length - sets * size;
  let need = 0;
  if (leftover > 0 || units.length === 0) {
    for (const part of deal.parts) need += Math.max(0, part.qty * (sets + 1) - (byPart.get(part.listId)?.length ?? 0));
  }
  return { total, size, need };
}

/**
 * Prices the whole list the way the shelf would charge it. Offers apply to
 * complete sets only, and across different products: "any 2 for £2" takes one
 * of each, "buy 3 get the cheapest free" takes the three dearest together, a
 * dinner meal deal needs every part. A partial set costs the single price.
 * Each item's share of a group is the group's cost spread by usual price, so
 * every row shows a real price. Nectar is taken as read.
 */
export function priceList(rows: PricedRow[], now: Date): ListPricing {
  const lines = new Map<number, LineCost>();
  const groupOfRow = new Map<number, string>();
  const groups: GroupInfo[] = [];
  let total = 0;
  let full = 0;

  interface Bucket {
    cand: Candidate;
    units: Unit[];
    rows: PricedRow[];
  }
  const buckets = new Map<string, Bucket>();
  const order: string[] = [];

  for (const row of rows) {
    const single = nowPence(row.item, now);
    const fullEach = Math.max(fullPence(row.item), single);
    const cand = chooseGroupOffer(row.item, single, fullEach, now);
    if (!cand || row.qty < 1) {
      const cost = single * row.qty;
      const f = fullEach * row.qty;
      lines.set(row.id, { cost, full: f });
      total += cost;
      full += f;
      continue;
    }
    const key = cand.promo.uid || offerLabel(cand.promo);
    let b = buckets.get(key);
    if (!b) {
      b = { cand, units: [], rows: [] };
      buckets.set(key, b);
      order.push(key);
    }
    b.rows.push(row);
    const part = cand.deal ? cand.deal.listId : null;
    const myPart = row.item.deals?.find((d) => d.id === cand.promo.uid)?.listId ?? part;
    for (let i = 0; i < row.qty; i++) b.units.push({ row: row.id, single, full: fullEach, part: myPart });
  }

  // Letters follow the order products were added to the list.
  const bucketOrder = [...order].sort(
    (a, b) => rows.indexOf(buckets.get(a)!.rows[0]) - rows.indexOf(buckets.get(b)!.rows[0]),
  );
  bucketOrder.forEach((key, index) => {
    const b = buckets.get(key)!;
    const { cand, units } = b;
    const deal = b.rows.map((r) => r.item.deals?.find((d) => d.id === cand.promo.uid)).find((d) => d) ?? cand.deal;
    const cost = cand.kind === "mealdeal" && deal ? priceMealDeal(units, deal) : priceMultibuy(units, cand.promo);
    const gFull = sum(units.map((u) => u.full));

    // Each row's share of the group is the group's cost spread by usual price.
    const rowIds = [...new Set(units.map((u) => u.row))];
    const fullByRow = rowIds.map((id) => sum(units.filter((u) => u.row === id).map((u) => u.full)));
    const costByRow = share(cost.total, fullByRow);
    rowIds.forEach((id, k) => {
      lines.set(id, { cost: costByRow[k], full: fullByRow[k] });
      groupOfRow.set(id, key);
    });
    total += cost.total;
    full += gFull;

    const parts = deal?.parts ?? [];
    groups.push({
      uid: key,
      label: deal ? deal.title : tidyMoney(offerLabel(cand.promo)),
      letter: String.fromCharCode(65 + (index % 26)),
      colour: index % GROUP_COLOURS.length,
      kind: cand.kind,
      size: cost.size,
      have: units.length,
      need: cost.need,
      unlocked: cost.need === 0 && units.length >= cost.size,
      total: cost.total,
      full: gFull,
      saving: Math.max(0, gFull - cost.total),
      rowIds,
      partsText: parts.length > 0 ? parts.map((p) => `${p.qty} ${p.label}`).join(" + ") : null,
    });
  });

  return { total, full, lines, groups, groupOfRow };
}
