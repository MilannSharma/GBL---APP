# TASK-025: API audit and build preparation
- Feature: Platform
- Page: none
- Priority: P0
- Owner (human): Human Owner
- Agent role(s): Implementer
- Status: in-review

## Goal
Check every API the app calls, document what each one does, and prepare the project for EAS builds.

## In scope
1. Confirm the production base URL in code and `.env`.
2. Read-only live check of every endpoint the UI uses.
3. `docs/07-api/API_USAGE_MAP.md`.
4. `eas.json` with development, preview and production profiles.
5. `docs/04-engineering/BUILD_GUIDE.md`.

## Out of scope
Fixing the issues found (listed in the API usage map). They need their own tasks.

## Also done
- Profile tab now shows the login account; the placeholder values were removed.
- Expenses list fixed (read `docs`, 100 per page).
- ESLint 9 (flat config) and Jest (`jest-expo`) added. Lint errors fixed in existing code; 15 warnings from older code remain.
- 19 unit tests: map stop ordering and coordinates, frame region, profile rows, login schema (password dropped), expenses list shape, create-visit form checks.
- Unused `READ_EXTERNAL_STORAGE` and `WRITE_EXTERNAL_STORAGE` Android permissions removed.

## Dead code removed (owner approved)
OTP screen and endpoints, check-in to done screens, `features/checkin`, `features/visit-form`, `features/media`, `features/hospitals`, `features/sync`, the Sync screen, and the hospitals, profile, uploads and sync endpoints. Notifications mock stays for a later task.

## App icon
`assets/icon.png` and `assets/adaptive-icon.png` are generated from `Images/GBL App icon.png`.

## Evidence
- Base URL: `src/core/config/index.ts` reads `EXPO_PUBLIC_API_URL`; `.env` holds the host only, and every endpoint path starts with `/api/v1`.
- Live GET check: 7 endpoints answered 200; `/hospitals`, `/notifications`, `/profile` and two `/api/v1/...` guesses answered 404.
- `expo config --type prebuild`: Android Maps key resolves from `.env`, package `com.gblh.fieldagent`.

## Notes / decisions
- `eas.json` created at the owner's request (AGENTS.md section 2.5, "ask first").
- No build was run. It needs the owner's Expo login (`eas login`, `eas init`) and the `GOOGLE_MAPS_ANDROID_KEY` EAS secret.
