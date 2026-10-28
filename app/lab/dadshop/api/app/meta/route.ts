import { failed, json } from "@/lib/dad-shop/api";
import { DAD_NEEDS } from "@/lib/dad-shop/app-catalog";
import { loadMeta } from "@/lib/dad-shop/app-catalog-db";
import { getDb } from "@/lib/dad-shop/db";
import taxonomy from "@/lib/dad-shop/group-taxonomy.json";
import { INGREDIENT_RULES } from "@/lib/dad-shop/ingredient-rules";
import { DEFAULT_SETTINGS } from "@/lib/dad-shop/types";

export const dynamic = "force-dynamic";

/** The small fixed data the app needs: taxonomy, the processing markers, his staples, when the data was read, the budget. */
export async function GET(): Promise<Response> {
  const sql = getDb();
  // Not connected: the fixed parts still answer so the page opens; the dates are empty.
  if (!sql) {
    return json({ taxonomy, ingredientRules: INGREDIENT_RULES, needs: [...DAD_NEEDS], scrapedAt: null, stockAt: null, budget: DEFAULT_SETTINGS.budget_gbp });
  }
  try {
    return json(await loadMeta(sql));
  } catch (err) {
    return failed(err);
  }
}
