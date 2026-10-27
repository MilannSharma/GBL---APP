# Architecture [DRAFT]

## 1. Overview
```
+-----------------------------+
|        Mobile App           |
|  Expo / React Native / TS   |
|                             |
|  UI (Expo Router screens)   |
|    |                        |
|  Feature modules            |
|    |        |               |
|  Hooks   State (Zustand)    |
|    |                        |
|  Data layer                 |
|   - Repository (per entity) |
|   - TanStack Query cache    |
|   - Local DB (SQLite)       |
|   - Outbox / Sync engine    |
|    |                        |
|  API client (axios)         |
+-------------|---------------+
              | HTTPS / REST
+-------------v---------------+
|    Backend APIs (external)  |
+-----------------------------+
```

## 2. Layers and responsibilities
| Layer | Responsibility | Must not |
|---|---|---|
| Screens (`app/`) | Routing, compose feature components | Contain business logic |
| Feature components | UI for one feature | Call axios directly |
| Hooks | Glue UI to data (`useVisits`, `useCheckIn`) | Access SQLite directly |
| Repositories | Single source for an entity: read local, refresh remote, write via outbox | Know about UI |
| API client | HTTP, auth, errors | Cache or store data |
| DB | Schema, migrations, queries | Call the network |
| Sync engine | Process outbox, retry, ordering | Be called from UI except via hooks |

## 3. Data flow
**Read:** UI -> hook -> repository -> local DB (instant) -> background refresh from API -> DB updated -> UI re-renders.

**Write:** UI -> hook -> repository -> write to DB + outbox (instant, optimistic) -> sync engine sends to API -> mark synced or failed.

## 4. Key technical decisions
| Topic | Decision | Why |
|---|---|---|
| Framework | Expo (dev build + EAS) | One codebase, fast iteration, managed native config |
| Routing | Expo Router (file-based) | Deep links built in, typed routes |
| Server state | TanStack Query | Caching, retries, background refetch |
| Local state | Zustand | Small, simple, no boilerplate |
| Local DB | expo-sqlite | Reliable relational offline storage |
| Validation | Zod | Runtime validation of API responses and forms |
| Forms | React Hook Form | Performance, easy validation |
| Errors | Typed `AppError` with codes | Consistent UI messages |
| Logging | Sentry + structured logs | Debug field issues remotely |
Record changes in `08-project/DECISIONS.md`.

## 5. API boundary rules
1. Every response is parsed with a Zod schema. If it fails, report to Sentry and show a safe error.
2. API types live in `src/api/types/` and are mapped to domain models in repositories.
3. UI uses domain models only, never raw API payloads.
4. One endpoint = one function in `src/api/endpoints/<module>.ts`.

## 6. Navigation structure
```
app/
  _layout.tsx           root providers
  index.tsx             splash / redirect
  (auth)/login, otp
  (tabs)/index, visits, history, profile
  visit/[id]/...        stack flow
  hospital/[id]
  notifications, settings, sync
  system/update
```

## 7. Error strategy
- Network errors: retry with backoff, show offline state, never block local work.
- 401: refresh token once, else logout.
- 4xx validation: map to field errors.
- 5xx: generic message, log to Sentry, allow retry.
- Unknown: error boundary screen with "Try again".

## 8. Cross-cutting concerns
i18n, theming, analytics, feature flags, permissions, deep linking, app versioning, crash reporting are provided by `src/core/` and used by all features.
