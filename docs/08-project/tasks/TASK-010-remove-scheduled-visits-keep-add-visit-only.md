# TASK-010: Remove Pre-Scheduled Visits and Filters - On-Demand Add Visit Workflow
- Feature: F02 Visits   Page: P05 Visits List   Priority: P0
- Owner (human): Milan Sharma   Agent role(s): Planner, Implementer
- Status: planned

## Goal
Remove the pre-scheduled visits system (mock scheduled hospital queue), calendar date filters, and status/sort filters completely. Transition the Visits workflow to an on-demand "Add Visit" model where field agents add hospitals on the go and view their added visits for today.

## Context & Rationale
In the current implementation:
1. The app loads 7 pre-scheduled hospital visits with hardcoded times (09:30 AM, 11:15 AM, etc.).
2. The UI contains a multi-day date picker, status filters ("All", "Visited", "Not Yet Visited"), and sort options ("Scheduled Time", "Hospital Name").
3. In the actual field workflow, hospital visits are not pre-scheduled in advance on a calendar. Instead, field agents only add visits as they visit hospitals.

## In scope
1. **Remove Pre-Scheduled Data (`src/features/visits/api.ts`)**:
   - Clear `memoryVisits` initial state to `[]` so no pre-scheduled visits appear by default.
   - Keep `MUMBAI_HOSPITAL_PRESETS` to allow fast autocomplete/selection when the agent taps "+ Add Visit".
2. **Remove Filters & Date Picker (`VisitsMetricsHeader.tsx` & `DatePickerModal.tsx`)**:
   - Remove the `Filter / Sort` button and the filter modal.
   - Remove the `DatePickerModal` and date dropdown filter.
   - Keep a clean header with back button, screen title ("Visits"), today's date badge, and the synchronized Day Status pill ("Day in progress" / "Day not started").
   - Display clear metrics for today's visits: "Visited" and "Total Added".
3. **Streamline Visits Route (`app/(tabs)/visits.tsx`)**:
   - Remove filter/sort and date state handlers.
   - Provide a clean empty state: "No visits added today yet. Tap '+ Add Visit' to record your first visit."
   - Retain the Day Start Guard: agents must start their day before adding a visit or checking in.
   - Retain "+ Add Visit" action button (both in the empty state and as a floating button).
4. **Update Add Visit Modal (`CreateVisitModal.tsx`)**:
   - Update header from "New Schedule" to "Add Hospital Visit".
   - Set visit time automatically to the current time (with option to adjust), removing pre-planning schedule semantics.
5. **Update Home Screen References (`HomeQuickActions.tsx`)**:
   - Change the "Schedule" shortcut card to "Add Visit" (with icon and direct routing to add visit).
6. **Hook Simplification (`useHospitalVisits.ts`)**:
   - Remove unused filter and sort states.

## Out of scope
- Backend API integration (using local mock/storage per Rule 5).
- Offline SQLite mutations migration (separate task).

## Acceptance criteria
- [ ] No pre-scheduled hospital visits appear by default; list starts empty for a new day.
- [ ] Filter / Sort button and modal are completely removed.
- [ ] Calendar Date Picker dropdown is removed; header displays clean current day context.
- [ ] Tapping "+ Add Visit" allows the agent to quickly select or type a hospital and add it to today's visits.
- [ ] Newly added visits appear in the list with check-in capability.
- [ ] Day Start Guard remains active to prevent adding or checking in before starting the day.
- [ ] "Schedule" shortcut on Home screen is updated to "Add Visit".
- [ ] `yarn typecheck` passes with 0 errors.

## Test plan
1. Run `yarn typecheck` to verify no broken props or imports.
2. Verify Visits tab renders cleanly with no filters and no pre-scheduled visits.
3. Test adding a visit via "+ Add Visit" and verifying it appears in the list.
4. Verify Day Start Guard triggers if user attempts to add a visit while day is not started.
