import NotConnected from "@/components/dad-shop/NotConnected";
import SettingsForm from "@/components/dad-shop/SettingsForm";
import { nowIso } from "@/lib/dad-shop/api";
import { getDb } from "@/lib/dad-shop/db";
import { getFreshness, getSettings } from "@/lib/dad-shop/queries";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const sql = getDb();
  if (!sql) return <NotConnected />;

  const [settings, freshness] = await Promise.all([getSettings(sql), getFreshness(sql)]);
  return <SettingsForm settings={settings} freshness={freshness} nowIso={nowIso()} />;
}
