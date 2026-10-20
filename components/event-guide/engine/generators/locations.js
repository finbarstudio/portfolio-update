/* Location information pages (job 00289).
 *
 * One row per area: area name on the left, the developers with homes there on the right.
 * Developer names alternate black and pink, and each row starts on the opposite colour
 * to the row above, so neighbouring names never match (this is the rule the 2026
 * guides follow: row r, name i is pink when r + i is odd).
 *
 * Measurements are mm on the trimmed A4 page, taken from
 * reference/LHS 2026 - Location Information (InDesign file in job 00289).
 */
(function () {
  'use strict';

  const L = {
    titleX: 12.8, titleY: 7.5,
    titleLine: 17.6,      // 47.9pt title line height in mm
    ruleGap: 3.2, ruleH: 1.5, ruleX: 29.1, ruleW: 159.6,
    afterTitle: 5.5,
    contTop: 30.5,        // first row on pages without the title
    rowsBottom: 282.6,
    gap: 1.0,
    outer: 12.8, inner: 16.8, // mirrored margins: outer edge vs spine
    areaW: 55.6,
    maxPages: 4,
  };

  function rowEl(loc, r) {
    const row = EGG.el('div', 'loc-row');
    row.innerHTML =
      `<div class="loc-area">${EGG.esc(loc.area)}</div>` +
      `<div class="loc-devs items">${EGG.itemsHtml(loc.developers, (i) => ((r + i) % 2 ? 'pink' : ''))}</div>`;
    return row;
  }

  function validate(list, ev) {
    const known = new Set(((ev.exhibitorInfo && ev.exhibitorInfo.exhibitors) || []).map((x) => x.name));
    const seen = new Set();
    const unknown = new Set();
    list.forEach((l, i) => {
      if (!l.area) EGG.error(`Row ${i + 1} has no area name.`);
      if (seen.has(l.area)) EGG.warn(`${l.area} is listed twice.`);
      seen.add(l.area);
      if (!l.developers.length) EGG.warn(`${l.area} has no developers.`);
      if (known.size) l.developers.forEach((d) => !known.has(d) && unknown.add(d));
    });
    if (unknown.size)
      EGG.warn(`Not on the exhibitor list (check spelling): ${[...unknown].join(', ')}.`);
  }

  EGG.register('locations', {
    label: 'Location information',
    section: 'locationInfo',

    csvHelp:
      'Columns: <b>area, developers</b>. Separate developers with | or ;. ' +
      'Rows print in the order given.',

    parseCsv(rows) {
      return {
        locations: rows.map((r) => ({
          area: r.area || r.location || r.borough || r.county || '',
          developers: EGG.splitList(r.developers || r.developer || r.exhibitors || ''),
        })),
      };
    },

    render(section, opts, ev) {
      const list = (section.locations || []).map((l) => ({ area: l.area, developers: [].concat(l.developers || []) }));
      validate(list, ev);
      if (!list.length) {
        EGG.warn('There are no locations to show.');
        return [];
      }
      const first = Number(opts.firstPageNumber) || 1;
      const firstSide = opts.firstPageSide || 'left';
      const titleText = Array.isArray(opts.title) ? opts.title.join('\n') : String(opts.title || 'Homes across *the region*');
      const titleLines = titleText.split('\n').length;
      const fit = EGG.fitTitle(titleText, 210 - 2 * L.outer);
      const hasRule = titleLines > 1;
      const top1 =
        L.titleY + titleLines * fit.lineMm + (hasRule ? L.ruleGap + L.ruleH : 0) + L.afterTitle * (fit.lineMm / L.titleLine);

      const capacities = [];
      for (let p = 0; p < L.maxPages; p++) capacities.push(L.rowsBottom - (p === 0 ? top1 : L.contTop));
      const width = 210 - L.outer - L.inner;
      const heights = EGG.measure(list.map((l, r) => rowEl(l, r)), width, 'loc');
      const { groups, overflow } = EGG.splitRows(heights, capacities, L.gap, opts.pages || 'auto', opts.fillPages);
      if (overflow) EGG.warn(`The locations do not fit on ${groups.length} page(s). Allow more pages.`);

      return groups.map((g, p) => {
        const number = first + p;
        const side = EGG.sideOf(number, first, firstSide);
        const page = EGG.makePage({ number, side, className: 'loc' });

        let y = L.contTop;
        if (p === 0) {
          page.trim.appendChild(EGG.place(EGG.furniture(EGG.titleEl(titleText, fit.pt), 'Title'), L.titleX, L.titleY));
          if (hasRule) {
            const yRule = L.titleY + titleLines * fit.lineMm + L.ruleGap;
            page.trim.appendChild(EGG.place(EGG.furniture(EGG.el('div', 'loc-rule'), 'Title rule'), L.ruleX, yRule, L.ruleW, L.ruleH));
          }
          y = top1;
        }
        const x = side === 'left' ? L.outer : L.inner;
        list.slice(g.from, g.to).forEach((l, i) => {
          const r = g.from + i;
          page.trim.appendChild(EGG.place(rowEl(l, r), x, y, width));
          y += heights[r] + L.gap;
        });
        return page;
      });
    },
  });
})();

export {};
