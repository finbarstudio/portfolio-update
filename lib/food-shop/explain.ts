/** Plain-words explanations of Fit and Value for the product page and the For you header. Pure. */
import { GOAL_LABELS, WATCH_SHORT, ALLERGEN_LABELS, APPLIANCE_LABELS, DIET_LABELS } from "./labels";
import { ALLERGEN_RE, type ScoreInput, type Scored, type ValueParts } from "./score";
import { type Allergen, type Settings, weightsFor } from "./settings";

const list = (xs: string[]): string => (xs.length <= 1 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
const WATCH_KEYS = ["sat", "salt", "sugar", "kcal", "upf"] as const;

/** "High protein · watching sat fat a lot · vegetarian": the line at the top of For you. */
export function describeSettings(s: Settings): string {
  const parts: string[] = [GOAL_LABELS[s.goal].title];
  const lots = WATCH_KEYS.filter((k) => s.watch[k] === 2).map((k) => WATCH_SHORT[k]);
  const bits = WATCH_KEYS.filter((k) => s.watch[k] === 1).map((k) => WATCH_SHORT[k]);
  if (lots.length) parts.push(`watching ${list(lots)} a lot`);
  if (bits.length) parts.push(`${list(bits)} a bit`);
  if (s.proteinTarget) parts.push(`${s.proteinTarget}g protein a day`);
  if (s.diet !== "none") parts.push(DIET_LABELS[s.diet].toLowerCase());
  if (s.noPork) parts.push("no pork");
  if (s.noBeef) parts.push("no beef");
  if (s.allergens.length) parts.push(`avoiding ${list(s.allergens.map((a) => ALLERGEN_LABELS[a].toLowerCase()))}`);
  if (!s.clubcard) parts.push("no Clubcard");
  return parts.join(" · ");
}

export interface FitPartView {
  key: "nutrition" | "processing" | "shelf" | "convenience";
  title: string;
  score: number;
  /** Share of Fit, 0-100. */
  weightPct: number;
  text: string;
}

const g = (v: number) => String(+(v < 1 ? v.toFixed(2) : v.toFixed(1)));

export function fitPartViews(p: ScoreInput, s: Settings, parts: Scored["parts"], extra: { storage: string | null; freezeState: string | null }): FitPartView[] {
  const w = weightsFor(s);
  const pct = (x: number) => Math.round(x * 100);

  const watched = WATCH_KEYS.filter((k) => k !== "upf" && s.watch[k] >= 1).map((k) => WATCH_SHORT[k]);
  const caring = [...(s.protein >= 1 ? ["protein"] : []), ...watched];
  const n = p.n100;
  const facts = [n?.protein != null ? `${g(n.protein)}g protein` : null, n?.sat != null ? `${g(n.sat)}g sat fat` : null, n?.salt != null ? `${g(n.salt)}g salt` : null, n?.sugar != null ? `${g(n.sugar)}g sugar` : null]
    .filter((x): x is string => x != null)
    .join(", ");
  const nutrition = `${caring.length ? `Judged on ${list(caring)}, which you said matter to you.` : "You don't mind about any one nutrient, so this is a middle-of-the-road read."}${facts ? ` Per 100g: ${facts}.` : " No nutrition label on file yet, so this is a typical score for this kind of food."}`;

  const nova = p.proc?.nova;
  const how = nova === 4 ? "Ultra-processed (NOVA 4)." : nova === 3 ? "Processed (NOVA 3)." : nova != null ? `Minimally processed (NOVA ${nova}).` : "Processing level not known.";
  const upf = ["you don't mind ultra-processed food, so this counts for less", "you mind ultra-processed food a bit", "you mind ultra-processed food a lot, so this counts for more"][s.watch.upf];
  const processing = `${how} Counted at this weight because ${upf}.`;

  const place = extra.storage === "frozen" ? "Frozen, so it keeps for months." : extra.storage === "ambient" ? "Cupboard food, so it keeps for months." : extra.storage === "chilled" ? `Chilled, so use it within days${extra.freezeState === "yes" ? " (it can be frozen)" : ""}.` : "Shelf life not known.";
  const shelf = `${place} ${s.buys.frozen && !s.buys.fresh ? "You buy frozen rather than fresh, so this counts for more." : s.buys.fresh && !s.buys.frozen ? "You buy fresh rather than frozen, so this counts for less." : "You buy both fresh and frozen, so this counts a little."}${s.buys.freezeFresh ? " You freeze fresh food, so fresh packs you can freeze score better." : ""}`;

  const f = p.flags;
  const ways: string[] = [];
  if (f?.airfry && s.appliances.includes("airfryer")) ways.push(APPLIANCE_LABELS.airfryer.toLowerCase());
  if (f?.microwave && s.appliances.includes("microwave")) ways.push("microwave");
  if (f?.oven && s.appliances.includes("oven")) ways.push("oven");
  const convenience = `${ways.length ? `Works in your ${list(ways)}.` : "Nothing special for the kit you have."} ${p.cat === "ready-meal" ? (s.cooking === "ready" ? "A ready meal suits how you cook." : "A ready meal, which counts for less since you like cooking from scratch.") : s.cooking === "ready" ? "You want minimal cooking, so ease counts for more." : "You're happy cooking from scratch, so ease counts for less."}`;

  return [
    { key: "nutrition", title: "Nutrition", score: parts.nutrition, weightPct: pct(w.nutrition), text: nutrition },
    { key: "processing", title: "Processing", score: parts.processing, weightPct: pct(w.processing), text: processing },
    { key: "shelf", title: "Shelf life", score: parts.shelf, weightPct: pct(w.shelf), text: shelf },
    { key: "convenience", title: "Convenience", score: parts.convenience, weightPct: pct(w.convenience), text: convenience },
  ];
}

/** Lines saying where Value comes from, at the price this person pays. */
export function valueLines(p: ScoreInput, s: Settings, unitPrice: number | null, hasOffer: boolean): string[] {
  const vp = p.valueParts as (ValueParts & { subtype?: string; pppScope?: string }) | null;
  const lines: string[] = [];
  if (!vp || unitPrice == null) return ["There's no price to judge yet."];
  const storedPrice = p.best?.unitPrice ?? p.regular;
  const verdict = (ratio: number) => (ratio <= 0.85 ? "cheaper than usual" : ratio >= 1.15 ? "dearer than usual" : "about usual");

  if (vp.fullKg && p.regular && vp.typicalKg) {
    const perKg = (vp.fullKg * unitPrice) / p.regular;
    lines.push(`£${perKg.toFixed(2)} per kg at your price, against about £${vp.typicalKg.toFixed(2)} per kg for ${vp.subtype ?? "this kind of food"}: ${verdict(perKg / vp.typicalKg)}.`);
  }
  if (p.packProtein && vp.typicalPpp) {
    const ppp = p.packProtein / unitPrice;
    lines.push(`${Math.round(ppp)}g of protein per £1, against about ${Math.round(vp.typicalPpp)}g for ${vp.pppScope ?? "this kind of food"}: ${ppp >= vp.typicalPpp * 1.15 ? "more than usual" : ppp <= vp.typicalPpp * 0.85 ? "less than usual" : "about usual"}.`);
  }
  if (vp.market && vp.market.mine > 0 && storedPrice) {
    const mine = vp.market.mine * (unitPrice / storedPrice);
    lines.push(`£${mine.toFixed(2)} per 100g of protein, against about £${vp.market.typical.toFixed(2)} across the UK protein powder market.`);
  }
  if (vp.creatineMarket && vp.creatineMarket.mine > 0 && storedPrice) {
    const mine = vp.creatineMarket.mine * (unitPrice / storedPrice);
    lines.push(`£${mine.toFixed(2)} per kg of creatine, against about £${vp.creatineMarket.typical.toFixed(2)} across the UK market.`);
  }
  if (hasOffer && p.regular && unitPrice < p.regular - 0.005) lines.push(`The offer takes ${Math.round((1 - unitPrice / p.regular) * 100)}% off the shelf price (£${p.regular.toFixed(2)}).`);
  else lines.push(hasOffer ? "It has an offer, but that doesn't make it cheaper each." : s.clubcard ? "Not on offer right now." : "Not on offer for you right now (any Clubcard prices are ignored).");
  lines.push(
    s.goal === "protein"
      ? "Your goal is High protein, so protein per £ counts most."
      : s.goal === "cheap"
        ? "Your goal is Cheapest good food, so the price per kg counts most."
        : "Price per kg and protein per £ both count.",
  );
  return lines;
}

export interface Segment {
  text: string;
  hit: boolean;
}

/** Splits an ingredients list so the words that match one of their allergens can be highlighted. */
export function highlightAllergens(text: string, allergens: readonly Allergen[]): Segment[] {
  if (allergens.length === 0 || !text) return [{ text, hit: false }];
  const ranges: [number, number][] = [];
  for (const a of allergens) {
    const re = new RegExp(ALLERGEN_RE[a].source, "gi");
    for (const m of text.matchAll(re)) if (m[0].length > 0 && m.index !== undefined) ranges.push([m.index, m.index + m[0].length]);
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([r[0], r[1]]);
  }
  const out: Segment[] = [];
  let at = 0;
  for (const [a, b] of merged) {
    if (a > at) out.push({ text: text.slice(at, a), hit: false });
    out.push({ text: text.slice(a, b), hit: true });
    at = b;
  }
  if (at < text.length) out.push({ text: text.slice(at), hit: false });
  return out;
}
