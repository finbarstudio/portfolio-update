import { LOGO_HTML } from "./logo";

const CARET =
  '<svg class="caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const TASTE_BUTTONS = Array.from(
  { length: 10 },
  (_, i) => `<button type="button" data-tv="${i + 1}" aria-pressed="false">${i + 1}</button>`,
).join("");

/**
 * The page body of Dad's Shop: the Tesco helper's markup with Dad's wording.
 * Injected once into the root div by DadApp; boot.ts then finds everything by id,
 * so ids and data- attributes here are load-bearing.
 */
export const APP_MARKUP = `
<header id="hdr">
  <div class="hbar">
    <h1 title="Fit = how healthy it is for Dad (protein, saturated fat, processing) + his taste: ✓ he rated it, ≈ learned from similar products">${LOGO_HTML} <span class="muted" id="meta"></span></h1>
    <label class="searchbox"><svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m11 11 3.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><input type="search" id="q" placeholder="Search products" aria-label="Search products" /></label>
    <div class="hist"><button class="iconbtn" id="undo" disabled aria-label="Undo" title="Nothing to undo yet">↶</button><button class="iconbtn" id="redo" disabled aria-label="Redo" title="Nothing to redo">↷</button></div>
    <button type="button" class="pbtn shopsbtn" id="shopsBtn" aria-pressed="false" title="Past shops: spend, savings and protein per shop, and rating what you've had"><b>Past shops</b><span class="badge" id="shopsN" hidden></span></button>
  </div>
  <div class="hnav">
    <div class="viewseg" id="cats" role="group" aria-label="View"></div>
    <span class="vsep" aria-hidden="true"></span>
    <div class="dd" id="dd">
      <button type="button" class="pbtn ddbtn popbtn" id="ddBtn" aria-haspopup="listbox" aria-expanded="false" aria-controls="ddPanel"><span class="k">Category</span><b id="ddLabel">All categories</b>${CARET}</button>
      <div class="pop ddpanel" id="ddPanel" hidden>
        <div class="ddsearch"><input type="search" id="ddQ" placeholder="Find a category (mince, wraps, yogurt…)" aria-label="Find a category" autocomplete="off" /></div>
        <div class="ddcols" id="ddCols"><ul role="listbox" id="ddDepts" aria-label="Departments"></ul><ul role="listbox" id="ddGroups" aria-label="Types"></ul></div>
        <ul role="listbox" class="ddres" id="ddRes" aria-label="Matching categories" hidden></ul>
      </div>
    </div>
    <button type="button" class="pbtn popbtn" id="sortBtn" aria-haspopup="menu" aria-expanded="false" aria-controls="sortPanel"><span class="k">Sort</span><b id="sortLabel">Best overall</b>${CARET}</button>
    <button type="button" class="pbtn popbtn" id="filtBtn" aria-haspopup="true" aria-expanded="false" aria-controls="filtPanel"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12M4.5 8h7M7 12h2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg><b class="fword">Filters</b><span class="badge" id="filtN" hidden></span>${CARET}</button>
    <select id="sort" hidden aria-hidden="true">
      <option value="rec">✦ Picked for you</option><option value="value">Best deal</option><option value="saving">Biggest saving</option><option value="score" selected>Best overall</option><option value="price">Lowest price</option><option value="few">Fewest ingredients</option><option value="ppp">Protein per £</option>
    </select>
  </div>
  <div id="segs"><div class="tabs segrow" id="segType" role="group" aria-label="Type"></div><div class="row segrow" id="segProt" role="group" aria-label="Main protein"></div></div>
  <div class="pop menu" id="sortPanel" role="menu" aria-label="Sort by" hidden>
    <button type="button" role="menuitemradio" data-sort="rec"><b>✦ Picked for you</b><small>Your taste + value + the saving</small></button>
    <button type="button" role="menuitemradio" data-sort="value"><b>Best deal</b><small>Value score (price against similar products), then what suits you</small></button>
    <button type="button" role="menuitemradio" data-sort="saving"><b>Biggest saving</b><small>Most off the shelf price</small></button>
    <button type="button" role="menuitemradio" data-sort="score"><b>Best overall</b><small>Health 60%, value 25%, taste 15%</small></button>
    <button type="button" role="menuitemradio" data-sort="price"><b>Lowest price</b><small>Cheapest pack first</small></button>
    <button type="button" role="menuitemradio" data-sort="few"><b>Fewest ingredients</b><small>Shortest ingredients list first, then value</small></button>
    <button type="button" role="menuitemradio" data-sort="ppp"><b>Protein per £</b><small>Most grams of protein for your money</small></button>
  </div>
  <div class="pop tastepanel" id="tastePanel" role="group" aria-label="Taste rating" hidden>
    <p id="tasteFor"></p>
    <div class="tgrid">${TASTE_BUTTONS}</div>
    <button type="button" class="linkbtn" id="tasteClear">Clear rating</button>
  </div>
  <div class="pop fpanel" id="filtPanel" role="group" aria-label="Filters" hidden>
    <p class="fh">Only show</p>
    <div class="fchips">
      <button type="button" class="fchip" id="fNew" aria-pressed="false" title="Products Sainsbury's marks as New. In Meal deals and Multi-buys nothing is hidden: new ones move to the top">New this week</button>
      <button type="button" class="fchip" id="qForYou" aria-pressed="false" title="Only picks for you: good taste, good value, on offer, not on your list. Works with Offers, Multi-buys, Meal deals and any category">✦ For you</button>
      <button type="button" class="fchip" id="qFinest" aria-pressed="false" title="Only Taste the Difference products (works in any view, category or deal)">Taste the Difference</button>
      <button type="button" class="fchip" id="fDeals" aria-pressed="false" title="Offers with a saving of 25% or more and Value 6+, leaving out your usual staples">Good deals</button>
      <button type="button" class="fchip" id="fFrozen" aria-pressed="false">Frozen</button>
      <button type="button" class="fchip" id="fRated" aria-pressed="false">Rated by me</button>
      <button type="button" class="fchip" id="fBasket" aria-pressed="false">On my list</button>
      <button type="button" class="fchip" id="fNoFolic" aria-pressed="false" title="Leave out anything that lists folic acid (or folate) as an ingredient">No folic acid</button>
    </div>
    <p class="fh">Ultra-processing markers</p>
    <div class="fseg" role="group" aria-label="Ultra-processing markers">
      <button type="button" class="fsegb" id="fUpfAny" aria-pressed="true" title="Any amount of processing">Any</button>
      <button type="button" class="fsegb" id="fUpf0" aria-pressed="false" title="Only products with no ultra-processing markers in their ingredients (plain foods count). Products whose label isn't read yet are left out">None</button>
      <button type="button" class="fsegb" id="fUpf1" aria-pressed="false" title="Only products with at most 1 ultra-processing marker. Products whose label isn't read yet are left out">≤ 1</button>
      <button type="button" class="fsegb" id="fUpf2" aria-pressed="false" title="Only products with at most 2 ultra-processing markers. Products whose label isn't read yet are left out">≤ 2</button>
    </div>
    <div class="fchips" role="group" aria-label="Hide">
      <button type="button" class="fchip" id="fSat" aria-pressed="true" title="Hides processed products that are high in saturated fat. Plain foods like steak and full-fat yogurt stay">Hide high sat fat</button>
      <button type="button" class="fchip" id="fGood" aria-pressed="false" title="Hides products scoring under 5 for value (anything on your list stays)">Hide value under 5</button>
      <button type="button" class="fchip" id="fPlain" aria-pressed="false" title="Hides every food that is just one ingredient (a steak, an egg, a bag of rice). Anything on your list stays">Hide one-ingredient foods</button>
      <button type="button" class="fchip" id="fOwn" aria-pressed="false" title="Hides Sainsbury's own brand. Taste the Difference stays">Hide Sainsbury's own brand</button>
      <button type="button" class="fchip" id="fOos" aria-pressed="true" title="Hides products that are out today or that Dad reported as not at Chislehurst. A search still finds them">Hide not at Chislehurst</button>
    </div>
    <div class="ffoot"><button type="button" class="linkbtn" id="fReset">Reset to default</button></div>
  </div>
</header>
<div class="layout">
  <main id="shopMain"><div id="dealbar" hidden></div><div class="grid" id="grid"></div><button class="chip more" id="more">Show more</button></main>
  <aside aria-label="Shopping list" id="basket">
    <button class="btoggle" id="btoggle" aria-expanded="false" aria-controls="basket"><strong>My list</strong><span id="bsum"></span><span class="chevup" aria-hidden="true">▴</span></button>
    <div class="bhead">
      <h2>My list</h2>
      <div class="viewseg bmode" id="bmode" role="group" aria-label="List view"><button type="button" data-bmode="plan" aria-pressed="true">Plan</button><button type="button" data-bmode="store" aria-pressed="false">In store</button></div>
      <button type="button" class="bclose" id="bclose" aria-label="Close my list">✕</button>
    </div>
    <div class="bempty" id="bempty"><p><b>Your list is empty.</b></p><p class="muted">Add products with <b>+ Add</b>, or bring back a whole shop from Past shops.</p><button type="button" class="chip" id="bemptyShops">Past shops</button></div>
    <div class="plan-only">
      <div class="stat"><span>Estimated total</span><strong id="total">£0.00</strong></div>
      <div class="bar" id="bar"><div style="width:0"></div></div>
      <div class="stat muted" id="budgetRow"><span id="budgetLabel">Budget</span><span id="left"></span></div>
      <div class="stat"><span>You save vs shelf price</span><strong id="saved"></strong></div>
      <div class="stat"><span>Protein (known)</span><strong id="prot">0g</strong></div>
      <div class="stat muted"><span>≈ days at 100g/day</span><span id="days"></span></div>
      <div class="stat" id="satStat" title="Saturated fat across everything on the list with a label, spread over the same days as the protein. UK guideline for men: no more than 30g a day."><span>Sat fat per day</span><strong id="sat"></strong></div>
    </div>
    <div id="stockbar" aria-live="polite"></div>
    <div class="store-only" id="storesum"></div>
    <button class="chip checkout" id="checkout" title="Finished the shop? Save this list to Past shops so you can compare weeks and rate what you had">Done shopping</button>
    <p class="muted torate plan-only" id="torate"></p>
    <div class="blist" id="lines"></div>
  </aside>
</div>
<section id="shops" aria-label="Past shops" hidden></section>
<dialog id="coDlg" class="dlg" aria-labelledby="coTitle"></dialog>
<dialog id="pd" class="pd" aria-labelledby="pdName"></dialog>
<div class="toast" id="toast" role="status"></div>
`;
