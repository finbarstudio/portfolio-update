"use server";

import { redirect } from "next/navigation";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";
import { subscribeEmail, isMailerliteConfigured } from "@/lib/mailerlite";

/**
 * Server action: create a Lemon Squeezy checkout and redirect to its hosted,
 * tax-handled checkout. Used by the Buy form on /store.
 */
export async function startCheckout() {
  const url = await createCheckoutUrl();
  if (url) redirect(url);
}

export type WaitlistState = { status: "idle" | "success" | "exists" | "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server action (useActionState): validate the email + explicit consent, then
 * add the address to the MailerLite launch list. GDPR: the consent checkbox must
 * be ticked (lawful basis = consent).
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
  if (!isMailerliteConfigured()) {
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
