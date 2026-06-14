/**
 * MailerLite client (server-only) for the launch waitlist.
 *
 * Free up to 1,000 subscribers, and it lets you actually email the list at
 * launch. We add the subscriber (single opt-in; consent recorded in the form)
 * to an optional group. Inert until set:
 *   MAILERLITE_API_KEY   API token (Integrations → API)
 *   MAILERLITE_GROUP_ID  (optional) group to tag waitlist signups
 */

import "server-only";

const KEY = process.env.MAILERLITE_API_KEY;
const GROUP_ID = process.env.MAILERLITE_GROUP_ID;

export function isMailerliteConfigured(): boolean {
  return Boolean(KEY);
}

type SubscribeResult =
  | { ok: true; alreadySubscribed?: boolean }
  | { ok: false; reason: "unconfigured" | "error"; message?: string };

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  if (!KEY) return { ok: false, reason: "unconfigured" };
  try {
    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${KEY}`,
      },
      cache: "no-store",
      body: JSON.stringify({
        email,
        ...(GROUP_ID ? { groups: [GROUP_ID] } : {}),
      }),
    });

    // 200 = updated existing, 201 = created. Both are success.
    if (res.status === 200) return { ok: true, alreadySubscribed: true };
    if (res.ok) return { ok: true };

    const body = await res.json().catch(() => ({}));
    return { ok: false, reason: "error", message: body?.message ?? `HTTP ${res.status}` };
  } catch (err) {
    console.error("MailerLite subscribe failed:", err);
    return { ok: false, reason: "error" };
  }
}
