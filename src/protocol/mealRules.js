// src/rules/mealRules.js
// Strict meal rules + pairing logic + Option B auto-remove w/ "Removed" summary support.
// Depends on protocolFoods.js (File 4).

import {
  PROTOCOL_FOODS,
  MEAL_ALLOWED,
  MEAL_BLOCKED,
  FRUIT_GROUPS,
} from "../data/protocolFoods";

/**
 * Meal types used throughout the app.
 * - breakfast: fruit-only rules + fruit pairing rules (no fats, no nuts/seeds, no oils, etc.)
 * - lunch: complex carb + greens/veg/sprouts/seaweed/herbs; blocks proteins/oils/vinegars/condiments/etc.
 * - dinner: proteins (beans/legumes, nuts/seeds) + veg + optional oils/vinegars/condiments/seaweed/sprouts/herbs
 */
export const MEAL = Object.freeze({
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  DINNER: "dinner",
});

/**
 * Selection constraints (to make meal planning “choosing quinoa eliminates unavailable foods” work)
 * These match what you described: likely no overlap between full recipes → easy sorting.
 */
export const MEAL_SELECTION_CONSTRAINTS = Object.freeze({
  [MEAL.BREAKFAST]: {
    singleFruitGroupOnly: false, // not needed; pairing rules govern this
    singleMelonOnly: true,
  },
  [MEAL.LUNCH]: {
    // only one complex carb per lunch plan (quinoa OR sweet potato)
    maxComplexCarbChoices: 1,
    // lunch blocks proteins, oils, vinegars, condiments, etc (handled by blocked sets)
  },
  [MEAL.DINNER]: {
    // typically one primary protein base (one bean/legume OR one nut/seed) in a chosen meal plan
    maxProteinChoices: 1,
  },
});

// ---------------------------
// Helpers / normalization
// ---------------------------
const s = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));

function norm(text) {
  return s(text).trim().toLowerCase();
}

/**
 * Safe matching:
 * We do NOT try to parse quantities. We only look for known ingredient names
 * as whole-ish words inside the ingredient line.
 */
function containsWord(haystack, needle) {
  const h = norm(haystack);
  const n = norm(needle);
  if (!h || !n) return false;
  // word-boundary-ish match (covers spaces, commas, parentheses)
  const re = new RegExp(`(^|[^a-z])${escapeRegExp(n)}([^a-z]|$)`, "i");
  return re.test(h);
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Given an ingredient object (normalized recipe format) OR a legacy/raw string,
 * return the most useful “line” for matching.
 */
function ingredientLine(ing) {
  if (!ing) return "";
  if (typeof ing === "string") return ing;
  // normalized recipe ingredient shape from your recipeData.js:
  // { amount, item, raw }
  return s(ing.item).trim() || s(ing.raw).trim() || "";
}

/**
 * Build an index of all known protocol items (across all categories),
 * so we can identify what an ingredient line is “trying” to be.
 */
const ALL_PROTOCOL_ITEMS = (() => {
  const set = new Set();
  Object.values(PROTOCOL_FOODS).forEach((arr) => {
    if (Array.isArray(arr)) arr.forEach((x) => set.add(norm(x)));
  });
  return Object.freeze([...set]);
})();

/**
 * Attempt to resolve an ingredient line to a known protocol item string.
 * - If multiple matches, we prefer the longest name match (more specific).
 * - If none match, returns null (treated as noncompliant in strict mode).
 */
export function resolveProtocolItemName(line) {
  const l = norm(line);
  if (!l) return null;

  let best = null;
  let bestLen = -1;

  for (const item of ALL_PROTOCOL_ITEMS) {
    if (!item) continue;
    if (containsWord(l, item) && item.length > bestLen) {
      best = item;
      bestLen = item.length;
    }
  }
  return best; // normalized lowercase protocol item
}

/**
 * Identify which protocol category a resolved item belongs to.
 */
export function getProtocolCategoryForItem(resolvedItemName) {
  const item = norm(resolvedItemName);
  if (!item) return null;

  for (const [cat, arr] of Object.entries(PROTOCOL_FOODS)) {
    if (Array.isArray(arr) && arr.some((x) => norm(x) === item)) return cat;
  }
  return null;
}

/**
 * Is a given ingredient line allowed for the given meal?
 */
export function isIngredientAllowedForMeal(line, mealType) {
  const resolved = resolveProtocolItemName(line);
  if (!resolved) return false;

  const allowedCats = MEAL_ALLOWED[mealType] || [];
  const blockedCats = MEAL_BLOCKED[mealType] || [];

  const cat = getProtocolCategoryForItem(resolved);
  if (!cat) return false;

  if (blockedCats.includes(cat)) return false;
  if (!allowedCats.includes(cat)) return false;

  // extra breakfast constraint: no fats/nuts/oils already blocked by category,
  // but also allow only fruits (and optionally “structured water/herbal infusions”
  // would be a beverage thing, not a recipe ingredient—handled elsewhere).
  return true;
}

/**
 * Returns true if the item is a melon listed in FRUIT_GROUPS.melons
 */
export function isMelon(lineOrResolved) {
  const resolved = resolveProtocolItemName(lineOrResolved) || norm(lineOrResolved);
  return (FRUIT_GROUPS.melons || []).some((m) => norm(m) === resolved);
}

/**
 * For breakfast fruit-pairing rules:
 * - Melons must be eaten alone (no mixing with other fruits).
 * - NEVER combine Sweet Fruits with Acid Fruits.
 * - Sweet + Subacid is OK.
 * - Acid + Subacid is OK.
 * - Same-group mixes are OK.
 */
export function analyzeBreakfastFruitPairing(ingredientLines) {
  const fruits = ingredientLines
    .map((l) => resolveProtocolItemName(l))
    .filter(Boolean);

  const groups = {
    sweet: new Set((FRUIT_GROUPS.sweet || []).map(norm)),
    subacid: new Set((FRUIT_GROUPS.subacid || []).map(norm)),
    acid: new Set((FRUIT_GROUPS.acid || []).map(norm)),
    melons: new Set((FRUIT_GROUPS.melons || []).map(norm)),
  };

  const present = {
    sweet: fruits.some((f) => groups.sweet.has(f)),
    subacid: fruits.some((f) => groups.subacid.has(f)),
    acid: fruits.some((f) => groups.acid.has(f)),
    melons: fruits.some((f) => groups.melons.has(f)),
  };

  const violations = [];

  if (present.melons && fruits.length > 1) {
    violations.push({
      type: "MELON_MUST_BE_SOLO",
      message: "Melons must be eaten alone (no mixing with other fruits).",
    });
  }

  if (present.sweet && present.acid) {
    violations.push({
      type: "SWEET_WITH_ACID_FORBIDDEN",
      message: "Never combine sweet fruits with acid fruits.",
    });
  }

  return {
    ok: violations.length === 0,
    fruits,
    present,
    violations,
  };
}

/**
 * Option B: Auto-remove invalid ingredients, returning a Removed summary.
 * This works for both built-in and custom recipes (same logic).
 */
export function cleanRecipeForMeal_StrictAutoRemove(recipe, mealType) {
  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
  const removed = [];

  const cleanedIngredients = ingredients
    .map((ing) => {
      const line = ingredientLine(ing);
      const resolved = resolveProtocolItemName(line);

      // 1) Unknown ingredient line is noncompliant in strict mode
      if (!resolved) {
        removed.push({
          original: line,
          removedAs: null,
          reason: "Unknown ingredient (not in protocol allowed list).",
        });
        return null;
      }

      // 2) Meal category allowance check
      const cat = getProtocolCategoryForItem(resolved);
      const allowedCats = MEAL_ALLOWED[mealType] || [];
      const blockedCats = MEAL_BLOCKED[mealType] || [];

      if (!cat || !allowedCats.includes(cat) || blockedCats.includes(cat)) {
        removed.push({
          original: line,
          removedAs: resolved,
          reason: `Not allowed for ${mealType} (${cat || "unclassified"}).`,
        });
        return null;
      }

      // keep ingredient but rewrite item to resolved canonical (optional)
      if (typeof ing === "object" && ing) {
        return Object.freeze({
          ...ing,
          item: ing.item ? ing.item : resolved,
          _resolved: resolved,
          _protocolCategory: cat,
        });
      }

      return Object.freeze({
        amount: null,
        item: resolved,
        raw: line || null,
        _resolved: resolved,
        _protocolCategory: cat,
      });
    })
    .filter(Boolean);

  // 3) Breakfast pairing auto-removal (if needed)
  if (mealType === MEAL.BREAKFAST) {
    const lines = cleanedIngredients.map((x) => ingredientLine(x));
    const analysis = analyzeBreakfastFruitPairing(lines);

    if (!analysis.ok) {
      // Simple, deterministic auto-remove strategy:
      // - If melon mixed with others: keep only the melon ingredients.
      // - If sweet+acid: keep the first group encountered (stable order), remove conflicting group.
      let keepSet = new Set(analysis.fruits);

      // melon solo enforcement
      if (analysis.present.melons && analysis.fruits.length > 1) {
        keepSet = new Set(
          analysis.fruits.filter((f) => (FRUIT_GROUPS.melons || []).map(norm).includes(f))
        );
      } else if (analysis.present.sweet && analysis.present.acid) {
        // keep whichever appears first in ingredient order
        const firstResolvedInOrder = analysis.fruits[0];
        const sweetSet = new Set((FRUIT_GROUPS.sweet || []).map(norm));
        const acidSet = new Set((FRUIT_GROUPS.acid || []).map(norm));

        const keepSweet = sweetSet.has(firstResolvedInOrder);
        const keepAcid = acidSet.has(firstResolvedInOrder);

        if (keepSweet) {
          keepSet = new Set(analysis.fruits.filter((f) => !acidSet.has(f)));
        } else if (keepAcid) {
          keepSet = new Set(analysis.fruits.filter((f) => !sweetSet.has(f)));
        } else {
          // fallback: keep subacid + first item
          const subacidSet = new Set((FRUIT_GROUPS.subacid || []).map(norm));
          keepSet = new Set(analysis.fruits.filter((f) => subacidSet.has(f) || f === firstResolvedInOrder));
        }
      }

      const finalIngredients = [];
      for (const ing of cleanedIngredients) {
        const resolved = ing?._resolved || resolveProtocolItemName(ingredientLine(ing));
        if (resolved && keepSet.has(norm(resolved))) {
          finalIngredients.push(ing);
        } else {
          removed.push({
            original: ingredientLine(ing),
            removedAs: resolved || null,
            reason: "Breakfast fruit pairing rule violation (auto-removed).",
          });
        }
      }

      return {
        cleanedRecipe: Object.freeze({
          ...recipe,
          ingredients: Object.freeze(finalIngredients),
          _mealType: mealType,
        }),
        removed: Object.freeze(removed),
      };
    }
  }

  return {
    cleanedRecipe: Object.freeze({
      ...recipe,
      ingredients: Object.freeze(cleanedIngredients),
      _mealType: mealType,
    }),
    removed: Object.freeze(removed),
  };
}

/**
 * Classify a recipe into breakfast/lunch/dinner based on its ingredients.
 * Strict heuristic using protocol categories (no “guessing”).
 * If it can’t be confidently classified, returns null.
 */
export function classifyRecipeMealType(recipe) {
  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
  const lines = ingredients.map(ingredientLine).filter(Boolean);

  // resolve and categorize
  const resolved = lines.map(resolveProtocolItemName).filter(Boolean);
  const cats = resolved
    .map(getProtocolCategoryForItem)
    .filter(Boolean);

  if (cats.length === 0) return null;

  const has = (cat) => cats.includes(cat);

  const hasFruit = has("fruits_sweet") || has("fruits_subacid") || has("fruits_acid") || has("melons");
  const hasComplexCarb = has("complex_carbs");
  const hasProtein =
    has("proteins_beans_legumes") || has("proteins_nuts_seeds");

  const hasLunchBlocked =
    has("oils") || has("vinegars") || has("condiments") || has("sweeteners");

  // Breakfast: fruits only (no complex carbs, no proteins, no oils/vinegars/etc)
  if (hasFruit && !hasComplexCarb && !hasProtein && !hasLunchBlocked) {
    return MEAL.BREAKFAST;
  }

  // Lunch: must include complex carb; cannot include proteins/oils/vinegars/condiments/sweeteners
  if (hasComplexCarb && !hasProtein && !hasLunchBlocked) {
    return MEAL.LUNCH;
  }

  // Dinner: must include protein base; can include oils/vinegars/condiments etc
  if (hasProtein) {
    return MEAL.DINNER;
  }

  // Otherwise unknown
  return null;
}

/**
 * For meal planning UI:
 * Given mealType + current selections, compute which ingredient options are still available.
 * This is how “choose quinoa → other complex carbs become unavailable” works.
 *
 * selections shape:
 * {
 *   chosenItems: string[]  // ingredient lines or resolved names
 * }
 */
export function computeAvailableOptionsForMeal(mealType, selections = {}) {
  const chosenItems = Array.isArray(selections.chosenItems) ? selections.chosenItems : [];
  const chosenResolved = chosenItems
    .map((x) => resolveProtocolItemName(x) || norm(x))
    .filter(Boolean);

  const allowedCats = MEAL_ALLOWED[mealType] || [];
  const blockedCats = MEAL_BLOCKED[mealType] || [];

  // Start with all allowed items
  const allowedItemsByCategory = {};
  for (const cat of allowedCats) {
    allowedItemsByCategory[cat] = (PROTOCOL_FOODS[cat] || []).map((x) => norm(x));
  }

  // Apply selection constraints
  if (mealType === MEAL.LUNCH) {
    const max = MEAL_SELECTION_CONSTRAINTS[MEAL.LUNCH]?.maxComplexCarbChoices ?? 1;
    const chosenComplex = chosenResolved.filter((x) =>
      (PROTOCOL_FOODS.complex_carbs || []).map(norm).includes(x)
    );

    if (chosenComplex.length >= max) {
      // Only keep the chosen complex carb(s) as available; others disabled.
      const keep = new Set(chosenComplex);
      allowedItemsByCategory.complex_carbs = (allowedItemsByCategory.complex_carbs || []).filter((x) =>
        keep.has(x)
      );
    }
  }

  if (mealType === MEAL.DINNER) {
    const max = MEAL_SELECTION_CONSTRAINTS[MEAL.DINNER]?.maxProteinChoices ?? 1;

    const beanProteins = (PROTOCOL_FOODS.proteins_beans_legumes || []).map(norm);
    const nutProteins = (PROTOCOL_FOODS.proteins_nuts_seeds || []).map(norm);

    const chosenProteins = chosenResolved.filter((x) => beanProteins.includes(x) || nutProteins.includes(x));

    if (chosenProteins.length >= max) {
      const keep = new Set(chosenProteins);
      allowedItemsByCategory.proteins_beans_legumes = (allowedItemsByCategory.proteins_beans_legumes || []).filter(
        (x) => keep.has(x)
      );
      allowedItemsByCategory.proteins_nuts_seeds = (allowedItemsByCategory.proteins_nuts_seeds || []).filter(
        (x) => keep.has(x)
      );
    }
  }

  // Breakfast fruit pairing constraints are handled when building the recipe (cleaner),
  // but we can still help UI by blocking sweet/acid if one is already chosen.
  if (mealType === MEAL.BREAKFAST) {
    const melonSet = new Set((FRUIT_GROUPS.melons || []).map(norm));
    const sweetSet = new Set((FRUIT_GROUPS.sweet || []).map(norm));
    const acidSet = new Set((FRUIT_GROUPS.acid || []).map(norm));

    const choseMelon = chosenResolved.some((x) => melonSet.has(x));
    const choseSweet = chosenResolved.some((x) => sweetSet.has(x));
    const choseAcid = chosenResolved.some((x) => acidSet.has(x));

    if (choseMelon) {
      // melon solo: only melons remain available
      allowedItemsByCategory.melons = (allowedItemsByCategory.melons || []).filter((x) => melonSet.has(x));
      allowedItemsByCategory.fruits_sweet = [];
      allowedItemsByCategory.fruits_subacid = [];
      allowedItemsByCategory.fruits_acid = [];
    } else {
      if (choseSweet) {
        allowedItemsByCategory.fruits_acid = []; // prevent sweet+acid
      }
      if (choseAcid) {
        allowedItemsByCategory.fruits_sweet = []; // prevent sweet+acid
      }
    }
  }

  // Remove blocked categories from output entirely (defensive)
  for (const cat of blockedCats) {
    delete allowedItemsByCategory[cat];
  }

  return Object.freeze({
    mealType,
    allowedCats: Object.freeze([...allowedCats]),
    blockedCats: Object.freeze([...blockedCats]),
    allowedItemsByCategory: Object.freeze(allowedItemsByCategory),
    chosenResolved: Object.freeze(chosenResolved),
  });
}

/**
 * Convenience: clean a recipe by inferring its meal type first.
 * If cannot classify, returns mealType=null and cleans nothing (but you can choose to treat as dinner or block it).
 */
export function inferMealAndClean_StrictAutoRemove(recipe) {
  const mealType = classifyRecipeMealType(recipe);
  if (!mealType) {
    return {
      mealType: null,
      cleanedRecipe: Object.freeze({ ...recipe, _mealType: null }),
      removed: Object.freeze([]),
    };
  }
  const { cleanedRecipe, removed } = cleanRecipeForMeal_StrictAutoRemove(recipe, mealType);
  return { mealType, cleanedRecipe, removed };
}
