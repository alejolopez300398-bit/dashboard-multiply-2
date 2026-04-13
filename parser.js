// modules/parser.js

function cleanKey(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "");
}

export function normalizeSheet(rows) {
  const headers = rows[0].map(cleanKey);

  return rows.slice(1).map(row => {
    const obj = {};

    headers.forEach((header, i) => {
      obj[header] = row[i];
    });

    return obj;
  });
}