# Scope: What We Need and What We Do Not [DRAFT]

## In scope: MVP (v1)
| Area | Included |
|---|---|
| Auth | Login, logout, token refresh, session persist, optional biometric lock |
| Visits | Today list, upcoming, status, detail |
| Hospitals | List, detail, contact, map, directions |
| Check-in/out | GPS capture, time stamp, location validation |
| Visit form | Notes, checklist, photos, signature, submit |
| Offline | Local cache, offline writes, sync queue, sync status |
| Notifications | Push for assignment and changes, in-app list |
| History | Past visits list and detail |
| Profile | Agent info, app version, logout |
| Platform | iOS + Android, English |

## Planned: v1.1 / v2
- Background location trail / route tracking
- Attendance (day start / day end)
- Expense and travel claims
- Hindi and other regional languages
- QR / barcode scan
- In-app chat or support
- Agent performance stats
- Dark mode

## Out of scope (not building)
- Full patient record or medical history management
- Billing, payments, invoices
- Video or voice calls
- Social features, ratings, reviews
- Admin panel inside the mobile app
- Multi-role system (only Agent role)
- Tablet-optimized layouts
- Web version of the agent app

## Scope change rule
Any new feature must get: a spec file in `02-features/`, a decision entry in `08-project/DECISIONS.md`, and owner approval before work starts.
