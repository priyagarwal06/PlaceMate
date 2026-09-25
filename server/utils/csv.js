// Converts an array of flat objects into a CSV string.
// columns: [{ key: 'name', label: 'Name' }, ...]
export const toCSV = (rows, columns) => {
  const header = columns.map((c) => c.label).join(',');

  const escapeCell = (value) => {
    if (value === undefined || value === null) return '';
    const str = String(value);
    // Wrap in quotes if it contains a comma, quote, or newline
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = rows.map((row) => columns.map((c) => escapeCell(row[c.key])).join(','));

  return [header, ...lines].join('\n');
};
