export const RX = {
  desc: /^\S(?:.*\S)?$/,                                  // no leading/trailing spaces
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,                   // 12 or 12.50
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,  // YYYY-MM-DD
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,              // letters, spaces, hyphens
  dupWord: /\b(\w+)\s+\1\b/i,                             // advanced: back-reference
  currency: /^[A-Z]{3}$/,
  rate: /^(0|[1-9]\d*)(\.\d+)?$/
};

export const collapse = s => s.replace(/\s{2,}/g, ' ');

export function realDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

export function validateFields(v) {
  const errors = {}, warnings = {};
  const description = String(v.description ?? '');
  const amount = String(v.amount ?? '');
  const category = String(v.category ?? '');
  const date = String(v.date ?? '');

  if (!RX.desc.test(description)) errors.description = 'Required. No leading or trailing spaces.';
  else if (RX.dupWord.test(collapse(description))) warnings.description = 'Warning: repeated word detected (saved anyway).';

  if (!RX.amount.test(amount)) errors.amount = 'Use a number like 12 or 12.50 (max 2 decimals).';
  if (!RX.date.test(date) || !realDate(date)) errors.date = 'Use a real date as YYYY-MM-DD.';
  if (!RX.category.test(category)) errors.category = 'Letters, spaces and hyphens only (e.g. Food, Part-time).';

  return {
    errors, warnings,
    clean: { description: collapse(description), amount: Number(amount), category, date }
  };
}

export function validateImport(text) {
  let data;
  try { data = JSON.parse(text); } catch { return { ok: false, errors: ['File is not valid JSON.'] }; }
  if (!Array.isArray(data)) return { ok: false, errors: ['Top level must be an array of records.'] };
  const errors = [], ids = new Set(), records = [];
  data.forEach((r, i) => {
    const p = `Record ${i + 1}: `;
    if (!r || typeof r !== 'object' || Array.isArray(r)) { errors.push(p + 'not an object.'); return; }
    if (typeof r.id !== 'string' || !r.id) errors.push(p + 'missing id.');
    else if (ids.has(r.id)) errors.push(p + 'duplicate id.');
    else ids.add(r.id);
    if (typeof r.amount !== 'number') errors.push(p + 'amount must be a number.');
    const { errors: e, clean } = validateFields({ ...r, amount: String(r.amount) });
    Object.values(e).forEach(m => errors.push(p + m));
    ['createdAt', 'updatedAt'].forEach(k => {
      if (typeof r[k] !== 'string' || Number.isNaN(Date.parse(r[k]))) errors.push(p + `${k} must be an ISO timestamp.`);
    });
    records.push({ id: r.id, ...clean, createdAt: r.createdAt, updatedAt: r.updatedAt });
  });
  return errors.length ? { ok: false, errors: errors.slice(0, 6) } : { ok: true, records };
}
