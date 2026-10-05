"use client";

import { useEffect, useState } from "react";

/**
 * The light / dark switch in /portfolio's nav, where the main site has the lab
 * switch. It looks the same (the .lab-switch track and knob) but only changes
 * this page's theme: it sets data-pf-theme on <html>, which portfolio.css
 * reads, and remembers the choice on this device. Dark is the default.
 * A script in app/portfolio/layout.tsx applies a saved choice before first
 * paint, so a light-mode visitor never sees a dark flash.
 */
const KEY = "pf-theme";

function Sun() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M5.300 18.700l2.100-2.100M16.600 7.400l2.100-2.100" />
    </svg>
  );
}
function Moon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 14.500A8.500 8.500 0 0 1 9.500 4a8.500 8.500 0 1 0 10.500 10.500z" />
    </svg>
  );
}

export default function ThemeSwitch({ className = "" }: { className?: string }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.dataset.pfTheme === "light");
  }, []);

  const flip = () => {
    const next = !light;
    setLight(next);
    if (next) document.documentElement.dataset.pfTheme = "light";
    else delete document.documentElement.dataset.pfTheme;
    try {
      localStorage.setItem(KEY, next ? "light" : "dark");
    } catch {
      // private mode: the choice just lasts for this visit
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label="Light mode"
      className={`lab-switch ${className}`}
      data-on={light ? "1" : "0"}
      onClick={flip}
    >
      <span className="lab-switch-track" aria-hidden="true">
        <span className="lab-switch-knob">{light ? <Sun /> : <Moon />}</span>
      </span>
      <span className="nav-tip" aria-hidden="true">{light ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
