"use client";

/**
 * CalEmbed — the Cal.com booker, branded. Lives in the merged contact popup
 * (ContactPanel); split out so it can be dynamically imported and only mounted
 * once the popup first opens — the Cal script costs nothing until someone
 * actually reaches for a time.
 *
 * Embed over the Atoms API on purpose: Atoms need a Cal Platform OAuth client
 * and server-side token plumbing to render a booker, which buys nothing over
 * the embed for a single public booking link.
 */

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

const CAL_LINK = "finbar.studio";
const CAL_NS = "book-call";

export default function CalEmbed({ onReady }: { onReady?: () => void }) {
  // cal-brand drives buttons/date selection inside the iframe.
  useEffect(() => {
    (async () => {
      const api = await getCalApi({ namespace: CAL_NS });
      // Fires when the booker has actually rendered inside the iframe — the
      // popup shows the brand loading pulse until then, not Cal's default.
      api("on", { action: "linkReady", callback: () => onReady?.() });
      // Brand colour ONLY (literal hex — the iframe can't see our custom
      // properties). The deeper reskin (transparent ground, remapped
      // borders/text) glitched the embed's hover states, so the booker keeps
      // its own default look inside its card.
      api("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#E96D89" },
          dark: { "cal-brand": "#E96D89" },
        },
        // "Just the form": no event-meta rail (avatar/title/duration), only the
        // calendar and times.
        hideEventTypeDetails: true,
        layout: "month_view",
      });
    })();
  }, [onReady]);

  return (
    <Cal
      namespace={CAL_NS}
      calLink={CAL_LINK}
      // hideBranding is a booking-page param, not a ui-config key. Best
      // effort: honoured only if the Cal account's plan allows branding
      // removal, silently ignored otherwise.
      config={{ layout: "month_view", theme: "light", hideBranding: "true" }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
