"use client";

import { useState } from "react";
import { ago } from "@/lib/dad-shop/format";
import type { Freshness, Settings } from "@/lib/dad-shop/types";
import { api } from "./api";

type Phase = "idle" | "saving" | "saved" | "error";

interface Draft {
  budget: string;
  people: string;
  protein: string;
}

function toDraft(s: Settings): Draft {
  return { budget: String(s.budget_gbp), people: String(s.people), protein: String(s.protein_g_per_day) };
}

/** Returns an error sentence, or null if all three are fine. */
function check(d: Draft): string | null {
  const budget = Number(d.budget);
  const people = Number(d.people);
  const protein = Number(d.protein);
  if (!d.budget.trim() || !Number.isFinite(budget) || budget < 1 || budget > 1000) return "Budget should be between £1 and £1000.";
  if (!d.people.trim() || !Number.isInteger(people) || people < 1 || people > 10) return "People should be a whole number from 1 to 10.";
  if (!d.protein.trim() || !Number.isInteger(protein) || protein < 20 || protein > 300) return "Protein should be a whole number from 20 to 300 grams.";
  return null;
}

export default function SettingsForm({ settings, freshness, nowIso }: { settings: Settings; freshness: Freshness; nowIso: string }) {
  const now = new Date(nowIso);
  const [draft, setDraft] = useState<Draft>(toDraft(settings));
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const problem = check(draft);
    if (problem) {
      setError(problem);
      setPhase("error");
      return;
    }
    setPhase("saving");
    setError("");
    try {
      const res = await api<{ settings: Settings }>("/settings", {
        method: "POST",
        body: { budget_gbp: Number(draft.budget), people: Number(draft.people), protein_g_per_day: Number(draft.protein) },
      });
      setDraft(toDraft(res.settings));
      setPhase("saved");
    } catch {
      setError("Couldn't save just now. Try again.");
      setPhase("error");
    }
  }

  function field(key: keyof Draft, value: string) {
    setDraft({ ...draft, [key]: value });
    setPhase("idle");
  }

  return (
    <div className="ds-page">
      <header className="ds-head">
        <h1 className="ds-h1">Settings</h1>
      </header>

      <form className="ds-form" onSubmit={save} noValidate>
        <div className="ds-field">
          <label className="ds-label" htmlFor="ds-budget">
            Weekly budget (£)
          </label>
          <input id="ds-budget" className="ds-input" type="number" inputMode="decimal" min={1} max={1000} step="1" value={draft.budget} onChange={(e) => field("budget", e.target.value)} />
        </div>
        <div className="ds-field">
          <label className="ds-label" htmlFor="ds-people">
            People eating
          </label>
          <input id="ds-people" className="ds-input" type="number" inputMode="numeric" min={1} max={10} step="1" value={draft.people} onChange={(e) => field("people", e.target.value)} />
        </div>
        <div className="ds-field">
          <label className="ds-label" htmlFor="ds-protein">
            Protein each day (grams)
          </label>
          <input id="ds-protein" className="ds-input" type="number" inputMode="numeric" min={20} max={300} step="1" value={draft.protein} onChange={(e) => field("protein", e.target.value)} />
        </div>

        <button type="submit" className="ds-btn ds-btn--primary ds-btn--wide" disabled={phase === "saving"}>
          {phase === "saving" ? "Saving…" : "Save"}
        </button>
        <p className={`ds-hint${phase === "error" ? " ds-error" : " ds-muted"}`} role="status">
          {phase === "saved" && "Saved."}
          {phase === "error" && error}
        </p>
      </form>

      <section className="ds-block" aria-label="How fresh the prices are">
        <h2 className="ds-h2">The prices</h2>
        {freshness.lastListed ? (
          <p>
            Prices updated <strong>{ago(freshness.lastListed, now)}</strong>.
          </p>
        ) : (
          <p>No prices have been loaded yet.</p>
        )}
        <p className="ds-muted">
          {freshness.products} food products, {freshness.withDetails} with full ingredients and nutrition.
        </p>
      </section>
    </div>
  );
}
