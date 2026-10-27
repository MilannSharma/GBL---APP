# F08 Notifications [DRAFT]

**Priority:** P1 | **Code:** `src/features/notifications/` | **Screens:** Notifications list

## Goal
Tell the agent when assignments change.

## Requirements
1. Ask notification permission at a sensible moment (after login, with explanation).
2. Register device push token with backend after login; unregister on logout.
3. Handle foreground, background, and killed-state taps with deep links to Visit Detail.
4. In-app notification list with read/unread.
5. Android notification channels (assignments, reminders).
6. Refresh visit data when a relevant push arrives.

## Events
New visit assigned, visit rescheduled, visit cancelled, reminder before visit.

## API dependencies
`POST /devices`, `DELETE /devices/:id`, `GET /notifications` (see `07-api/modules/notifications.md`).

## Acceptance criteria
- [ ] Tapping a push opens the right visit in all three app states
- [ ] Logout stops pushes for that user on that device
- [ ] Denied permission shows an in-app hint, no crash
