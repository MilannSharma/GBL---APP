# TASK-024: Visits Map to match reference design, with day timeline route and live location
- Feature: F04 Visits Map
- Page: P15 Visits Map
- Priority: P0
- Owner (human): Human Owner
- Agent role(s): Planner
- Status: in-review (code done, device check pending)

## Goal (1-2 lines)
Rebuild `app/map.tsx` to match `Ui Refrence image/map.png` exactly. Draw the route as an activity timeline (first added hospital -> last), and show where the agent is right now.

## Findings (current state)
- `app/map.tsx` uses 4 hard-coded Jaipur hospitals, fake coordinates (`canvasX/canvasY`) and a fake vector "map". This breaks AGENTS.md rules 5 and 10 (no mocks) and must be removed.
- Real hospital `latitude`/`longitude` exist in the local DB (`hospitals` table, `hospitals.repo.ts`) and visits carry `check_in_time`, `latitude`, `longitude`.
- `expo-location` is installed. No map library is installed.
- The reference shows a real city map (roads, parks, water), so a real map renderer is required. A drawn canvas cannot match it.

## In scope
1. Header: back button, "Visits Map" title with the reference subtitle, bell with dot, date pill "Today, <date>" (as in reference).
2. Legend pill: "Visited" / "Not Yet Visited" (blue vs grey pins).
3. Map markers: 3D hospital asset with Visited (green) / Not Visited (grey) tag and a name + area card, as in reference.
4. Timeline route: a blue line connecting hospitals in the order they were added today, from the first to the last. Numbered stops 1..N. The old "Route 1 -> 2 -> 3 -> 4" pill and the "Stop N" badges are removed.
5. Current location: live blue dot with accuracy ring (from `expo-location` watch), plus a "locate me" button that recentres the map.
6. Zoom +/- and locate buttons on the right, as in reference.
7. Bottom sheet "Visited Hospitals", with the `X/Y Visited` chip and a row per visited hospital (name, area, time, date, Visited badge, chevron). Data comes from the local DB via a hook/repository.
8. States: loading, empty (no visits today), error, offline, location permission denied.
9. i18n keys, theme tokens, 44x44 touch targets, accessibility labels.

## Out of scope
- Turn-by-turn navigation or road-snapped routing (needs a routing API, not in docs/07-api).
- Backend changes.

## Spec links
- Reference image: `Ui Refrence image/map.png`
- Previous task: TASK-023
- Docs gap: no `docs/03-pages/` spec for P15 Visits Map yet. Must be written with this task (AGENTS.md rule 1).

## Plan (steps, files)
1. Get approval on the open questions below.
2. Add page spec `docs/03-pages/` for P15 and update `OPEN_QUESTIONS.md`.
3. `src/features/visits/hooks/useVisitsMap.ts` (DB read, ordered by created_at asc, joined with hospital coords).
4. `src/features/visits/hooks/useLiveLocation.ts` (`expo-location` watch, permission handling).
5. Components in `src/features/visits/components/map/` (VisitsMapView, HospitalMarker, MapLegend, VisitedSheet, VisitedRow). Each under ~250 lines.
6. Slim `app/map.tsx` to a thin route file (remove all mock data).
7. Tests for the ordering and visited/not-visited mapping. Run `yarn typecheck && yarn lint && yarn test`.

## Risks and unknowns
- New dependency and possible native config change (risky, section 2.4). Needs approval before install.
- Hospitals without latitude/longitude cannot be pinned. They would appear in the list only.
- Visit "added order" assumed to be `created_at` ascending. Needs confirmation.
- Pixel-perfect 3D markers need the existing `hospital-3d-pin.png`. Grey "Not Visited" variant may need a new asset.

## Acceptance criteria
- [ ] Screen visually matches the reference on a 360x640 and a large phone.
- [ ] No hard-coded hospitals or coordinates anywhere.
- [ ] Blue timeline route runs from the first added hospital to the last, in order.
- [ ] Current location dot is shown and updates; denied permission shows a clear message.
- [ ] Loading / empty / error / offline states present.
- [ ] typecheck, lint, test pass.

## Test plan
Unit: ordering, visited status, missing-coordinate handling. Manual: permission denied, airplane mode, 0 / 1 / many visits.

## Evidence
- `yarn typecheck`: passes, 0 errors.
- `yarn lint` and `yarn test`: could not run. `eslint` and `jest` are not installed and there is no ESLint or Jest config in the repo.
- Not run on a device or emulator yet. Map rendering, markers and route are unverified visually.

## Notes / decisions
- Approved: `react-native-maps`, order by visit time, plan approved by owner.
- Plan changed after reading the code: visits come from the server (`useHospitalVisits`), not the local SQLite tables, so the screen reuses that hook. No new repository was added.
- Server has no not-visited state, so the Visited / Not Yet Visited legend is replaced by the timeline pill.
- Added `visitedAt` to `HospitalVisit` to order the timeline.
- Notification bell has no unread dot because there is no unread data to drive it.
- Android needs the `GOOGLE_MAPS_ANDROID_KEY` EAS secret, set by the owner. A new native build is required.
- Page spec: `docs/03-pages/P21-visits-map.md`.
