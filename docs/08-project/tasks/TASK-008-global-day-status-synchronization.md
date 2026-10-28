# TASK-008: App-Wide Day Status Synchronization & Persistence
- Feature: F02 Visits, F01 Auth/Session   Pages: P04 Home, P05 Visits, P06 Visit Detail   Priority: P0
- Owner (human): Milan Sharma   Agent role(s): Planner, Implementer
- Status: done

## Goal
Ensure that starting or ending the day from ANY page or modal (Home Screen, Visits Screen, Guard Popup, or Visit Detail) immediately updates the day status in real-time across ALL pages, components, and tabs, without any detached local state or out-of-sync indicators.

## Root Cause Analysis
In `HomeHeroCard.tsx`, day state was stored in a local decoupled state variable `const [dayActive, setDayActive] = useState(isDayStarted)`. Because `useState` initial values are only read on initial component mount, starting the day from the Visits page or Guard popup did not update `HomeHeroCard` when returning to Home.

## In scope
1. **Direct Zustand Store Subscription in Components**:
   - `HomeHeroCard.tsx`: Read `isDayStarted`, `dayStartTime` directly from `useDaySessionStore`. Remove detached local `dayActive` state. Toggling "Start Day" / "End Day" triggers `startDay()` / `endDay()` in the global store.
   - `HomeOverviewCard.tsx`: Read `isDayStarted` directly from `useDaySessionStore` to update metrics card banners in real time.
   - `VisitsMetricsHeader.tsx`: Read directly from `useDaySessionStore` so status pill changes color and text dynamically.
   - `app/(tabs)/visits.tsx` & `StartDayGuardModal.tsx`: Connect directly to the shared store.
   - `app/visit/[id]/index.tsx`: Connect to `useDaySessionStore` so check-in action verifies active day status and allows starting day directly if needed.
2. **Local Storage Persistence**:
   - Persist day session status to `storage.keys` in `useDaySessionStore.ts` so that app reload (`r` in Expo CLI) or app restart retains active shift state.

## Out of scope
- Server-side shift clock-in punch card API (mock/local storage layer used per architecture).

## Spec links
- UI Reference: `Ui Refrence image/Home Screen.png` and `Ui Refrence image/visit page.png`
- Feature spec: `docs/02-features/F02-visits.md`
- Architecture: `docs/04-engineering/ARCHITECTURE.md`

## Acceptance criteria
- [x] Starting day on Home immediately marks day started on Visits page.
- [x] Starting day on Visits page (or Guard popup) immediately marks day started on Home page.
- [x] Ending day from any screen immediately updates all other screens.
- [x] App reload retains active day state.
- [x] `yarn typecheck` passes with 0 errors.

## Test plan
- Verify starting day on Visits -> navigate to Home -> Home card shows "Day in progress" and "End Day".
- Verify ending day on Home -> navigate to Visits -> Visits status pill shows "Day not started".
- Verify reload app in Expo -> state persists.

## Evidence
- `yarn typecheck`:
```bash
$ tsc --noEmit
Done in 9.73s.
```
