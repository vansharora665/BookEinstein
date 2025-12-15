// src/utils/fetchSheets.js
import Papa from "papaparse";

/**
 * Fetch a published Google Sheet CSV URL and parse it to rows (objects).
 * @param {string} url - https://docs.google.com/spreadsheets/d/e/2PACX-1vTuiciaYMWtSJtw3Z-Pv99DDnD4rbklFRAsVgPrE-0vwR_TzKHu3NSxe-YNZJ-B1V9aZWDVUD1RLInu/pub?output=csv
 * @returns {Promise<Array<Object>>} rows
 */
export async function fetchPublishedSheetCsv(url) {
  if (!url) throw new Error("No sheet URL provided to fetchPublishedSheetCsv");

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch sheet: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,         // first row are column names
      skipEmptyLines: true,
      transformHeader: (h) => (h || "").trim(),
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });
}
