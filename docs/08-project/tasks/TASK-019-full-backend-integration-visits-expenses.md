# TASK-019: Full backend integration (visits, entities, expenses, cleanup of mocks)
- Feature: F02 / F09   Page: Home, Visits, History/Expenses   Priority: P0
- Owner (human): Aman   Agent role(s): Planner (this doc) -> Implementer -> Reviewer (separate pass)
- Status: in-progress (Phase 0 + 1 implemented, typecheck green, not yet run on device; Phase 2/3 pending)

## Goal
Replace every in-memory / mock layer with the real local backend (`/api/v1`), using only endpoints that are documented in `docs/07-api/`. Nothing invented.

## Source of truth read
- `docs/07-api/agent-app-api-reference.pdf` (3 endpoints: entity search, contacts by entity, visit with-entity)
- `docs/07-api/SALES_CRM_API_REFERENCE.md` (auth, worklog, expenses)
- `.env`: `EXPO_PUBLIC_API_URL` = production server, `https://salesapis.ayurmedicfuture.in` (host only: every endpoint path already starts with `/api/v1`). Was the local server `http://<lan-ip>:4023`.

## Current state (audit)
| Area | Backend endpoint documented? | App status |
|---|---|---|
| Agent login | Yes | DONE (TASK-014/015/016). Live only, no mock |
| Worklog start/end/read | Yes | DONE (TASK-017/018) |
| Entity search | Yes (PDF) | NOT built |
| Entity contacts by entity | Yes (PDF) | NOT built |
| Create visit `with-entity` | Yes (PDF) | NOT built. `CreateVisitModal` uses `MUMBAI_HOSPITAL_PRESETS` and `visitsApi` keeps visits in a memory array |
| Expenses (wallet-transaction CRUD) | Yes | NOT built. `app/(tabs)/history.tsx` has no expense code |
| Visit **list** / get by id | **NO** | Visits tab and Home timeline read the memory array |
| Visit check-out / visited toggle | **NO** | `toggleHospitalVisitStatus` is local only |
| Notifications | **NO** (module doc is a template) | `notifications/api.ts` has `mockNotifications` + silent catch |
| Hospitals / Profile / Uploads / Sync / App-config | **NO** (old template docs) | stubs in `src/api/endpoints/*` call guessed paths |
| Token refresh | **NO** (`/auth/token/refresh` was a guess) | 401 just clears the token |

## In scope (phases, one PR each)
**Phase 0 - Foundation (docs + client)**
1. Add PDF endpoints to `docs/07-api/modules/visits.md` (new `entities.md`), fix stale `README.md` row (worklog path says `/api/v1/worklog`, real is `/api/v1/agent/worklog`).
2. Fill `CONVENTIONS.md` "Actual" column with what is known (plain JSON, no `{data}` envelope, mongoose-paginate shape `docs/totalDocs/page/...`, 30-day JWT, error body `message`).
3. `client.ts`: on 401 also notify auth store so the user lands on login (today only the token is deleted). Handle `Content-Type` for FormData per `worklog.ts` pattern; extract shared `multipartConfig` to `src/api` (reuse, not copy).

**Phase 1 - Entity picker + Add Visit (core of the PDF)**
1. `src/api/endpoints/entities.ts`: `searchEntities(name,page,limit)`, `getContactsByEntity(entityId)`; Zod schemas (docs list shape, contact `role` enum MEDICAL_DIRECTOR/ADMINISTRATOR/DOCTOR/NURSE/OTHER).
2. `src/api/endpoints/visits.ts`: `createVisitWithEntity()` multipart with bracket-notation fields (`entity[name]`, `entity[address][city]`, `entityContact[contact]`, `location[latitude]`, `selfie`). Never send `visitedAt`/`userId`. Client-side XOR validation mirroring server rules (entityId vs entity.name, entityContactId vs entityContact) via Zod.
3. Rebuild `CreateVisitModal` into a feature flow: debounced prefix search -> pick or "new entity" -> contacts list or "new contact" -> GPS (reuse `worklog/useShiftLocation`) -> selfie (reuse `worklog/useMeterPhoto` pattern, front camera) -> optional remark -> submit. Optional `worklogId` = today's worklog `_id`.
4. Handle response with missing `visit.selfie` (S3 failed after commit): show "saved, photo upload pending", keep visit, offer retry. Needs answer to Q3.
5. Remove `MUMBAI_HOSPITAL_PRESETS`, `memoryVisits`, i18n keys for presets. Strings via i18n.
6. States: loading / empty / error / offline for the search list; tests for XOR validation, field-name serialization, error mapping (all 9 documented 400 messages).

**Phase 2 - Expenses**
1. `src/api/endpoints/expenses.ts`: debit (multipart `photos[]`), list (filters + pagination), get by id (`/profile?id=`), PATCH (JSON), DELETE (`?id=`). Enum `HOTEL|MEAL|TRAVEL|OTHER` (not FOOD).
2. `src/features/expenses/` (api, schemas, hooks, components) exposed via `index.ts`; wire into History/Expenses page per `docs/03-pages` (check P14 spec before coding).
3. Approved expenses: hide edit/delete in UI (server also rejects).

**Phase 3 - Mock removal / honest empty states**
1. Notifications: remove `mockNotifications` and silent `catch`. Until backend documents it, show a real empty/"not available" state. (Q5)
2. Delete stub endpoint files with guessed paths (hospitals, profile, sync, uploads, old OTP/refresh) **only after approval** - AGENTS.md "ask before deleting".
3. Profile screen: show data from login `account` (`_id`, `name`, `isManager`) only. No invented fields.

**Phase 4 - Offline/outbox (only after Q3 answered)**

## Out of scope
Visit list/history screens that need a GET visits endpoint (blocked, see Q1), push notifications, check-out, DB migrations, app.config changes.

## Blocking questions (cannot proceed on these without backend answer - AGENTS.md rules 5 and 10)
1. **Visit list**: the PDF has only create. Is there a `GET /api/v1/agent/visit` (list by date / by user) and a get-by-id? Without it the Visits tab, Home timeline, visit detail (`app/visit/[id]`) and metrics cannot show server data after app restart. Interim option: keep only the just-created visit from the create response in React Query cache (shows nothing after restart) - not recommended.
2. **Visited/not-visited toggle & check-out**: the current UI has a status toggle and "check out". No endpoint exists. Remove these controls, or is an endpoint coming?
3. **Offline for Add Visit**: AGENTS.md says every write goes through the outbox, but worklog was made online-only (ADR-008). Should Add Visit be online-only too (simple, no migration), or queued offline? Queued needs: outbox `action` CHECK extension (DB migration, risky per 2.4), persisting the selfie file, and idempotency - and the endpoint has **no idempotency key**, so a retry after a lost response may create duplicate entity/visit. Backend dedupe?
4. **Token refresh**: access token lives 30 days and login returns `refreshToken`. Is there a refresh endpoint? If not, after 30 days user simply re-logs in (acceptable?).
5. **Notifications / Hospitals / Profile / Sync / App-config**: no backend docs. Skip for now (empty states) or share endpoints?
6. **Local HTTP**: `.env` uses `http://` LAN IP. Android release builds block cleartext; dev client works only if `usesCleartextTraffic` is on (touches `app.config.ts`, needs approval). Is it already configured, and does the phone reach the PC on the same Wi-Fi?
7. **Expenses page spec**: is there a P14 page spec / design for add-expense and the list? If not I will propose a layout on this page before coding.
8. **Entity creation by agent**: should the agent be allowed to create a new entity (hospitalType, bedCapacity, address) or only pick existing ones? PDF allows both; UI scope?

## Risks
- Server stores GPS and selfie only at create; permission denied for location/camera must block submit with clear message (reuse worklog handling).
- Multipart on React Native: do not let axios serialize FormData (already solved in `worklog.ts`).
- Search is prefix-only: UI copy must say "type the start of the name".
- Scope: agent is restricted to assigned states server-side; empty results may mean no assignment - show that hint.

## Acceptance criteria
- No mock data/arrays/fallback `catch` left in visits, notifications, auth, worklog.
- Add Visit creates entity+contact+visit in one call with real GPS + selfie; all 9 server 400s show a readable message.
- Expenses CRUD works against local server incl. receipt upload; approved ones read-only.
- `yarn typecheck && yarn lint && yarn test` green; manual test on device against local server.

## Test plan
Unit: Zod XOR rules, FormData builder (field names), error mapper, enum. Hook tests with mocked axios (test-only, no app mocks). Manual: real device on same Wi-Fi, airplane mode during submit (must show error, no data loss of typed form), permission denied, 401 mid-session.

## Evidence
(to fill at VERIFY)

## Backend answers (31 Oct 2026) - decisions
- Visit list `GET /agent/visit` and detail `GET /agent/visit/profile?id=` are now documented in `modules/visits.md` -> Q1 resolved. Visits tab, Home timeline, counters and visit detail read from them (Phase 1b).
- Q2 resolved: no status / check-out exists. Remove visited-toggle and check-out UI. "Visited" count = number of visits (all are visits).
- Q3: Add Visit online-only, no auto-retry until backend ships `Idempotency-Key`. No outbox/migration.
- Q4: refresh endpoint `POST /auth/refresh` with header `rtoken`, but agent expiry bug on backend; do not build refresh yet. On 401 -> clear token, go to login.
- Q5: notifications / profile / app-config not available; empty states. `GET /agent/profile` is promised, not yet documented.
- Login `account` contains a password hash: app must store/show only `_id`, `name`, `isManager` (verify `useAuth`).
- Errors are Nest defaults `{statusCode, message, error}`; no error codes, match by status + message text.
- Entity search is prefix-only; city/state/hospitalType in results promised but not live yet.

## Product owner decisions (31 Oct 2026)
- Contact `role` = free-text input. `contact` = string everywhere. Detail endpoint = `/agent/visit/profile?id=`.
- **Visits screen search bar**: typing searches entities (`/agent/entity/search`, debounced). Matching entities are listed; tapping one shows that entity's visits (`GET /agent/visit?entityId=`). If nothing matches: show an "Add visit" action that opens Add Visit with the typed name prefilled as a new entity.
- **Add Visit - entity step**: as the agent types the name, show similar existing entities below (same search). Picking one sets `entityId`; otherwise continue as a new entity (`entity[name]`).
- **Add Visit - contact step**: for a picked entity, load contacts (`/agent/entity-contact/by-entity`, not paginated) and filter by typed name/phone on the device. Pick existing -> `entityContactId`; else "Add new contact" (name + phone required, role free text). A newly created entity has no contacts, so go straight to new contact.
- Limitation to show in UI: search is prefix-only ("City Hospital" is not found by typing "Hospital"). Backend discussion on "contains" is open.
- Search confirmed: Visits-screen search lists **entities**. Tapping one opens the hospital detail page (`app/hospital/[id].tsx`, route stays thin; UI in a feature).
- **Hospital detail page**: (a) hospital info (name, address, city, state, hospitalType); (b) all contacts of the entity (`/agent/entity-contact/by-entity`): name, phone, role; (c) "Visited by" list from `GET /agent/visit?entityId=` showing agent name + date; tapping a row opens a popup with that visit's date, remark and the contact person met (name, phone, role, roleDesc) from `GET /agent/visit/profile?id=`. States: loading / empty / error / offline.
- Backend limit: visit endpoints are scoped to the caller, so "Visited by" shows only the **logged-in agent's own** visits to that hospital, not other agents'. Needs product confirmation or a new backend endpoint.
- Backend gap: no documented "get entity by id" endpoint. Hospital info can come from search results (city/state/hospitalType once backend adds them) or from a visit's populated `entityId`, but address/bed capacity for an entity with no visits is not available. Asked backend for `GET /agent/entity/profile?id=`. (not individual visits). Confirm.

## Notes / decisions
- Order proposed: Phase 0 -> 1 -> 2 -> 3. Phase 1 can start as soon as Q3 (offline) and Q8 (scope) are answered; Q1/Q2 block only the list/detail screens.
