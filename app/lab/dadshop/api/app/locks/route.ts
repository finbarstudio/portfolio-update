import { wholeDocHandlers } from "@/lib/dad-shop/app-routes";

export const dynamic = "force-dynamic";

/** Deals he is happy with: `{ [offerLabel]: { offer, lockedAt, items: { id: qty } } }`, kept when the basket is rebuilt. */
const doc = wholeDocHandlers("locks");
export const GET = doc.GET;
export const POST = doc.POST;
