"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";

/**
 * PasswordGate — a soft lock on the /imogen page. Holds the content back behind a
 * password ("love"); once entered it's remembered on the device (localStorage),
 * so Imogen types it once. This is a casual gate to keep the page private, not
 * hard security: the content still ships in the page payload. For real protection
 * we'd gate it server-side.
 */
const KEY = "imogen-unlocked";
const PASSWORD = "love";

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") setUnlocked(true);
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
    <div className="im-lock">
      <form className="im-lock-card" onSubmit={submit}>
        <input
          className={`im-lock-input ${err ? "is-err" : ""}`}
          type="password"
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setErr(false);
          }}
          placeholder="Password"
          autoFocus
          aria-label="Password"
        />
        <button className="im-lock-btn" type="submit">
          Enter
        </button>
      </form>
    </div>
  );
}
