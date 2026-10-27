# State and Data Model [DRAFT]

## State ownership
| Data | Owner | Persisted |
|---|---|---|
| Auth tokens | Secure store | Yes (secure) |
| Current user | Query cache + DB | Yes |
| Visits, hospitals | SQLite via repositories | Yes |
| Form drafts | SQLite | Yes |
| Outbox | SQLite | Yes |
| UI state (modals, tabs) | Zustand / component state | No |
| Settings | AsyncStorage / SQLite key-value | Yes |
| Network status | Provider | No |

## Local DB tables (initial, adjust after API contract)
| Table | Key columns |
|---|---|
| `visits` | id, hospital_id, status, planned_start, planned_end, instructions, updated_at, synced_at |
| `hospitals` | id, name, address, lat, lng, phone, contact_name, updated_at |
| `visit_events` | id, visit_id, type (check_in/check_out), lat, lng, accuracy, device_time, status |
| `form_drafts` | visit_id, data_json, updated_at, status |
| `files` | id, visit_id, local_uri, kind (photo/signature), upload_status, remote_url |
| `outbox` | id, idempotency_key, endpoint, method, payload_json, depends_on, attempts, last_error, status, created_at |
| `notifications` | id, title, body, visit_id, read, received_at |
| `meta` | key, value (last_sync, schema_version) |

## Migrations
- Numbered files in `src/db/migrations/`.
- Run at app start before any query. Never edit a released migration; add a new one.

## IDs
Create records on device with UUID v4 so offline writes have stable IDs. Backend maps or accepts client IDs (confirm in API doc).

## Time
Store UTC ISO strings. Display in local time. Keep device time and server time both on events.
