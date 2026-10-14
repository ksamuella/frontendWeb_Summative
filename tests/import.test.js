import { t } from './t.js';
import { validateImport } from '../scripts/validators.js';

const good = [{ id: 'rec_0001', description: 'Lunch', amount: 12.5, category: 'Food', date: '2025-09-25', createdAt: '2025-09-25T10:00:00Z', updatedAt: '2025-09-25T10:00:00Z' }];
t('import accepts valid data', validateImport(JSON.stringify(good)).ok);
t('import rejects non-JSON', !validateImport('{oops').ok);
t('import rejects non-array', !validateImport('{}').ok);
t('import rejects bad amount type', !validateImport(JSON.stringify([{ ...good[0], amount: '12' }])).ok);
t('import rejects duplicate ids', !validateImport(JSON.stringify([good[0], good[0]])).ok);
