"use client";

/**
 * Error boundary for the Sandbox tools. The tools mount a WebGL scene that can
 * throw at runtime (a failed asset, a lost GL context, an out-of-budget device).
 * Without this boundary a single throw unmounts the whole route and the browser
 * shows a blank/"couldn't load" page with no way back. Here we catch it, keep the
 * Sandbox chrome, and offer a retry — and surface the digest so real failures are
 * diagnosable instead of silent.
 */

import { useEffect } from "react";
import Link from "next/link";

export default function SandboxError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the real error in the console for diagnosis.
    console.error("Sandbox tool error:", error);
  }, [error]);

  return (
    <div
      className="sb-tool"
      style={{
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 14,
        padding: "48px 0",
      }}
      role="alert"
    >
      <p className="mono-label sb-eyebrow">Sandbox / Tool</p>
      <h1 className="sb-tool-title" style={{ margin: 0 }}>
        This tool hit a snag
      </h1>
      <p className="sb-tool-sub" style={{ maxWidth: "46ch" }}>
        Something went wrong loading the 3D preview. Try again. If it keeps
        happening, it&rsquo;s most reliable on a desktop browser.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
        <button type="button" className="sb-btn" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="sb-btn">
          Back to tools
        </Link>
      </div>
      {(error.message || error.digest) && (
        <pre
          className="mono-label"
          style={{
            opacity: 0.7,
            fontSize: 11,
            marginTop: 12,
            padding: "10px 12px",
            border: "1px solid var(--line)",
            borderRadius: 8,
            maxWidth: "100%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            letterSpacing: 0,
            textTransform: "none",
          }}
        >
          {error.message || "(no message)"}
          {error.digest ? `\nRef: ${error.digest}` : ""}
        </pre>
      )}
    </div>
  );
}
