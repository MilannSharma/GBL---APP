# P08 Check-in [DRAFT]

| | |
|---|---|
| **Route** | `visit/[id]/check-in.tsx` |
| **Feature** | F04 Check-in/out |
| **Figma** | [TODO link] |
| **Code** | `app/visit/[id]/check-in.tsx` |

## Purpose
Record arrival with location proof.

## UI elements
Map or distance indicator, hospital name, accuracy info, Check in button, reason field if override allowed.

## Actions
Allow location, tap Check in, enter override reason.

## States
Locating, Too far, Permission denied, GPS off, Low accuracy, Submitting, Queued offline, Success.

## Navigation
Success -> P06 (now showing Continue) or directly P09.

## Acceptance criteria
- [ ] All states above are implemented
- [ ] Works offline where noted in the feature spec
- [ ] Accessible labels on all interactive elements
- [ ] Matches Figma at 360px and 430px widths
