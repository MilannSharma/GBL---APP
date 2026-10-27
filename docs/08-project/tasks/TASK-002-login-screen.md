# TASK-002: Implement Pixel-Perfect Login Screen
- Feature: F01 Auth   Page: P02 Login   Priority: P0
- Owner (human): Milan Sharma   Agent role(s): Implementer
- Status: done

## Goal
Implement the pixel-perfect Login screen matching `Ui Refrence image/Login Screen.png`, using `Login Bg.png` background graphic and `Glossy GBL Barala Hospital Logo.png`.

## In scope
- Full background layout using `assets/login-bg.png`.
- Centered hospital branding logo `assets/hospital-logo.png`.
- Typography: "Welcome Back" title & "Sign in to continue to your field dashboard" subtitle.
- Form fields: Mobile Number/Username/Email and Password with left icons and eye toggle.
- "Forgot password?" interaction.
- Primary "Sign In" button with right arrow circle badge.
- "or continue with" divider.
- Social buttons: Google and Apple sign-in options.
- Footer security shield badge: "Secure access for authorized field agents".
- Validation & authentication integration in `useAuth`.

## Out of scope
- Live OAuth backend callback implementation (mock integration for UI testing).

## Spec links
- Page spec: `docs/03-pages/P02-login.md`
- Feature spec: `docs/02-features/F01-auth.md`
- UI reference: `Ui Refrence image/Login Screen.png`

## Plan
1. Create task tracking file.
2. Copy graphic assets to `assets/`.
3. Check and ensure `@expo/vector-icons` availability.
4. Update auth schemas and hook.
5. Code `LoginForm.tsx` matching reference design.
6. Connect `app/(auth)/login.tsx`.
7. Verify with `yarn typecheck` and preview on device.

## Acceptance criteria
- [x] Matches `Login Screen.png` visual layout and styling.
- [x] Password visibility toggle works smoothly.
- [x] Accessible touch targets (>= 44px).
- [x] Typecheck passes with 0 errors.

## Test plan
- Manual review on Expo Go device over Wi-Fi.
- Unit validation of input schema.
- Password hide/show toggle test.

## Evidence
- `yarn typecheck` output:
```bash
$ tsc --noEmit
Done in 7.56s.
```

