# Scalability [DRAFT]

Covers app scalability (code, team, performance) and what we need from the backend to scale users.

## 1. Code scalability (adding features without mess)
1. **Feature modules** with a public `index.ts`. Features import each other only through that file.
2. **Dependency direction:** `app` -> `features` -> `core` / `api` / `db` -> nothing. No circular imports.
3. **Shared UI** in `src/components/` only when used by 2+ features.
4. **Convention over config:** same folder layout inside every feature (`components/`, `hooks/`, `api/`, `types.ts`, `index.ts`).
5. **Adding a feature checklist:** spec in `02-features/`, folder in `src/features/`, route(s) in `app/`, API doc in `07-api/modules/`, tests, analytics events.
6. Lint rule `import/no-restricted-paths` to enforce boundaries.

## 2. Team scalability
- Spec-first: a feature file is the contract between designer, dev, QA.
- One feature per PR, small diffs, CODEOWNERS per module if team grows.
- Storybook (optional later) for components.
- Monorepo (Turborepo/Nx) only if a second app (e.g. admin) shares code. Not needed in v1.

## 3. Performance scalability
| Concern | Approach |
|---|---|
| Long lists | `FlashList` instead of `FlatList`, stable keys, memoized rows |
| Images | Resize before upload, thumbnails for lists, `expo-image` with caching |
| Startup | Lazy load heavy screens, defer non-critical init, keep splash until session known |
| Re-renders | Selectors in Zustand, memoization, avoid inline objects in lists |
| JS thread | Heavy work (image processing, large JSON) off the UI path, batch DB writes in transactions |
| Bundle | Remove unused libs, use Hermes, check bundle with `expo export` analysis |
| Memory | Release camera, clear large caches, limit photos in memory |
| DB | Indexes on `visit_id`, `date`, `status`; paginate queries; vacuum/purge old data |

**Targets:** cold start < 3s, list 60fps, memory stable over a 2-hour session, battery drain under 5% per hour in normal use.

## 4. Data scalability on device
- Cache window: only N days (confirm `OPEN_QUESTIONS.md` #4).
- Purge synced data older than the retention period.
- Photo storage cap with warning when low on space.
- DB migrations versioned, tested on upgrade from every released version.

## 5. Backend and user scalability (requirements for backend team)
| Need | Why |
|---|---|
| Cursor-based pagination | Stable lists at large volumes |
| Delta sync (`updated_since`) | Avoid re-downloading everything |
| Idempotency keys on writes | Safe retries from thousands of devices |
| Signed URL uploads (S3/GCS) | Do not stream photos through the API server |
| Rate limits with clear 429 + `Retry-After` | App backs off gracefully |
| Push via FCM/APNs queue | Scale notifications |
| API versioning (`/v1`) + min app version endpoint | Ship breaking changes safely |
| Gzip/Brotli, ETag/304 | Reduce mobile data |
| Observability (request ID in responses) | Trace field issues |

Plan for: 100 agents (launch), 1,000 (6 months), 10,000 (stretch). Confirm real numbers in `OPEN_QUESTIONS.md` #11.

## 6. Release scalability
- EAS Update for JS-only fixes, store release for native changes.
- Staged rollout (Play) and phased release (App Store).
- Feature flags to turn off a broken feature remotely.
- Runtime versioning so OTA updates never reach incompatible binaries.

## 7. Future extension points
Attendance, expenses, route tracking, chat, multi-language, dark mode, tablet. Each should be addable as a new feature module without touching existing ones.
