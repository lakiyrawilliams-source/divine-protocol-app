// src/data/protocolFoods.js
// STRICT allowed-foods dictionary + helpers for ingredient compliance.
// This file does NOT decide meal (breakfast/lunch/dinner). That's mealRules.
// This file only answers: "is this ingredient allowed at all?" and
// provides a normalized lookup so we can auto-remove + summarize removals.

export const PROTOCOL_FOODS_VERSION = "2025-12-22";

export const FOOD_GROUP = Object.freeze({
  FRUIT: "fruit",
  LEAFY_GREENS: "leafy_greens",
  VEGETABLE: "vegetable",
  SPROUT: "sprout",
  SEAWEED: "seaweed",
  HERB_SPICE: "herb_spice",
  BEAN_LEGUME: "bean_legume",
  NUT_SEED: "nut_seed",
  OIL: "oil",
  VINEGAR: "vinegar",
  CONDIMENT: "condiment",
  SWEETENER: "sweetener",
  COMPLEX_CARB: "complex_carb",
  UNKNOWN: "unknown",
});

// --- Canonical allowed foods (from your message) ---
// NOTE: we keep names human-friendly, but all matching happens via normalized keys.
export const ALLOWED = Object.freeze({
  // Fruits (simple carbs)
  fruits: Object.freeze([
    "Apricots",
    "Blueberries",
    "Cantaloupe",
    "Date fruit",
    "Figs",
    "Grapes",
    "Honeydew Melon",
    "Lemon",
    "Lime",
    "Mango",
    "Orange",
    "Papaya",
    "Pineapple",
    "Pomagranate", // keep spelling as provided; alias below adds "pomegranate"
    "Wild Blueberries",
    // from "Generally" section:
    "Apples",
  ]),

  // Leafy greens
  leafyGreens: Object.freeze([
    "Iceberg Lettuce",
    "Microgreens",
    "Romaine Lettuce",
    // from "Generally" section:
    "Spinach",
    "Chard",
  ]),

  // Vegetables
  vegetables: Object.freeze([
    "Asparagus",
    "Broccoli",
    "Carrot",
    "Cauliflower",
    "Celery",
    "Green Beans",
    "Green Cabbage",
    "Green Onion",
    "Green Peas",
    "Kabocha Squash",
    "Leek",
    "Napa Cabbage",
    "Red Cabbage",
    "Red Onion",
    "Snow Peas",
    "Sugar Snap",
    "Summer Squash",
    "Zucchini",
    // from "Generally" section:
    "Cucumbers",
    "Avocado",
  ]),

  // Sprouts
  sprouts: Object.freeze(["Broccoli Sprouts", "Clover Sprouts", "Radish Sprouts"]),

  // Seaweed
  seaweed: Object.freeze(["Dulse", "Kombu", "Nori"]),

  // Complex carbs
  complexCarbs: Object.freeze(["Quinoa", "Sweet Potato"]),

  // Beans/Legumes - proteins
  beansLegumes: Object.freeze(["Azuki Beans", "Black Bean", "Chickpeas", "Lentils", "Pinto Beans"]),

  // Nuts/Seeds - proteins
  nutsSeeds: Object.freeze(["Hemp Seeds", "Walnuts", "Chia", "Pumpkin Seeds"]),

  // Herbs/Spices
  herbsSpices: Object.freeze([
    "Allspice",
    "Basil",
    "Bay Leaf",
    "Brown Mustard Seeds",
    "Cilantro",
    "Cinnamon",
    "Clove",
    "Coriander",
    "Cumin",
    "Fennel",
    "Garlic",
    "Lemon Grass",
    "Mustard Seeds",
    "Oregano",
    "Parsley",
    "Sea Salt",
    // extra from earlier “cleansing herbs” list:
    "Nettle",
    "Dandelion",
    "Horsetail",
  ]),

  // Vinegars
  vinegars: Object.freeze(["Balsamic Vinegar", "Red Wine Vinegar", "White Wine Vinegar"]),

  // Oils
  oils: Object.freeze(["Coconut Oil", "MCT Oil"]),

  // Condiments / sweeteners
  condiments: Object.freeze(["Coconut Amino", "Dijon Mustard", "Honey Mustard", "Yellow Mustard"]),
  sweeteners: Object.freeze(["Honey"]),
});

// -----------------------------
// Aliases (normalize real-world text -> canonical key)
// -----------------------------
export const ALIASES = Object.freeze({
  // spelling / plural / common variants
  "pomegranate": "Pomagranate",
  "pomegranate seeds": "Pomagranate",
  "wild blueberries": "Wild Blueberries",
  "blueberry": "Blueberries",
  "honeydew": "Honeydew Melon",
  "cantaloupe melon": "Cantaloupe",
  "date": "Date fruit",
  "dates": "Date fruit",
  "chickpeas (garbanzo)": "Chickpeas",
  "garbanzo": "Chickpeas",
  "garbanzo beans": "Chickpeas",
  "black beans": "Black Bean",
  "pinto bean": "Pinto Beans",
  "pinto beans": "Pinto Beans",
  "lentil": "Lentils",
  "azuki": "Azuki Beans",
  "scallion": "Green Onion",
  "scallions": "Green Onion",
  "spring onion": "Green Onion",
  "spring onions": "Green Onion",
  "iceberg": "Iceberg Lettuce",
  "romaine": "Romaine Lettuce",
  "napa": "Napa Cabbage",
  "zuke": "Zucchini",

  // "lemon grass" vs "lemongrass"
  "lemongrass": "Lemon Grass",

  // oils / vinegars
  "apple cider vinegar": null, // explicitly NOT listed in your allowed vinegars table
  "white wine vin": "White Wine Vinegar",
  "red wine vin": "Red Wine Vinegar",

  // mustard seeds
  "brown mustard seed": "Brown Mustard Seeds",
  "brown mustard seeds": "Brown Mustard Seeds",
  "mustard seed": "Mustard Seeds",
  "mustard seeds": "Mustard Seeds",

  // seaweed variants
  "kombu seaweed": "Kombu",

  // nuts/seeds variants
  "pumpkin seed": "Pumpkin Seeds",
  "pumpkin seeds": "Pumpkin Seeds",
  "hemp seed": "Hemp Seeds",
  "hemp seeds": "Hemp Seeds",
  "chia seed": "Chia",
  "chia seeds": "Chia",
});

// -----------------------------
// Build normalized lookup maps
// -----------------------------
function s(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

export function normalizeToken(text) {
  return s(text)
    .trim()
    .toLowerCase()
    // keep letters/numbers/spaces only
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Canonical -> group
const CANONICAL_GROUP = (() => {
  const map = new Map();

  const putMany = (arr, group) => arr.forEach((name) => map.set(name, group));

  putMany(ALLOWED.fruits, FOOD_GROUP.FRUIT);
  putMany(ALLOWED.leafyGreens, FOOD_GROUP.LEAFY_GREENS);
  putMany(ALLOWED.vegetables, FOOD_GROUP.VEGETABLE);
  putMany(ALLOWED.sprouts, FOOD_GROUP.SPROUT);
  putMany(ALLOWED.seaweed, FOOD_GROUP.SEAWEED);
  putMany(ALLOWED.herbsSpices, FOOD_GROUP.HERB_SPICE);
  putMany(ALLOWED.beansLegumes, FOOD_GROUP.BEAN_LEGUME);
  putMany(ALLOWED.nutsSeeds, FOOD_GROUP.NUT_SEED);
  putMany(ALLOWED.oils, FOOD_GROUP.OIL);
  putMany(ALLOWED.vinegars, FOOD_GROUP.VINEGAR);
  putMany(ALLOWED.condiments, FOOD_GROUP.CONDIMENT);
  putMany(ALLOWED.sweeteners, FOOD_GROUP.SWEETENER);
  putMany(ALLOWED.complexCarbs, FOOD_GROUP.COMPLEX_CARB);

  return map;
})();

// normalizedKey -> canonicalName (or null if explicitly disallowed)
const NORMALIZED_TO_CANONICAL = (() => {
  const map = new Map();

  // direct canonicals
  for (const canonical of CANONICAL_GROUP.keys()) {
    map.set(normalizeToken(canonical), canonical);
  }

  // alias entries
  for (const [alias, canonical] of Object.entries(ALIASES)) {
    map.set(normalizeToken(alias), canonical);
  }

  return map;
})();

// --- Public API ---

/**
 * resolveCanonicalName(ingredientText)
 * - returns canonical food name if recognized & allowed
 * - returns null if explicitly disallowed (e.g., apple cider vinegar alias set to null)
 * - returns undefined if not recognized at all
 */
export function resolveCanonicalName(ingredientText) {
  const key = normalizeToken(ingredientText);
  if (!key) return undefined;

  if (NORMALIZED_TO_CANONICAL.has(key)) {
    return NORMALIZED_TO_CANONICAL.get(key); // may be null
  }

  // Attempt a cautious "contains" match against canonicals ONLY.
  // This helps with strings like "Fresh Blueberries" or "Cooked Quinoa".
  // We do NOT guess new foods; we only match if a canonical token is contained.
  // (Still strict: if no canonical is found, it's unknown.)
  for (const canonical of CANONICAL_GROUP.keys()) {
    const ck = normalizeToken(canonical);
    if (ck && key.includes(ck)) return canonical;
  }

  return undefined;
}

/**
 * getFoodGroup(ingredientText)
 * Returns:
 *  - one of FOOD_GROUP values, or FOOD_GROUP.UNKNOWN
 *  - plus canonicalName if found
 */
export function getFoodGroup(ingredientText) {
  const canonical = resolveCanonicalName(ingredientText);

  if (canonical === null) {
    return Object.freeze({ canonicalName: null, group: FOOD_GROUP.UNKNOWN, allowed: false, reason: "explicitly_disallowed" });
  }
  if (canonical === undefined) {
    return Object.freeze({ canonicalName: undefined, group: FOOD_GROUP.UNKNOWN, allowed: false, reason: "unknown" });
  }

  const group = CANONICAL_GROUP.get(canonical) || FOOD_GROUP.UNKNOWN;
  return Object.freeze({ canonicalName: canonical, group, allowed: group !== FOOD_GROUP.UNKNOWN, reason: "allowed" });
}

/**
 * isAllowedIngredient(ingredientText)
 * Strict allowed list only. Unknowns are NOT allowed.
 */
export function isAllowedIngredient(ingredientText) {
  const res = getFoodGroup(ingredientText);
  return Boolean(res.allowed);
}

/**
 * sanitizeIngredientLine(lineOrObj)
 * Input:
 *  - string OR { amount, item, raw } (your normalized ingredient shape)
 * Output:
 *  - { keep: boolean, sanitized: ingredientObj, removedReason?, canonicalName?, group? }
 */
export function sanitizeIngredientLine(lineOrObj) {
  // normalize to the app's ingredient shape
  const ing =
    typeof lineOrObj === "string"
      ? { amount: null, item: lineOrObj, raw: lineOrObj }
      : lineOrObj && typeof lineOrObj === "object"
      ? {
          amount: s(lineOrObj.amount).trim() || null,
          item: s(lineOrObj.item).trim() || null,
          raw: s(lineOrObj.raw).trim() || null,
        }
      : { amount: null, item: null, raw: null };

  const text = ing.item || ing.raw || "";
  const info = getFoodGroup(text);

  if (!info.allowed) {
    return Object.freeze({
      keep: false,
      sanitized: ing,
      removedReason: info.reason,
      canonicalName: info.canonicalName,
      group: info.group,
    });
  }

  // Option B auto-remove strategy expects we can keep as-is.
  // We don't rewrite the ingredient name; we just pass through.
  return Object.freeze({
    keep: true,
    sanitized: ing,
    canonicalName: info.canonicalName,
    group: info.group,
  });
}

/**
 * sanitizeIngredients(ingredientsArray)
 * Returns:
 *  - ingredients: filtered (allowed only)
 *  - removed: [{ original, reason, canonicalName, group }]
 */
export function sanitizeIngredients(ingredientsArray) {
  const ingredients = Array.isArray(ingredientsArray) ? ingredientsArray : [];
  const kept = [];
  const removed = [];

  for (const ing of ingredients) {
    const r = sanitizeIngredientLine(ing);
    if (r.keep) kept.push(r.sanitized);
    else {
      removed.push(
        Object.freeze({
          original: r.sanitized,
          reason: r.removedReason || "unknown",
          canonicalName: r.canonicalName ?? undefined,
          group: r.group || FOOD_GROUP.UNKNOWN,
        })
      );
    }
  }

  return Object.freeze({
    ingredients: Object.freeze(kept),
    removed: Object.freeze(removed),
  });
}

/**
 * buildAllowedIndex()
 * Handy for UI "Allowed foods" reference screens.
 */
export function buildAllowedIndex() {
  const entries = [];
  for (const [canonical, group] of CANONICAL_GROUP.entries()) {
    entries.push({ canonical, group });
  }
  entries.sort((a, b) => a.canonical.localeCompare(b.canonical));
  return Object.freeze(entries);
}

export const ALLOWED_INDEX = buildAllowedIndex();
