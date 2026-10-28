# TASK-009: Fix Hospital Avatar Icon Rendering in Visits List
- Feature: F04 (Visits)   Page: P08 (Visits Screen)   Priority: P1
- Owner (human): Field Agent App Team   Agent role: Planner & Implementer
- Status: done

## Goal (1-2 lines)
Fix the hospital profile/building avatar in the Visits screen list (`HospitalVisitCard`) so it displays crystal clear, perfectly centered, without dotted rings, insets, or clipping, matching `Ui Refrence image/visit page.png`.

## In scope
- Replace `assets/hospital-building.png` with a pristine, anti-aliased 128x128 RGBA asset extracted with exact subpixel coordinates from `Ui Refrence image/visit page.png`.
- Update `HospitalVisitCard.tsx` avatar dimensions and styles:
  - Increase avatar size from 44px/48px to 52x52px for optimal visual balance.
  - Remove background tint overlap (`backgroundColor: 'transparent'`) and eliminate awkward inset borders.
- Run typecheck and verify rendering.

## Out of scope
- Database schema or API contract changes.
- Layout or behavior changes to other screen elements.

## Spec links
- `Ui Refrence image/visit page.png`
- `docs/02-features/`
- `docs/03-pages/`

## Plan
1. **Asset Refinement**: Replace `assets/hospital-building.png` with the anti-aliased, 128x128 PNG (extracted from reference image at exact center `(117.5, 650.5)`, radius `48.5`, with 8x supersampled circle mask and transparent background).
2. **Component Style Polish**: In `src/features/visits/components/HospitalVisitCard.tsx`:
   - Set `avatarWrapper` to `width: 52, height: 52, borderRadius: 26, backgroundColor: 'transparent'`.
   - Set `avatarImage` to `width: 52, height: 52, borderRadius: 26`.
3. **Verification**: Run `yarn typecheck` and verify 0 errors.

## Acceptance Criteria
- [x] Hospital cards in Visits screen display a crisp, complete 3D hospital building avatar with red cross.
- [x] No dotted line, cutting, or double-ring borders around the avatar.
- [x] `yarn typecheck` passes with 0 errors.

## Evidence
- `yarn typecheck`: Passed with 0 errors (`Done in 12.75s`).
- `assets/hospital-building.png`: Clean 128x128 RGBA image with transparent corners and perfect circular mask.

## Risks and unknowns
- None. Pure visual and asset refinement.
