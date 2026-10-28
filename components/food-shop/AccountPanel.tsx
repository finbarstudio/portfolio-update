"use client";

import { useState } from "react";
import { BASE_PATH, LOGIN_PATH, PRIVACY_PATH } from "@/lib/food-shop/paths";
import { post } from "./api";

/** Settings → Account: who's logged in, log out, download everything stored, delete the account. */
export default function AccountPanel({ email, name }: { email: string; name: string | null }) {
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function logout() {
    setBusy(true);
    await post("auth/logout", {});
    window.location.href = LOGIN_PATH;
  }

  async function remove(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_PATH}/api/account`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: new FormData(e.currentTarget).get("password") }),
      });
      if (res.ok) {
        window.location.href = `${LOGIN_PATH}?deleted=1`;
        return;
      }
      setError(((await res.json().catch(() => null)) as { error?: string } | null)?.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Couldn't reach the shop. Check your connection and try again.");
    }
    setBusy(false);
  }

  return (
    <section className="fs-card">
      <h2>Account</h2>
      <div className="fs-rows">
        <div className="fs-row">
          <div className="fs-q">
            <span>{name ?? "Logged in"}</span>
            <small className="muted">{email}</small>
          </div>
          <button type="button" className="pbtn" disabled={busy} onClick={logout}>
            Log out
          </button>
        </div>
        <div className="fs-row">
          <div className="fs-q">
            <span>Your data</span>
            <small className="muted">
              Everything stored about you, as a file. <a href={PRIVACY_PATH}>Privacy</a>
            </small>
          </div>
          <a className="pbtn" href={`${BASE_PATH}/api/account`} download>
            Download
          </a>
        </div>
        <div className="fs-row">
          <div className="fs-q">
            <span>Delete account</span>
            <small className="muted">Removes your account, settings, basket, ratings and past shops for good.</small>
          </div>
          {!deleting && (
            <button type="button" className="pbtn danger" onClick={() => setDeleting(true)}>
              Delete…
            </button>
          )}
        </div>
        {deleting && (
          <form className="fs-confirm" onSubmit={remove}>
            <label>
              Enter your password to delete everything. This can&apos;t be undone.
              <input name="password" type="password" required autoComplete="current-password" maxLength={200} />
            </label>
            {error && (
              <p className="fs-err" role="alert">
                {error}
              </p>
            )}
            <div className="fs-actions">
              <button type="button" className="pbtn" disabled={busy} onClick={() => (setDeleting(false), setError(null))}>
                Cancel
              </button>
              <button type="submit" className="fs-btn danger" disabled={busy}>
                {busy ? "Deleting…" : "Delete my account"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
