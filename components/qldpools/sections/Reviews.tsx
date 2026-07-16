"use client";

/**
 * Reviews — ported from options/reviews.tsx entry 15, "Rating Panel + Featured
 * Quote" (the design the client picked): a rating panel on the left, one
 * featured review on the right. This build adds what the client asked for on
 * top of that layout: explicit Google attribution, auto-rotation through all
 * six reviews, initials avatars, and click-through to their Google listing.
 *
 * Real API path (for when this moves off the static kit array):
 * - Google Places API (New) "Place Details" can return author displayName,
 *   real photoUri, a link to the review, rating and relativePublishTimeDescription.
 * - It requires a Google Cloud API key with billing enabled, and it returns a
 *   MAXIMUM OF 5 reviews (not all 41), chosen by Google.
 * - Google's terms require showing their attribution and not caching review
 *   content long-term.
 * - So the shape here (avatar + name + text + link) is deliberately
 *   API-ready: swap the kit array for a server route that calls Place Details
 *   and the component works unchanged.
 */

import { useEffect, useRef, useState } from "react";
import { REVIEW_STATS, TESTIMONIALS } from "@/app/qldpools/site/sections/kit";

const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=QLD+Pool+Installs+reviews";
const ROTATE_MS = 5000;
const FADE_MS = 500;

function Star({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 2.5l2.9 6.4 6.9.6-5.3 4.7 1.6 6.8L12 17.6l-6.1 3.4 1.6-6.8-5.3-4.7 6.9-.6z" />
    </svg>
  );
}

function StarRow({
  color = "var(--qpi-blue)",
  size = 14,
  gap = 3,
}: {
  color?: string;
  size?: number;
  gap?: number;
}) {
  return (
    <span role="img" aria-label={`${REVIEW_STATS.rating} out of 5 stars`} style={{ display: "inline-flex", gap }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} color={color} size={size} />
      ))}
    </span>
  );
}

/* Google's real "G" mark, shown in Google's own brand colours (the one
 * exception to the demo's palette rule; their terms require it). */
function GoogleMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* Built so a real photo can drop straight in later: pass `photoUrl` (e.g.
 * from Places API's photoUri) and it renders an <img>; otherwise it falls
 * back to an initials avatar on var(--qpi-blue). */
function ReviewAvatar({ name, photoUrl, size = 44 }: { name: string; photoUrl?: string; size?: number }) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt=""
        width={size}
        height={size}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="qpi-caps flex items-center justify-center rounded-full flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: "var(--qpi-blue)",
        color: "#fff",
        fontSize: size * 0.36,
        letterSpacing: 0,
      }}
    >
      {initials(name)}
    </span>
  );
}

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const swapTimeout = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const goTo = (next: number) => {
    if (next === index) return;
    if (swapTimeout.current) window.clearTimeout(swapTimeout.current);
    setFading(true);
    swapTimeout.current = window.setTimeout(() => {
      setIndex(next);
      setFading(false);
    }, FADE_MS);
  };

  useEffect(() => {
    if (reducedMotion || paused) return;
    const intervalId = window.setInterval(() => {
      goTo((index + 1) % TESTIMONIALS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, paused, index]);

  useEffect(() => {
    return () => {
      if (swapTimeout.current) window.clearTimeout(swapTimeout.current);
    };
  }, []);

  const current = TESTIMONIALS[index] ?? TESTIMONIALS[0];

  return (
    <section className="relative flex w-full flex-col justify-center bg-white qpi-gutter min-h-svh py-16 md:py-20">
      <h2 className="sr-only">{REVIEW_STATS.heading}</h2>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12" style={{ maxWidth: 1080 }}>
        {/* Rating panel — static, unaffected by rotation */}
        <div
          className="flex flex-col items-center justify-center text-center p-10 md:p-12"
          style={{ background: "rgba(0,0,0,0.02)" }}
        >
          <p
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(3rem, 5vw, 4rem)", lineHeight: 1 }}
          >
            {REVIEW_STATS.rating}
          </p>
          <div style={{ marginTop: 12 }}>
            <StarRow size={18} />
          </div>
          <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10, marginTop: 10 }}>
            {REVIEW_STATS.word} &middot; {REVIEW_STATS.count}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <GoogleMark size={16} />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.65, fontSize: 10 }}>
              Google Reviews
            </span>
          </div>
        </div>

        {/* Featured, rotating review */}
        <div
          className="flex flex-col justify-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Read ${current.name}'s review of QLD Pool Installs on Google, opens in a new tab`}
            className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ outlineColor: "var(--qpi-blue)" }}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div
              aria-live="polite"
              style={{
                opacity: fading ? 0 : 1,
                transform: fading ? "translateY(6px)" : "translateY(0)",
                transition: reducedMotion ? "none" : `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
              }}
            >
              <p
                style={{
                  color: "var(--qpi-ink)",
                  fontSize: "clamp(1rem, 1.6vw, 1.1875rem)",
                  lineHeight: 1.6,
                }}
              >
                &ldquo;{current.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-5">
                <ReviewAvatar name={current.name} />
                <div>
                  <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
                    {current.name}
                  </p>
                  <div style={{ marginTop: 4 }}>
                    <StarRow size={11} gap={2} />
                  </div>
                </div>
              </div>
            </div>
          </a>

          {/* Dots — jump to a specific review, kept outside the link so we
              never nest interactive elements. */}
          <div className="flex items-center gap-2 mt-6" role="group" aria-label="Choose a review to show">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show review from ${t.name}`}
                aria-current={i === index}
                className="rounded-full"
                style={{
                  width: i === index ? 18 : 7,
                  height: 7,
                  background: "var(--qpi-blue)",
                  opacity: i === index ? 1 : 0.3,
                  transition: reducedMotion ? "none" : "width 200ms ease, opacity 200ms ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
