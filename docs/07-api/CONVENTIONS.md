# API Conventions [TODO: backend developer to fill]

Items marked "Requested" are what the mobile app needs. Backend confirms or changes them.

| Topic | Requested | Actual (backend fills) |
|---|---|---|
| Base URLs | dev / staging / prod | |
| Versioning | `/v1` prefix | |
| Format | JSON, UTF-8 | |
| Auth | `Authorization: Bearer <access_token>` | |
| Token lifetime | access 15 min, refresh 30 days | |
| Refresh flow | `POST /auth/refresh`, rotation | |
| Time format | ISO 8601 UTC (`2026-10-26T09:30:00Z`) | |
| ID format | UUID | |
| Idempotency | `Idempotency-Key` header on all POST/PUT/PATCH | |
| Pagination | Cursor: `?cursor=&limit=` returns `next_cursor` | |
| Delta sync | `?updated_since=<ISO time>` on list endpoints | |
| Request ID | `X-Request-Id` in response | |
| Rate limit | 429 with `Retry-After` | |
| Min app version | `X-App-Version` header sent by app; endpoint returns min version | |
| Language | `Accept-Language` | |
| Compression | gzip/brotli | |

## Standard success envelope
```json
// [TODO confirm]
{ "data": {}, "meta": {} }
```

## Standard error format
```json
// [TODO confirm]
{ "error": { "code": "STRING_CODE", "message": "Human readable", "details": {} } }
```

## Error codes list
| HTTP | Code | Meaning | App behavior |
|---|---|---|---|
| 400 | | Validation failed | Show field errors |
| 401 | | Token invalid/expired | Refresh or logout |
| 403 | | Not allowed | Show message |
| 404 | | Not found | Remove from cache |
| 409 | | Conflict | Conflict flow |
| 422 | | | |
| 429 | | Rate limited | Backoff |
| 500 | | Server error | Retry |
(Backend fills code strings.)

## Enums (backend fills)
- Visit status: [TODO]
- Check-in type: [TODO]
- Upload kind: [TODO]
- Notification type: [TODO]
