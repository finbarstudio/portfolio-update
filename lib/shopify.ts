/**
 * Minimal Shopify Storefront API client (server-only).
 *
 * Reads credentials from env so nothing secret ships to the browser:
 *   SHOPIFY_STORE_DOMAIN            e.g. your-store.myshopify.com
 *   SHOPIFY_STOREFRONT_ACCESS_TOKEN  public Storefront API token
 *   SHOPIFY_PRODUCT_HANDLE           (optional) product handle; falls back to
 *                                    the handle in content/store.ts
 *
 * When the env vars aren't set the store renders a "coming soon" state, so the
 * page is fully built and flips live the moment the keys are added in Vercel.
 */

import "server-only";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = "2024-10";

export function isShopifyConfigured(): boolean {
  return Boolean(DOMAIN && TOKEN);
}

export type ShopifyProduct = {
  id: string;
  title: string;
  descriptionHtml: string;
  image: { url: string; altText: string | null; width: number; height: number } | null;
  price: { amount: string; currencyCode: string };
  variantId: string | null;
  availableForSale: boolean;
};

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

async function shopifyFetch<T>(query: string, variables: Record<string, unknown>, cache: RequestCache = "force-cache"): Promise<T | null> {
  if (!DOMAIN || !TOKEN) return null;
  try {
    const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: cache === "force-cache" ? { revalidate: 600 } : undefined,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as GraphQLResponse<T>;
    if (json.errors?.length) {
      console.error("Shopify error:", json.errors.map((e) => e.message).join("; "));
      return null;
    }
    return json.data ?? null;
  } catch (err) {
    console.error("Shopify fetch failed:", err);
    return null;
  }
}

const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      descriptionHtml
      featuredImage { url altText width height }
      priceRange { minVariantPrice { amount currencyCode } }
      variants(first: 1) {
        edges { node { id availableForSale price { amount currencyCode } } }
      }
    }
  }
`;

type ProductData = {
  product: {
    id: string;
    title: string;
    descriptionHtml: string;
    featuredImage: { url: string; altText: string | null; width: number; height: number } | null;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    variants: { edges: { node: { id: string; availableForSale: boolean; price: { amount: string; currencyCode: string } } }[] };
  } | null;
};

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<ProductData>(PRODUCT_QUERY, { handle });
  const p = data?.product;
  if (!p) return null;
  const variant = p.variants.edges[0]?.node ?? null;
  return {
    id: p.id,
    title: p.title,
    descriptionHtml: p.descriptionHtml,
    image: p.featuredImage,
    price: variant?.price ?? p.priceRange.minVariantPrice,
    variantId: variant?.id ?? null,
    availableForSale: variant?.availableForSale ?? false,
  };
}

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { message }
    }
  }
`;

type CartData = { cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } };

/** Create a single-item cart and return Shopify's hosted checkout URL. */
export async function createCheckoutUrl(variantId: string): Promise<string | null> {
  const data = await shopifyFetch<CartData>(
    CART_CREATE,
    { lines: [{ merchandiseId: variantId, quantity: 1 }] },
    "no-store"
  );
  return data?.cartCreate.cart?.checkoutUrl ?? null;
}

/** Format a Shopify money object for display, e.g. "$29.00". */
export function formatPrice(amount: string, currencyCode: string): string {
  const n = Number(amount);
  try {
    return new Intl.NumberFormat("en-AU", { style: "currency", currency: currencyCode }).format(n);
  } catch {
    return `${currencyCode} ${n.toFixed(2)}`;
  }
}
