function cleanKey(str) {
  return (str || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
}

export function normalizeSheet(rows) {

  // encontrar fila que contiene "codigo"
  const headerIndex = rows.findIndex(row =>
    row.some(cell =>
      (cell || "").toLowerCase().includes("codigo")
    )
  );

  const headers = rows[headerIndex].map(cleanKey);

  return rows.slice(headerIndex + 1).map(row => {
    const obj = {};

    headers.forEach((header, i) => {
      obj[header] = row[i];
    });

    return obj;
  });
}