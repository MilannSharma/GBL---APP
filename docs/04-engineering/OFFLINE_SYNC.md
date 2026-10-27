# Offline and Sync Design [DRAFT]

## Principles
1. Local DB is the source for the UI.
2. Every change is a command in the outbox.
3. The server is the final authority.
4. Never block the agent because of network.

## Outbox item
```
id, idempotency_key (uuid), endpoint, method, payload, depends_on (id or null),
attempts, next_attempt_at, last_error, status: pending | syncing | synced | failed
```

## Processing algorithm
1. Trigger: app start, network regained, after a write, manual Sync now, push received.
2. Take items with status `pending` and `next_attempt_at <= now`, ordered by `created_at`, only if `depends_on` is `synced`.
3. Mark `syncing`, send with `Idempotency-Key` header.
4. 2xx -> `synced`, update local records (remote IDs, timestamps).
5. 4xx (validation) -> `failed`, no retry, surface to user.
6. 401 -> refresh token, retry once. Fail -> pause queue, ask login.
7. 5xx / network -> backoff (e.g. 5s, 15s, 60s, 5m, 15m), max attempts then `failed`.
8. Concurrency: process one visit's chain sequentially, different visits can run in parallel (max 2-3).

## Ordering per visit
`check_in` -> `uploads (photos, signature)` -> `form submit` -> `check_out`.
Uploads produce remote URLs that the form payload references, so form depends on uploads.

## Conflicts
Default: **server wins**. If the server rejects with a conflict, keep the local copy marked `failed`, show "This visit was changed" and let the agent review. Final rule to confirm in `OPEN_QUESTIONS.md` #7.

## Reads and cache
- Initial sync on login: fetch visits for the window (today + N days) and linked hospitals.
- Delta refresh using `updated_since`.
- Show "Last updated" time when offline.

## Files
Save to app document directory. Upload with progress. After success delete the local file (keep thumbnail if needed). Resume after restart by reading `files.upload_status`.

## User-visible behavior
- Offline banner across the app
- Per-record badge: Draft, Pending sync, Synced, Failed
- Sync Status screen with retry
- Logout warning if pending items exist

## Test scenarios
Airplane mode full visit; network flap during upload; app killed mid-sync; token expiry mid-queue; duplicate retry; server 500 then recovery; clock skew on device; low storage.
