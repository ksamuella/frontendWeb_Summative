const RK = 'sft:records', SK = 'sft:settings';
const read = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };

export const loadRecords = () => { const r = read(RK, null); return Array.isArray(r) ? r : null; };
export const saveRecords = d => write(RK, d);
export const loadSettings = () => read(SK, null);
export const saveSettings = s => write(SK, s);
export const exportJSON = r => JSON.stringify(r, null, 2);
