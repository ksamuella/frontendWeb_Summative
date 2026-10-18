# student Finance Tracker 

theme: student finance tracker (vanilla HTML/CSS/JS , no frameworks)
Live site (Github Pages): https://github.com/ksamuella/frontendWeb_Summative
Demo Video (unlisted): https://youtu.be/UjSvLF-CFHI?feature=shared

## Features
- Sections: About, Dashboard, Records (table on desktop, cards on mobile), Add form, Settings
- Add, inline edit, and delete (with confirmation); id, createdAt, updatedAt on every record
- Real-time inline regex validation on the Add form
- Live regex search with case-insensitive toggle, safe compiler (try/catch), <mark> highlighting
- Sort by date, description (A↕Z), amount (↑↓)
- Dashboard: total records, total spent, top category, last-7-days bar chart, spending cap with ARIA live messages (polite under cap, assertive over)
- Settings: base currency + 2 others with manual rates, cap, editable categories
- localStorage auto-save, JSON import (validated) / export
- Light/dark theme (persisted), reduced-motion support

## Regex catalog
| Purpose | Pattern | Example |
|---|---|---|
| Description (no edge spaces) | ^\S(?:.*\S)?$ | Lunch ok, ` Lunch` rejected |
| Amount | ^(0\|[1-9]\d*)(\.\d{1,2})?$ | 12.50 ok, 012 rejected |
| Date | ^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$ | 2025-09-29 (plus real-calendar check) |
| Category | ^[A-Za-z]+(?:[ -][A-Za-z]+)*$ | Part-time work ok, Food2 rejected |
| Duplicate word (back-reference) | \b(\w+)\s+\1\b | Coffee coffee triggers a warning |
| Currency code / rate | ^[A-Z]{3}$ / ^(0\|[1-9]\d*)(\.\d+)?$ | RWF, 1450 |
| Search ideas | \.\d{2}\b, (coffee\|tea), \d+(?= USD) (lookahead) | cents, beverages, lookahead |

## Keyboard map
- Tab / Shift+Tab: move between controls; first Tab stop is *Skip to content*
- Enter on nav links: switch section (focus moves to its heading)
- Enter / Space: press buttons; Enter in a form submits
- Inline edit: Edit → fields get focus → Tab to Save / Cancel
- Arrow keys: change selects (sort, currency)

## Accessibility notes
Semantic landmarks (header, nav, main, section, footer), one h1 and ordered headings, labels bound to inputs, visible focus ring, skip link, role="status" / aria-live for status, errors, and cap messages (assertive when exceeded), aria-invalid on bad fields, high-contrast colours in both themes, prefers-reduced-motion respected.

## Running tests
Modules need http (not file://). From this folder run python -m http.server 8000, then open http://localhost:8000/tests.html (the app is at /index.html).

## Structure
index.html, styles/main.css, scripts/{dom,main,state,storage,validators,search,ui,form,records,dashboard,settings,theme}.js, tests.html + tests/, docs/spec.md, assets/, seed.json
