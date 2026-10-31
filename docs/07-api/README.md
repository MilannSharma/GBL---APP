# API Documentation — SalesCRM Field Agent App

**Backend Base Path:** `/api/v1`  
**Authentication:** `Authorization: Bearer <access_token>` (30-day JWT)  
**Full Master Reference:** See [SALES_CRM_API_REFERENCE.md](./SALES_CRM_API_REFERENCE.md)

---

## Active API Modules

| Module | Description | Endpoints File | Status |
|---|---|---|---|
| **Auth** | Agent login via username or contact number with 30-day JWT | [`modules/auth.md`](./modules/auth.md) | **LIVE** (`POST /api/v1/auth/login/agent`) |
| **Work Log (Shift)** | Daily shift start/end with vehicle odometer photo & logs | [`modules/worklog.md`](./modules/worklog.md) | **LIVE** (`/api/v1/agent/worklog/*`) |
| **Expenses** | Field expense reimbursement (meal, travel, hotel, other) with bills | [`modules/expenses.md`](./modules/expenses.md) | **LIVE** (`POST /api/v1/wallet-transaction/debit`, CRUD) |
| **Visits & Entities** | Entity search, contacts, add visit (with selfie), own visit list and detail | [`modules/visits.md`](./modules/visits.md) | **LIVE** (no check-in/out, no idempotency yet) |
| **Hospitals** | Hospital directory & details | [`modules/hospitals.md`](./modules/hospitals.md) | Mock fallback |
| **Notifications** | Push and in-app alerts | [`modules/notifications.md`](./modules/notifications.md) | Mock fallback |
| **Sync** | Offline queue synchronization | [`modules/sync.md`](./modules/sync.md) | In Progress |
| **App Config** | App remote versioning & configurations | [`modules/app-config.md`](./modules/app-config.md) | Planned |

---

## Conventions & Rules
- See [CONVENTIONS.md](./CONVENTIONS.md) for data types, header requirements, and error response shapes.
- All endpoints accept and return JSON unless explicitly specified as `multipart/form-data` for file uploads (odometer and bill receipts).
