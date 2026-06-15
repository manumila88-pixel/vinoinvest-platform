/**
 * useUserPrefs — central hook for all user display/personalization preferences.
 *
 * Stores in localStorage with optional backend sync when logged in.
 * The user controls WHAT to see, never the underlying data values.
 *
 * Keys:
 *   vino_display_prefs_v1   → column visibility + dashboard section order/visibility
 *   vino_wine_notes_v1      → { [wineId]: "note text" }
 *   vino_saved_filters_v1   → [{ id, name, filters }]
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const DISPLAY_KEY  = "vino_display_prefs_v1";
const NOTES_KEY    = "vino_wine_notes_v1";
const FILTERS_KEY  = "vino_saved_filters_v1";
const API          = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

// Default column set — all visible by default
export const DEFAULT_COLUMNS = {
  badges:   true,   // risk + marketTrend badges
  aiScore:  true,   // AI Score bar + signal
  price:    true,   // price + source badge
  region:   false,  // region tag under producer line (off by default = compact)
  alert:    true,   // price alert input row
  links:    true,   // Wine-Searcher / Vivino / Compare footer
};

// Default dashboard sections — order matters, all visible by default
export const DEFAULT_SECTIONS = [
  { id: "dashboard",    label: "🏠 Dashboard",       visible: true },
  { id: "market",       label: "🔍 Mercato",          visible: true },
  { id: "myportfolio",  label: "📦 Portfolio",        visible: true },
  { id: "portfolio",    label: "🤖 Portfolio AI",     visible: true },
  { id: "academy",      label: "🎓 Academy",          visible: true },
  { id: "cellar",       label: "🍾 Cantina",          visible: true },
  { id: "journal",      label: "📓 Diario",           visible: true },
  { id: "goals",        label: "🎯 Obiettivi",        visible: true },
];

function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}
function writeLocal(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export function useUserPrefs() {
  const [columns, setColumnsState] = useState(() => ({
    ...DEFAULT_COLUMNS,
    ...(readLocal(DISPLAY_KEY, {}).columns || {}),
  }));

  const [sections, setSectionsState] = useState(() => {
    const saved = readLocal(DISPLAY_KEY, {}).sections;
    if (!saved) return DEFAULT_SECTIONS;
    // Merge saved order+visibility with DEFAULT_SECTIONS (add new ones at end)
    const savedIds = new Set(saved.map(s => s.id));
    const newDefaults = DEFAULT_SECTIONS.filter(s => !savedIds.has(s.id));
    return [...saved.map(s => ({ ...DEFAULT_SECTIONS.find(d => d.id === s.id) || s, ...s })), ...newDefaults];
  });

  const [notes, setNotesState] = useState(() => readLocal(NOTES_KEY, {}));
  const [savedFilters, setSavedFiltersState] = useState(() => readLocal(FILTERS_KEY, []));

  const syncTimerRef = useRef(null);

  // Persist display prefs locally + sync to backend (debounced)
  const persistDisplay = useCallback((cols, secs) => {
    const payload = { columns: cols, sections: secs };
    writeLocal(DISPLAY_KEY, payload);
    // Debounced backend sync
    clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        fetch(`${API}/api/user-prefs`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ display_prefs: payload }),
        }).catch(() => {});
      } catch {}
    }, 1500);
  }, []);

  // Load from backend on mount (if logged in), overrides localStorage
  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch(`${API}/api/user-prefs`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.display_prefs?.columns) {
          setColumnsState(c => ({ ...c, ...data.display_prefs.columns }));
        }
        if (data.display_prefs?.sections) {
          setSectionsState(data.display_prefs.sections);
        }
        if (data.wine_notes) setNotesState(data.wine_notes);
        if (data.saved_filters) setSavedFiltersState(data.saved_filters);
      } catch {}
    })();
  }, []);

  const setColumns = useCallback((updater) => {
    setColumnsState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persistDisplay(next, sections);
      return next;
    });
  }, [sections, persistDisplay]);

  const toggleColumn = useCallback((key) => {
    setColumns(prev => ({ ...prev, [key]: !prev[key] }));
  }, [setColumns]);

  const setSections = useCallback((updater) => {
    setSectionsState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persistDisplay(columns, next);
      return next;
    });
  }, [columns, persistDisplay]);

  const toggleSection = useCallback((id) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  }, [setSections]);

  const moveSectionUp = useCallback((id) => {
    setSections(prev => {
      const i = prev.findIndex(s => s.id === id);
      if (i <= 0) return prev;
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }, [setSections]);

  const moveSectionDown = useCallback((id) => {
    setSections(prev => {
      const i = prev.findIndex(s => s.id === id);
      if (i < 0 || i >= prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  }, [setSections]);

  // Wine notes
  const setNote = useCallback((wineId, text) => {
    setNotesState(prev => {
      const next = text.trim() ? { ...prev, [wineId]: text } : (() => { const c = { ...prev }; delete c[wineId]; return c; })();
      writeLocal(NOTES_KEY, next);
      // Sync notes to backend (debounced)
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;
          fetch(`${API}/api/user-prefs`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
            body: JSON.stringify({ wine_notes: next }),
          }).catch(() => {});
        } catch {}
      }, 1000);
      return next;
    });
  }, []);

  // Saved filters
  const saveFilter = useCallback((name, filters) => {
    const id = `filter_${Date.now()}`;
    setSavedFiltersState(prev => {
      const next = [...prev, { id, name, filters, savedAt: Date.now() }];
      writeLocal(FILTERS_KEY, next);
      return next;
    });
  }, []);

  const deleteFilter = useCallback((id) => {
    setSavedFiltersState(prev => {
      const next = prev.filter(f => f.id !== id);
      writeLocal(FILTERS_KEY, next);
      return next;
    });
  }, []);

  const resetAllPrefs = useCallback(() => {
    setColumnsState(DEFAULT_COLUMNS);
    setSectionsState(DEFAULT_SECTIONS);
    writeLocal(DISPLAY_KEY, { columns: DEFAULT_COLUMNS, sections: DEFAULT_SECTIONS });
  }, []);

  return {
    columns, toggleColumn,
    sections, toggleSection, moveSectionUp, moveSectionDown,
    notes, setNote,
    savedFilters, saveFilter, deleteFilter,
    resetAllPrefs,
  };
}
