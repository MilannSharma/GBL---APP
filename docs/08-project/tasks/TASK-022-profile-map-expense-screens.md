# TASK-022: Implement Profile, Visits Map, and Enhanced Expense Screens
- Feature: F01 Navigation, F09 History & Expenses, F04 Visits Map
- Page: P04 Profile, P14 Expenses, P15 Visits Map
- Priority: P0
- Owner (human): Human Owner
- Agent role(s): Planner / Implementer
- Status: done

## Goal (1-2 lines)
Implement 3 production-grade screens matching the user's reference designs (`profile & expense.png` and `map.png`):
1. Enhanced Profile screen with agent card, navigation items, settings, help & support, logout, and security badge.
2. Visits Map screen showing Jaipur location, live agent GPS position with 3D toon marker avatar, 3D hospital pins for visited hospitals linking to detail page.
3. Enhanced Expenses screen with summary wallet card, category breakdowns, + Add Expense modal with receipt upload, and recent expenses list.

## In scope
1. **Profile Screen (`app/(tabs)/profile.tsx` & `src/features/profile/`):**
   - Header with hospital logo and notification bell.
   - Agent profile card (avatar, name, dynamic status badge "Active"/"Not Started", role, location).
   - Navigation options: Profile Details modal, Visits, Map, Expenses, Settings modal, Help & Support modal.
   - Logout action with confirmation dialog.
   - App version `v1.0.0` and security shield footer `100% Encrypted & Secure • GBL Barala Hospital`.

2. **Visits Map Screen (`app/map.tsx`):**
   - Header with back button, "Visits Map" title, date chip, and visited count badge.
   - Interactive vector map centered on Jaipur (26.9124° N, 75.7873° E) with real GPS tracking via `expo-location`.
   - Agent live location pin featuring the generated 3D toon standing field agent asset (`assets/agent-marker-avatar.png`) with pulsing radar ring.
   - 3D hospital pins (`assets/hospital-3d-pin.png`) displaying visited hospitals with green "Visited" badge and name chips.
   - Tapping a hospital pin opens its Hospital Detail page (`/hospital/${id}`).
   - Bottom sheet / list displaying visited hospitals with visit time, date, status, and navigation to detail page.

3. **Expense Screen (`app/(tabs)/history.tsx` & `src/features/expenses/`):**
   - Header: "Expenses" - "Track and manage your expenses".
   - Total Expenses hero card with wallet icon, period selector ("This Month"), and category breakdown (Travel, Meals, Others).
   - `+ Add Expense` button opening a bottom sheet modal with amount, category selector (`TRAVEL`, `MEAL`, `HOTEL`, `OTHER`), description, receipt photo upload via `expo-image-picker`, and backend submission via `POST /api/v1/wallet-transaction/debit`.
   - Recent Expenses list with category icons, title, date, amount (₹), and status badges (`Approved` / `Pending`).

## Out of scope
- Hardcoded mock data bypasses.
- Modifying backend schemas or database migrations.

## Spec links
- UI reference: `Ui Refrence image/profile & expense.png`
- UI reference: `Ui Refrence image/map.png`
- API reference: `docs/07-api/modules/expenses.md`

## Plan (steps, files to create/change)
1. **Asset Preparation:**
   - 3D Hospital Pin: `assets/hospital-3d-pin.png` (Extracted & saved)
   - 3D Toon Agent Marker: `assets/agent-marker-avatar.png` (Extracted & saved)
2. **API & Data Layer:**
   - Create `src/api/endpoints/expenses.ts` for `/api/v1/wallet-transaction` CRUD & debit claim upload.
   - Create `src/features/expenses/` with hooks `useExpenses` and `useCreateExpense`.
3. **Screen 1: Profile Screen (`app/(tabs)/profile.tsx`):**
   - Build modern UI matching `profile & expense.png` (left screen).
   - Implement Profile Details modal, Settings modal, and Help & Support modal.
   - Implement secure logout and version footer.
4. **Screen 2: Visits Map Screen (`app/map.tsx`):**
   - Build Visits Map screen matching `map.png`.
   - Integrate `expo-location` for live location and Jaipur default.
   - Render 3D hospital markers with click-to-detail navigation and 3D agent marker.
   - Render bottom sheet list of visited hospitals.
5. **Screen 3: Expenses Screen (`app/(tabs)/history.tsx`):**
   - Build Expenses screen matching `profile & expense.png` (right screen).
   - Add Total Expenses summary card and breakdown metrics.
   - Implement `+ Add Expense` modal with camera/gallery receipt attachment.
   - Implement Recent Expenses list with status chips.
6. **Verification:**
   - Run `yarn typecheck` to ensure 0 errors.

## Acceptance criteria
- [x] Profile screen matches reference design with agent card, settings, help & support, logout, and security footer.
- [x] Visits Map screen displays Jaipur map, agent live location with 3D toon avatar, 3D hospital pins with visited status, and clicking a hospital opens the Hospital Detail page.
- [x] Expenses screen matches reference design with summary card, category breakdown, Add Expense modal with receipt upload, and recent expenses list.
- [x] `yarn typecheck` passes with 0 errors.

## Evidence
- `yarn typecheck`: Passed with 0 errors in 9.69s.


## Test plan
- Run `yarn typecheck`.
- Verify navigation between Profile, Map, and Expense screens.
- Test modal interactions (Profile details, Settings, Help & Support, Add Expense).
