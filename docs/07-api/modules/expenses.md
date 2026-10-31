# API: Expenses (Wallet Transactions)

**Base Path:** `/api/v1/wallet-transaction`  
**Used by:** Feature F09 (History & Expenses), Page P14  
**Module Status:** LIVE  

---

## `POST /api/v1/wallet-transaction/debit`
Submits a new field expense reimbursement claim with receipt/bill image uploads.

- **Status:** LIVE
- **Auth required:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data`

> [!IMPORTANT]
> The `userId` is extracted automatically from the Bearer token on the server. Do **not** send `userId` in the request body.

### Form-Data Fields
| Field | Type | Required | Description |
|---|---|---|---|
| `amount` | `number` \| `string` | **Yes** | Total monetary cost of expense |
| `desc` | `string` | No | Purpose or description of the expense |
| `expenseType` | `string` | **Yes** | Allowed enum: `"HOTEL"`, `"MEAL"`, `"TRAVEL"`, `"OTHER"` |
| `photos` | `file[]` | No | Receipt and bill photo attachments (multiple allowed) |

> [!WARNING]
> The enum value for meal/food expenses is **`MEAL`**, NOT `"FOOD"`.

---

## `GET /api/v1/wallet-transaction`
Lists expense debit transactions with filters and pagination.

- **Status:** LIVE
- **Auth required:** `Authorization: Bearer <token>`

### Query Parameters
| Parameter | Type | Required | Default | Notes |
|---|---|---|---|---|
| `userId` | `string` | No | - | Optional user filter |
| `isApproved` | `boolean` | No | - | Filter by approval state (`true` / `false`) |
| `expenseType` | `string` | No | - | Filter: `HOTEL`, `MEAL`, `TRAVEL`, `OTHER` |
| `startDate` | `string` | No | - | Date range start (`YYYY-MM-DD`) |
| `endDate` | `string` | No | - | Date range end (`YYYY-MM-DD`) |
| `page` | `number` | No | `1` | Page number |
| `limit` | `number` | No | `10` | Records per page |

---

## `GET /api/v1/wallet-transaction/profile`
Fetches a single expense record by its ID.

- **Status:** LIVE
- **Auth required:** `Authorization: Bearer <token>`

### Query Parameters
| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | **Yes** | Expense transaction ID |

**Example:**
```http
GET /api/v1/wallet-transaction/profile?id=67401123abcdef
```

---

## `PATCH /api/v1/wallet-transaction`
Updates an existing unapproved expense belonging to the agent.

- **Status:** LIVE
- **Auth required:** `Authorization: Bearer <token>`
- **Content-Type:** `application/json`

### Request Body
```json
{
  "id": "67401123abcdef",
  "amount": 500,
  "desc": "Dinner with client doctor",
  "expenseType": "MEAL"
}
```

> [!CAUTION]
> Approved expenses cannot be edited by the agent. Modifying another agent's record or an approved expense will return an authorization error.

---

## `DELETE /api/v1/wallet-transaction`
Deletes an unapproved expense belonging to the agent.

- **Status:** LIVE
- **Auth required:** `Authorization: Bearer <token>`

### Query Parameters
| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | **Yes** | Expense transaction ID to delete |

**Example:**
```http
DELETE /api/v1/wallet-transaction?id=67401123abcdef
```

> [!CAUTION]
> Approved expenses cannot be deleted by the agent.
