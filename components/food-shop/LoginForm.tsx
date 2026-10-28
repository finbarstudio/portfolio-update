"use client";

import { useState } from "react";
import { BASE_PATH, PRIVACY_PATH, SETUP_PATH } from "@/lib/food-shop/paths";

type Mode = "login" | "signup";

/** Log in, or make an account with an invite code. An invite link (?invite=…) opens on Create account. */
export default function LoginForm({ invite }: { invite: string | null }) {
  const [mode, setMode] = useState<Mode>(invite ? "signup" : "login");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body =
      mode === "login"
        ? { email: f.get("email"), password: f.get("password") }
        : { email: f.get("email"), password: f.get("password"), name: f.get("name"), invite: f.get("invite") };
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_PATH}/api/auth/${mode}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = (await res.json().catch(() => ({}))) as { error?: string; setupDone?: boolean };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }
      window.location.href = data.setupDone ? BASE_PATH : SETUP_PATH;
    } catch {
      setError("Couldn't reach the shop. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <div className="fs-card fs-auth">
      <div className="fs-seg wide" role="tablist" aria-label="Log in or create an account">
        <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => (setMode("login"), setError(null))}>
          Log in
        </button>
        <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => (setMode("signup"), setError(null))}>
          Create account
        </button>
      </div>
      <form onSubmit={submit} className="fs-form" key={mode}>
        {mode === "signup" && (
          <>
            <label>
              Invite code
              <input name="invite" required defaultValue={invite ?? ""} autoComplete="off" autoCapitalize="none" spellCheck={false} />
            </label>
            <label>
              <span>
                Your first name <span className="muted">(optional)</span>
              </span>
              <input name="name" autoComplete="given-name" maxLength={60} />
            </label>
          </>
        )}
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" autoCapitalize="none" spellCheck={false} />
        </label>
        <label>
          <span>Password {mode === "signup" && <span className="muted">(10+ characters; three random words works well)</span>}</span>
          <input name="password" type="password" required minLength={mode === "signup" ? 10 : 1} maxLength={200} autoComplete={mode === "login" ? "current-password" : "new-password"} />
        </label>
        {error && (
          <p className="fs-err" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="fs-btn primary" disabled={busy}>
          {busy ? "One moment…" : mode === "login" ? "Log in" : "Create account"}
        </button>
        {mode === "login" ? (
          <p className="muted small">Forgotten your password? Ask Finbar to reset it.</p>
        ) : (
          <p className="muted small">
            Your email, password (scrambled, never readable) and shopping settings are stored to run your account. Nothing is shared or sold.{" "}
            <a href={PRIVACY_PATH}>How your data is used</a>
          </p>
        )}
      </form>
    </div>
  );
}
