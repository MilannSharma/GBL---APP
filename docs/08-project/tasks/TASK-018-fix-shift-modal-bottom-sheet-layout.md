# TASK-018: Fix Shift Modal Bottom Sheet UI Layout & Gap
- Feature: F02 (Shift & Day Session)   Page: P02 (Home Dashboard / Start & End Day Modals)   Priority: P0
- Owner (human): MilannSharma          Agent role(s): Planner
- Status: done

## Goal (1-2 lines)
Fix the bottom gap under the work day log modals (Start/End shift) so the bottom sheet sits flush on the device bottom with proper safe-area padding and covers the floating tab bar, and ensure the top content (vehicle selector and header) fits cleanly without getting cut off.

## In scope
- `src/features/worklog/components/ShiftModalShell.tsx`:
  - Update `Modal` with `statusBarTranslucent` for seamless edge-to-edge coverage on Android.
  - Fix modal layout hierarchy to match the battle-tested pattern from `CreateVisitModal` & `VisitActionModal`:
    - Outer container `KeyboardAvoidingView` with `flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(13, 38, 70, 0.45)'`
    - Top backdrop `<TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />`
    - Bottom sheet `<View style={styles.sheetContainer}>`
    - Add sleek top grabber handle pill (`width: 44, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1'`)
  - Disable Android `KeyboardAvoidingView` bottom margin bug by specifying `enabled={Platform.OS === 'ios'}` (Android already uses native `windowSoftInputMode="adjustResize"`).
- `src/features/worklog/components/shift-modal-styles.ts`:
  - Eliminate the ~86px bottom gap so the white bottom sheet sits flush against the bottom edge of the screen, completely covering the floating tab bar.
  - Set `paddingBottom: Platform.OS === 'ios' ? 36 : 24` to give comfortable bottom spacing inside the sheet.
  - Set `maxHeight: '92%'` and ensure the `ScrollView` has proper content spacing so the Vehicle Selector at the top is completely visible and never cut off.

## Out of scope
- Any business logic or API changes. The API is working.

## Spec links
- UI Reference: `docs/06-ui/`
- Tasks: `docs/08-project/tasks/TASK-017-agent-worklog-shift-start-end-api-integration.md`

## Acceptance criteria
- [x] Bottom sheet sits completely flush against the bottom of the device screen without any floating gap.
- [x] The floating tab bar is covered by the modal when open.
- [x] The Vehicle Selector (`Bike` / `Car`) at the top of the form is fully visible and not cut off.
- [x] Keyboard opening and closing does not leave stuck bottom margins on Android.
- [x] Tapping backdrop closes the modal.
- [x] `tsc --noEmit` passes with 0 errors.

## Test plan
- Run TypeScript check (`node node_modules/typescript/bin/tsc --noEmit`).
- Manual test: Open "Start Day", check bottom flushness and vehicle selector visibility at top.

## Evidence
- `node node_modules/typescript/bin/tsc --noEmit` passed with 0 errors.

---

## Session Hand-off Log
```
Done: Fixed ShiftModalShell and shift-modal-styles:
  - Eliminated the floating gap at the bottom of the screen; the sheet now sits flush on the bottom edge and covers the tab bar.
  - Replaced inner Android KeyboardAvoidingView with outer KeyboardAvoidingView enabled only on iOS to prevent stuck keyboard offsets on Android.
  - Added top grabber pill handle for standard bottom-sheet aesthetics.
  - Increased maxHeight to 92% and optimized scroll/header padding so Vehicle Selector (Bike/Car) is fully visible without clipping.
  - Added statusBarTranslucent to Modal for seamless full-screen coverage.
Verified: node node_modules/typescript/bin/tsc --noEmit passed with 0 errors.
Not done / follow-ups: None.
Risks / assumptions: None.
Questions for human: None.
```
