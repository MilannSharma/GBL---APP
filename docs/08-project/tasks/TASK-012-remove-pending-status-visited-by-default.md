# TASK-012: Remove Pending Status - Record Visits as Visited by Default
- Feature: F02 Visits   Page: P04 Home & P05 Visits   Priority: P0
- Owner (human): Milan Sharma   Agent role(s): Planner, Implementer
- Status: done

## Goal
Remove all "Pending Check-In" and "Not Yet Visited" statuses from the Activity Timeline and Visits cards. Since field agents only add visits to their activity trail when they actually visit a hospital, all added visits are recorded as completed ("Visited").

## Evidence
- `yarn typecheck`:
```bash
$ tsc --noEmit
Done in 17.91s.
Exit code: 0
```

## Context & Rationale
User feedback:
> *"dont show - penidg visint - here and other pages aslo beacsue user agent nee visit kiya hai tabhi activity time line pee show kar rha hai"*

When an agent logs a visit in their daily timeline, they are reporting a visit that has already taken place. Displaying "Pending Check-In" or "Not Yet Visited" creates confusion because the agent only logs actual visits.

## In scope
1. **Add Visit Creation (`CreateVisitModal.tsx`)**:
   - Set newly created visits to `status: 'visited'` by default.
   - Record `checkInTime` automatically matching the visit time.
2. **Activity Timeline (`TodayActivityTimeline.tsx`)**:
   - Remove "Pending Check-In" badge and hourglass icon.
   - Display a clean green badge: `Visited` (or `Visit Recorded`) with checkmark icon.
   - Action label: `View Details >` (opens visit details / actions).
3. **Hospital Visit Card (`HospitalVisitCard.tsx`)**:
   - Remove "Not Yet Visited" badge fallback.
   - Always display `Visited` badge with green checkmark.
4. **Visit Action Modal (`VisitActionModal.tsx`)**:
   - Clean up any "Not Yet Visited" labels to reflect recorded visits.

## Acceptance criteria
- [ ] No "Pending Check-In" or "Not Yet Visited" text appears on the Activity Timeline.
- [ ] No "Pending Check-In" or "Not Yet Visited" text appears on Visits cards or action modals.
- [ ] Added visits are saved with status `visited` by default.
- [ ] Timeline trail nodes show green completed indicator with "Visited" badge.
- [ ] `yarn typecheck` passes with 0 errors.

## Test plan
1. Run `yarn typecheck`.
2. Add a new visit in the app.
3. Verify the Activity Timeline on Home displays "Visited" with green checkmark (no "Pending Check-In").
4. Verify the Visits list displays "Visited" badge.
