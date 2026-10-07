"use client";

import { useDeferredValue, useEffect, useId, useRef, useState } from "react";
import {
  CANIEMAIL_URL,
  DARK_MODE_USE,
  FIXES,
  NOTE_SOURCES,
  OUTLOOK_PAGE_HEIGHT,
  SHARE,
  SHARE_DATE,
  applyFixes,
  checkEmail,
  darkReach,
  fillMergeTags,
  formatShare,
  looksTransactional,
  getStats,
  matchFeatures,
  type CanIEmailData,
  type ClientSupport,
  type Environment,
  type FeatureUse,
  type Finding,
  type FixId,
  type Level,
  type Source,
} from "@/lib/email-check";
import { extractFromPreviewPage, isPreviewUrl } from "@/lib/email-extract";
import { auditDocument, measureNarrow, type A11yReport, type NarrowProbe } from "@/lib/email-a11y";
import { buildReport } from "@/lib/email-report";
import { snapshotDocument } from "@/lib/email-snapshot";

/**
 * Email check: paste an HTML email, get a report and a preview, fix what has
 * one right answer. Nothing leaves the browser except the request for the
 * caniemail.com support data.
 *
 * The output is the source with an ordered list of fixes applied; that is
 * what the report, the preview and the output field all show, so undoing a
 * fix is just taking it off the list.
 */

/** Shown at the foot of the tool and at the top of the copied report. Bump it when the checks change. */
const VERSION = "1.7";

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

const DARK_TIPS: Record<DarkMode, string> = {
  off: "The email as designed",
  scheme: "Turns on the email's own prefers-color-scheme rules, as Apple Mail does",
  invert: "Flips every colour, as Outlook on Windows and the Gmail app on iOS do",
};

/** "about 22% of opens": the clients' share, times how many opens are in dark mode at all. */
function DarkReach({ behaviour }: { behaviour: "own styles" | "partial invert" | "full invert" }) {
  const { share, clients } = darkReach(behaviour);
  return (
    <>
      {clients.join(", ")}: {formatShare(share)} of opens between them. With {Math.round(DARK_MODE_USE * 100)}% of opens in dark mode (Litmus, 2022), that is
      roughly {formatShare(share * DARK_MODE_USE)} of all opens seeing this. The split of a client family between its apps is an estimate.
    </>
  );
}

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

/** Output lines matching a test: how a finding from the rendered page is traced back to the source. */
function linesWhere(src: string, test: (line: string) => boolean): number[] {
  const found: number[] = [];
  src.split("\n").forEach((line, i) => {
    if (test(line)) found.push(i + 1);
  });
  return found;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Where a missing thing goes, where a present thing is, or that it is about the whole email. */
function Where({ lines, insertAfter }: { lines: number[]; insertAfter?: number }) {
  if (lines.length) return <p className="ec-dim">{lineList(lines)}</p>;
  if (insertAfter) return <p className="ec-dim">Not in the email. Add after line {insertAfter}.</p>;
  return <p className="ec-dim">No single line: this is about the email as a whole.</p>;
}

/** The suggested change, collapsed until wanted. Click the code to select it. */
function HowToFix({ text, code, sources }: { text: string; code?: string; sources?: Source[] }) {
  return (
    <details className="ec-note ec-howto">
      <summary>How to fix</summary>
      <div className="ec-note-body">
        <p>
          {text} {sources && <Sources list={sources} none />}
        </p>
        {code && (
          <pre className="ec-code" tabIndex={0} onClick={(e) => window.getSelection()?.selectAllChildren(e.currentTarget)} title="Click to select, then copy">
            {code}
          </pre>
        )}
      </div>
    </details>
  );
}

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
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

const BASIS_LABEL = {
  sourced: { text: "Sourced", tip: "A standard, published test results or the client maker's own documentation says this. Each source was loaded and checked for the claim." },
  checked: { text: "Seen in the file", tip: "True by looking at this email itself. It makes no claim about how mail clients behave." },
  practice: { text: "Unverified", tip: "Common practice among email developers, with no source that could be checked. Shown as a note only; treat it as a prompt to test, not as fact." },
} as const;

/** What a finding rests on, as a small tag. */
function BasisTag({ basis }: { basis: keyof typeof BASIS_LABEL }) {
  return (
    <span className={`ec-basis ec-basis-${basis}`} title={BASIS_LABEL[basis].tip}>
      {BASIS_LABEL[basis].text}
    </span>
  );
}

/** Where a claim comes from, as numbered links: [1][2]. Says so when there is none. */
function Sources({ list, none }: { list: Source[]; none?: boolean }) {
  if (!list.length) {
    return none ? (
      <span className="ec-refs ec-unsourced" title="No citation. This rests on common practice among email developers, not on a source that has been checked.">
        [unsourced]
      </span>
    ) : null;
  }
  return (
    <span className="ec-refs">
      {list.map((s, i) => (
        <a key={s.url} href={s.url} target="_blank" rel="noreferrer" title={`${s.label} (${s.kind})`} aria-label={`Source ${i + 1}: ${s.label}`}>
          [{i + 1}]
        </a>
      ))}
    </span>
  );
}

/** "2 problems · 1 warning · 3 notes", so a closed section still says what is in it. */
function Tally({ fail, warn, info }: { fail: number; warn: number; info: number }) {
  if (!fail && !warn && !info) return <span className="ec-tally ec-dim">nothing flagged</span>;
  return (
    <span className="ec-tally">
      {fail > 0 && <span className="ec-level-fail">{plural(fail, "problem")}</span>}
      {warn > 0 && <span className="ec-level-warn">{plural(warn, "warning")}</span>}
      {info > 0 && <span className="ec-level-info">{plural(info, "note")}</span>}
    </span>
  );
}

function FindingSection({
  title,
  intro,
  findings,
  familyNames,
  onFix,
}: {
  title: string;
  intro: string;
  findings: Finding[];
  familyNames?: Record<string, string>;
  onFix: (id: FixId) => void;
}) {
  const count = (level: Level) => findings.filter((f) => f.level === level).length;
  return (
    <details className="ec-section">
      <summary>
        <h2>{title}</h2>
        <Tally fail={count("fail")} warn={count("warn")} info={count("info")} />
      </summary>
      <p className="ec-dim">{intro}</p>
      {findings.length === 0 ? (
        <p className="ec-dim">Nothing flagged.</p>
      ) : (
        <ul className="ec-list">
          {findings.map((f) => (
            <li key={f.id} className="ec-item">
              <div className="ec-item-head">
                <p className="ec-item-title">
                  <span className={`ec-level ec-level-${f.level}`}>{LEVEL_LABEL[f.level]}</span>
                  {f.a11y && <span className="ec-level ec-level-a11y">Accessibility</span>} {f.title}
                </p>
                <BasisTag basis={f.basis} />
                <span className="ec-share" title={f.affects.length ? f.affects.map((a) => familyNames?.[a] ?? a).join(", ") : "Every client"}>
                  {formatShare(f.share)} of opens
                </span>
                {f.fix && (
                  <button type="button" className="ec-fix" onClick={() => onFix(f.fix!)} title="Applies this fix to the output. Undo it from the strip at the top.">
                    {FIXES[f.fix].label}
                  </button>
                )}
              </div>
              <p>
                {f.detail} <Sources list={f.sources} />
              </p>
              <Where lines={f.lines} insertAfter={f.insertAfter} />
              {f.howTo && <HowToFix text={f.howTo.text} code={f.howTo.code} sources={f.sources} />}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}

/** A titled, collapsible line of information. Closed by default so it costs one line. */
function Note({
  title,
  tone,
  open,
  sources,
  children,
}: {
  title: string;
  tone?: "warn";
  open?: boolean;
  sources?: Source[];
  children: React.ReactNode;
}) {
  return (
    <details className={`ec-note${tone ? ` ec-note-${tone}` : ""}`} open={open}>
      <summary>{title}</summary>
      <div className="ec-note-body">
        {children} {sources && <Sources list={sources} none />}
      </div>
    </details>
  );
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
        {affected > 0 && (
          <span className="ec-share" title={`Share of opens, in the clients selected, that cannot show this (Litmus, ${SHARE_DATE}; split within a family is an estimate)`}>
            {formatShare(affected)} of opens
          </span>
        )}
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
  const [preheader, setPreheader] = useState("");
  const [copied, setCopied] = useState(false);
  const [reportCopied, setReportCopied] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [shot, setShot] = useState<{ busy: boolean; message: string }>({ busy: false, message: "" });
  const [width, setWidth] = useState(650);
  const [dark, setDark] = useState<DarkMode>("off");
  const [imagesOff, setImagesOff] = useState(false);
  const [stylesOff, setStylesOff] = useState(false);
  const [sample, setSample] = useState(true);
  // null: go by what the email looks like.
  const [transactionalChoice, setTransactionalChoice] = useState<boolean | null>(null);
  const [families, setFamilies] = useState(DEFAULT_FAMILIES);
  const [open, setOpen] = useState<Record<PanelName, boolean>>({ source: true, report: true, preview: true });
  const [height, setHeight] = useState<number | null>(null);
  const [a11y, setA11y] = useState<A11yReport | null>(null);
  const [narrow, setNarrow] = useState<NarrowProbe | null>(null);
  const probeRef = useRef<HTMLIFrameElement>(null);
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
    if (!doc?.documentElement) return;
    setHeight(doc.documentElement.scrollHeight);
    setA11y(auditDocument(doc));
  };
  const onFrameLoad = () => {
    measure();
    for (const ms of [600, 2000, 5000]) window.setTimeout(measure, ms);
  };
  // A second, unseen copy at phone width with no style blocks: what a client without media queries shows.
  const onProbeLoad = () => {
    const doc = probeRef.current?.contentDocument;
    if (doc?.documentElement) setNarrow(measureNarrow(doc));
  };

  const load = (text: string, name: string) => {
    setSource(text);
    setFileName(name);
    setFixes([]);
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    // A saved "view online" page is unwrapped, the same as a pasted one.
    if (/class="[^"]*message-body-container/.test(text) && loadPage(text, file.name)) return;
    setLinkState({ busy: false, error: "", notes: [] });
    load(text, file.name);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropping(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      void onFile(file);
      return;
    }
    // A dragged link or a selection of markup, not a file.
    const text = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
    if (text) onSourceChange(text);
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
  // Re-applying moves it to the end, so the latest text wins and Undo last undoes it.
  const applyPreheader = () => {
    if (preheader.trim()) setFixes((current) => [...current.filter((f) => f !== "preheader"), "preheader"]);
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const save = (text: string, name: string, type: string) => {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };
  const baseName = fileName.replace(/\.html?$/i, "") || "email";
  const onDownload = () => save(output, `${baseName}-fixed.html`, "text/html");
  /** The whole preview, as it is showing now, saved as one small image. */
  const onSaveImage = async () => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;
    setShot({ busy: true, message: "" });
    try {
      const snap = await snapshotDocument(doc);
      const ext = snap.blob.type === "image/webp" ? "webp" : "jpg";
      const mode = dark === "off" ? "light" : dark === "scheme" ? "dark-styles" : "dark-inverted";
      const name = `${baseName}-${width || snap.width}px-${mode}${imagesOff ? "-images-off" : ""}${stylesOff ? "-no-style-blocks" : ""}.${ext}`;
      const url = URL.createObjectURL(snap.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
      setShot({
        busy: false,
        message: `Saved ${name}: ${snap.width}×${snap.height}px, ${kb(snap.blob.size)}.${snap.skipped ? ` ${plural(snap.skipped, "image")} could not be read from ${snap.skipped === 1 ? "its" : "their"} host and ${snap.skipped === 1 ? "is" : "are"} shown as a grey box.` : ""}`,
      });
    } catch (err: unknown) {
      setShot({ busy: false, message: err instanceof Error ? err.message : "The picture could not be made." });
    }
  };
  const onDownloadReport = () => save(report, `${baseName}-report.md`, "text/markdown");
  const onCopyReport = async () => {
    await navigator.clipboard.writeText(report);
    setReportCopied(true);
    window.setTimeout(() => setReportCopied(false), 1500);
  };

  const toggleFamily = (family: string) =>
    setFamilies((current) => (current.includes(family) ? current.filter((f) => f !== family) : [...current, family]));

  const togglePanel = (name: PanelName) => setOpen((current) => ({ ...current, [name]: !current[name] }));

  // Minify always runs last, so lines added by the other fixes are tidied too.
  const ordered = fixes.includes("minify") ? [...fixes.filter((id) => id !== "minify"), "minify" as const] : fixes;
  const { src: output, applied } = applyFixes(deferredSource, ordered, { preheader });
  const sampled = fillMergeTags(output);
  const hasSource = deferredSource.trim().length > 0;
  const stats = getStats(output);
  const transactional = transactionalChoice ?? looksTransactional(output);
  const findings = checkEmail(output, { transactional });
  // Fix all leaves out anything marked unverified (common practice with no source behind it).
  // Those keep their own Fix button, so adding one is always a deliberate choice.
  const bulkFixes = [...new Set(findings.filter((f) => f.basis !== "practice").map((f) => f.fix).filter((id): id is FixId => !!id && FIXES[id].bulk))];
  // Minify goes in with Fix all whenever there is indentation left to remove.
  if (stats.indentPct > 0 && !fixes.includes("minify")) bulkFixes.push("minify");
  const unverifiedFixes = new Set(findings.filter((f) => f.basis === "practice" && f.fix && FIXES[f.fix].bulk && !bulkFixes.includes(f.fix)).map((f) => f.fix)).size;
  const minified = fixes.includes("minify");
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
  const report = buildReport({ version: VERSION, fileName, stats, findings, a11y, narrow, features, families, data, applied, transactional, width, height });

  return (
    <main
      className={`ec-tool${dropping ? " is-dropping" : ""}`}
      style={{ gridTemplateColumns: columns.join(" ") }}
      onDragOver={(e) => {
        e.preventDefault();
        setDropping(true);
      }}
      onDragLeave={(e) => {
        // Only when the pointer leaves the tool, not when it crosses a child.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDropping(false);
      }}
      onDrop={onDrop}
    >
      {dropping && (
        <div className="ec-drop" aria-hidden="true">
          Drop the HTML file to check it
        </div>
      )}
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
          <button type="submit" disabled={linkState.busy || !link.trim()} title="Fetches the page on the server (ActiveCampaign hosts only) and unwraps the email from it">
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
          <span title="Reads the file in your browser; nothing is uploaded. You can also drop a file anywhere on the page.">Open or drop an HTML file</span>
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
              <span className="ec-dim" title="Size of the output. Gmail clips a message at about 102KB.">
                {kb(stats.bytes)}
              </span>
              <button
                type="button"
                aria-pressed={minified}
                onClick={() => (minified ? undoFix("minify") : addFixes(["minify"]))}
                title="Removes indentation and blank lines from the output to make the file smaller. Nothing else changes, and it looks the same in every mail client. Press again to put the layout back."
              >
                {minified ? "Minified" : "Minify"}
              </button>
              <button type="button" onClick={() => void onCopy()} title="Copies the output, with every applied fix, to the clipboard">
                {copied ? "Copied" : "Copy"}
              </button>
              <button type="button" onClick={onDownload} title="Saves the output as an .html file">
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
              title="The source with every applied fix. Click to select it all."
            />

            <dl className="ec-stats">
              <div title="Gmail drops a style block over about 16KB">
                <dt>CSS in style blocks</dt>
                <dd>{kb(stats.styleBytes)}</dd>
              </div>
              <div title="The widest fixed width given to a table; 600 to 650px is usual">
                <dt>Width</dt>
                <dd>{stats.width ? `${stats.width}px` : "fluid"}</dd>
              </div>
              <div title="Every non-breaking space in the file; runs of them are what show up as blank space">
                <dt>Non-breaking spaces</dt>
                <dd>{stats.nbsp}</dd>
              </div>
              <div title="The mail standard caps a line at 998 characters">
                <dt>Longest line</dt>
                <dd>{stats.longestLine}</dd>
              </div>
              <div title="Images in the email">
                <dt>Images</dt>
                <dd>{stats.images}</dd>
              </div>
              <div title="Tables in the email, Outlook-only ones included">
                <dt>Tables</dt>
                <dd>{stats.tables}</dd>
              </div>
            </dl>
            <div>
              <p className="ec-dim">Merge tags</p>
              <p>{stats.platform ? `Looks like ${stats.platform}` : "None found"}</p>
            </div>
            <div className="ec-row">
              <span className="ec-label">Kind of email</span>
              <div className="ec-chips" role="group" aria-label="Kind of email">
                <button
                  type="button"
                  aria-pressed={!transactional}
                  onClick={() => setTransactionalChoice(false)}
                  title="Newsletters and campaigns: an unsubscribe link and sender address are expected"
                >
                  Marketing
                </button>
                <button
                  type="button"
                  aria-pressed={transactional}
                  onClick={() => setTransactionalChoice(true)}
                  title="Codes, confirmations and receipts: the unsubscribe and sender-address checks are skipped"
                >
                  Transactional
                </button>
              </div>
            </div>
            <div title="What inbox lists show under the subject: the hidden preheader if there is one, otherwise the first text in the email.">
              <p className="ec-dim">Inbox preview line, as it stands</p>
              <p className="ec-preview-text">{stats.previewText || "(no text)"}</p>
            </div>
            <form
              className="ec-row"
              onSubmit={(e) => {
                e.preventDefault();
                applyPreheader();
              }}
              title="Writes a hidden preheader into the email. It replaces the existing one, or adds one straight after the body tag. It is hidden in every client (mso-hide for Outlook) and padded so the preview stops at the end of your text."
            >
              <label htmlFor={`${outputId}-pre`} className="ec-label">
                Set the preview line
              </label>
              <input
                id={`${outputId}-pre`}
                type="text"
                className="ec-input"
                value={preheader}
                onChange={(e) => setPreheader(e.target.value)}
                placeholder="What the inbox should say under the subject"
                maxLength={200}
              />
              <button type="submit" disabled={!preheader.trim()}>
                {fixes.includes("preheader") ? "Update" : "Apply"}
              </button>
            </form>
          </>
        )}

        <p className="ec-foot">
          {/* Plain link, as in LabHeader: proxy.ts rewrites "/" on the lab host. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" target="_blank" rel="noopener">lab.finbar.studio</a>
          <span title="Version of the email check tool">v{VERSION}</span>
        </p>
      </Panel>

      <Panel name="report" title="Report" open={open.report} onToggle={togglePanel} className="ec-report">
        {!hasSource ? (
          <p className="ec-dim">The report appears here once there is an email to read.</p>
        ) : (
          <div aria-live="polite">
            <div className="ec-sticky">
              <div className="ec-row">
                <button
                  type="button"
                  className="ec-primary"
                  onClick={() => addFixes(bulkFixes)}
                  disabled={bulkFixes.length === 0}
                  title={`Applies every fix that has a source or can be seen in the file. Unverified ones are left alone${unverifiedFixes ? ` (${unverifiedFixes} here, each with its own Fix button)` : ""}.`}
                >
                  {bulkFixes.length ? `Fix all (${bulkFixes.length})` : "Nothing left to fix"}
                </button>
                <button type="button" onClick={() => undoFix(fixes[fixes.length - 1])} disabled={fixes.length === 0}>
                  Undo last
                </button>
                <span className="ec-row-end">
                  <button
                    type="button"
                    onClick={() => void onCopyReport()}
                    title={`Copies the whole report as compact text (${kb(new TextEncoder().encode(report).length)}), ready to paste into a chat with an assistant`}
                  >
                    {reportCopied ? "Copied" : "Copy report"}
                  </button>
                  <button type="button" onClick={onDownloadReport} title="Saves the report as a small .md file">
                    Save report
                  </button>
                </span>
                {applied.length > 0 && (
                  <details className="ec-note ec-applied-list">
                    <summary>{plural(applied.length, "fix")} applied</summary>
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
                  </details>
                )}
              </div>
            </div>

            <p className="ec-dim ec-intro">
              Every finding says what it rests on: <BasisTag basis="sourced" /> <BasisTag basis="checked" /> <BasisTag basis="practice" />. Unverified ones
              are never more than a note. Each section is ordered by severity, then by the share of opens it reaches (
              <a href={NOTE_SOURCES.share[0].url} target="_blank" rel="noreferrer">
                Litmus, {SHARE_DATE}
              </a>
              ). Line numbers are lines of the Output.
            </p>
            <FindingSection title="Content and links" intro="What the email says and where its links go: wording, placeholders, link destinations, alt text." findings={findings.filter((f) => f.group === "content")} familyNames={data?.nicenames.family} onFix={addFix} />
            <FindingSection title="Code" intro="How the email is built: markup, Outlook, Apple Mail and Gmail quirks, image and table attributes." findings={findings.filter((f) => f.group === "code")} familyNames={data?.nicenames.family} onFix={addFix} />

            <details className="ec-section">
              <summary>
                <h2>As rendered</h2>
                <Tally
                  fail={a11y ? a11y.contrast.length + a11y.linksWithoutName.length + a11y.imagesWithoutAlt.length + (a11y.overflow > 0 ? 1 : 0) : 0}
                  warn={(a11y?.targets.length ? 1 : 0) + (narrow && narrow.contentWidth > narrow.viewport + 1 ? 1 : 0)}
                  info={(a11y?.smallTargets ? 1 : 0) + (a11y?.contrastUnknown ? 1 : 0)}
                />
              </summary>
              <p className="ec-dim">
                Measured in the preview at {width ? `${width}px` : "the frame's width"}{dark !== "off" ? " in the dark mode shown" : ""}, with the real computed colours and sizes.
                Contrast is WCAG AA: 4.5:1 for text, 3:1 for large text.
              </p>
              {!a11y ? (
                <p className="ec-dim">Waiting for the preview.</p>
              ) : (
                <ul className="ec-list">
                  {a11y.overflow > 0 && (
                    <li className="ec-item">
                      <p className="ec-item-title">
                        <span className="ec-level ec-level-fail">Problem</span> Scrolls sideways at this width
                      </p>
                      <p>
                        The content is {a11y.viewport + a11y.overflow}px wide in a {a11y.viewport}px view{stylesOff ? ", with style blocks off" : ""}. Something
                        has a fixed width wider than the screen.
                      </p>
                    </li>
                  )}
                  {narrow && narrow.contentWidth > narrow.viewport + 1 && (
                    <li className="ec-item">
                      <p className="ec-item-title">
                        <span className="ec-level ec-level-warn">Warning</span> Without style blocks it is {narrow.contentWidth}px wide on a {narrow.viewport}px
                        phone
                      </p>
                      <p>
                        The phone layout depends entirely on the media queries in the style block. A client that drops style blocks shows the desktop layout,
                        which scrolls sideways or is shrunk until the text is tiny. That is the Gmail app when the account is not a Google one, Gmail in a phone
                        browser, and any Gmail view where the style block has been thrown away for size or an error. There is no published figure for how
                        many opens that is; it is a small share, not zero. <Sources list={NOTE_SOURCES.stylesOff} />
                      </p>
                      <p className="ec-dim">{narrow.offenders.map((o) => o.label).join(" · ")}</p>
                      <Where lines={[...new Set(narrow.offenders.flatMap((o) => linesWhere(output, (l) => l.includes(o.openTag))))].sort((x, y) => x - y)} />
                      <HowToFix
                        text="Make the layout shrink on its own, so the media queries only improve it. Wide images: set the width in the style as a percentage with a pixel max-width (Outlook keeps using the width attribute). Side-by-side columns: build them from inline-block blocks that wrap when there is no room, with a table inside an Outlook conditional to hold them in a row there (the 'hybrid' method), instead of fixed-width cells."
                        code={'<img src="…" width="600" style="display:block; width:100%; max-width:600px; height:auto;" alt="…">\n\n<!--[if mso]><table role="presentation" width="470"><tr><td width="230" valign="top"><![endif]-->\n<div style="display:inline-block; width:100%; max-width:230px; vertical-align:top;"> … column 1 … </div>\n<!--[if mso]></td><td width="230" valign="top"><![endif]-->\n<div style="display:inline-block; width:100%; max-width:230px; vertical-align:top;"> … column 2 … </div>\n<!--[if mso]></td></tr></table><![endif]-->'}
                      />
                    </li>
                  )}
                  {narrow && narrow.contentWidth <= narrow.viewport + 1 && (
                    <li className="ec-item">
                      <p className="ec-item-title">
                        <span className="ec-level ec-level-ok">Pass</span> Still fits a {narrow.viewport}px phone with style blocks removed
                      </p>
                    </li>
                  )}
                  {a11y.contrast.length === 0 && a11y.contrastUnknown === 0 && (
                    <li className="ec-item">
                      <p className="ec-item-title">
                        <span className="ec-level ec-level-ok">Pass</span> Every text colour meets AA against its background
                      </p>
                    </li>
                  )}
                  {a11y.contrast.map((c) => (
                    <li key={`${c.color}${c.background}${c.large}`} className="ec-item">
                      <p className="ec-item-title">
                        <span className="ec-level ec-level-fail">Problem</span> Contrast {c.ratio}:1, needs {c.required}:1
                      </p>
                      <p>
                        <span className="ec-swatch" style={{ color: c.color, background: c.background }}>
                          {c.color} on {c.background}
                        </span>{" "}
                        &quot;{c.text}&quot;{c.large ? " (large text)" : ""} <Sources list={NOTE_SOURCES.contrast} />
                      </p>
                      <Where lines={linesWhere(output, (l) => new RegExp(`(?<![-\\w])color\\s*:\\s*${escapeRegExp(c.color)}`, "i").test(l))} />
                      <HowToFix
                        text={`Darken or lighten the text until it reaches ${c.required}:1. The nearest shade of this colour that passes on ${c.background} is ${c.suggestion}. If the colour is a brand colour you cannot change, make the text larger and bold (24px, or 19px bold, needs only 3:1) or change the background.`}
                        code={`color: ${c.suggestion};`}
                      />
                    </li>
                  ))}
                  {a11y.contrastUnknown > 0 && (
                    <li className="ec-item">
                      <p className="ec-item-title">
                        <span className="ec-level ec-level-info">Note</span> {a11y.contrastUnknown} text {a11y.contrastUnknown === 1 ? "block sits" : "blocks sit"} on a background image
                      </p>
                      <p>Contrast over an image cannot be measured here. Check it by eye, and remember Outlook on Windows shows the background colour instead.</p>
                    </li>
                  )}
                  {a11y.linksWithoutName.map((href) => (
                    <li key={href} className="ec-item">
                      <p className="ec-item-title">
                        <span className="ec-level ec-level-fail">Problem</span> Link with no accessible name
                      </p>
                      <p className="ec-dim">
                        {href} <Sources list={NOTE_SOURCES.linkName} />
                      </p>
                      <Where
                        lines={(() => {
                          const forms = [href, href.replace(/&/g, "&amp;")];
                          // The line where the link wraps an image; failing that, any line with the link.
                          const withImage = linesWhere(output, (l) => forms.some((h) => new RegExp(`<a\\b[^>]*href="${escapeRegExp(h)}"[^>]*>\\s*<img\\b`, "i").test(l)));
                          return withImage.length ? withImage : linesWhere(output, (l) => forms.some((h) => l.includes(`href="${h}"`)));
                        })()}
                      />
                      <HowToFix
                        text="Say where the link goes, in the image's alt text or an aria-label. If it is an arrow beside a text link to the same place, hide the duplicate from screen readers instead."
                        code={`<a href="${href}"><img src="…" alt="Where this link goes" …></a>\n<a href="${href}" aria-hidden="true" tabindex="-1"><img src="…" alt="" …></a>  <!-- duplicate -->`}
                      />
                    </li>
                  ))}
                  {a11y.imagesWithoutAlt.map((name) => (
                    <li key={name} className="ec-item">
                      <p className="ec-item-title">
                        <span className="ec-level ec-level-fail">Problem</span> Image with no alt: {name} <Sources list={NOTE_SOURCES.alt} />
                      </p>
                      <Where lines={name ? linesWhere(output, (l) => l.includes(name) && /<img\b/i.test(l)) : []} />
                      <HowToFix
                        text="Describe what the image says or shows. If it is purely decorative, give it an empty alt so screen readers skip it."
                        code={'<img src="…" alt="What the image shows" …>\n<img src="…" alt="" …>  <!-- decorative -->'}
                      />
                    </li>
                  ))}
                  {a11y.targets.length > 0 && (
                    <li className="ec-item">
                      <p className="ec-item-title">
                        <span className="ec-level ec-level-warn">Warning</span> {plural(a11y.targets.length, "link or button", "links or buttons")} with a tap area under 24px
                      </p>
                      <p>
                        Only the link itself is clickable, not the padded cell around it, so a text link in a button is as tall as its text. Put the padding on the
                        link (display:block) to make the whole button tappable. 24×24px passes WCAG 2.2; 44×44px is the usual guide for thumbs.
                      </p>
                      <p className="ec-dim">
                        {a11y.targets
                          .slice(0, 6)
                          .map((t) => `"${t.text}" ${t.width}×${t.height}`)
                          .join(" · ")}
                        {a11y.targets.length > 6 ? ` and ${a11y.targets.length - 6} more` : ""} <Sources list={NOTE_SOURCES.target} />
                      </p>
                      <Where
                        lines={[
                          ...new Set(
                            a11y.targets.flatMap((t) => (t.text.length >= 4 ? linesWhere(output, (l) => /<a\b/i.test(l) && l.includes(t.text.replace(/…$/, ""))) : [])),
                          ),
                        ].sort((x, y) => x - y)}
                      />
                      <HowToFix
                        text="Move the padding from the cell onto the link and make the link a block, so the whole button is the tap area. Keep the cell's background colour so Outlook, which ignores padding on links, still shows a button."
                        code={'<td bgcolor="#ff0066" style="border-radius:6px;">\n  <a href="…" style="display:block; padding:12px 20px; font-size:14px; line-height:20px; color:#ffffff; text-decoration:none;">Start your property search</a>\n</td>'}
                      />
                    </li>
                  )}
                  {a11y.smallTargets > 0 && (
                    <li className="ec-item">
                      <p className="ec-item-title">
                        <span className="ec-level ec-level-info">Note</span> {plural(a11y.smallTargets, "link or button", "links or buttons")} between 24 and 44px
                      </p>
                      <p>These pass WCAG but are fiddly for thumbs. Padding on the link itself, not just the cell, enlarges the tap area.</p>
                    </li>
                  )}
                </ul>
              )}
            </details>

            <details className="ec-section">
              <summary>
                <h2>Client support</h2>
                <span className="ec-tally ec-dim">{data ? `${plural(unsupported.length, "feature")} unsupported somewhere` : ""}</span>
              </summary>
              <p className="ec-dim">
                What this email uses, looked up in the{" "}
                <a href={NOTE_SOURCES.caniemail[0].url} target="_blank" rel="noreferrer">
                  caniemail.com
                </a>{" "}
                test results{data ? ` (updated ${data.last_update_date.slice(0, 10)})` : ""}, ordered by
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
                      <button
                        key={family}
                        type="button"
                        aria-pressed={families.includes(family)}
                        onClick={() => toggleFamily(family)}
                        title={`${formatShare(SHARE[family] ?? 0)} of opens (Litmus, ${SHARE_DATE}). Click to include or leave out this client family.`}
                      >
                        {data.nicenames.family[family]} <span className="ec-client-share">{formatShare(SHARE[family] ?? 0)}</span>
                      </button>
                    ))}
                  </div>

                  <dl
                    className="ec-env"
                    aria-label="Opens reaching something unsupported, by environment"
                    title="Of the opens on each kind of device, how many land on a client that cannot show at least one thing this email uses. The split of a client family between its apps is an estimate."
                  >
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
                    <button
                      type="button"
                      className="ec-primary"
                      onClick={() => addFixes(clientFixes)}
                      disabled={clientFixes.length === 0}
                      title="Applies the client fixes that need no design decision: styles into the head, unused font links, font fallbacks, a colour behind background images, table roles"
                    >
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
        <div className="ec-notes-row">
          <details className="ec-controls" open>
          <summary>Preview controls</summary>
          <div className="ec-bar">
            <div className="ec-chips" role="group" aria-label="Preview width">
              {WIDTHS.map((w) => (
                <button
                  key={w.label}
                  type="button"
                  aria-pressed={width === w.value}
                  onClick={() => setWidth(w.value)}
                  title={w.value ? `Preview at ${w.value}px wide` : "Preview as wide as the frame"}
                >
                  {w.label}
                  {w.value ? ` ${w.value}` : ""}
                </button>
              ))}
            </div>
            <div className="ec-chips" role="group" aria-label="Colour scheme">
              {DARK_MODES.map((m) => (
                <button key={m.value} type="button" aria-pressed={dark === m.value} onClick={() => setDark(m.value)} title={DARK_TIPS[m.value]}>
                  {m.label}
                </button>
              ))}
            </div>
            <div className="ec-chips" role="group" aria-label="Preview conditions">
              <button type="button" aria-pressed={imagesOff} onClick={() => setImagesOff((v) => !v)} title="Hides every image, as a reader sees the email before allowing them">
                Images off
              </button>
              <button
                type="button"
                aria-pressed={sample}
                onClick={() => setSample((v) => !v)}
                title="Fills name and email merge tags with a sample person in the preview only. The output keeps the tags."
              >
                Sample data
              </button>
              <button
                type="button"
                onClick={() => void onSaveImage()}
                disabled={!hasSource || shot.busy}
                title="Saves the whole preview, top to bottom, exactly as it is showing now (width, dark mode, images, sample data) as one small image"
              >
                {shot.busy ? "Saving" : "Save image"}
              </button>
              <button type="button" aria-pressed={stylesOff} onClick={() => setStylesOff((v) => !v)} title="Drops the style blocks and leaves inline styles only, as Gmail does for non-Google accounts">
                Style blocks off
              </button>
            </div>
          </div>
          </details>
          <Note title="What this preview is">
            Showing the output with every applied fix. <span suppressHydrationWarning>{engineNote()}</span>
          </Note>
          {hasSource && height !== null && (
            <Note title={`Height ${height.toLocaleString()}px${tooTall ? ", over Outlook's page limit" : ""}`} tone={tooTall ? "warn" : undefined} sources={NOTE_SOURCES.height}>
              {tooTall
                ? `Taller than ${OUTLOOK_PAGE_HEIGHT.toLocaleString()}px at this width. Outlook on Windows lays long emails out as pages and draws a line where it breaks them, so any single table taller than this gets cut through. Split it into shorter stacked tables.`
                : `Measured at this width with images loaded. Outlook on Windows draws a page-break line through content taller than ${OUTLOOK_PAGE_HEIGHT.toLocaleString()}px.`}
            </Note>
          )}
          {hasSource && sample && sampled.filled.length + sampled.left.length + sampled.bare.length > 0 && (
            <Note title={`Sample data: ${plural(sampled.filled.length + sampled.bare.length, "placeholder")} filled`}>
              {sampled.filled.length > 0 && <>Showing {sampled.filled.join(", ")}. </>}
              {sampled.bare.length > 0 && (
                <>
                  Also showing {sampled.bare.join(", ")}: {sampled.bare.length === 1 ? "that is a plain word in the email, not a merge tag" : "those are plain words in the email, not merge tags"}, so check the sender really replaces {sampled.bare.length === 1 ? "it" : "them"}.{" "}
                </>
              )}
              These are still variables in the email. The preview fills them in to show the email as it would be delivered; the output and the report keep
              the tags as written.
              {sampled.left.length > 0 && <> No sample value for {sampled.left.join(", ")}, so {sampled.left.length === 1 ? "it is" : "they are"} shown as written.</>}
            </Note>
          )}
          {shot.message && <Note title={shot.message.startsWith("Saved") ? "Image saved" : "Image not saved"} open>{shot.message}</Note>}
          {dark === "scheme" && (
            <Note title={`Dark: your styles, about ${formatShare(darkReach("own styles").share * DARK_MODE_USE)} of opens`} sources={NOTE_SOURCES.dark} open>
              Turns on the email&apos;s own prefers-color-scheme rules and changes nothing else. If the email has none, this looks the same as Light, which is
              what these readers get. <DarkReach behaviour="own styles" />
            </Note>
          )}
          {dark === "invert" && (
            <Note title={`Dark: inverted, about ${formatShare(darkReach("full invert").share * DARK_MODE_USE)} of opens`} sources={NOTE_SOURCES.dark} open>
              Flips every colour, light and dark. <DarkReach behaviour="full invert" /> A further {formatShare(darkReach("partial invert").share * DARK_MODE_USE)}{" "}
              ({darkReach("partial invert").clients.join(", ")}) get a partial invert, where only light backgrounds are darkened: between this and Light, and not
              previewed here.
            </Note>
          )}
          {stylesOff && (
            <Note title="Style blocks off" sources={NOTE_SOURCES.stylesOff}>
              Roughly what clients without style support show, such as the Gmail app on a non-Google account: inline styles only, no media queries.
            </Note>
          )}
          {imagesOff && <Note title="Images off" sources={NOTE_SOURCES.imagesOff}>What a reader sees before they allow images, which is Outlook&apos;s default. Alt text and background colours do the work here.</Note>}
        </div>
        {hasSource && (
          <iframe
            ref={probeRef}
            className="ec-probe"
            title=""
            aria-hidden="true"
            tabIndex={-1}
            sandbox="allow-same-origin"
            srcDoc={previewSource(output, true, true, "off")}
            onLoad={onProbeLoad}
          />
        )}
        <div className="ec-stage">
          {hasSource && (
            <iframe
              ref={frameRef}
              title="Email preview"
              // Same origin so the height can be read; no scripts run in it.
              sandbox="allow-same-origin"
              srcDoc={previewSource(sample ? sampled.src : output, imagesOff, stylesOff, dark)}
              onLoad={onFrameLoad}
              style={{ width: width ? `${width}px` : "100%" }}
            />
          )}
        </div>
      </Panel>
    </main>
  );
}
