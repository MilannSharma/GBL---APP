# API Usage Map

Checked on 31 Oct 2026 against `https://salesapis.ayurmedicfuture.in` with the Aman agent account. Only read calls (GET and login) were sent. Write calls were not re-tested here, except one visit created on request (see TASK-024).

## How the app calls the backend
- One axios client: [src/api/client.ts](../../src/api/client.ts). Base URL is `EXPO_PUBLIC_API_URL` (host only, `https://salesapis.ayurmedicfuture.in`). Every endpoint path starts with `/api/v1`, so the base URL must not include it.
- The token is read from `expo-secure-store` on each request and sent as `Authorization: Bearer <token>`.
- Timeout 15 s for JSON, 60 s for photo uploads (`multipartConfig`).
- Errors become `AppError`: 401 clears the session and returns to login; 403 FORBIDDEN; 404 NOT_FOUND; other 4xx VALIDATION_ERROR; 5xx SERVER_ERROR; no response NETWORK_ERROR.
- Responses of visits, entities, contacts and worklogs are parsed with Zod at the boundary. Expenses are not (see issues).

## Live endpoints (used by the UI)

| # | Method and path | File | Screen / hook | What it does | Check on 31 Oct |
|---|---|---|---|---|---|
| 1 | `POST /api/v1/auth/login/agent` | `endpoints/auth.ts` | Login, `useAuth`, Profile tab | Sends `username` or `contact` plus `password`. Returns `token`, `refreshToken`, `account`. The token goes to secure store. The account is parsed with Zod, which drops the password hash, and saved as the profile (name, code, username, contact, email, role, assigned states). The Profile tab shows exactly these. | 201 OK |
| 2 | `GET /api/v1/agent/visit?limit=100` | `endpoints/visits.ts` | Home, Visits tab, Map: `useHospitalVisits` | Agent's own visits, newest first. The app keeps only visits whose `visitedAt` is today. `location` is a bare id here, not coordinates. | 200 OK |
| 3 | `GET /api/v1/agent/visit/profile?id=` | `endpoints/visits.ts` | Visit details, Map: `useVisitsMap` | One visit with populated `location.location.coordinates` `[lng, lat]`, contact, selfie. The map calls it once per visit of today to get coordinates. | 200 OK |
| 4 | `GET /api/v1/agent/visit/for-entity?entityId=` | `endpoints/visits.ts` | Hospital page | Team-wide visits of one hospital. | 200 OK |
| 5 | `POST /api/v1/agent/visit/with-entity` | `endpoints/visits.ts` | Add Visit: `useCreateVisit` | Multipart: hospital (id or new), contact (id or new), `location` JSON, `remark`, `selfie`. Online only. Same payload within 2 minutes returns the first visit. | 201 OK (one test visit) |
| 6 | `GET /api/v1/agent/entity/search` | `endpoints/entities.ts` | Hospital search and picker | Prefix search of hospitals in the agent's states. Also pages through the full list for the local directory. | 200 OK |
| 7 | `GET /api/v1/agent/entity-contact/by-entity?entityId=` | `endpoints/entities.ts` | Hospital page, contact picker | Plain array of contacts of one hospital. | 200 OK |
| 8 | `POST /api/v1/agent/entity-contact` | `endpoints/entities.ts` | Add contact: `useAddContact` | Saves a contact on a hospital without a visit. | not re-tested |
| 9 | `POST /api/v1/agent/worklog/start` | `endpoints/worklog.ts` | Start Day: `useWorklog` | Multipart: odometer reading, meter photo, GPS. Once per IST day. | not re-tested (write; token has `isManager`, docs say managers may get 403) |
| 10 | `POST /api/v1/agent/worklog/end` | `endpoints/worklog.ts` | End Day | Same fields with the final reading. | not re-tested |
| 11 | `GET /api/v1/agent/worklog?limit=` | `endpoints/worklog.ts` | History | Paginated shifts. | 200 OK |
| 12 | `GET /api/v1/agent/worklog/user?date=` | `endpoints/worklog.ts` | Day session sync | Shift of one date. Answers 200 with an empty body when there is none. | 200 OK (empty today) |
| 13 | `POST /api/v1/wallet-transaction/debit` | `endpoints/expenses.ts` | Expenses: `useExpenses` | Multipart: amount, type, description, receipt photos. | not re-tested |
| 14 | `GET /api/v1/wallet-transaction?limit=100` | `endpoints/expenses.ts` | Expenses and History | Expense list. The page is in `docs` (fixed in TASK-025; the app used to read `data` and always showed an empty list). | 200 OK |
| 15 | `GET /api/v1/wallet-transaction/profile?id=` | `endpoints/expenses.ts` | Expense detail | One expense. | not re-tested |
| 16 | `DELETE /api/v1/wallet-transaction?id=` | `endpoints/expenses.ts` | Expense detail | Deletes an expense. | not re-tested |

Production data note: several of today's visits are test records located in Mumbai (`72.8777, 19.076`), so the map shows both Mumbai and Jaipur.

## Removed old code (TASK-025)
These came from the first scaffold (27 Oct), written before the real backend existed. None of it matches the backend, so it was removed:
- OTP login screen and `/auth/otp/send`, `/auth/otp/verify`, `/auth/token/refresh`. There is no OTP in this product. "Forgot password?" now shows a message to contact the manager or support.
- The check-in, form, photos, signature, review and done screens, with `features/checkin`, `features/visit-form`, `features/media` and `/visits/:id/check-in`, `/visits/:id/form`. The server has no check-in or check-out.
- `/uploads/presign` and `/uploads/complete`. Files go inside the multipart requests.
- `/hospitals` and the hospitals feature and repository. Hospitals come from the entity endpoints.
- `GET/PUT /profile` and `profileApi`. The Profile tab reads the login account.
- The Sync screen and `/sync/batch`. Add Visit is online only.

## Still open: notifications
`GET /notifications`, `POST /notifications/:id/read` and `POST /notifications/device-token` do not exist on the server (404). The Notifications screen falls back to **mock notifications**. This is planned for a later task.

## Write endpoints, checked without creating data
Empty or invalid requests were sent to confirm each write endpoint exists and validates: worklog start/end, visit create, contact create and expense debit all answered 400 with a clear message; expense delete with an unknown id answered 400 `Invalid id!!`; a wrong password answered 400 `Password is incorrect`; a missing token answered 401. A real shift start, expense or contact was not created.

## Fixed in TASK-025
- Expenses list read the wrong field and was always empty (now reads `docs`, asks for 100 per page).
- Profile tab showed placeholder values ("Raman Sharma", a fake phone, a fake territory). It now shows the login account only, and hides a field the server did not send.

## Issues found, still open
1. Expenses responses are still not parsed with Zod, and the test account has no expenses, so the real expense document shape was not seen.
2. **Notifications use mock data** when the endpoint fails (it always 404s). Needs a backend endpoint or removal of the mock fallback.
4. Production holds test visits (Mumbai coordinates, "ZZ TEST HOSPITAL DELETE ME") that appear on the map.
