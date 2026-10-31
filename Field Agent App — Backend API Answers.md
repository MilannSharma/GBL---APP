# Field Agent App — Backend API Answers

Oct 31, 2026 · @Aman

Of the 5 blocking items (1, 2, 3, 6, 9), only #9 (refresh token) exists today — and it has a bug that affects agents specifically. #1 and #2 need a new agent-scoped route (the shape already exists on an admin-only endpoint, so it's a small add). #3 doesn't exist even at the database level — recommend dropping it from the app rather than waiting on it. #6 is the one real risk: there's no idempotency protection on `with-entity` today, so retries on a flaky connection will create duplicates. Swagger is already live (see Environment section) — that covers your Postman/Swagger ask directly.

## A. Visits

**1. List visits for the logged-in agent — missing, but close.** There's no `GET` on `/agent/visit` today, only `POST /agent/visit` and `POST /agent/visit/with-entity`. The filters you want (`startDate`/`endDate`/`date`, `page`, `limit`) already exist on an admin-only `GET /visit`, returning:

```
{ docs, totalDocs, page, limit, hasNextPage, hasPrevPage, nextPage, prevPage, totalPages, pagingCounter }
```

with `userId`, `entityId`, `entityContactId` populated. We'll add an agent-scoped `GET /agent/visit` that forces `userId` to the caller, same shape. One caveat: don't trust `prevPage` yet — it's computed as `page + 1` instead of `page - 1` in the current code; fixing that in the same pass.

**2. Get a single visit by id — also missing for agents.** Adding `GET /agent/visit/:id`, populated the same way, alongside #1.

**3. Check-out / visit status — doesn't exist, and it's not a one-line add.** A visit record has no status field at all, just `visitedAt`, `entityId`, `entityContactId`, `userId`, `selfie`, `remark`, `location`. It's a single point-in-time record, not a session with a start and end. Please remove the visited/not-visited toggle and the check-out action from the app — there's nothing server-side backing them, confirmed.

## B. Add Visit flow

**4. Entity search returning city/state/hospitalType — yes, easy add.** The data's already on the entity record (`address.city`, `address.state`, `hospitalType` are real fields), the search method just isn't selecting them yet. Adding them to the response.

**5. Contains search — not today, and not a free change.** Search is deliberately prefix-anchored (`^term`) so it can use an index. Opening it to a full "contains" match is a real performance trade-off, not a flag flip — let's discuss whether it's worth it before you assume it'll land.

**6. Idempotency key on `with-entity` — missing, and this is the one I'd actually worry about.** There's no idempotency header and no dedupe check before the transaction creates entity + contact + visit. A retry after a dropped connection will create duplicates today. This needs real backend work (most likely an `Idempotency-Key` header backed by a short-lived dedupe store) before it's safe for your retry case — not something the app can work around alone.

**7. Re-upload selfie for an existing visit — missing.** Adding something like `PATCH /agent/visit/:id/selfie`.

**8. Agent-created entities — yes, intended, but no duplicate guard yet.** Agents can create new entities (`POST /agent/entity`), and `with-entity` explicitly supports creating one inline. There's an index on `name` but it's not unique, so nothing stops five "City Hospital" entities from being created. Let's decide together whether the server should flag near-duplicates before this ships, or whether that stays a UI nudge on your side for now.

## C. Auth & Session

**9. Refresh token — exists, sent as a header, currently buggy for agents.** `POST /auth/refresh` expects the refresh token in an HTTP **header** named `rtoken`, not a JSON body. It returns the same shape as login: `{ token, refreshToken, account }`.

Real issue to fix first: refresh doesn't currently mark the new token as an agent token, so a refreshed agent session falls back to the default 12h access / 7d refresh expiry instead of the 30d/30d an agent login gets. Until that's patched, agents will get logged out well before 30 days after a refresh — hold off building around the 30-day assumption until we confirm the fix is in.

**10. Error body shapes — here's what the server actually returns today** (no custom error formatting, so these are Nest's defaults):

| Status | Example body |
| --- | --- |
| 400 | `{"statusCode":400,"message":"Password is incorrect","error":"Bad Request"}` |
| 401 | `{"statusCode":401,"message":"Unauthorized"}` |
| 403 | `{"statusCode":403,"message":"You do not have permission to access this resource","error":"Forbidden"}` |
| 404 | `{"statusCode":404,"message":"No Contact found!","error":"Not Found"}` |
| 500 | `{"statusCode":500,"message":"Internal server error"}` |

There's no fixed enum of error codes — messages are plain strings thrown ad hoc per case, so match on `statusCode` plus a message substring, not a code list.

## D. Other Screens

**11. Notifications — doesn't exist at all.** No list, mark-read, or push-token registration anywhere in the backend. This is a new module from scratch; agreed it's non-blocking, picking it up after the blocking items.

**12. Get my profile — doesn't exist for agents.** Login currently returns `account` with `_id name code password contact username email isLoginOtp isAdmin isSales isManager isActive canSchoolReportAccess assignedStates`, plus `token`/`refreshToken`. Worth flagging: the password hash is currently included in that payload — please don't store or display it, and we'll strip it server-side too. We'll add an agent-facing `GET /agent/profile`.

**13. App config / min version — doesn't exist.** Nothing for forced updates or minimum-version checks today. Fine to leave as an empty state for now.

## E. Expenses

**14. List response shape — confirmed, here's a real sample.**

```
{ docs, totalDocs, page, limit, hasNextPage, hasPrevPage, nextPage, prevPage, pagingCounter, totalPages, totalCreditAmount }
```

(same `prevPage` bug as the visits list — ignore it for now, fix is coming in the same pass)

Sample item:

```json
{
  "_id": "...", "amount": 450, "transactedAt": "2026-10-20T...", "approvedAt": null,
  "desc": "Hotel stay", "isApproved": false, "transactionType": "debit",
  "expenseType": "HOTEL",
  "billUrls": ["https://ayurmedic-future.s3.ap-southeast-2.amazonaws.com/crm/bill/.../xxx.jpg"],
  "walletId": "...", "createdBy": null, "approvedBy": null, "userId": "...",
  "createdAt": "...", "updatedAt": "..."
}
```

Note `billUrls` is a flat array of URL strings — not objects like the visit `selfie` field, which IS an object (`{url, fileName, fileType, size, uploadTime}`). `expenseType` is exactly one of `HOTEL | MEAL | TRAVEL | OTHER`.

**15. File size/count limits — none enforced server-side today.** No `maxCount` or size limit on the photo or selfie upload handlers. Please keep compressing client-side as planned — the server won't reject an oversized upload right now, which we should probably fix on our end too, but there's no number to design around yet.

## F. Environment

**16. Host/port — already fine, just a firewall check.** The server binds all interfaces on port 4023 (from `API_PORT`), so no code change is needed — please confirm Windows Firewall allows inbound TCP 4023 so the phone can reach it over Wi-Fi. There's no HTTPS/staging URL yet; plain HTTP on the LAN is the only option for now.

On the Postman/Swagger ask: Swagger is already live, no extra work needed. With `SWAGGER_ENABLE=1` the docs UI is served at `/apis` (so `http://<LAN-IP>:4023/apis`), and Nest's Swagger module also exposes the raw spec at `/apis-json` — you can import that JSON straight into Postman as a collection instead of working from the PDF tables.

**17. Test agent account — nothing seeded in code, setting one up.** There's no seed script in the repo, so I'll create a test agent account with assigned states and a few entities under those states and send you the credentials separately.

## Priority — blocking items

| # | Item | Status | Next step |
| --- | --- | --- | --- |
| 1 | List visits | Missing (agent route) | Backend: add `GET /agent/visit` |
| 2 | Get visit by id | Missing (agent route) | Backend: add `GET /agent/visit/:id` |
| 3 | Check-out/status | Doesn't exist, no schema for it | App: remove the toggle and check-out UI |
| 6 | Idempotency key | Missing, real duplicate risk | Backend: add `Idempotency-Key` support |
| 9 | Refresh token | Exists, buggy for agents | Backend: fix the agent-expiry bug before relying on 30 days |
