function cleanKey(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "");
}

export function normalizeSheet(rows) {

  // usar fila 3 como headers reales
  const headers = rows[2].map(cleanKey);

  // datos empiezan desde fila 4
  return rows.slice(3).map(row => {
    const obj = {};

    headers.forEach((header, i) => {
      obj[header] = row[i];
    });

    return obj;
  });
}