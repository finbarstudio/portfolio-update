"use client";

import { useDeferredValue, useEffect, useId, useRef, useState } from "react";
import {
  CANIEMAIL_URL,
  FIXES,
  OUTLOOK_PAGE_HEIGHT,
  SHARE,
  SHARE_DATE,
  applyFixes,
  checkEmail,
  formatShare,
  getStats,
  matchFeatures,
  type CanIEmailData,
  type ClientSupport,
  type Environment,
  type FeatureUse,
  type FixId,
  type Level,
} from "@/lib/email-check";
import { extractFromPreviewPage, isPreviewUrl } from "@/lib/email-extract";

/**
 * Email check: paste an HTML email, get a report and a preview, fix what has
 * one right answer. Nothing leaves the browser except the request for the
 * caniemail.com support data.
 *
 * The output is the source with an ordered list of fixes applied; that is
 * what the report, the preview and the output field all show, so undoing a
 * fix is just taking it off the list.
 */

const LEVEL_LABEL: Record<Level, string> = { fail: "Problem", warn: "Warning", info: "Note" };

const FAMILIES = ["gmail", "outlook", "apple-mail", "yahoo", "samsung-email", "aol", "protonmail", "thunderbird"];
const DEFAULT_FAMILIES = ["gmail", "outlook", "apple-mail", "yahoo", "samsung-email"];

/** 0 means as wide as the frame. */
const WIDTHS = [
  { label: "Phone", value: 375 },
  { label: "Desktop", value: 650 },
  { label: "Wide", value: 1000 },
  { label: "Fill", value: 0 },
];

type DarkMode = "off" | "scheme" | "invert";
const DARK_MODES: { value: DarkMode; label: string }[] = [
  { value: "off", label: "Light" },
  { value: "scheme", label: "Dark: your styles" },
  { value: "invert", label: "Dark: inverted" },
];

const ENVIRONMENTS: { key: Environment; label: string }[] = [
  { key: "mobile", label: "Mobile" },
  { key: "webmail", label: "Webmail" },
  { key: "desktop", label: "Desktop" },
];

const MAX_LINES_SHOWN = 8;

type PanelName = "source" | "report" | "preview";

function lineList(lines: number[]): string {
  if (!lines.length) return "";
  const shown = lines.slice(0, MAX_LINES_SHOWN).join(", ");
  const rest = lines.length - MAX_LINES_SHOWN;
  return `Line ${shown}${rest > 0 ? ` and ${rest} more` : ""}`;
}

function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

/** What the preview frame is given: the output, minus whatever is switched off, plus the dark mode treatment. */
function previewSource(src: string, imagesOff: boolean, stylesOff: boolean, dark: DarkMode): string {
  let out = src;
  if (stylesOff) out = out.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  if (imagesOff) {
    out = out
      .replace(/(<img\b[^>]*?\s)src\s*=/gi, "$1data-src=")
      .replace(/url\(\s*(['"]?)[^)'"]*\1\s*\)/gi, "none")
      .replace(/(<(?:table|td|body)\b[^>]*?\s)background\s*=/gi, "$1data-background=");
  }
  if (dark === "scheme") {
    // Turn the email's own dark-mode media queries on, as a client that honours them would.
    out = out.replace(/@media[^{]*prefers-color-scheme\s*:\s*dark[^{]*\{/gi, "@media all {");
    out = out.replace(/<\/head>/i, "<style>:root{color-scheme:dark}</style></head>");
  }
  if (dark === "invert") {
    out = out.replace(
      /<\/head>/i,
      "<style>html{filter:invert(1) hue-rotate(180deg);background:#fff}img,video,[style*='background-image']{filter:invert(1) hue-rotate(180deg)}</style></head>",
    );
  }
  return out;
}

/** Which rendering engine the preview is really using, so nobody mistakes it for a mail client. */
function engineNote(): string {
  if (typeof navigator === "undefined") return "";
  const ua = navigator.userAgent;
  if (/Firefox\//.test(ua)) return "Rendered by Firefox. No email client uses this engine; it only shows the webmail clients as you would see them in Firefox.";
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return "Rendered by Chrome. Gmail, Outlook.com and Yahoo in Chrome use this engine, after they rewrite the HTML. Apple Mail does not.";
  if (/Edg\//.test(ua)) return "Rendered by Edge. Outlook.com, the new Outlook for Windows and Gmail in Edge use this engine, after they rewrite the HTML.";
  if (/Safari\//.test(ua)) return "Rendered by Safari. Apple Mail on Mac, iPhone and iPad use this same WebKit engine, so this is the closest preview to those.";
  return "Rendered by this browser, not by an email client.";
}

function supportLabel(status: ClientSupport["status"]): string {
  return { y: "Supported", a: "Partial", n: "Not supported", u: "Unknown" }[status];
}

function Panel({
  name,
  title,
  open,
  onToggle,
  className,
  children,
}: {
  name: PanelName;
  title: string;
  open: boolean;
  onToggle: (name: PanelName) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`ec-panel ${className ?? ""}${open ? "" : " is-closed"}`} aria-label={title}>
      <button
        type="button"
        className="ec-toggle"
        aria-expanded={open}
        onClick={() => onToggle(name)}
        title={open ? `Collapse ${title.toLowerCase()}` : `Expand ${title.toLowerCase()}`}
      >
        <span className="ec-toggle-mark" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
        <span className="ec-toggle-text">{title}</span>
      </button>
      {open && <div className="ec-panel-body">{children}</div>}
    </section>
  );
}

function FeatureRow({
  feature,
  families,
  onFix,
}: {
  feature: FeatureUse;
  families: string[];
  onFix: (id: FixId) => void;
}) {
  const relevant = feature.support.filter((s) => families.includes(s.family) && s.status !== "u");
  const ordered = [...relevant].sort((a, b) => ({ n: 0, a: 1, y: 2, u: 3 })[a.status] - ({ n: 0, a: 1, y: 2, u: 3 })[b.status] || b.share - a.share);
  const notes = [...new Set(relevant.filter((s) => s.status === "a").flatMap((s) => s.notes))];
  const affected = relevant.filter((s) => s.status === "n").reduce((n, s) => n + s.share, 0);
  return (
    <li className="ec-item">
      <div className="ec-item-head">
        <p className="ec-item-title">
          <a href={feature.url} target="_blank" rel="noreferrer">
            {feature.title}
          </a>
          <span className="ec-dim">
            {" "}
            used {feature.count === 1 ? "once" : `${feature.count} times`}
          </span>
        </p>
        {affected > 0 && <span className="ec-share">{formatShare(affected)} of opens</span>}
        {feature.fix && (
          <button type="button" className="ec-fix" onClick={() => onFix(feature.fix!)}>
            {FIXES[feature.fix].label}
          </button>
        )}
      </div>
      {affected > 0 && (
        <p className="ec-dim">
          Cannot show it:{" "}
          {ENVIRONMENTS.map((e) => {
            const share = relevant.filter((s) => s.status === "n" && s.environment === e.key).reduce((n, s) => n + s.share, 0);
            return `${e.label} ${formatShare(share)}`;
          }).join(" · ")}
        </p>
      )}
      <ul className="ec-clients">
        {ordered.map((s) => (
          <li key={`${s.family}-${s.platform}`} className={`ec-client ec-client-${s.status}`} title={supportLabel(s.status)}>
            {s.label} <span className="ec-client-share">{formatShare(s.share)}</span>
          </li>
        ))}
      </ul>
      {notes.map((note) => (
        <p key={note} className="ec-dim">
          {note}
        </p>
      ))}
      <p className="ec-dim">{lineList(feature.lines)}</p>
    </li>
  );
}

export default function EmailCheck() {
  const [source, setSource] = useState("");
  const [fileName, setFileName] = useState("");
  const [link, setLink] = useState("");
  const [linkState, setLinkState] = useState<{ busy: boolean; error: string; notes: string[] }>({ busy: false, error: "", notes: [] });
  const [fixes, setFixes] = useState<FixId[]>([]);
  const [copied, setCopied] = useState(false);
  const [width, setWidth] = useState(650);
  const [dark, setDark] = useState<DarkMode>("off");
  const [imagesOff, setImagesOff] = useState(false);
  const [stylesOff, setStylesOff] = useState(false);
  const [families, setFamilies] = useState(DEFAULT_FAMILIES);
  const [open, setOpen] = useState<Record<PanelName, boolean>>({ source: true, report: true, preview: true });
  const [height, setHeight] = useState<number | null>(null);
  const [data, setData] = useState<CanIEmailData | null>(null);
  const [dataError, setDataError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const sourceId = useId();
  const outputId = useId();
  const frameRef = useRef<HTMLIFrameElement>(null);

  const deferredSource = useDeferredValue(source);

  useEffect(() => {
    const controller = new AbortController();
    fetch(CANIEMAIL_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<CanIEmailData>;
      })
      .then((json) => {
        setData(json);
        setDataError(false);
      })
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === "AbortError")) setDataError(true);
      });
    return () => controller.abort();
  }, [attempt]);

  // The email's height changes as images arrive, so measure a few times.
  const measure = () => {
    const doc = frameRef.current?.contentDocument;
    if (doc?.documentElement) setHeight(doc.documentElement.scrollHeight);
  };
  const onFrameLoad = () => {
    measure();
    for (const ms of [600, 2000, 5000]) window.setTimeout(measure, ms);
  };

  const load = (text: string, name: string) => {
    setSource(text);
    setFileName(name);
    setFixes([]);
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    load(await file.text(), file.name);
  };

  /** A pasted "view online" page, or a link to one, becomes the email it wraps. */
  const loadPage = (html: string, name: string) => {
    const extracted = extractFromPreviewPage(html);
    if (!extracted) {
      setLinkState({ busy: false, error: "That page is not a preview layout this tool knows how to unwrap.", notes: [] });
      return false;
    }
    load(extracted.src, name);
    setLinkState({ busy: false, error: "", notes: [`Unwrapped from ${extracted.platform}'s preview page.`, ...extracted.notes] });
    return true;
  };

  const fetchLink = async (text: string) => {
    const url = isPreviewUrl(text);
    if (!url) {
      setLinkState({ busy: false, error: "Only ActiveCampaign preview links (…activehosted.com) can be fetched. For anything else, paste the page's source.", notes: [] });
      return;
    }
    setLinkState({ busy: true, error: "", notes: [] });
    try {
      // The route sits beside this page: /email/source on the lab host, /lab/email/source otherwise.
      const base = window.location.pathname.replace(/\/$/, "");
      const res = await fetch(`${base}/source?url=${encodeURIComponent(url.href)}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `The fetch answered ${res.status}.`);
      }
      loadPage(await res.text(), url.hostname);
    } catch (err: unknown) {
      setLinkState({ busy: false, error: err instanceof Error ? err.message : "The page could not be fetched.", notes: [] });
    }
  };

  const onSourceChange = (text: string) => {
    if (isPreviewUrl(text)) {
      setLink(text.trim());
      void fetchLink(text);
      return;
    }
    if (/class="[^"]*message-body-container/.test(text) && loadPage(text, "pasted page")) return;
    setSource(text);
    setFileName("");
  };

  const addFix = (id: FixId) => setFixes((current) => (current.includes(id) ? current : [...current, id]));
  const addFixes = (ids: FixId[]) => setFixes((current) => [...current, ...ids.filter((id) => !current.includes(id))]);
  const undoFix = (id: FixId) => setFixes((current) => current.filter((f) => f !== id));

  const onCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const onDownload = () => {
    const blob = new Blob([output], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName ? fileName.replace(/(\.html?)?$/i, "-fixed$1") : "email-fixed.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFamily = (family: string) =>
    setFamilies((current) => (current.includes(family) ? current.filter((f) => f !== family) : [...current, family]));

  const togglePanel = (name: PanelName) => setOpen((current) => ({ ...current, [name]: !current[name] }));

  const { src: output, applied } = applyFixes(deferredSource, fixes);
  const hasSource = deferredSource.trim().length > 0;
  const stats = getStats(output);
  const findings = checkEmail(output);
  const bulkFixes = [...new Set(findings.map((f) => f.fix).filter((id): id is FixId => !!id && FIXES[id].bulk))];
  const features = data ? matchFeatures(output, data) : [];
  const clientFixes = [...new Set(features.map((f) => f.fix).filter((id): id is FixId => !!id))];

  const shareIn = (f: FeatureUse, status: "n" | "a") =>
    f.support.filter((s) => families.includes(s.family) && s.status === status).reduce((n, s) => n + s.share, 0);
  const unsupported = features.filter((f) => shareIn(f, "n") > 0).sort((a, b) => shareIn(b, "n") - shareIn(a, "n"));
  const partialOnly = features.filter((f) => shareIn(f, "n") === 0 && shareIn(f, "a") > 0).sort((a, b) => shareIn(b, "a") - shareIn(a, "a"));

  // Share of opens, by environment, that hits at least one unsupported feature.
  const environmentHit = ENVIRONMENTS.map(({ key, label }) => {
    const hit = new Map<string, number>();
    let total = 0;
    const seen = new Set<string>();
    for (const f of features) {
      for (const s of f.support) {
        if (!families.includes(s.family) || s.environment !== key) continue;
        const id = `${s.family}/${s.platform}`;
        if (!seen.has(id)) {
          seen.add(id);
          total += s.share;
        }
        if (s.status === "n") hit.set(id, s.share);
      }
    }
    const affected = [...hit.values()].reduce((n, v) => n + v, 0);
    return { key, label, affected, total };
  });

  const columns = [open.source ? "320px" : "44px", open.report ? "minmax(320px, 460px)" : "44px", open.preview ? "minmax(0, 1fr)" : "44px"];
  const tooTall = height !== null && height > OUTLOOK_PAGE_HEIGHT;

  return (
    <main className="ec-tool" style={{ gridTemplateColumns: columns.join(" ") }}>
      <Panel name="source" title="Email check" open={open.source} onToggle={togglePanel} className="ec-source">
        <p className="ec-dim">
          Paste an HTML email, open a file, or paste an ActiveCampaign &quot;view online&quot; link to unwrap the email from it. Checks run in your
          browser; only a preview link is fetched by the server.
        </p>

        <form
          className="ec-row"
          onSubmit={(e) => {
            e.preventDefault();
            void fetchLink(link);
          }}
        >
          <input
            type="url"
            className="ec-input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Paste a 'view online' link"
            aria-label="Preview link"
          />
          <button type="submit" disabled={linkState.busy || !link.trim()}>
            {linkState.busy ? "Fetching" : "Fetch"}
          </button>
        </form>
        {linkState.error && <p role="alert">{linkState.error}</p>}
        {linkState.notes.length > 0 && (
          <ul className="ec-notes">
            {linkState.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}

        <label className="ec-file">
          <input
            type="file"
            accept=".html,.htm,text/html"
            onChange={(e) => {
              void onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <span>Open an HTML file</span>
        </label>
        {fileName && <p className="ec-dim">{fileName}</p>}

        <label htmlFor={sourceId} className="ec-label">
          Source
        </label>
        <textarea
          id={sourceId}
          className="ec-textarea"
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="<!DOCTYPE html>"
        />

        {hasSource && (
          <>
            <div className="ec-row">
              <label htmlFor={outputId} className="ec-label">
                Output
              </label>
              <span className="ec-dim">{kb(stats.bytes)}</span>
              <button type="button" onClick={() => void onCopy()}>
                {copied ? "Copied" : "Copy"}
              </button>
              <button type="button" onClick={onDownload}>
                Download
              </button>
            </div>
            <textarea
              id={outputId}
              className="ec-textarea ec-output"
              value={output}
              readOnly
              spellCheck={false}
              onFocus={(e) => e.target.select()}
            />

            <dl className="ec-stats">
              <div>
                <dt>CSS in style blocks</dt>
                <dd>{kb(stats.styleBytes)}</dd>
              </div>
              <div>
                <dt>Width</dt>
                <dd>{stats.width ? `${stats.width}px` : "fluid"}</dd>
              </div>
              <div>
                <dt>Non-breaking spaces</dt>
                <dd>{stats.nbsp}</dd>
              </div>
              <div>
                <dt>Longest line</dt>
                <dd>{stats.longestLine}</dd>
              </div>
              <div>
                <dt>Images</dt>
                <dd>{stats.images}</dd>
              </div>
              <div>
                <dt>Tables</dt>
                <dd>{stats.tables}</dd>
              </div>
            </dl>
            <div>
              <p className="ec-dim">Merge tags</p>
              <p>{stats.platform ? `Looks like ${stats.platform}` : "None found"}</p>
            </div>
            <div>
              <p className="ec-dim">Inbox preview line</p>
              <p className="ec-preview-text">{stats.previewText || "(no text)"}</p>
            </div>
          </>
        )}

        <p className="ec-foot">
          {/* Plain link, as in LabHeader: proxy.ts rewrites "/" on the lab host. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">lab.finbar.studio</a>
        </p>
      </Panel>

      <Panel name="report" title="Report" open={open.report} onToggle={togglePanel} className="ec-report">
        {!hasSource ? (
          <p className="ec-dim">The report appears here once there is an email to read.</p>
        ) : (
          <div aria-live="polite">
            <div className="ec-row">
              <button type="button" className="ec-primary" onClick={() => addFixes(bulkFixes)} disabled={bulkFixes.length === 0}>
                {bulkFixes.length ? `Fix all (${bulkFixes.length})` : "Nothing left to fix"}
              </button>
              <span className="ec-dim">Each fix can be undone below.</span>
            </div>

            {applied.length > 0 && (
              <ul className="ec-applied" aria-label="Applied fixes">
                {applied.map((a) => (
                  <li key={a.id}>
                    <span>{a.note || `${FIXES[a.id].label}: nothing to change`}</span>
                    <button type="button" className="ec-fix" onClick={() => undoFix(a.id)}>
                      Undo
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <details className="ec-section" open>
              <summary>
                <h2>Checks</h2>
                <span className="ec-dim">{findings.length}</span>
              </summary>
              <p className="ec-dim">Ordered by severity, then by the share of opens each one reaches (Litmus, {SHARE_DATE}).</p>
              {findings.length === 0 ? (
                <p className="ec-dim">Nothing flagged.</p>
              ) : (
                <ul className="ec-list">
                  {findings.map((f) => (
                    <li key={f.id} className="ec-item">
                      <div className="ec-item-head">
                        <p className="ec-item-title">
                          <span className={`ec-level ec-level-${f.level}`}>{LEVEL_LABEL[f.level]}</span> {f.title}
                        </p>
                        <span className="ec-share" title={f.affects.length ? f.affects.map((a) => data?.nicenames.family[a] ?? a).join(", ") : "Every client"}>
                          {formatShare(f.share)} of opens
                        </span>
                        {f.fix && (
                          <button type="button" className="ec-fix" onClick={() => addFix(f.fix!)}>
                            {FIXES[f.fix].label}
                          </button>
                        )}
                      </div>
                      <p>{f.detail}</p>
                      {f.lines.length > 0 && <p className="ec-dim">{lineList(f.lines)}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </details>

            <details className="ec-section" open>
              <summary>
                <h2>Client support</h2>
                <span className="ec-dim">{data ? unsupported.length : ""}</span>
              </summary>
              <p className="ec-dim">
                What this email uses, looked up in the caniemail.com test results{data ? ` (updated ${data.last_update_date.slice(0, 10)})` : ""}, ordered by
                the share of opens that cannot show it. Shares below a client family are a rough split.
              </p>

              {dataError && (
                <p role="alert">
                  The support data did not load, so this section is empty.{" "}
                  <button type="button" onClick={() => setAttempt((n) => n + 1)}>
                    Try again
                  </button>
                </p>
              )}
              {!data && !dataError && <p className="ec-dim">Loading support data.</p>}

              {data && (
                <>
                  <div className="ec-chips" role="group" aria-label="Clients to include">
                    {FAMILIES.filter((f) => f in data.nicenames.family).map((family) => (
                      <button key={family} type="button" aria-pressed={families.includes(family)} onClick={() => toggleFamily(family)}>
                        {data.nicenames.family[family]} <span className="ec-client-share">{formatShare(SHARE[family] ?? 0)}</span>
                      </button>
                    ))}
                  </div>

                  <dl className="ec-env" aria-label="Opens reaching something unsupported, by environment">
                    {environmentHit.map((e) => (
                      <div key={e.key}>
                        <dt>{e.label}</dt>
                        <dd>
                          {formatShare(e.affected)} <span className="ec-dim">of {formatShare(e.total)}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="ec-row">
                    <button type="button" className="ec-primary" onClick={() => addFixes(clientFixes)} disabled={clientFixes.length === 0}>
                      {clientFixes.length ? `Apply client fixes (${clientFixes.length})` : "No automatic client fixes"}
                    </button>
                    <span className="ec-dim">Only what can be fixed without a design decision.</span>
                  </div>

                  {unsupported.length === 0 ? (
                    <p className="ec-dim">Nothing here is unsupported in the clients selected.</p>
                  ) : (
                    <ul className="ec-list">
                      {unsupported.map((f) => (
                        <FeatureRow key={f.slug} feature={f} families={families} onFix={addFix} />
                      ))}
                    </ul>
                  )}

                  {partialOnly.length > 0 && (
                    <details className="ec-details">
                      <summary>{partialOnly.length} more with partial support only</summary>
                      <ul className="ec-list">
                        {partialOnly.map((f) => (
                          <FeatureRow key={f.slug} feature={f} families={families} onFix={addFix} />
                        ))}
                      </ul>
                    </details>
                  )}
                </>
              )}
            </details>
          </div>
        )}
      </Panel>

      <Panel name="preview" title="Preview" open={open.preview} onToggle={togglePanel} className="ec-preview">
        <div className="ec-bar">
          <div className="ec-chips" role="group" aria-label="Preview width">
            {WIDTHS.map((w) => (
              <button key={w.label} type="button" aria-pressed={width === w.value} onClick={() => setWidth(w.value)}>
                {w.label}
                {w.value ? ` ${w.value}` : ""}
              </button>
            ))}
          </div>
          <div className="ec-chips" role="group" aria-label="Colour scheme">
            {DARK_MODES.map((m) => (
              <button key={m.value} type="button" aria-pressed={dark === m.value} onClick={() => setDark(m.value)}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="ec-chips" role="group" aria-label="Preview conditions">
            <button type="button" aria-pressed={imagesOff} onClick={() => setImagesOff((v) => !v)}>
              Images off
            </button>
            <button type="button" aria-pressed={stylesOff} onClick={() => setStylesOff((v) => !v)}>
              Style blocks off
            </button>
          </div>
        </div>
        <p className="ec-dim">
          Showing the output with every applied fix. <span suppressHydrationWarning>{engineNote()}</span>
          {hasSource && height !== null && ` The email is ${height.toLocaleString()}px tall at this width.`}
          {dark === "scheme" && " Dark: your styles turns on the email's own prefers-color-scheme rules, as Apple Mail and Outlook for Mac do."}
          {dark === "invert" && " Dark: inverted flips every colour, as Outlook for Windows does; the Gmail apps and Samsung Email invert only the light ones, so they land between this and Light."}
          {stylesOff && " Style blocks off is roughly what clients without style support show, such as the Gmail app on a non-Google account."}
        </p>
        {hasSource && tooTall && (
          <p className="ec-notice">
            Taller than {OUTLOOK_PAGE_HEIGHT.toLocaleString()}px. Outlook on Windows lays long emails out as pages and draws a line where it breaks them, so
            any single table taller than this gets cut through. Split it into shorter stacked tables.
          </p>
        )}
        <div className="ec-stage">
          {hasSource && (
            <iframe
              ref={frameRef}
              title="Email preview"
              // Same origin so the height can be read; no scripts run in it.
              sandbox="allow-same-origin"
              srcDoc={previewSource(output, imagesOff, stylesOff, dark)}
              onLoad={onFrameLoad}
              style={{ width: width ? `${width}px` : "100%" }}
            />
          )}
        </div>
      </Panel>
    </main>
  );
}
