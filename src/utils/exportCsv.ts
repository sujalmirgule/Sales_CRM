export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; header: string; transform?: (val: any) => string }[]
) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  let headers: string[] = [];
  let rows: string[][] = [];

  if (columns && columns.length > 0) {
    headers = columns.map((c) => `"${c.header.replace(/"/g, '""')}"`);
    rows = data.map((item) =>
      columns.map((c) => {
        const val = item[c.key];
        const formatted = c.transform ? c.transform(val) : val != null ? String(val) : '';
        return `"${formatted.replace(/"/g, '""')}"`;
      })
    );
  } else {
    const keys = Object.keys(data[0]) as (keyof T)[];
    headers = keys.map((k) => `"${String(k).replace(/"/g, '""')}"`);
    rows = data.map((item) =>
      keys.map((k) => {
        const val = item[k];
        const formatted = typeof val === 'object' && val !== null ? JSON.stringify(val) : val != null ? String(val) : '';
        return `"${formatted.replace(/"/g, '""')}"`;
      })
    );
  }

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
