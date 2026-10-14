import { $, announce } from './dom.js';
import * as S from './state.js';
import { validateImport, RX, collapse } from './validators.js';
import { exportJSON } from './storage.js';

/* ---------- settings form ---------- */
const sf = $('#settings-form');
function fillSettings() {
  const s = S.getSettings();
  sf.base.value = s.base;
  sf.c1code.value = s.currencies[0].code; sf.c1rate.value = s.currencies[0].rate;
  sf.c2code.value = s.currencies[1].code; sf.c2rate.value = s.currencies[1].rate;
  sf.cap.value = s.cap || '';
  sf.categories.value = s.categories.join(', ');
}
sf.addEventListener('submit', e => {
  e.preventDefault();
  const errs = [];
  const codes = [sf.base.value, sf.c1code.value, sf.c2code.value];
  if (!codes.every(c => RX.currency.test(c))) errs.push('Currency codes must be 3 capital letters.');
  if (new Set(codes).size < 3) errs.push('Currency codes must be different.');
  const rates = [sf.c1rate.value, sf.c2rate.value];
  if (!rates.every(r => RX.rate.test(r) && Number(r) > 0)) errs.push('Rates must be positive numbers.');
  if (sf.cap.value !== '' && !RX.amount.test(sf.cap.value)) errs.push('Cap must be a number like 500 or 500.00.');
  const cats = [...new Set(sf.categories.value.split(',').map(s => collapse(s.trim())).filter(Boolean))];
  if (!cats.length || !cats.every(c => RX.category.test(c))) errs.push('Categories: letters, spaces, hyphens; separated by commas.');
  $('#settings-errors').textContent = errs.join(' ');
  if (errs.length) return;
  const cur = S.getSettings();
  S.updateSettings({
    base: codes[0],
    currencies: [{ code: codes[1], rate: Number(rates[0]) }, { code: codes[2], rate: Number(rates[1]) }],
    cap: sf.cap.value === '' ? 0 : Number(sf.cap.value),
    categories: cats,
    display: codes.includes(cur.display) ? cur.display : codes[0]
  });
  announce('Settings saved.');
});

/* ---------- export / import / seed / clear ---------- */
$('#export-btn').addEventListener('click', () => {
  const blob = new Blob([exportJSON(S.getRecords())], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'finance-records.json';
  a.click();
  URL.revokeObjectURL(a.href);
  announce('Exported records as JSON.');
});
function importText(text) {
  const res = validateImport(text);
  if (!res.ok) { $('#io-msg').textContent = 'Import failed: ' + res.errors.join(' '); return false; }
  S.replaceRecords(res.records);
  $('#io-msg').textContent = '';
  announce(`Imported ${res.records.length} records.`);
  return true;
}
$('#import-file').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  const res = validateImport(text);
  if (res.ok && !confirm(`Replace ${S.getRecords().length} current records with ${res.records.length} imported?`)) { e.target.value = ''; return; }
  importText(text);
  e.target.value = '';
});
async function loadSeed() {
  try { const r = await fetch('seed.json'); return importText(await r.text()); }
  catch { $('#io-msg').textContent = 'Could not load seed.json (serve the folder over http).'; return false; }
}
$('#seed-btn').addEventListener('click', () => {
  if (confirm('Replace all records with the seed data?')) loadSeed();
});
$('#clear-btn').addEventListener('click', () => {
  if (confirm('Delete ALL records? This cannot be undone.')) { S.replaceRecords([]); announce('All records deleted.'); }
});

/* ---------- init: fill form, seed on very first visit ---------- */
(async function init() {
  fillSettings();
  let first = false;
  try { first = localStorage.getItem('sft:records') === null; } catch { /* ignore */ }
  if (first) await loadSeed();
})();
