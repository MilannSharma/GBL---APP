# P19 Sync Status [DRAFT]

| | |
|---|---|
| **Route** | `sync.tsx` |
| **Feature** | F07 Offline/Sync |
| **Figma** | [TODO link] |
| **Code** | `app/sync.tsx` |

## Purpose
Transparency and control over pending data.

## UI elements
Last sync time, pending/failed counts, list of queued items with state, Sync now button, retry per item.

## Actions
Sync now, retry, view error.

## States
Idle, Syncing, All synced, Has failures.

## Navigation
Back -> P17.

## Acceptance criteria
- [ ] All states above are implemented
- [ ] Works offline where noted in the feature spec
- [ ] Accessible labels on all interactive elements
- [ ] Matches Figma at 360px and 430px widths
