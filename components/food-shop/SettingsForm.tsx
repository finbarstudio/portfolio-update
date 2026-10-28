"use client";

import { useState } from "react";
import { ALLERGEN_LABELS, APPLIANCE_LABELS, DIET_LABELS, GOAL_LABELS, LEVEL_LABELS, PROTEIN_LEVEL_LABELS, WATCH_LABELS } from "@/lib/food-shop/labels";
import { BASE_PATH } from "@/lib/food-shop/paths";
import { ALLERGENS, APPLIANCES, DIETS, GOAL_PRESETS, GOALS, type Level, normalisePostcode, type Settings } from "@/lib/food-shop/settings";
import { post } from "./api";

const WATCH_KEYS = ["sat", "salt", "sugar", "kcal", "upf"] as const;
const STEPS = ["Postcode", "Goal", "What you watch", "Diet & avoid", "Kitchen & shopping", "Money"] as const;

type Set = (s: Settings) => void;

/** One question per row: the words on the left, a small segmented control on the right (wraps under on a phone). */
function Seg<T extends string | number>({ label, hint, value, options, onChange }: { label: string; hint?: string; value: T; options: readonly { v: T; label: string }[]; onChange: (v: T) => void }) {
  const id = `l-${label.replace(/\W+/g, "-")}`;
  return (
    <div className="fs-row">
      <div className="fs-q">
        <span id={id}>{label}</span>
        {hint && <small className="muted">{hint}</small>}
      </div>
      <div className="fs-seg" role="radiogroup" aria-labelledby={id}>
        {options.map((o) => (
          <button key={String(o.v)} type="button" role="radio" aria-checked={value === o.v} onClick={() => onChange(o.v)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const YES_NO = [
  { v: "yes", label: "Yes" },
  { v: "no", label: "No" },
] as const;

function YesNo({ label, hint, on, onChange }: { label: string; hint?: string; on: boolean; onChange: (v: boolean) => void }) {
  return <Seg label={label} hint={hint} value={on ? "yes" : "no"} options={YES_NO} onChange={(v) => onChange(v === "yes")} />;
}

/** Pick any number: small pills that wrap. */
function Pills<T extends string>({ label, options, names, chosen, onChange }: { label: string; options: readonly T[]; names: Record<T, string>; chosen: readonly T[]; onChange: (v: T[]) => void }) {
  return (
    <div className="fs-block">
      <p className="fs-fh">{label}</p>
      <div className="fs-pills">
        {options.map((o) => (
          <button key={o} type="button" className="fchip" aria-pressed={chosen.includes(o)} onClick={() => onChange(chosen.includes(o) ? chosen.filter((x) => x !== o) : [...chosen, o])}>
            {names[o]}
          </button>
        ))}
      </div>
    </div>
  );
}

function NumberRow({ label, hint, value, range, placeholder, onChange }: { label: string; hint: string; value: number | null; range: [number, number]; placeholder: string; onChange: (v: number | null) => void }) {
  return (
    <label className="fs-row">
      <span className="fs-q">
        <span>{label}</span>
        <small className="muted">{hint}</small>
      </span>
      <input
        className="fs-num"
        type="number"
        inputMode="numeric"
        min={range[0]}
        max={range[1]}
        step={5}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      />
    </label>
  );
}

function PostcodeStep({ s, set }: { s: Settings; set: Set }) {
  const [text, setText] = useState(s.postcode ?? "");
  const bad = text.trim() !== "" && normalisePostcode(text) == null;
  return (
    <section className="fs-card">
      <h2>Where do you live?</h2>
      <p className="muted">So the shop can hide what Tesco doesn&apos;t sell near you. It&apos;s only used for that.</p>
      <label className="fs-row">
        <span className="fs-q">Postcode</span>
        <input
          className="fs-text"
          value={text}
          autoComplete="postal-code"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={10}
          placeholder="BR7 5AG"
          aria-invalid={bad}
          onChange={(e) => {
            setText(e.target.value);
            set({ ...s, postcode: normalisePostcode(e.target.value) });
          }}
        />
      </label>
      {bad && <p className="fs-err">That doesn&apos;t look like a UK postcode yet.</p>}
    </section>
  );
}

function GoalStep({ s, set }: { s: Settings; set: Set }) {
  return (
    <section className="fs-card">
      <h2>What matters most?</h2>
      <p className="muted">A starting point for what you watch. You can fine-tune it next.</p>
      <div className="fs-seg wide" role="radiogroup" aria-label="Goal">
        {GOALS.map((g) => (
          <button key={g} type="button" role="radio" aria-checked={s.goal === g} onClick={() => set({ ...s, goal: g, ...GOAL_PRESETS[g] })}>
            {GOAL_LABELS[g].title}
          </button>
        ))}
      </div>
      <p className="fs-hint">{GOAL_LABELS[s.goal].blurb}</p>
    </section>
  );
}

const levels = (labels: readonly string[]) => labels.map((label, v) => ({ v: v as Level, label }));

function WatchStep({ s, set }: { s: Settings; set: Set }) {
  return (
    <section className="fs-card">
      <h2>What do you keep an eye on?</h2>
      <p className="muted">&quot;A lot&quot; counts double in Fit. These change scores, never what you can see.</p>
      <div className="fs-rows">
        {WATCH_KEYS.map((k) => (
          <Seg key={k} label={WATCH_LABELS[k]} value={s.watch[k]} options={levels(LEVEL_LABELS)} onChange={(v) => set({ ...s, watch: { ...s.watch, [k]: v } })} />
        ))}
        <Seg label="Protein" value={s.protein} options={levels(PROTEIN_LEVEL_LABELS)} onChange={(v) => set({ ...s, protein: v })} />
        <NumberRow label="Protein a day" hint="grams, optional" value={s.proteinTarget} range={[20, 300]} placeholder="100" onChange={(v) => set({ ...s, proteinTarget: v })} />
      </div>
    </section>
  );
}

function DietStep({ s, set }: { s: Settings; set: Set }) {
  return (
    <section className="fs-card">
      <h2>Diet and things to avoid</h2>
      <div className="fs-seg wide" role="radiogroup" aria-label="Diet">
        {DIETS.map((d) => (
          <button key={d} type="button" role="radio" aria-checked={s.diet === d} onClick={() => set({ ...s, diet: d })}>
            {DIET_LABELS[d]}
          </button>
        ))}
      </div>
      <div className="fs-rows">
        <YesNo label="Eat pork?" on={!s.noPork} onChange={(v) => set({ ...s, noPork: !v })} />
        <YesNo label="Eat beef?" on={!s.noBeef} onChange={(v) => set({ ...s, noBeef: !v })} />
      </div>
      <Pills label="Allergies" options={ALLERGENS} names={ALLERGEN_LABELS} chosen={s.allergens} onChange={(v) => set({ ...s, allergens: v })} />
      <p className="fs-hint">
        Products with these are hidden. If the ingredients aren&apos;t known yet the product says <b>Check label</b>. With an allergy, always check the pack too.
      </p>
    </section>
  );
}

function KitchenStep({ s, set }: { s: Settings; set: Set }) {
  const buys = (k: keyof Settings["buys"]) => (v: boolean) => set({ ...s, buys: { ...s.buys, [k]: v } });
  return (
    <section className="fs-card">
      <h2>Your kitchen and shopping</h2>
      <p className="muted">Leanings, not rules: these tilt the scores toward what suits you. Nothing is hidden because of them.</p>
      <Pills label="What do you cook with?" options={APPLIANCES} names={APPLIANCE_LABELS} chosen={s.appliances} onChange={(v) => set({ ...s, appliances: v })} />
      <div className="fs-rows">
        <Seg
          label="Cooking"
          value={s.cooking}
          options={[
            { v: "ready", label: "Quick & ready" },
            { v: "scratch", label: "From scratch" },
          ]}
          onChange={(v) => set({ ...s, cooking: v })}
        />
        <YesNo label="Do you buy frozen food?" on={s.buys.frozen} onChange={buys("frozen")} />
        <YesNo label="Do you buy fresh food?" on={s.buys.fresh} onChange={buys("fresh")} />
        <YesNo label="Do you buy fresh food to freeze yourself?" hint="e.g. mince or chicken straight into the freezer" on={s.buys.freezeFresh} onChange={buys("freezeFresh")} />
      </div>
    </section>
  );
}

function MoneyStep({ s, set }: { s: Settings; set: Set }) {
  return (
    <section className="fs-card">
      <h2>Money</h2>
      <div className="fs-rows">
        <YesNo label="Tesco Clubcard?" hint="No: Clubcard prices and deals are left out" on={s.clubcard} onChange={(v) => set({ ...s, clubcard: v })} />
        <NumberRow label="Weekly budget" hint="£, optional" value={s.budget} range={[5, 1000]} placeholder="75" onChange={(v) => set({ ...s, budget: v })} />
      </div>
    </section>
  );
}

const STEP_VIEWS = [PostcodeStep, GoalStep, WatchStep, DietStep, KitchenStep, MoneyStep];

/** Setup (one step at a time) and Settings (all on one page) share these questions, so they can't drift. */
export default function SettingsForm({ initial, wizard }: { initial: Settings; wizard: boolean }) {
  const [s, set] = useState(initial);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    setBusy(true);
    setMsg(null);
    const err = await post("settings", { settings: s });
    if (err) {
      setBusy(false);
      setMsg({ ok: false, text: err });
      return;
    }
    if (wizard) {
      window.location.href = BASE_PATH;
      return;
    }
    setBusy(false);
    setMsg({ ok: true, text: "Saved. The shop uses it next time it opens." });
  }

  const message = msg && (
    <p className={msg.ok ? "fs-ok" : "fs-err"} role={msg.ok ? "status" : "alert"}>
      {msg.text}
    </p>
  );

  if (!wizard) {
    return (
      <div className="fs-stack">
        {STEP_VIEWS.map((View, i) => (
          <View key={STEPS[i]} s={s} set={set} />
        ))}
        <div className="fs-actions sticky">
          {message}
          <button type="button" className="fs-btn primary" disabled={busy || !s.postcode} onClick={save}>
            {busy ? "Saving…" : "Save settings"}
          </button>
        </div>
      </div>
    );
  }

  const View = STEP_VIEWS[step];
  const last = step === STEPS.length - 1;
  return (
    <div className="fs-stack">
      <View s={s} set={set} />
      {message}
      <div className="fs-actions">
        <span className="fs-progress" aria-live="polite">
          Step {step + 1} of {STEPS.length}
          <span className="fs-dots" aria-hidden="true">
            {STEPS.map((name, i) => (
              <i key={name} className={i === step ? "on" : i < step ? "done" : ""} />
            ))}
          </span>
        </span>
        {step > 0 && (
          <button type="button" className="pbtn" disabled={busy} onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        <button type="button" className="fs-btn primary" disabled={busy || (step === 0 && !s.postcode)} onClick={() => (last ? save() : setStep(step + 1))}>
          {busy ? "One moment…" : last ? "Open the shop" : "Next"}
        </button>
      </div>
    </div>
  );
}
