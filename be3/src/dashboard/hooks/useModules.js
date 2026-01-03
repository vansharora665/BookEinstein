import { useEffect, useState } from "react";
import { fetchSheet } from "../../utils/fetchSheet";
import { mapRowsToModules } from "../../utils/mapSheetToModules";

export function useModules() {
  const [modules, setModules] = useState(null); // null = loading

  useEffect(() => {
    async function loadModules() {
      try {
        const rows = await fetchSheet();

        if (!Array.isArray(rows)) {
          console.error("❌ Sheet rows is not an array", rows);
          setModules([]);
          return;
        }

        const mapped = mapRowsToModules(rows);

        if (!Array.isArray(mapped)) {
          console.error("❌ mapRowsToModules did not return array", mapped);
          setModules([]);
          return;
        }

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
