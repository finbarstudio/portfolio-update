/**
 * The pack size shown on a card ("400g", "4 x 330ml", "6 pack"). PURE.
 *
 * Order of trust: a multipack written in the name ("4 x 330ml": the database
 * only holds the total), then the pack weight in the database, then a size
 * written in the name, then a count ("x12"), and last an estimate from the
 * price and the per-kg price (marked with ≈ because the unit price is rounded).
 */

export interface PackInfo {
  /** "400g", "1.5L", "4 x 330ml", "12 pack", "≈510g". */
  text: string;
  /** Worked out from the price, so only roughly right. */
  estimated: boolean;
}

type Unit = "g" | "ml";

function amount(n: number): string {
  return String(+n.toFixed(2));
}

/** 450 => "450g", 1200 => "1.2kg"; ml likewise ("2L"). */
export function sizeText(base: number, unit: Unit): string {
  if (unit === "ml") return base >= 1000 ? `${amount(base / 1000)}L` : `${amount(base)}ml`;
  return base >= 1000 ? `${amount(base / 1000)}kg` : `${amount(base)}g`;
}

function toBase(value: number, unitWord: string): { base: number; unit: Unit } {
  const u = unitWord.toLowerCase();
  if (u === "kg") return { base: value * 1000, unit: "g" };
  if (u === "g") return { base: value, unit: "g" };
  if (u === "ml") return { base: value, unit: "ml" };
  if (u === "cl") return { base: value * 10, unit: "ml" };
  return { base: value * 1000, unit: "ml" };
}

const UNITS = "kg|g|ml|cl|ltr|litres?|liters?|l";
const MULTI = new RegExp(`(\\d{1,3})\\s*x\\s*(\\d+(?:\\.\\d+)?)\\s*(${UNITS})\\b`, "i");
const SINGLE = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${UNITS})\\b(?!\\s*(?:protein|fibre|fiber|sugar|fat|salt))`, "gi");

/** "6 x 45g" => { text: "6 x 45g", base: 270 }. Null when the name has no multipack. */
export function parseMultipack(name: string): { text: string; base: number; unit: Unit } | null {
  const m = name.match(MULTI);
  if (!m) return null;
  const count = Number(m[1]);
  const size = toBase(Number(m[2]), m[3]);
  if (count < 2 || !(size.base > 0)) return null;
  return { text: `${count} x ${sizeText(size.base, size.unit)}`, base: count * size.base, unit: size.unit };
}

/** The last size written in the name ("... Cereal Biscuits x30 675g" => 675g). Null when there is none. */
export function parseSize(name: string): { text: string; base: number; unit: Unit } | null {
  let last: RegExpMatchArray | null = null;
  for (const m of name.matchAll(SINGLE)) last = m;
  if (!last) return null;
  const size = toBase(Number(last[1]), last[2]);
  if (!(size.base > 0)) return null;
  return { text: sizeText(size.base, size.unit), base: size.base, unit: size.unit };
}

/** "x12", "12 x", "Pack of 6", "20 Tea Bags" => the number in the pack. Null when the name has no count. */
export function parseCount(name: string): number | null {
  const patterns = [
    /\bx\s?(\d{1,3})\b/i,
    /\b(\d{1,3})\s?x\b/i,
    /\bpack of (\d{1,3})\b/i,
    /\b(\d{1,3})\s*(?:tea ?bags|capsules|pods|slices|rolls|bars|eggs|pieces|pcs|sachets)\b/i,
  ];
  for (const re of patterns) {
    const m = name.match(re);
    if (m) {
      const n = Number(m[1]);
      if (n >= 2) return n;
    }
  }
  return null;
}

export interface PackInput {
  name: string;
  /** Weight (or ml) of the whole pack from the database. */
  packGrams: number | null;
  /** "kg", "ltr" or "ea": how Sainsbury's prices it per unit. */
  unitMeasure: string | null;
  price: number;
  unitPrice: number | null;
}

export function packInfo(c: PackInput): PackInfo | null {
  const multi = parseMultipack(c.name);
  if (multi) return { text: multi.text, estimated: false };
  const unit: Unit = c.unitMeasure === "ltr" ? "ml" : "g";
  if (c.packGrams != null && c.packGrams > 0) return { text: sizeText(c.packGrams, unit), estimated: false };
  const size = parseSize(c.name);
  if (size) return { text: size.text, estimated: false };
  const count = parseCount(c.name);
  if (count) return { text: `${count} pack`, estimated: false };
  if ((c.unitMeasure === "kg" || c.unitMeasure === "ltr") && c.unitPrice != null && c.unitPrice > 0 && c.price > 0) {
    const raw = (c.price / c.unitPrice) * 1000;
    const rounded = raw >= 100 ? Math.round(raw / 5) * 5 : Math.round(raw);
    if (rounded > 0) return { text: `≈${sizeText(rounded, unit)}`, estimated: true };
  }
  return null;
}
