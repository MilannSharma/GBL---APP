# TASK-003: Implement Pixel-Perfect Home Dashboard
- Feature: F02 Visits   Page: P04 Home   Priority: P0
- Owner (human): Milan Sharma   Agent role(s): Planner, Implementer
- Status: done

## Goal
Implement the pixel-perfect Home Dashboard screen matching `Ui Refrence image/Home Screen.png`, including top branding, notification bell, welcome banner with doctor graphic, "Today's Visit" hero card with "Start Day" toggle, "Quick Actions" grid, "Today's Overview" stats card, and custom floating tab navigation.

## In scope
- Top header: Hospital branding logo and notification bell with unread badge.
- Welcome section: Agent greeting with stylized typography and doctor illustration asset (`assets/doctor-illustration.png`).
- Today's Visit Hero Card: Blue gradient card with calendar badge, visits count, "Day not started yet" status, chevron link, and prominent white "Start Day" pill button.
- Quick Actions: 4 card shortcuts ("My Profile", "Schedule", "Reports", "Settings") with custom pastel icons and navigation links.
- Today's Overview: Metrics card with Visited count, Not Yet Visited count, dynamic timestamp, and helper info banner.
- Custom Tab Bar: Refined bottom tab dock with center raised Action Button.
- Pull-to-refresh and offline resilience.

## Out of scope
- Full backend sync engine for visits (mock/local repository layer used per architecture).

## Spec links
- Page spec: `docs/03-pages/P04-home.md`
- Feature spec: `docs/02-features/F02-visits.md`
- UI Reference: `Ui Refrence image/Home Screen.png`

## Plan
1. Create `TASK-003-home-screen.md` tracking document.
2. Ensure doctor illustration asset is saved in `assets/doctor-illustration.png`.
3. Create modular Home components in `src/features/visits/components/`:
   - `HomeHeader.tsx` (Logo + notification bell)
   - `HomeWelcomeBanner.tsx` (Greeting + doctor graphic)
   - `HomeHeroCard.tsx` (Today's visit + Start Day action)
   - `HomeQuickActions.tsx` (4 shortcut cards)
   - `HomeOverviewCard.tsx` (Visited/Not visited metrics + info notice)
4. Create `src/features/visits/components/HomeDashboard.tsx` combining all sections in a smooth, responsive scroll view.
5. Update `app/(tabs)/index.tsx` to render `HomeDashboard` with pull-to-refresh.
6. Customize `app/(tabs)/_layout.tsx` to display the floating tab dock matching the design with the elevated center button.
7. Verify with `yarn typecheck` (0 errors) and test on Expo Go device.

## Acceptance criteria
- [x] Visual layout, colors, and typography match `Ui Refrence image/Home Screen.png`.
- [x] "Start Day" button state toggles smoothly.
- [x] Quick Action buttons navigate to their respective screens (`/profile`, `/visits`, `/history`, `/settings`).
- [x] Notification bell navigates to `/notifications`.
- [x] Bottom tab bar features custom styling and center action button.
- [x] `yarn typecheck` passes with 0 errors.

## Test plan
- Manual check on user's Expo Go Android phone.
- Tap tests for Start Day, Quick Actions, Bell icon, and Tabs.
- Verify status bar and safe areas.

## Evidence
- `yarn typecheck`:
```bash
$ tsc --noEmit
Done in 19.71s.
```

