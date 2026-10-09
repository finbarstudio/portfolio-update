"use client";

import { useEffect, useRef, useState } from "react";
import BrandWordmark from "@/components/BrandWordmark";

/**
 * The studio's invoice maker (lab.finbar.studio/invoice).
 *
 * A form on the left and the finished A4 page on the right, updating as you
 * type. It makes invoices, quotes and receipts: line items with a quantity,
 * unit and rate, an optional discount and tax, anything already paid, and the
 * amount due. "Print or save as PDF" hands the page to the browser's print
 * dialog, which gives a proper text PDF with nothing else on it.
 *
 * Nothing is sent anywhere. The draft and the studio's own details (address,
 * bank details, the last number used) are kept in this browser only, so the
 * next invoice starts with them filled in. "Save file" and "Open file" write
 * and read a small .json copy of an invoice for the records.
 */

type Kind = "Invoice" | "Quote" | "Receipt";
type Currency = "GBP" | "EUR" | "USD" | "AUD";
type Unit = "" | "hours" | "days" | "items";

interface Item {
  id: number;
  what: string;
  detail: string;
  qty: number;
  unit: Unit;
  rate: number;
}

interface Party {
  name: string;
  contact: string;
  address: string;
  email: string;
}

interface Studio extends Party {
  phone: string;
  web: string;
  /** anything that has to appear by law or by habit: company number, UTR */
  extra: string;
}

interface Pay {
  accountName: string;
  bank: string;
  sortCode: string;
  account: string;
  iban: string;
  swift: string;
  link: string;
}

interface Doc {
  kind: Kind;
  number: string;
  issued: string;
  /** days until payment is due; -1 means a date typed by hand */
  terms: number;
  due: string;
  reference: string;
  project: string;
  currency: Currency;
  from: Studio;
  to: Party;
  items: Item[];
  discountKind: "none" | "percent" | "amount";
  discount: number;
  taxOn: boolean;
  taxLabel: string;
  taxRate: number;
  paid: number;
  pay: Pay;
  notes: string;
}

const KEY = "finbar-invoice-v1";
const KINDS: Kind[] = ["Invoice", "Quote", "Receipt"];
const CURRENCIES: Currency[] = ["GBP", "EUR", "USD", "AUD"];
const TERMS: { days: number; label: string }[] = [
  { days: 0, label: "On receipt" },
  { days: 7, label: "7 days" },
  { days: 14, label: "14 days" },
  { days: 30, label: "30 days" },
  { days: -1, label: "Pick a date" },
];

const today = () => new Date().toISOString().slice(0, 10);
const addDays = (date: string, days: number) => {
  const d = new Date(`${date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const longDate = (date: string) => {
  const d = new Date(`${date}T12:00:00`);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};
/** FS-2026-009 becomes FS-2026-010: the last run of digits goes up by one, keeping its zeros. */
const nextNumber = (number: string) =>
  /\d+(?!.*\d)/.test(number) ? number.replace(/\d+(?!.*\d)/, (n) => String(Number(n) + 1).padStart(n.length, "0")) : `${number}-2`;

const blankItem = (id: number): Item => ({ id, what: "", detail: "", qty: 1, unit: "", rate: 0 });

function fresh(): Doc {
  const issued = today();
  return {
    kind: "Invoice",
    number: `FS-${issued.slice(0, 4)}-001`,
    issued,
    terms: 14,
    due: addDays(issued, 14),
    reference: "",
    project: "",
    currency: "GBP",
    from: { name: "Finbar Studio", contact: "Finbar Skitini", address: "London", email: "finbar@finbar.studio", phone: "+44 7876 492551", web: "www.finbar.studio", extra: "" },
    to: { name: "", contact: "", address: "", email: "" },
    items: [blankItem(1)],
    discountKind: "none",
    discount: 0,
    taxOn: false,
    taxLabel: "VAT",
    taxRate: 20,
    paid: 0,
    pay: { accountName: "", bank: "", sortCode: "", account: "", iban: "", swift: "", link: "" },
    notes: "",
  };
}

/** Whatever was stored or opened, laid over a fresh invoice so a missing field never breaks the page. */
function restore(saved: unknown): Doc {
  const base = fresh();
  if (!saved || typeof saved !== "object") return base;
  const s = saved as Partial<Doc>;
  return {
    ...base,
    ...s,
    from: { ...base.from, ...s.from },
    to: { ...base.to, ...s.to },
    pay: { ...base.pay, ...s.pay },
    items: Array.isArray(s.items) && s.items.length ? s.items.map((item, i) => ({ ...blankItem(i + 1), ...item, id: i + 1 })) : base.items,
  };
}

const num = (text: string) => {
  const n = Number(text);
  return Number.isFinite(n) ? n : 0;
};

function sums(doc: Doc) {
  const subtotal = doc.items.reduce((total, item) => total + item.qty * item.rate, 0);
  const discount = doc.discountKind === "percent" ? (subtotal * doc.discount) / 100 : doc.discountKind === "amount" ? doc.discount : 0;
  const net = Math.max(0, subtotal - discount);
  const tax = doc.taxOn ? (net * doc.taxRate) / 100 : 0;
  const total = net + tax;
  return { subtotal, discount, tax, total, due: total - doc.paid };
}

export default function InvoiceTool() {
  const [doc, setDoc] = useState<Doc>(fresh);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const stage = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLInputElement>(null);

  // pick up the last draft once the page is in the browser
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setDoc(restore(JSON.parse(saved)));
    } catch { /* a draft that will not parse is simply ignored */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify(doc)); } catch { /* storage is full or switched off */ }
  }, [doc, loaded]);

  // the A4 page is drawn at its real size and scaled to fit the space it has
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, (el.clientWidth - 48) / 794));
    fit();
    const watch = new ResizeObserver(fit);
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  const set = <K extends keyof Doc>(key: K, value: Doc[K]) => setDoc((d) => ({ ...d, [key]: value }));
  const setFrom = (key: keyof Studio, value: string) => setDoc((d) => ({ ...d, from: { ...d.from, [key]: value } }));
  const setTo = (key: keyof Party, value: string) => setDoc((d) => ({ ...d, to: { ...d.to, [key]: value } }));
  const setPay = (key: keyof Pay, value: string) => setDoc((d) => ({ ...d, pay: { ...d.pay, [key]: value } }));
  const setItem = (id: number, change: Partial<Item>) => setDoc((d) => ({ ...d, items: d.items.map((item) => (item.id === id ? { ...item, ...change } : item)) }));
  const setIssued = (issued: string) => setDoc((d) => ({ ...d, issued, due: d.terms >= 0 ? addDays(issued, d.terms) : d.due }));
  const setTerms = (terms: number) => setDoc((d) => ({ ...d, terms, due: terms >= 0 ? addDays(d.issued, terms) : d.due }));
  const addItem = () => setDoc((d) => ({ ...d, items: [...d.items, blankItem(Math.max(0, ...d.items.map((item) => item.id)) + 1)] }));
  const dropItem = (id: number) => setDoc((d) => ({ ...d, items: d.items.length > 1 ? d.items.filter((item) => item.id !== id) : [blankItem(1)] }));
  const moveItem = (id: number, by: number) =>
    setDoc((d) => {
      const from = d.items.findIndex((item) => item.id === id);
      const to = from + by;
      if (from < 0 || to < 0 || to >= d.items.length) return d;
      const items = [...d.items];
      const [moved] = items.splice(from, 1);
      if (moved) items.splice(to, 0, moved);
      return { ...d, items };
    });

  /** A new document for the next job: the studio and bank details stay, the number goes up by one. */
  const startNew = () => {
    if (!window.confirm("Start a new one? The client and line items on this one will be cleared.")) return;
    setDoc((d) => ({ ...fresh(), kind: d.kind, currency: d.currency, terms: d.terms >= 0 ? d.terms : 14, due: addDays(today(), d.terms >= 0 ? d.terms : 14), from: d.from, pay: d.pay, taxOn: d.taxOn, taxLabel: d.taxLabel, taxRate: d.taxRate, notes: d.notes, number: nextNumber(d.number) }));
  };

  const fileName = `${doc.number} ${doc.to.name}`.trim().replace(/[\\/:*?"<>|]+/g, "-") || doc.kind;

  const print = () => {
    // the browser offers the tab's title as the PDF's file name
    const title = document.title;
    document.title = fileName;
    window.print();
    window.setTimeout(() => { document.title = title; }, 500);
  };
  const saveFile = () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" }));
    link.download = `${fileName}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  const openFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      setDoc(restore(JSON.parse(await file.text())));
    } catch {
      window.alert("That file could not be read as a saved invoice.");
    }
  };

  const money = (amount: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: doc.currency }).format(amount);
  const total = sums(doc);
  const lines = (text: string) => text.split("\n").filter((line) => line.trim());
  const shown = doc.items.filter((item) => item.what.trim() || item.rate);
  const bank: [string, string][] = ([
    ["Account name", doc.pay.accountName],
    ["Bank", doc.pay.bank],
    ["Sort code", doc.pay.sortCode],
    ["Account number", doc.pay.account],
    ["IBAN", doc.pay.iban],
    ["SWIFT / BIC", doc.pay.swift],
    ["Pay online", doc.pay.link],
  ] as [string, string][]).filter(([, value]) => value.trim());
  const dueLabel = doc.kind === "Quote" ? "Valid until" : "Due";
  const totalLabel = doc.kind === "Quote" ? "Quote total" : doc.kind === "Receipt" ? "Balance" : "Amount due";

  const text = (label: string, value: string, onChange: (value: string) => void, more: { type?: string; placeholder?: string; wide?: boolean } = {}) => (
    <label className={`inv-field${more.wide ? " is-wide" : ""}`}>
      <span>{label}</span>
      <input type={more.type ?? "text"} value={value} placeholder={more.placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
  const area = (label: string, value: string, onChange: (value: string) => void, rows = 3, placeholder?: string) => (
    <label className="inv-field is-wide">
      <span>{label}</span>
      <textarea value={value} rows={rows} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );

  return (
    <div className="inv-tool">
      <aside className="inv-panel">
        <header className="inv-top">
          <h1>Invoice maker</h1>
          <div className="inv-seg" role="group" aria-label="Document">
            {KINDS.map((kind) => (
              <button type="button" key={kind} data-on={doc.kind === kind ? "1" : "0"} onClick={() => set("kind", kind)}>{kind}</button>
            ))}
          </div>
        </header>

        <section>
          <h2>Details</h2>
          <div className="inv-grid">
            {text("Number", doc.number, (v) => set("number", v))}
            <label className="inv-field">
              <span>Currency</span>
              <select value={doc.currency} onChange={(e) => set("currency", e.target.value as Currency)}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            {text("Issued", doc.issued, setIssued, { type: "date" })}
            <label className="inv-field">
              <span>{doc.kind === "Quote" ? "Valid for" : "Payment terms"}</span>
              <select value={doc.terms} onChange={(e) => setTerms(Number(e.target.value))}>
                {TERMS.map((t) => <option key={t.days} value={t.days}>{t.label}</option>)}
              </select>
            </label>
            {doc.terms < 0 ? text(dueLabel, doc.due, (v) => set("due", v), { type: "date" }) : null}
            {text("Project", doc.project, (v) => set("project", v), { wide: true, placeholder: "What the work was" })}
            {text("Their reference or PO", doc.reference, (v) => set("reference", v), { wide: true })}
          </div>
        </section>

        <section>
          <h2>Billed to</h2>
          <div className="inv-grid">
            {text("Client", doc.to.name, (v) => setTo("name", v), { wide: true, placeholder: "Company or person" })}
            {text("Contact", doc.to.contact, (v) => setTo("contact", v))}
            {text("Email", doc.to.email, (v) => setTo("email", v), { type: "email" })}
            {area("Address", doc.to.address, (v) => setTo("address", v))}
          </div>
        </section>

        <section>
          <h2>Line items</h2>
          <div className="inv-items">
            {doc.items.map((item, i) => (
              <div className="inv-item" key={item.id}>
                <input aria-label={`Item ${i + 1}`} className="inv-item-what" value={item.what} placeholder="What it is" onChange={(e) => setItem(item.id, { what: e.target.value })} />
                <input aria-label={`Item ${i + 1} detail`} className="inv-item-detail" value={item.detail} placeholder="A line of detail (optional)" onChange={(e) => setItem(item.id, { detail: e.target.value })} />
                <div className="inv-item-nums">
                  <label><span>Qty</span><input type="number" min="0" step="any" value={item.qty} onChange={(e) => setItem(item.id, { qty: num(e.target.value) })} /></label>
                  <label>
                    <span>Unit</span>
                    <select value={item.unit} onChange={(e) => setItem(item.id, { unit: e.target.value as Unit })}>
                      <option value="">None</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="items">Items</option>
                    </select>
                  </label>
                  <label><span>Rate</span><input type="number" min="0" step="any" value={item.rate} onChange={(e) => setItem(item.id, { rate: num(e.target.value) })} /></label>
                  <output aria-label="Amount">{money(item.qty * item.rate)}</output>
                </div>
                <div className="inv-item-acts">
                  <button type="button" onClick={() => moveItem(item.id, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                  <button type="button" onClick={() => moveItem(item.id, 1)} disabled={i === doc.items.length - 1} aria-label="Move down">↓</button>
                  <button type="button" onClick={() => dropItem(item.id)} aria-label="Remove this item">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="inv-add" onClick={addItem}>Add a line</button>
        </section>

        <section>
          <h2>Totals</h2>
          <div className="inv-grid">
            <label className="inv-field">
              <span>Discount</span>
              <select value={doc.discountKind} onChange={(e) => set("discountKind", e.target.value as Doc["discountKind"])}>
                <option value="none">None</option>
                <option value="percent">Percent</option>
                <option value="amount">Amount</option>
              </select>
            </label>
            {doc.discountKind !== "none" ? (
              <label className="inv-field">
                <span>{doc.discountKind === "percent" ? "Percent off" : "Amount off"}</span>
                <input type="number" min="0" step="any" value={doc.discount} onChange={(e) => set("discount", num(e.target.value))} />
              </label>
            ) : <span />}
            <label className="inv-check is-wide">
              <input type="checkbox" checked={doc.taxOn} onChange={(e) => set("taxOn", e.target.checked)} />
              <span>Add tax</span>
            </label>
            {doc.taxOn ? (
              <>
                {text("Tax name", doc.taxLabel, (v) => set("taxLabel", v))}
                <label className="inv-field">
                  <span>Rate, percent</span>
                  <input type="number" min="0" step="any" value={doc.taxRate} onChange={(e) => set("taxRate", num(e.target.value))} />
                </label>
              </>
            ) : null}
            <label className="inv-field is-wide">
              <span>Already paid (a deposit, say)</span>
              <input type="number" min="0" step="any" value={doc.paid} onChange={(e) => set("paid", num(e.target.value))} />
            </label>
          </div>
        </section>

        <section>
          <h2>How to pay</h2>
          <div className="inv-grid">
            {text("Account name", doc.pay.accountName, (v) => setPay("accountName", v), { wide: true })}
            {text("Bank", doc.pay.bank, (v) => setPay("bank", v), { wide: true })}
            {text("Sort code", doc.pay.sortCode, (v) => setPay("sortCode", v))}
            {text("Account number", doc.pay.account, (v) => setPay("account", v))}
            {text("IBAN", doc.pay.iban, (v) => setPay("iban", v), { wide: true })}
            {text("SWIFT / BIC", doc.pay.swift, (v) => setPay("swift", v))}
            {text("Payment link", doc.pay.link, (v) => setPay("link", v))}
          </div>
          <p className="inv-note">These stay in this browser only. Nothing typed here is sent anywhere.</p>
        </section>

        <section>
          <h2>From</h2>
          <div className="inv-grid">
            {text("Studio", doc.from.name, (v) => setFrom("name", v))}
            {text("Name", doc.from.contact, (v) => setFrom("contact", v))}
            {text("Email", doc.from.email, (v) => setFrom("email", v), { type: "email" })}
            {text("Phone", doc.from.phone, (v) => setFrom("phone", v))}
            {text("Website", doc.from.web, (v) => setFrom("web", v), { wide: true })}
            {area("Address", doc.from.address, (v) => setFrom("address", v))}
            {area("Anything else that must appear", doc.from.extra, (v) => setFrom("extra", v), 2, "A company number or tax reference")}
          </div>
        </section>

        <section>
          <h2>Notes</h2>
          <div className="inv-grid">
            {area("Shown at the foot of the page", doc.notes, (v) => set("notes", v), 3, "Thanks, payment terms, a late fee")}
          </div>
        </section>

        <footer className="inv-foot">
          <a href="/" target="_blank" rel="noopener">lab.finbar.studio</a>
        </footer>
      </aside>

      <main className="inv-stage" ref={stage}>
        <div className="inv-bar">
          <button type="button" className="is-main" onClick={print}>Print or save as PDF</button>
          <button type="button" onClick={startNew}>New</button>
          <button type="button" onClick={saveFile}>Save file</button>
          <button type="button" onClick={() => picker.current?.click()}>Open file</button>
          <input ref={picker} type="file" accept="application/json,.json" hidden onChange={(e) => { void openFile(e.target.files?.[0]); e.target.value = ""; }} />
        </div>

        <div className="inv-fit" style={{ height: `calc(${scale} * var(--inv-h, 1123px))` }}>
          <article
            className="inv-sheet"
            style={{ transform: `scale(${scale})` }}
            ref={(el) => { if (el) el.parentElement?.style.setProperty("--inv-h", `${el.offsetHeight}px`); }}
          >
            <header className="inv-head">
              <BrandWordmark className="inv-logo" />
              <div className="inv-title">
                <h3>{doc.kind}</h3>
                <p>{doc.number}</p>
              </div>
            </header>

            <div className="inv-meta">
              <div>
                <h4>{doc.kind === "Quote" ? "Prepared for" : "Billed to"}</h4>
                <p className="is-strong">{doc.to.name || "Client"}</p>
                {doc.to.contact ? <p>{doc.to.contact}</p> : null}
                {lines(doc.to.address).map((line) => <p key={line}>{line}</p>)}
                {doc.to.email ? <p>{doc.to.email}</p> : null}
              </div>
              <div>
                <h4>From</h4>
                <p className="is-strong">{doc.from.name}</p>
                {doc.from.contact ? <p>{doc.from.contact}</p> : null}
                {lines(doc.from.address).map((line) => <p key={line}>{line}</p>)}
                {lines(doc.from.extra).map((line) => <p key={line}>{line}</p>)}
              </div>
              <div>
                <h4>Issued</h4>
                <p>{longDate(doc.issued)}</p>
                {doc.kind !== "Receipt" ? (
                  <>
                    <h4>{dueLabel}</h4>
                    <p>{doc.terms === 0 && doc.kind === "Invoice" ? "On receipt" : longDate(doc.due)}</p>
                  </>
                ) : null}
              </div>
              <div>
                {doc.project ? (<><h4>Project</h4><p>{doc.project}</p></>) : null}
                {doc.reference ? (<><h4>Reference</h4><p>{doc.reference}</p></>) : null}
              </div>
            </div>

            <table className="inv-table">
              <thead>
                <tr><th>Description</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {(shown.length ? shown : doc.items).map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="is-strong">{item.what || "Description"}</span>
                      {item.detail ? <span className="inv-detail">{item.detail}</span> : null}
                    </td>
                    <td>{item.qty}{item.unit ? ` ${item.qty === 1 ? item.unit.slice(0, -1) : item.unit}` : ""}</td>
                    <td>{money(item.rate)}</td>
                    <td>{money(item.qty * item.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="inv-totals">
              <dl>
                <div><dt>Subtotal</dt><dd>{money(total.subtotal)}</dd></div>
                {total.discount ? <div><dt>Discount{doc.discountKind === "percent" ? `, ${doc.discount}%` : ""}</dt><dd>{money(-total.discount)}</dd></div> : null}
                {doc.taxOn ? <div><dt>{doc.taxLabel}, {doc.taxRate}%</dt><dd>{money(total.tax)}</dd></div> : null}
                {total.discount || doc.taxOn || doc.paid ? <div><dt>Total</dt><dd>{money(total.total)}</dd></div> : null}
                {doc.paid ? <div><dt>Paid</dt><dd>{money(-doc.paid)}</dd></div> : null}
                <div className="is-due"><dt>{totalLabel}</dt><dd>{money(doc.kind === "Quote" ? total.total : total.due)}</dd></div>
              </dl>
            </div>

            <div className="inv-end">
              {bank.length && doc.kind !== "Receipt" ? (
                <div>
                  <h4>How to pay</h4>
                  <dl className="inv-bank">
                    {bank.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                  </dl>
                  {doc.kind === "Invoice" ? <p className="inv-quiet">Please use {doc.number} as the payment reference.</p> : null}
                </div>
              ) : <div />}
              {doc.notes.trim() ? (
                <div>
                  <h4>Notes</h4>
                  {lines(doc.notes).map((line) => <p key={line}>{line}</p>)}
                </div>
              ) : <div />}
            </div>

            <footer className="inv-sign">
              <span>{doc.from.email}</span>
              <span>{doc.from.phone}</span>
              <span>{doc.from.web}</span>
            </footer>
          </article>
        </div>
      </main>
    </div>
  );
}
