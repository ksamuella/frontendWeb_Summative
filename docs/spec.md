# Specs:Student Finance Tracker

## Data model 
{id: "rec_0001", description:"Lunch",amount:12.5, category:"Food", date: "2025-09-29", createdAt: "ISO", updatedAt: "ISO"}

Settings: {base,currencies:[{code,rate}*2], display, cap, categories[]}

Storage keys: sft:records, sft:settings, sft:theme

# Sections
About, Daashboard, Records, Add/Edit form, Settings

# Wireframes

Mobile (360px)                 Desktop (1024px)
+----------------+
+---------------------------------------------+
| Title [theme] |               | Title
Nav links [theme]  |
| Nav (wrapped) |
+----------------------------------------------+
+-----------------+              | [Total][spent]
[Top category]|
| Stat cards     |        | Cap message                          |
| Cap message    |        | Last-7-days bars                     |
| 7-day bars     |        | Records: search | sort | table      |
| Record cards   |        +--------------------------------------+
+----------------+

## Accessibility plan
- Landmarks: header, nav, main, section, footer; one h1, ordered headings
- Skip link; labels bound to inputs; visible focus ring (3px)
- role=status / aria-live for errors, results, cap (polite under, assertive over)
- aria-invalid on bad fields; keyboard-only flow for every action
- Contrast >= 4.5:1 in light and dark themes; prefers-reduced-motion respected
- Breakpoints: 360px (base), 768px, 1024px.

## Regex rules
description ^\S(?:.\S)?$ | amount ^(0|[1-9]\d)(\.\d{1,2})?$
date ^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$
category ^[A-Za-z]+(?:[ -][A-Za-z]+)*$ | advanced: \b(\w+)\s+\1\b

