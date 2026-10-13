import { $, view, announce, isoDate } from './dom.js';
import * as S from './state.js';
import { validateFields } from './validators.js';

const FIELDS = ['description', 'amount', 'category', 'date'];
const form = $('#record-form');
const today = () => isoDate(new Date());
form.elements.date.value = today();

function showErrors(errors, warnings) {
  FIELDS.forEach(k => {
    const el = $('#err-' + k);
    el.textContent = errors[k] || warnings[k] || '';
    el.classList.toggle('warn', !errors[k] && !!warnings[k]);
    form.elements[k].setAttribute('aria-invalid', String(!!errors[k]));
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const v = Object.fromEntries(FIELDS.map(k => [k, form.elements[k].value]));
  const { errors, warnings, clean } = validateFields(v);
  showErrors(errors, warnings);
  const keys = Object.keys(errors);
  if (keys.length) {
    announce(`${keys.length} error${keys.length > 1 ? 's' : ''} in the form. ${Object.values(errors).join(' ')}`);
    form.elements[keys[0]].focus();
    return;
  }
  const r = S.addRecord(clean);
  view.flashId = r.id;
  S.notify();
  form.reset();
  form.elements.date.value = today();
  showErrors({}, {});
  announce('Record added.' + (warnings.description ? ' ' + warnings.description : ''));
  form.elements.description.focus();
});

/* live (real-time) validation while typing */
FIELDS.forEach(k => form.elements[k].addEventListener('input', () => {
  const v = Object.fromEntries(FIELDS.map(f => [f, form.elements[f].value]));
  const { errors, warnings } = validateFields(v);
  const input = form.elements[k], el = $('#err-' + k);
  el.textContent = input.value ? (errors[k] || warnings[k] || '') : '';
  el.classList.toggle('warn', !errors[k] && !!warnings[k]);
  input.setAttribute('aria-invalid', String(!!input.value && !!errors[k]));
}));
