# P09 Visit Form [DRAFT]

| | |
|---|---|
| **Route** | `visit/[id]/form.tsx` |
| **Feature** | F05 Visit Form |
| **Figma** | [TODO link] |
| **Code** | `app/visit/[id]/form.tsx` |

## Purpose
Capture visit data in steps.

## UI elements
Step indicator, fields per schema, checklist, add photos and signature buttons, Save draft indicator, Next/Back.

## Actions
Fill fields, add photos (P10), sign (P11), move between steps.

## States
Draft saved, Validation errors, Locked (already submitted).

## Navigation
Photos -> P10. Signature -> P11. Done -> P12.

## Acceptance criteria
- [ ] All states above are implemented
- [ ] Works offline where noted in the feature spec
- [ ] Accessible labels on all interactive elements
- [ ] Matches Figma at 360px and 430px widths
