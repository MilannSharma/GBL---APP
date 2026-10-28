# TASK-006: Comprehensive Hospital Visits Page Implementation
- Feature: F02 Visits   Page: P05 Today's Visits / Visits List   Priority: P0
- Owner (human): Milan Sharma   Agent role(s): Planner, Implementer
- Status: done

## Goal
Implement a pixel-perfect, high-performance Hospital Visits screen in `app/(tabs)/visits.tsx` matching `Ui Refrence image/visit page.png`. It must feature date-wise filtering, day status tracking, live metrics overview (Visited vs Not Yet Visited), 7 fresh Mumbai hospital visits data, interactive click behaviors for visited and not visited items, edit/update capabilities, and a floating `+ Create Visit` action to schedule new hospital visits.

## In scope
1. **Header & Navigation Bar**:
   - Back button, bold "Visits" title, descriptive subtitle: "Track your hospital visits and manage your field activities."
   - Circular notification bell with unread red badge (linking to `/notifications`).
2. **Date Filter & Day Status Bar**:
   - Dropdown pill with calendar icon and date selector ("Today, 24 Nov 2025 v"). Clicking opens quick date switch modal (Today, Yesterday, Tomorrow, Pick Date).
   - Day status pill: "Day not started (i)" / "Day in progress".
3. **Metrics Overview Row**:
   - Two cards:
     - Blue Location Pin badge: `Visited` count.
     - Amber/Purple Clock badge: `Not Yet Visited` count.
4. **Hospital Visits List**:
   - Section header: "Hospital Visits" with `= Sort` action (Time, Name, Status).
   - Custom `HospitalVisitCard` matching `Ui Refrence image/visit page.png`:
     - 3D hospital building icon avatar (`assets/hospital-building.png`).
     - Hospital name & complete address with location pin icon.
     - Scheduled time (e.g. 09:30 AM) with clock icon.
     - Scheduled date (e.g. 24 Nov 2025) with calendar icon.
     - Status badges: "Visited" (green pill with checkmark) or "Not Yet Visited" (blue pill with clock).
     - Chevron right `>` for navigation.
5. **Interactive Click Behavior**:
   - **Clicking a Visited card**:
     - Opens full Visit Detail view showing complete information: hospital details, check-in and check-out timestamps, GPS coordinates, doctor/department, notes, and photos.
   - **Clicking a Not Yet Visited card**:
     - Opens quick action sheet / modal with options:
       - "Start Check-in" (navigates to check-in flow or checks in on-site)
       - "Edit Visit" (update time, address, contact doctor, notes)
       - "Mark as Visited" (immediately updates count and badge)
       - "Cancel / Reschedule"
6. **Floating `+ Create Visit` Button & Modal**:
   - Floating pill button at bottom-right (`+ Create Visit`) above the floating tab dock.
   - Modal form to add a hospital visit:
     - Quick select from top Mumbai hospital presets (Apollo, Fortis, Kokilaben, Lilavati, Hiranandani, Wockhardt, Hinduja) or custom input.
     - Address, scheduled time, date, doctor/department, notes.
     - Adds visit directly to local state and SQLite DB, instantly updating metrics.
7. **7 Fresh Mumbai Hospital Seed Data**:
   - Seed database / mock repository with the 7 realistic hospital visits shown in the UI reference.

## Out of scope
- Remote backend GPS geofence enforcement (offline-first mock verification used).

## Spec links
- UI Reference: `Ui Refrence image/visit page.png`
- Page spec: `docs/03-pages/P05-today-visits.md`
- Feature spec: `docs/02-features/F02-visits.md`

## Acceptance criteria
- [x] Visual layout, cards, typography, and badges match `Ui Refrence image/visit page.png`.
- [x] Top bar displays back button, title, subtitle, and notification bell.
- [x] Date filter allows switching dates and filters visits accordingly.
- [x] Metrics cards accurately reflect Visited vs Not Yet Visited counts.
- [x] Tapping a Visited card displays full visit details.
- [x] Tapping a Not Yet Visited card allows Start Check-in, Edit, or Mark Visited.
- [x] Floating `+ Create Visit` button opens modal and allows adding a new hospital visit.
- [x] 7 realistic Mumbai hospital visits are present by default.
- [x] `yarn typecheck` passes with 0 errors.

## Test plan
- Visual verification in Expo Go on Android against reference image.
- Tap tests for date switcher, sort menu, visit card action modal, and create visit modal.

## Evidence
- `yarn typecheck`:
```bash
$ tsc --noEmit
Done in 13.65s.
```
