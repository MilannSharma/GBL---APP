# TASK-011: Home Activity Timeline (Trail of Visits) & Button Cleanup
- Feature: F02 Visits / F11 Home   Page: P04 Home & P05 Visits   Priority: P0
- Owner (human): Milan Sharma   Agent role(s): Planner, Implementer
- Status: done

## Goal
1. Clean up duplicate buttons on the Visits page so there are only 2 buttons (empty state button + floating FAB).
2. On the Home page, remove "Quick Actions" and "Today's Overview".
3. Implement a rich "Today Activity Timeline" showing the user's daily trail:
   - Day Started (with start timestamp)
   - Trail of visits added by the user (hospital name, added timestamp, status)
   - Day End / In Progress indicator

## Evidence
- `yarn typecheck`:
```bash
$ tsc --noEmit
Done in 19.31s.
Exit code: 0
```

## Context & User Feedback
The user provided screenshots and requested:
1. "there is 3 buton - just give 2 buttons onlly" -> In Visits screen, remove the top-right header "+ Add Visit" button. Keep only the empty state action and the floating FAB.
2. "remove qucink action section" -> Remove Quick Actions grid from Home.
3. "remove today overview" -> Remove Today's Overview cards from Home.
4. "just show today activity time line: start -> trail of visits added by user (hospital name & added time stamp) -> the end. make more better for user exprunce."

## In scope
1. **Visits Screen Button Cleanup (`VisitsMetricsHeader.tsx` & `app/(tabs)/visits.tsx`)**:
   - Remove the small `+ Add Visit` button from the section header in `VisitsMetricsHeader.tsx`.
   - Result: Exactly 2 buttons when empty (empty state button + floating FAB); 1 button when items exist (floating FAB).
2. **New Activity Timeline Component (`TodayActivityTimeline.tsx`)**:
   - Location: `src/features/visits/components/TodayActivityTimeline.tsx`.
   - Visual vertical timeline with connecting route line:
     - **Start Node**: "Daily Shift Started" + timestamp (e.g. 8:04 PM).
     - **Visit Nodes**: Trail of all visits added by the user today. Displays hospital name, added timestamp, and visited/pending status badge.
     - **Empty Trail Placeholder**: If 0 visits added yet, shows a clean dashed step "No visits logged yet. Tap to add a visit."
     - **End Node**: "Shift In Progress..." (or "Shift Ended" with timestamp if completed).
3. **Home Dashboard Integration (`HomeDashboard.tsx` & `app/(tabs)/index.tsx`)**:
   - Remove `HomeQuickActions` and `HomeOverviewCard`.
   - Embed `TodayActivityTimeline`.
   - Wire `visits` from `useHospitalVisits()` so visits added on the Visits tab immediately appear in the Home Activity Timeline.
4. **Export Cleanliness (`src/features/visits/index.ts`)**:
   - Export `TodayActivityTimeline`.

## Out of scope
- GPS live breadcrumb tracking (mock trail based on added visits & day shift).

## Acceptance criteria
- [ ] Visits screen has only 2 buttons in empty state (empty state button + floating FAB; header button removed).
- [ ] Home screen no longer shows Quick Actions or Today's Overview.
- [ ] Home screen displays "Today Activity Timeline".
- [ ] Timeline displays: Start Day timestamp, trail of user-added visits (with hospital name, timestamp, and status), and Day End / In Progress node.
- [ ] Adding a visit dynamically adds it to the Activity Timeline trail.
- [ ] TypeScript passes with 0 errors.

## Test plan
1. Run TypeScript check.
2. Verify Visits screen has no duplicate header button.
3. Verify Home screen displays the Activity Timeline with Start timestamp.
4. Add a visit and confirm it immediately appears in the Home timeline trail with hospital name and timestamp.
