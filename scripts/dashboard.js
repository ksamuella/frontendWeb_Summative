import { $, isoDate } from './dom.js';
import * as S from './state.js';
import { money, setText } from './ui.js';

function renderStats(records, settings) {
  const total = records.reduce((s, r) => s + r.amount, 0);
  setText($('#stat-count'), String(records.length));
  setText($('#stat-sum'), money(total, settings));
  const byCat = {};
  records.forEach(r => { byCat[r.category] = (byCat[r.category] || 0) + r.amount; });
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  setText($('#stat-top'), top ? `${top[0]} (${money(top[1], settings)})` : '—');

  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return isoDate(d); });
  const sums = days.map(k => records.filter(r => r.date === k).reduce((s, r) => s + r.amount, 0));
  const max = Math.max(...sums, 0.01);
  $('#trend').innerHTML = days.map((k, i) =>
    `<li><span class="val">${(sums[i] * S.rateFor(settings.display)).toFixed(2)}</span>
     <span class="bar" style="--h:${(sums[i] / max * 80).toFixed(0)}%"></span>
     <span class="day">${k.slice(5)}</span></li>`).join('');
  setText($('#trend-total'), `Last 7 days: ${money(sums.reduce((a, b) => a + b, 0), settings)}`);
}

function renderCap(records, settings) {
  const total = records.reduce((s, r) => s + r.amount, 0);
  const polite = $('#cap-polite'), assertive = $('#cap-assertive');
  if (!(settings.cap > 0)) { setText(polite, 'No cap set.'); setText(assertive, ''); return; }
  const diff = settings.cap - total;
  if (diff >= 0) {
    setText(polite, `Under cap: ${money(diff, settings)} remaining of ${money(settings.cap, settings)}.`);
    setText(assertive, '');
  } else {
    setText(assertive, `Cap exceeded by ${money(-diff, settings)}!`);
    setText(polite, '');
  }
}

function render() {
  const records = S.getRecords(), settings = S.getSettings();
  renderStats(records, settings);
  renderCap(records, settings);
}
S.subscribe(render);
render();
