// src/protocol/sanitizeRecipe.js
import { INGREDIENT_CATALOG, MEAL } from "./ingredientCatalog";

// ---------- helpers ----------
const s = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));

function normalizeToken(str) {
  return s(str)
    .toLowerCase()
    .replace(/[\(\)\[\]\{\}]/g, " ")
    .replace(/[^\w\s-]/g, " ")   // strip punctuation
    .replace(/\s+/g, " ")
    .trim();
}

function buildAliasLookup(catalog) {
  const map = new Map();
  Object.entries(catalog).forEach(([canonical, def]) => {
    (def.aliases || []).forEach((a) => {
      map.set(normalizeToken(a), canonical);
    });
    // also allow canonical itself
    map.set(normalizeToken(canonical), canonical);
  });
  return map;
}

const ALIAS_LOOKUP = buildAliasLookup(INGREDIENT_CATALOG);

// Extract candidate ingredient “tokens” from a line/item.
// We keep it conservative: try whole phrase + last phrase chunks.
function extractCandidates(text) {
  const t = normalizeToken(text);
  if (!t) return [];
  const parts = t.split(" ").filter(Boolean);

  // candidates: full line, last 3 words, last 2 words, last 1 word
  const candidates = new Set();
  candidates.add(t);
  if (parts.length >= 3) candidates.add(parts.slice(-3).join(" "));
  if (parts.length >= 2) candidates.add(parts.slice(-2).join(" "));
  candidates.add(parts.slice(-1).join(" "));
  return Array.from(candidates);
}

function resolveCanonicalIngredient(ingredientText) {
  const candidates = extractCandidates(ingredientText);
  for (const c of candidates) {
    if (ALIAS_LOOKUP.has(c)) return ALIAS_LOOKUP.get(c);
  }
  return null; // unknown
}

function isAllowedForMeal(canonical, meal) {
  const def = INGREDIENT_CATALOG[canonical];
  if (!def) return false;
  return Array.isArray(def.meals) && def.meals.includes(meal);
}

// ---------- main ----------
/**
 * Strict sanitizer:
 * - removes noncompliant ingredients
 * - returns sanitized recipe + removed summary
 *
 * @param {object} recipe normalized recipe (built-in or custom)
 * @param {string} meal one of MEAL.BREAKFAST|MEAL.LUNCH|MEAL.DINNER
 */
export function sanitizeRecipeStrict(recipe, meal) {
  const r = recipe || {};
  const ingredients = Array.isArray(r.ingredients) ? r.ingredients : [];

  const removed = [];
  const kept = [];

  for (const ing of ingredients) {
    // Your normalized shape: { amount, item, raw }
    const label = s(ing?.item || ing?.raw).trim();
    if (!label) continue;

    const canonical = resolveCanonicalIngredient(label);

    // Unknown = remove (strict)
    if (!canonical) {
      removed.push({
        original: label,
        canonical: null,
        reason: "Not in allowed ingredient list",
      });
      continue;
    }

    // Known but wrong meal = remove
    if (!isAllowedForMeal(canonical, meal)) {
      removed.push({
        original: label,
        canonical,
        reason: `Not allowed for ${meal}`,
      });
      continue;
    }

    kept.push(ing);
  }

  const sanitizedRecipe = Object.freeze({
    ...r,
    // keep original id/title/etc, but replace ingredients
    ingredients: Object.freeze(kept),
    protocolStrict: true,
  });

  const removedSummary = Object.freeze({
    meal,
    removedCount: removed.length,
    removedItems: Object.freeze(removed),
  });

  return { sanitizedRecipe, removedSummary };
}

/**
 * Convenience: sanitize and also attach a UI-friendly string list.
 */
export function sanitizeRecipeStrictWithDisplay(recipe, meal) {
  const { sanitizedRecipe, removedSummary } = sanitizeRecipeStrict(recipe, meal);

  const lines = removedSummary.removedItems.map((x) => {
    const name = x.canonical ? `${x.original} → ${x.canonical}` : x.original;
    return `${name} — ${x.reason}`;
  });

  return {
    sanitizedRecipe,
    removedSummary,
    removedDisplayLines: Object.freeze(lines),
  };
}

export { MEAL };
