"use client";

import { useState } from "react";

export default function EmailBlock({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <details className="mt-3">
      <summary className="mono-label text-ink-soft cursor-pointer hover:text-pink inline-flex items-center gap-1">
        Email
      </summary>
      <div className="mt-3 border border-line p-4 md:p-5 bg-black/[0.015]">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="mono-label text-ink-soft">To</span>
          <span className="text-ink" style={{ fontSize: "0.85rem" }}>{to}</span>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-1.5">
          <span className="mono-label text-ink-soft">Subject</span>
          <span className="text-ink" style={{ fontSize: "0.85rem" }}>{subject}</span>
          <button
            type="button"
            onClick={copy}
            className="ml-auto mono-label text-pink hover:underline"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <p
          className="text-ink-soft whitespace-pre-wrap mt-4"
          style={{ fontSize: "0.9rem", lineHeight: 1.6 }}
        >
          {body}
        </p>
      </div>
    </details>
  );
}
