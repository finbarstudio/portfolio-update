import { wholeDocHandlers } from "@/lib/dad-shop/app-routes";

export const dynamic = "force-dynamic";

/** His 1-10 fit ratings: `{ [productId]: { fit, name, at } }`. Seeded from his old star ratings the first time. */
const doc = wholeDocHandlers("ratings");
export const GET = doc.GET;
export const POST = doc.POST;
