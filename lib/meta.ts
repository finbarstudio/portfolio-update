"use client";

/**
 * Meta tracking, dual-channel.
 *
 * Every event goes out twice with ONE shared event_id:
 *   1. Browser: fbq(...) — the classic pixel (blocked by ad blockers, some
 *      in-app WebViews, and strict tracking prevention).
 *   2. Server: POST /api/meta (same-origin, nothing blocks it) — forwarded to
 *      Meta's Conversions API by the route handler. Meta deduplicates the pair
 *      by (event_name, event_id).
 *
 * Event Match Quality: the relay body carries the matching parameters Meta
 * scores on, generated first-party so they exist even when the pixel (which
 * normally sets them) is blocked:
 *   - fbp: read the pixel's _fbp cookie, or mint one in the same documented
 *     format (fb.1.<ms>.<random>) — Meta accepts self-generated fbp.
 *   - fbc: ad-click traffic lands with ?fbclid=... — captured into the
 *     documented fb.1.<ms>.<fbclid> format and cookied. Meta's dashboard rates
 *     this the single highest-impact parameter.
 *   - external_id: a stable first-party visitor id (uuid, 1y cookie).
 *   - em / ph on conversions: SHA-256 hashed (Meta's required normalisation)
 *     when the booking flow surfaces them. Raw values never leave the browser.
 */

export { META_PIXEL_ID } from "./meta-const";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function getCookie(name: string): string | undefined {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function setCookie(name: string, value: string, days: number): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${days * 86400}; path=/; SameSite=Lax`;
}

function uuid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/* The pixel's own cookie when it ran; our mint (same format) when it didn't. */
function ensureFbp(): string {
  let v = getCookie("_fbp");
  if (!v) {
    v = `fb.1.${Date.now()}.${Math.floor(Math.random() * 1e10)}`;
    setCookie("_fbp", v, 90);
  }
  return v;
}

/* Click ID: fresh fbclid in the URL wins (new ad click), else the stored one. */
function ensureFbc(): string | undefined {
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (fbclid) {
    const v = `fb.1.${Date.now()}.${fbclid}`;
    setCookie("_fbc", v, 90);
    return v;
  }
  return getCookie("_fbc");
}

function ensureExternalId(): string {
  let v = getCookie("fs_eid");
  if (!v) {
    v = uuid();
    setCookie("fs_eid", v, 365);
  }
  return v;
}

/* SHA-256 hex — Meta requires hashing after their normalisation rules
   (email: trimmed lowercase; phone: digits only with country code). */
async function sha256(value: string): Promise<string | undefined> {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return undefined; // e.g. non-secure context; skip the parameter
  }
}

async function hashEmail(email: string): Promise<string | undefined> {
  const norm = email.trim().toLowerCase();
  return norm.includes("@") ? sha256(norm) : undefined;
}

async function hashPhone(phone: string): Promise<string | undefined> {
  const digits = phone.replace(/\D/g, "");
  // Bare AU-length local numbers get the country code Meta expects.
  const norm = digits.length === 10 && digits.startsWith("0") ? `61${digits.slice(1)}` : digits;
  return norm.length >= 8 ? sha256(norm) : undefined;
}

function send(body: string): void {
  try {
    if (!navigator.sendBeacon?.("/api/meta", new Blob([body], { type: "application/json" }))) {
      void fetch("/api/meta", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    void fetch("/api/meta", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
  }
}

export function trackMeta(eventName: string, match?: { email?: string; phone?: string }): void {
  const id = uuid();
  const fbp = ensureFbp();
  const fbc = ensureFbc();
  const external_id = ensureExternalId();

  // Channel 1: the browser pixel (the inline stub always exists, so this
  // queues even if fbevents.js is still loading; if the script is blocked
  // the queue never flushes — that's what channel 2 is for).
  window.fbq?.("track", eventName, {}, { eventID: id });

  // Channel 2: same-origin server relay. Hashing is async, so the payload is
  // assembled in a microtask; keepalive/sendBeacon still survives navigation.
  void (async () => {
    const em = match?.email ? await hashEmail(match.email) : undefined;
    const ph = match?.phone ? await hashPhone(match.phone) : undefined;
    send(
      JSON.stringify({
        event_name: eventName,
        event_id: id,
        event_source_url: window.location.href,
        fbp,
        ...(fbc && { fbc }),
        external_id,
        ...(em && { em }),
        ...(ph && { ph }),
      })
    );
  })();
}
