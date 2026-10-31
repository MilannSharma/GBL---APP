# API: Visits & Entities (Agent)

**Base Path:** `/api/v1/agent`  
**Used by:** Feature F02 (Visits), Home timeline, Visit detail  
**Module status:** LIVE (list / profile / with-entity / entity search / contacts). Source: backend developer, 31 Oct 2026.

All routes require `Authorization: Bearer <agent access token>` (agent role only; others get 403). Results are always scoped to the calling agent: `userId` comes from the token, never from the request.

> A visit is a single point-in-time record (`visitedAt`, entity, contact, selfie, remark, location). It has **no status, no check-in/check-out**. The old `check-in`, `check-out`, `PUT /visits/:id` and `forms/schema` endpoints do not exist.

---

## `GET /api/v1/agent/entity/search`
Prefix, case-insensitive type-ahead search of entities by name (index based, not "contains"). Scoped to the agent's assigned states.

| Query | Type | Required | Notes |
|---|---|---|---|
| `name` | string | No | Prefix match. Omit to list all |
| `page` | number | No | Default 1 |
| `limit` | number | No | Default 10 |

Response 200: paginated `{ docs: [{ _id, id, name }], totalDocs, limit, page, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage, pagingCounter }`.
**Pending from backend:** `address.city`, `address.state`, `hospitalType` in each doc (confirmed "will add").

## `GET /api/v1/agent/entity-contact/by-entity`
| Query | Type | Required |
|---|---|---|
| `entityId` | string | **Yes** (400 if missing) |

Response 200: plain array (not paginated) of `{ _id, name, contact, email, role, roleDesc, entityId, createdBy, createdAt }`.
`role` is **free text** (confirmed by the product owner; the older enum MEDICAL_DIRECTOR/ADMINISTRATOR/DOCTOR/NURSE/OTHER is not enforced by the UI). `contact` is always a **string** in the app, even though the list/profile sample shows a number.

## `POST /api/v1/agent/entity-contact`
Saves a contact on a hospital without logging a visit. `application/json`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `entityId` | ObjectId | **Yes** | |
| `name` | string | **Yes** | |
| `contact` | string | **Yes** | Phone as a string, leading zeros kept |
| `role` | string | No | Free text |
| `roleDesc` | string | No | Free text |

Response 201: the contact `{ _id, entityId, name, contact, role, roleDesc, createdBy, createdAt, updatedAt }`.
400: `entityId is required` / `name is required` / `contact is required`.

## `POST /api/v1/agent/visit/with-entity`
`multipart/form-data`. Creates entity (if new) + contact (if new) + visit in one DB transaction.

> Verified on the dev server (31 Oct): the JSON-string format below works; bracket notation (`entityContact[name]`) is still accepted. The app sends JSON.

| Field | Type | Required | Notes |
|---|---|---|---|
| `selfie` | file (image) | **Yes** | Max 5 MB (400 `selfie must be 5 MB or smaller`) |
| `entityId` | ObjectId | XOR | Existing hospital. Exactly one of `entityId` / `entity` |
| `entity` | JSON string | XOR | `{ name, hospitalType?, bedCapacity?, address? }`, only `name` required |
| `entityContactId` | ObjectId | XOR | Existing contact. Exactly one of `entityContactId` / `entityContact` |
| `entityContact` | JSON string | XOR | `{ name, contact, role?, roleDesc? }`, `name` and `contact` required |
| `location` | JSON string | **Yes** | `{ latitude, longitude, accuracy? }` |
| `remark` | string | No | |
| `worklogId` | ObjectId | No | |

400 messages: `Send either entityId or entity, not both` / `entityId or entity.name is required` / `Send either entityContactId or entityContact, not both` / `entityContactId or entityContact.name & entityContact.contact are required` / `location.latitude and location.longitude are required` / `selfie is required` / `selfie must be 5 MB or smaller` / `entityContactId does not belong to the resolved entity`.

Response 201: `{ entity, entityContact, visit }`. `visit.selfie` can be missing if the S3 upload failed after commit.
**Safe to retry:** the same payload (same entity + contact) within 2 minutes returns the original visit instead of duplicating. No idempotency header is needed. The app retries automatically only on network errors (max 2).

## `GET /api/v1/agent/visit/for-entity`
Team-wide history of one hospital: visits by **any** agent, newest first. Not scoped to the caller.

| Query | Type | Required |
|---|---|---|
| `entityId` | ObjectId | **Yes** (400 `entityId is required`) |
| `page`, `limit` | number | No (defaults 1, 10) |

Each doc has exactly: `_id, visitedAt, remark, userId { _id, name, code }, entityContactId { _id, name, contact (string), role, roleDesc }`. No selfie, location or entity. Paginated like the other lists.
Other agents' visits cannot be opened through `/visit/profile` (own visits only); the history row already holds the popup data.

## `GET /api/v1/agent/visit`
Own visits, newest first, paginated.

| Query | Type | Required | Notes |
|---|---|---|---|
| `entityId` | ObjectId | No | |
| `startDate`, `endDate` | `YYYY-MM-DD` | No | Inclusive range |
| `date` | `YYYY-MM-DD` | No | Single day, ignored if start/end sent |
| `page` | number | No | Default 1 |
| `limit` | number | No | Default 10 |

Response 200: `{ docs, totalDocs, page, limit, hasNextPage, hasPrevPage, nextPage, prevPage, pagingCounter, totalPages }`. Each doc:
```json
{
  "_id": "...", "visitedAt": "2026-10-20T09:42:11.000Z", "remark": "...",
  "location": { "_id": "...", "location": { "type": "Point", "coordinates": [77.5946, 12.9716] }, "accuracy": "12" },
  "selfie": { "url": "...", "fileName": "...", "fileType": "image/jpeg", "size": 184320, "uploadTime": "..." },
  "userId": { "_id": "...", "name": "...", "code": "..." },
  "entityId": { "_id": "...", "name": "...", "address": { "city": "", "state": "", "district": "" }, "hospitalType": "" },
  "entityContactId": { "_id": "...", "name": "...", "contact": 9876543210, "role": "..." },
  "createdAt": "..."
}
```
GeoJSON `coordinates` are **[longitude, latitude]**. Errors: 401, 403.

## `GET /api/v1/agent/visit/profile?id=<visitId>`
One visit, same shape as above plus `entityContactId.roleDesc`, `entityId.address.pincode`, `updatedAt`. `selfie` absent if upload failed.
Errors: 400 `Id is missing` · 400 `Visit not found` · 400 `You can only view your own visit` · 401.

## Offline / sync notes
Add Visit is online-only (no outbox): it needs a live GPS fix, a selfie and the server transaction. Lists and profile are plain reads.
