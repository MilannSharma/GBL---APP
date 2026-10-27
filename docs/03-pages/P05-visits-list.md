# P05 Visits List [DRAFT]

| | |
|---|---|
| **Route** | `(tabs)/visits.tsx` |
| **Feature** | F02 Visits |
| **Figma** | [TODO link] |
| **Code** | `app/(tabs)/visits.tsx` |

## Purpose
Browse visits by tab.

## UI elements
Tabs (Today, Upcoming, Done), search/filter, visit cards with status chip and sync badge.

## Actions
Switch tab, search, pull to refresh, infinite scroll.

## States
Loading, Empty per tab, Error, Offline cached.

## Navigation
Card -> P06.

## Acceptance criteria
- [ ] All states above are implemented
- [ ] Works offline where noted in the feature spec
- [ ] Accessible labels on all interactive elements
- [ ] Matches Figma at 360px and 430px widths
