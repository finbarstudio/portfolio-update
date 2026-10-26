import { notFound } from "next/navigation";
import NotConnected from "@/components/dad-shop/NotConnected";
import ProductSheet from "@/components/dad-shop/ProductSheet";
import { nowIso } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { getProduct } from "@/lib/dad-shop/queries";
import { parseProductId } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

/** One product: how it suits him, the nutrition, the ingredients, his rating. */
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const sql = getDb();
  if (!sql) return <NotConnected />;

  const { id } = await params;
  const valid = parseProductId(id);
  if (!valid.ok) notFound();

  const product = await getProduct(sql, valid.value);
  if (!product) notFound();

  // key: moving from one product to another must not carry over the last one's rating state.
  return <ProductSheet key={product.id} product={product} nowIso={nowIso()} />;
}
