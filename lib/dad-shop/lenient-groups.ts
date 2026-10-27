/**
 * Comparison groups where a long ingredient list is normal (meals, sauces, soups, coated and marinated food, ...).
 * Everything else is judged on "fewer ingredients is better" (see `processingScore` in breakdown.ts).
 *
 * MUST MATCH the pipeline: this is a copy of LENIENT_GROUPS in Lab/dad-shop/src/score.ts. If one changes, change
 * the other, or the breakdown on a card will stop agreeing with the stored health score.
 * lenient-groups.test.ts checks that every name here is still a real group in group-taxonomy.json.
 */
export const LENIENT_GROUPS: ReadonlySet<string> = new Set([
  "pizza", "savoury pies, pasties & sausage rolls", "party food & starters", "sandwiches & wraps (ready-made)", "lunch kits & snack packs",
  "sushi & poke", "ready meals (chilled & frozen)", "ambient meals (tins, pots & pouches)", "rice, noodle & grain sides (ready)", "potato & veg sides (prepared)",
  "tinned soup", "fresh soup", "instant & cup soup",
  "ketchup, brown & BBQ sauce", "mayonnaise & salad cream", "mustard & horseradish", "Asian pantry sauces", "hot sauce", "sweet chilli & dipping sauces",
  "chutneys & pickles (jars)", "salad dressings", "pesto", "curry pastes", "cooking pastes & purées", "pasta sauces", "curry & Indian cooking sauces",
  "stir-fry sauces", "other cooking sauces", "hummus", "dips",
  "seasoning blends & rubs", "stock cubes & pots", "gravy & sauce granules", "stuffing", "recipe mix sachets", "dinner kits",
  "breaded & battered fish", "fish in sauce & ready-to-cook fish", "breaded & coated", "marinated & flavoured (raw, to cook)", "cooked chicken pieces & skewers",
  "veggie burgers, sausages & bites", "deli salads & coleslaw", "fresh & filled pasta, gnocchi", "tinned pasta", "instant noodles & pots", "garlic bread & topped flatbreads",
]);
