"use client";

/**
 * Meta tracking, dual-channel.
 *
 * Every event goes out twice with ONE shared event_id:
 *   1. Browser: fbq(...) — the classic pixel (blocked by ad blockers, some
 *      in-app WebViews, and strict tracking prevention).
 *   2. Server: POST /api/meta (same-origin, nothing blocks it) — forwarded to
 *      Meta's Conversions API by the route handler once its access token is
 *      configured. Until then the route no-ops safely.
 *
 * Meta deduplicates the pair by (event_name, event_id), so when both arrive
 * the event counts once; when the browser channel is blocked the server copy
 * still lands. This is Meta's own recommended redundant setup.
 */

export { META_PIXEL_ID } from "./meta-const";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function eventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export function trackMeta(eventName: string): void {
  const id = eventId();

  // Channel 1: the browser pixel (the inline stub always exists, so this
  // queues even if fbevents.js is still loading; if the script is blocked
  // the queue simply never flushes — that's what channel 2 is for).
  window.fbq?.("track", eventName, {}, { eventID: id });

  // Channel 2: same-origin server relay. keepalive so events fired right
  // before navigation (or booking-complete redirects) still deliver.
  const body = JSON.stringify({
    event_name: eventName,
    event_id: id,
    event_source_url: window.location.href,
  });
  try {
    if (!navigator.sendBeacon?.("/api/meta", new Blob([body], { type: "application/json" }))) {
      void fetch("/api/meta", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    void fetch("/api/meta", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
  }
}
