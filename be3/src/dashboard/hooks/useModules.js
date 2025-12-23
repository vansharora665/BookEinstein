import { useEffect, useState } from "react";
import { fetchSheet } from "../../utils/fetchSheet";
import { mapRowsToModules } from "../../utils/mapSheetToModules";

export function useModules() {
  const [modules, setModules] = useState(null); // 🔑 null = not loaded yet

  useEffect(() => {
    async function loadModules() {
      try {
        console.log("📥 Fetching Excel sheet…");

        const rows = await fetchSheet();
        console.log("📄 Rows fetched:", rows.length);

        const mapped = mapRowsToModules(rows);
        console.log("📦 Modules mapped:", mapped.length);

        setModules(mapped);
      } catch (err) {
        console.error("❌ Failed to load modules:", err);
        setModules([]); // fail-safe
      }
    }

    loadModules();
  }, []);

  return modules;
}
