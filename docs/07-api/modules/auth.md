# API: Authentication

**Base Path:** `/api/v1/auth`  
**Used by:** Feature F01, Pages P01 (Splash), P02 (Login), P03 (OTP)  
**Module Status:** LIVE  

---

## `POST /api/v1/auth/login/agent`
Authenticates a field agent account using password credentials or triggers an OTP flow.

- **Status:** LIVE
- **Auth required:** None (public endpoint)
- **Content-Type:** `application/json`

### Request Body

#### Option A: Text Login (Username, Email, or Phone String)
```json
{
  "username": "9876543210",
  "password": "yourPasswordHere"
}
```

#### Option B: Dedicated Contact Number (Numeric)
```json
{
  "contact": 9876543210,
  "password": "yourPasswordHere"
}
```

#### Request Fields
| Field | Type | Required | Description |
|---|---|---|---|
| `username` | `string` | Conditional (Option A) | Username, email, or mobile number as text string |
| `contact` | `number` | Conditional (Option B) | Mobile phone number as a raw numeric value (not string) |
| `password` | `string` | Required for password login | Agent account password |

> [!NOTE]
> - Account must be active (`isActive: true`).
> - If `contact` is sent without a `password`, the API triggers an OTP flow if enabled for that agent account.

### Response (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "account": {
    "_id": "673f4e2a1b9c8d0012345678",
    "name": "Sajibur Rahman",
    "isManager": false
  }
}
```

| Response Field | Type | Description |
|---|---|---|
| `token` | `string` | 30-day JWT access token. Required in `Authorization: Bearer <token>` for all other endpoints |
| `refreshToken` | `string` | 30-day refresh token |
| `account` | `object` | Agent profile information |
| `account._id` | `string` | MongoDB ObjectId for the agent (used as `userId` in worklogs & queries) |
| `account.name` | `string` | Full name of the agent |
| `account.isManager` | `boolean` | Role flag (false for field agents) |

### Error Responses
| HTTP Status | Reason |
|---|---|
| `400 Bad Request` | Missing required fields or contact is not a number |
| `401 Unauthorized` | Invalid password or inactive account (`isActive: false`) |
| `404 Not Found` | Agent username or contact not found in system |
