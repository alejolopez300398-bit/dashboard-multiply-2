function cleanKey(str) {
  return (str || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "");
}

export function normalizeSheet(rows) {

  // fila 5 = headers reales
  const headers = rows[4].map(cleanKey);

  // fila 8 en adelante = datos
  return rows.slice(7).map(row => {
    const obj = {};

    headers.forEach((header, i) => {
      obj[header] = row[i];
    });

    return obj;
  });
}