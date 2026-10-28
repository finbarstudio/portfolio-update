import { redirect } from "next/navigation";
import LoginForm from "@/components/food-shop/LoginForm";
import NotConnected from "@/components/food-shop/NotConnected";
import { whoIsHere } from "@/lib/food-shop/gate";
import { BASE_PATH, SETUP_PATH } from "@/lib/food-shop/paths";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const here = await whoIsHere();
  if (here === "offline") return <NotConnected />;
  if (here) redirect(here.user.setupDone ? BASE_PATH : SETUP_PATH);
  const sp = await searchParams;
  const raw = sp.invite;
  const invite = typeof raw === "string" ? raw.trim().slice(0, 40) : null;
  return (
    <div className="fs-page">
      <h1>Welcome</h1>
      <p className="muted">Tesco offers and everyday picks, scored for what you care about. A beta for friends: you need an invite code to join.</p>
      {sp.deleted === "1" && (
        <p className="fs-ok" role="status">
          Your account and everything in it has been deleted.
        </p>
      )}
      <LoginForm invite={invite || null} />
    </div>
  );
}
