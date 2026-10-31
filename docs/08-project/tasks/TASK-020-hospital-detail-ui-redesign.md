# TASK-020: Redesign Hospital Detail Page UI
- Feature: F03 Hospitals   Page: P07 Hospital Detail   Priority: P1
- Owner (human):           Agent role(s): Planner / Implementer
- Status: done

## Goal (1-2 lines)
Polish and modernize the Hospital Detail page UI (`HospitalDetailScreen.tsx`) to match the app's premium design system (cards, badges, typography, icons, aligned headers, and emerald call button) with strictly ZERO changes to business logic or state.

## In scope
- Upgrade top header with floating circular back button and typography matching `Ui Refrence image/visit page.png`.
- Hospital card: Add soft blue container for 3D building icon, pill badge for hospital type, location pin icon for address, and modern card elevation.
- Section headers: Add section icons, count badges, and aesthetic pill button for "+ Add contact".
- Contact cards: Modern circular user avatar, role badge, phone row, and glowing emerald call button.
- Visit history cards: Agent pill badge, clock icon timestamp, structured "Met With" container, and styled remark note bubble.
- Full compliance with typography, spacing, and colors from design system tokens.

## Out of scope
- Any API, state, query, or data model changes (strictly UI only as requested by user).
- Modifying modal workflows or navigation routes.

## Spec links
- Page spec: `docs/03-pages/P07-hospital-detail.md`
- UI reference: `Ui Refrence image/visit page.png`

## Plan (steps, files to create/change)
1. Write detailed design proposal in dedicated artifact page for user review and approval.
2. Modify `src/features/visits/components/HospitalDetailScreen.tsx`:
   - Replace generic `<Header />` with polished in-screen header featuring circular back button and subtitle.
   - Refactor `hospitalCard` with icon badge, hospital type pill tag, and location icon.
   - Refactor `contacts` list items with circular avatar, role chip, and glowing call action.
   - Refactor `VisitEntry` timeline cards with agent badge, structured met-box, and remark note bubble.
3. Verify TypeScript (`yarn typecheck`).

## Risks and unknowns
- None: Pure UI presentation update within single component file, preserving all props, queries, and callbacks.

## Acceptance criteria
- [x] Top header has circular back button and aligned typography.
- [x] Hospital card looks premium with soft shadow, building icon badge, type pill, and address pin.
- [x] Contact cards have circular user avatars, styled role chips, and emerald call buttons.
- [x] Visit entries feature agent badges, timestamps with icons, and structured remark bubbles.
- [x] Zero logic, hook, or state regressions.
- [x] `yarn typecheck` passes with 0 errors.

## Test plan
- Manual check: verify alignment, contrast, touch targets, and typography on device/emulator.
- Typecheck: `yarn typecheck` 0 errors.

## Evidence
- `yarn typecheck` output: 0 errors (Done in 15.99s).

