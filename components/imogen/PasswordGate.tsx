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
        <p className="im-eyebrow">A little guide</p>
        <h1 className="im-lock-title im-serif">Hey Imogen</h1>
        <p className="im-lock-sub">This one&apos;s just for you. Pop in the password to come in.</p>
        <input
          className="im-lock-input"
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
        {err && <p className="im-lock-err">Not quite, try again.</p>}
        <p className="im-lock-hint">Finbar sent you the word.</p>
      </form>
    </div>
  );
}
