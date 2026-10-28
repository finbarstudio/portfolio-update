// @ts-nocheck: this is the Tesco helper's page script (public/index.html in the Food Shop app) ported with Dad's data; typing ~2000 lines of vanilla DOM code would mean rewriting it.
import { CATALOG_PARTS } from "@/lib/dad-shop/app-parts";
import { BASE_PATH } from "@/lib/dad-shop/types";

const API = `${BASE_PATH}/api/app`;
// Every request goes through these two helpers: read a document, or send one (POST unless told otherwise).
const getJSON = (path) => fetch(`${API}/${path}`).then((r) => { if (!r.ok) throw new Error(`${path}: ${r.status}`); return r.json() })
const sendJSON = (path, body, method = 'POST') => fetch(`${API}/${path}`, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })

/**
 * Starts the page inside `root` (the markup from markup.ts is already in it). Everything the page listens to or
 * times hangs off `signal`, so aborting it (React unmount, or dev strict-mode's second run) stops the old copy.
 */
export async function boot(root, signal = new AbortController().signal) {
const $ = (s) => root.querySelector(s)
const $$ = (s) => [...root.querySelectorAll(s)]
const elById = (id) => root.querySelector(`[id="${id}"]`)
const listen = (target, type, fn, opts = {}) => target.addEventListener(type, fn, { ...opts, signal })
const every = (fn, ms) => { const t = setInterval(fn, ms); signal.addEventListener('abort', () => clearInterval(t), { once: true }) }
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const smooth = () => (calm() ? 'auto' : 'smooth')
const asDoc = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {})

let [deals, basketDoc, ratings, removals, locks, META, orders] = await Promise.all([
  // the catalog is too big for one response: fetch every part at once and join them
  Promise.all(Array.from({ length: CATALOG_PARTS }, (_, i) => getJSON(`catalog?part=${i}`))).then((parts) => parts.flatMap((p) => p.items ?? [])),
  getJSON('basket').catch(() => ({})),
  getJSON('ratings').catch(() => ({})),
  getJSON('removals').catch(() => ({})),
  getJSON('locks').catch(() => ({})),
  getJSON('meta').catch(() => ({})),
  getJSON('orders').catch(() => []),
])
if (signal.aborted) return
deals = Array.isArray(deals) ? deals : []
basketDoc = asDoc(basketDoc); ratings = asDoc(ratings); removals = asDoc(removals); locks = asDoc(locks); META = asDoc(META)
orders = Array.isArray(orders) ? orders : [] // checked-out shops (newest first)
let basket = basketDoc.items ?? {}
let ticked = basketDoc.ticked ?? {} // in store: ticked off the list
let ordered = {} // product id -> { at, unit (paid each), times }
const NEEDS = (Array.isArray(META.needs) ? META.needs : []).map((n) => (typeof n === 'string' ? n : n?.need)).filter(Boolean)
const TAX = { groups: [], depts: {}, proteins: [], ...asDoc(META.taxonomy) }
const BUDGET = Number(META.budget) > 0 ? Number(META.budget) : 0 // weekly budget (£) from Dad's settings; 0 = none set

// ---- the catalog, tidied into the shape the rest of the page expects ----
// His staples (greek yogurt, beef mince, eggs...): a product is "one of his needs" when its name has every word of one.
const needsOf = (d) => { const n = d.name.toLowerCase(); return NEEDS.filter((need) => need.toLowerCase().split(/\s+/).every((w) => n.includes(w === 'yogurt' ? 'yog' : w.replace(/s$/, '')))) }
// A dinner meal deal is a bundle: its parts come from the products that say which part they fill.
const bundleOf = {}
for (const d of deals) if (d.deal) {
  const b = (bundleOf[String(d.deal.id)] ??= { title: d.deal.title, price: d.deal.price ?? null, parts: new Map() })
  if (Array.isArray(d.deal.parts)) for (const p of d.deal.parts) b.parts.set(String(p.label ?? p.what), p.qty ?? p.n ?? 1)
  else b.parts.set(String(d.deal.part ?? 'Item'), 1)
}
for (const id of Object.keys(bundleOf)) {
  const b = bundleOf[id], parts = [...b.parts].map(([what, n]) => ({ what, n }))
  bundleOf[id] = { parts, size: parts.reduce((s, p) => s + p.n, 0), price: b.price, typicalFull: null }
}
for (const d of deals) {
  // Unscored products still render and are never hidden for it: a neutral 5 keeps the maths going, the chips show "–".
  d.fit = d.fit ?? d.fitRaw ?? d.health ?? null // objective health (0-10); his taste is blended in on this page (learn)
  d.noFit = d.fit == null
  d.fit = d.fit ?? 5
  d.noValue = d.value == null
  d.value = d.value ?? 5
  d.fitParts = d.fitParts ?? null
  d.onOffer = !!d.onOffer
  d.discount = d.discount ?? 0
  if (d.proc) { d.proc.markers ??= []; d.proc.watch ??= [] }
  d.needs = needsOf(d)
  d.slot = d.deal ? String(d.deal.part ?? '') : null
  d.oos = d.oos ?? (d.store?.inStock === false || d.store?.status === 'no')
  // offers as objects: a multi-buy from `best`, a dinner meal deal from `deal`
  d.offers = []
  if (d.best?.minQty > 1) d.offers.push({ kind: 'multi', label: d.best.label, minQty: d.best.minQty, unitPrice: d.best.unitPrice, discount: d.best.discount, until: d.ends })
  if (d.deal) d.offers.push({ kind: 'mealdeal', label: d.deal.title, bundle: bundleOf[String(d.deal.id)] })
}
let byId = Object.fromEntries(deals.map((d) => [d.id, d]))
const when = (iso) => { if (!iso) return 'prices date not known'; const d = new Date(iso), days = Math.floor((Date.now() - d) / 864e5); return days <= 0 ? `prices from today ${d.toTimeString().slice(0, 5)}` : days === 1 ? 'prices from yesterday' : `prices from ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` }
$('#meta').textContent = `· ${deals.length} products, ${deals.filter((d) => d.onOffer).length} on offer · ${when(META.scrapedAt)}`

// Filters: a "view" button (all / for you / offers / multi-buys / meal deals) and a department menu. Inside a department, two rows
// of buttons narrow it: the TYPE (mince, burgers & patties, deli…: the comparison group, so like is compared with like)
// and the main PROTEIN (beef, chicken, salmon…), e.g. Meat → Mince → Beef, or Meat → Beef for everything beef.
const MODES = [['all', 'All'], ['foryou', '✦ For you'], ['offers', 'Offers'], ['meal-deals', 'Multi-buys'], ['mealdeal', 'Meal deals']] // Offers = everything on offer · Multi-buys = 2 for £5, 3 for 2… · Meal deals = Sainsbury's dinner meal deals
const DEPTS = TAX.depts ?? {}
const CAT_DEPT = {}; for (const g of TAX.groups) CAT_DEPT[g.cat] ??= g.dept
const GROUP_DEPT = Object.fromEntries(TAX.groups.map((g) => [g.g, g.dept]))
const GROUP_ORDER = Object.fromEntries(TAX.groups.map((g, i) => [g.g, i]))
const deptOf = (d) => d.dept ?? GROUP_DEPT[d.group] ?? CAT_DEPT[d.cat] ?? 'other'
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const escH = esc
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1)
const safeUrl = (u) => (/^https?:\/\//i.test(u ?? '') ? u : '')
let mode = 'all', cat = 'all', grp = 'all', prot = 'all', limit = 60
$('#cats').innerHTML = MODES.map(([m, label]) => `<button type="button" data-mode="${m}" aria-pressed="${m === mode}"${m === 'meal-deals' ? ' title="2 for £5, 3 for 2 and other mix-and-match offers"' : m === 'mealdeal' ? ' title="Sainsbury\'s dinner meal deals: a main, sides and a dessert or drink for one price"' : m === 'foryou' ? ' title="Offers you might like: good taste for you (your ratings and similar products) and good value, not already on your list"' : ''}>${label}</button>`).join('')
const modeOk = (d) => mode === 'foryou' ? fySection(d) != null : mode === 'offers' ? d.onOffer : mode === 'meal-deals' ? !!d.offers.some((o) => o.kind === 'multi') : mode === 'mealdeal' ? !!d.offers.some((o) => o.kind === 'mealdeal') : true
// treats only show when you ask for them (or browse a special view)
// Collections: lists that cut across the aisles ("what am I in the mood for"), built from comparison groups and label
// flags rather than names. In the menu they sit above the aisles; inside one, the Type tabs show the groups it spans.
const G = (...gs) => new Set(gs)
const SNACK_G = G('crisps', 'other savoury snacks', 'popcorn', 'meat snacks', 'snack nuts (salted, roasted, coated)', 'fruit & nut mixes', 'protein bars', 'cereal, oat & fruit bars',
  'cheese snacks', 'high-protein yogurt, skyr & quark', 'protein puddings & mousses', 'flavoured yogurts', 'cooked chicken pieces & skewers', 'deli: salami, chorizo & charcuterie',
  'prepared fruit & fruit pots', 'lunch kits & snack packs', 'hummus', 'dips', 'protein shakes (ready to drink)', 'Indian snack mixes', 'poppadoms & prawn crackers', 'dried fruit')
const MEAL_G = G('ready meals (chilled & frozen)', 'ambient meals (tins, pots & pouches)', 'pizza', 'savoury pies, pasties & sausage rolls', 'rice, noodle & grain sides (ready)',
  'instant noodles & pots', 'fresh soup', 'tinned soup', 'instant & cup soup', 'fresh & filled pasta, gnocchi', 'sandwiches & wraps (ready-made)', 'dinner kits')
const BREAKFAST_G = G('breakfast cereal', 'granola & muesli', 'porridge oats', 'porridge pots & sachets', 'eggs', 'bacon', 'pancakes, crumpets & waffles', 'bagels & English muffins',
  'croissants, pastries & sweet buns', 'high-protein yogurt, skyr & quark', 'plain & greek yogurt (tubs)', 'juice & smoothies', 'black pudding, haggis & offal', 'sausages')
const LUNCH_G = G('sandwiches & wraps (ready-made)', 'lunch kits & snack packs', 'deli salads & coleslaw', 'salad leaves & salad kits', 'fresh soup', 'cooked chicken pieces & skewers',
  'deli: sliced cooked meats', 'smoked salmon & ready-to-eat fish', 'protein shakes (ready to drink)', 'wraps & tortillas', 'tinned tuna',
  'tinned soup', 'instant & cup soup', 'sushi & poke', 'ambient meals (tins, pots & pouches)', 'rolls, baps & buns')
const MAIN_DEPTS = new Set(['meat', 'fish', 'ready', 'veggie'])
const DINNER_G = G('ready meals (chilled & frozen)', 'pizza', 'savoury pies, pasties & sausage rolls', 'steaks', 'roasting joints & whole birds', 'chops & cuts', 'ribs & slow-cooked',
  'salmon & trout', 'white fish fillets', 'prawns', 'other seafood', 'fish in sauce & ready-to-cook fish', 'smoked salmon & ready-to-eat fish', 'fresh & filled pasta, gnocchi',
  'party food & starters', 'breaded & coated', 'marinated & flavoured (raw, to cook)', 'potato & veg sides (prepared)', 'dinner kits',
  'breaded & battered fish', 'wings', 'burgers & patties', 'mince', 'meatballs', 'breast & fillets (plain, raw)', 'thighs, drumsticks & legs (raw)', 'sausages',
  'veggie burgers, sausages & bites', 'Quorn & meat-free mince, pieces & roasts')
const NIBBLE_G = G('crisps', 'other savoury snacks', 'popcorn', 'meat snacks', 'snack nuts (salted, roasted, coated)', 'fruit & nut mixes', 'Indian snack mixes',
  'poppadoms & prawn crackers', 'cheese snacks', 'chocolate bars & multipacks', 'chocolate sharing bags & pouches', 'biscuits', 'cookies', 'sweets & gummies',
  'snack cakes & cake bars', 'cereal, oat & fruit bars', 'protein bars')
// meal times lead the menu in their own section (MEAL_TIMES); the rest are "Collections"
const MEAL_TIMES = new Set(['breakfast', 'lunch', 'dinner'])
const COLLECTIONS = [
  ['breakfast', 'Breakfast', 'Cereal, porridge, eggs, bacon, yogurt, crumpets, pastries', (d) => BREAKFAST_G.has(d.group)],
  ['lunch', 'Lunch', 'Sandwiches, salads, soup, sushi, pots and pouches, cooked meats', (d) => LUNCH_G.has(d.group)],
  ['dinner', 'Dinner', 'Ready meals, pizza, pies, fish, meat and chicken to cook, sides', (d) => DINNER_G.has(d.group)],
  ['ordered', 'Ordered before', 'Everything from your past shops, with what you paid then and the price now', (d) => !!ordered[d.id]],
  ['meals', 'Ready meals', 'Heat and eat: chilled and frozen meals, pizza, pies, soup, pots', (d) => MEAL_G.has(d.group)],
  ['snacks', 'Easy snacking', 'Grab and eat: protein snacks, yogurts, crisps, nuts, cooked chicken', (d) => SNACK_G.has(d.group)],
  ['nibbles', 'Snacks & sweet treats', 'Crisps, nuts and savoury snacks plus chocolate, sweets, biscuits and cookies', (d) => NIBBLE_G.has(d.group)],
  ['protein', 'High protein', '15g+ protein per 100g, real food (no powders)', (d) => (d.n100?.protein ?? 0) >= 15 && !['supplements', 'other'].includes(deptOf(d))],
  ['freezer', 'Freezer backups', 'Frozen mains and sides to keep in', (d) => d.frozen && (MAIN_DEPTS.has(deptOf(d)) || d.group === 'chips, fries & frozen potato')],
  ['fancy', 'Fancy night in', 'Taste the Difference mains for a treat dinner', (d) => d.premium && DINNER_G.has(d.group)],
  ['treats', 'Treats', 'Chocolate, biscuits, cakes, desserts, ice cream', (d) => deptOf(d) === 'treats'],
]
const COLL = Object.fromEntries(COLLECTIONS.map(([k, label, desc, test]) => [k, { label, desc, test }]))
const catName = (c) => c.startsWith('c:') ? COLL[c.slice(2)]?.label ?? c : DEPTS[c] ?? c
const inDept = (d) => cat === 'all' ? (dealView || similarView || mode !== 'all' || deptOf(d) !== 'treats' || grp !== 'all')
  : cat.startsWith('c:') ? !!COLL[cat.slice(2)]?.test(d) : deptOf(d) === cat
const catOk = (d) => inDept(d) && (grp === 'all' || d.group === grp) && (prot === 'all' || (d.protein ?? 'none') === prot)
let menuN = { deptN: {}, groupN: {}, total: 0 } // live counts for the category menu
// Value matters less to Dad (scores run 0-10 with a median near 4), so "Hide value under 5" is opt-in
const FILTER_DEFAULTS = { fSat: true, fOos: true }
function syncFilterUI() {
  $('#fUpfAny').setAttribute('aria-pressed', upfMax() == null)
  buildAffinity()
  $$('[data-mode]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.mode === mode))
  const q = $('#q').value.toLowerCase().trim()
  const vp = viewPool()
  const live = vp ? vp.filter((d) => viewOk(d, q)) : deals.filter((d) => modeOk(d) && (dealMode() ? dealOk(d, q) : filterOk(d, q)))
  const deptN = {}, groupN = {}
  for (const d of live) { const dp = deptOf(d); deptN[dp] = (deptN[dp] ?? 0) + 1; if (d.group) groupN[d.group] = (groupN[d.group] ?? 0) + 1 }
  const total = Object.entries(deptN).reduce((s, [c, n]) => s + (mode === 'all' && c === 'treats' ? 0 : n), 0)
  const collGroups = {} // collection -> { group: count }
  for (const [k, { test }] of Object.entries(COLL)) {
    const g = (collGroups[k] = {}); let n = 0
    const pool = k === 'ordered' && !vp ? deals.filter((d) => modeOk(d) && orderedOk(d, q)) : live
    for (const d of pool) if (test(d)) { n++; if (d.group) g[d.group] = (g[d.group] ?? 0) + 1 }
    if (n) deptN['c:' + k] = n
  }
  // a choice stays put when it has nothing in this view (switching Offers → Meal deals must not lose it): it shows with 0
  if (cat !== 'all') deptN[cat] ??= 0
  if (grp !== 'all') groupN[grp] ??= 0
  menuN = { deptN, groupN, collGroups, total }
  const crumbCat = cat.startsWith('c:') ? cat : GROUP_DEPT[grp]
  $('#ddLabel').innerHTML = grp !== 'all' ? `${esc(catName(crumbCat ?? ''))}<span class="crumb">›</span>${esc(cap(grp))}` : cat !== 'all' ? esc(catName(cat)) : '<span class="lbl-l">All categories</span><span class="lbl-s">Category</span>'
  $('#ddBtn').classList.toggle('on', cat !== 'all' || grp !== 'all')
  if (openPop === 'dd') renderMenu()
  // inside a department: Type tabs, then main-protein pills
  const inD = (cat === 'c:ordered' && !vp ? deals.filter((d) => modeOk(d) && orderedOk(d, q)) : live).filter((d) => cat === 'all' ? grp !== 'all' && d.group === grp : inDept(d))
  const segBtn = (kind, cls, val, label, n, on) => `<button type="button" class="${cls}" data-${kind}="${esc(val)}" aria-pressed="${on}">${esc(label)} <span class="segn">${n}</span></button>`
  const typeCounts = {}; for (const d of inD) if (d.group) typeCounts[d.group] = (typeCounts[d.group] ?? 0) + 1
  if (grp !== 'all') typeCounts[grp] ??= 0
  const types = Object.keys(typeCounts).sort((x, y) => (GROUP_ORDER[x] ?? 999) - (GROUP_ORDER[y] ?? 999))
  $('#segType').innerHTML = cat !== 'all' && types.length > 1
    ? segBtn('grp', 'tab', 'all', `All ${catName(cat).toLowerCase()}`, inD.length, grp === 'all') + types.map((t) => segBtn('grp', 'tab', t, cap(t), typeCounts[t], grp === t)).join('') : ''
  const pool = inD.filter((d) => grp === 'all' || d.group === grp)
  const protCounts = {}; for (const d of pool) { const p = d.protein ?? 'none'; protCounts[p] = (protCounts[p] ?? 0) + 1 }
  const prots = (TAX.proteins ?? []).filter((p) => protCounts[p] && p !== 'none')
  if (prot !== 'all') protCounts[prot] ??= 0
  $('#segProt').innerHTML = (cat !== 'all' || grp !== 'all') && prots.length > 1
    ? `<span class="seglabel">Protein</span>` + segBtn('prot', 'chip seg', 'all', 'Any', pool.length, prot === 'all') + prots.map((p) => segBtn('prot', 'chip seg', p, cap(p), protCounts[p], prot === p)).join('') : ''
  // sort + filters buttons show what's in force
  const allRound = (dealView || similarView) && !viewSort
  $('#sortLabel').textContent = allRound ? 'Best overall' : $('#sort').selectedOptions[0]?.textContent ?? ''
  for (const b of $$('[data-sort]')) b.setAttribute('aria-checked', !allRound && b.dataset.sort === $('#sort').value)
  const nOn = FILTER_IDS.filter((f) => on(f) && !QUICK_IDS.includes(f)).length // quick toggles show their own state
  $('#filtN').textContent = nOn; $('#filtN').hidden = !nOn
  $('#filtBtn').title = nOn ? 'On: ' + FILTER_IDS.filter((f) => on(f) && !QUICK_IDS.includes(f)).map((f) => $('#' + f).textContent.trim()).join(', ') : 'No filters on'
}
// Inside a deal or "similar" list, search / category / type / sort / filters narrow that list; the view buttons leave it.
let viewPrev = null, viewSort = false // category before the list opened (restored on leaving) · a sort picked inside the list
function exitView() {
  if (viewPrev) { ({ cat, grp, prot } = viewPrev); $('#q').value = viewPrev.q ?? '' }
  viewPrev = null; dealView = null; similarView = null; viewSort = false; limit = 60
}
const resetViews = () => { jumpBack = null; exitView() }
const narrow = () => { jumpBack = null; if (dealView) exitView(); limit = similarView ? 120 : 60 } // a deal page isn't narrowed: picking a category leaves it
$('#cats').onclick = (e) => {
  const b = e.target.closest('[data-mode]'); if (!b) return
  resetViews(); mode = b.dataset.mode
  if (mode === 'foryou' || on('qForYou')) $('#sort').value = 'rec'; else if ($('#sort').value === 'rec') $('#sort').value = 'score'
  syncFilterUI(); render()
}
$('#segs').onclick = (e) => {
  const b = e.target.closest('[data-grp],[data-prot]'); if (!b) return
  narrow()
  if (b.dataset.grp != null) grp = b.dataset.grp; else prot = b.dataset.prot
  syncFilterUI(); render()
}
// ---- popovers (category, sort, filters): fixed under their button, so the sideways-scrolling row on phones can't clip them ----
const POPS = { dd: ['#ddBtn', '#ddPanel', 620], sort: ['#sortBtn', '#sortPanel', 300], filt: ['#filtBtn', '#filtPanel', 360], taste: [null, '#tastePanel', 280] }
const el = (x) => (typeof x === 'string' ? $(x) : x)
let openPop = null
function placePop(k) {
  const [b, p, w0] = POPS[k], r = el(b).getBoundingClientRect(), w = Math.min(w0, innerWidth - 24)
  const below = r.bottom + 6 + 190 < innerHeight || r.top < 220 // flip above the button near the bottom of the screen
  Object.assign($(p).style, { top: below ? `${r.bottom + 6}px` : 'auto', bottom: below ? 'auto' : `${innerHeight - r.top + 6}px`, left: `${Math.max(12, Math.min(r.left + r.width - w, innerWidth - w - 12, r.left))}px`, width: `${w}px` })
}
function closePop(focusBtn) {
  if (!openPop) return
  const [b, p] = POPS[openPop]; $(p).hidden = true; el(b)?.setAttribute('aria-expanded', 'false'); openPop = null
  if (focusBtn && el(b)?.isConnected) el(b).focus()
}
function showPop(k) { closePop(false); placePop(k); $(POPS[k][1]).hidden = false; el(POPS[k][0]).setAttribute('aria-expanded', 'true'); openPop = k }
listen(window, 'resize', () => openPop && placePop(openPop))
listen(root, 'scroll', () => openPop && placePop(openPop), { passive: true })
listen(root, 'pointerdown', (e) => { if (openPop && !e.target.closest('.pop, .popbtn')) closePop(false) })
listen(root, 'keydown', (e) => { if (e.key === 'Escape' && openPop) { e.preventDefault(); closePop(true) } })
const hdrWatch = new ResizeObserver(() => root.style.setProperty('--hh', `${Math.ceil($('#hdr').getBoundingClientRect().height)}px`))
hdrWatch.observe($('#hdr'))
signal.addEventListener('abort', () => hdrWatch.disconnect(), { once: true })
// ---- category menu: departments on the left, the hovered/selected department's types on the right; typing searches both.
// Keys: ↑↓ move, → into the types, ← back to departments, Enter picks, Esc closes ----
let ddShow = null, ddCol = 'd', activeId = null // department shown on the right · list the arrows move in (d / g / r) · highlighted option
const ddList = () => $(ddCol === 'd' ? '#ddDepts' : ddCol === 'g' ? '#ddGroups' : '#ddRes')
const optsIn = (list) => [...list.querySelectorAll('[role=option]')]
const opt = (col, val, label, n, sel, extra = '') =>
  `<li role="option" id="dd${col}-${val.replace(/[^a-z0-9]/gi, '_')}" data-val="${esc(val)}" aria-selected="${sel}"${extra}><span class="ol">${label}</span><span class="on">${n}</span></li>`
// phones have no hover: tapping a department opens its types (one list at a time), with a way back
const narrowMenu = () => matchMedia('(max-width: 700px)').matches
const DD_BACK = '<li class="ddback" role="presentation"><button type="button" data-ddback>‹ All categories</button></li>'
function renderMenu() {
  const { deptN, groupN, total } = menuN, q = $('#ddQ').value.trim().toLowerCase()
  $('#ddCols').hidden = !!q; $('#ddRes').hidden = !q
  if (q) {
    const hits = COLLECTIONS.filter(([k, label, desc]) => deptN['c:' + k] && `${label} ${desc}`.toLowerCase().includes(q))
      .map(([k, label]) => opt('r', 'd:c:' + k, `${esc(label)} <span class="muted">· collection</span>`, deptN['c:' + k], cat === 'c:' + k && grp === 'all'))
    hits.push(...Object.entries(DEPTS).filter(([dk, dn]) => deptN[dk] && dn.toLowerCase().includes(q))
      .map(([dk, dn]) => opt('r', 'd:' + dk, `${esc(dn)} <span class="muted">· all</span>`, deptN[dk], cat === dk && grp === 'all')))
    for (const g of TAX.groups) if (groupN[g.g] && `${g.g} ${g.d ?? ''}`.toLowerCase().includes(q))
      hits.push(opt('r', 'g:' + g.g, `${esc(cap(g.g))} <span class="muted">· ${esc(DEPTS[g.dept] ?? g.dept)}</span>`, groupN[g.g], grp === g.g))
    $('#ddRes').innerHTML = hits.join('') || '<li class="none">No category matches</li>'
  } else {
    if (deptN[ddShow] == null) ddShow = cat !== 'all' ? cat : grp !== 'all' ? GROUP_DEPT[grp] : COLLECTIONS.map(([k]) => 'c:' + k).find((k) => deptN[k])
    const left = (key, label) => opt('d', 'd:' + key, esc(label), deptN[key], cat === key && grp === 'all', ` data-dept="${key}"${key === ddShow ? ' class="cur"' : ''}`)
    $('#ddDepts').innerHTML = opt('d', 'all', 'All categories', total, cat === 'all' && grp === 'all') +
      '<li class="ddh" role="presentation">Meal times</li>' + COLLECTIONS.filter(([k]) => MEAL_TIMES.has(k) && deptN['c:' + k] != null).map(([k, label]) => left('c:' + k, label)).join('') +
      '<li class="ddh" role="presentation">Collections</li>' + COLLECTIONS.filter(([k]) => !MEAL_TIMES.has(k) && deptN['c:' + k] != null).map(([k, label]) => left('c:' + k, label)).join('') +
      '<li class="ddh" role="presentation">Aisles</li>' + Object.entries(DEPTS).filter(([dk]) => deptN[dk] != null).map(([dk, dn]) => left(dk, dn)).join('')
    if (ddShow?.startsWith('c:')) { // a collection: its description, then the types it spans (choosing one stays inside the collection)
      const k = ddShow.slice(2), cg = menuN.collGroups[k] ?? {}
      if (cat === ddShow && grp !== 'all') cg[grp] ??= 0
      const gs = Object.keys(cg).sort((x, y) => (GROUP_ORDER[x] ?? 999) - (GROUP_ORDER[y] ?? 999))
      $('#ddGroups').innerHTML = DD_BACK + `<li class="ddh" role="presentation">${esc(COLL[k].label)}</li><li class="dddesc" role="presentation">${esc(COLL[k].desc)}</li>` +
        opt('g', 'd:' + ddShow, `All ${esc(COLL[k].label.toLowerCase())}`, deptN[ddShow] ?? 0, cat === ddShow && grp === 'all') +
        gs.map((g) => opt('g', `cg:${k}::${g}`, esc(cap(g)), cg[g], cat === ddShow && grp === g)).join('')
    } else {
      const gs = TAX.groups.filter((g) => g.dept === ddShow && groupN[g.g] != null)
      $('#ddGroups').innerHTML = ddShow ? DD_BACK + `<li class="ddh" role="presentation">${esc(DEPTS[ddShow] ?? '')}</li>` +
        opt('g', 'd:' + ddShow, `All ${esc((DEPTS[ddShow] ?? '').toLowerCase())}`, deptN[ddShow] ?? 0, cat === ddShow && grp === 'all') +
        gs.map((g) => opt('g', 'g:' + g.g, esc(cap(g.g)), groupN[g.g], grp === g.g && !cat.startsWith('c:'), g.d ? ` title="${esc(g.d)}"` : '')).join('') : ''
    }
  }
  const a = activeId && elById(activeId)
  if (a) a.classList.add('active')
}
function setActive(li) {
  for (const x of $('#ddPanel').querySelectorAll('.active')) x.classList.remove('active')
  activeId = li?.id ?? null
  if (!li) return $('#ddQ').removeAttribute('aria-activedescendant')
  li.classList.add('active'); $('#ddQ').setAttribute('aria-activedescendant', li.id); li.scrollIntoView({ block: 'nearest' })
}
const showDept = (dk) => { if (dk && dk !== ddShow) { ddShow = dk; renderMenu() } }
function openMenu() {
  $('#ddQ').value = ''; ddShow = null; activeId = null; ddCol = grp !== 'all' ? 'g' : 'd'; $('#ddPanel').classList.remove('drill')
  renderMenu(); showPop('dd'); if (!narrowMenu()) $('#ddQ').focus() // on a phone the keyboard would cover the list
  setActive(optsIn(ddList()).find((li) => li.getAttribute('aria-selected') === 'true') ?? optsIn(ddList())[0])
}
function pickMenu(val) {
  narrow(); prot = 'all'
  if (val === 'all') { cat = 'all'; grp = 'all' }
  else if (val.startsWith('d:')) { cat = val.slice(2); grp = 'all' }
  else if (val.startsWith('cg:')) { const [k, g] = val.slice(3).split('::'); cat = 'c:' + k; grp = g }
  else { grp = val.slice(2); cat = GROUP_DEPT[grp] ?? 'all' }
  closePop(true); syncFilterUI(); render()
}
$('#ddBtn').onclick = () => (openPop === 'dd' ? closePop(false) : openMenu())
$('#ddBtn').onkeydown = (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); openMenu() } }
$('#ddQ').oninput = () => { ddCol = $('#ddQ').value.trim() ? 'r' : 'd'; activeId = null; renderMenu(); setActive(optsIn(ddList())[0]) }
$('#ddQ').onkeydown = (e) => {
  const vis = optsIn(ddList()), i = vis.findIndex((li) => li.id === activeId), typed = !!$('#ddQ').value.trim()
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    const li = vis[Math.max(0, Math.min(vis.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))]
    if (ddCol === 'd') showDept(li?.dataset.dept)
    setActive(li && elById(li.id))
  } else if (e.key === 'ArrowRight' && !typed && ddCol === 'd') { e.preventDefault(); ddCol = 'g'; setActive(optsIn(ddList())[0]) }
  else if (e.key === 'ArrowLeft' && !typed && ddCol === 'g') { e.preventDefault(); ddCol = 'd'; setActive($(`#ddDepts [data-dept="${ddShow}"]`)) }
  else if (e.key === 'Enter') { e.preventDefault(); const li = vis[i] ?? vis[0]; if (li) pickMenu(li.dataset.val) }
  else if (e.key === 'Tab') closePop(false)
}
$('#ddPanel').onclick = (e) => {
  if (e.target.closest('[data-ddback]')) return $('#ddPanel').classList.remove('drill')
  const li = e.target.closest('[role=option]'); if (!li) return
  if (li.dataset.dept && narrowMenu()) { showDept(li.dataset.dept); $('#ddPanel').classList.add('drill'); $('#ddGroups').scrollTop = 0; return }
  pickMenu(li.dataset.val)
}
$('#ddPanel').onmousemove = (e) => {
  const li = e.target.closest('[role=option]'); if (!li || li.id === activeId) return
  ddCol = li.closest('#ddDepts') ? 'd' : li.closest('#ddGroups') ? 'g' : 'r'
  if (ddCol === 'd') showDept(li.dataset.dept)
  setActive(elById(li.id))
}
// ---- sort menu ----
const sortItems = () => $$('[data-sort]')
$('#sortBtn').onclick = () => { if (openPop === 'sort') return closePop(false); showPop('sort'); (sortItems().find((b) => b.dataset.sort === $('#sort').value) ?? sortItems()[0]).focus() }
$('#sortPanel').onclick = (e) => { const b = e.target.closest('[data-sort]'); if (!b) return; $('#sort').value = b.dataset.sort; if (dealView || similarView) viewSort = true; closePop(true); limit = dealView || similarView ? 120 : 60; render() }
$('#sortPanel').onkeydown = (e) => {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
  e.preventDefault(); const it = sortItems(), i = it.indexOf(document.activeElement)
  it[(i + (e.key === 'ArrowDown' ? 1 : it.length - 1)) % it.length].focus()
}
// ---- filters panel ----
$('#fUpfAny').onclick = () => { for (const o of ['fUpf0', 'fUpf1', 'fUpf2']) $('#' + o).setAttribute('aria-pressed', 'false'); limit = 60; render() }
$('#filtBtn').onclick = () => { if (openPop === 'filt') return closePop(false); showPop('filt'); $('#filtPanel .fchip').focus() }
$('#fReset').onclick = () => {
  for (const f of FILTER_IDS) $('#' + f).setAttribute('aria-pressed', !!FILTER_DEFAULTS[f])
  try { localStorage.setItem('dadHideOwn', '0') } catch {}
  limit = 60; render()
}
try { if (localStorage.getItem('dadHideOwn') === '1') $('#fOwn').setAttribute('aria-pressed', 'true') } catch {}
for (const id of ['fNew', 'fUpf0', 'fUpf1', 'fUpf2', 'fFrozen', 'fSat', 'fGood', 'fDeals', 'fRated', 'fBasket', 'fPlain', 'fOwn', 'fOos', 'fNoFolic', 'qFinest', 'qForYou']) $('#' + id).onclick = (e) => {
  const on = e.currentTarget.getAttribute('aria-pressed') !== 'true'
  e.currentTarget.setAttribute('aria-pressed', on)
  if (id === 'fOwn') try { localStorage.setItem('dadHideOwn', on ? '1' : '0') } catch {} // remembered between visits
  // the three processing limits are one choice: picking one clears the others
  if (on && id.startsWith('fUpf')) for (const o of ['fUpf0', 'fUpf1', 'fUpf2']) if (o !== id) $('#' + o).setAttribute('aria-pressed', 'false')
  // For you ranks by its own score while it's on, and goes back to Best overall (Dad's default) when switched off
  if (id === 'qForYou') $('#sort').value = on ? 'rec' : $('#sort').value === 'rec' ? 'score' : $('#sort').value
  limit = 60; render()
}
$('#sort').onchange = render
$('#q').oninput = () => { const v = $('#q').value; narrow(); $('#q').value = v; render() }
$('#more').onclick = () => { if (jumpBack) return restoreView(); limit += 60; render() }
const on = (id) => $('#' + id).getAttribute('aria-pressed') === 'true'
const gbp = (n) => (n == null ? '—' : '£' + n.toFixed(2))
const toast = (t) => { const t0 = $('#toast'); t0.textContent = t; t0.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t0.classList.remove('show'), 2200) }

// Name without the trailing pack size (that's shown as its own tag)
const shortName = (n) => n.replace(/\s*(\d+\s?x\s?)?\d+(\.\d+)?\s?(kg|g|ml|l|cl|ltr|litres?)\.?\s*$/i, '').trim()
const weight = (g) => (g >= 1000 ? `${+(g / 1000).toFixed(2)}kg` : `${Math.round(g)}g`)
const effPrice = (d) => d.best?.unitPrice ?? d.regular // Nectar price is THE price; the shelf price is struck through
const inMulti = (d) => d.best?.minQty > 1 // priced as part of a multi-buy (2 for £5…)
const isMulti = (d) => d.best?.kind === 'multi'
const isOneIngredient = (d) => d.isBasic === true || d.proc?.count === 1
// a whole food: a plain ingredient or a short clean list. Saturated fat isn't held against these (steak, full-fat yogurt).
const isWhole = (d) => d.isBasic === true || (d.proc?.count != null && d.proc.count <= 3 && !d.proc.markers.length && d.seedOil === 'none')
const novaOf = (pr) => pr.nova ?? (pr.markers.length ? 4 : (pr.count ?? 9) <= 1 ? 1 : 3)
const fmtEnds = (iso) => { const t = Date.parse(iso ?? ''); return t ? new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '' }
// Taste profile: every rating teaches the app about products he hasn't rated. An unrated product's taste is estimated
// from (strongest first) closely named products he rated, his ratings of the same type (comparison group), of the same
// brand, and of the same department, with Sainsbury's star rating as a faint extra. Each source counts more the more
// ratings back it; confidence grows as sources agree in number. Recomputed on every rating change (learn()).
// e.g. rating "Protein Noodles" 1 drags other protein noodles down; a 9 on one fishcake lifts the others.
const STOP = new Set('sainsburys sainsbury taste the difference by and with of in a for pack x g kg ml flavour flavoured style selected british mild medium hot free range from made'.split(' '))
const tokens = (n) => new Set(n.toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[^a-z]+/).filter((w) => w.length > 2 && !STOP.has(w)))
const tok = {}
const tokOf = (d) => (tok[d.id] ??= tokens(d.name))
const brandOf = (d) => d.brand || d.name.split(/\s+/)[0].replace(/[^A-Za-z.&']/g, '')
// Fit = objective health score (protein, saturated fat, processing: from the pipeline) blended with HIS TASTE:
// his rating (50% weight), or the estimate above (up to 45%, scaled by its confidence).
const TASTE_WEIGHT = 0.5, LEARNED_MAX = 0.45
let fitInfo = {} // id -> { fit, obj, taste, w, conf, src: 'you' | 'learned' | 'objective', from }
let idf = null // rare words (dippers, fishcakes) count more than common ones (birds, eye, chicken)
function learn() {
  fitInfo = {}
  if (!idf) {
    const df = {}
    for (const d of deals) for (const w of tokOf(d)) df[w] = (df[w] ?? 0) + 1
    idf = Object.fromEntries(Object.entries(df).map(([w, n]) => [w, Math.log(deals.length / n)]))
  }
  const W = (w) => idf[w] ?? Math.log(deals.length)
  const rated = Object.entries(ratings).map(([id, r]) => ({ r: r.fit, t: byId[id] ? tokOf(byId[id]) : tokens(r.name ?? ''), cat: byId[id]?.cat, name: r.name ?? '' }))
  const pool = (key) => { const m = {}; for (const [id, r] of Object.entries(ratings)) { const k = byId[id] && key(byId[id]); if (k) (m[k] ??= []).push(r.fit) } return m }
  const byGroup = pool((d) => d.group), byBrand = pool(brandOf), byDept = pool(deptOf)
  const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length
  const backed = (n, w) => w * n / (n + 1) // one rating counts half, many approach the full weight
  const blend = (obj, taste, w) => Math.max(1, Math.min(10, Math.round(obj * (1 - w) + taste * w)))
  for (const d of deals) {
    const obj = d.fit
    if (ratings[d.id]) { const t = ratings[d.id].fit; fitInfo[d.id] = { fit: blend(obj, t, TASTE_WEIGHT), obj, taste: t, w: TASTE_WEIGHT, conf: 1, src: 'you' }; continue }
    const src = [] // { est, w, why }
    const t = tokOf(d); let wSum = 0, sum = 0; const like = []
    for (const x of rated) {
      let inter = 0, union = 0
      for (const w of t) { union += W(w); if (x.t.has(w)) inter += W(w) }
      for (const w of x.t) if (!t.has(w)) union += W(w)
      const sim = union ? inter / union : 0
      // close names count within the same kind of product; across kinds only when near-identical
      if (sim < 0.3 || (x.cat && x.cat !== d.cat && sim < 0.5)) continue
      const w = sim * sim; wSum += w; sum += w * x.r; like.push(shortName(x.name))
    }
    if (wSum) src.push({ est: sum / wSum, w: Math.min(0.9, wSum * 1.5), why: like.slice(0, 2).join(', ') })
    const g = byGroup[d.group], b = byBrand[brandOf(d)], dp = byDept[deptOf(d)]
    if (g) src.push({ est: avg(g), w: backed(g.length, 0.6), why: `your ${d.group} ratings (${g.length})` })
    if (b) src.push({ est: avg(b), w: backed(b.length, d.ownBrand ? 0.1 : 0.35), why: `${brandOf(d)} (${b.length} rated)` })
    if (dp) src.push({ est: avg(dp), w: backed(dp.length, 0.2), why: `${(DEPTS[deptOf(d)] ?? '').toLowerCase()} (${dp.length} rated)` })
    if (!src.length) { fitInfo[d.id] = { fit: obj, obj, src: 'objective' }; continue }
    if (d.rating && d.reviews >= 5) src.push({ est: d.rating * 2, w: 0.1, why: `Sainsbury's shoppers ${d.rating}★` })
    const sw = src.reduce((a, x) => a + x.w, 0), taste = src.reduce((a, x) => a + x.est * x.w, 0) / sw
    const conf = 1 - src.reduce((p, x) => p * (1 - x.w), 1) // more agreeing sources, more confidence
    const w = LEARNED_MAX * conf
    fitInfo[d.id] = { fit: blend(obj, taste, w), obj, taste: Math.round(taste), w, conf, src: 'learned', from: src.sort((x, y) => y.w - x.w).map((x) => x.why) }
  }
}
const fitOf = (d) => fitInfo[d.id]?.fit ?? d.fit
// "Best overall": health 60%, value 25%, taste 15% (the server's score has taste neutral; his taste moves it here)
const allround = (d) => ((d.score ?? (0.6 * d.fit + 0.25 * d.value + 0.75)) + 0.15 * ((fitInfo[d.id]?.taste ?? 5) - 5)) * 100 + (d.fitParts?.processing ?? 0)
const lvl = (v, lo, hi) => (v == null ? '' : v <= lo ? 'g' : v <= hi ? 'a' : 'r')
const scoreCls = (n) => (n == null ? '' : n >= 7 ? 'g' : n >= 5 ? 'a' : 'r')
const partsText = (d) => d.fitParts ? `protein ${d.fitParts.protein ?? '–'} · saturated fat ${d.fitParts.sat ?? '–'} · processing ${d.fitParts.processing ?? '–'}` : ''
// Processing chips (always visible): NOVA-style verdict + any watch-list additives.
const procChips = (d) => {
  const pr = d.proc, p = d.fitParts?.processing
  if (!pr) return d.isBasic
    ? `<span class="l g score" title="A plain ingredient: the food itself, nothing added">Whole food · nothing added</span>`
    : `<span class="l score est" title="The ingredients haven't been read yet${p != null ? `, so processing ${p}/10 is an estimate from the name and type` : ''}.">Ingredients not read yet</span>`
  const nova = novaOf(pr), n = pr.count ?? '?'
  const label = d.isBasic ? 'Whole food · nothing added'
    : nova === 1 ? `Unprocessed · ${n} ingredient${n === 1 ? '' : 's'}`
    : nova === 3 ? `No UPF additives · ${n} ingredient${n === 1 ? '' : 's'}`
    : `Ultra-processed · ${pr.markers.length} marker${pr.markers.length === 1 ? '' : 's'}`
  const title = `Processing ${p ?? '–'}/10\nIngredients: ${n}` + (pr.markers.length ? `\nUltra-processing markers: ${pr.markers.join(', ')}` : '') + (pr.watch.length ? `\nWatch list: ${pr.watch.join(', ')}` : '')
  // An "Ultra-processed" chip never shows green, even when only one marker keeps its score high
  const cls = nova === 4 ? (p != null && p < 5 ? 'r' : 'a') : p != null ? scoreCls(p) : 'g'
  return `<span class="l ${cls} score" title="${esc(title)}">${label}</span>` +
    pr.watch.map((w) => `<span class="l r" title="Flagged as high risk of overexposure / contested">⚠ ${esc(w)}</span>`).join('')
}
function procShort(d) {
  const pr = d.proc, p = d.fitParts?.processing
  if (!pr) return d.isBasic ? '<span class="l g score">Whole food</span>' : ''
  const nova = novaOf(pr)
  const t = d.isBasic ? 'Whole food' : nova === 1 ? 'Unprocessed' : nova === 3 ? 'No UPF' : `UPF ×${pr.markers.length}`
  const cls = nova === 4 ? (p != null && p < 5 ? 'r' : 'a') : p != null ? scoreCls(p) : 'g'
  return `<span class="l ${cls} score" title="${esc(`Processing ${p ?? '–'}/10${pr.markers.length ? ' · markers: ' + pr.markers.join(', ') : ''}`)}">${t}${pr.watch.length ? ` ⚠${pr.watch.length}` : ''}</span>`
}
// Seed oils and folic acid: shown on the card and in the sheet. Folic acid is a warning only and never changes a score.
const seedChip = (d) => d.seedOil === 'none' ? '<span class="l g" title="No seed oils">No seed oil</span>'
  : d.seedOil === 'yes' ? '<span class="l r" title="Contains seed oils">Seed oil</span>'
  : d.seedOil === 'likely' ? '<span class="l a" title="May contain a seed oil">Maybe seed oil</span>' : ''
const folicChip = (d) => d.folic ? '<span class="l r folic" title="Lists folic acid as an ingredient. A warning only: it doesn\'t change the score.">Contains folic acid</span>' : ''
// Is it at Chislehurst? Dad's own Found it / Not here reports beat everything; "Check in store" is never "not stocked"
function storeView(d) {
  const s = d.store ?? {}, sure = s.status === 'yes' || s.status === 'likely', at = s.checkedAt ? ` (checked ${whenText(s.checkedAt)})` : ''
  if (s.status === 'no') return { text: 'Not at Chislehurst', tone: 'r', detail: s.reason ?? 'Not on the Chislehurst shelf list.' }
  if (s.inStock === false) return { text: 'Out today at Chislehurst', tone: 'r', detail: `Chislehurst usually has it, but it's showing out of stock right now${at}` }
  if (s.inStock === true) return { text: 'In stock at Chislehurst', tone: 'g', detail: `${s.reason ?? 'On the Chislehurst shelf list.'}${at}` }
  if (sure) return { text: 'At Chislehurst ✓', tone: 'g', detail: s.reason ?? (s.status === 'yes' ? 'On the Chislehurst shelf list.' : 'Probably on the shelf at Chislehurst.') }
  return { text: 'Check in store', tone: 'n', detail: s.reason ?? 'Not sure it is stocked at Chislehurst. Worth a look when you are there.' }
}
const storeChip = (d) => { const v = storeView(d); return `<span class="l store ${v.tone}" title="${esc(v.detail)}">${esc(v.text)}</span>` }
const valueText = (d) => d.noValue ? 'Value: no price comparison possible yet' : `Value ${d.value}/10`
const valueChip = (d, short) => d.noValue
  ? `<span class="l est score" title="${esc(valueText(d))}">${short ? 'V' : 'Value '}–</span>`
  : `<span class="l ${scoreCls(d.value)} score" title="${esc(valueText(d))}">${short ? 'V' : 'Value '}${d.value}</span>`
const fitChip = (d, short) => {
  const f = fitInfo[d.id] ?? { fit: d.fit, obj: d.fit, src: 'objective' }
  if (d.noFit && f.src !== 'you') return `<span class="l est score" title="Not scored yet: the ingredients or nutrition haven't been read">${short ? 'F' : 'Fit '}–</span>`
  const mark = { you: '✓', learned: '≈', objective: '' }[f.src]
  const title = `Health ${f.obj}/10 (${partsText(d)})` +
    (f.src === 'you' ? ` + your taste ${f.taste} (${Math.round(f.w * 100)}%)` : f.src === 'learned' ? ` + taste ≈${f.taste} learned from ${f.from.join(', ')} (${Math.round(f.w * 100)}%)` : '') + ` → Fit ${f.fit}`
  return `<span class="l ${scoreCls(f.fit)} score" title="${esc(title)}">${short ? 'F' : 'Fit '}${f.fit}${mark ? (short ? '' : ' ') + mark : ''}</span>`
}
// "Why Fit N?": health is protein 35% + saturated fat 30% + processing 35% (the pipeline's score), then his taste blended in.
function whyFit(d, det) {
  const p = d.fitParts, f = fitInfo[d.id] ?? { fit: d.fit, obj: d.fit, src: 'objective' }
  if (!p || d.noFit) return `<details class="why"><summary>Why no Fit?</summary><p>Nothing to judge it from yet: the ingredients and nutrition haven't been read.</p></details>`
  const fw = det?.fitWhy ?? {}
  const row = (label, key, weight) => p[key] == null ? '' : `<li><strong class="${scoreCls(p[key])}t">${label} ${p[key]}/10</strong> <span class="muted">× ${weight}%</span>${(fw[key] ?? []).length ? `<br>${fw[key].map(esc).join(' · ')}` : ''}</li>`
  const extra = [...Object.entries(fw).filter(([k]) => !['protein', 'sat', 'processing'].includes(k)).flatMap(([, v]) => v), ...(d.why ?? [])]
  const taste = f.src === 'you'
    ? `Your taste rating ${f.taste} counts ${Math.round(f.w * 100)}%: ${f.obj} × ${1 - f.w} + ${f.taste} × ${f.w} = ${(f.obj * (1 - f.w) + f.taste * f.w).toFixed(2)} → <strong>${f.fit}</strong>`
    : f.src === 'learned'
      ? `Taste ≈${f.taste} estimated from ${esc(f.from.join('; '))}, counted ${Math.round(f.w * 100)}%: ${f.obj} × ${(1 - f.w).toFixed(2)} + ${f.taste} × ${f.w.toFixed(2)} → <strong>${f.fit}</strong>`
      : `No taste rating yet (rate it with "Taste" to blend yours in at 50%). Fit = <strong>${f.fit}</strong>`
  return `<details class="why"><summary>Why Fit ${f.fit}?</summary><ul>
    ${row('Protein', 'protein', 35)}${row('Saturated fat', 'sat', 30)}${row('Processing', 'processing', 35)}
    <li><strong>Health</strong> → <strong>${d.fit}</strong>${extra.length ? `<br>${[...new Set(extra)].map(esc).join(' · ')}` : ''}</li>
    <li>${taste}</li>
  </ul><p class="muted">Saturated fat only counts against processed food: a steak or full-fat yogurt isn't marked down. Folic acid never changes the score. Price never affects Fit: that's Value.</p></details>`
}
// "Why Value N?": whatever the value working holds, plainly
function whyValue(d) {
  const v = d.valueParts ?? {}, nice = (k) => k.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').toLowerCase()
  const rows = Object.entries(v).filter(([, x]) => typeof x === 'number' || typeof x === 'string')
    .map(([k, x]) => `<li><strong>${esc(cap(nice(k)))}</strong> <span class="muted">${typeof x === 'number' ? +x.toFixed(2) : esc(x)}</span></li>`)
  if (d.compare) rows.push(`<li><strong>${gbp(d.compare.value)} ${esc(COMPARE_LABEL[d.compare.per] ?? '/' + d.compare.per)}</strong> <span class="muted">at the Nectar/offer price you pay</span></li>`)
  if (d.noValue) rows.push('<li><strong>Can\'t judge the price yet</strong><br>There is nothing per kg or per gram of protein to compare, so 5 is used in the sums.</li>')
  return `<details class="why"><summary>Why Value ${d.noValue ? '–' : d.value}?</summary><ul>${rows.join('') || '<li>No working available.</li>'}</ul><p class="muted">Value = how much good food you get for your money, not just the size of the discount. It counts for less than health (Best overall: health 60%, value 25%, taste 15%).</p></details>`
}
// Less-processed alternative inside the same multi-buy (or meal-deal part): must be clearly cleaner (processing +2)
// and fit about as well (Fit −1 at most).
function betterAlt(d) {
  if (!(inMulti(d) || d.deal) || d.fitParts?.processing == null) return null
  const mine = fitOf(d), proc = d.fitParts.processing
  return deals
    .filter((a) => a.id !== d.id && !a.oos && !basket[a.id] && !removals[a.id] && (inMulti(d) ? a.best?.label === d.best.label : a.deal?.id === d.deal.id && a.slot === d.slot) &&
      a.cat === d.cat && a.fitParts?.processing >= proc + 2 && fitOf(a) >= mine - 1 && !a.why?.some((w) => w.startsWith('avoid')))
    .sort((a, b) => b.fitParts.processing - a.fitParts.processing || fitOf(b) - fitOf(a))[0] ?? null
}
const swapChip = (d, withButton) => {
  const a = betterAlt(d)
  if (!a) return ''
  return `<span class="l g swapchip" title="Less processed option in the same deal: ${esc(a.name)} — processing ${a.fitParts.processing}/10 vs ${d.fitParts.processing}/10, Fit ${fitOf(a)} vs ${fitOf(d)}">↺ <span class="swapname">Cleaner: ${esc(shortName(a.name))}</span> <b>${a.fitParts.processing} vs ${d.fitParts.processing}</b>${withButton ? `<button class="swapbtn" data-swap="${d.id}" data-to="${a.id}">Swap</button>` : ''}</span>`
}

let rankOf = {} // deal view: id -> best-overall rank
let rankPart = {} // meal deal: id -> the part its rank is within ("#1 in mains")
let similarView = null // product id: show everything like it
let dealView = null // offer label being managed (all products in that deal)
function enterView() { if (!dealView && !similarView) viewPrev = { cat, grp, prot, q: $('#q').value }; cat = 'all'; grp = 'all'; prot = 'all'; $('#q').value = ''; viewSort = false; jumpBack = null }
function openSimilar(id) {
  enterView(); similarView = id; dealView = null; similarAll = false; limit = 120; render()
  root.scrollTo({ top: 0, behavior: smooth() })
}
// Same type (comparison group) or closely named in the same category
function similarTo(d) {
  const t = tokOf(d)
  return deals.filter((a) => !a.oos && (a.id === d.id || (d.group && a.group === d.group) || (a.cat === d.cat && (() => {
    const u = tokOf(a); let inter = 0; for (const w of t) if (u.has(w)) inter++
    return inter / (t.size + u.size - inter || 1) >= 0.34
  })())))
}
function openDeal(label) {
  closeDrawer()
  enterView(); similarView = null
  dealView = label; limit = 120; render()
  root.scrollTo({ top: 0, behavior: smooth() })
}
// the open deal or similar list (null when browsing normally); inside it every product is its own swap and list items always show
// the offer with this wording on a product: its multi-buy, or the meal deal it is part of
const offerIn = (d, label) => d?.offers?.find((o) => o.label === label) ?? null
const viewPool = () => similarView ? similarTo(byId[similarView]) : dealView ? deals.filter((d) => offerIn(d, dealView) && !d.oos) : null
// inside a deal everything shows (only the sort changes); the similar list still follows filters and search
// a similar-products list can set his filters aside (Show all); search still narrows it
let similarAll = false
const viewOk = (d, q) => !!dealView || !!basket[d.id] || (similarView && similarAll ? (!q || d.name.toLowerCase().includes(q)) && !d.oos : filterOk(d, q))
listen(root, 'click', (e) => { const b = e.target.closest('[data-simall]'); if (b) { similarAll = b.dataset.simall === '1'; render() } })
function viewNote(items) {
  const q = $('#q').value.toLowerCase().trim(), shown = items.filter((d) => catOk(d) && viewOk(d, q)).length
  const rank = viewSort ? `ranked by ${esc($('#sort').selectedOptions[0]?.textContent ?? '')}` : 'ranked best → worst overall (health 60%, value 25%, taste 15%)'
  if (dealView) return `everything in the deal shows (filters don't apply here) · ${rank}`
  const hid = items.length - shown
  return `${similarAll ? `all ${items.length} shown, your filters set aside here <button type="button" class="linkbtn simall" data-simall="0">Use my filters</button> · `
    : hid ? `showing ${shown} of ${items.length} · ${hid} hidden by your filters <button type="button" class="linkbtn simall" data-simall="1">Show all</button> · ` : ''}${rank}`
}
function renderDealBar() {
  const bar = $('#dealbar')
  if (similarView) {
    const d = byId[similarView], n = similarTo(d).length
    bar.hidden = false
    bar.innerHTML = `<div class="dealbar" style="--gbg:var(--n-bg);--gfg:var(--ink)">
      ${d.img ? `<img referrerpolicy="no-referrer" src="${esc(d.img)}" alt="" width="44" height="44" style="object-fit:contain;background:#fff;border-radius:6px" />` : '<span></span>'}
      <div><strong>Similar to ${esc(shortName(d.name))}</strong> · ${n} products (${esc(d.group ?? d.cat ?? '')})<br>
        <span class="muted">${viewNote(similarTo(d))} · offers and shelf prices</span></div>
      <button class="chip" id="closeDeal">✕ Back to all products</button></div>`
    return
  }
  if (!dealView) { bar.hidden = true; return }
  const items = viewPool()
  const d0 = items[0], o0 = offerIn(d0, dealView), g = groupOf[dealView], have = items.reduce((s, d) => s + (basket[d.id] ?? 0), 0)
  const need = o0?.bundle?.size ?? o0?.minQty ?? 1
  const title = o0?.kind === 'mealdeal' ? o0.label : d0?.offerShort ?? 'Deal'
  const parts = o0?.bundle ? ` (${o0.bundle.parts.map((x) => x.n + ' ' + x.what).join(' + ')})` : ''
  // a meal deal: one chip per part, filled as he picks, each jumps to its section
  const slots = o0?.bundle?.parts?.map((w, i) => {
    const got = items.filter((d) => d.slot === w.what).reduce((n, d) => n + (basket[d.id] ?? 0), 0)
    return `<button type="button" class="pchip ${got >= w.n ? 'ok' : got ? 'part' : ''}" data-slotjump="${i}" title="Show the ${esc(w.what.toLowerCase())} options">${got >= w.n ? '✓ ' : ''}${esc(w.what)} <b>${Math.min(got, w.n)}/${w.n}</b></button>`
  }).join('') ?? ''
  bar.hidden = false
  bar.innerHTML = `<div class="dealbar" style="--gbg:${g?.bg ?? 'var(--n-bg)'};--gfg:${g?.fg ?? 'var(--ink)'}">
    ${g ? `<span class="gl">${g.letter}</span>` : '<span></span>'}
    <div><strong>${esc(title)}</strong>${esc(parts)} · ${items.length} products in this deal<br>
      ${slots ? `<span class="pchips">${slots}${o0.bundle.price ? `<span class="muted">${gbp(o0.bundle.price)} when all ${need} are in</span>` : ''}</span>` : ''}
      <span class="muted">${have} on your list${o0?.kind === 'mealdeal' ? '' : have % need ? ` · add ${need - (have % need)} more to complete a set` : have ? ' · ✓ complete' : ''} · ${viewNote(items)} · ${locks[dealView] ? '<strong class="gt">🔒 locked</strong>: untick Happy on the list to swap' : 'swap with + / −'}</span></div>
    <button class="chip" id="closeDeal">✕ Back to all products</button></div>`
}
// "For you": offers he hasn't got yet that suit his taste (his ratings, or learned from similar products he rated)
// and are good value. Anything he removed, rated 5 or less, or already has is left out.
// He doesn't cook from scratch: ingredients (flour, spices, oils, plain veg) only come up when they're one of his needs.
const COOKING_DEPTS = new Set(['herbs', 'baking', 'sauces', 'veg'])
let groupAff = {} // comparison group -> how much he goes for that kind of thing (list + ratings), rebuilt every render
function buildAffinity() {
  groupAff = {}
  const add = (g, w) => { if (g) groupAff[g] = (groupAff[g] ?? 0) + w }
  for (const [id, q] of Object.entries(basket)) if (q > 0) add(byId[id]?.group, 1)
  for (const [id, r] of Object.entries(ratings)) add(byId[id]?.group, (r.fit - 5) / 2)
}
const dislikely = (d) => { const fi = fitInfo[d.id]; return fi?.src === 'learned' && fi.taste <= 4 && fi.conf >= 0.4 }
const recOk = (d) => d.onOffer && !d.oos && !d.nonFood && !basket[d.id] && !removals[d.id] && !(ratings[d.id]?.fit <= 5) && !dislikely(d) &&
  d.value >= 6 && fitOf(d) >= 6 && ((d.discount ?? 0) >= 0.15 || isMulti(d)) &&
  (!COOKING_DEPTS.has(deptOf(d)) || d.needs?.length) && (effPrice(d) ?? 0) <= 10 && (groupAff[d.group] ?? 0) > -1
// The For you page: sections of inspiration, each product in the first one it fits. Built on his taste (ratings + the
// learned profile), what he buys (group affinity), good deals and Sainsbury's "New" badge.
const notForMe = (d) => d.oos || d.nonFood || basket[d.id] || removals[d.id] || ratings[d.id]?.fit <= 5 || dislikely(d)
const likesKind = (d) => (groupAff[d.group] ?? 0) >= 1 || (fitInfo[d.id]?.taste ?? 0) >= 7
const FY_SECTIONS = [
  ['fav', 'Your favourites on offer', "Things you rated 7+ that are on offer now", (d) => ratings[d.id]?.fit >= 7 && d.onOffer],
  ['top', 'Top picks for you', 'Your taste, good value and a real saving', (d) => recOk(d)],
  ['new', 'New in what you like', "Just arrived at Sainsbury's, in the kinds of food you go for", (d) => d.isNew && likesKind(d) && !COOKING_DEPTS.has(deptOf(d)) && d.value >= 4],
  ['try', 'You might like these', "Not tried yet, but close to things you rated well", (d) => !ratings[d.id] && fitInfo[d.id]?.src === 'learned' && fitInfo[d.id].taste >= 7 && fitInfo[d.id].conf >= 0.3 && !COOKING_DEPTS.has(deptOf(d))],
  ['deal', 'Big deals on your kinds of food', '30%+ off in the types you buy and rate well', (d) => (groupAff[d.group] ?? 0) >= 1 && (d.discount ?? 0) >= 0.3 && d.value >= 6],
]
const fySection = (d) => (notForMe(d) ? null : FY_SECTIONS.find(([, , , test]) => test(d))?.[0] ?? null)
// A meal deal laid out to build: one section per part of the bundle ("Main", "Side", "Dessert"), each saying how many
// you've picked. Parts with nothing in the catalog say so instead of disappearing.
listen(root, 'click', (e) => {
  const i = e.target.closest('[data-slotjump]')?.dataset.slotjump
  if (i != null) elById(`slot-${i}`)?.scrollIntoView({ behavior: smooth(), block: 'start' })
})
function renderMealDeal(list) {
  const wanted = offerIn(byId[list[0].id], dealView).bundle.parts
  const slotOf = (d) => wanted.find((w) => w.what === d.slot) ?? null // which part of the deal it fills
  const pool = viewPool() // the whole deal, for the "picked" counts (filters only change what's listed)
  // ranks count within each part (best main #1, best side #1), not across the whole deal; a sort he picked keeps its order
  rankOf = {}; rankPart = {}
  const html = wanted.map((w) => {
    const items = list.filter((d) => slotOf(d) === w)
    if (!viewSort) items.sort((x, y) => allround(y) - allround(x))
    items.forEach((d, i) => { if (!viewSort) { rankOf[d.id] = i + 1; rankPart[d.id] = w.what.toLowerCase() } })
    const have = pool.filter((d) => slotOf(d) === w).reduce((n, d) => n + (basket[d.id] ?? 0), 0)
    const state = have >= w.n ? `<span class="gt">✓ ${have} of ${w.n} picked</span>` : `${have} of ${w.n} picked`
    return `<h3 class="needhead fyhead" id="slot-${wanted.indexOf(w)}">${esc(w.what)} <span class="muted">${state}</span></h3>` +
      (items.length ? items.map(card).join('') : `<p class="muted mdnone">Nothing for "${esc(w.what.toLowerCase())}" in this deal yet</p>`)
  }).join('')
  const other = list.filter((d) => !slotOf(d))
  $('#grid').innerHTML = html + (other.length ? `<h3 class="needhead fyhead">Also in this deal <span class="muted">part not known</span></h3>${other.map(card).join('')}` : '')
  $('#more').hidden = true
}
function renderForYou(list) {
  const per = Math.max(12, Math.round(limit / 4)) // per shelf; Show more adds to each
  const html = FY_SECTIONS.map(([k, title, sub]) => {
    const items = list.filter((d) => fySection(d) === k)
    if (k !== 'top' || on('qFinest')) items.sort((a, b) => recScore(b) - recScore(a))
    if (!items.length) return ''
    return `<section class="fyshelf" aria-label="${esc(title)}"><div class="fyhead"><h3>${esc(title)}<span class="muted">${esc(sub)} · ${items.length}${items.length > per ? `, showing ${per}` : ''}</span></h3>
      <span class="fynav"><button type="button" data-fyscroll="-1" aria-label="Scroll ${esc(title)} back" disabled>‹</button><button type="button" data-fyscroll="1" aria-label="Scroll ${esc(title)} on">›</button></span></div>
      <div class="fyrow">${items.slice(0, per).map(card).join('')}</div></section>`
  }).join('')
  $('#more').hidden = false
  $('#more').textContent = 'Show more of each'
  $('#grid').innerHTML = html || '<p>Nothing for you here with these filters. Rate a few products (Taste on any card) and this page learns what you like.</p>'
  for (const row of $$('.fyrow')) fyEdges(row)
}
// shelf ends: the arrows grey out and the soft edge fade goes at either end
function fyEdges(row) {
  const end = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4, start = row.scrollLeft <= 4
  row.classList.toggle('more-r', !end); row.classList.toggle('more-l', !start)
  const nav = row.previousElementSibling?.querySelectorAll('[data-fyscroll]')
  if (nav) { nav[0].disabled = start; nav[1].disabled = end }
}
listen(root, 'scroll', (e) => { if (e.target.classList?.contains('fyrow')) fyEdges(e.target) }, { capture: true })
listen(root, 'click', (e) => {
  const b = e.target.closest('[data-fyscroll]'); if (!b) return
  const row = b.closest('.fyshelf').querySelector('.fyrow')
  row.scrollBy({ left: +b.dataset.fyscroll * row.clientWidth * 0.85, behavior: smooth() })
})
function recScore(d) {
  const fi = fitInfo[d.id], taste = fi?.taste, p = d.n100?.protein ?? 0
  return fitOf(d) + 0.5 * (d.value ?? 0) + 2.5 * Math.min(d.discount ?? 0, 0.6) +
    (taste != null ? (taste - 6) * 0.8 * (fi.src === 'you' ? 1 : fi.conf) : 0) + (d.needs?.length ? 0.5 : 0) +
    Math.max(-1.5, Math.min(2.5, groupAff[d.group] ?? 0)) + // more of the kinds of thing he buys and rates well
    (p >= 15 ? 0.8 : p >= 10 ? 0.4 : 0)
}
function recWhy(d) {
  const fi = fitInfo[d.id], why = []
  if (d.isNew) why.push("new at Sainsbury's")
  if (fi?.src === 'you') why.push(`you rated it ${fi.taste}`)
  else if (fi?.src === 'learned' && fi.taste >= 7) why.push(`taste ≈${fi.taste} from ${fi.from[0]}`)
  if ((d.discount ?? 0) >= 0.15) why.push(`${Math.round(d.discount * 100)}% off`)
  else if (isMulti(d)) why.push(d.offerShort)
  if ((groupAff[d.group] ?? 0) >= 1.5) why.push(`you often go for ${d.group.replace(/ \(.*\)/, '')}`)
  if ((d.n100?.protein ?? 0) >= 15) why.push(`${Math.round(d.n100.protein)}g protein /100g`)
  if (d.value >= 8 && !d.noValue) why.push(`Value ${d.value}`)
  if (d.needs?.length) why.push(`one of your usuals (${d.needs[0]})`)
  return why.join(' · ')
}
// mix it up: each further product of the same type sinks a little, so the top isn't ten of one thing
function spreadOut(list) {
  const seen = {}, score = new Map(list.map((d) => [d.id, recScore(d) - 1.2 * (seen[d.group ?? d.cat] = (seen[d.group ?? d.cat] ?? -1) + 1)]))
  list.sort((a, b) => score.get(b.id) - score.get(a.id))
}
// every filter button + the search box (not the view or category): shared by the list and the menu counts
const QUICK_IDS = [] // toggles next to Filters (not counted in its badge)
const ingN = (d) => (d.proc?.count > 0 ? d.proc.count : Infinity) // ingredients on the label; unknown until the label is read
const FILTER_IDS = ['fNew', 'fUpf0', 'fUpf1', 'fUpf2', 'fFrozen', 'fSat', 'fGood', 'fDeals', 'fRated', 'fBasket', 'fPlain', 'fOwn', 'fOos', 'fNoFolic', 'qFinest', 'qForYou']
// "Ordered before" shows everything he's bought that Sainsbury's still has: the Only / Hide filters don't apply there
// Meal deals and Multi-buys show every product in the deal: the Only / Hide filters don't apply there, only sorting
const dealMode = () => mode === 'mealdeal' || mode === 'meal-deals'
const dealOk = (d, q) => (!q || d.name.toLowerCase().includes(q)) && !d.oos
const listOk = (d, q) => cat === 'c:ordered' ? orderedOk(d, q) : dealMode() ? dealOk(d, q) : filterOk(d, q)
const orderedOk = (d, q) => !!ordered[d.id] && !d.oos && (!q || d.name.toLowerCase().includes(q))
// ultra-processing limit (one of None / ≤1 / ≤2 markers): needs a read label; a plain whole food counts as none
const upfMax = () => on('fUpf0') ? 0 : on('fUpf1') ? 1 : on('fUpf2') ? 2 : null
const upfOk = (d) => { const m = upfMax(); return m == null || (d.proc ? d.proc.markers.length <= m : d.isBasic === true) }
const filterOk = (d, q) =>
    (!on('fDeals') || (d.onOffer && (d.discount ?? 0) >= 0.25 && d.value >= 6 && !d.needs?.length)) &&
    (!on('fFrozen') || d.frozen) &&
    (!on('fSat') || q || !d.highSat || ordered[d.id]) && // a search finds what he typed, whatever the default Hide filters say; things he's already bought aren't hidden by them either
    (!on('fGood') || q || d.value >= 5 || basket[d.id] || ordered[d.id]) &&
    (!on('fRated') || ratings[d.id]) &&
    (!on('fBasket') || basket[d.id]) &&
    (!on('fPlain') || !isOneIngredient(d)) && // hides EVERY one-ingredient food, searched for or not
    (!on('fNew') || d.isNew) &&
    (!on('fNoFolic') || !d.folic) &&
    upfOk(d) &&
    (!on('qFinest') || d.premium) &&
    (!on('qForYou') || recOk(d)) &&
    (!on('fOwn') || !d.ownBrand) &&
    (!on('fOos') || q || !d.oos || basket[d.id]) && // out today / "Not here": hidden, but a search still finds it
    (!d.nonFood || basket[d.id] || ordered[d.id]) &&
    (!q || `${d.name} ${d.brand ?? ''}`.toLowerCase().includes(q))
function render() {
  renderDealBar()
  if ($('#pd').open) fillProduct()
  const q = $('#q').value.toLowerCase().trim()
  syncFilterUI() // counts on the menu and the Type/Protein buttons follow every filter that's on
  const vp = viewPool()
  const list = vp ? (dealView ? vp : vp.filter((d) => catOk(d) && viewOk(d, q))) : deals.filter((d) =>
    modeOk(d) && catOk(d) && listOk(d, q))
  const val = {
    value: (d) => d.value * 100 + (fitOf(d) ?? 5) * 8 + d.discount * 10, // same Value score: what suits him first
    score: (d) => allround(d) + d.discount,
    ppp: (d) => d.proteinPerPound ?? -1,
    rec: recScore,
    saving: (d) => d.discount ?? 0,
    price: (d) => -(effPrice(d) ?? 999),
    few: (d) => -Math.min(ingN(d), 999) * 100 + d.value,
    allround,
  }[(dealView || similarView) && !viewSort ? 'allround' : $('#sort').value]
  list.sort((a, b) => val(b) - val(a))
  if (val === recScore && !dealView && !similarView) spreadOut(list)
  // inside deal tabs filters never hide, so New this week only brings the new ones to the top (stable, keeps the sort)
  if (on('fNew') && dealMode() && !vp) list.splice(0, list.length, ...list.filter((d) => d.isNew), ...list.filter((d) => !d.isNew))
  rankOf = dealView || similarView ? Object.fromEntries(list.map((d, i) => [d.id, i + 1])) : {}; rankPart = {}
  $('#more').hidden = !jumpBack && list.length <= limit
  $('#more').textContent = jumpBack ? '← Back to all products' : 'Show more'
  if (dealView && list.length && offerIn(byId[list[0].id], dealView)?.bundle) return renderMealDeal(list)
  if (mode === 'foryou' && !dealView && !similarView && !q) return renderForYou(list)
  const hiddenHere = list.length ? 0 : (vp ?? deals.filter((d) => modeOk(d) && !d.oos)).filter(catOk).length
  const onNames = FILTER_IDS.filter(on).map((f) => $('#' + f).textContent.trim())
  $('#grid').innerHTML = (!vp && !q && cat === 'all' ? mode === 'mealdeal' ? mealDealIndex() : mode === 'meal-deals' ? multiBuyIndex() : '' : '') + list.slice(0, limit).map(card).join('') || (hiddenHere && onNames.length
    ? `<p>${hiddenHere} products here are hidden by your filters (${esc(onNames.join(', '))}). <button class="chip" id="clearFilters">Show them</button></p>`
    : cat !== 'all' || grp !== 'all' ? `<p>No ${esc(grp !== 'all' ? cap(grp) : catName(cat))} in ${esc(MODES.find(([m]) => m === mode)?.[1] ?? 'this view')} right now. <button class="chip" id="allCats">Show all categories</button></p>` : '<p>No matches.</p>')
  $('#allCats')?.addEventListener('click', () => { cat = 'all'; grp = 'all'; prot = 'all'; render() })
  $('#clearFilters')?.addEventListener('click', () => { for (const f of FILTER_IDS) $('#' + f).setAttribute('aria-pressed', 'false'); render() })
  // keep the chosen Type/Protein button in view on phones, where those rows scroll sideways
  for (const b of $$('#segs [aria-pressed="true"]:not([data-grp="all"]):not([data-prot="all"])')) b.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}
// Meal deals tab: the deals themselves first (each opens its build page), then every product in them
// A deal's rating is what you'd actually put in it: the average Value and Fit of its best set (best items for each
// meal-deal part, or the best items to fill a multi-buy), not of every product it covers
function bestSet(items, o) {
  const top = (list, n) => [...list].sort((a, b) => allround(b) - allround(a)).slice(0, n)
  const set = o.bundle ? o.bundle.parts.flatMap((p) => top(items.filter((d) => d.slot === p.what), p.n)) : top(items, o.minQty ?? 2)
  return set.length ? set : top(items, o.bundle?.size ?? 2) // parts not worked out: the best few overall
}
function setScore(items, o) {
  const set = bestSet(items, o)
  if (!set.length) return ''
  const avg = (xs) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null)
  const v = avg(set.filter((d) => !d.noValue).map((d) => d.value)), f = avg(set.filter((d) => !d.noFit).map(fitOf))
  const chip = (lbl, x) => (x == null ? '' : `<span class="l ${scoreCls(x)}">${lbl} ${x}</span>`)
  return `<span class="mdscore" title="${esc(`Average of the best ${set.length} you'd pick: ${set.map((d) => shortName(d.name)).join(', ')}`)}">${chip('Value', v)}${chip('Fit', f)}</span>`
}
function mealDealIndex() {
  const by = {}
  for (const d of deals) if (!d.oos) for (const o of d.offers) if (o.kind === 'mealdeal' && o.bundle) (by[o.label] ??= { o, items: [] }).items.push(d)
  const rows = Object.entries(by).sort(([, a], [, b]) => b.items.length - a.items.length)
  if (!rows.length) return ''
  return `<section class="mdindex"><h2>${rows.length} meal deal${rows.length === 1 ? '' : 's'} on now</h2><div class="mdrow">${rows.map(([label, { o, items }]) => {
    const b = o.bundle, have = items.reduce((s, d) => s + (basket[d.id] ?? 0), 0)
    return `<button type="button" class="mdcard" data-deal="${esc(label)}"><strong>${esc(label)}</strong>${setScore(items, o)}
      <span class="mdprice">${b.price ? gbp(b.price) : 'Meal deal'}</span>
      <span class="muted">${esc(b.parts.map((x) => x.n + ' ' + x.what).join(' + '))}</span>
      <span class="muted">${items.length} products${have ? ` · <strong class="gt">${have} on list</strong>` : ''}</span></button>`
  }).join('')}</div><p class="muted">Every product below is in one of these deals. Open a deal to build it; filters don't hide anything here, only the sort applies.</p></section>`
}
// Multi-buys tab: every multi-buy on now, as cards at the top (each opens its page to fill it), ranked by how well
// its best three products suit him (the For you score), so the ones worth completing come first
let mbAll = false
function multiBuyIndex() {
  const by = {}
  for (const d of deals) if (!d.oos && !d.nonFood) for (const o of d.offers) if (o.kind === 'multi') (by[o.label] ??= { o, items: [] }).items.push(d)
  const score = (items) => items.map(recScore).sort((a, b) => b - a).slice(0, 3).reduce((s, x) => s + x, 0) / Math.min(3, items.length) // same score as For you: his taste, what he buys, value
  const rows = Object.entries(by).map(([label, g]) => ({ label, ...g, s: score(g.items) })).sort((a, b) => b.s - a.s)
  if (!rows.length) return ''
  const shown = mbAll ? rows : rows.slice(0, 12)
  return `<section class="mdindex"><h2>${rows.length} multi-buys on now <span class="muted">· best for you first</span></h2><div class="mdrow">${shown.map(({ label, o, items }) => {
    const offer = items[0].offerShort ?? label, have = items.reduce((n, d) => n + (basket[d.id] ?? 0), 0), need = o.minQty ?? 2
    const names = [...items].sort((a, b) => recScore(b) - recScore(a)).slice(0, 2).map((d) => shortName(d.name)).join(', ')
    return `<button type="button" class="mdcard" data-deal="${esc(label)}"><strong>${esc(offer)}</strong>${setScore(items, o)}
      <span class="mdprice">${esc(names)}${items.length > 2 ? '…' : ''}${o.discount ? ` <span class="muted">· save ${Math.round(o.discount * 100)}%</span>` : ''}</span>
      <span class="muted">${items.length} products${o.until ? ` · ends ${esc(fmtEnds(o.until))}` : ''}${have ? ` · <strong class="${have % need ? 'at' : 'gt'}">${have} on list${have % need ? `, add ${need - (have % need)}` : ' ✓'}</strong>` : ''}</span></button>`
  }).join('')}</div>${rows.length > 12 ? `<button type="button" class="chip" id="mbAll">${mbAll ? 'Show fewer' : `Show all ${rows.length}`}</button>` : ''}
  <p class="muted">Every product below is in one of these offers. Open one to fill it; filters don't hide anything here, only the sort applies.</p></section>`
}

const LOCK_SVG = '<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2h.5A1.5 1.5 0 0 1 13.5 8.5v5A1.5 1.5 0 0 1 12 15H4a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 4 7h.5Zm1.75 0h3.5V5a1.75 1.75 0 0 0-3.5 0v2Z"/></svg>'
// The one number to compare like with like inside a category (Nectar/offer price, per gram — never per serving)
const COMPARE_LABEL = { '100g protein': 'per 100g protein', kg: '/kg', litre: '/litre', each: 'each', '100g': '/100g', '100ml': '/100ml', '75cl': '/75cl', '10g': '/10g', unit: '/unit' }
const compareText = (d) => d.compare
  ? `<span class="cmp" title="${esc(`${d.compare.kind === 'protein' ? 'What 100g of protein costs here' : 'Price'} at the ${d.onOffer ? 'Nectar/offer' : 'shelf'} price, per ${d.compare.per}. Counted per gram of the whole pack, never per serving.`)}">${gbp(d.compare.value)} ${COMPARE_LABEL[d.compare.per] ?? '/' + esc(d.compare.per)}</span>`
  : ''
const daysAgo = (iso) => Math.floor((Date.now() - Date.parse(iso)) / 864e5)
const whenText = (iso) => { const n = daysAgo(iso); return n < 1 ? 'today' : n < 2 ? 'yesterday' : n < 7 ? `${n} days ago` : n < 14 ? 'last week' : n < 56 ? `${Math.floor(n / 7)} weeks ago` : new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }
// price now vs what he paid each last time (the paid price is his share of any deal he bought it in)
function priceMove(d) {
  const o = ordered[d.id], now = effPrice(d)
  if (!o?.unit || now == null) return null
  // bought in the same multi-buy that's still running: a set's price is split unevenly, so per item it can
  // look a few pence off while the deal is exactly the same
  const sameDeal = !!o.offer && o.offer === d.offerShort && isMulti(d)
  const diff = sameDeal ? 0 : now - o.unit
  return { paid: o.unit, now, diff, same: Math.abs(diff) < 0.015, sameDeal }
}
const pence = (x) => (Math.abs(x) < 1 ? `${Math.round(Math.abs(x) * 100)}p` : gbp(Math.abs(x)))
function orderedChips(d) {
  const o = ordered[d.id]; if (!o) return []
  const m = priceMove(d)
  return [
    `<span class="l ord" title="In ${o.times} of your past shop${o.times > 1 ? 's' : ''}">Ordered ${whenText(o.at)}${o.times > 1 ? ` · ${o.times}×` : ''}</span>`,
    m && (m.same ? `<span class="l muted" title="You paid ${gbp(m.paid)} each">${m.sameDeal ? 'same deal as then' : 'same price as then'}</span>`
      : `<span class="l ${m.diff > 0 ? 'r' : 'g'}" title="You paid ${gbp(m.paid)} each; now ${gbp(m.now)}">${m.diff > 0 ? '▲' : '▼'} ${pence(m.diff)} vs the ${gbp(m.paid)} you paid</span>`),
  ]
}
const nectarTag = (d, cut) => cut && d.best?.kind === 'price' ? '<span class="nectar" title="Nectar price: what you pay with your card. The shelf price is struck through.">Nectar</span>' : ''
function card(d) {
  const q = basket[d.id] ?? 0, mine = ratings[d.id]?.fit
  const eff = effPrice(d), cut = d.regular && eff && eff < d.regular - 0.005
  const offerRow = [
    inMulti(d)
      ? `<button class="dealbtn" data-deal="${esc(d.best.label)}" title="See every product in this deal">${groupTag(d) || `<span class="l">${esc(d.offerShort ?? d.best.label)} ›</span>`}</button>`
      : d.onOffer && d.offerShort && !(cut && d.best?.kind === 'price') ? `<span class="l">${esc(d.offerShort)}</span>` : '', // a plain Nectar price is already the price row (struck shelf price + Nectar tag)
    d.ends && d.onOffer && `<span class="l">ends ${esc(fmtEnds(d.ends))}</span>`,
    d.isNew && '<span class="l new">New</span>',
    ...orderedChips(d),
    (mode === 'foryou' || on('qForYou')) && !dealView && !similarView && `<span class="l wrap why4u">✦ ${esc(recWhy(d))}</span>`,
    d.deal && !dealView && `<button class="dealbtn" data-deal="${esc(d.deal.title)}" title="Open this meal deal to build it"><span class="l wrap p">${esc(d.deal.title)} ›</span></button>`,
  ]
  // protein per 100g (never per 100kcal), saturated fat only when it counts, seed oil, folic acid
  const nutRow = [
    d.n100?.protein != null && `<span class="l ${d.n100.protein >= 15 ? 'g' : d.n100.protein >= 8 ? '' : 'muted'}">${+d.n100.protein.toFixed(1)}g protein /100g</span>`,
    d.n100?.sat != null && !isWhole(d) && lvl(d.n100.sat, 1.5, 5) !== 'g' && `<span class="l ${lvl(d.n100.sat, 1.5, 5)}">Sat ${+d.n100.sat.toFixed(1)}g /100g</span>`,
    seedChip(d),
    folicChip(d),
  ]
  const swap = lockedDeal(d) ? '' : swapChip(d, !!basket[d.id])
  const each = inMulti(d) ? `each in ${d.offerShort ?? d.best.label}` : ''
  const label = d.packLabel ?? (d.packG ? weight(d.packG) : '')
  return `<article class="card ${q ? 'sel' : ''} ${d.oos ? 'muted' : ''} ${similarView === d.id ? 'anchor' : ''}" id="p${esc(d.id)}">
    <button class="top" data-similar="${esc(d.id)}" title="See similar products, ranked" aria-label="See products similar to ${esc(d.name)}">
      <span class="imgwrap${d.img ? '' : ' ld noimg'}">
        ${d.img ? `<img referrerpolicy="no-referrer" src="${esc(d.img)}" alt="" loading="lazy" width="300" height="300" />` : ''}
        <span class="ov tl">${rankOf[d.id] ? `<span class="l rank">#${rankOf[d.id]} ${rankPart[d.id] ? `in ${esc(rankPart[d.id])}` : 'best overall'}</span>` : ''}${valueChip(d)}${fitChip(d)}</span>
        <span class="ov bl row">${d.onOffer ? `<span class="l offer" title="${esc(d.best?.label ?? 'On offer')}">Offer</span>` : ''}${d.discount >= 0.01 ? `<span class="l off">-${Math.round(d.discount * 100)}%</span>` : ''}${label ? `<span class="l">${esc(label)}</span>` : ''}</span>
      </span>
      <span class="name" title="${esc(d.name)}">${esc(shortName(d.name))}</span>
      <span class="price"><span class="now">${gbp(eff)}</span>${cut ? `<span class="was">${gbp(d.regular)}</span>` : ''}${nectarTag(d, cut)}${each && inMulti(d) ? `<span class="approx dealtext" data-deal="${esc(d.best.label)}" title="Open this deal to build it">${esc(each)} ›</span>` : ''}</span>
      ${compareText(d)}
    </button>
    <div class="rows">
      <button type="button" class="labels chipbtn" data-detail="${esc(d.id)}" data-sec="ing" aria-label="Ingredients and processing for ${esc(d.name)}">${procChips(d)}</button>
      ${offerRow.some(Boolean) ? `<div class="labels">${offerRow.filter(Boolean).join('')}</div>` : ''}
      ${nutRow.some(Boolean) ? `<div class="labels">${nutRow.filter(Boolean).join('')}</div>` : ''}
      <div class="labels">${storeChip(d)}</div>
      ${swap ? `<div class="labels">${swap}</div>` : ''}
    </div>
    <button type="button" class="detbtn" data-detail="${esc(d.id)}"><span><span class="lbl-l">Details · ingredients · scores</span><span class="lbl-s">Details</span></span> <span aria-hidden="true">›</span></button>
    <div class="foot">
      <button type="button" class="tastebtn popbtn${mine ? ' ' + scoreCls(mine) : ''}" data-tastefor="${esc(d.id)}" aria-haspopup="true" aria-expanded="false" aria-label="Your taste rating for ${esc(d.name)}: ${mine ?? 'not rated'}">Taste <b>${mine ?? '–'}</b><svg class="caret" width="9" height="9" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      ${lockedDeal(d)
        ? `<span class="lockstat ${q ? 'in' : ''}" title="${esc(d.offerShort)} is locked — untick Happy on your list to change it">${LOCK_SVG}<span>${q ? `${q} on list` : 'Deal locked'}</span></span>`
        : q
        ? `<span class="qtyctl" role="group" aria-label="Quantity of ${esc(d.name)}"><button data-remove="${esc(d.id)}" aria-label="Remove one">−</button><span class="qn" aria-live="polite">${q}</span><button data-add="${esc(d.id)}" aria-label="Add one">+</button></span>`
        : `<button class="add" data-add="${esc(d.id)}" aria-label="Add ${esc(d.name)} to my list">+ Add</button>`}
    </div>
  </article>`
}

// ---- Product sheet: everything about one product in one place (bottom sheet on phones, side panel on desktop).
// Opened from a card's Details button, its processing chip, or the score tiles; refreshed on every render so the
// list buttons inside it stay true. The slim catalog has no ingredients, full nutrition or price history: they are
// fetched for the one product when its sheet opens.
const normRules = (x) => {
  const list = (v) => (Array.isArray(v) ? v : []).map((r) => (typeof r === 'string' ? { name: r, re: r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags: 'i' } : r)).filter((r) => r && r.re)
  return Array.isArray(x) ? { markers: list(x), watch: [] } : { markers: list(x?.markers), watch: list(x?.watch) }
}
const RULES = normRules(META.ingredientRules)
let pdId = null
const detail = {} // product id -> full record | false (failed); missing while loading
const reported = {} // product id -> 'found' | 'missing' (what he told us this visit)
// ingredients text with every marker / watch-list match wrapped: markers amber, watch list red
function pdIngredients(text, rules) {
  const hits = []
  for (const [kind, list] of [['m', rules.markers], ['w', rules.watch]]) for (const r of list) {
    let re; try { const fl = r.flags ?? 'i'; re = new RegExp(r.re, fl.includes('g') ? fl : fl + 'g') } catch { continue }
    for (const m of text.matchAll(re)) if (m[0]) hits.push({ a: m.index, b: m.index + m[0].length, kind, name: r.name })
  }
  hits.sort((x, y) => x.a - y.a || (x.kind === 'w' ? -1 : 1))
  let out = '', at = 0
  for (const h of hits) {
    if (h.a < at) continue // overlapping match: the first (watch list wins ties) keeps it
    out += esc(text.slice(at, h.a)) + `<mark class="${h.kind}" title="${esc(h.name)}">${esc(text.slice(h.a, h.b))}</mark>`
    at = h.b
  }
  return out + esc(text.slice(at))
}
const dayText = (iso) => { const t = Date.parse(iso); return t ? new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : esc(iso ?? '') }
function pdHistory(det) {
  if (det === undefined) return '<p class="muted">Loading…</p>'
  const rows = det?.history
  if (!rows?.length) return '<p class="muted">No price history yet: it builds up as prices are checked.</p>'
  return `<ol class="pdhist">${[...rows].sort((a, b) => String(b.on).localeCompare(String(a.on))).slice(0, 8).map((r) => {
    const pay = r.nectar ?? r.price
    return `<li><span class="when">${dayText(r.on)}</span><span class="what"><b>${gbp(pay)}</b>${r.nectar != null && r.price != null && r.nectar < r.price - 0.005 ? ` <s>${gbp(r.price)}</s> <span class="muted">· Nectar price</span>` : ''}</span></li>`
  }).join('')}</ol>`
}
function pdNutrition(d, det) {
  const n = det?.nutrition ?? d.n100, g = d.packG
  if (!n || (n.kcal == null && n.protein == null)) return `<p class="muted">${det === undefined ? 'Loading…' : "Label not read yet: nutrition appears once Sainsbury's page has been read."}</p>`
  const sugar = n.sugars ?? n.sugar
  const rows = [['Energy', 'kcal', n.kcal, null], ['Fat', 'g', n.fat, [3, 17.5]], ['of which saturates', 'g', n.sat, [1.5, 5]], ['Carbohydrate', 'g', n.carbs, null], ['of which sugars', 'g', sugar, [5, 22.5]], ['Fibre', 'g', n.fibre, null], ['Protein', 'g', n.protein, null], ['Salt', 'g', n.salt, [0.3, 1.5]]]
  const fmt = (v, u) => v == null ? '–' : u === 'kcal' ? `${Math.round(v)}` : `${+v.toFixed(1)}g`
  return `<table class="pdnut"><thead><tr><th></th><th>per 100${n.basis === '100ml' ? 'ml' : 'g'}</th>${g ? `<th>whole pack (${weight(g)})</th>` : ''}</tr></thead><tbody>${rows.filter(([, , v]) => v != null).map(([k, u, v, th]) => {
    const c = th ? lvl(v, th[0], th[1]) : ''
    return `<tr class="${k.startsWith('of') ? 'sub' : ''}"><th>${k}</th><td>${c ? `<i class="dot ${c}" aria-hidden="true"></i>` : ''}${fmt(v, u)}</td>${g ? `<td>${fmt(v * g / 100, u)}</td>` : ''}</tr>`
  }).join('')}</tbody></table>
  <p class="muted pdsmall">${d.proteinPerPound ? `${d.proteinPerPound.toFixed(0)}g protein per £` : ''}</p>`
}
async function openProduct(id, sec) {
  pdId = id
  fillProduct()
  if (!$('#pd').open) $('#pd').showModal()
  const go = () => sec && $('#pd-' + sec)?.scrollIntoView({ block: 'start' })
  go()
  if (id in detail) return
  detail[id] = undefined // loading: the sheet says so until it arrives
  getJSON(`product/${encodeURIComponent(id)}`).then((x) => (detail[id] = x ?? false)).catch(() => (detail[id] = false)).then(() => {
    if (signal.aborted) return
    if (pdId === id && $('#pd').open) { fillProduct(); go() }
  })
}
function fillProduct() {
  const d = byId[pdId]; if (!d) return
  const det = detail[pdId], rules = RULES
  const q = basket[d.id] ?? 0, eff = effPrice(d), mine = ratings[d.id]?.fit, pr = d.proc, fp = d.fitParts ?? {}
  const f = fitInfo[d.id] ?? { fit: d.fit, src: 'objective' }
  const tile = (sec, label, v, sub) => `<button type="button" class="pdtile ${scoreCls(v)}" data-pdsec="${sec}"><b>${v ?? '–'}</b><span>${label}</span>${sub ? `<small>${sub}</small>` : ''}</button>`
  const ing = det?.ingredients
  const verdict = !pr ? (d.isBasic ? 'Whole food: a plain ingredient, nothing added' : `The ingredients haven't been read yet${fp.processing != null ? `: processing ${fp.processing}/10 is estimated from the name` : ''}`)
    : d.isBasic ? 'Whole food: a plain ingredient, nothing added'
    : novaOf(pr) === 4 ? `Ultra-processed: ${pr.markers.length} marker${pr.markers.length === 1 ? '' : 's'}` : novaOf(pr) === 1 ? 'Unprocessed' : 'No ultra-processing markers'
  const markerWhy = (list, names, cls) => names.map((nm) => `<li><span class="l ${cls}">${esc(nm)}</span> ${esc(list.find((r) => r.name === nm)?.why ?? '')}</li>`).join('')
  const offers = d.offers.map((o) => `<li><b>${esc(o.kind === 'mealdeal' ? o.label : d.offerShort ?? o.label)}</b>${o.unitPrice ? ` <span class="muted">→ ${gbp(o.unitPrice)} each</span>` : ''}${o.until ? `<br><span class="muted">until ${esc(fmtEnds(o.until))}</span>` : ''}</li>`).join('')
  const sv = storeView(d)
  const url = safeUrl(d.url)
  const cut = d.regular && eff < d.regular - 0.005
  $('#pd').innerHTML = `
    <div class="pdtop">
      ${d.img ? `<img referrerpolicy="no-referrer" src="${esc(d.img)}" alt="" width="88" height="88" />` : '<span></span>'}
      <div class="pdhead">
        <h2 id="pdName">${esc(d.name)}</h2>
        <p class="pdprice"><b>${gbp(eff)}</b>${cut ? ` <s>${gbp(d.regular)}</s>` : ''}${nectarTag(d, cut)}${d.onOffer ? ` <span class="l offer">${esc(d.offerShort ?? 'Offer')}</span>` : ''}</p>
        <p class="muted pdsmall">${[d.packLabel ?? (d.packG && weight(d.packG)), d.regUnit && `${gbp(d.regUnit.price)}/${esc(d.regUnit.unit)}`, d.group && esc(cap(d.group)), d.frozen && '❄ frozen'].filter(Boolean).join(' · ')}</p>
      </div>
      <button type="button" class="pdclose" id="pdClose" aria-label="Close">✕</button>
    </div>
    <div class="pdtiles">${tile('why', 'Value', d.noValue ? null : d.value)}${tile('why', 'Fit', d.noFit && f.src !== 'you' ? null : fitOf(d), mine != null ? `taste ${mine}` : '')}${tile('ing', 'Processing', fp.processing)}${tile('why', 'Protein', fp.protein)}</div>
    <div class="pdbody">
      <section id="pd-store"><h3>At Chislehurst</h3>
        <div class="pdstore"><p>${storeChip(d)}</p><p class="muted pdsmall">${esc(sv.detail)}</p>
          <div class="pdstorebtns"><button type="button" data-store="found" aria-pressed="${reported[d.id] === 'found'}">Found it</button><button type="button" data-store="missing" aria-pressed="${reported[d.id] === 'missing'}">Not here</button></div>
          <p class="muted pdsmall">Tell us what you see on the shelf: what you say beats everything else.</p></div>
      </section>
      <section id="pd-ing"><h3>Ingredients &amp; processing</h3>
        <p class="pdverdict ${pr && novaOf(pr) === 4 ? 'a' : pr || d.isBasic ? 'g' : ''}">${verdict}</p>
        ${pr?.count != null ? `<p class="muted pdsmall">${pr.count} ingredient${pr.count === 1 ? '' : 's'} counted (including the ones inside brackets)</p>` : ''}
        ${pr?.markers.length || pr?.watch.length ? `<ul class="pdmarks">${markerWhy(rules.markers, pr.markers, 'a')}${markerWhy(rules.watch, pr.watch, 'r')}</ul>` : ''}
        <p>${seedChip(d)} ${folicChip(d)}</p>
        ${d.folic ? '<p class="muted pdsmall">Folic acid is a warning only: it never changes the score.</p>' : ''}
        ${ing ? `<p class="pding">${pdIngredients(ing, rules)}</p>${pr?.markers.length || pr?.watch.length ? '<p class="muted pdsmall"><mark class="m">amber</mark> = ultra-processing marker · <mark class="w">red</mark> = watch list</p>' : ''}`
          : `<p class="muted">${det === undefined ? 'Loading…' : d.isBasic ? 'One ingredient: the food itself.' : 'Ingredients not read yet.'}</p>`}
      </section>
      <section id="pd-nut"><h3>Nutrition</h3>${pdNutrition(d, det)}</section>
      <section id="pd-price"><h3>Price</h3>
        ${offers ? `<ul class="pdoffers">${offers}</ul>` : `<p>${gbp(d.regular)} shelf price</p>`}
        <h4>Price history</h4>${pdHistory(det)}
        ${orderedChips(d).filter(Boolean).length ? `<div class="labels">${orderedChips(d).filter(Boolean).join('')}</div>` : ''}
      </section>
      <section id="pd-why"><h3>Why these scores</h3>${whyValue(d).replace('<details class="why">', '<details class="why" open>')}${whyFit(d, det).replace('<details class="why">', '<details class="why" open>')}
        <details class="why"><summary>Best overall ${d.score != null ? Math.round(d.score * 10) / 10 : '–'}</summary><p>Health 60% + value 25% + taste 15%. Taste counts as neutral until you rate it; your rating moves it here.</p></details></section>
    </div>
    <div class="pdfoot">
      ${url ? `<a class="pdlink" href="${esc(url)}" target="_blank" rel="noopener">Sainsbury's ↗</a>` : ''}
      <button type="button" class="pdlink" data-similar="${esc(d.id)}">Similar</button>
      ${inMulti(d) ? `<button type="button" class="pdlink" data-deal="${esc(d.best.label)}">Open deal</button>` : d.deal ? `<button type="button" class="pdlink" data-deal="${esc(d.deal.title)}">Meal deal</button>` : ''}
      <span class="pdgrow"></span>
      ${q ? `<span class="qtyctl" role="group" aria-label="Quantity"><button data-remove="${esc(d.id)}" aria-label="Remove one">−</button><span class="qn">${q}</span><button data-add="${esc(d.id)}" aria-label="Add one">+</button></span>`
        : `<button class="add" data-add="${esc(d.id)}">+ Add</button>`}
    </div>`
}
// "Found it" / "Not here": his own report beats the range feed and the live stock, and the chip changes straight away
function reportStore(id, status, source = 'button') {
  const d = byId[id]; if (!d) return
  const found = status === 'found'
  d.store = { status: found ? 'yes' : 'no', reason: found ? 'You found it at Chislehurst.' : 'You said it is not here.', inStock: found ? true : null, checkedAt: new Date().toISOString() }
  d.oos = !found
  sendJSON('store-report', { id, status, source }).then((r) => { if (!r.ok) toast("Couldn't save that report: try again") }).catch(() => toast("Couldn't save that report: try again"))
}

listen(root, 'click', async (e) => {
  if (e.target.closest('#mbAll')) { mbAll = !mbAll; return render() }
  const det = e.target.closest('[data-detail]')
  if (det) { e.preventDefault(); return openProduct(det.dataset.detail, det.dataset.sec) }
  const tile = e.target.closest('[data-pdsec]')?.dataset.pdsec
  if (tile) return $('#pd-' + tile)?.scrollIntoView({ block: 'start', behavior: smooth() })
  if (e.target.closest('#pdClose') || e.target === $('#pd')) return $('#pd').close() // ✕ or a tap on the backdrop
  const sb = e.target.closest('[data-store]')?.dataset.store
  if (sb && pdId) { reported[pdId] = sb; reportStore(pdId, sb); render(); renderBasket(); return toast(sb === 'found' ? 'Thanks: marked as at Chislehurst' : 'Thanks: marked as not here') }
  if ($('#pd').open && e.target.closest('#pd [data-similar], #pd [data-deal]')) $('#pd').close()
  const deal = e.target.closest('[data-deal]')?.dataset.deal
  if (deal) { e.preventDefault(); return openDeal(deal) } // preventDefault: don't toggle the list group
  if (e.target.closest('#closeDeal')) { exitView(); render(); return }
  const sim = e.target.closest('[data-similar]')?.dataset.similar
  if (sim) return openSimilar(sim)
  const sw = e.target.closest('[data-swap]')
  if (sw) return act(`swapped ${nm(sw.dataset.swap)} for ${nm(sw.dataset.to)}`, () => swapItem(sw.dataset.swap, sw.dataset.to))
  const rm = e.target.closest('[data-remove]')?.dataset.remove
  if (rm) return act(`removed one ${nm(rm)}`, () => removeOne(rm))
  const add = e.target.closest('[data-add]')?.dataset.add
  if (add) act(`added ${nm(add)}`, () => addToBasket(add))
})
// phones: the header slides away while scrolling down the list and comes back on any scroll up
let lastY = root.scrollTop
listen(root, 'scroll', () => {
  const y = root.scrollTop
  if (!matchMedia('(max-width: 700px)').matches || openPop) { root.classList.remove('hdr-hidden'); lastY = y; return }
  if (Math.abs(y - lastY) < 8) return
  root.classList.toggle('hdr-hidden', y > lastY && y > 200)
  lastY = y
}, { passive: true })
// product pictures come from Sainsbury's and can be slow: a soft placeholder until each one arrives
listen(root, 'load', (e) => { if (e.target.tagName === 'IMG') e.target.closest('.imgwrap')?.classList.add('ld') }, { capture: true })
listen(root, 'error', (e) => { if (e.target.tagName === 'IMG') e.target.closest('.imgwrap')?.classList.add('ld', 'noimg') }, { capture: true })
// Taste picker: one shared popover under whichever card's Taste button was pressed
let tasteId = null
listen(root, 'click', (e) => {
  const b = e.target.closest('[data-tastefor]'); if (!b) return
  if (openPop === 'taste' && tasteId === b.dataset.tastefor) return closePop(false)
  tasteId = b.dataset.tastefor; POPS.taste[0] = b
  $('#tasteFor').textContent = `How much do you like ${shortName(byId[tasteId]?.name ?? '')}? (taste, not price)`
  for (const x of $$('[data-tv]')) x.setAttribute('aria-pressed', ratings[tasteId]?.fit === +x.dataset.tv)
  showPop('taste'); ($('[data-tv][aria-pressed="true"]') ?? $('[data-tv="7"]')).focus()
})
function pickTaste(v) {
  const id = tasteId; closePop(true)
  act(`rated ${nm(id)} ${v || '–'}`, () => rateNow(id, v))
  toast(v ? `Taste ${v}/10 saved · the taste profile has updated` : 'Rating cleared')
}
$('#tastePanel').onclick = (e) => { const b = e.target.closest('[data-tv]'); if (b) pickTaste(b.dataset.tv); else if (e.target.closest('#tasteClear')) pickTaste('') }
$('#tastePanel').onkeydown = (e) => {
  const it = $$('[data-tv]'), i = it.indexOf(document.activeElement)
  const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 5, ArrowUp: -5 }[e.key]
  if (step && i >= 0) { e.preventDefault(); it[Math.max(0, Math.min(9, i + step))].focus() }
  else if (/^[1-9]$/.test(e.key) || e.key === '0') { e.preventDefault(); pickTaste(e.key === '0' ? '10' : e.key) }
}
function rateNow(id, value) {
  if (value) ratings[id] = { fit: +value, name: byId[id].name, at: new Date().toISOString() }
  else delete ratings[id]
  sendJSON('ratings', ratings)
  learn(); render(); renderBasket()
  if (root.classList.contains('shops')) renderShops(); else syncShopsBtn()
}

// List maths. Offers only apply once you have the full set; the group's cost is then
// shared across its items in proportion to their shelf price, so each line shows a real price.
// Multi-buy groups on the list get a letter + colour (A, B, C…) shown on the list and on product cards
const GROUP_COLOURS = ['#d0e4ff|#0b4a99', '#ffe0b8|#8a4b00', '#d9f2dc|#17652a', '#f3dcff|#6a2a8f', '#ffd6d6|#9a1d1d', '#d6f3f2|#0d5f5c', '#fff0a8|#6b5800', '#e6e1d8|#4b4237']
let groupOf = {} // offer label -> { letter, bg, fg }
function basketMaths() {
  const raw = {}
  for (const [id, q] of Object.entries(basket)) {
    const d = byId[id]; if (!d || !q) continue
    const multi = inMulti(d)
    const k = multi ? d.best.label : id
    ;(raw[k] ??= { key: k, multi, units: [] }).units.push(...Array(q).fill(d))
  }
  let total = 0, full = 0
  const line = {}, groups = []
  groupOf = {}
  for (const g of Object.values(raw)) {
    const items = g.units, d0 = items[0], o = d0.best, min = o?.minQty ?? 1
    const gFull = items.reduce((s, d) => s + (d.regular ?? effPrice(d) ?? 0), 0)
    // full sets get the offer price; the rest pay the shelf price (Nectar price counts as the normal price)
    const qualifying = Math.floor(items.length / min) * min
    const gTotal = items.reduce((s, d, i) => s + ((i < qualifying ? effPrice(d) : d.regular ?? effPrice(d)) ?? 0), 0)
    const need = items.length % min ? min - (items.length % min) : 0
    for (const d of items) {
      const share = gFull ? (d.regular ?? effPrice(d) ?? 0) / gFull : 0
      line[d.id] ??= { cost: 0, full: 0 }
      line[d.id].cost += gTotal * share
      line[d.id].full += d.regular ?? effPrice(d) ?? 0
    }
    total += gTotal; full += gFull
    if (g.multi) {
      const [bg, fg] = GROUP_COLOURS[groups.length % GROUP_COLOURS.length].split('|')
      const letter = String.fromCharCode(65 + groups.length)
      groupOf[g.key] = { letter, bg, fg }
      groups.push({ ...g, letter, bg, fg, d0, need, gTotal, gFull, ids: [...new Set(items.map((d) => d.id))], count: items.length })
    }
  }
  return { total, full, line, groups }
}
const groupTag = (d, extra = '') => {
  const g = inMulti(d) && groupOf[d.best.label]
  return g ? `<span class="l grp" style="--gbg:${g.bg};--gfg:${g.fg}" title="Offer group ${g.letter}: these items count together">${g.letter} · ${esc(d.offerShort ?? d.best.label)}${extra}</span>` : ''
}
function bcard(id, line) {
  const d = byId[id], q = basket[id], l = line[id] ?? { cost: 0, full: 0 }
  return `<div class="bcard">
    ${d.img ? `<img referrerpolicy="no-referrer" src="${esc(d.img)}" alt="" width="40" height="40" loading="lazy" />` : '<span></span>'}
    <button class="jump" data-jump="${esc(id)}" title="Show in the list: ${esc(d.name)}">${esc(shortName(d.name))}</button>
    <span class="cost">${l.full - l.cost > 0.005 ? `<small>${gbp(l.full)}</small>` : ''}${gbp(l.cost)}</span>
    <span class="labels">${d.oos ? `<span class="l r">${esc(storeView(d).text)}</span>` : ''}${valueChip(d, true)}${fitChip(d, true)}${procShort(d)}${d.packProtein ? `<span class="l g">${Math.round(d.packProtein * q)}g P</span>` : ''}</span>
    <span class="step">${lockedDeal(d)
      ? `<span class="lockstat in" title="Locked deal — untick Happy to change" aria-label="${q} on list, deal locked">${LOCK_SVG}<span>${q}</span></span>`
      : `<span class="qtyctl mini" role="group" aria-label="Quantity of ${esc(d.name)}"><button data-dec="${esc(id)}" aria-label="Remove one ${esc(d.name)}">−</button><span class="qn">${q}</span><button data-inc="${esc(id)}" aria-label="Add one ${esc(d.name)}">+</button></span>`}</span>
    ${!lockedDeal(d) && swapChip(d, true) ? `<span class="swapline">${swapChip(d, true)}</span>` : ''}
    ${ratings[id] // rated: a compact button (same picker as the cards); not rated yet: the quick 1-10 row
      ? `<span class="brated"><button type="button" class="tastebtn popbtn ${scoreCls(ratings[id].fit)}" data-tastefor="${esc(id)}" aria-haspopup="true" aria-expanded="false" aria-label="Your taste rating for ${esc(d.name)}: ${ratings[id].fit}">Taste <b>${ratings[id].fit}</b><svg class="caret" width="9" height="9" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></span>`
      : `<span class="brate" role="group" aria-label="Your taste rating for ${esc(d.name)}"><span class="muted">Rate taste</span>${Array.from({ length: 10 }, (_, i) => i + 1).map((n) => `<button data-brate="${esc(id)}" data-v="${n}" aria-pressed="false" aria-label="${n} out of 10">${n}</button>`).join('')}</span>`}
  </div>`
}
// The deal as a whole: each item's Value weighted by what you actually pay for it inside the deal,
// so a cheap filler can't lift a deal whose money mostly goes on a poor-value item
function groupValueChip(g, line) {
  let paid = 0, sum = 0
  for (const id of g.ids) { const c = line[id]?.cost ?? 0; paid += c; sum += c * (byId[id]?.value ?? 0) }
  if (!paid || g.ids.every((id) => byId[id]?.noValue)) return ''
  const v = Math.round(sum / paid)
  const parts = g.ids.map((id) => `${shortName(byId[id].name)}: Value ${byId[id].noValue ? '–' : byId[id].value} × ${gbp(line[id].cost)}`).join('\n')
  return `<span class="l ${scoreCls(v)} score gval" title="${esc(`Value of this deal as a whole: ${(sum / paid).toFixed(1)}/10\nEach item's Value weighted by what you pay for it here:\n${parts}`)}">V${v}</span>`
}

let basketMode = 'plan' // plan: the list as a shopping plan · store: big tick-off list for walking round the shop
try { if (localStorage.getItem('dadListMode') === 'store') basketMode = 'store' } catch {}
const listIds = () => Object.keys(basket).filter((id) => basket[id] > 0 && byId[id])
function renderBasket() {
  const { total, full, line, groups } = basketMaths()
  const ids = listIds()
  const store = basketMode === 'store'
  $('#basket').classList.toggle('empty', !ids.length)
  $('#basket').classList.toggle('instore', store)
  for (const b of $$('[data-bmode]')) b.setAttribute('aria-pressed', b.dataset.bmode === basketMode)
  $('#bemptyShops').hidden = !orders.length
  const prot = Object.entries(basket).reduce((s, [id, q]) => s + (byId[id]?.packProtein ?? 0) * q, 0)
  $('#total').textContent = gbp(total)
  // budget from Dad's settings: no budget set, no bar
  $('#bar').hidden = !BUDGET; $('#budgetRow').hidden = !BUDGET
  if (BUDGET) {
    $('#budgetLabel').textContent = `Budget ${gbp(BUDGET)}/wk`
    $('#bar').classList.toggle('over', total > BUDGET)
    $('#bar').firstElementChild.style.width = Math.min(100, (total / BUDGET) * 100) + '%'
    $('#left').textContent = total > BUDGET ? `${gbp(total - BUDGET)} over` : `${gbp(BUDGET - total)} left`
  }
  $('#prot').textContent = Math.round(prot) + 'g'
  $('#days').textContent = (prot / 100).toFixed(1) + ' days'
  // sat fat over the same days the protein lasts (min 1), from per-100g labels × pack weight; unlabelled items listed apart
  let sat = 0, noLabel = 0
  for (const [id, q] of Object.entries(basket)) { const d = byId[id]; if (!d) continue; if (d.n100?.sat != null && d.packG) sat += (d.n100.sat * d.packG / 100) * q; else if (d.cat !== 'supplements') noLabel += q }
  const perDay = sat / Math.max(1, prot / 100)
  $('#sat').textContent = `${Math.round(perDay)}g${noLabel ? ` (+${noLabel} unlabelled)` : ''}`
  $('#sat').className = perDay > 30 ? 'rt' : perDay > 20 ? 'at' : ''
  $('#saved').textContent = gbp(full - total)
  const unrated = ids.filter((id) => !ratings[id]).length
  const units = Object.values(basket).reduce((a, b) => a + b, 0)
  const got = ids.filter((id) => ticked[id]).length
  $('#bsum').textContent = store ? `In store · ${got} of ${ids.length} ticked` : `${gbp(total)} · ${units} items · ${Math.round(prot)}g protein${unrated ? ` · ${unrated} to rate` : ''}`
  const outN = ids.filter((id) => byId[id].oos).length
  if (outN) $('#bsum').textContent = `⚠ ${outN} not here · ` + $('#bsum').textContent
  $('#torate').textContent = !ids.length ? '' : unrated ? `${unrated} of ${ids.length} not rated yet: tap 1–10 under each item (how much you like it, not the price)` : 'All rated ✓'
  $('#storesum').innerHTML = ids.length ? `<p class="storesum"><b>${got} of ${ids.length} in the trolley</b></p><div class="bar"><div style="width:${Math.round((got / ids.length) * 100)}%"></div></div>` : ''
  $('#checkout').textContent = store && got === ids.length && ids.length ? 'All done: save this shop' : 'Done shopping'
  syncLocks(groups)
  $('#stockbar').innerHTML = stockHtml()
  if (store) { $('#lines').innerHTML = storeListHtml(line) || '<p class="muted">Nothing on the list yet.</p>'; return }
  const grouped = new Set(groups.flatMap((g) => g.ids))
  const singles = ids.filter((id) => !grouped.has(id))
  const groupHtml = groups.map((g) => {
    const status = g.need
      ? `<span class="need">Add ${g.need} more to unlock</span>`
      : `<span class="okk">✓ unlocked</span>`
    const locked = !!locks[g.key]
    return `<details class="bgroup ${locked ? 'locked' : ''}" style="--gbg:${g.bg};--gfg:${g.fg}" data-group="${esc(g.key)}" ${collapsed.has(g.key) ? '' : 'open'}>
      <summary>
        <span class="ghead">
          <label class="lock" title="Happy with this deal: keep it when the list is rebuilt"><input type="checkbox" data-lock="${esc(g.key)}" ${locked ? 'checked' : ''} aria-label="Happy with this deal" /><span>Happy</span></label>
          <span class="gl">${g.letter}</span>
          <button class="gname dealbtn" data-deal="${esc(g.key)}" title="Open this deal to see and swap products">${esc(g.d0.offerShort ?? g.key)} ›</button>
          ${groupValueChip(g, line)}
          <span class="cost">${g.gFull - g.gTotal > 0.005 ? `<small>${gbp(g.gFull)}</small>` : ''}${gbp(g.gTotal)}</span>
          <span class="chev" title="Collapse / expand" aria-hidden="true">▾</span>
        </span>
        <span class="gsub"><span>${g.count} item${g.count > 1 ? 's' : ''} · ${status}</span>${locked ? '' : `<button class="gdel" data-delgroup="${esc(g.key)}" aria-label="Remove the whole ${esc(g.d0.offerShort ?? '')} deal from my list">Remove deal</button>`}</span>
      </summary>
      ${g.ids.map((id) => bcard(id, line)).join('')}
    </details>`
  }).join('')
  const removed = Object.entries(removals).filter(([id]) => !basket[id] && byId[id])
  const removedHtml = removed.length ? `<details class="removed"><summary class="sub">Removed · ${removed.length}</summary>${removed.map(([id, r]) => `
    <div class="rrow">${byId[id].img ? `<img referrerpolicy="no-referrer" src="${esc(byId[id].img)}" alt="" width="28" height="28" loading="lazy" />` : '<span></span>'}<button class="jump" data-jump="${esc(id)}" title="Show in the list">${esc(shortName(byId[id].name))}</button><button class="restore" data-restore="${esc(id)}">Restore</button>
      <span class="labels">${r.replacedByName ? `<span class="l g">swapped for ${esc(shortName(r.replacedByName))}</span>` : ''}${tentative(r.guesses).map((g) => `<span class="l guess">${esc(g)}</span>`).join('')}</span></div>`).join('')}
    <p class="muted">Removals mostly mean "not this week", so they count for little on their own. Swaps inside a deal count most.</p></details>` : ''
  $('#lines').innerHTML = (groupHtml + (singles.length ? `<h3 class="sub">Single items</h3>${singles.map((id) => bcard(id, line)).join('')}` : '') + removedHtml) || '<p class="muted">Click any product to add it.</p>'
}
// In store: big tick targets grouped by store section; ticked items sink to the bottom of their section and grey out
function storeListHtml(line) {
  const ids = listIds(), sections = {}
  for (const id of ids) (sections[deptOf(byId[id])] ??= []).push(id)
  const order = [...Object.keys(DEPTS), ...Object.keys(sections).filter((k) => !(k in DEPTS))]
  const row = (id) => {
    const d = byId[id], q = basket[id], t = !!ticked[id], out = !!d.oos, l = line[id] ?? { cost: 0 }
    return `<div class="trow ${t ? 'done' : ''}">
      <button type="button" class="tick" role="checkbox" aria-checked="${t}" data-tick="${esc(id)}" aria-label="${esc(d.name)}, ${q} to get. ${t ? 'In the trolley: tap to untick' : 'Tap when it is in the trolley'}">
        <span class="tbox" aria-hidden="true">✓</span>
        ${d.img ? `<img referrerpolicy="no-referrer" src="${esc(d.img)}" alt="" width="48" height="48" loading="lazy" />` : '<span></span>'}
        <span class="tname"><b>${esc(shortName(d.name))}</b><small>× ${q} · ${gbp(l.cost)}${out ? ` · <span class="rt">${esc(storeView(d).text)}</span>` : ''}</small>${groupTag(d)}</span>
      </button>
      ${out ? `<button type="button" class="tmiss is-out" data-findalt="${esc(id)}">Find another</button>`
        : `<button type="button" class="tmiss" data-miss="${esc(id)}" aria-label="Not here: ${esc(d.name)} is not on the shelf">Not here</button>`}
    </div>`
  }
  return order.filter((k) => sections[k]).map((k) => {
    const list = sections[k].sort((a, b) => (ticked[a] ? 1 : 0) - (ticked[b] ? 1 : 0) || byId[a].name.localeCompare(byId[b].name))
    const done = list.filter((id) => ticked[id]).length
    return `<h3 class="tsec"><span>${esc(DEPTS[k] ?? cap(k))}</span><span>${done} of ${list.length}</span></h3>${list.map(row).join('')}`
  }).join('')
}
// Locked ("happy") deals: kept as-is when the list is rebuilt. The snapshot follows edits to the deal.
function saveLocks() { return sendJSON('locks', locks) }
function lockItems(g) { return Object.fromEntries(g.ids.map((id) => [id, basket[id]])) }
function syncLocks(groups) {
  let changed = false
  for (const g of groups) {
    const l = locks[g.key]; if (!l) continue
    const items = lockItems(g)
    if (JSON.stringify(items) !== JSON.stringify(l.items)) { l.items = items; l.names = g.ids.map((id) => byId[id].name); l.updatedAt = new Date().toISOString(); changed = true }
  }
  if (changed) saveLocks()
}
function toggleLock(key, on) { act(`${on ? 'locked' : 'unlocked'} ${basketMaths().groups.find((x) => x.key === key)?.d0.offerShort ?? 'deal'}`, () => toggleLockNow(key, on)) }
function toggleLockNow(key, on) {
  const g = basketMaths().groups.find((x) => x.key === key)
  if (on && g) locks[key] = { offer: g.d0.offerShort, lockedAt: new Date().toISOString(), items: lockItems(g), names: g.ids.map((id) => byId[id].name) }
  else delete locks[key]
  saveLocks(); renderBasket(); toast(on ? `Locked ${g?.letter ?? ''} · ${g?.d0.offerShort ?? ''} — kept when rebuilding` : 'Unlocked')
}

// Collapsed deal groups are remembered per offer
const collapsed = new Set((() => { try { return JSON.parse(localStorage.getItem('dadCollapsedGroups') ?? '[]') } catch { return [] } })())
// On narrow screens my list is a drawer over the page: the bar at the bottom opens it to full screen
$('#btoggle').onclick = () => {
  const open = $('#basket').classList.toggle('open')
  $('#btoggle').setAttribute('aria-expanded', open)
}
$('#bclose').onclick = () => closeDrawer()
$('#bmode').onclick = (e) => {
  const b = e.target.closest('[data-bmode]'); if (!b) return
  basketMode = b.dataset.bmode
  try { localStorage.setItem('dadListMode', basketMode) } catch {}
  renderBasket()
}
$('#lines').addEventListener('toggle', (e) => {
  const key = e.target.dataset?.group; if (!key) return
  e.target.open ? collapsed.delete(key) : collapsed.add(key)
  try { localStorage.setItem('dadCollapsedGroups', JSON.stringify([...collapsed])) } catch {}
}, true)

// Removals: logged automatically with my best guess why. Scoring learns from removed-vs-kept patterns.
const tentative = (gs = []) => {
  const out = gs.map((g) => /^no obvious reason/.test(g) ? 'probably just not needed this week' : /^(maybe|or just|probably|you rated|swapped)/.test(g) ? g : `maybe ${g}`)
  if (/^or just/.test(out[0] ?? '')) out[0] = 'probably just not needed this week'
  return [...new Set(out)]
}
function guessWhy(d) {
  const g = [], pr = d.proc, rated = ratings[d.id]?.fit
  for (const w of pr?.watch ?? []) g.push(w)
  if ((pr?.markers.length ?? 0) >= 3) g.push(`ultra-processed (${pr.markers.length} markers)`)
  if (rated != null && rated <= 4) g.push(`you rated taste ${rated}`)
  if (d.highSat) g.push('high sat fat')
  if (d.value <= 4 && !d.noValue) g.push('not a great deal')
  // Removing usually just means "not this week" — guesses are tentative and weigh little unless it's a swap
  return [...g.map((x) => `maybe ${x}`), 'or just not needed this week']
}
// ---- out today at Chislehurst: list items that aren't there get a swap list: same deal first (keeps the offer),
// then the same type. A swap isn't logged as a removal: he didn't go off it, the shop just hasn't got it.
let stockFixOpen = false
const isOut = (id) => !!byId[id]?.oos
function altsFor(d) {
  const pool = deals.filter((a) => a.id !== d.id && !basket[a.id] && !a.oos && !a.nonFood && !(ratings[a.id]?.fit <= 4)).sort((a, b) => allround(b) - allround(a))
  const sameDeal = inMulti(d) ? pool.filter((a) => a.best?.label === d.best.label).slice(0, 4) : []
  const sameType = pool.filter((a) => a.group && a.group === d.group && !sameDeal.includes(a)).slice(0, sameDeal.length ? 2 : 4)
  return [...sameDeal, ...sameType]
}
function stockHtml() {
  const out = listIds().filter(isOut)
  if (!out.length) return ''
  const fixes = out.map((id) => ({ d: byId[id], alts: altsFor(byId[id]) }))
  return `<div class="stockalert">
    <button class="stockhead" id="stockToggle" aria-expanded="${stockFixOpen}"><strong>⚠ ${out.length} not at Chislehurst today</strong><span>${esc(out.map(nm).join(', '))}</span><span class="stockfix">${stockFixOpen ? 'Hide' : 'Swap'}</span></button>
    ${stockFixOpen ? fixes.map(fixHtml).join('') : ''}</div>`
}
function fixHtml({ d, alts }) {
  const row = (a) => {
    const v = storeView(a), same = inMulti(d) && a.best?.label === d.best.label
    return `<div class="alt">${a.img ? `<img referrerpolicy="no-referrer" src="${esc(a.img)}" alt="" width="32" height="32" loading="lazy" />` : '<span></span>'}
      <span class="altn">${esc(shortName(a.name))}<small>${gbp(effPrice(a))} · ${a.noValue ? 'V–' : 'V' + a.value} · Fit ${a.noFit ? '–' : fitOf(a)}${same ? ` · same ${esc(d.offerShort)}` : ''}</small></span>
      <span class="sbadge ${v.tone === 'g' ? 'in' : ''}">${esc(v.text)}</span>
      <button class="swapbtn" data-stockswap="${esc(d.id)}" data-to="${esc(a.id)}">Swap</button></div>`
  }
  return `<div class="fix"><p class="fixh">Instead of <b>${esc(shortName(d.name))}</b> ×${basket[d.id]}${lockedDeal(d) ? ' · locked deal: a swap keeps it locked' : ''}</p>
    ${alts.map(row).join('') || '<p class="muted">Nothing similar found</p>'}
    <button class="linkbtn" data-stockdrop="${esc(d.id)}">Just remove it</button></div>`
}
function stockSwap(from, to) {
  const q = basket[from] ?? 1, L = locks[byId[from]?.best?.label]
  delete basket[from]; save(from, -q); dropTick(from)
  basket[to] = (basket[to] ?? 0) + q; save(to, q)
  if (L?.items?.[from] != null) {
    delete L.items[from]
    if (byId[to]?.best?.label === byId[from].best.label) L.items[to] = (L.items[to] ?? 0) + q
    L.names = Object.keys(L.items).map((i) => byId[i]?.name ?? i); saveLocks()
  }
  render()
}
function stockDrop(id) {
  const q = basket[id], L = locks[byId[id]?.best?.label]
  delete basket[id]; save(id, -q); dropTick(id)
  if (L?.items?.[id] != null) { delete L.items[id]; L.names = Object.keys(L.items).map((i) => byId[i]?.name ?? i); saveLocks() }
  render()
}
$('#stockbar').onclick = (e) => {
  if (e.target.closest('#stockToggle')) { stockFixOpen = !stockFixOpen; return renderBasket() }
  const sw = e.target.closest('[data-stockswap]')
  if (sw) return act(`swapped ${nm(sw.dataset.stockswap)} for ${nm(sw.dataset.to)} (not at Chislehurst)`, () => stockSwap(sw.dataset.stockswap, sw.dataset.to))
  const dr = e.target.closest('[data-stockdrop]')?.dataset.stockdrop
  if (dr) act(`removed ${nm(dr)} (not at Chislehurst)`, () => stockDrop(dr))
}
function saveRemovals() { return sendJSON('removals', removals) }
// A deal ticked "Happy" is read-only until unticked
const lockedDeal = (d) => !!(d && inMulti(d) && locks[d.best?.label])
function blockedByLock(id) {
  const d = byId[id]
  if (!lockedDeal(d)) return false
  toast(`🔒 ${d.offerShort} is locked — untick Happy on your list to change it`)
  return true
}
// a tick belongs to an item being on the list: when it leaves, its tick goes too
function dropTick(id) {
  if (!ticked[id]) return
  delete ticked[id]
  sendJSON('basket/op', { id, tick: false }).catch(() => {})
}
function addToBasket(id) {
  if (blockedByLock(id)) return
  basket[id] = (basket[id] ?? 0) + 1
  save(id, 1); render()
  if (removals[id]) { delete removals[id]; saveRemovals(); return }
  // Swap detection: adding something from the same deal soon after removing one = "this, not that"
  const deal = byId[id]?.best?.label, now = Date.now()
  const swapped = Object.entries(removals).filter(([, r]) => r.deal === deal && !r.replacedBy && now - Date.parse(r.at) < 20 * 60e3).sort((a, b) => Date.parse(b[1].at) - Date.parse(a[1].at))[0]
  if (deal && swapped) {
    swapped[1].replacedBy = id; swapped[1].replacedByName = byId[id].name
    toast(`Noted: ${shortName(byId[id].name)} instead of ${shortName(swapped[1].name)}`)
    saveRemovals()
  }
}
function swapItem(from, to) {
  if (blockedByLock(from)) return
  const q = basket[from] ?? 1
  for (let i = 0; i < q; i++) removeOne(from)
  for (let i = 0; i < q; i++) addToBasket(to) // logged as a swap ("this, not that")
}
function removeOne(id) {
  if (blockedByLock(id)) return
  if (--basket[id] > 0) { save(id, -1); render(); return }
  delete basket[id]
  removals[id] = removalRecord(byId[id])
  save(id, -1); dropTick(id); render(); saveRemovals()
}
const removalRecord = (d, extra = {}) => ({ name: d.name, at: new Date().toISOString(), guesses: guessWhy(d), deal: inMulti(d) ? d.best.label : undefined,
  snapshot: { value: d.value, fit: fitOf(d), processing: d.fitParts?.processing, watch: d.proc?.watch ?? [], markers: d.proc?.markers ?? [], price: d.best?.unitPrice ?? d.regular }, ...extra })
// One click takes a whole deal out. Logged as "not this week" (no taste evidence) — Undo brings it back.
function removeGroup(key) {
  const g = basketMaths().groups.find((x) => x.key === key); if (!g) return
  if (locks[key]) return toast(`🔒 ${g.d0.offerShort} is locked — untick Happy first`)
  const n = g.ids.reduce((s, id) => s + (basket[id] ?? 0), 0)
  act(`removed deal ${g.letter} · ${g.d0.offerShort} (${n} items)`, () => {
    for (const id of g.ids) {
      const q = basket[id]; if (!q) continue
      delete basket[id]; save(id, -q); dropTick(id)
      removals[id] = removalRecord(byId[id], { wholeDeal: true, guesses: ['removed the whole deal: probably not needed this week'] })
    }
  })
  render(); saveRemovals()
  toast(`Removed ${g.letter} · ${g.d0.offerShort} — Undo brings it back`)
}
// Jump from a list item to its card in the page. If filters hide it, search for it by name.
let jumpBack = null // view to restore after jumping to a product the filters were hiding
const JUMP_FILTERS = FILTER_IDS
function restoreView() {
  if (!jumpBack) return
  const v = jumpBack; jumpBack = null
  cat = v.cat; grp = v.grp ?? 'all'; prot = v.prot ?? 'all'; mode = v.mode; syncFilterUI()
  for (const [f, pressed] of Object.entries(v.filters)) $('#' + f).setAttribute('aria-pressed', pressed)
  $('#q').value = v.q; limit = v.limit; render()
  root.scrollTo({ top: v.scrollY })
}
// On narrow screens my list is a drawer over the page: close it when a link takes you into the page
const closeDrawer = () => { $('#basket').classList.remove('open'); $('#btoggle').setAttribute('aria-expanded', 'false') }
function jumpTo(id) {
  closeDrawer()
  if (!elById('p' + id)) {
    jumpBack ??= { cat, grp, prot, mode, limit, q: $('#q').value, scrollY: root.scrollTop, filters: Object.fromEntries(JUMP_FILTERS.map((f) => [f, $('#' + f).getAttribute('aria-pressed')])) }
    cat = 'all'; grp = 'all'; prot = 'all'; mode = 'all'; syncFilterUI()
    for (const f of JUMP_FILTERS) $('#' + f).setAttribute('aria-pressed', 'false')
    $('#q').value = shortName(byId[id].name).toLowerCase(); render()
  }
  const target = elById('p' + id); if (!target) return
  target.scrollIntoView({ behavior: smooth(), block: 'center' })
  target.classList.remove('flash'); void target.offsetWidth; target.classList.add('flash')
}
$('#lines').addEventListener('change', (e) => { const k = e.target.dataset?.lock; if (k != null) toggleLock(k, e.target.checked) })
$('#lines').onclick = (e) => {
  if (e.target.closest('.lock')) { e.stopPropagation(); if (e.target.tagName !== 'INPUT') { e.preventDefault(); const cb = e.target.closest('.lock').querySelector('input'); cb.checked = !cb.checked; toggleLock(cb.dataset.lock, cb.checked) } return }
  const tick = e.target.closest('[data-tick]')?.dataset.tick
  if (tick) return tickItem(tick)
  const miss = e.target.closest('[data-miss]')?.dataset.miss
  if (miss) { reportStore(miss, 'missing', 'button'); renderBasket(); render(); return toast(`Marked ${nm(miss)} as not here`) }
  if (e.target.closest('[data-findalt]')) { basketMode = 'plan'; stockFixOpen = true; try { localStorage.setItem('dadListMode', 'plan') } catch {} return renderBasket() }
  const br = e.target.closest('[data-brate]')
  if (br) {
    const id = br.dataset.brate, v = ratings[id]?.fit === +br.dataset.v ? '' : br.dataset.v // tap the same number again to clear
    act(`rated ${nm(id)} ${v || '–'}`, () => rateNow(id, v)); toast(v ? `Taste ${v}/10 saved` : 'Rating cleared'); return
  }
  const j = e.target.closest('[data-jump]')?.dataset.jump
  if (j) return jumpTo(j)
  if (e.target.closest('[data-swap]')) return // handled by the root listener
  const del = e.target.closest('[data-delgroup]')?.dataset.delgroup
  if (del != null) { e.preventDefault(); return removeGroup(del) } // preventDefault: don't toggle the group open/closed
  const restore = e.target.closest('[data-restore]')?.dataset.restore
  if (restore) return act(`restored ${nm(restore)}`, () => addToBasket(restore))
  const b = e.target.closest('button[data-inc], button[data-dec]'); if (!b) return
  if (b.dataset.inc) act(`added ${nm(b.dataset.inc)}`, () => addToBasket(b.dataset.inc))
  if (b.dataset.dec) act(`removed one ${nm(b.dataset.dec)}`, () => removeOne(b.dataset.dec))
}
// In store: tick an item off. The server keeps it (basket doc `ticked`), and a tick also tells the store that it IS on the shelf.
function tickItem(id) {
  const on = !ticked[id]
  if (on) ticked[id] = true; else delete ticked[id]
  pendingOps++
  sendJSON('basket/op', { id, tick: on }).then((r) => r.json())
    .then((b) => { if (--pendingOps === 0 && b?.items) { adopt(b); renderBasket() } })
    .catch(() => pendingOps--)
  if (on && byId[id]) reportStore(id, 'found', 'tick')
  renderBasket()
  if (on && byId[id] && !byId[id].oos) render() // the chip on the card is "in stock" now
}
// ---------- Undo: the last 6 changes anywhere (list, swaps, whole deals, ratings, Happy locks) ----------
// Each step stores only what that action changed (list as ± quantities), so undoing it never wipes
// changes made since — by you in another tab.
const UNDO_MAX = 6
const nm = (id) => shortName(byId[id]?.name ?? id)
let undoStack = []
let redoStack = []
try { undoStack = JSON.parse(localStorage.getItem('dadUndoStack') ?? '[]'); redoStack = JSON.parse(localStorage.getItem('dadRedoStack') ?? '[]') } catch {}
let acting = false
function act(label, fn) {
  if (acting) return fn() // nested (a swap is a remove + an add): one undo step
  const before = JSON.parse(JSON.stringify({ basket, ratings, removals, locks }))
  acting = true
  try { fn() } finally { acting = false }
  const now = { basket, ratings, removals, locks }, changes = {}
  for (const k of Object.keys(now)) {
    for (const id of new Set([...Object.keys(before[k]), ...Object.keys(now[k])])) {
      const b = before[k][id], a = now[k][id]
      if (JSON.stringify(b) !== JSON.stringify(a)) (changes[k] ??= {})[id] = k === 'basket' ? (b ?? 0) - (a ?? 0) : (b ?? null)
    }
  }
  if (!Object.keys(changes).length) return // blocked by a lock, nothing happened
  undoStack.push({ label, changes })
  if (undoStack.length > UNDO_MAX) undoStack.shift()
  redoStack = []
  saveUndo()
}
function saveUndo() {
  try { localStorage.setItem('dadUndoStack', JSON.stringify(undoStack)); localStorage.setItem('dadRedoStack', JSON.stringify(redoStack)) } catch {}
  for (const [sel, stack, word, icon] of [['#undo', undoStack, 'Undo', '↶'], ['#redo', redoStack, 'Redo', '↷']]) {
    const last = stack.at(-1), btn = $(sel)
    btn.disabled = !last
    btn.innerHTML = last ? `${icon}<small>${stack.length}</small>` : icon
    btn.title = last ? `${word}: ${last.label}` : `Nothing to ${word.toLowerCase()}`
  }
}
// Applies a step's stored changes and returns the opposite step, so undo feeds redo and redo feeds undo.
function applyStep(c) {
  const inverse = {}
  for (const [id, d] of Object.entries(c.basket ?? {})) {
    const q = (basket[id] ?? 0) + d
    if (q > 0) basket[id] = q; else { delete basket[id]; dropTick(id) }
    save(id, d)
    ;(inverse.basket ??= {})[id] = -d
  }
  const restoreKeys = (k, obj, ch) => { for (const [id, v] of Object.entries(ch)) { (inverse[k] ??= {})[id] = obj[id] ?? null; v == null ? delete obj[id] : (obj[id] = v) } }
  if (c.ratings) { restoreKeys('ratings', ratings, c.ratings); sendJSON('ratings', ratings) }
  if (c.locks) { restoreKeys('locks', locks, c.locks); saveLocks() }
  if (c.removals) { restoreKeys('removals', removals, c.removals); saveRemovals() }
  learn(); renderBasket(); render()
  return JSON.parse(JSON.stringify(inverse))
}
function undo() {
  const step = undoStack.pop(); if (!step) return toast('Nothing to undo')
  redoStack.push({ label: step.label, changes: applyStep(step.changes) })
  if (redoStack.length > UNDO_MAX) redoStack.shift()
  saveUndo(); toast(`Undid: ${step.label}`)
}
function redo() {
  const step = redoStack.pop(); if (!step) return toast('Nothing to redo')
  undoStack.push({ label: step.label, changes: applyStep(step.changes) })
  if (undoStack.length > UNDO_MAX) undoStack.shift()
  saveUndo(); toast(`Redid: ${step.label}`)
}
$('#undo').onclick = undo
$('#redo').onclick = redo
listen(document, 'keydown', (e) => {
  if (!(e.metaKey || e.ctrlKey) || e.target instanceof Element && e.target.closest('input, select, textarea')) return
  const k = e.key.toLowerCase()
  if (k === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
  else if (k === 'z' && e.shiftKey || k === 'y') { e.preventDefault(); redo() }
})
saveUndo()
let basketStamp = basketDoc.updated ?? ''
// The server's list is the truth: adopt it (items, and what's ticked off in store)
function adopt(b) { basket = b.items ?? {}; ticked = b.ticked ?? {}; basketStamp = b.updated ?? basketStamp }
// Send the single change (+1 / −1) — the server merges it, then we adopt the server's list.
let pendingOps = 0
function save(id, delta) {
  renderBasket()
  pendingOps++
  sendJSON('basket/op', { id, delta })
    .then((r) => r.json())
    .then((b) => { if (--pendingOps === 0 && b?.items) { adopt(b); renderBasket(); render() } })
    .catch(() => pendingOps--)
}
// Pick up changes made elsewhere (another tab, or Finbar) so nobody overwrites anybody.
async function syncFromServer() {
  const [b, r, rm, lk] = await Promise.all(['basket', 'ratings', 'removals', 'locks'].map((u) => getJSON(u).catch(() => null)))
  if (signal.aborted) return
  let changed = false
  if (lk && JSON.stringify(lk) !== JSON.stringify(locks)) { locks = asDoc(lk); changed = true }
  if (b?.items && !pendingOps && ((b.updated ?? '') > basketStamp || JSON.stringify(b.items) !== JSON.stringify(basket) || JSON.stringify(b.ticked ?? {}) !== JSON.stringify(ticked))) { adopt(b); changed = true }
  if (r && JSON.stringify(r) !== JSON.stringify(ratings)) { ratings = asDoc(r); changed = true }
  if (rm && JSON.stringify(rm) !== JSON.stringify(removals)) { removals = asDoc(rm); changed = true }
  if (changed) { learn(); renderBasket(); render() }
}
every(() => { if (!document.hidden) syncFromServer() }, 20000)
listen(document, 'visibilitychange', () => { if (!document.hidden) syncFromServer() })
// ---- Checked-out shops (orders). A shop is a snapshot of the list when he finishes shopping. Past shops are
// compared with each other (his own average), never with national figures: every household's shop is different.
// what he's bought before: latest shop's date and price paid each (deal share), and in how many shops
function buildOrdered() {
  ordered = {}
  for (const o of [...orders].reverse()) for (const i of o.items) ordered[i.id] = { at: o.id, unit: i.qty ? i.cost / i.qty : null, offer: i.offer ?? null, times: (ordered[i.id]?.times ?? 0) + 1 }
}
buildOrdered()
let shopSel = null
const r1 = (n) => +n.toFixed(2)
const appUnits = () => Object.entries(basket).reduce((n, [id, q]) => n + (byId[id] && q > 0 ? q : 0), 0)
function snapshotBasket() {
  const { total, full, line, groups } = basketMaths()
  const items = Object.entries(basket).filter(([id, q]) => q > 0 && byId[id]).map(([id, qty]) => {
    const d = byId[id], g = groups.find((x) => x.ids.includes(id))
    return {
      id, name: d.name, img: d.img, qty, cost: r1(line[id]?.cost ?? 0), full: r1(line[id]?.full ?? 0),
      offer: g ? g.d0.offerShort : d.onOffer && d.best ? d.offerShort ?? null : null,
      dept: deptOf(d), group: d.group ?? null, protein: r1((d.packProtein ?? 0) * qty),
      sat: d.n100?.sat != null && d.packG ? r1((d.n100.sat * d.packG) / 100 * qty) : null, value: d.noValue ? null : d.value ?? null, fit: d.noFit ? null : fitOf(d) ?? null,
    }
  })
  return { id: new Date().toISOString(), source: 'app', total: r1(total), full: r1(full), budget: BUDGET || null, items }
}
// everything shown per shop is worked out from its items, so older shops gain new columns too
function shopStats(o) {
  const units = o.items.reduce((n, i) => n + i.qty, 0), spend = o.items.reduce((n, i) => n + i.cost, 0) || o.total
  const protein = o.items.reduce((n, i) => n + i.protein, 0), sat = o.items.reduce((n, i) => n + (i.sat ?? 0), 0)
  const valued = o.items.filter((i) => i.value != null), vSpend = valued.reduce((n, i) => n + i.cost, 0)
  const rated = o.items.filter((i) => ratings[i.id]).length
  return {
    units, lines: o.items.length, total: o.total, saved: Math.max(0, o.full - o.total), savedPct: o.full > 0 ? (o.full - o.total) / o.full : 0,
    protein, ppp: o.total > 0 ? protein / o.total : 0, satDay: sat / Math.max(1, protein / 100),
    value: vSpend ? valued.reduce((n, i) => n + i.value * i.cost, 0) / vSpend : null,
    ready: spend ? o.items.filter((i) => i.dept === 'ready').reduce((n, i) => n + i.cost, 0) / spend : 0,
    offer: spend ? o.items.filter((i) => i.offer).reduce((n, i) => n + i.cost, 0) / spend : 0,
    rated, toRate: o.items.length - rated, budget: o.budget ?? BUDGET,
  }
}
const toRateAll = () => new Set(orders.flatMap((o) => o.items.filter((i) => !ratings[i.id]).map((i) => i.id))).size
function syncShopsBtn() { const n = toRateAll(); $('#shopsN').hidden = !n; $('#shopsN').textContent = n; $('#shopsN').title = `${n} product${n === 1 ? '' : 's'} from past shops to rate` }

// Done shopping: save the list as a shop in Past shops (and, if he likes, start a fresh list)
function openCheckout() {
  const snap = snapshotBasket(), st = shopStats(snap)
  if (!snap.items.length) return toast('Your list is empty')
  const left = snap.items.filter((i) => !ticked[i.id]).length
  const dlg = $('#coDlg')
  dlg.innerHTML = `<form method="dialog">
    <h2 id="coTitle">Done shopping?</h2>
    <p><b>${st.units} items · ${gbp(snap.total)}</b>${st.saved > 0.005 ? ` · saved ${gbp(st.saved)}` : ''} · ${Math.round(st.protein)}g protein</p>
    <p class="muted">Prices are the app’s estimate with your Nectar prices. It goes into Past shops, where you can compare weeks and rate what you had.</p>
    ${left && Object.keys(ticked).length ? `<p class="warnp">${left} item${left > 1 ? 's' : ''} not ticked off. They are saved in this shop anyway.</p>` : ''}
    <label class="check"><input type="checkbox" id="coFresh" checked /><span>Start a fresh list for next time<small>Empties the list, the ticks and the “Happy” deals. The saved shop keeps everything, and you can add it all again from Past shops.</small></span></label>
    <div class="dlgacts"><button value="cancel" type="submit">Cancel</button><button value="save" class="primary" type="submit">Save shop</button></div></form>`
  dlg.onclose = async () => {
    if (dlg.returnValue !== 'save') return
    const fresh = $('#coFresh').checked
    const r = await sendJSON('orders', { order: snap, fresh }).catch(() => null)
    if (!r?.ok) return toast('Could not save the shop')
    orders = [snap, ...orders]; buildOrdered()
    if (fresh) {
      basket = {}; ticked = {}; locks = {}; basketStamp = new Date().toISOString(); undoStack = []; redoStack = []; saveUndo()
      renderBasket(); render()
    }
    closeDrawer(); shopSel = snap.id; showShops(true)
    toast(fresh ? 'Shop saved · fresh list started' : 'Shop saved')
  }
  dlg.returnValue = ''; dlg.showModal(); dlg.querySelector('.primary').focus()
}
$('#checkout').onclick = openCheckout

function showShops(on) {
  root.classList.toggle('shops', on)
  $('#shops').hidden = !on; $('#shopsBtn').setAttribute('aria-pressed', on)
  if (on) { renderShops(); root.scrollTo(0, 0) }
}
$('#shopsBtn').onclick = () => showShops(!root.classList.contains('shops'))
$('#bemptyShops').onclick = () => { closeDrawer(); showShops(true) }
$('#q').addEventListener('input', () => { if (root.classList.contains('shops')) showShops(false) })

// a column compared with his own average across the other shops: ▲ green when it's better for him
function delta(v, avg, better, fmt) {
  if (v == null || avg == null || !isFinite(avg)) return ''
  const diff = v - avg, tiny = Math.abs(diff) < Math.abs(avg) * 0.03 + 1e-9
  if (tiny) return `<span class="delta flat" title="About your average (${fmt(avg)})">≈</span>`
  const good = better === 'up' ? diff > 0 : diff < 0
  return `<span class="delta ${good ? 'up' : 'down'}" title="Your average: ${fmt(avg)}">${diff > 0 ? '▲' : '▼'}</span>`
}
function renderShops() {
  syncShopsBtn()
  const live = appUnits() ? { ...snapshotBasket(), id: 'live', live: true } : null
  const rows = [...(live ? [live] : []), ...orders]
  const stats = Object.fromEntries(rows.map((o) => [o.id, shopStats(o)]))
  const avgOf = (k, except) => { const xs = orders.filter((o) => o.id !== except).map((o) => stats[o.id][k]).filter((x) => x != null); return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null }
  const pct = (x) => `${Math.round(x * 100)}%`, g0 = (x) => `${Math.round(x)}g`, g1 = (x) => `${x.toFixed(1)}g`, v1 = (x) => x.toFixed(1)
  const date = (o) => o.live ? 'This week’s list' : new Date(o.id).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: new Date(o.id).getFullYear() === new Date().getFullYear() ? undefined : 'numeric' })
  const row = (o) => {
    const st = stats[o.id], cmp = orders.length > (o.live ? 0 : 1)
    const dl = (k, b, f) => (cmp ? delta(st[k], avgOf(k, o.id), b, f) : '')
    const over = st.budget ? st.total - st.budget : null
    return `<tr class="srow ${o.live ? 'live' : ''} ${shopSel === o.id ? 'sel' : ''}" data-shop="${esc(o.id)}">
      <td><button class="rowbtn" data-shop="${esc(o.id)}" aria-expanded="${shopSel === o.id}">${date(o)}</button><small>${o.live ? 'not saved yet' : 'saved from the list'}</small></td>
      <td>${st.units}<small>${st.lines} products</small></td>
      <td>${gbp(st.total)}${over == null ? '' : `<small class="${over > 0 ? 'over' : ''}">${over > 0 ? `${gbp(over)} over budget` : `${gbp(-over)} under`}</small>`}</td>
      <td>${gbp(st.saved)}${dl('savedPct', 'up', pct)}<small>${pct(st.savedPct)} off shelf price</small></td>
      <td>${g0(st.protein)}${dl('protein', 'up', g0)}<small>${(st.protein / 100).toFixed(1)} days at 100g</small></td>
      <td>${g1(st.ppp)}${dl('ppp', 'up', g1)}</td>
      <td>${st.value == null ? '—' : v1(st.value)}${st.value == null ? '' : dl('value', 'up', v1)}</td>
      <td>${g0(st.satDay)}${dl('satDay', 'down', g0)}</td>
      <td>${pct(st.offer)}${dl('offer', 'up', pct)}</td>
      <td>${pct(st.ready)}</td>
      <td>${st.rated}/${st.lines}${st.toRate ? `<small>${st.toRate} to rate</small>` : '<small>all rated ✓</small>'}</td></tr>`
  }
  const table = rows.length ? `<div class="twrap"><table class="stable">
    <thead><tr><th scope="col">Shop</th><th scope="col">Items</th><th scope="col">Spent</th><th scope="col"><abbr title="Money off the shelf price from offers and Nectar prices">Saved</abbr></th>
    <th scope="col">Protein</th><th scope="col"><abbr title="Grams of protein for each £1 spent">Protein per £</abbr></th>
    <th scope="col"><abbr title="Average Value score (0–10) of what you bought, weighted by spend: how good each price was against similar products at Sainsbury's">Price quality</abbr></th>
    <th scope="col"><abbr title="Saturated fat per day, over the days the protein lasts (guideline: under 30g)">Sat fat / day</abbr></th>
    <th scope="col"><abbr title="Share of the spend on items bought on an offer">On offer</abbr></th><th scope="col"><abbr title="Share of the spend on ready meals, pizza and party food">Ready meals</abbr></th><th scope="col">Rated</th></tr></thead>
    <tbody>${rows.map(row).join('')}</tbody></table></div>` : ''
  const sel = rows.find((o) => o.id === shopSel) ?? null
  $('#shops').innerHTML = `<div class="shead"><h2>Past shops</h2><button class="chip" id="shopsBack">← Back to shopping</button></div>
    <p class="snote">Each shop is compared with your own average (▲▼), not with national figures, since every household's shop is different. Price quality is the one outside measure: how each price compared with similar products at Sainsbury's that week.</p>
    ${orders.length ? '' : `<div class="sempty"><p><b>No saved shops yet.</b></p><p>When you've finished at the shop, press <b>Done shopping</b> on your list. ${live ? 'Your current list is shown below so you can see how it shapes up.' : ''}</p></div>`}
    ${table}${sel ? reviewHtml(sel) : ''}`
}
function reviewHtml(o) {
  const st = shopStats(o)
  const items = [...o.items].sort((a, b) => (ratings[a.id] ? 1 : 0) - (ratings[b.id] ? 1 : 0) || b.cost - a.cost)
  const it = (i) => {
    const d = byId[i.id], r = ratings[i.id]?.fit
    const paid = i.qty ? i.cost / i.qty : null, nowP = d && effPrice(d)
    const diff = paid != null && nowP != null && !(i.offer && i.offer === d.offerShort && isMulti(d)) ? nowP - paid : 0
    const move = Math.abs(diff) < 0.015 ? '' : ` <span class="${diff > 0 ? 'up' : 'dn'}">${diff > 0 ? '▲' : '▼'} ${pence(diff)}</span>`
    const now = d ? (d.oos ? 'not at Chislehurst now' : `now ${gbp(nowP)}${move}${d.onOffer && d.best ? ` <span class="rnow">· ${esc(d.offerShort ?? 'on offer')}</span>` : ''}`) : 'no longer listed'
    return `<div class="ritem ${r ? '' : 'unrated'}">${i.img ? `<img referrerpolicy="no-referrer" src="${esc(i.img)}" alt="" width="44" height="44" loading="lazy" />` : '<span></span>'}
      <span class="rn"><b>${esc(shortName(i.name))}</b><small>×${i.qty} · paid ${gbp(i.qty ? i.cost / i.qty : i.cost)} each${i.offer ? ` (${esc(i.offer)})` : ''} · ${now}</small></span>
      ${d ? `<button class="rrate ${r ? (r >= 7 ? 'hi' : r <= 4 ? 'lo' : '') : 'todo'}" data-tastefor="${esc(i.id)}" aria-label="${r ? `Taste ${r} out of 10, change` : 'Rate taste'} for ${esc(shortName(i.name))}">${r ? `${r}/10` : 'Rate'}</button>` : '<span></span>'}</div>`
  }
  return `<section class="review" aria-label="Review this shop">
    <div class="rhead"><h3>${o.live ? 'This week’s list' : `Shop of ${new Date(o.id).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`}</h3>
      <div class="racts">${o.live ? '' : `<button class="chip" data-reorder="${esc(o.id)}">Add all to my list</button><button class="linkbtn" data-delshop="${esc(o.id)}">Delete this shop</button>`}</div></div>
    <p class="snote" style="margin:4px 0 0">${o.live ? 'Rate anything you already know. Ratings shape the taste profile behind For you.' : 'Once you’ve had them, rate how much you liked each one (taste, not price). Every rating sharpens the taste profile behind For you and the Fit scores.'}</p>
    <div class="rprog" aria-hidden="true"><div style="width:${(st.rated / Math.max(1, st.lines)) * 100}%"></div></div>
    <small class="muted">${st.rated} of ${st.lines} rated</small>
    <div class="ritems">${items.map(it).join('')}</div></section>`
}
$('#shops').onclick = async (e) => {
  if (e.target.closest('#shopsBack')) return showShops(false)
  if (e.target.closest('[data-tastefor]')) return
  const re = e.target.closest('[data-reorder]')?.dataset.reorder
  if (re) {
    const o = orders.find((x) => x.id === re), add = o.items.filter((i) => byId[i.id] && !byId[i.id].oos), skip = o.items.length - add.length
    act(`added the shop of ${new Date(o.id).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} again`, () => { for (const i of add) { dropTick(i.id); basket[i.id] = (basket[i.id] ?? 0) + i.qty; save(i.id, i.qty) } })
    render(); renderShops()
    return toast(`Added ${add.length} product${add.length === 1 ? '' : 's'}${skip ? ` · ${skip} not at Chislehurst or gone, left out` : ''}`)
  }
  const del = e.target.closest('[data-delshop]')?.dataset.delshop
  if (del) {
    if (!confirm('Delete this shop from Past shops? Your ratings stay.')) return
    await sendJSON('orders', { id: del }, 'DELETE')
    orders = orders.filter((o) => o.id !== del); buildOrdered(); shopSel = null; render(); return renderShops()
  }
  const row = e.target.closest('[data-shop]')?.dataset.shop
  if (row) { shopSel = shopSel === row ? null : row; renderShops(); if (shopSel) $('#shops .review')?.scrollIntoView({ behavior: smooth(), block: 'nearest' }) }
}
syncShopsBtn()
learn(); renderBasket(); render()
}

