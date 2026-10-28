# TASK-005: Logo Fine-Tuning & Full Proper Notifications Screen
- Feature: F08 Notifications, F02 Visits   Page: P16 Notifications, P04 Home   Priority: P0
- Owner (human): Milan Sharma   Agent role(s): Planner, Implementer
- Status: done

## Goal
1. Slightly decrease hospital logo dimensions in `HomeHeader.tsx` (`width: 175, height: 54`) to eliminate bottom edge clipping while keeping its left-shifted position.
2. Build a full-featured, properly styled Notifications screen (`app/notifications.tsx` and `src/features/notifications/`) with realistic mock data layer (`// TODO(api)`), category filtering ("All", "Unread", "Visits", "System"), "Mark all as read" capability, smooth back navigation, and rich notification cards.

## In scope
- `src/features/visits/components/HomeHeader.tsx`:
  - Decrease logo size slightly from `200 x 64` to `175 x 54` to prevent vertical clipping on mobile devices.
  - Maintain `paddingLeft: 14` for left alignment.
- `src/features/notifications/`:
  - Provide rich offline/mock notification data fallback in repository/API layer per rule 5.
  - Support marking single notification as read and "Mark all as read".
  - Support category filtering: "All", "Unread", "Visits", "System".
  - Create rich `NotificationItem.tsx` with color-coded category icons (Blue for visits, Amber for reminders, Teal for system).
- `app/notifications.tsx`:
  - Full screen with safe area handling, custom back button, unread count pill, filter tabs, pull-to-refresh, empty states, and smooth back-navigation to Home.

## Out of scope
- Remote push notifications backend token registration (device push service).

## Spec links
- Page spec: `docs/03-pages/P16-notifications.md`
- Feature spec: `docs/02-features/F08-notifications.md`
- API module: `docs/07-api/modules/notifications.md`

## Acceptance criteria
- [x] Logo has zero vertical clipping and sits cleanly on the left.
- [x] Tapping the bell icon on Home navigates smoothly to `/notifications`.
- [x] Notifications page displays full list of alerts with icons, unread dots, and timestamps.
- [x] User can mark individual notifications or all notifications as read.
- [x] Filter chips switch between All, Unread, Visits, and System.
- [x] Back button returns smoothly to Home.
- [x] `yarn typecheck` passes with 0 errors.

## Test plan
- Visual verification in Expo Go on Android.
- Tap tests for bell button, back button, mark all as read, and filter chips.

## Evidence
- `yarn typecheck`:
```bash
$ tsc --noEmit
Done in 14.08s.
```
