export const DEFAULT_SETTINGS = {
  base: 'USD',
  currencies: [{ code: 'EUR', rate: 0.92 }, { code: 'RWF', rate: 1450 }],
  display: 'USD',
  cap: 500,
  categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other']
};

let records = [];
let settings = { ...DEFAULT_SETTINGS };
const listeners = new Set();

export const notify = () => listeners.forEach(f => f());
const emit = () => notify();
const nextId = () => 'rec_' + String(
  records.reduce((m, r) => Math.max(m, parseInt(String(r.id).replace(/\D/g, ''), 10) || 0), 0) + 1
).padStart(4, '0');

export const subscribe = f => listeners.add(f);
export const getRecords = () => records;
export const getSettings = () => settings;
export const currencyCodes = () => [settings.base, ...settings.currencies.map(c => c.code)];
export const rateFor = code => code === settings.base ? 1 : (settings.currencies.find(c => c.code === code)?.rate ?? 1);

export function addRecord(data) {
  const now = new Date().toISOString();
  const r = { id: nextId(), ...data, createdAt: now, updatedAt: now };
  records = [...records, r];
  emit();
  return r;
}
export function updateRecord(id, data) {
  records = records.map(r => r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r);
  emit();
}
export function deleteRecord(id) { records = records.filter(r => r.id !== id); emit(); }
export function replaceRecords(list) { records = list; emit(); }
export function updateSettings(patch) { settings = { ...settings, ...patch }; emit(); }
