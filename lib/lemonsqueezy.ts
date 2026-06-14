/**
 * Lemon Squeezy client (server-only) for the plugin store.
 *
 * Lemon Squeezy is a merchant of record — it handles global sales tax / VAT / GST
 * and the hosted, PCI-compliant checkout. We fetch the product for display and
 * create a checkout URL to redirect to. Inert until the env vars are set:
 *   LEMONSQUEEZY_API_KEY     API key (Settings → API)
 *   LEMONSQUEEZY_STORE_ID    numeric store id
 *   LEMONSQUEEZY_VARIANT_ID  the plugin's variant id (Product → variant)
 */

import "server-only";

const API = "https://api.lemonsqueezy.com/v1";
const KEY = process.env.LEMONSQUEEZY_API_KEY;
const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;
const VARIANT_ID = process.env.LEMONSQUEEZY_VARIANT_ID;

export function isLemonConfigured(): boolean {
  return Boolean(KEY && STORE_ID && VARIANT_ID);
}

const headers = () => ({
  Accept: "application/vnd.api+json",
  "Content-Type": "application/vnd.api+json",
  Authorization: `Bearer ${KEY}`,
});

export type StoreProduct = {
  name: string;
  priceFormatted: string;
  descriptionHtml: string;
  available: boolean;
};

/** Fetch the variant (+ its product) for display. */
export async function getProduct(): Promise<StoreProduct | null> {
  if (!isLemonConfigured()) return null;
  try {
    const res = await fetch(`${API}/variants/${VARIANT_ID}?include=product`, {
      headers: headers(),
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const variant = json?.data?.attributes ?? {};
    const product = (json?.included ?? []).find((i: { type: string }) => i.type === "products")?.attributes ?? {};
    return {
      name: product.name ?? variant.name ?? "",
      priceFormatted: product.price_formatted ?? "",
      descriptionHtml: product.description ?? "",
      available: variant.status === "published",
    };
  } catch (err) {
    console.error("Lemon Squeezy product fetch failed:", err);
    return null;
  }
}

/** Create a checkout and return its hosted URL. */
export async function createCheckoutUrl(): Promise<string | null> {
  if (!isLemonConfigured()) return null;
  try {
    const res = await fetch(`${API}/checkouts`, {
      method: "POST",
      headers: headers(),
      cache: "no-store",
      body: JSON.stringify({
        data: {
          type: "checkouts",
          relationships: {
            store: { data: { type: "stores", id: String(STORE_ID) } },
            variant: { data: { type: "variants", id: String(VARIANT_ID) } },
          },
        },
      }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.attributes?.url ?? null;
  } catch (err) {
    console.error("Lemon Squeezy checkout failed:", err);
    return null;
  }
}
