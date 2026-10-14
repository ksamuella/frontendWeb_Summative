export function compileRegex(input, ci = true) {
  if (!input) return null;
  try { return new RegExp(input, ci ? 'gi' : 'g'); } catch { return null; }
}

export const escapeHtml = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Escapes the text, wrapping each match in <mark> (safe against HTML in data).
export function highlight(text, re) {
  text = String(text);
  if (!re) return escapeHtml(text);
  let out = '', last = 0;
  for (const m of text.matchAll(re)) {
    if (!m[0]) continue;
    out += escapeHtml(text.slice(last, m.index)) + '<mark>' + escapeHtml(m[0]) + '</mark>';
    last = m.index + m[0].length;
  }
  return out + escapeHtml(text.slice(last));
}

export function matches(fields, re) {
  if (!re) return true;
  return fields.some(f => { re.lastIndex = 0; return re.test(f); });
}

export function sortRecords(list, key) {
  const [field, dir] = key.split('-');
  const m = dir === 'asc' ? 1 : -1;
  const cmp = {
    date: (a, b) => a.date.localeCompare(b.date),
    description: (a, b) => a.description.localeCompare(b.description, undefined, { sensitivity: 'base' }),
    amount: (a, b) => a.amount - b.amount
  }[field];
  return [...list].sort((a, b) => m * cmp(a, b));
}
