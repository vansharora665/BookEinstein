export async function fetchSheet(sheetId, gid = "0") {
  const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTuiciaYMWtSJtw3Z-Pv99DDnD4rbklFRAsVgPrE-0vwR_TzKHu3NSxe-YNZJ-B1V9aZWDVUD1RLInu/pub?output=csv`;

  const res = await fetch(url);
  const text = await res.text();

  // 🔥 Google adds JS wrapper — must strip it
  const json = JSON.parse(text.substring(47).slice(0, -2));

  const cols = json.table.cols.map(c => c.label);

  const rows = json.table.rows.map(r => {
    const obj = {};
    r.c.forEach((cell, i) => {
      obj[cols[i]] = cell ? cell.v : "";
    });
    return obj;
  });

  return rows;
}
