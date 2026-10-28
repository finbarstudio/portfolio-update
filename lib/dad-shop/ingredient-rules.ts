/**
 * The ultra-processing markers the pipeline looks for in an ingredients list (Lab/dad-shop src/score.ts UPF_MARKERS),
 * in the shape the Tesco app's data/ingredient-rules.json has: `{ markers, watch }`, each a name, a regex source,
 * its flags and a plain reason. The names are exactly the strings stored in products.upf_markers. PURE.
 * `watch` is empty: Dad's pipeline has no separate watch list.
 */
export interface IngredientRule {
  name: string;
  re: string;
  flags: string;
  why: string;
}

export interface IngredientRules {
  markers: IngredientRule[];
  watch: IngredientRule[];
}

export const INGREDIENT_RULES: IngredientRules = {
  markers: [
    { name: "flavouring", re: "\\bflavou?rings?\\b|\\bflavou?r\\b(?!\\s+enhancer)", flags: "i", why: "added flavour, to make it taste of something it has little of" },
    { name: "flavour enhancer", re: "flavou?r enhancers?|monosodium glutamate|\\bE\\s?62\\d\\b", flags: "i", why: "boosts savouriness (MSG and similar)" },
    { name: "colour", re: "\\bcolou?r(?:s|ing|ings)?\\b(?!\\s+stabili[sz]er)|\\bE\\s?1[0-8]\\d[a-d]?\\b", flags: "i", why: "added purely for looks" },
    { name: "sweetener", re: "sweeteners?|sucralose|acesulfame|aspartame|saccharin|steviol|sorbitol|maltitol|xylitol|erythritol|\\bE\\s?9(?:5\\d|6\\d)\\b", flags: "i", why: "sweet taste without sugar (artificial or sugar alcohols)" },
    { name: "emulsifier", re: "emulsifiers?|lecithin|mono-? and di-?glycerides|polysorbate|\\bE\\s?4(?:7\\d|8\\d)\\b|\\bE\\s?322\\b", flags: "i", why: "keeps oil and water mixed: a texture additive home cooking never uses" },
    { name: "modified starch", re: "modified (?:\\w+ )?starch|\\bE\\s?14\\d\\d\\b", flags: "i", why: "chemically altered starch for texture and shelf life" },
    { name: "maltodextrin", re: "maltodextrin", flags: "i", why: "refined starch filler, absorbed like sugar" },
    { name: "dextrose", re: "dextrose", flags: "i", why: "a refined sugar made from starch" },
    { name: "glucose/fructose syrup", re: "glucose(?:-fructose)? syrup|fructose syrup|glucose-fructose|corn syrup|invert sugar|isoglucose", flags: "i", why: "refined sugar syrups made from starch" },
    { name: "protein isolate", re: "protein isolates?|\\bisolate\\b", flags: "i", why: "extracted, refined protein added to bump protein or texture" },
    { name: "hydrolysed protein", re: "hydroly[sz]ed", flags: "i", why: "protein broken down to boost savouriness" },
    { name: "hydrogenated", re: "hydrogenated|interesterified", flags: "i", why: "industrially hardened fat" },
    { name: "stabiliser", re: "stabili[sz]ers?\\b", flags: "i", why: "keeps the texture from separating: a processing aid" },
    { name: "thickener", re: "thickeners?|xanthan|guar gum|gellan|carrageenan|locust bean gum|carob gum|gum arabic|acacia gum|cellulose gum|carboxymethyl|\\bE\\s?(?:407a?|410|412|414|415|418|466)\\b", flags: "i", why: "added to make it thicker than the real ingredients would" },
    { name: "preservative", re: "preservatives?|sorbates?|benzoates?|nitrites?|nitrates?|\\bE\\s?(?:20[0-3]|21[0-3]|249|25[0-2])\\b", flags: "i", why: "keeps it from spoiling for longer than home cooking would" },
  ],
  watch: [],
};
