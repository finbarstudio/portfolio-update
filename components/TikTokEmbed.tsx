"use client";

/**
 * TikTokEmbed — the official TikTok creator-profile embed. Renders the blockquote
 * TikTok's embed.js upgrades into a scrollable iframe of the creator's videos.
 * Loads embed.js once; re-runs the renderer if it's already on the page.
 */

import { useEffect } from "react";

export default function TikTokEmbed({ username }: { username: string }) {
  useEffect(() => {
    const SCRIPT_ID = "tiktok-embed-js";
    // If the lib is already present, ask it to (re)scan for new blockquotes.
    const w = window as unknown as { tiktokEmbed?: { lib?: { render?: () => void } } };
    if (document.getElementById(SCRIPT_ID)) {
      w.tiktokEmbed?.lib?.render?.();
      return;
    }
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.async = true;
    s.src = "https://www.tiktok.com/embed.js";
    document.body.appendChild(s);
  }, [username]);

  return (
    <blockquote
      className="tiktok-embed"
      cite={`https://www.tiktok.com/@${username}`}
      data-unique-id={username}
      data-embed-type="creator"
      style={{ maxWidth: 780, minWidth: 288, margin: 0 }}
    >
      <section>
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://www.tiktok.com/@${username}?refer=creator_embed`}
        >
          @{username}
        </a>
      </section>
    </blockquote>
  );
}
