# P04 Home (Today) [DRAFT]

| | |
|---|---|
| **Route** | `(tabs)/index.tsx` |
| **Feature** | F02 Visits |
| **Figma** | [TODO link] |
| **Code** | `app/(tabs)/index.tsx` |

## Purpose
Daily dashboard of what to do.

## UI elements
Greeting and date, counters (Pending/In progress/Done), today's visit cards, offline/sync banner, notification bell.

## Actions
Pull to refresh, tap card, tap bell, tap sync banner.

## States
Loading skeleton, Empty (no visits today), Error, Offline with last updated time.

## Navigation
Card -> P06. Bell -> P16. Banner -> P19.

## Acceptance criteria
- [ ] All states above are implemented
- [ ] Works offline where noted in the feature spec
- [ ] Accessible labels on all interactive elements
- [ ] Matches Figma at 360px and 430px widths
