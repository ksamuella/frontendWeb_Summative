import { t } from './t.js';
import { compileRegex, highlight, sortRecords } from '../scripts/search.js';

t('compileRegex returns null on invalid', compileRegex('(') === null);
t('compileRegex returns null on empty', compileRegex('') === null);
t('highlight escapes HTML', highlight('a<b>c', compileRegex('b')) === 'a&lt;<mark>b</mark>&gt;c');
t('highlight cents', highlight('12.50 USD', compileRegex('\\.\\d{2}\\b')) === '12<mark>.50</mark> USD');
t('lookahead search works', highlight('item 42 units', compileRegex('\\d+(?= units)')) === 'item <mark>42</mark> units');
const recs = [{ date: '2025-01-02', description: 'b', amount: 5 }, { date: '2025-01-01', description: 'A', amount: 9 }];
t('sort by description asc', sortRecords(recs, 'description-asc')[0].description === 'A');
t('sort by amount desc', sortRecords(recs, 'amount-desc')[0].amount === 9);
t('sort by date asc', sortRecords(recs, 'date-asc')[0].date === '2025-01-01');
