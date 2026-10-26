import { notFound, redirect } from "next/navigation";
import DealManager from "@/components/dad-shop/DealManager";
import NotConnected from "@/components/dad-shop/NotConnected";
import { nowIso } from "@/lib/dad-shop/api";
import { getList, getOffer } from "@/lib/dad-shop/catalog";
import { getDb } from "@/lib/dad-shop/db";
import { BASE_PATH } from "@/lib/dad-shop/types";
import { parseProductId } from "@/lib/dad-shop/validate";

export const dynamic = "force-dynamic";

/** The deal manager: every product sharing one offer, with his picks first. */
export default async function OfferPage({ params }: { params: Promise<{ uid: string }> }) {
  const sql = getDb();
  if (!sql) return <NotConnected />;

  const { uid } = await params;
  const valid = parseProductId(uid);
  if (!valid.ok) notFound();

  // A dinner meal deal has its own page to build it on.
  const meal = await sql<{ id: string }[]>`select id from deals where id = ${valid.value}`;
  if (meal.length > 0) redirect(`${BASE_PATH}/meal/${encodeURIComponent(valid.value)}`);

  const [offer, list] = await Promise.all([getOffer(sql, valid.value), getList(sql)]);
  if (!offer) notFound();
  return <DealManager key={offer.uid} offer={offer} list={list} nowIso={nowIso()} />;
}
