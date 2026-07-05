"use client";

import { useActionState } from "react";
import { unlock } from "./actions";

// The on-screen lock for /builders: shown by the page when the auth cookie is
// missing, so none of the outreach content ever reaches the browser unlocked.
export default function Gate() {
  const [state, formAction, pending] = useActionState(unlock, null);

  return (
    <div className="px-5 md:px-10 pb-24">
      <section className="pt-[14svh] md:pt-[18svh]">
        <p className="mono-label text-pink mb-6">Private index</p>
        <h1 className="home-display-sm max-w-[20ch]">Password, please.</h1>
        <form action={formAction} className="mt-8 flex flex-wrap items-center gap-3 max-w-[40ch]">
          <input
            type="password"
            name="password"
            autoFocus
            autoComplete="current-password"
            aria-label="Password"
            placeholder="Password"
            className="border border-line bg-transparent px-4 py-2.5 text-ink outline-none focus:border-pink flex-1 min-w-[14rem]"
            style={{ fontSize: "0.95rem" }}
          />
          <button
            type="submit"
            disabled={pending}
            className="mono-label border border-ink px-5 py-3 text-ink hover:bg-ink hover:text-bg transition-colors disabled:opacity-50"
          >
            {pending ? "Checking…" : "Enter"}
          </button>
        </form>
        {state?.error && (
          <p className="mono-label text-pink mt-4" role="alert">{state.error}</p>
        )}
      </section>
    </div>
  );
}
