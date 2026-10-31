# TASK-016: Clear Warning Messages for Wrong Password / Incorrect Credentials
- Feature: F01 Auth   Page: P02 Login   Priority: P0
- Owner (human): Milan Sharma   Agent role(s): Planner, Implementer
- Status: done

## Goal
Implement clear, explicit, and user-friendly warning messages when an agent inputs a wrong password, incorrect username/contact, or invalid credentials during login.

## Context & User Feedback
User feedback:
> *"wrog pass pee proper warning batao wrong pass or incorrect use name or pass"*

Currently:
1. Technical errors like "Unauthorized" or "Request failed with status code 401" may be shown if the backend returns standard HTTP 401 messages.
2. The user wants a clean, unmistakable warning indicating wrong password or incorrect username/password.
3. The warning UI should be clearly visible with input highlight so the user immediately knows their password or username was rejected.

## In Scope
1. **Error Message Normalization (`src/features/auth/hooks/useAuth.ts`)**:
   - Map 401 / Unauthorized responses cleanly to:
     - Specific backend message if descriptive (e.g. *"Wrong password"*, *"User not found"*).
     - Otherwise friendly standard warning: *"Incorrect username or password. Please try again."*
   - Map network connection failure to *"Cannot connect to server. Please check your network connection."*
   - Add `clearError` helper so typing clears previous error state.
2. **Warning UI & Input Highlighting (`src/features/auth/components/LoginForm.tsx`)**:
   - Enhance the error banner with prominent warning styling (clean red alert container, warning icon, clear typography).
   - Add red border indicator (`#EF4444`) to the username/password fields when an error is present.
   - Clear error state immediately when the user begins typing a new password or username.
3. **Zero-Mock & Zero-Assumption Compliance**:
   - Retain 100% live API authentication against `POST /api/v1/auth/login/agent`.

## Acceptance Criteria
- [x] Submitting a wrong password shows a clear warning: *"Incorrect username or password. Please try again."* (or specific server message like *"Wrong password"*).
- [x] Technical HTTP jargon like "Unauthorized" or "status code 401" is never shown to the user.
- [x] Password and username inputs visually indicate error state (red border) when login fails.
- [x] Typing in either input dismisses the error warning for immediate feedback.
- [x] `yarn typecheck` passes with 0 errors.

## Test Plan & Verification Evidence
1. **TypeScript Typecheck**:
   ```
   yarn run v1.22.22
   $ tsc --noEmit
   Done in 17.91s. (Exit Code: 0)
   ```
2. **Warning UI & Handling**:
   - Verified warning container uses prominent red accent `#FEF2F2` / `#FCA5A5` with bold "Warning" header and message.
   - Both input containers turn red (`borderColor: '#EF4444'`) on failed authentication.
   - Editing either username or password clears the error immediately.
