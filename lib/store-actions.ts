"use server";

import { redirect } from "next/navigation";
import { createCheckoutUrl } from "@/lib/shopify";

/**
 * Server action: create a Shopify cart for the chosen variant and redirect to
 * Shopify's hosted checkout. Used by the Buy form on /store. Runs server-side so
 * the Storefront token never reaches the browser.
 */
export async function startCheckout(formData: FormData) {
  const variantId = String(formData.get("variantId") ?? "");
  if (!variantId) return;
  const url = await createCheckoutUrl(variantId);
  if (url) redirect(url);
}
