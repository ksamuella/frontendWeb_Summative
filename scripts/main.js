import './records.js';
import './form.js';
import { $, $$ } from './dom.js';

/* ---------- routing (hash based) ---------- */
const routes = ['dashboard', 'records', 'add', 'settings', 'about'];
let firstRoute = true;
function route() {
  const id = routes.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'dashboard';
  $$('main > section').forEach(s => { s.hidden = s.id !== id; s.classList.toggle('active', s.id === id); });
  $$('nav a').forEach(a => {
    if (a.hash === '#' + id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  if (!firstRoute) $(`#${id} h2`).focus();
  firstRoute = false;
}
window.addEventListener('hashchange', route);
$('.skip').addEventListener('click', e => { e.preventDefault(); $('#main').focus(); });
route();
