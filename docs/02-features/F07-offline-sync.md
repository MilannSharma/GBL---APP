# F07 Offline and Sync [DRAFT]

**Priority:** P0 | **Code:** `src/db/`, `src/features/sync/` | **Screens:** Sync status (in Profile), banners across the app

## Goal
The app is fully usable without network and never loses agent data.

## Requirements
1. Local database (expo-sqlite) with tables for visits, hospitals, drafts, outbox, files.
2. **Reads:** UI reads from local DB. Network refreshes it (stale-while-revalidate).
3. **Writes:** go to the `outbox` table first with an idempotency key.
4. Sync engine runs on: app start, network regain, manual retry, after each write.
5. Retry with exponential backoff and a max attempt count; then mark Failed.
6. Order of operations is preserved per visit (check-in before form before check-out).
7. Conflict policy from `OPEN_QUESTIONS.md` #7 (default: server wins, user is notified).
8. Visible indicators: global offline banner, per-record sync badge, a "Sync now" action.
9. Data retention: purge old synced data after N days.

## States per record
`draft` -> `pending` -> `syncing` -> `synced` | `failed`.

## API dependencies
Every write endpoint must accept an `Idempotency-Key` header (see `07-api/CONVENTIONS.md`). Optional batch endpoint `POST /sync`.

## Analytics
`sync_started`, `sync_success{count}`, `sync_failed{reason}`, `offline_session{duration}`.

## Acceptance criteria
- [ ] Airplane mode: full visit can be completed
- [ ] Reconnect: all queued items sync once, in order
- [ ] Force-quit during sync does not duplicate or lose items
- [ ] Failed items can be retried manually

Deep dive: `04-engineering/OFFLINE_SYNC.md`.
