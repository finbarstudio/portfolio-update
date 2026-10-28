import { wholeDocHandlers } from "@/lib/dad-shop/app-routes";

export const dynamic = "force-dynamic";

/** What he took out of the basket, with the reason: `{ [productId]: {...} }`. */
const doc = wholeDocHandlers("removals");
export const GET = doc.GET;
export const POST = doc.POST;
