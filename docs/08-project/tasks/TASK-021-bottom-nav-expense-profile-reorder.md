# TASK-021: Bottom Navigation Bar Reordering & Expense Tab
- Feature: F01 Navigation   Page: P04 Home / Tabs   Priority: P1
- Owner (human):            Agent role(s): Planner / Implementer
- Status: done

## Goal (1-2 lines)
Update bottom floating tab bar to rename "More" to "Expense" with a wallet/expense icon, and reorder tabs so Tab 4 is "Expense" and Tab 5 (last) is "Profile".

## In scope
- In `app/(tabs)/_layout.tsx`:
  - Reorder tab screen definitions: `index` (Home), `visits` (Visits), `history` (Expense), `profile` (Profile).
  - Update `getTabConfig('history')`: label to "Expense" and icon to wallet icon (`Ionicons name="wallet-outline"` / `wallet`).
  - Maintain Profile tab at 5th position (2nd in right routes) with user icon.
  - Keep active/inactive colors, floating center FAB button, and animations identical.

## Out of scope
- Business logic or backend APIs.
- Changes to individual screen implementations.

## Spec links
- UI reference: `Ui Refrence image/profile & expense.png`

## Plan (steps, files to create/change)
1. Write plan artifact and present to user for approval.
2. Edit `app/(tabs)/_layout.tsx` to:
   - Update tab 4 config: label "Expense", icon `wallet` / `wallet-outline`.
   - Reorder screens in `Tabs` so `history` is 3rd screen (Tab 4) and `profile` is 4th screen (Tab 5).
3. Verify typecheck (`yarn typecheck`).

## Acceptance criteria
- [x] Tab 4 shows label "Expense" with wallet icon (`Ionicons` `wallet` / `wallet-outline`).
- [x] Tab 5 (last) shows label "Profile" with user icon (`Feather` `user`).
- [x] Tab navigation, active indicator, and center FAB work correctly.
- [x] `yarn typecheck` passes with 0 errors.

## Test plan
- Run `yarn typecheck`.
- Verify navigation and active states.

## Evidence
- `yarn typecheck`: Passed with 0 errors in 16.66s.
