import { homedir } from "node:os";
import { join } from "node:path";

/**
 * The product file the cloned app loads: every product as Finbar's deals.json has it, minus the fields that are
 * his alone. The publish step writes it here (gzipped) and uploads the same bytes to R2.
 */
export const CATALOG_CACHE_FILE = join(homedir(), ".cache", "food-shop", "catalog.json.gz");

/** Fields in deals.json that come from Finbar's own preferences, ratings or needs: never published. */
export const PERSONAL_FIELDS = ["fitWhy", "text", "prevText", "needs", "fit", "fitRaw", "score", "why"] as const;
