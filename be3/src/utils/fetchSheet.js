import Papa from "papaparse";

export async function fetchSheet() {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuiciaYMWtSJtw3Z-Pv99DDnD4rbklFRAsVgPrE-0vwR_TzKHu3NSxe-YNZJ-B1V9aZWDVUD1RLInu/pub?output=csv";

  const res = await fetch(url);
  const csv = await res.text();

  const { data } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });

  return data;
}
