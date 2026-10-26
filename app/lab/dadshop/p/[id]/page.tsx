import { notFound } from "next/navigation";
import NotConnected from "@/components/dad-shop/NotConnected";
import ProductSheet from "@/components/dad-shop/ProductSheet";
import { nowIso } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { getList, getProduct, getSimilarSection } from "@/lib/dad-shop/catalog";
import { parseProductId, parseSimilarParams } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

/** One product: how it suits him, the nutrition, the ingredients, his rating. */
export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sql = getDb();
  if (!sql) return <NotConnected />;

  const { id } = await params;
  const valid = parseProductId(id);
  if (!valid.ok) notFound();

  const filters = parseSimilarParams(await searchParams);
  const [product, similar, list] = await Promise.all([getProduct(sql, valid.value), getSimilarSection(sql, valid.value, filters), getList(sql)]);
  if (!product) notFound();

  // key: moving from one product to another must not carry over the last one's rating state.
  return <ProductSheet key={product.id} product={product} similar={similar} filters={filters} list={list} nowIso={nowIso()} />;
}
