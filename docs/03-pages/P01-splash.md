# P01 Splash [DRAFT]

| | |
|---|---|
| **Route** | `index.tsx` |
| **Feature** | F01 Auth |
| **Figma** | [TODO link] |
| **Code** | `app/index.tsx` |

## Purpose
Boot the app, load session, decide the first route.

## UI elements
App logo, loading indicator, app version (small).

## Actions
None (automatic).

## States
Checking session, Update required, Maintenance mode.

## Navigation
Valid session -> P04 Home. No session -> P02 Login. Update required -> P20.

## Acceptance criteria
- [ ] All states above are implemented
- [ ] Works offline where noted in the feature spec
- [ ] Accessible labels on all interactive elements
- [ ] Matches Figma at 360px and 430px widths
