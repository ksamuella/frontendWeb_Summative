import { highlight, escapeHtml as h, matches, sortRecords } from './search.js';
import { rateFor, currencyCodes } from './state.js';
import { $ } from './dom.js';

export const money = (amt, settings, code = settings.display) => `${(amt * rateFor(code)).toFixed(2)} ${code}`;
export const setText = (el, t) => { if (el.textContent !== t) el.textContent = t; };

function viewRow(r, settings, re, flashId) {
  const label = h(r.description);
  return `<tr data-id="${r.id}"${r.id === flashId ? ' class="flash"' : ''}>
    <td data-label="Date">${highlight(r.date, re)}</td>
    <td data-label="Description">${highlight(r.description, re)}</td>
    <td data-label="Category">${highlight(r.category, re)}</td>
    <td data-label="Amount" class="num">${highlight(money(r.amount, settings), re)}</td>
    <td data-label="Actions">
      <button type="button" data-act="edit" aria-label="Edit ${label}">Edit</button>
      <button type="button" data-act="delete" class="danger" aria-label="Delete ${label}">Delete</button>
    </td></tr>`;
}

function editRow(r, settings) {
  return `<tr data-id="${r.id}">
    <td data-label="Date"><input data-f="date" aria-label="Date" value="${h(r.date)}" placeholder="YYYY-MM-DD"></td>
    <td data-label="Description"><input data-f="description" aria-label="Description" value="${h(r.description)}"></td>
    <td data-label="Category"><input data-f="category" aria-label="Category" list="cat-list" value="${h(r.category)}"></td>
    <td data-label="Amount" class="num"><input data-f="amount" aria-label="Amount in ${h(settings.base)}" inputmode="decimal" value="${r.amount}"></td>
    <td data-label="Actions">
      <button type="button" data-act="save">Save</button>
      <button type="button" data-act="cancel">Cancel</button>
      <p class="error row-error" role="alert"></p>
    </td></tr>`;
}

export function renderTable({ records, settings, re, sort, editingId, flashId }) {
  const list = sortRecords(
    records.filter(r => matches([r.description, r.category, money(r.amount, settings), r.date], re)), sort);
  $('#tbody').innerHTML = list.map(r => r.id === editingId ? editRow(r, settings) : viewRow(r, settings, re, flashId)).join('');
  $('#empty').hidden = list.length > 0;
  setText($('#result-count'), `${list.length} of ${records.length} records`);
}

export function renderControls(settings) {
  $('#cat-list').innerHTML = settings.categories.map(c => `<option value="${h(c)}"></option>`).join('');
  $('#display-currency').innerHTML = currencyCodes()
    .map(c => `<option${c === settings.display ? ' selected' : ''}>${h(c)}</option>`).join('');
  document.querySelectorAll('.base-label').forEach(e => { e.textContent = settings.base; });
}
