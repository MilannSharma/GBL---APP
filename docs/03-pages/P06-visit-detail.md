# P06 Visit Detail [DRAFT]

| | |
|---|---|
| **Route** | `visit/[id].tsx` |
| **Feature** | F02 Visits |
| **Figma** | [TODO link] |
| **Code** | `app/visit/[id].tsx` |

## Purpose
Everything about one visit and the next action.

## UI elements
Header with status, hospital summary, time window, instructions, contact, timeline (check-in/out), primary action button.

## Actions
Open hospital, call contact, primary action (Check in / Continue form / View).

## States
Loading, Error, Cancelled, Reassigned, Completed (read-only), Pending sync.

## Navigation
Hospital -> P07. Check in -> P08. Continue -> P09.

## Acceptance criteria
- [ ] All states above are implemented
- [ ] Works offline where noted in the feature spec
- [ ] Accessible labels on all interactive elements
- [ ] Matches Figma at 360px and 430px widths
