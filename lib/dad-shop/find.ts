import type { FindFilters, Sort, View } from "./types";

/** Offers and Multi-buys start on "Biggest saving"; everything else on "Picked for you". */
export function defaultSort(view: View): Sort {
  return view === "offers" || view === "multibuys" ? "saving" : "rec";
}

/** The URL is the state: back from a product lands on the same search. */
export function queryFor(f: FindFilters): string {
  const p = new URLSearchParams();
  if (f.view !== "all") p.set("view", f.view);
  if (f.q) p.set("q", f.q);
  if (f.coll) p.set("coll", f.coll);
  if (f.zone) p.set("zone", f.zone);
  if (f.dept) p.set("dept", f.dept);
  if (f.cat) p.set("cat", f.cat);
  if (f.animal) p.set("animal", f.animal);
  if (f.sort !== defaultSort(f.view)) p.set("sort", f.sort);
  p.set("noSeedOil", f.noSeedOil ? "1" : "0");
  p.set("hideSat", f.hideSat ? "1" : "0");
  if (f.good) p.set("good", "1");
  if (f.frozen) p.set("frozen", "1");
  if (f.rated) p.set("rated", "1");
  if (f.onList) p.set("onList", "1");
  if (f.fewIngredients) p.set("few", "1");
  if (f.hideOwn) p.set("hideOwn", "1");
  if (f.hideSingle) p.set("hideSingle", "1");
  if (f.page > 0) p.set("page", String(f.page));
  return p.toString();
}

