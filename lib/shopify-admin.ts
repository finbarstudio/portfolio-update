/**
 * Shopify Admin API client (server-only) for the launch waitlist.
 *
 * Creates a Shopify customer with single-opt-in email-marketing consent, so
 * signups land in your Shopify customer list / marketing audience with a
 * recorded consent timestamp (the GDPR lawful basis here is consent).
 *
 * Needs, in addition to SHOPIFY_STORE_DOMAIN:
 *   SHOPIFY_ADMIN_ACCESS_TOKEN  Admin API access token with `write_customers`.
 *
 * Inert until that's set: subscribeEmail returns { ok:false, reason:"unconfigured" }.
 */

import "server-only";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = "2024-10";
const WAITLIST_TAG = "plugin-waitlist";

export function isAdminConfigured(): boolean {
  return Boolean(DOMAIN && ADMIN_TOKEN);
}

type SubscribeResult =
  | { ok: true; alreadySubscribed?: boolean }
  | { ok: false; reason: "unconfigured" | "invalid" | "error"; message?: string };

const CUSTOMER_CREATE = /* GraphQL */ `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

type CustomerCreateData = {
  customerCreate: {
    customer: { id: string } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
};

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  if (!DOMAIN || !ADMIN_TOKEN) return { ok: false, reason: "unconfigured" };

  const input = {
    email,
    tags: [WAITLIST_TAG],
    emailMarketingConsent: {
      marketingState: "SUBSCRIBED",
      marketingOptInLevel: "SINGLE_OPT_IN",
      consentUpdatedAt: new Date().toISOString(),
    },
  };

  try {
    const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ADMIN_TOKEN,
      },
      body: JSON.stringify({ query: CUSTOMER_CREATE, variables: { input } }),
      cache: "no-store",
    });

    if (!res.ok) return { ok: false, reason: "error", message: `HTTP ${res.status}` };

    const json = (await res.json()) as { data?: CustomerCreateData; errors?: { message: string }[] };
    if (json.errors?.length) return { ok: false, reason: "error", message: json.errors[0].message };

    const errs = json.data?.customerCreate.userErrors ?? [];
    if (errs.length) {
      // An existing customer (email taken) means they're effectively already on
      // the list — treat as success rather than surfacing an error.
      if (errs.some((e) => /taken|already/i.test(e.message))) {
        return { ok: true, alreadySubscribed: true };
      }
      return { ok: false, reason: "error", message: errs[0].message };
    }

    return { ok: true };
  } catch (err) {
    console.error("Shopify customer create failed:", err);
    return { ok: false, reason: "error" };
  }
}
