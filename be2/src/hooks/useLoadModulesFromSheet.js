// src/hooks/useLoadModulesFromSheet.js
import { useState, useEffect, useCallback } from "react";
import { fetchPublishedSheetCsv } from "../utils/fetchSheets";
import { mapRowsToModules } from "../utils/mapSheetToModules";

/**
 * Hook to load modules from a Google Sheets CSV export URL.
 * @param {string} sheetCsvUrl - https://docs.google.com/spreadsheets/d/e/2PACX-1vTuiciaYMWtSJtw3Z-Pv99DDnD4rbklFRAsVgPrE-0vwR_TzKHu3NSxe-YNZJ-B1V9aZWDVUD1RLInu/pub?output=csv
 */
export function useLoadModulesFromSheet(sheetCsvUrl) {
  const [modules, setModules] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
  if (!sheetCsvUrl) {
    setError(new Error("No sheetCsvUrl provided"));
    setModules([]);
    return;
  }
  setLoading(true);
  setError(null);
  try {
    console.info("[sheet] fetching CSV from:", sheetCsvUrl);
    const rows = await fetchPublishedSheetCsv(sheetCsvUrl);
    console.info("[sheet] raw rows count:", Array.isArray(rows) ? rows.length : typeof rows);
    console.debug("[sheet] sample row 0:", rows && rows[0] ? rows[0] : null);
    const modulesData = mapRowsToModules(rows);
    console.info("[sheet] mapped modules count:", Array.isArray(modulesData) ? modulesData.length : typeof modulesData);
    console.debug("[sheet] mapped modules sample:", modulesData && modulesData[0] ? modulesData[0] : null);
    setModules(modulesData || []);
  } catch (err) {
    console.error("Error loading sheet:", err);
    setError(err);
    setModules([]);
  } finally {
    setLoading(false);
  }
}, [sheetCsvUrl]);

  useEffect(() => {
    load();
  }, [load]);

  return { modules, loading, error, refresh: load };
}
