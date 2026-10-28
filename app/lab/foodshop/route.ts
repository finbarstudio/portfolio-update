import { getCurrentUser } from "@/lib/food-shop/auth";
import { APP_HTML } from "@/lib/food-shop/clone/app-html.generated";
import { getDb } from "@/lib/food-shop/db";
import { LOGIN_PATH, SETUP_PATH } from "@/lib/food-shop/paths";

export const dynamic = "force-dynamic";

/**
 * The app itself: Finbar's own page, copied in by scripts/food-shop-sync-app.ts, behind the login.
 * Logged out goes to login, not set up yet goes to setup. Everything personal is fetched by the page
 * afterwards (/foodshop/api/app/*), so the HTML is the same for everyone.
 */
export async function GET(): Promise<Response> {
  // relative on purpose: behind proxy.ts the request URL is the rewritten one (no "lab." host)
  const go = (path: string) => new Response(null, { status: 303, headers: { location: path, "cache-control": "no-store" } });
  if (!getDb()) return new Response("The food shop isn't connected to its database yet.", { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } });
  const user = await getCurrentUser();
  if (!user) return go(LOGIN_PATH);
  if (!user.setupDone) return go(SETUP_PATH);
  return new Response(APP_HTML, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
      "x-frame-options": "DENY",
      "referrer-policy": "same-origin",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
