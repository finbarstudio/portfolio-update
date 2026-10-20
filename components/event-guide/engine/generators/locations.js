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

  // Vertical spacing and margins come from EGG.SPACE. Pages mirror: the outer
  // margin on the outside edge, the inner margin at the spine.
  const L = {
    ruleGap: 6, ruleH: 1.5, ruleIn: 16.3, ruleW: 159.6, // rule under a two-line title: below its last baseline, in from the title
    gap: 1.0,             // space between rows
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
    short: 'Locations',
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
      // Page 1: title (capitals on the top margin), the rule if the title has two
      // lines, gap, table. Later pages: the table from the top margin.
      const S = EGG.SPACE;
      const fit = EGG.fitTitle(titleText, 210 - S.margin - S.inner);
      const hasRule = fit.lines > 1;
      const ruleY = fit.bottom + L.ruleGap;
      const top1 = (hasRule ? ruleY + L.ruleH : fit.bottom) + S.gap;
      const bottom = 297 - S.margin;
      const capacities = [];
      for (let p = 0; p < L.maxPages; p++) capacities.push(bottom - (p === 0 ? top1 : S.margin));
      const width = 210 - S.margin - S.inner;
      const heights = EGG.measure(list.map((l, r) => rowEl(l, r)), width, 'loc');
      const { groups, overflow } = EGG.splitRows(heights, capacities, L.gap, opts.pages || 'auto', opts.fillPages);
      if (overflow) EGG.warn(`The locations do not fit on ${groups.length} page(s). Allow more pages.`);

      return groups.map((g, p) => {
        const number = first + p;
        const side = EGG.sideOf(number, first, firstSide);
        const page = EGG.makePage({ number, side, className: 'loc' });

        const x = side === 'left' ? S.margin : S.inner;
        let y = S.margin;
        if (p === 0) {
          page.trim.appendChild(EGG.place(EGG.furniture(EGG.titleEl(titleText, fit.pt), 'Title'), x, fit.y));
          if (hasRule) page.trim.appendChild(EGG.place(EGG.furniture(EGG.el('div', 'loc-rule'), 'Title rule'), x + L.ruleIn, ruleY, L.ruleW, L.ruleH));
          y = top1;
        }
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
