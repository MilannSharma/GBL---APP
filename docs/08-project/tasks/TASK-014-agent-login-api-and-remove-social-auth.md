# TASK-014: Agent Login API Integration and Remove Social Auth Buttons
- Feature: F01 Auth   Page: P02 Login   Priority: P0
- Owner (human): Milan Sharma   Agent role(s): Planner, Implementer
- Status: done

## Goal
1. Wire `POST /api/v1/auth/login/agent` to the login flow (supporting both username text and numeric contact options).
2. Store the 30-day access token, refresh token, and account object in `expo-secure-store` / `storage`.
3. Remove Google and Apple sign-in buttons and the "or continue with" divider text from the Login screen.

## Evidence
- `yarn typecheck`:
```bash
$ tsc --noEmit
Done in 12.34s.
Exit code: 0
```

## In scope
1. **API Endpoints (`src/api/endpoints/auth.ts` & `src/features/auth/api.ts`)**:
   - Add `loginAgent` endpoint calling `/api/v1/auth/login/agent`.
   - Define TypeScript interfaces `AgentLoginRequest` and `AgentLoginResponse`.
2. **Hook Integration (`src/features/auth/hooks/useAuth.ts`)**:
   - Update `loginWithCredentials(identifier, password)` to invoke `authApi.loginAgent`.
   - If `identifier` is numeric (e.g., 10 digits), pass `contact: Number(identifier)`; otherwise pass `username: identifier`.
   - Save `token`, `refreshToken`, and `account` to `storage`.
3. **UI Cleanup (`LoginForm.tsx` & `app/(auth)/login.tsx`)**:
   - Remove Google and Apple sign-in buttons.
   - Remove the "or continue with" divider text and line.
   - Clean up `onGoogleSignIn`, `onAppleSignIn` props and unused styles.

## Out of scope
- OTP login screen redesign (separate task).

## Acceptance criteria
- [ ] Login screen contains only mobile/username/email input, password input, forgot password, and Sign In button.
- [ ] Google & Apple sign-in buttons and divider text are completely removed.
- [ ] `loginWithCredentials` sends payload to `POST /api/v1/auth/login/agent`.
- [ ] 30-day token and account details are saved in secure storage upon successful authentication.
- [ ] `yarn typecheck` passes with 0 errors.

## Test plan
1. Run `yarn typecheck`.
2. Visual check on Login page to confirm absence of social buttons and divider.
3. Test login submission with valid credentials.
