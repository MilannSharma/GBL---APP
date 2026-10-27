# F01 Authentication [DRAFT]

**Priority:** P0 | **Code:** `src/features/auth/` | **Screens:** Splash, Login, OTP (if used)

## Goal
Let a verified agent sign in securely and stay signed in.

## User stories
- As an agent, I log in with my credentials so I can see my visits.
- As an agent, I stay logged in so I do not log in at every app open.
- As an agent, I can log out, especially on a shared device.

## Requirements
1. Login with method confirmed in `OPEN_QUESTIONS.md` (#1): OTP or email+password.
2. Store access and refresh tokens in secure storage only.
3. Silent token refresh on 401, one retry, then logout.
4. Splash screen decides route: valid session -> Home; else Login.
5. Optional biometric/PIN lock when app returns from background (setting in Profile).
6. Logout clears tokens and push token registration.
7. Rate-limit feedback: show backend error for too many attempts.

## Business rules
- Only backend validates credentials. App never stores passwords.
- Inactive session timeout value comes from backend/config.

## States
Idle, Submitting, Invalid credentials, Network error, Account disabled, Session expired.

## Offline behavior
Login needs network the first time. Afterwards the app opens offline using the stored session and cached data.

## API dependencies
`POST /auth/login`, `POST /auth/otp/verify`, `POST /auth/refresh`, `POST /auth/logout`, `GET /me` (see `07-api/modules/auth.md`).

## Analytics
`login_started`, `login_success`, `login_failed{reason}`, `logout`.

## Acceptance criteria
- [ ] Valid login lands on Home in under 2s on good network
- [ ] Wrong credentials show a clear message, no crash
- [ ] Killing and reopening the app keeps the session
- [ ] Expired refresh token returns the user to Login without losing queued data
- [ ] Tokens are not visible in logs or plain storage
