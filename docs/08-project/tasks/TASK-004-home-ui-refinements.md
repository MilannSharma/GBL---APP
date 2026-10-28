# TASK-004: Home Screen UI Polish — Logo Alignment & Illustration Edge Blending
- Feature: F02 Visits   Page: P04 Home   Priority: P1
- Owner (human): Milan Sharma   Agent role(s): Planner, Implementer
- Status: done

## Goal
1. Adjust top hospital logo in `HomeHeader.tsx`: increase its dimensions and shift it further to the left to maximize branding prominence.
2. Fix doctor illustration in `HomeWelcomeBanner.tsx` and `assets/doctor-illustration.png`: remove sharp cut/box boundaries and apply soft alpha feathering so the illustration seamlessly blends into the `#F8FBFE` card background without any visible square/rectangular lines.

## In scope
- `HomeHeader.tsx`:
  - Increase logo dimensions from `width: 175, height: 48` to `width: 200, height: 64`.
  - Tight-crop `assets/hospital-logo-horizontal.png` to remove dead transparency on top and right, achieving 3:1 natural aspect ratio and 60% larger visual footprint.
  - Reduce left padding on `headerContainer` from `paddingHorizontal: 20` to `paddingLeft: 14, paddingRight: 20` to shift logo cleanly towards the left edge while keeping the bell icon comfortably spaced.
- `assets/doctor-illustration.png`:
  - Convert image to RGBA format.
  - Transparentize light off-white/cyan background pixels `(~#F2F9FE)` via floodfill.
  - Apply soft anti-aliased edge blur and cosine smoothstep feathering on bottom (40px) and left (20px) edges so perimeter dissolves seamlessly to `alpha = 0`.
- `HomeWelcomeBanner.tsx`:
  - Display the feathered graphic smoothly without clipping or boundary artifacts.

## Out of scope
- Bottom tab bar modifications.
- Changes to API or visit state management.

## Spec links
- UI Reference: `Ui Refrence image/Home Screen.png`
- Page spec: `docs/03-pages/P04-home.md`

## Acceptance criteria
- [x] Hospital logo is noticeably bigger and shifted further to the left.
- [x] Notification bell retains safe touch targets (44x44) and position.
- [x] Doctor illustration has no rectangular box lines or sharp cuts; blends smoothly into `#F8FBFE`.
- [x] `yarn typecheck` passes with 0 errors.

## Test plan
- Inspect on Expo Go Android device.
- Verify logo alignment and illustration background blending.

## Evidence
- `yarn typecheck`:
```bash
$ tsc --noEmit
Done in 15.13s.
```
