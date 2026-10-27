# API Documentation [TODO: backend developer to fill]

This folder is intentionally **blank**. The backend developer fills it, and the mobile team builds against it. Until then, the mobile app uses mocks (MSW) shaped after these templates.

## How to fill
1. Fill `CONVENTIONS.md` first (base URL, auth, errors, pagination).
2. Copy `_ENDPOINT_TEMPLATE.md` rules and complete one file per module in `modules/`.
3. Prefer providing an OpenAPI/Swagger file at `openapi.yaml` and a Postman collection link. Then generate types for the app.
4. Mark each endpoint status: `PLANNED`, `IN PROGRESS`, `READY (staging)`, `LIVE`.
5. Any breaking change must update the doc and notify the mobile team.

## Modules
| Module | File | Status |
|---|---|---|
| Auth | `modules/auth.md` | TODO |
| Profile | `modules/profile.md` | TODO |
| Visits | `modules/visits.md` | TODO |
| Hospitals | `modules/hospitals.md` | TODO |
| Uploads | `modules/uploads.md` | TODO |
| Notifications | `modules/notifications.md` | TODO |
| Sync | `modules/sync.md` | TODO |
| App config | `modules/app-config.md` | TODO |

## Links
- OpenAPI file: [TODO]
- Postman collection: [TODO]
- Staging base URL: [TODO]
- Test accounts: [TODO]
