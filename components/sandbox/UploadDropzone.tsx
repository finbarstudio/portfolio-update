"use client";

/**
 * UploadDropzone — drag/drop or pick image/video files (or paste a public image
 * URL for embeds), then manage them as a reorderable thumbnail list. Reordering
 * works by pointer (mouse + touch) via drag, with ‹ › nudge buttons as an
 * accessible fallback. Validation/ingest is the parent's job.
 */

import { useRef, useState } from "react";
import { ACCEPT_ATTR, MAX_PHONES, type MediaAsset } from "@/lib/sandbox/media";
import { isGeneratedSrc, parseCardNumber } from "@/lib/sandbox/demo-cards";

export default function UploadDropzone({
  assets,
  onAddFiles,
  onAddUrl,
  onRemove,
  onMove,
  onReorder,
  messages,
  maxItems = MAX_PHONES,
  hint,
  landscapeThumbs = false,
}: {
  assets: MediaAsset[];
  onAddFiles: (files: File[]) => void;
  onAddUrl?: (url: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onReorder?: (id: string, toIndex: number) => void;
  messages: { errors: string[]; warnings: string[] };
  maxItems?: number;
  hint?: string;
  landscapeThumbs?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [url, setUrl] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  // Placeholder demo cards don't count toward the limit — the first real upload
  // replaces them — so only count the user's own media.
  const realCount = assets.filter((a) => !a.isDemo).length;
  const allDemos = assets.length > 0 && realCount === 0;
  const full = realCount >= maxItems;
  const canReorder = !!onReorder && assets.length > 1;

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    onAddFiles(Array.from(list));
  };

  const submitUrl = () => {
    const v = url.trim();
    if (!v) return;
    onAddUrl?.(v);
    setUrl("");
  };

  // Pointer-based reorder: while dragging, find the tile under the pointer and
  // move the dragged item to its slot (live). Works for mouse + touch.
  const onTilePointerDown = (e: React.PointerEvent, id: string) => {
    if (!canReorder) return;
    setDragId(id);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };
  const onTilePointerMove = (e: React.PointerEvent) => {
    if (dragId == null) return;
    // Lift the grabbed tile and keep it under the finger (measure its natural
    // position with the transform cleared, then offset to the pointer).
    const tileEl = e.currentTarget as HTMLElement;
    tileEl.style.transform = "";
    const r = tileEl.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    tileEl.style.transform = `translate(${dx}px, ${dy}px) scale(1.14)`;
    // Reorder live: whatever tile is under the pointer takes the dragged item's slot.
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const tile = el?.closest("[data-thumb-id]") as HTMLElement | null;
    const overId = tile?.getAttribute("data-thumb-id");
    if (overId && overId !== dragId) {
      const toIndex = assets.findIndex((a) => a.id === overId);
      if (toIndex >= 0) onReorder?.(dragId, toIndex);
    }
  };
  const endDrag = (e: React.PointerEvent) => {
    const tileEl = e.currentTarget as HTMLElement;
    if (tileEl) tileEl.style.transform = "";
    setDragId(null);
  };

  return (
    <div className="sb-panel">
      <div className="sb-panel-head">
        <h3 className="sb-panel-title mono-heading">Media</h3>
        <span className="mono-label sb-count">
          {allDemos ? `${assets.length} demo` : `${realCount}/${maxItems}`}
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
          {full
            ? `Limit reached (${maxItems})`
            : allDemos
              ? "Drop images or videos to replace the demo"
              : "Drop images or videos, or click to browse"}
        </span>
        <span className="mono-label sb-dropzone-hint">{hint ?? "PNG · JPG · WebP · MP4 · WebM"}</span>
      </div>

      {onAddUrl && (
        <div className="sb-url-row">
          <input
            type="url"
            inputMode="url"
            className="sb-url-input"
            placeholder="…or paste a public image URL (for embeds)"
            value={url}
            disabled={full}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitUrl();
              }
            }}
            aria-label="Image URL"
          />
          <button
            type="button"
            className="sb-btn sb-url-add"
            onClick={submitUrl}
            disabled={full || !url.trim()}
          >
            Add
          </button>
        </div>
      )}

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
            <li
              key={a.id}
              className={`sb-thumb ${dragId === a.id ? "is-dragging" : ""}`}
              data-thumb-id={a.id}
            >
              <div
                className={`sb-thumb-media ${landscapeThumbs ? "is-landscape" : ""} ${canReorder ? "is-grab" : ""}`}
                onPointerDown={(e) => onTilePointerDown(e, a.id)}
                onPointerMove={onTilePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                title={canReorder ? "Drag to reorder" : undefined}
              >
                {isGeneratedSrc(a.src) ? (
                  // Procedural placeholder — no real URL, so draw a mini card.
                  <span className="sb-thumb-gen" aria-label={a.name}>
                    {parseCardNumber(a.src)}
                  </span>
                ) : a.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.src} alt={a.name} loading="lazy" draggable={false} />
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
