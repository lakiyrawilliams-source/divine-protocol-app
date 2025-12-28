// src/App.jsx
import { LoadingCard } from './components/LoadingSpinner';
import React, { useMemo, useState } from "react";
import { RECIPE_GROUPS, BUILT_IN_RECIPES } from "./data/recipeData";

function formatMins(mins) {
  if (mins == null) return null;
  const n = Number(mins);
  if (!Number.isFinite(n)) return null;
  return `${n} min`;
}

function IngredientLine({ ing }) {
  // normalized shape: { amount: string|null, item: string|null, raw: string|null }
  const amount = ing?.amount ? String(ing.amount).trim() : "";
  const item = ing?.item ? String(ing.item).trim() : "";
  const raw = ing?.raw ? String(ing.raw).trim() : "";

  // If legacy string was preserved as raw (and item == raw), show raw once.
  if (!amount && (raw || item)) {
    return <li>{raw || item}</li>;
  }

  // Normal structured ingredient
  const text = [amount, item].filter(Boolean).join(" ");
  return <li>{text || raw}</li>;
}

export default function App() {
  const [activeGroupId, setActiveGroupId] = useState(RECIPE_GROUPS[0]?.id || "foods");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const filteredRecipes = useMemo(() => {
    const q = query.trim().toLowerCase();

    return (Array.isArray(BUILT_IN_RECIPES) ? BUILT_IN_RECIPES : [])
      .filter((r) => r && r.groupId === activeGroupId)
      .filter((r) => {
        if (!q) return true;
        const haystack = [
          r.title,
          r.categoryLabel,
          r.notes,
          ...(Array.isArray(r.tags) ? r.tags : []),
          ...(Array.isArray(r.ingredients)
            ? r.ingredients.map((i) => (i?.item || i?.raw || "")).filter(Boolean)
            : []),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      })
      .sort((a, b) => String(a.title).localeCompare(String(b.title)));
  }, [activeGroupId, query]);

  const selectedRecipe = useMemo(() => {
    if (!selectedId) return null;
    return (Array.isArray(BUILT_IN_RECIPES) ? BUILT_IN_RECIPES : []).find((r) => r.id === selectedId) || null;
  }, [selectedId]);

  // If current selection gets filtered out, clear it
  React.useEffect(() => {
    if (!selectedId) return;
    const stillVisible = filteredRecipes.some((r) => r.id === selectedId);
    if (!stillVisible) setSelectedId(null);
  }, [filteredRecipes, selectedId]);

  const styles = {
    app: {
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      padding: 16,
      maxWidth: 1100,
      margin: "0 auto",
    },
    header: { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 12 },
    tabs: { display: "flex", flexWrap: "wrap", gap: 8 },
    tabBtn: (active) => ({
      padding: "8px 12px",
      borderRadius: 999,
      border: "1px solid #ddd",
      background: active ? "#111" : "#fff",
      color: active ? "#fff" : "#111",
      cursor: "pointer",
      fontSize: 14,
    }),
    search: {
      marginLeft: "auto",
      minWidth: 240,
      flex: "1 1 240px",
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #ddd",
      fontSize: 14,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 12,
    },
    twoCol: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 12,
    },
    panel: {
      border: "1px solid #e6e6e6",
      borderRadius: 14,
      padding: 14,
      background: "#fff",
    },
    list: { display: "grid", gap: 8, margin: 0, padding: 0, listStyle: "none" },
    cardBtn: (active) => ({
      width: "100%",
      textAlign: "left",
      borderRadius: 12,
      border: active ? "1px solid #111" : "1px solid #e6e6e6",
      background: active ? "#f7f7f7" : "#fff",
      padding: 12,
      cursor: "pointer",
    }),
    titleRow: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" },
    title: { fontSize: 16, fontWeight: 700, margin: 0 },
    meta: { fontSize: 12, color: "#555" },
    h2: { margin: "0 0 8px", fontSize: 18 },
    pill: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 999,
      border: "1px solid #e6e6e6",
      fontSize: 12,
      color: "#333",
      marginRight: 6,
      marginBottom: 6,
    },
    muted: { color: "#666", fontSize: 14, margin: 0 },
    section: { marginTop: 12 },
    ol: { margin: "8px 0 0 18px" },
    ul: { margin: "8px 0 0 18px" },
  };

  // Simple responsive: switch to 2 columns on wider screens
  const isWide = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(min-width: 900px)").matches;

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={styles.tabs}>
          {RECIPE_GROUPS.map((g) => (
            <button
              key={g.id}
              style={styles.tabBtn(activeGroupId === g.id)}
              onClick={() => {
                setActiveGroupId(g.id);
                setSelectedId(null);
              }}
              type="button"
            >
              {g.label}
            </button>
          ))}
        </div>

        <input
          style={styles.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes, ingredients, tags…"
          aria-label="Search recipes"
        />
      </div>

      <div style={isWide ? styles.twoCol : styles.grid}>
        {/* LIST */}
        <div style={styles.panel}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <h2 style={styles.h2}>Recipes</h2>
            <div style={styles.meta}>{filteredRecipes.length} found</div>
          </div>

          {filteredRecipes.length === 0 ? (
            <p style={styles.muted}>No recipes match your search in this category.</p>
          ) : (
            <ul style={styles.list}>
              {filteredRecipes.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    style={styles.cardBtn(selectedId === r.id)}
                    onClick={() => setSelectedId(r.id)}
                  >
                    <div style={styles.titleRow}>
                      <p style={styles.title}>{r.title}</p>
                      <span style={styles.meta}>{r.categoryLabel}</span>
                    </div>

                    <div style={{ marginTop: 6 }}>
                      {r.protocolStrict ? <span style={styles.pill}>Protocol Strict</span> : null}
                      {r.servings ? <span style={styles.pill}>{r.servings} serving{r.servings === 1 ? "" : "s"}</span> : null}
                      {r.prep?.prepTimeMins != null ? <span style={styles.pill}>Prep {formatMins(r.prep.prepTimeMins)}</span> : null}
                      {r.prep?.cookTimeMins != null ? <span style={styles.pill}>Cook {formatMins(r.prep.cookTimeMins)}</span> : null}
                      {Array.isArray(r.tags) && r.tags.length ? <span style={styles.pill}>{r.tags[0]}</span> : null}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* DETAIL */}
        <div style={styles.panel}>
          {!selectedRecipe ? (
            <p style={styles.muted}>Select a recipe to view details.</p>
          ) : (
            <>
              <h2 style={styles.h2}>{selectedRecipe.title}</h2>

              <div style={{ marginBottom: 8 }}>
                <span style={styles.pill}>{selectedRecipe.categoryLabel}</span>
                {selectedRecipe.protocolStrict ? <span style={styles.pill}>Protocol Strict</span> : null}
                {selectedRecipe.servings ? (
                  <span style={styles.pill}>
                    {selectedRecipe.servings} serving{selectedRecipe.servings === 1 ? "" : "s"}
                  </span>
                ) : null}
                {selectedRecipe.prep?.prepTimeMins != null ? (
                  <span style={styles.pill}>Prep {formatMins(selectedRecipe.prep.prepTimeMins)}</span>
                ) : null}
                {selectedRecipe.prep?.cookTimeMins != null ? (
                  <span style={styles.pill}>Cook {formatMins(selectedRecipe.prep.cookTimeMins)}</span>
                ) : null}
              </div>

              {Array.isArray(selectedRecipe.tags) && selectedRecipe.tags.length ? (
                <div style={{ marginBottom: 8 }}>
                  {selectedRecipe.tags.map((t) => (
                    <span key={t} style={styles.pill}>
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div style={styles.section}>
                <h3 style={{ margin: "0 0 6px", fontSize: 14 }}>Ingredients</h3>
                {Array.isArray(selectedRecipe.ingredients) && selectedRecipe.ingredients.length ? (
                  <ul style={styles.ul}>
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <IngredientLine key={`${selectedRecipe.id}-ing-${idx}`} ing={ing} />
                    ))}
                  </ul>
                ) : (
                  <p style={styles.muted}>No ingredients listed.</p>
                )}
              </div>

              <div style={styles.section}>
                <h3 style={{ margin: "0 0 6px", fontSize: 14 }}>Steps</h3>
                {Array.isArray(selectedRecipe.steps) && selectedRecipe.steps.length ? (
                  <ol style={styles.ol}>
                    {selectedRecipe.steps.map((step, idx) => (
                      <li key={`${selectedRecipe.id}-step-${idx}`}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p style={styles.muted}>No steps listed.</p>
                )}
              </div>

              {selectedRecipe.notes ? (
                <div style={styles.section}>
                  <h3 style={{ margin: "0 0 6px", fontSize: 14 }}>Notes</h3>
                  <p style={{ margin: 0, color: "#333", fontSize: 14, lineHeight: 1.4 }}>{selectedRecipe.notes}</p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Tiny footer sanity check */}
      <div style={{ marginTop: 12, color: "#777", fontSize: 12 }}>
        Data source: <code>BUILT_IN_RECIPES</code> (normalized)
      </div>
    </div>
  );
}
