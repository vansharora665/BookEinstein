// src/utils/fetchSheet.js
export async function fetchSheet() {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuiciaYMWtSJtw3Z-Pv99DDnD4rbklFRAsVgPrE-0vwR_TzKHu3NSxe-YNZJ-B1V9aZWDVUD1RLInu/pub?output=csv";

  const res = await fetch(url);
  const csv = await res.text();

  const lines = csv.split("\n").filter(Boolean);
  const headers = lines[0].split(",").map((h) => h.trim());

  const rows = lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i]?.replace(/^"|"$/g, "").trim() || "";
    });
    return obj;
  });

  return rows;
}
