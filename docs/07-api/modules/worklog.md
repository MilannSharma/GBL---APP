# API: Work Day Log (Shift)

**Base Path:** `/api/v1/agent/worklog`  
**Used by:** Feature F02 (Visits / Day Session), Home Dashboard Hero Card, Day Start Guard  
**Module Status:** LIVE  
**Target:** Mobile App Developer (iOS & Android)

All routes below require `Authorization: Bearer <token>` for an active agent account. Admin or manager tokens receive a 403 on these endpoints.

---

## 1. Start Work Shift

### `POST /api/v1/agent/worklog/start`
Starts the work shift for today. Fails with HTTP `400` if work was already started today.
`workStartedAt` is automatically stamped with the server's current time (IST).

- **Status:** LIVE
- **Auth required:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data`

#### Form-Data Fields
| Field | Type | Required | Notes |
|---|---|---|---|
| `initialReading` | `number` | **Yes** | Odometer KM reading at start |
| `startMeter` | `file` | **Yes** | Photo file of the starting odometer meter |
| `latitude` | `string` | **Yes** | GPS latitude coordinate |
| `longitude` | `string` | **Yes** | GPS longitude coordinate |
| `accuracy` | `string` | No | GPS accuracy in meters |
| `vehicle` | `string` | No | Optional enum: `"CAR"` or `"BIKE"` |

#### Response (200 OK)
Returns the created `worklog` document.

---

## 2. End Work Shift

### `POST /api/v1/agent/worklog/end`
Ends the work shift for today. Fails with HTTP `400` if today's work was never started, or was already ended.
`workEndedAt` is stamped by the server's current time.

- **Status:** LIVE
- **Auth required:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data`

#### Form-Data Fields
| Field | Type | Required | Notes |
|---|---|---|---|
| `finalReading` | `number` | **Yes** | Odometer KM reading at end |
| `endMeter` | `file` | **Yes** | Photo file of the ending odometer meter |
| `latitude` | `string` | **Yes** | GPS latitude coordinate |
| `longitude` | `string` | **Yes** | GPS longitude coordinate |
| `accuracy` | `string` | No | GPS accuracy in meters |

#### Response (200 OK)
Returns the updated `worklog` document with `workEndedAt` and `finalReading`.

---

## 3. Read Work Logs (List, Own Only)

### `GET /api/v1/agent/worklog`
Fetches a paginated list of work day logs for the logged-in agent.

- **Status:** LIVE
- **Auth required:** `Authorization: Bearer <token>`

#### Query Parameters
| Parameter | Type | Required | Default | Notes |
|---|---|---|---|---|
| `startDate` | `string` | No | - | Start date filter (`YYYY-MM-DD`) |
| `endDate` | `string` | No | - | End date filter (`YYYY-MM-DD`) |
| `page` | `number` | No | `1` | Page number |
| `limit` | `number` | No | `10` | Records per page |

#### Response (200 OK)
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

## 4. Read Today's Work Log (Own Only)

### `GET /api/v1/agent/worklog/user?date=YYYY-MM-DD`
Retrieves the single work log for the caller for that date.

- **Status:** LIVE
- **Auth required:** `Authorization: Bearer <token>`

#### Query Parameters
| Parameter | Type | Required | Description |
|---|---|---|---|
| `date` | `string` | **Yes** | Target date formatted as `YYYY-MM-DD` |

#### Response (200 OK)
Returns the single `worklog` JSON object for that date, or `null`/404 if no shift was started.

## Business rules
- A shift can be started **once** and ended **once** per IST day. A second call returns HTTP 400; the app also blocks it before calling the API.
- Start/End are online-only (ADR-008).
- Auto-closing a shift left open at midnight is a backend responsibility (OPEN_QUESTIONS #14). The app only rolls its UI over to the new IST day at midnight; it never fakes an End call.
