"use server";

import { redirect } from "next/navigation";
import { createCheckoutUrl } from "@/lib/shopify";
import { subscribeEmail, isAdminConfigured } from "@/lib/shopify-admin";

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

export type WaitlistState = { status: "idle" | "success" | "exists" | "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server action (useActionState): validate the email + explicit consent, then
 * add the address to Shopify as a single-opt-in marketing customer. GDPR: the
 * consent checkbox must be ticked (lawful basis = consent); we record nothing
 * beyond the email + Shopify's consent timestamp.
 */
export async function subscribeToWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const consent = formData.get("consent");

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }
  if (!consent) {
    return { status: "error", message: "Please tick the box to give consent." };
  }
  if (!isAdminConfigured()) {
    return { status: "error", message: "Signups aren't open yet — email finbar@finbar.studio and I'll add you." };
  }

  const result = await subscribeEmail(email);
  if (result.ok) {
    return result.alreadySubscribed
      ? { status: "exists", message: "You're already on the list — thanks." }
      : { status: "success", message: "You're on the list. I'll email you at launch." };
  }
  return { status: "error", message: "Something went wrong. Please try again, or email finbar@finbar.studio." };
}
