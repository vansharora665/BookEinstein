import { useEffect, useState } from "react";
import { fetchSheet } from "../../utils/fetchSheet";
import { mapRowsToModules } from "../../utils/mapSheetToModules";

// TEMP: fallback row so dashboard NEVER breaks
const FALLBACK_ROWS = [
  {
    "Module ID": "fallback",
    "Module Title": "Loading Module",
    "Topic Title": "Initializing",
  },
];

const SHEET_ID = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuiciaYMWtSJtw3Z-Pv99DDnD4rbklFRAsVgPrE-0vwR_TzKHu3NSxe-YNZJ-B1V9aZWDVUD1RLInu/pub?output=csv";
const GID = "0";

export function useModules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        console.log("Fetching sheet…");
        const rows = await fetchSheet(SHEET_ID, GID);
        console.log("Rows fetched:", rows);

        const mapped = mapRowsToModules(rows);
        console.log("Mapped modules:", mapped);

        if (mapped.length === 0) {
          console.warn("Mapper returned empty, using fallback");
          setModules(mapRowsToModules(FALLBACK_ROWS));
        } else {
          setModules(mapped);
        }
      } catch (e) {
        console.error("Sheet load failed:", e);
        setModules(mapRowsToModules(FALLBACK_ROWS));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return loading ? [] : modules;
}
