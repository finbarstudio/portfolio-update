"use client";

/**
 * StickyCredit — a small "© {year} finbarstudio" pinned to the bottom-right of
 * every page. When the footer's own credit scrolls into view it hands off (fades
 * out), so the credit reads as slotting into place in the footer.
 */

import { useEffect, useState } from "react";

export default function StickyCredit() {
  const [year, setYear] = useState(2026);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => setYear(new Date().getFullYear()), []);

  useEffect(() => {
    const credit = document.querySelector(".sf-credit");
    if (!credit) return;
    const io = new IntersectionObserver(
      ([e]) => setAtFooter(e.isIntersecting),
      { threshold: 0.6 },
    );
    io.observe(credit);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`sticky-credit ${atFooter ? "is-hidden" : ""}`} aria-hidden="true">
      © {year} finbarstudio
    </div>
  );
}
