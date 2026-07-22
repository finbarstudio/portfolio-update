"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";

/**
 * PricingGate — a soft lock on /pricing (the imogen PasswordGate pattern).
 * Password "workwithme", case-insensitive; remembered per-device in
 * localStorage so a partner types it once. A casual gate to keep rates off
 * the open web, not hard security — the content still ships in the payload.
 */
const KEY = "pricing-unlocked";
const PASSWORD = "workwithme";

export default function PricingGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    try {
      // ?key=workwithme unlocks directly — lets the deck travel as ONE link
      // with the password baked in, and lets a headless browser print the PDF.
      const key = new URLSearchParams(window.location.search).get("key");
      if (key && key.trim().toLowerCase() === PASSWORD) {
        localStorage.setItem(KEY, "1");
        setUnlocked(true);
      } else if (localStorage.getItem(KEY) === "1") {
        setUnlocked(true);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (val.trim().toLowerCase() === PASSWORD) {
      try {
        localStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
    } else {
      setErr(true);
    }
  };

  return (
    <div className="prg">
      <form className="prg-card" onSubmit={submit}>
        <p className="prg-label">Rates are shared by link</p>
        <div className="prg-row">
          <input
            className={`prg-input ${err ? "is-err" : ""}`}
            type="password"
            value={val}
            onChange={(e) => { setVal(e.target.value); setErr(false); }}
            placeholder="Password"
            autoFocus
            aria-label="Password"
          />
          <button className="prg-btn" type="submit">Enter</button>
        </div>
      </form>
    </div>
  );
}
