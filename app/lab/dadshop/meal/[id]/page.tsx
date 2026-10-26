import { notFound } from "next/navigation";
import MealDealPage from "@/components/dad-shop/MealDealPage";
import NotConnected from "@/components/dad-shop/NotConnected";
import { nowIso } from "@/lib/dad-shop/api";
import { getDealPage, getList } from "@/lib/dad-shop/catalog";
import { getDb } from "@/lib/dad-shop/db";
import { parseProductId } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

/** A dinner meal deal, laid out one part at a time. */
export default async function MealPage({ params }: { params: Promise<{ id: string }> }) {
  const sql = getDb();
  if (!sql) return <NotConnected />;

  const { id } = await params;
  const valid = parseProductId(id);
  if (!valid.ok) notFound();

  const [page, list] = await Promise.all([getDealPage(sql, valid.value), getList(sql)]);
  if (!page) notFound();
  return <MealDealPage key={page.deal.id} page={page} list={list} nowIso={nowIso()} />;
}
