# TASK-007: Visits Page Enhancements: Calendar Date Selector, Visited Filter, Day Start Guard
- Feature: F02 Visits   Page: P05 Visits List   Priority: P0
- Owner (human): Milan Sharma   Agent role(s): Planner, Implementer
- Status: done

## Goal
1. Add an interactive Date Selector with a day/calendar grid so the user can select any specific date, not just fixed presets.
2. Add Visited vs Not Yet Visited filters in the Sort/Filter menu that immediately update the list.
3. Implement the mandatory "Start Day Guard" flow: field agents cannot add, edit, or check in to any visit until their day is started. Attempting any action while the day is not started displays a clean warning popup with a prominent "Start Day Now" button.
4. Persist and synchronize the "Day Started" status across the app (Visits and Home) with start timestamp and proper visual indicators.

## In scope
1. **Shared Day Session Store (`src/features/visits/store/useDaySessionStore.ts`)**:
   - Manage `isDayStarted`, `dayStartTime` using Zustand.
   - Persist status so Home screen hero card and Visits screen status pill remain 100% in sync.
2. **Interactive Date Selector (`VisitsMetricsHeader.tsx` & `DatePickerModal.tsx`)**:
   - Quick pills: "Today", "Yesterday", "Tomorrow", "All Dates".
   - Interactive calendar day grid (current month dates 1..30) allowing selection of any custom date.
   - Dynamic list filtering when a date is selected.
3. **Filter & Sort Menu (`VisitsMetricsHeader.tsx` & `useHospitalVisits.ts`)**:
   - Status Filters: "All Visits", "Visited Only", "Not Yet Visited Only".
   - Sorting: "Scheduled Time", "Hospital Name (A-Z)".
   - Instant visual update of the visits list and metrics.
4. **Day Start Guard Modal (`StartDayGuardModal.tsx`)**:
   - Triggered when `isDayStarted === false` and user tries to:
     - Tap a visit card
     - Tap the floating `+ Create Visit` button
   - Displays warning: "Please Start Your Day First"
   - Explanatory message: "You must start your daily shift before performing check-ins, editing schedules, or adding new hospital visits."
   - Button: "Start Day Now" (with play icon).
   - Tapping starts the day, updates pill to "Day Started (Time)", and dismisses popup.
5. **Day Status Pill & Details (`VisitsMetricsHeader.tsx`)**:
   - When not started: Blue/Amber pill "Day not started (i)". Tapping prompts "Start Day Now".
   - When started: Green pill "Day in progress (Time)" with checkmark. Tapping shows day summary (start time, visits progress, end day option).

## Out of scope
- GPS geofencing hardware verification.

## Spec links
- UI Reference: `Ui Refrence image/visit page.png`
- Feature spec: `docs/02-features/F02-visits.md`
- Page spec: `docs/03-pages/P05-today-visits.md`

## Acceptance criteria
- [x] Clicking the date pill allows picking any day from a calendar grid.
- [x] Sort/Filter menu allows filtering by "Visited Only" and "Not Yet Visited Only", updating the list instantly.
- [x] Attempting to add, edit, or check-in before starting the day triggers the "Please Start Your Day First" popup.
- [x] Tapping "Start Day Now" in the popup immediately starts the day and marks the status pill green.
- [x] Day status is synchronized between Home and Visits screens.
- [x] `yarn typecheck` passes with 0 errors.

## Test plan
- Visual check on Expo Go Android.
- Tap test Date picker modal with custom day selection.
- Tap test Filter Status (Visited, Not Visited, All).
- Tap test Guard Modal when day is not started.

## Evidence
- `yarn typecheck`:
```bash
$ tsc --noEmit
Done in 12.61s.
```
