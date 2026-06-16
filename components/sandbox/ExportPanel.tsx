"use client";

/**
 * ExportPanel — the export surface: loop video, PNG still (choose which item to
 * centre), one still per item, GIF, and the copy-paste embed snippet. Shows live
 * progress with a cancel, and the standing "free = watermarked" note (the
 * monetization seam). Embed is only offered for public/demo media (blob uploads
 * can't be embedded without hosting).
 */

import { useState } from "react";
import type { MockupExport } from "@/lib/sandbox/useMockupExport";

export default function ExportPanel({
  exp,
  mediaCount,
  focus,
  onFocus,
  onCopyEmbed,
  embeddableCount,
  transparentBg,
}: {
  exp: MockupExport;
  mediaCount: number;
  focus: number;
  onFocus: (i: number) => void;
  onCopyEmbed: () => boolean;
  embeddableCount: number;
  transparentBg: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const disabled = exp.busy || mediaCount === 0;

  const handleCopy = () => {
    const ok = onCopyEmbed();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="sb-panel">
      <h3 className="sb-panel-title mono-heading">Export</h3>

      <div className="sb-export-grid">
        <button type="button" className="sb-btn is-primary" disabled={disabled} onClick={exp.exportVideo}>
          {exp.videoSupported ? "Loop video" : "Loop video (Chrome)"}
        </button>
        <button type="button" className="sb-btn" disabled={disabled} onClick={exp.exportGif}>
          GIF
        </button>
        <button type="button" className="sb-btn" disabled={disabled} onClick={() => exp.exportStill(focus)}>
          Still (PNG)
        </button>
        <button type="button" className="sb-btn" disabled={disabled} onClick={exp.exportAllStills}>
          All stills
        </button>
      </div>

      {mediaCount > 1 && (
        <label className="sb-field sb-focus">
          <span className="mono-label sb-field-label">Still frame</span>
          <select
            className="sb-select"
            value={focus}
            onChange={(e) => onFocus(Number(e.target.value))}
            disabled={exp.busy}
          >
            {Array.from({ length: mediaCount }).map((_, i) => (
              <option key={i} value={i}>
                Item {i + 1} centered
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="sb-embed">
        <button
          type="button"
          className="sb-btn sb-btn-wide"
          disabled={exp.busy || embeddableCount === 0}
          onClick={handleCopy}
        >
          {copied ? "Copied embed code ✓" : "Copy embed code"}
        </button>
        <p className="mono-label sb-note">
          {embeddableCount === 0
            ? "Embeds need public media — uploaded files can’t be embedded yet."
            : embeddableCount < mediaCount
              ? `Embed uses the ${embeddableCount} public item(s); uploaded files are skipped.`
              : "Responsive iframe + backlink, ~1KB."}
        </p>
      </div>

      {exp.busy && (
        <div className="sb-progress" role="status" aria-live="polite">
          <div className="sb-progress-row">
            <span className="mono-label">{exp.status}</span>
            <button type="button" className="sb-link-btn" onClick={exp.cancel}>
              Cancel
            </button>
          </div>
          <div className="sb-progress-track" aria-hidden="true">
            <div className="sb-progress-bar" style={{ width: `${Math.round(exp.progress * 100)}%` }} />
          </div>
        </div>
      )}

      {exp.error && <p className="sb-msg is-error" role="alert">{exp.error}</p>}

      <p className="mono-label sb-watermark-note">
        Free exports carry a finbar.studio watermark.
        {transparentBg ? " Video & GIF are opaque (transparent → matte); PNG keeps alpha." : ""}
      </p>
    </div>
  );
}
