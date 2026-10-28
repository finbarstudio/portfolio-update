import AccountPanel from "@/components/food-shop/AccountPanel";
import NotConnected from "@/components/food-shop/NotConnected";
import SettingsForm from "@/components/food-shop/SettingsForm";
import { gate } from "@/lib/food-shop/gate";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const g = await gate();
  if (!g) return <NotConnected />;
  return (
    <div className="fs-page">
      <h1>Settings</h1>
      <p className="muted">These lean Fit and Value toward what suits you. Only diet and allergies hide products.</p>
      <SettingsForm initial={g.settings} wizard={false} />
      <AccountPanel email={g.user.email} name={g.user.name} />
    </div>
  );
}
