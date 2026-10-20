/* Event Guide Generator: shared engine.
 *
 * Plain script (no modules, no build step) so index.html works when opened
 * straight from disk. Everything hangs off one global, EGG.
 *
 * A generator is registered with EGG.register(id, { label, section, render, parseCsv?, csvHelp? })
 * and turns one section of an event file into page elements. The engine owns
 * everything shared: loading data, page boxes with bleed, measuring, splitting
 * rows across pages, the preview, warnings and printing.
 */
(function () {
  'use strict';

  const EGG = (window.EGG = {
    generators: {},
    examples: [],
    state: { event: null, source: '', generator: 'exhibitors', showBleed: false, zoom: 'fit' },
    messages: [],
  });

  /* ---------------- registry ---------------- */

  /** The app's root element: everything the tool toggles lives on it, not on <body>. */
  EGG.root = () => document.getElementById('egg') || document.body;

  EGG.register = function (id, gen) {
    EGG.generators[id] = Object.assign({ id }, gen);
  };

  /* ---------------- small helpers ---------------- */

  EGG.esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  EGG.el = function (tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };

  /** Place an element at x/y (and optionally w/h) in mm inside a page's trim box. */
  EGG.place = function (elm, x, y, w, h) {
    elm.classList.add('abs');
    elm.style.left = x + 'mm';
    elm.style.top = y + 'mm';
    if (w != null) elm.style.width = w + 'mm';
    if (h != null) elm.style.height = h + 'mm';
    return elm;
  };

  /** Title markup: "\n" breaks a line, *text* is the yellow highlight. */
  EGG.titleHtml = function (title) {
    const text = Array.isArray(title) ? title.join('\n') : String(title || '');
    return text
      .split('\n')
      .map((line) => EGG.esc(line).replace(/\*([^*]+)\*/g, '<span class="hl">$1</span>'))
      .join('<br>');
  };

  /**
   * Spacing rules shared by every page type (mm). Blocks are measured by their
   * visible type: from a title's last baseline, or a box's bottom edge, to the cap
   * top of the next block. Use these rather than one-off numbers.
   */
  EGG.SPACE = {
    margin: 12.8, // top, bottom and outer edge
    inner: 16.8,  // spine side, on pages that mirror
    gap: 12,      // between blocks: title, key, column headings, table
    afterHead: 3, // column headings baseline to the first row
  };

  /** Where type sits in its line box, in mm from the top of the line: cap top and baseline. */
  EGG.textMetrics = function (family, weight, pt, lineHeightPt) {
    const c = (EGG.textMetrics.c = EGG.textMetrics.c || document.createElement('canvas').getContext('2d'));
    const px = (pt * 96) / 72;
    c.font = `${weight} ${px}px "${family}"`;
    const m = c.measureText('H');
    const half = ((lineHeightPt * 96) / 72 - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2;
    const k = 25.4 / 96;
    return { capTop: (half + m.fontBoundingBoxAscent - m.actualBoundingBoxAscent) * k, baseline: (half + m.fontBoundingBoxAscent) * k };
  };

  /**
   * Title size and position. 47.9pt as in the 2026 guides, smaller when a line
   * would be wider than maxWidthMm (the MHS title sits on one line at ~37pt).
   * Placed with its capitals on the top margin. Returns { pt, lineMm, lines, y,
   * bottom } where y is the title's top and bottom its last baseline.
   */
  EGG.fitTitle = function (text, maxWidthMm, maxPt) {
    maxPt = maxPt || 47.9;
    const t = EGG.el('div', 'title', EGG.titleHtml(text));
    t.style.position = 'absolute';
    t.style.fontSize = maxPt + 'pt';
    const page = EGG.el('div', 'page left');
    page.appendChild(t);
    document.getElementById('measure').appendChild(page);
    const w = t.getBoundingClientRect().width / EGG.pxPerMm();
    page.remove();
    const pt = w > maxWidthMm ? Math.floor((maxPt * maxWidthMm) / w * 10) / 10 : maxPt;
    const lineMm = pt * 1.04 * (25.4 / 72);
    const lines = String(Array.isArray(text) ? text.join('\n') : text || '').split('\n').length;
    const m = EGG.textMetrics('Share to Buy', 700, pt, pt * 1.04);
    const y = EGG.SPACE.margin - m.capTop;
    return { pt, lineMm, lines, y, bottom: y + m.baseline + (lines - 1) * lineMm };
  };

  /** A title element at the fitted size. */
  EGG.titleEl = function (text, pt) {
    const t = EGG.el('div', 'title', EGG.titleHtml(text));
    t.style.fontSize = pt + 'pt';
    return t;
  };

  /**
   * Mark page furniture: anything that is not part of the table itself (titles,
   * column headings, keys, rules, decoration). "Tables only" shows these as labelled
   * outlines and leaves them out of every export. Returns the element.
   */
  EGG.furniture = function (el, label) {
    el.classList.add('furniture');
    el.dataset.label = label;
    return el;
  };

  /** A list that may only wrap at its " | " separators. classFor(i) lets a generator colour items. */
  EGG.itemsHtml = function (items, classFor) {
    return (items || [])
      .map((t, i) => (i ? '<span class="sep"> <b>|</b> </span>' : '') + `<span class="it ${classFor ? classFor(i) : ''}">${EGG.esc(t)}</span>`)
      .join('');
  };

  /**
   * Break item lists into lines ourselves: lines only break between items, and a
   * line never starts or ends with a bar (as in the InDesign originals). Breaks are
   * worked out from measured widths, so the same data always gives the same lines,
   * and the InDesign export reuses them as forced line breaks.
   */
  EGG.layoutItems = function (root) {
    root.querySelectorAll('.items:not(.laid)').forEach((list) => {
      const its = [...list.children].filter((c) => c.classList.contains('it'));
      const sep = list.querySelector('.sep');
      if (its.length < 2 || !sep) return list.classList.add('laid');
      const cs = getComputedStyle(list);
      const avail = list.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth) - 0.2;
      const sepW = sep.getBoundingClientRect().width;
      const sepHtml = sep.outerHTML;
      const lines = [];
      let line = [], w = 0;
      its.forEach((it) => {
        const iw = it.getBoundingClientRect().width;
        if (line.length && w + sepW + iw > avail) { lines.push(line); line = []; w = 0; }
        w += (line.length ? sepW : 0) + iw;
        line.push(it.outerHTML);
      });
      lines.push(line);
      list.innerHTML = lines.map((l) => l.join(sepHtml)).join('<br>');
      list.classList.add('laid');
    });
  };

  /* ---------------- messages ---------------- */

  EGG.warn = (text) => EGG.messages.push({ kind: 'warn', text });
  EGG.error = (text) => EGG.messages.push({ kind: 'error', text });
  EGG.info = (text) => EGG.messages.push({ kind: 'info', text });

  /* ---------------- pages ---------------- */

  /** Page side from its number: firstSide applies to firstPageNumber, then alternates. */
  EGG.sideOf = function (number, firstNumber, firstSide) {
    const same = (number - firstNumber) % 2 === 0;
    const first = firstSide === 'right' ? 'right' : 'left';
    return same ? first : first === 'left' ? 'right' : 'left';
  };

  /** Make one page box. Content goes in page.trim, positioned in mm. */
  EGG.makePage = function ({ number, side, className }) {
    const page = EGG.el('div', `page ${side} ${className || ''}`);
    page.dataset.number = number;
    page.bg = page.appendChild(EGG.el('div', 'bg'));
    page.trim = page.appendChild(EGG.el('div', 'trim'));
    return page;
  };

  /* ---------------- measuring ---------------- */

  let pxPerMm = null;
  EGG.pxPerMm = function () {
    if (!pxPerMm) {
      const probe = EGG.el('div');
      probe.style.width = '100mm';
      document.getElementById('measure').appendChild(probe);
      pxPerMm = probe.getBoundingClientRect().width / 100;
      probe.remove();
    }
    return pxPerMm;
  };

  /**
   * Measure rendered heights (mm) of elements at a given width (mm).
   * The elements are laid out inside a real .page so generator CSS applies.
   */
  EGG.measure = function (elements, widthMm, pageClass) {
    const host = document.getElementById('measure');
    const page = EGG.el('div', `page left ${pageClass || ''}`);
    const box = EGG.el('div', 'trim');
    const col = EGG.el('div');
    col.style.width = widthMm + 'mm';
    box.appendChild(col);
    page.appendChild(box);
    host.appendChild(page);
    elements.forEach((e) => col.appendChild(e));
    EGG.layoutItems(col);
    const k = EGG.pxPerMm();
    const heights = elements.map((e) => e.getBoundingClientRect().height / k);
    elements.forEach((e) => e.remove());
    page.remove();
    return heights;
  };

  /**
   * Split rows across pages.
   *   heights:    row heights in mm, in order
   *   capacities: usable height in mm for each available page (length = max pages)
   *   gap:        space between rows in mm, or a function gap(i) for the space above row i
   *               (lets a generator open up the space between sections, such as rooms).
   *               The space above the first row on a page is always dropped.
   *   pages:      number of pages to use, or 'auto' for the fewest that fit
   *   fill:       true fills each page to the bottom before starting the next
   *               (use when the last page has other content, like MHS Sessions & Talks)
   * Otherwise rows are balanced so pages end up similarly full (as in the LHS guide).
   * Returns { groups, overflow }.
   */
  EGG.splitRows = function (heights, capacities, gap, pages, fill) {
    const gapAt = typeof gap === 'function' ? gap : () => gap;
    const total = (from, to) => {
      let t = 0;
      for (let i = from; i < to; i++) t += heights[i] + (i > from ? gapAt(i) : 0);
      return t;
    };
    const fits = (n) => {
      // greedy fill check: can n pages hold everything?
      let i = 0;
      for (let p = 0; p < n && i < heights.length; p++) {
        let used = 0, k = 0;
        while (i < heights.length && used + (k ? gapAt(i) : 0) + heights[i] <= capacities[p]) {
          used += (k ? gapAt(i) : 0) + heights[i];
          i++; k++;
        }
      }
      return i >= heights.length;
    };
    let n;
    if (pages === 'auto' || pages == null) {
      n = 1;
      while (n < capacities.length && !fits(n)) n++;
    } else {
      n = Math.min(Math.max(1, Number(pages)), capacities.length);
    }
    const overflow = !fits(n);

    // balanced split: aim each page at an equal share of what is left
    const groups = [];
    let i = 0;
    for (let p = 0; p < n; p++) {
      const left = n - p;
      const remaining = total(i, heights.length);
      const target = left === 1 || fill ? Infinity : remaining / left;
      const start = i;
      let used = 0;
      while (i < heights.length) {
        const add = (i > start ? gapAt(i) : 0) + heights[i];
        if (used + add > capacities[p] && i > start) break;
        // stop once we are past the target, picking whichever side of it is closer
        if (p < n - 1 && i > start && used >= target) break;
        if (p < n - 1 && i > start && used + add > target && used + add - target > target - used) break;
        used += add;
        i++;
      }
      groups.push({ from: start, to: i });
    }
    if (i < heights.length) groups[groups.length - 1].to = heights.length; // overflow stays on the last page
    return { groups, overflow };
  };

  /* ---------------- data loading ---------------- */

  /** CSV/TSV to array of row objects keyed by lower-case header. Handles quoted fields. */
  EGG.parseTable = function (text) {
    const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim());
    if (!lines.length) return [];
    const delim = lines[0].includes('\t') ? '\t' : ',';
    const split = (line) => {
      const out = [];
      let cur = '', q = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (q) {
          if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
          else if (c === '"') q = false;
          else cur += c;
        } else if (c === '"') q = true;
        else if (c === delim) { out.push(cur); cur = ''; }
        else cur += c;
      }
      out.push(cur);
      return out.map((s) => s.trim());
    };
    const head = split(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z]/g, ''));
    return lines.slice(1).map((l) => {
      const cells = split(l);
      const row = {};
      head.forEach((h, i) => (row[h] = cells[i] ?? ''));
      return row;
    });
  };

  /** Split "a | b ; c" lists from table cells. */
  EGG.splitList = (s) => String(s || '').split(/\s*[|;]\s*/).map((x) => x.trim()).filter(Boolean);

  /**
   * Load pasted or opened text. JSON replaces the whole event; a table replaces only
   * the list for the current generator and keeps that section's settings.
   */
  EGG.load = function (text, source) {
    const t = String(text || '').trim();
    if (!t) return;
    // JSON straight from a Claude chat often comes in a code block, with notes before
    // or after it: take everything from the first { to the last } and keep the notes
    const start = t.indexOf('{'), end = t.lastIndexOf('}');
    let notes = '';
    let parsed = null;
    if (start >= 0 && end > start) {
      try { parsed = JSON.parse(t.slice(start, end + 1)); } catch (e) { parsed = e; }
    }
    if (parsed instanceof Error && /^\s*(```|\{)/.test(t)) {
      EGG.messages = [];
      EGG.error(`That JSON could not be read: ${parsed.message}`);
      return EGG.showMessages();
    }
    if (parsed && !(parsed instanceof Error)) {
      EGG.state.event = parsed;
      notes = (t.slice(0, start) + '\n' + t.slice(end + 1)).replace(/```(json)?/g, '').replace(/\s*\n\s*/g, ' ').trim();
    } else {
      const gen = EGG.generators[EGG.state.generator];
      if (!gen.parseCsv) {
        EGG.error(`${gen.label} only accepts a JSON event file.`);
        return EGG.showMessages();
      }
      const ev = EGG.state.event || { event: { name: 'Untitled event' } };
      ev[gen.section] = Object.assign({}, ev[gen.section] || {}, gen.parseCsv(EGG.parseTable(t)));
      EGG.state.event = ev;
    }
    EGG.state.source = source || 'pasted';
    EGG.ui.example = null;
    EGG.ui.pages = EGG.ui.side = null;
    EGG.render().then(() => {
      if (notes) {
        EGG.info(`Notes that came with the data: ${notes}`);
        EGG.showMessages();
      }
    });
  };

  /* ---------------- render + UI ---------------- */

  EGG.render = async function () {
    // load every bundled font before measuring: fonts.ready alone resolves before a
    // face that nothing has used yet starts loading, and lines would be measured in a fallback
    await Promise.all([...document.fonts].map((f) => f.load().catch(() => null)));
    await document.fonts.ready;
    EGG.messages = [];
    const gen = EGG.generators[EGG.state.generator];
    const sheet = document.getElementById('sheet');
    sheet.innerHTML = '';
    sheet.style.transform = ''; // measure at true size; fit() scales afterwards
    const ev = EGG.state.event;
    if (!ev) {
      EGG.info('Load an event file, paste a table, or pick an example.');
      return EGG.showMessages();
    }
    const section = ev[gen.section];
    if (!section) {
      EGG.error(`This event has no "${gen.section}" section, so there is nothing to make for ${gen.label}.`);
      return EGG.showMessages();
    }
    const opts = Object.assign({}, section, EGG.overrides());
    let pages = [];
    try {
      pages = gen.render(section, opts, ev) || [];
    } catch (e) {
      console.error(e);
      EGG.error(`The generator stopped: ${e.message}`);
    }
    // lay pages out as spreads: a right page that starts the run sits alone
    let spread = null;
    pages.forEach((p) => {
      if (!spread || p.classList.contains('left') || spread.children.length === 2) {
        spread = sheet.appendChild(EGG.el('div', 'spread'));
      }
      if (p.classList.contains('right') && spread.children.length === 0) p.classList.add('single');
      spread.appendChild(p);
    });
    EGG.layoutItems(sheet);
    EGG.pages = pages;
    if (EGG.ui.pdf !== '' && Number(EGG.ui.pdf) >= pages.length) EGG.ui.pdf = '';
    document.title = `${ev.event?.short || ev.event?.name || 'Event'} - ${gen.label}`;
    EGG.fit();
    EGG.showMessages();
  };

  /** Values typed into the side panel override the file's settings. */
  EGG.overrides = function () {
    const o = {};
    if (EGG.ui.pages != null) o.pages = EGG.ui.pages === 'auto' ? 'auto' : Number(EGG.ui.pages);
    if (EGG.ui.side) o.firstPageSide = EGG.ui.side;
    return o;
  };

  EGG.showMessages = function () {
    EGG.refreshPanel();
    const box = document.getElementById('messages');
    box.innerHTML = EGG.messages.map((m) => `<div class="msg ${m.kind}">${EGG.esc(m.text)}</div>`).join('');
    const ev = EGG.state.event;
    document.getElementById('source').textContent = ev ? `Showing ${ev.event?.name || 'your data'}${/^example/.test(EGG.state.source) ? '' : ` (from ${EGG.state.source})`}.` : '';
  };

  EGG.fit = function () {
    const stage = document.getElementById('stage');
    const sheet = document.getElementById('sheet');
    EGG.root().classList.toggle('hide-bleed', !EGG.state.showBleed);
    sheet.style.transform = '';
    const w = sheet.scrollWidth;
    const scale = Math.min(1, (stage.clientWidth - 48) / Math.max(w, 1));
    sheet.style.transform = `scale(${scale})`;
    sheet.style.height = sheet.scrollHeight * scale + 'px';
  };

  /**
   * "Tables only" (the default) shows titles, headings and keys as outlines on a
   * see-through page. Full pages shows everything on the page colour. Exports never
   * carry a background either way: the pages are dropped onto the guide artwork.
   */
  EGG.applyView = function () {
    const tables = !document.getElementById('opt-full').checked;
    EGG.root().classList.toggle('tables-only', tables);
    EGG.root().classList.toggle('no-bg', tables);
  };

  /** Print all pages, or just the page picked under Export. */
  EGG.print = function () {
    const only = EGG.ui.pdf;
    (EGG.pages || []).forEach((p, i) => p.classList.toggle('no-print', only !== '' && String(i) !== only));
    window.print();
  };

  /** Download text or a Blob. */
  EGG.download = function (name, data, type) {
    const a = EGG.el('a');
    a.href = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], { type: type || 'application/json' }));
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  /* ---------------- side panel ---------------- */

  EGG.VERSION = '1.1';
  /** Panel choices. null means "as the data file says". */
  EGG.ui = { example: null, pages: null, side: null, pdf: '' };

  /** Fill a row of toggle buttons. items: [{ value, label, title }]. */
  function seg(id, items, pressed, onPick) {
    const box = document.getElementById(id);
    if (!box) return;
    box.innerHTML = '';
    items.forEach((it) => {
      const b = EGG.el('button', '', EGG.esc(it.label));
      b.type = 'button';
      if (it.title) b.title = it.title;
      b.setAttribute('aria-pressed', String(String(it.value) === String(pressed)));
      b.onclick = () => onPick(it.value);
      box.appendChild(b);
    });
  }

  /** Redraw the toggles from the current state (after every render). */
  EGG.refreshPanel = function () {
    const gen = EGG.generators[EGG.state.generator];
    const section = (EGG.state.event && EGG.state.event[gen.section]) || {};
    seg('seg-generator', Object.values(EGG.generators).map((g) => ({ value: g.id, label: g.short || g.label, title: g.label })), EGG.state.generator, (id) => {
      EGG.state.generator = id;
      EGG.render();
    });
    seg('seg-example', EGG.examples.map((x, i) => ({ value: i, label: x.data.event?.short || x.file, title: x.data.event?.name })), EGG.ui.example ?? '', EGG.useExample);
    const filePages = section.pages == null || section.pages === 'auto' ? 'auto' : String(section.pages);
    seg('seg-pages', [{ value: 'auto', label: 'Fewest', title: 'The fewest pages that fit' }, { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }], EGG.ui.pages ?? filePages, (v) => {
      EGG.ui.pages = v;
      EGG.render();
    });
    seg('seg-side', [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }], EGG.ui.side ?? (section.firstPageSide === 'right' ? 'right' : 'left'), (v) => {
      EGG.ui.side = v;
      EGG.render();
    });
    const pages = EGG.pages || [];
    seg('seg-pdf', [{ value: '', label: 'All pages' }].concat(pages.map((p, i) => ({ value: String(i), label: `Page ${i + 1}`, title: `Only page ${i + 1} (${p.classList.contains('left') ? 'left' : 'right'})` }))), EGG.ui.pdf, (v) => {
      EGG.ui.pdf = v;
      EGG.refreshPanel();
    });
    const help = document.getElementById('csv-help');
    if (help) help.innerHTML = gen.csvHelp || '';
  };

  /** Load one of the bundled example shows. */
  EGG.useExample = function (i) {
    const x = EGG.examples[i];
    if (!x) return;
    EGG.state.event = JSON.parse(JSON.stringify(x.data));
    EGG.state.source = `example ${x.file}`;
    EGG.ui.example = i;
    EGG.ui.pages = EGG.ui.side = null;
    EGG.render();
  };

  function initUi() {
    const v = document.getElementById('egg-version');
    if (v) v.textContent = `v${EGG.VERSION}`;
    document.getElementById('opt-file').onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      f.text().then((t) => EGG.load(t, f.name));
      e.target.value = '';
    };
    document.getElementById('btn-paste').onclick = () => EGG.load(document.getElementById('paste').value, 'pasted');
    document.getElementById('opt-full').onchange = EGG.applyView;
    document.getElementById('opt-bleed').onchange = (e) => {
      EGG.state.showBleed = e.target.checked;
      EGG.fit();
    };
    document.getElementById('btn-idml').onclick = () => EGG.exportIdml();
    document.getElementById('btn-package').onclick = () => EGG.exportPackage();
    document.getElementById('btn-print').onclick = EGG.print;
    document.getElementById('btn-save').onclick = () => {
      if (!EGG.state.event) return;
      const ev = EGG.state.event;
      EGG.download(`${(ev.event?.short || 'event').replace(/\s+/g, '-').toLowerCase()}.json`, JSON.stringify(ev, null, 2));
    };
    window.addEventListener('resize', EGG.fit);
    // drop a file anywhere
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) f.text().then((t) => EGG.load(t, f.name));
    });
    EGG.refreshPanel();
  }

  /**
   * URL options, mainly for automation: ?gen=locations&example=lhs-2026.json
   * or ?gen=exhibitors&data=data/my-event.json (fetching a file only works when
   * Chrome runs with --allow-file-access-from-files, as tools/render_pdf.sh does).
   */
  async function fromUrl() {
    const q = new URLSearchParams(location.search);
    if (q.get('gen') && EGG.generators[q.get('gen')]) {
      EGG.state.generator = q.get('gen');
    }
    if (q.get('content') === 'full') document.getElementById('opt-full').checked = true;
    EGG.applyView();
    if (q.get('bleed') === '1') {
      EGG.state.showBleed = true;
      document.getElementById('opt-bleed').checked = true;
    }
    if (q.get('example')) {
      const x = EGG.examples.find((e) => e.file === q.get('example'));
      if (x) {
        EGG.state.event = JSON.parse(JSON.stringify(x.data));
        EGG.state.source = `example ${x.file}`;
        EGG.ui.example = EGG.examples.indexOf(x);
      }
    } else if (q.get('data')) {
      try {
        const r = await fetch(q.get('data'));
        EGG.state.event = await r.json();
        EGG.state.source = q.get('data');
      } catch {
        EGG.error(`Could not open ${q.get('data')} (browsers block this when a page is opened from disk; use Open file instead).`);
      }
    }
    await EGG.render();
    if (q.get('page')) (EGG.pages || []).forEach((p, i) => p.classList.toggle('no-print', String(i + 1) !== q.get('page')));
    if (q.get('export') === 'idml' && EGG.buildIdml) {
      // for tools/export_idml.sh: the .idml as base64 in the page, read back with --dump-dom
      const { opts } = EGG.exportOptions();
      const { blob } = EGG.buildIdml(EGG.pages, opts);
      const buf = new Uint8Array(await blob.arrayBuffer());
      let bin = '';
      for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      const pre = document.body.appendChild(EGG.el('pre'));
      pre.id = 'export-out';
      pre.textContent = btoa(bin);
      const msgs = document.body.appendChild(EGG.el('pre'));
      msgs.id = 'export-messages';
      msgs.textContent = EGG.messages.map((m) => `${m.kind}: ${m.text}`).join('\n');
    }
    EGG.root().dataset.ready = '1';
  }

  /**
   * Start the tool on the page's #egg element. Runs by itself when index.html
   * loads. A host page that loads the scripts itself sets window.EGG_MANUAL_START
   * before loading them and calls EGG.start() once the markup is in place.
   */
  EGG.start = function () {
    const root = EGG.root();
    if (root.dataset.started) return;
    root.dataset.started = '1';
    initUi();
    fromUrl();
  };
  if (!window.EGG_MANUAL_START) {
    if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', EGG.start);
    else EGG.start();
  }
})();

export {};
