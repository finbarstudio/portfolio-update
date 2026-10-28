import NotConnected from "@/components/food-shop/NotConnected";
import SettingsForm from "@/components/food-shop/SettingsForm";
import { gateForSetup } from "@/lib/food-shop/gate";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const g = await gateForSetup();
  if (!g) return <NotConnected />;
  return (
    <div className="fs-page">
      <h1>{g.user.name ? `Hi ${g.user.name}, six quick questions` : "Six quick questions"}</h1>
      <p className="muted">They lean Fit and Value toward what suits you. Only diet and allergies hide anything. Change them any time in Settings.</p>
      <SettingsForm initial={g.settings} wizard />
    </div>
  );
}
