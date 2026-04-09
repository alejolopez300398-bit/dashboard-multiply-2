function cleanKey(str) {
  return (str || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
}

export function normalizeSheet(rows) {

  const headerIndex = rows.findIndex(row =>
    row.some(cell =>
      (cell || "").toLowerCase().includes("codigo")
    )
  );

  const headers = rows[headerIndex].map(cleanKey);

  return rows.slice(headerIndex + 1).map(row => {

    const paddedRow = [...row];

    while (paddedRow.length < headers.length) {
      paddedRow.push("");
    }

    const obj = {};

    headers.forEach((header, i) => {
      obj[header] = paddedRow[i];
    });

    return obj;
  });

}