/* InDesign export: the rendered pages -> an .idml file (opens in InDesign with live,
 * editable text), or a package zip with the .idml, its photos and the fonts.
 *
 * It does not know about exhibitors or locations. It reads what is on screen:
 *   - any box with a background colour, border or photo becomes a frame
 *   - any text becomes a text frame, with the same fonts, sizes, colours and line
 *     breaks as the preview (lines are fixed with forced line breaks)
 *   - a vertical label (writing-mode: vertical-rl) becomes a rotated text frame
 * So a generator only has to look right in the browser to export properly.
 * Two things it cannot see: CSS ::before/::after boxes (use real elements) and SVG.
 *
 * Colours that match a brand token in core.css are exported as the brand's CMYK
 * swatches (names and values from the 2026 InDesign files). Anything else is RGB.
 */
(function () {
  'use strict';

  const PT = 72 / 25.4; // points per mm
  const W = 210 * PT;
  const H = 297 * PT;
  const BLEED = 3;

  /** Brand swatches by core.css token. Add new brand colours here and in .app in core.css. */
  EGG.swatches = {
    midnight: { name: 'Midnight Blue - CMYK', cmyk: [100, 96, 46, 62] },
    rose: { name: 'Rose White - CMYK', cmyk: [0, 6, 3, 0] },
    onyx: { name: 'Onyx - CMYK', cmyk: [77, 69, 62, 86] },
    pink: { name: 'Share to Buy Pink - CMYK', cmyk: [0, 95, 31, 0] },
    yellow: { name: 'Pastel Yellow - CMYK', cmyk: [1, 5, 44, 0] },
    powder: { name: 'Powder Pink - CMYK', cmyk: [2, 45, 0, 0] },
    violet: { name: 'Pale Violet - CMYK', cmyk: [34, 33, 0, 0] },
    mint: { name: 'Mint - CMYK', cmyk: [39, 0, 25, 0] },
  };

  /** CSS font family -> InDesign family, and weight -> style. */
  const FONTS = { 'share to buy': 'Share to Buy', caveat: 'Caveat' };
  const fontStyle = (weight) => (Number(weight) >= 600 ? 'Bold' : 'Regular');

  /* ---------------- colours ---------------- */

  function parseColor(s) {
    const m = String(s).match(/rgba?\(([^)]+)\)/);
    if (!m) return { r: 0, g: 0, b: 0, a: 0 };
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
    return { r: Math.round(p[0]), g: Math.round(p[1]), b: Math.round(p[2]), a: p.length > 3 ? p[3] : 1 };
  }
  const hexRgb = (hex) => {
    const h = hex.replace('#', '');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  };

  /** Collects the colours a document uses and names them as swatches. */
  function palette() {
    const root = getComputedStyle(EGG.root());
    const byRgb = {};
    Object.entries(EGG.swatches).forEach(([token, sw]) => {
      const v = root.getPropertyValue('--' + token).trim();
      if (/^#[0-9a-f]{6}$/i.test(v)) byRgb[hexRgb(v).join(',')] = sw;
    });
    const used = new Map();
    return {
      ref(c) {
        const key = [c.r, c.g, c.b].join(',');
        if (!used.has(key)) {
          const sw = byRgb[key];
          used.set(key, sw ? { name: sw.name, space: 'CMYK', value: sw.cmyk.join(' ') }
            : { name: `R=${c.r} G=${c.g} B=${c.b}`, space: 'RGB', value: `${c.r} ${c.g} ${c.b}` });
        }
        return 'Color/' + used.get(key).name;
      },
      list: () => [...used.values()],
    };
  }

  /* ---------------- reading the page ---------------- */

  const visible = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';

  /** Nearest ancestor that is not an inline box: the element a text node belongs to. */
  function blockOf(node) {
    let el = node.parentElement;
    while (el && getComputedStyle(el).display === 'inline') el = el.parentElement;
    return el;
  }

  function fontMetrics(style) {
    const c = (fontMetrics.c = fontMetrics.c || document.createElement('canvas').getContext('2d'));
    c.font = `${style.weight} ${style.sizePx}px "${style.cssFamily}"`;
    const m = c.measureText('Hg');
    return { ascent: m.fontBoundingBoxAscent, descent: m.fontBoundingBoxDescent };
  }

  function styleOf(el, pal) {
    const cs = getComputedStyle(el);
    const cssFamily = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const sizePx = parseFloat(cs.fontSize);
    const lh = parseFloat(cs.lineHeight);
    const ls = parseFloat(cs.letterSpacing) || 0;
    return {
      cssFamily,
      weight: cs.fontWeight,
      sizePx,
      font: FONTS[cssFamily.toLowerCase()] || cssFamily,
      fontStyle: fontStyle(cs.fontWeight),
      size: +(sizePx * 0.75).toFixed(2),
      leading: +((isNaN(lh) ? sizePx * 1.2 : lh) * 0.75).toFixed(2),
      tracking: Math.round((ls / sizePx) * 1000),
      color: pal.ref(parseColor(cs.color)),
      collapse: !/pre/.test(cs.whiteSpace),
      wordSpacingPx: parseFloat(cs.wordSpacing) || 0,
    };
  }

  /**
   * One text frame's content: runs of styled text with the browser's line breaks,
   * plus the bounds of the text itself in px.
   */
  function readText(block, nodes, pal) {
    const runs = [];
    const push = (text, st) => {
      const last = runs[runs.length - 1];
      if (last && last.st.key === st.key) last.text += text;
      else runs.push({ text, st });
    };
    const vertical = getComputedStyle(block).writingMode.startsWith('vertical');
    const range = document.createRange();
    let lineTop = null, pending = null;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    let first = null;
    nodes.forEach((node) => {
      const st = styleOf(node.parentElement, pal);
      st.key = [st.font, st.fontStyle, st.size, st.leading, st.tracking, st.color].join('|');
      const re = /\s+|\S+/g;
      let m;
      while ((m = re.exec(node.nodeValue))) {
        const tok = m[0];
        if (/^\s/.test(tok)) {
          if (lineTop !== null) {
            // CSS word-spacing (used around the | bars) becomes tracking on the space
            let sst = st;
            if (st.wordSpacingPx) {
              sst = Object.assign({}, st, { tracking: st.tracking + Math.round((st.wordSpacingPx / st.sizePx) * 1000) });
              sst.key = [sst.font, sst.fontStyle, sst.size, sst.leading, sst.tracking, sst.color].join('|');
            }
            pending = { text: st.collapse ? ' ' : tok, st: sst };
          }
          continue;
        }
        range.setStart(node, m.index);
        range.setEnd(node, m.index + tok.length);
        const r = range.getBoundingClientRect();
        if (!r.width && !r.height) continue;
        x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top);
        x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
        if (!first) first = st;
        if (!vertical && lineTop !== null && r.top > lineTop + (st.leading / 0.75) * 0.5) {
          push('\u2028', st);
          pending = null;
          lineTop = r.top;
        } else if (lineTop === null) lineTop = r.top;
        if (pending) push(pending.text, pending.st);
        pending = null;
        push(tok, st);
      }
    });
    return { runs, box: { x0, y0, x1, y1 }, first, vertical };
  }

  /** Everything on one page, in stacking order, in mm from the trim's top-left. */
  function readPage(page, opts, pal) {
    const k = EGG.pxPerMm();
    const pr = page.getBoundingClientRect();
    const ox = pr.left + BLEED * k, oy = pr.top + BLEED * k;
    const mm = (r) => ({ x: (r.left - ox) / k, y: (r.top - oy) / k, w: r.width / k, h: r.height / k });
    const pageBox = { x: -BLEED, y: -BLEED, w: 210 + 2 * BLEED, h: 297 + 2 * BLEED };
    const skip = (el) => el.closest('.bg') || (opts.tablesOnly && el.closest('.furniture'));
    const items = [];

    // text nodes grouped by the block they sit in
    const groups = new Map();
    const tw = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode()); ) {
      const b = blockOf(n);
      if (!b || skip(b) || !visible(b)) continue;
      if (!groups.has(b)) groups.set(b, []);
      groups.get(b).push(n);
    }

    page.querySelectorAll('*').forEach((el) => {
      if (skip(el) || !visible(el)) return;
      const cs = getComputedStyle(el);
      if (cs.display !== 'inline') {
        const box = mm(el.getBoundingClientRect());
        const radius = Math.min(parseFloat(cs.borderTopLeftRadius) / k || 0, box.w / 2, box.h / 2);
        const opacity = parseFloat(cs.opacity);
        const bg = cs.backgroundImage;
        const url = bg.match(/url\("?([^")]+)"?\)/);
        if (url) items.push({ type: 'image', box, clip: pageBox, src: url[1], position: cs.backgroundPosition, name: el.className });
        let fill = null, fillOpacity = 1;
        const c = parseColor(cs.backgroundColor);
        if (c.a > 0) { fill = pal.ref(c); fillOpacity = c.a; }
        else if (/gradient/.test(bg)) {
          // gradients come across as a flat colour at their average opacity
          const stops = [...bg.matchAll(/rgba?\([^)]+\)/g)].map((s) => parseColor(s[0]));
          if (stops.length) {
            fill = pal.ref(stops[0]);
            fillOpacity = stops.reduce((a, s) => a + s.a, 0) / stops.length;
          }
        }
        const bw = ['Top', 'Right', 'Bottom', 'Left'].map((s) => parseFloat(cs[`border${s}Width`]) || 0);
        const bc = ['Top', 'Right', 'Bottom', 'Left'].map((s) => parseColor(cs[`border${s}Color`]));
        const uniform = bw.every((w) => w === bw[0]) && bw[0] > 0 && bc[0].a > 0;
        if (fill || uniform) {
          items.push({
            type: 'rect', box, radius, fill, opacity: opacity * fillOpacity,
            stroke: uniform ? pal.ref(bc[0]) : null, strokeWeight: uniform ? (bw[0] / k) * PT : 0,
            name: el.className,
          });
        }
        if (!uniform) {
          // single-side borders (dividers) become thin boxes
          bw.forEach((w, i) => {
            if (!w || bc[i].a === 0) return;
            const t = w / k;
            const b = [
              { x: box.x, y: box.y, w: box.w, h: t },
              { x: box.x + box.w - t, y: box.y, w: t, h: box.h },
              { x: box.x, y: box.y + box.h - t, w: box.w, h: t },
              { x: box.x, y: box.y, w: t, h: box.h },
            ][i];
            items.push({ type: 'rect', box: b, fill: pal.ref(bc[i]), opacity: 1, name: 'rule' });
          });
        }
      }
      if (groups.has(el)) {
        const t = readText(el, groups.get(el), pal);
        if (!t.runs.length) return;
        const align = { center: 'CenterAlign', right: 'RightAlign', end: 'RightAlign' }[cs.textAlign] || 'LeftAlign';
        if (t.vertical) {
          items.push({ type: 'text', rotate: true, box: mm(el.getBoundingClientRect()), runs: t.runs, align: 'CenterAlign' });
        } else {
          const fm = fontMetrics(t.first);
          const slack = 2; // mm of room so InDesign never pushes a word onto a new line
          let x = (t.box.x0 - ox) / k, w = (t.box.x1 - t.box.x0) / k;
          if (align === 'CenterAlign') { x -= slack / 2; w += slack; }
          else if (align === 'RightAlign') { x -= slack; w += slack; }
          else w += slack;
          items.push({
            type: 'text', runs: t.runs, align,
            box: { x, y: (t.box.y0 - oy) / k, w, h: (t.box.y1 - t.box.y0) / k + 1.5 },
            baseline: +(fm.ascent * 0.75).toFixed(3),
          });
        }
      }
    });
    return items;
  }

  /* ---------------- writing IDML ---------------- */

  const xesc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]).replace(/\u2028/g, '&#x2028;');
  const f = (n) => +n.toFixed(4);

  function pathXml(x, y, w, h) {
    const pts = [[x, y], [x, y + h], [x + w, y + h], [x + w, y]]
      .map(([a, b]) => `<PathPointType Anchor="${f(a)} ${f(b)}" LeftDirection="${f(a)} ${f(b)}" RightDirection="${f(a)} ${f(b)}" />`)
      .join('');
    return `<Properties><PathGeometry><GeometryPathType PathOpen="false"><PathPointArray>${pts}</PathPointArray></GeometryPathType></PathGeometry></Properties>`;
  }

  const corners = (r) =>
    r > 0
      ? ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'].map((c) => `${c}CornerOption="RoundedCorner" ${c}CornerRadius="${f(r)}"`).join(' ')
      : '';

  const transparency = (o) =>
    o != null && o < 0.995 ? `<TransparencySetting><BlendingSetting Opacity="${f(o * 100)}" /></TransparencySetting>` : '';

  /**
   * Build the .idml. pages: rendered page elements. Returns { blob, links } where links
   * lists the image files the document uses (for the package).
   */
  EGG.buildIdml = function (pages, opts) {
    const T = EGG.idmlTemplate;
    if (!T) throw new Error('app/export/idml-template.js is missing: run python3 tools/bundle.py');
    const pal = palette();
    let n = 0;
    const id = () => 'eg' + (++n).toString(36);
    const base = location.href.replace(/[?#].*$/, '').replace(/[^/]*$/, '');
    const links = new Map();
    const sheet = document.getElementById('sheet');
    const prevTransform = sheet.style.transform;
    sheet.style.transform = 'none'; // read the pages at true size

    // spreads exactly as in the preview: a right page that starts the run sits alone
    const spreads = [];
    pages.forEach((p) => {
      const cur = spreads[spreads.length - 1];
      if (!cur || p.classList.contains('left') || cur.length === 2) spreads.push([p]);
      else cur.push(p);
    });

    const stories = [];
    const pageIds = [];
    const spreadFiles = [];
    let pageName = opts.firstSide === 'left' ? 2 : 1;

    try {
      spreads.forEach((sp, si) => {
        const sid = id();
        let body = '';
        const pagesXml = [];
        sp.forEach((pg) => {
          const left = pg.classList.contains('left');
          const px = left ? -W : 0; // spine at x = 0
          const pid = id();
          pageIds.push(pid);
          pagesXml.push(
            `<Page Self="${pid}" Name="${pageName++}" AppliedMaster="ud6" OverrideList="" TabOrder="" MasterPageTransform="1 0 0 1 0 0" ` +
              `GeometricBounds="0 0 ${f(H)} ${f(W)}" ItemTransform="1 0 0 1 ${f(px)} ${f(-H / 2)}" AppliedAlternateLayout="ud5" LayoutRule="UseMaster">` +
              `<Properties><PageColor type="enumeration">UseMasterColor</PageColor></Properties>` +
              `<MarginPreference ColumnCount="1" ColumnGutter="12" Top="36" Bottom="36" Left="36" Right="36" ColumnDirection="Horizontal" ColumnsPositions="0 ${f(W - 72)}" /></Page>`
          );
          const X = (mm) => px + mm * PT;
          const Y = (mm) => -H / 2 + mm * PT;

          readPage(pg, opts, pal).forEach((it) => {
            const b = it.box;
            if (it.type === 'rect') {
              body +=
                `<Rectangle Self="${id()}" Name="${xesc(it.name || '')}" ContentType="Unassigned" ItemLayer="ucc" AppliedObjectStyle="ObjectStyle/$ID/[None]" ItemTransform="1 0 0 1 0 0" ` +
                `FillColor="${it.fill ? xesc(it.fill) : 'Swatch/None'}" StrokeColor="${it.stroke ? xesc(it.stroke) : 'Swatch/None'}" StrokeWeight="${f(it.strokeWeight || 0)}" StrokeAlignment="InsideAlignment" ${corners((it.radius || 0) * PT)}>` +
                pathXml(X(b.x), Y(b.y), b.w * PT, b.h * PT) + transparency(it.opacity) + `</Rectangle>`;
            } else if (it.type === 'image') {
              const rel = decodeURI(it.src.startsWith(base) ? it.src.slice(base.length) : it.src);
              const info = (EGG.assetInfo || {})[rel];
              if (!info) { EGG.warn(`InDesign export: no size for ${rel}; run python3 tools/bundle.py. Photo left out.`); return; }
              links.set(rel, it.src);
              // background-size: cover, positioned as background-position (percentages)
              const s = Math.max(b.w / info.w, b.h / info.h); // mm per pixel
              const dw = info.w * s, dh = info.h * s;
              const pos = it.position.split(' ').map((v) => (/%$/.test(v) ? parseFloat(v) / 100 : 0.5));
              const ix = b.x + (b.w - dw) * pos[0], iy = b.y + (b.h - dh) * (pos[1] ?? 0.5);
              const c = it.clip;
              const fx = Math.max(b.x, c.x), fy = Math.max(b.y, c.y);
              const fw = Math.min(b.x + b.w, c.x + c.w) - fx, fh = Math.min(b.y + b.h, c.y + c.h) - fy;
              const gw = (info.w * 72) / info.ppi, gh = (info.h * 72) / info.ppi; // image size in pt at its own ppi
              const scale = (dw * PT) / gw;
              const fmt = /\.png$/i.test(rel) ? 'PNG' : 'JPEG';
              body +=
                `<Rectangle Self="${id()}" Name="Photo" ContentType="GraphicType" ItemLayer="ucc" AppliedObjectStyle="ObjectStyle/$ID/[None]" ItemTransform="1 0 0 1 0 0" FillColor="Swatch/None" StrokeColor="Swatch/None" StrokeWeight="0">` +
                pathXml(X(fx), Y(fy), fw * PT, fh * PT) +
                `<Image Self="${id()}" ItemTransform="${f(scale)} 0 0 ${f(scale)} ${f(X(ix))} ${f(Y(iy))}" ActualPpi="${info.ppi} ${info.ppi}">` +
                `<Properties><GraphicBounds Left="0" Top="0" Right="${f(gw)}" Bottom="${f(gh)}" /></Properties>` +
                `<Link Self="${id()}" LinkResourceURI="${xesc(it.src.replace(/^file:\/\//, 'file:'))}" LinkResourceFormat="$ID/${fmt}" StoredState="Normal" LinkClassID="35906" LinkClientID="257" /></Image></Rectangle>`;
            } else if (it.type === 'text') {
              const st = id();
              const tf = id();
              const ranges = it.runs
                .map((r) =>
                  `<CharacterStyleRange AppliedCharacterStyle="CharacterStyle/$ID/[No character style]" FontStyle="${r.st.fontStyle}" PointSize="${r.st.size}" Tracking="${r.st.tracking}" FillColor="${xesc(r.st.color)}">` +
                  `<Properties><Leading type="unit">${r.st.leading}</Leading><AppliedFont type="string">${xesc(r.st.font)}</AppliedFont></Properties><Content>${xesc(r.text)}</Content></CharacterStyleRange>`)
                .join('');
              stories.push({
                id: st,
                xml:
                  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<idPkg:Story xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="21.5">` +
                  `<Story Self="${st}" AppliedTOCStyle="n" TrackChanges="false" StoryTitle="$ID/" AppliedNamedGrid="n">` +
                  `<StoryPreference OpticalMarginAlignment="false" OpticalMarginSize="12" FrameType="TextFrameType" StoryOrientation="Horizontal" StoryDirection="LeftToRightDirection" />` +
                  `<ParagraphStyleRange AppliedParagraphStyle="ParagraphStyle/$ID/NormalParagraphStyle" Justification="${it.align}" Hyphenation="false" FirstLineIndent="0" LeftIndent="0" RightIndent="0" SpaceBefore="0" SpaceAfter="0">` +
                  ranges + `</ParagraphStyleRange></Story></idPkg:Story>`,
              });
              let path, transform, pref;
              const inset = '<Properties><InsetSpacing type="list"><ListItem type="unit">0</ListItem><ListItem type="unit">0</ListItem><ListItem type="unit">0</ListItem><ListItem type="unit">0</ListItem></InsetSpacing></Properties>';
              if (it.rotate) {
                // reads bottom to top: an upright frame turned 90 degrees anticlockwise
                path = pathXml(0, 0, b.h * PT, b.w * PT);
                transform = `0 -1 1 0 ${f(X(b.x))} ${f(Y(b.y + b.h))}`;
                pref = `<TextFramePreference TextColumnCount="1" VerticalJustification="CenterAlign" AutoSizingType="Off">${inset}</TextFramePreference>`;
              } else {
                path = pathXml(X(b.x), Y(b.y), b.w * PT, b.h * PT);
                transform = '1 0 0 1 0 0';
                pref = `<TextFramePreference TextColumnCount="1" VerticalJustification="TopAlign" FirstBaselineOffset="FixedHeight" MinimumFirstBaselineOffset="${it.baseline}" AutoSizingType="Off">${inset}</TextFramePreference>`;
              }
              body +=
                `<TextFrame Self="${tf}" ParentStory="${st}" PreviousTextFrame="n" NextTextFrame="n" ContentType="TextType" ItemLayer="ucc" AppliedObjectStyle="ObjectStyle/$ID/[None]" ` +
                `FillColor="Swatch/None" StrokeColor="Swatch/None" StrokeWeight="0" ItemTransform="${transform}">${path}${pref}</TextFrame>`;
            }
          });
        });
        const binding = sp.length === 2 ? 1 : sp[0].classList.contains('left') ? 1 : 0;
        spreadFiles.push({
          name: `Spreads/Spread_${sid}.xml`,
          xml:
            `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<idPkg:Spread xmlns:idPkg="http://ns.adobe.com/AdobeInDesign/idml/1.0/packaging" DOMVersion="21.5">` +
            `<Spread Self="${sid}" PageCount="${sp.length}" BindingLocation="${binding}" ShowMasterItems="true" AllowPageShuffle="true" FlattenerOverride="Default" ItemTransform="1 0 0 1 0 ${f(si * (H + 200))}">` +
            pagesXml.join('') + body + `</Spread></idPkg:Spread>`,
        });
      });
    } finally {
      sheet.style.transform = prevTransform;
    }

    const colors = pal.list();
    const files = [];
    files.push({ name: 'mimetype', data: T['mimetype'] });
    const designmap = T['designmap.xml']
      .replace('{{NAME}}', xesc(opts.name || 'Event guide'))
      .replace('{{STORYLIST}}', stories.map((s) => s.id + ' ').join(''))
      .replace('{{SPREADS}}', spreadFiles.map((s) => `\t<idPkg:Spread src="${s.name}" />\n`).join(''))
      .replace('{{STORIES}}', stories.map((s) => `\t<idPkg:Story src="Stories/Story_${s.id}.xml" />\n`).join(''))
      .replace('{{GROUPSWATCHES}}', colors.map((c, i) => `\t\t<ColorGroupSwatch Self="u18ColorGroupSwatcheg${i}" SwatchItemRef="Color/${xesc(c.name)}" />\n`).join(''))
      .replace(
        '{{SECTION}}',
        `\t<Section Self="ud5" Length="${pageIds.length}" Name="" ContinueNumbering="false" IncludeSectionPrefix="false" Marker="" PageStart="${pageIds[0]}" ` +
          `SectionPrefix="" PageNumberStart="${opts.firstSide === 'left' ? 2 : 1}" AlternateLayoutLength="${pageIds.length}" AlternateLayout="Letter V">` +
          `<Properties><PageNumberStyle type="enumeration">Arabic</PageNumberStyle></Properties></Section>\n`
      );
    files.push({ name: 'designmap.xml', data: designmap });
    Object.keys(T)
      .filter((k) => k !== 'mimetype' && k !== 'designmap.xml')
      .forEach((k) => {
        let data = T[k];
        if (k === 'Resources/Graphic.xml')
          data = data.replace(
            '{{COLORS}}',
            colors
              .map((c, i) =>
                `\t<Color Self="Color/${xesc(c.name)}" Model="Process" Space="${c.space}" ColorValue="${c.value}" ColorOverride="Normal" ConvertToHsb="false" AlternateSpace="NoAlternateColor" AlternateColorValue="" ` +
                `Name="${xesc(c.name)}" ColorEditable="true" ColorRemovable="true" Visible="true" SwatchCreatorID="7937" SwatchColorGroupReference="u18ColorGroupSwatcheg${i}" />\n`)
              .join('')
          );
        files.push({ name: k, data });
      });
    spreadFiles.forEach((s) => files.push({ name: s.name, data: s.xml }));
    stories.forEach((s) => files.push({ name: `Stories/Story_${s.id}.xml`, data: s.xml }));
    return { blob: EGG.zip(files), links };
  };

  /* ---------------- buttons ---------------- */

  EGG.exportOptions = function () {
    const ev = EGG.state.event || {};
    const gen = EGG.generators[EGG.state.generator];
    const tablesOnly = true; // the InDesign file is always just the tables: the guide already has its titles
    const pages = EGG.pages || [];
    const base = `${(ev.event?.short || ev.event?.name || 'event').replace(/[^\w-]+/g, '-').toLowerCase()}-${gen.id}`;
    return {
      pages,
      base,
      opts: {
        name: base,
        tablesOnly,
        firstSide: pages[0] && pages[0].classList.contains('left') ? 'left' : 'right',
      },
    };
  };

  EGG.exportIdml = function () {
    const { pages, base, opts } = EGG.exportOptions();
    if (!pages.length) return;
    const { blob } = EGG.buildIdml(pages, opts);
    EGG.download(`${base}.idml`, blob);
    EGG.showMessages();
  };

  /** Like InDesign's File > Package: the .idml plus Links/ and Document fonts/. */
  EGG.exportPackage = function () {
    const go = () => {
      const { pages, base, opts } = EGG.exportOptions();
      if (!pages.length) return;
      const { blob, links } = EGG.buildIdml(pages, opts);
      blob.arrayBuffer().then((buf) => {
        const P = EGG.packageFiles;
        const dir = `${base} Folder/`;
        const files = [{ name: `${dir}${base}.idml`, data: new Uint8Array(buf) }];
        links.forEach((_, rel) => {
          if (P.assets[rel]) files.push({ name: `${dir}Links/${rel.split('/').pop()}`, data: EGG.b64bytes(P.assets[rel]) });
        });
        Object.entries(P.fonts).forEach(([file, b64]) => files.push({ name: `${dir}Document fonts/${file}`, data: EGG.b64bytes(b64) }));
        files.push({
          name: `${dir}Instructions.txt`,
          data:
            `${base}\n\nOpen ${base}.idml in InDesign. The fonts in "Document fonts" load automatically while it is open.\n` +
            `If InDesign says a photo is missing, open the Links panel and relink it to the file in the Links folder.\n` +
            `Made with the Event Guide Generator.\n`,
        });
        EGG.download(`${base} Folder.zip`, EGG.zip(files));
        EGG.showMessages();
      });
    };
    if (EGG.packageFiles) return go();
    // the fonts are big, so they only load when a package is asked for.
    // A host page can supply its own loader (the lab site imports the module).
    if (EGG.loadPackageFiles) return EGG.loadPackageFiles().then(go, () => { EGG.error('Could not load the package fonts.'); EGG.showMessages(); });
    const s = document.createElement('script');
    s.src = 'app/export/package-files.js';
    s.onload = go;
    s.onerror = () => { EGG.error('Could not load app/export/package-files.js: run python3 tools/bundle.py.'); EGG.showMessages(); };
    document.head.appendChild(s);
  };
})();

export {};
