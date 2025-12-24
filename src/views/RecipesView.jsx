import React, { useEffect, useMemo, useState } from "react";
import { BUILT_IN_RECIPES, RECIPE_GROUPS } from "../data/recipeData";

const grouped = useMemo(() => {
  const buckets = new Map(RECIPE_GROUPS.map((g) => [g.id, []]));

  for (const r of allRecipes) {
    const gid = r.groupId || "foods"; // safe fallback
    if (!buckets.has(gid)) buckets.set(gid, []);
    buckets.get(gid).push(r);
  }

  // return same shape your UI expects: groups with recipes
  return RECIPE_GROUPS.map((g) => ({
    ...g,
    recipes: buckets.get(g.id) || [],
  }));
}, [allRecipes]);



 
import {
  Search,
  X,
  Plus,
  Image as ImageIcon,
  Star,
  FileDown,
  Leaf,
  Droplets,
  Utensils,
} from "lucide-react";

// -----------------------------
// LocalStorage Keys
// -----------------------------
const LS_CUSTOM = "dp_customRecipes";
const LS_META = "dp_recipeMeta"; // ratings + notes keyed by recipeId

const TYPE_LABELS = {
  food: "Foods",
  juice: "Juices",
  "infused-water": "Infused Waters",
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix = "recipe") {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className="transition hover:scale-110"
          aria-label={`Rate ${s} stars`}
        >
          <Star
            size={18}
            className={value >= s ? "text-yellow-300 fill-yellow-300" : "text-gray-300"}
          />
        </button>
      ))}
    </div>
  );
}

function Badge({ children, tone = "emerald" }) {
  const toneMap = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    teal: "bg-teal-50 text-teal-700 border-teal-100",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    gray: "bg-gray-50 text-gray-700 border-gray-100",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${toneMap[tone] || toneMap.gray}`}>
      {children}
    </span>
  );
}

function RecipeIcon({ type }) {
  if (type === "juice") return <Droplets size={18} className="text-cyan-700" />;
  if (type === "infused-water") return <Droplets size={18} className="text-teal-700" />;
  return <Utensils size={18} className="text-emerald-700" />;
}

function Section({ title, items }) {
  if (!items || !items.length) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <ul className="mt-2 space-y-2 text-sm text-gray-700">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-gray-300">•</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IngredientList({ ingredients }) {
  if (!ingredients?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h4 className="font-semibold text-gray-800">Ingredients</h4>
      <div className="mt-2 space-y-2 text-sm text-gray-700">
{(ingredients ?? []).map((ing, i) => (
          <div key={i} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-gray-800 truncate">{ing.name}</div>
              {ing.category ? (
                <div className="text-xs text-gray-500 mt-0.5">Category: {ing.category}</div>
              ) : null}
            </div>
            <div className="text-sm text-gray-600 whitespace-nowrap">{ing.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecipeModal({
  recipe,
  meta,
  onClose,
  onUpdateMeta,
  onDeleteCustom,
}) {
  if (!recipe) return null;

  const typeLabel = recipe.type === "custom" ? "Custom" : (TYPE_LABELS[recipe.type] || recipe.type);

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close recipe"
      />
      {/* modal */}
      <div className="absolute inset-x-0 bottom-0 max-w-lg mx-auto bg-white rounded-t-3xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <RecipeIcon type={recipe.type === "custom" ? "food" : recipe.type} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{recipe.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge tone="emerald">{typeLabel}</Badge>
                  {recipe.meal ? <Badge tone="teal">{recipe.meal}</Badge> : null}
                  {recipe.requiresExactFruits ? (
                    <Badge tone="cyan">{recipe.requiresExactFruits} fruit rule</Badge>
                  ) : null}
                </div>
              </div>
            </div>

            {recipe.photoDataUrl ? (
              <div className="mt-3">
                <img
                  src={recipe.photoDataUrl}
                  alt="Recipe"
                  className="w-full max-h-56 object-cover rounded-xl border border-gray-100"
                />
              </div>
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[70vh] overflow-auto">
          {/* Rating + Notes */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-800">Rate + Notes</div>
              <StarRating
                value={meta?.rating || 0}
                onChange={(rating) => onUpdateMeta({ ...meta, rating })}
              />
            </div>
            <textarea
              value={meta?.notes || ""}
              onChange={(e) => onUpdateMeta({ ...meta, notes: e.target.value })}
              placeholder="Notes (what you liked, tweaks, how it made you feel, etc.)"
              className="mt-3 w-full min-h-[90px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <div className="text-xs text-gray-500 mt-2">
              Saved automatically on change.
            </div>
          </div>

          {/* Protocol timing rules (if present) */}
          {recipe.timingRules ? (
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
              <div className="font-semibold text-amber-900 flex items-center gap-2">
                <Leaf size={16} />
                Timing Rules
              </div>
              <div className="text-sm text-amber-800 mt-2 space-y-1">
                {typeof recipe.timingRules.awayFromMealsHours === "number" ? (
                  <div>• Keep {recipe.timingRules.awayFromMealsHours} hours away from meals (unless substituting).</div>
                ) : null}
                {recipe.timingRules.mustBeAlone ? <div>• Must be consumed alone.</div> : null}
              </div>
            </div>
          ) : null}

          {/* Ingredients */}
          <IngredientList ingredients={ingredients ?? []} />


          {/* Sections */}
          <Section title="Prep" items={recipe.prep} />
          <Section title="Cook" items={recipe.cook} />
          <Section title="Juice" items={recipe.juice} />
          <Section title="Infuse" items={recipe.infuse} />

          {/* Notes */}
          {recipe.notes ? (
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h4 className="font-semibold text-gray-800">Protocol Notes</h4>
              <p className="text-sm text-gray-700 mt-2">{recipe.notes}</p>
            </div>
          ) : null}

          {/* Delete (custom only) */}
          {recipe.type === "custom" ? (
            <button
              onClick={() => onDeleteCustom(recipe.id)}
              className="w-full py-3 rounded-xl bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition font-semibold"
            >
              Delete Custom Recipe
            </button>
          ) : null}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function RecipeCard({ recipe, rating, notes, onOpen }) {
  const typeLabel = recipe.type === "custom" ? "Custom" : (TYPE_LABELS[recipe.type] || recipe.type);

  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 p-4 hover:border-emerald-200 hover:shadow-sm transition"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
          <RecipeIcon type={recipe.type === "custom" ? "food" : recipe.type} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-gray-900 truncate">{recipe.title}</h3>
            {rating ? (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Star size={14} className="text-yellow-300 fill-yellow-300" />
                <span>{rating}</span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge tone="emerald">{typeLabel}</Badge>
            {recipe.meal ? <Badge tone="teal">{recipe.meal}</Badge> : null}
            {recipe.requiresExactFruits ? (
              <Badge tone="cyan">{recipe.requiresExactFruits} fruit rule</Badge>
            ) : null}
          </div>

          {notes ? (
            <div className="text-xs text-gray-500 mt-2 line-clamp-2">
              {notes}
            </div>
          ) : (
            <div className="text-xs text-gray-400 mt-2">
              Tap to view full recipe, prep + cook steps
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function RecipesView() {
  const [activeFilter, setActiveFilter] = useState("all"); // all | food | juice | infused-water | custom
  const [query, setQuery] = useState("");
  const [customRecipes, setCustomRecipes] = useState(() => loadJSON(LS_CUSTOM, []));
  const [meta, setMeta] = useState(() => loadJSON(LS_META, {}));
  const [selectedId, setSelectedId] = useState(null);

  // create custom modal state
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("food"); // food | juice | infused-water
  const [newMeal, setNewMeal] = useState("dinner"); // for food only
  const [newNotes, setNewNotes] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState("");

  useEffect(() => saveJSON(LS_CUSTOM, customRecipes), [customRecipes]);
  useEffect(() => saveJSON(LS_META, meta), [meta]);

  const allRecipes = useMemo(() => {
    const normalizedCustom = customRecipes.map((r) => ({ ...r, type: "custom" }));
    return [...BUILT_IN_RECIPES, ...normalizedCustom];
  }, [customRecipes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allRecipes
      .filter((r) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "custom") return r.type === "custom";
        // built-in types
        return r.type === activeFilter;
      })
      .filter((r) => {
        if (!q) return true;
        const hay = `${r.title} ${(r.meal || "")} ${(r.type || "")}`.toLowerCase();
        return hay.includes(q);
      });
  }, [allRecipes, activeFilter, query]);

  const selectedRecipe = useMemo(
    () => allRecipes.find((r) => r.id === selectedId) || null,
    [allRecipes, selectedId]
  );

  const selectedMeta = useMemo(() => {
    if (!selectedRecipe) return null;
    return meta[selectedRecipe.id] || { rating: 0, notes: "" };
  }, [meta, selectedRecipe]);

  const updateSelectedMeta = (nextMeta) => {
    if (!selectedRecipe) return;
    setMeta((prev) => ({ ...prev, [selectedRecipe.id]: nextMeta }));
  };

  const deleteCustom = (id) => {
    setCustomRecipes((prev) => prev.filter((r) => r.id !== id));
    setSelectedId(null);
  };

  const resetCreate = () => {
    setNewTitle("");
    setNewType("food");
    setNewMeal("dinner");
    setNewNotes("");
    setPhotoDataUrl("");
  };

  const handleCreate = () => {
    const title = newTitle.trim();
    if (!title) return;

    const base = {
      id: uid("custom"),
      title,
      protocolAligned: true,
      servings: 1,
      photoDataUrl: photoDataUrl || "",
      notes: newNotes || "",
      // optional fields in same schema
      ingredients: [],
      prep: [],
      cook: [],
      juice: [],
      infuse: [],
      timingRules: null,
    };

    const created =
      newType === "food"
        ? { ...base, meal: newMeal, customType: "food" }
        : newType === "juice"
        ? {
            ...base,
            customType: "juice",
            requiresExactFruits: 3,
            timingRules: { awayFromMealsHours: 3, canSubstituteMeal: true },
          }
        : { ...base, customType: "infused-water" };

    setCustomRecipes((prev) => [created, ...prev]);
    setShowCreate(false);
    resetCreate();
  };

  const handlePhoto = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 rounded-3xl shadow-2xl p-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-28 h-28 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 right-4 w-24 h-24 bg-teal-300 rounded-full blur-2xl"></div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-light text-white tracking-wide">Recipes</h2>
              <p className="text-emerald-200 text-sm mt-1">
                Foods • Juices • Infused Waters • Custom
              </p>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 rounded-2xl bg-white/10 text-white border border-white/20 hover:bg-white/15 transition flex items-center gap-2"
            >
              <Plus size={18} />
              <span className="text-sm font-semibold">Add</span>
            </button>
          </div>

          {/* Search */}
          <div className="mt-4 bg-white/10 border border-white/15 rounded-2xl px-3 py-2 flex items-center gap-2">
            <Search size={18} className="text-white/70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full bg-transparent text-white placeholder:text-white/60 outline-none text-sm"
            />
          </div>

          {/* Filter pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { id: "all", label: "All" },
              { id: "food", label: "Foods" },
              { id: "juice", label: "Juices" },
              { id: "infused-water", label: "Infused Waters" },
              { id: "custom", label: "Custom" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-2 rounded-full text-sm font-semibold transition border ${
                  activeFilter === f.id
                    ? "bg-white text-emerald-900 border-white"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/15"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <div className="text-3xl">🌿</div>
            <div className="mt-2 font-semibold text-gray-800">No matches</div>
            <div className="mt-1 text-sm text-gray-500">
              Try a different search or filter.
            </div>
          </div>
        ) : (
          filtered.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              rating={(meta[r.id]?.rating) || 0}
              notes={(meta[r.id]?.notes) || ""}
              onOpen={() => setSelectedId(r.id)}
            />
          ))
        )}
      </div>

      {/* Detail Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        meta={selectedMeta}
        onClose={() => setSelectedId(null)}
        onUpdateMeta={updateSelectedMeta}
        onDeleteCustom={deleteCustom}
      />

      {/* Create Modal */}
      {showCreate ? (
        <div className="fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowCreate(false);
              resetCreate();
            }}
            aria-label="Close create"
          />
          <div className="absolute inset-x-0 bottom-0 max-w-lg mx-auto bg-white rounded-t-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900">Add a Recipe</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Manual input + optional photo upload (formatting from photo can be added later).
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreate(false);
                  resetCreate();
                }}
                className="p-2 rounded-xl hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[70vh] overflow-auto">
              {/* Title */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <label className="text-sm font-semibold text-gray-800">Title</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Lentils + Zucchini Bowl"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>

              {/* Type */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <label className="text-sm font-semibold text-gray-800">Category</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { id: "food", label: "Food" },
                    { id: "juice", label: "Juice" },
                    { id: "infused-water", label: "Infused Water" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setNewType(t.id)}
                      className={`py-3 rounded-xl border font-semibold text-sm transition ${
                        newType === t.id
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {newType === "food" ? (
                  <div className="mt-3">
                    <label className="text-sm font-semibold text-gray-800">Meal</label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {["breakfast", "lunch", "dinner"].map((m) => (
                        <button
                          key={m}
                          onClick={() => setNewMeal(m)}
                          className={`py-3 rounded-xl border font-semibold text-sm transition ${
                            newMeal === m
                              ? "bg-teal-500 text-white border-teal-500"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {newType === "juice" ? (
                  <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">
                    • Default juice rule: <strong>3 fruits</strong> <br />
                    • Keep <strong>3 hours away from meals</strong> unless substituting.
                  </div>
                ) : null}
              </div>

              {/* Photo */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <label className="text-sm font-semibold text-gray-800">Photo (optional)</label>
                <div className="mt-2 flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-sm cursor-pointer hover:bg-gray-100 transition">
                    <ImageIcon size={18} />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhoto(e.target.files?.[0])}
                    />
                  </label>

                  {photoDataUrl ? (
                    <button
                      onClick={() => setPhotoDataUrl("")}
                      className="text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                {photoDataUrl ? (
                  <img
                    src={photoDataUrl}
                    alt="Preview"
                    className="mt-3 w-full max-h-56 object-cover rounded-xl border border-gray-100"
                  />
                ) : null}

                <div className="text-xs text-gray-500 mt-2">
                  Later we can add “Turn photo into formatted recipe” without changing your saved data.
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <label className="text-sm font-semibold text-gray-800">Notes (optional)</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Any prep notes, substitutions (if allowed), or reminders..."
                  className="mt-2 w-full min-h-[90px] rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleCreate}
                className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
              >
                Save Recipe
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
