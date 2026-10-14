import { $, view, announce } from './dom.js';
import * as S from './state.js';
import { validateFields } from './validators.js';
import { compileRegex } from './search.js';
import * as UI from './ui.js';

function render() {
  const settings = S.getSettings(), records = S.getRecords();
  const re = compileRegex(view.query, view.ci);
  const bad = !!view.query && !re;
  $('#search-error').textContent = bad ? 'Invalid pattern: fix the regular expression.' : '';
  $('#search').setAttribute('aria-invalid', String(bad));
  UI.renderControls(settings);
  UI.renderTable({ records, settings, re, sort: view.sort, editingId: view.editingId, flashId: view.flashId });
}
S.subscribe(render);


$('#search').addEventListener('input', e => { view.query = e.target.value; view.flashId = null; render(); });
$('#ci').addEventListener('change', e => { view.ci = e.target.checked; render(); });
$('#sort').addEventListener('change', e => { view.sort = e.target.value; render(); });
$('#display-currency').addEventListener('change', e => S.updateSettings({ display: e.target.value }));


$('#tbody').addEventListener('click', e => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const tr = btn.closest('tr'), id = tr.dataset.id, act = btn.dataset.act;
  if (act === 'edit') {
    view.editingId = id; render();
    $(`tr[data-id="${id}"] input`)?.focus();
  } else if (act === 'cancel') {
    view.editingId = null; render();
    $(`tr[data-id="${id}"] [data-act="edit"]`)?.focus();
    announce('Edit cancelled.');
  } else if (act === 'save') {
    const v = {};
    tr.querySelectorAll('[data-f]').forEach(i => { v[i.dataset.f] = i.value; });
    const { errors, clean } = validateFields(v);
    const keys = Object.keys(errors);
    tr.querySelectorAll('[data-f]').forEach(i => i.setAttribute('aria-invalid', String(!!errors[i.dataset.f])));
    if (keys.length) {
      tr.querySelector('.row-error').textContent = Object.values(errors).join(' ');
      tr.querySelector(`[data-f="${keys[0]}"]`).focus();
      return;
    }
    view.editingId = null; view.flashId = id;
    S.updateRecord(id, clean);
    $(`tr[data-id="${id}"] [data-act="edit"]`)?.focus();
    announce('Record updated.');
  } else if (act === 'delete') {
    const rec = S.getRecords().find(r => r.id === id);
    if (confirm(`Delete "${rec.description}"? This cannot be undone.`)) {
      S.deleteRecord(id);
      announce('Record deleted.');
      $('#search').focus();
    }
  }
});

render();
