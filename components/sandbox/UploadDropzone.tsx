"use client";

/**
 * UploadDropzone — drag/drop or pick image/video files, then manage them as a
 * reorderable thumbnail list (remove + nudge left/right). Validation/ingest is
 * the parent's job; this only forwards raw File[] and renders the current set.
 */

import { useRef, useState } from "react";
import { ACCEPT_ATTR, MAX_PHONES, type MediaAsset } from "@/lib/sandbox/media";

export default function UploadDropzone({
  assets,
  onAddFiles,
  onRemove,
  onMove,
  messages,
}: {
  assets: MediaAsset[];
  onAddFiles: (files: File[]) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  messages: { errors: string[]; warnings: string[] };
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const full = assets.length >= MAX_PHONES;

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    onAddFiles(Array.from(list));
  };

  return (
    <div className="sb-panel">
      <div className="sb-panel-head">
        <h3 className="sb-panel-title mono-heading">Media</h3>
        <span className="mono-label sb-count">
          {assets.length}/{MAX_PHONES}
        </span>
      </div>

      <div
        className={`sb-dropzone ${dragOver ? "is-over" : ""} ${full ? "is-full" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!full) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!full) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !full && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Add media files"
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !full) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span className="sb-dropzone-text">
          {full ? `Limit reached (${MAX_PHONES})` : "Drop images or videos, or click to browse"}
        </span>
        <span className="mono-label sb-dropzone-hint">PNG · JPG · WebP · MP4 · WebM</span>
      </div>

      {(messages.errors.length > 0 || messages.warnings.length > 0) && (
        <ul className="sb-messages" role="status" aria-live="polite">
          {messages.errors.map((m, i) => (
            <li key={`e${i}`} className="sb-msg is-error">
              {m}
            </li>
          ))}
          {messages.warnings.map((m, i) => (
            <li key={`w${i}`} className="sb-msg is-warn">
              {m}
            </li>
          ))}
        </ul>
      )}

      {assets.length > 0 && (
        <ul className="sb-thumbs" aria-label="Selected media">
          {assets.map((a, i) => (
            <li key={a.id} className="sb-thumb">
              <div className="sb-thumb-media">
                {a.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.src} alt={a.name} loading="lazy" />
                ) : (
                  // A static placeholder, not a live <video> — keeps the browser's
                  // limited video decoders free for the carousel + export.
                  <span className="sb-thumb-video" aria-label={`Video: ${a.name}`}>
                    <span className="sb-thumb-play" aria-hidden="true">▶</span>
                  </span>
                )}
                {a.isDemo && <span className="sb-thumb-badge">demo</span>}
              </div>
              <div className="sb-thumb-controls">
                <button
                  type="button"
                  className="sb-thumb-btn"
                  aria-label={`Move ${a.name} earlier`}
                  disabled={i === 0}
                  onClick={() => onMove(a.id, -1)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="sb-thumb-btn"
                  aria-label={`Move ${a.name} later`}
                  disabled={i === assets.length - 1}
                  onClick={() => onMove(a.id, 1)}
                >
                  ›
                </button>
                <button
                  type="button"
                  className="sb-thumb-btn is-remove"
                  aria-label={`Remove ${a.name}`}
                  onClick={() => onRemove(a.id)}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
