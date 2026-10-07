"use client";

import { useDeferredValue, useEffect, useId, useState } from "react";
import {
  CANIEMAIL_URL,
  checkEmail,
  getStats,
  matchFeatures,
  type CanIEmailData,
  type ClientSupport,
  type FeatureUse,
  type Level,
} from "@/lib/email-check";

/**
 * Email check: paste an HTML email, get a report and a preview. Nothing leaves
 * the browser except the request for the caniemail.com support data.
 */

const LEVEL_LABEL: Record<Level, string> = { fail: "Problem", warn: "Warning", info: "Note" };

const FAMILIES = ["gmail", "outlook", "apple-mail", "yahoo", "samsung-email", "aol", "protonmail", "thunderbird"];
const DEFAULT_FAMILIES = ["gmail", "outlook", "apple-mail", "yahoo", "samsung-email"];

const WIDTHS = [
  { label: "Phone", value: 375 },
  { label: "Desktop", value: 650 },
  { label: "Full", value: 0 },
];

const MAX_LINES_SHOWN = 8;

function lineList(lines: number[]): string {
  if (!lines.length) return "";
  const shown = lines.slice(0, MAX_LINES_SHOWN).join(", ");
  const rest = lines.length - MAX_LINES_SHOWN;
  return `Line ${shown}${rest > 0 ? ` and ${rest} more` : ""}`;
}

/** What the preview frame is given: the source, minus whatever is switched off. */
function previewSource(src: string, imagesOff: boolean, stylesOff: boolean): string {
  let out = src;
  if (stylesOff) out = out.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  if (imagesOff) {
    out = out
      .replace(/(<img\b[^>]*?\s)src\s*=/gi, "$1data-src=")
      .replace(/url\(\s*(['"]?)[^)'"]*\1\s*\)/gi, "none")
      .replace(/(<(?:table|td|body)\b[^>]*?\s)background\s*=/gi, "$1data-background=");
  }
  return out;
}

function clientNames(support: ClientSupport[]): string {
  return support.map((s) => s.label).join(", ");
}

function FeatureRow({ feature, families }: { feature: FeatureUse; families: string[] }) {
  const relevant = feature.support.filter((s) => families.includes(s.family));
  const no = relevant.filter((s) => s.status === "n");
  const partial = relevant.filter((s) => s.status === "a");
  const notes = [...new Set(partial.flatMap((s) => s.notes))];
  return (
    <li className="ec-item">
      <p className="ec-item-title">
        <a href={feature.url} target="_blank" rel="noreferrer">
          {feature.title}
        </a>
        <span className="ec-dim">
          {" "}
          used {feature.count === 1 ? "once" : `${feature.count} times`}
        </span>
      </p>
      {no.length > 0 && <p>Not supported: {clientNames(no)}</p>}
      {partial.length > 0 && <p>Partial: {clientNames(partial)}</p>}
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
  const [src, setSrc] = useState("");
  const [fileName, setFileName] = useState("");
  const [width, setWidth] = useState(375);
  const [imagesOff, setImagesOff] = useState(false);
  const [stylesOff, setStylesOff] = useState(false);
  const [families, setFamilies] = useState(DEFAULT_FAMILIES);
  const [data, setData] = useState<CanIEmailData | null>(null);
  const [dataError, setDataError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const sourceId = useId();

  const analysed = useDeferredValue(src);

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

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setSrc(await file.text());
    setFileName(file.name);
  };

  const toggleFamily = (family: string) =>
    setFamilies((current) => (current.includes(family) ? current.filter((f) => f !== family) : [...current, family]));

  const hasSource = analysed.trim().length > 0;
  const stats = getStats(analysed);
  const findings = checkEmail(analysed);
  const features = data ? matchFeatures(analysed, data) : [];

  const countIn = (f: FeatureUse, status: "n" | "a") =>
    f.support.filter((s) => families.includes(s.family) && s.status === status).length;
  const unsupported = features.filter((f) => countIn(f, "n") > 0).sort((a, b) => countIn(b, "n") - countIn(a, "n"));
  const partialOnly = features
    .filter((f) => countIn(f, "n") === 0 && countIn(f, "a") > 0)
    .sort((a, b) => countIn(b, "a") - countIn(a, "a"));

  return (
    <main className="ec-tool">
      <section className="ec-panel ec-source" aria-label="Email source">
        <h1>Email check</h1>
        <p className="ec-dim">
          Paste an HTML email or open a file. It is checked in your browser and is not uploaded anywhere.
        </p>

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
          value={src}
          onChange={(e) => {
            setSrc(e.target.value);
            setFileName("");
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="<!DOCTYPE html>"
        />

        {hasSource && (
          <dl className="ec-stats">
            <div>
              <dt>Size</dt>
              <dd>{(stats.bytes / 1024).toFixed(1)}KB</dd>
            </div>
            <div>
              <dt>Lines</dt>
              <dd>{stats.lines}</dd>
            </div>
            <div>
              <dt>Longest line</dt>
              <dd>{stats.longestLine}</dd>
            </div>
            <div>
              <dt>Non-breaking spaces</dt>
              <dd>{stats.nbsp}</dd>
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
        )}

        <p className="ec-foot">
          {/* Plain link, as in LabHeader: proxy.ts rewrites "/" on the lab host. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">lab.finbar.studio</a>
        </p>
      </section>

      <section className="ec-panel ec-report" aria-label="Report" aria-live="polite">
        {!hasSource ? (
          <p className="ec-dim">The report appears here once there is an email to read.</p>
        ) : (
          <>
            <h2>Checks</h2>
            {findings.length === 0 ? (
              <p className="ec-dim">Nothing flagged.</p>
            ) : (
              <ul className="ec-list">
                {findings.map((f) => (
                  <li key={f.id} className="ec-item">
                    <p className="ec-item-title">
                      <span className={`ec-level ec-level-${f.level}`}>{LEVEL_LABEL[f.level]}</span> {f.title}
                    </p>
                    <p>{f.detail}</p>
                    {f.lines.length > 0 && <p className="ec-dim">{lineList(f.lines)}</p>}
                  </li>
                ))}
              </ul>
            )}

            <h2>Client support</h2>
            <p className="ec-dim">
              What this email uses, looked up in the caniemail.com test results
              {data ? ` (updated ${data.last_update_date.slice(0, 10)})` : ""}. It predicts problems; it does not
              replace opening the email in the real client.
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
                    >
                      {data.nicenames.family[family]}
                    </button>
                  ))}
                </div>

                {unsupported.length === 0 ? (
                  <p className="ec-dim">Nothing here is unsupported in the clients selected.</p>
                ) : (
                  <ul className="ec-list">
                    {unsupported.map((f) => (
                      <FeatureRow key={f.slug} feature={f} families={families} />
                    ))}
                  </ul>
                )}

                {partialOnly.length > 0 && (
                  <details className="ec-details">
                    <summary>{partialOnly.length} more with partial support only</summary>
                    <ul className="ec-list">
                      {partialOnly.map((f) => (
                        <FeatureRow key={f.slug} feature={f} families={families} />
                      ))}
                    </ul>
                  </details>
                )}
              </>
            )}
          </>
        )}
      </section>

      <section className="ec-panel ec-preview" aria-label="Preview">
        <div className="ec-bar">
          <div className="ec-chips" role="group" aria-label="Preview width">
            {WIDTHS.map((w) => (
              <button key={w.label} type="button" aria-pressed={width === w.value} onClick={() => setWidth(w.value)}>
                {w.label}
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
          A browser preview, not an email client.
          {stylesOff && " Style blocks off is roughly what clients without style support show, such as the Gmail app on a non-Google account."}
        </p>
        <div className="ec-stage">
          {hasSource && (
            <iframe
              title="Email preview"
              sandbox=""
              srcDoc={previewSource(analysed, imagesOff, stylesOff)}
              style={{ width: width ? `${width}px` : "100%" }}
            />
          )}
        </div>
      </section>
    </main>
  );
}
