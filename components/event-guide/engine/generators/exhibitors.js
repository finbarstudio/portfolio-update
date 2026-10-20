/* Exhibitor information pages (job 00288).
 *
 * One row per exhibitor: coloured stand number, exhibitor name, "talk to them about".
 * Optional rooms shown as a vertical script label in the left margin.
 * Rows flow over 1, 2 or more pages; the key sits at the top of the last page.
 *
 * Measurements are mm on the trimmed A4 page, taken from
 * reference/LHS 2026 - Exhibition Information (InDesign file in job 00288).
 */
(function () {
  'use strict';

  const L = {
    titleX: 12.8, titleY: 7.5,
    headY: 36.7,          // column headings under a one-line title (2026 guides)
    titleLine: 17.6,      // one 47.9pt title line in mm; a longer title pushes the headings down
    headYTop: 13,         // column headings on a page with no title and no key
    headH: 7.4,
    keyY: 13.6, keyH: 16.4, keyX: 14.3, keyW: 182.6,
    afterHead: 1.9,       // heading baseline area to first row
    rowsBottom: 282.6,    // rows end above this (same bottom margin as the location pages)
    gap: 2.0,             // space between rows
    roomGap: 5.0,         // space between rooms: a clear break between sections
    standX: 22.3, standW: 13.0,
    nameX: 37.2, nameW: 47.0,
    talkX: 86.2, talkW: 110.7,
    roomX: 11.1, roomW: 6.5,
    maxPages: 4,
  };

  const CATEGORIES = {
    homes: { label: 'Homes for sale', color: 'var(--yellow)' },
    financial: { label: 'Financial advice', color: 'var(--powder)' },
    legal: { label: 'Legal advice', color: 'var(--violet)' },
    other: { label: 'Other advice', color: 'var(--mint)' },
  };

  function rowEl(x, cats) {
    const cat = cats[x.category] || { color: '#cfcfd6' };
    const row = EGG.el('div', 'ex-row');
    row.innerHTML =
      `<div class="ex-stand" style="background:${cat.color}">${EGG.esc(x.stand)}</div>` +
      `<div class="ex-name"><span>${EGG.esc(x.name)}</span></div>` +
      `<div class="ex-talk"><span class="items">${EGG.itemsHtml(x.talkAbout)}</span></div>`;
    return row;
  }

  function headings(page, y) {
    const h = EGG.el('div', 'ex-head');
    h.innerHTML =
      `<span style="left:${L.standX}mm">Stand no.</span>` +
      `<span style="left:${L.nameX + 13.1}mm">Exhibitor</span>` +
      `<span style="left:${L.talkX}mm">Talk to them about…</span>`;
    EGG.furniture(h, 'Column headings');
    page.trim.appendChild(EGG.place(h, 0, y, 210, L.headH));
  }

  function key(page, y, cats, used) {
    const k = EGG.el('div', 'ex-key');
    k.innerHTML =
      '<span class="ex-key-label">Key</span>' +
      Object.entries(cats)
        .filter(([id]) => used.has(id))
        .map(([, c]) => `<span class="ex-key-item"><i style="background:${c.color}"></i>${EGG.esc(c.label)}</span>`)
        .join('');
    EGG.furniture(k, 'Key');
    page.trim.appendChild(EGG.place(k, L.keyX, y, L.keyW, L.keyH));
  }

  /** Vertical room labels: one per run of consecutive rows in the same room. */
  function rooms(page, list, tops, heights) {
    let i = 0;
    while (i < list.length) {
      const room = list[i].room;
      let j = i;
      while (j + 1 < list.length && list[j + 1].room === room) j++;
      if (room) {
        const top = tops[i];
        const bottom = tops[j] + heights[j];
        const r = EGG.el('div', 'ex-room', `<i></i><span>${EGG.esc(room)}</span><i></i>`);
        page.trim.appendChild(EGG.place(r, L.roomX, top, L.roomW, bottom - top));
      }
      i = j + 1;
    }
  }

  function validate(list, cats) {
    const seen = new Map();
    list.forEach((x, i) => {
      if (!x.name) EGG.error(`Row ${i + 1} has no exhibitor name.`);
      if (!x.stand) EGG.warn(`${x.name || 'Row ' + (i + 1)} has no stand number.`);
      if (x.stand && seen.has(x.stand)) EGG.warn(`Stand ${x.stand} is used twice (${seen.get(x.stand)} and ${x.name}).`);
      seen.set(x.stand, x.name);
      if (!cats[x.category]) EGG.warn(`${x.name}: category "${x.category || ''}" is not one of ${Object.keys(cats).join(', ')}. Shown in grey.`);
      if (!x.talkAbout || !x.talkAbout.length) EGG.warn(`${x.name} has nothing under "Talk to them about".`);
    });
  }

  EGG.register('exhibitors', {
    label: 'Exhibitor information',
    short: 'Exhibitors',
    section: 'exhibitorInfo',

    csvHelp:
      'Columns: <b>stand, name, talk about, category, room</b>. Separate topics with | or ;. ' +
      'Category is homes, financial, legal or other. Room is optional.',

    parseCsv(rows) {
      return {
        exhibitors: rows.map((r) => ({
          stand: r.stand || r.standno || r.standnumber || '',
          name: r.name || r.exhibitor || '',
          talkAbout: EGG.splitList(r.talkabout || r.talktothemabout || r.topics || ''),
          category: (r.category || '').toLowerCase(),
          room: r.room || undefined,
        })),
      };
    },

    render(section, opts) {
      const list = (section.exhibitors || []).map((x) => Object.assign({}, x, { talkAbout: [].concat(x.talkAbout || []) }));
      const cats = Object.assign({}, CATEGORIES, section.categories || {});
      validate(list, cats);
      if (!list.length) {
        EGG.warn('There are no exhibitors to show.');
        return [];
      }
      const showKey = opts.showKey !== false;
      const first = Number(opts.firstPageNumber) || 1;
      const firstSide = opts.firstPageSide || 'left';

      // usable height per page: page 1 carries the title, the last page the key.
      // The key page is only known after splitting, so assume the worst (key on every page after 1).
      // title space: the 2026 position for one line, moved down for each extra line
      const title = opts.title || 'Exhibitor information';
      const fit = EGG.fitTitle(title, 210 - 2 * L.titleX);
      const titleLines = String(Array.isArray(title) ? title.join('\n') : title).split('\n').length;
      const headY1 = L.headY + (titleLines - 1) * fit.lineMm - (L.titleLine - fit.lineMm);
      const top1 = headY1 + L.headH + L.afterHead;
      const topKey = L.keyY + L.keyH + 2 + L.headH + L.afterHead;
      const capacities = [];
      const bottom = L.rowsBottom;
      for (let p = 0; p < L.maxPages; p++) capacities.push(bottom - (p === 0 ? top1 : showKey ? topKey : L.headYTop + L.headH + L.afterHead));
      if (showKey && Number(opts.pages) === 1) capacities[0] -= L.keyH - 1; // single page: key sits under the title

      const heights = EGG.measure(list.map((x) => rowEl(x, cats)), L.talkX + L.talkW - L.standX, 'ex');
      const gapAt = (i) => (i > 0 && (list[i].room || '') !== (list[i - 1].room || '') ? L.roomGap : L.gap);
      const { groups, overflow } = EGG.splitRows(heights, capacities, gapAt, opts.pages || 'auto', opts.fillPages);
      if (overflow) EGG.warn(`The exhibitors do not fit on ${groups.length} page(s). Allow more pages or shorten the longest rows.`);
      heights.forEach((h, i) => {
        if (h > 15) EGG.warn(`${list[i].name} runs to ${Math.round(h)}mm tall; consider fewer topics.`);
      });

      const used = new Set(list.map((x) => x.category));
      return groups.map((g, p) => {
        const number = first + p;
        const page = EGG.makePage({ number, side: EGG.sideOf(number, first, firstSide), className: 'ex' });
        let headY = L.headYTop;
        if (p === 0) {
          page.trim.appendChild(EGG.place(EGG.furniture(EGG.titleEl(title, fit.pt), 'Title'), L.titleX, L.titleY));
          headY = headY1;
          if (showKey && groups.length === 1) {
            key(page, headY1 - 3, cats, used); // single page: key under the title
            headY = headY1 - 3 + L.keyH + 2;
          }
        } else if (showKey && p === groups.length - 1) {
          key(page, L.keyY, cats, used);
          headY = L.keyY + L.keyH + 2;
        }
        headings(page, headY);

        let y = headY + L.headH + L.afterHead;
        const rows = list.slice(g.from, g.to);
        const tops = [];
        rows.forEach((x, i) => {
          if (i > 0) y += gapAt(g.from + i);
          tops.push(y);
          page.trim.appendChild(EGG.place(rowEl(x, cats), L.standX, y, L.talkX + L.talkW - L.standX));
          y += heights[g.from + i];
        });
        if (y > bottom + 0.5) EGG.warn(`Page ${number} runs past the bottom margin.`);
        rooms(page, rows, tops, heights.slice(g.from, g.to));
        return page;
      });
    },
  });
})();

export {};
