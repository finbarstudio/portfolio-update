"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import InfoTip from "./InfoTip";

export type Tier = {
  /** The name in the link: /pricing?landing-page marks that card as the suggestion. */
  id: string;
  name: string;
  price: string;
  blurb: string;
  info: string;
  points: string[];
  examples?: { label: string; href: string }[];
};

/** The names in the link, lowercased and space-joined: "landing-page" from ?landing-page. */
function readQuery() {
  const params = new URLSearchParams(window.location.search);
  return [...params.keys(), params.get("package") ?? ""].map((k) => k.trim().toLowerCase()).join(" ");
}

function subscribe(changed: () => void) {
  window.addEventListener("popstate", changed);
  return () => window.removeEventListener("popstate", changed);
}

/**
 * The three website packages.
 *
 * A link can carry a package name as a bare query, e.g. /pricing?landing-page.
 * That card is then marked as the suggestion and scrolled into view, so one
 * page serves every enquiry: the prices are the same for everyone, only the
 * highlight changes. It is read in the browser, after load, so the page itself
 * stays static and cacheable. With no name, or one that matches nothing, the
 * page is just the page.
 */
export default function Tiers({ tiers }: { tiers: Tier[] }) {
  // The address bar is the outside world here, so it is read as a store: the
  // server (and the first paint) sees no suggestion, the browser sees the link's.
  const asked = useSyncExternalStore(subscribe, readQuery, () => "");
  const picked = tiers.find((t) => asked.split(" ").includes(t.id))?.id ?? null;
  const card = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!picked || !card.current) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.current.scrollIntoView({ block: "center", behavior: calm ? "auto" : "smooth" });
  }, [picked]);

  return (
    <div className="pr-tiers">
      {tiers.map((t) => {
        const on = t.id === picked;
        return (
          <article key={t.id} id={t.id} ref={on ? card : undefined} className={`pr-tier ${on ? "is-lead" : ""}`}>
            {on ? <p className="pr-tier-flag">Suggested for you</p> : null}
            <h2 className="pr-tier-name">{t.name}</h2>
            <p className="pr-tier-price">
              {t.price} <InfoTip text={t.info} />
            </p>
            <p className="pr-tier-blurb">{t.blurb}</p>
            <ul className="pr-tier-points">
              {t.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            {t.examples?.length ? (
              <p className="pr-tier-examples">
                <span>See one:</span>
                {t.examples.map((e) => (
                  <Link key={e.href} href={e.href}>
                    {e.label}
                  </Link>
                ))}
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
