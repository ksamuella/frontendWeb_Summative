let failed = 0, total = 0;
const out = document.getElementById('out');
export function t(name, cond) {
  total++;
  const li = document.createElement('li');
  li.className = cond ? 'pass' : 'fail';
  li.textContent = (cond ? 'PASS: ' : 'FAIL: ') + name;
  if (!cond) failed++;
  out.append(li);
  document.getElementById('summary').textContent =
    failed ? `${failed} of ${total} test(s) failed` : `All ${total} tests passed`;
}