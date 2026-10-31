# SalesCRM — Agent App API Reference

**Backend Base Path:** `/api/v1`  
**Target:** Mobile App Developer (iOS & Android)  

All endpoints below return and accept **JSON** unless noted as `multipart/form-data` (used only where file uploads are involved).  
After logging in, send the 30-day access token on every subsequent request in the HTTP authorization header:
```http
Authorization: Bearer <token>
```

---

## 1. Agent Authentication

### `POST /api/v1/auth/login/agent`
Authenticates field agent credentials and returns 30-day access and refresh tokens.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Body Options

**Option A — Login with username/contact as a text string:**
```json
{
  "username": "9876543210",
  "password": "xxxxx"
}
```

**Option B — Login with contact as a dedicated numeric field:**
```json
{
  "contact": 9876543210,
  "password": "xxxxx"
}
```

> [!NOTE]
> - `username` accepts a username, email, or contact number (as a string).
> - `contact` must be sent as a **number**, not a string.
> - The agent account must be active (`isActive: true`).
> - If `contact` is sent without a password, the API triggers an OTP flow instead (only if OTP login is enabled for that account).

#### Success Response (200 OK)
```json
{
  "token": "<JWT access token, valid 30 days>",
  "refreshToken": "<valid 30 days>",
  "account": {
    "_id": "673f4e2a1b9c...",
    "name": "Sajibur Rahman",
    "isManager": false
  }
}
```

> [!IMPORTANT]
> Store `token` securely in `expo-secure-store` and pass it as `Authorization: Bearer <token>` on all subsequent requests.

---

## 2. Work Day Log (Start / End / Read)

Start and end are two separate calls. `workStartedAt` and `workEndedAt` are never read from the request — the server always stamps the server's own current time (IST).
Meter reading, meter photo, and GPS location are all required on both calls; the request is rejected with `400` if any one of the three is missing.

### Start work
`POST /api/v1/agent/worklog/start`  
`multipart/form-data`. Fails with `400` if work was already started today.

| Field | Type | Required | Notes |
|---|---|---|---|
| `initialReading` | `number` | **Yes** | Odometer KM reading |
| `startMeter` | `file` | **Yes** | Odometer photo captured by camera |
| `latitude` | `string` | **Yes** | GPS latitude |
| `longitude` | `string` | **Yes** | GPS longitude |
| `accuracy` | `string` | No | GPS accuracy in meters |
| `vehicle` | `string` | No | Optional — `"CAR"` or `"BIKE"` |

### End work
`POST /api/v1/agent/worklog/end`  
`multipart/form-data`. Fails with `400` if today's work was never started, or already ended.

| Field | Type | Required | Notes |
|---|---|---|---|
| `finalReading` | `number` | **Yes** | Odometer KM reading |
| `endMeter` | `file` | **Yes** | Odometer photo captured by camera |
| `latitude` | `string` | **Yes** | GPS latitude |
| `longitude` | `string` | **Yes** | GPS longitude |
| `accuracy` | `string` | No | GPS accuracy in meters |

Both calls are matched to “today” using the server's date (IST) — not a client-supplied date field.

---

### Read logs (list, own only)
`GET /api/v1/agent/worklog`  
Always scoped to the caller's own worklogs.

| Field | Type | Required | Notes |
|---|---|---|---|
| `startDate` | `string` | No | Optional filter (`YYYY-MM-DD`) |
| `endDate` | `string` | No | Optional filter (`YYYY-MM-DD`) |
| `page` | `number` | No | Default `1` |
| `limit` | `number` | No | Default `10` |

**Response:**
```json
{
  "docs": [
    {
      "_id": "673f4e2a1b9c...",
      "userId": "6ae0d59208f1beb464d8bcad",
      "date": "2026-10-29",
      "workStartedAt": "2026-10-29T08:04:00.000Z",
      "workEndedAt": null,
      "vehicle": "BIKE",
      "initialReading": 14250,
      "finalReading": null,
      "startMeter": "https://storage.cdn.../start-meter.jpg",
      "endMeter": null
    }
  ],
  "totalDocs": 1,
  "page": 1,
  "totalPages": 1
}
```

---

### Read a single day (own only)
`GET /api/v1/agent/worklog/user?date=YYYY-MM-DD`  
Returns a single worklog object for the caller for that date.

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `date` | `string` | **Yes** | Target date formatted as `YYYY-MM-DD` |

---

## 3. Expenses (Wallet Transactions)

Field expenses (meals, travel, hotel, other) are tracked as debit wallet transactions.

### `POST /api/v1/wallet-transaction/debit`
Creates a new expense reimbursement request with receipt images.

#### Request Headers
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

> [!IMPORTANT]
> The `userId` is automatically extracted from the JWT Bearer token on the server; do **not** send `userId` in the body.

#### Form-Data Fields
| Field | Type | Required | Description / Notes |
|---|---|---|---|
| `amount` | `number` \| `string` | **Yes** | Total monetary expense amount |
| `desc` | `string` | No | Optional remark, purpose, or note |
| `expenseType` | `string` | **Yes** | Enum: `"HOTEL"`, `"MEAL"`, `"TRAVEL"`, `"OTHER"` |
| `photos` | `file[]` | No | Receipt/bill images. Multiple file attachments allowed. |

> [!WARNING]
> The enum value for food expenses is **`MEAL`**, NOT `"FOOD"`.

---

### `GET /api/v1/wallet-transaction`
Lists expenses with filtering and pagination.

#### Request Headers
```http
Authorization: Bearer <token>
```

#### Query Parameters
| Parameter | Type | Required | Default | Notes |
|---|---|---|---|---|
| `userId` | `string` | No | - | Optional user filter |
| `isApproved` | `boolean` | No | - | Filter by approval status (`true` / `false`) |
| `expenseType` | `string` | No | - | Filter: `HOTEL`, `MEAL`, `TRAVEL`, `OTHER` |
| `startDate` | `string` | No | - | Date range start (`YYYY-MM-DD`) |
| `endDate` | `string` | No | - | Date range end (`YYYY-MM-DD`) |
| `page` | `number` | No | `1` | Page number |
| `limit` | `number` | No | `10` | Page limit |

---

### `GET /api/v1/wallet-transaction/profile`
Fetches a single expense record by ID.

#### Request Headers
```http
Authorization: Bearer <token>
```

**Example URL:**
```http
GET /api/v1/wallet-transaction/profile?id=67401123abcdef
```

---

### `PATCH /api/v1/wallet-transaction`
Updates an existing unapproved expense belonging to the agent.

#### Request Headers
```http
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "id": "67401123abcdef",
  "amount": 500,
  "desc": "Dinner with client doctor",
  "expenseType": "MEAL"
}
```

> [!CAUTION]
> Approved expenses **cannot** be edited by the agent. Modifying another agent's record or an approved expense will return an authorization error.

---

### `DELETE /api/v1/wallet-transaction`
Deletes an unapproved expense belonging to the agent.

#### Request Headers
```http
Authorization: Bearer <token>
```

**Example URL:**
```http
DELETE /api/v1/wallet-transaction?id=67401123abcdef
```

> [!CAUTION]
> Approved expenses **cannot** be deleted by the agent.
