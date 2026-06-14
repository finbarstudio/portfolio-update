"use client";

/**
 * WaitlistForm — launch email capture for the store. Email + an explicit,
 * unticked consent checkbox linking the privacy policy (GDPR: consent is the
 * lawful basis). Submits to the subscribeToWaitlist server action, which adds a
 * single-opt-in marketing customer in Shopify. Progressive: works without JS;
 * with JS it shows pending + result inline.
 */

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { subscribeToWaitlist, type WaitlistState } from "@/lib/store-actions";

const initial: WaitlistState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="store-buy" disabled={pending} aria-disabled={pending}>
      {pending ? "Adding…" : "Notify me at launch"}
    </button>
  );
}

export default function WaitlistForm() {
  const [state, formAction] = useActionState(subscribeToWaitlist, initial);
  const done = state.status === "success" || state.status === "exists";

  if (done) {
    return (
      <p className="waitlist-done" role="status">
        <span className="status-dot" aria-hidden="true" /> {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="waitlist-form" noValidate>
      <div className="waitlist-row">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          aria-label="Email address"
          className="waitlist-input"
        />
        <SubmitButton />
      </div>

      <label className="waitlist-consent">
        <input type="checkbox" name="consent" value="yes" required />
        <span>
          Email me once, when the plugin launches. I agree to my email being stored for this, per the{" "}
          <Link href="/privacy" className="waitlist-link">privacy policy</Link>.
        </span>
      </label>

      {state.status === "error" && (
        <p className="waitlist-error" role="alert">{state.message}</p>
      )}
    </form>
  );
}
