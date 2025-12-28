// src/protocol/ingredientMatch.js
import { CATALOG, ALIASES } from "./ingredientCatalog";

const s = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));

export function normalizeIngredientName(input) {
  const raw = s(input).trim().toLowerCase();
  if (!raw) return "";

  // basic cleanup
  const cleaned = raw
    .replace(/\(.*?\)/g, "") // remove parentheticals
    .replace(/[^a-z\s]/g, " ") // strip punctuation/numbers
    .replace(/\s+/g, " ")
    .trim();

  // apply alias
  if (ALIASES[cleaned]) return ALIASES[cleaned];

  return cleaned;
}

/**
 * Strict classification:
 * - exact match to a catalog key is ideal
 * - otherwise "unknown" (blocked)
 *
 * If you want slightly more flexible matching later,
 * you can add controlled heuristics (not fuzzy guessing).
 */
export function classifyIngredient(input) {
  const key = normalizeIngredientName(input);
  if (!key) return { key: "", category: null, isKnown: false };

  // exact
  if (Object.prototype.hasOwnProperty.call(CATALOG, key)) {
    return { key, category: CATALOG[key], isKnown: true };
  }

  // controlled contains (optional): only if it matches a whole word key
  // This helps "cooked quinoa" still classify as "quinoa" without guessing too much.
  for (const catalogKey of Object.keys(CATALOG)) {
    if (key === catalogKey) continue;
    if (key.includes(catalogKey)) {
      return { key: catalogKey, category: CATALOG[catalogKey], isKnown: true };
    }
  }

  return { key, category: null, isKnown: false };
}
