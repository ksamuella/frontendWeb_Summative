export const $ = s => document.querySelector(s);
export const $$ = s => [...document.querySelectorAll(s)];
export const view = {sort: 'date-desc', query: "", ci : true, editingId: null, flashId: null};


const pad = n => String(n).padStart(2, '0');
export const isoDate = d =>`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function announce(msg){
  const el =$('#status');
  el.textContent = '';
  setTimeout(()=> {
    el.textContent = msg;
  }, 30);
}