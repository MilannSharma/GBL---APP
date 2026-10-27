# F04 Check-in / Check-out [DRAFT]

**Priority:** P0 | **Code:** `src/features/checkin/` | **Screens:** Check-in, Check-out / Review

## Goal
Record proof that the agent arrived at and left the hospital.

## User stories
- As an agent, I check in when I arrive so my visit is verified.
- As an agent, I check out when I finish so the visit is complete.

## Requirements
1. On Check-in: request location permission if needed, capture GPS (lat, lng, accuracy) and timestamp.
2. Validate distance to hospital using backend radius. Show distance in meters.
3. If outside radius: block, or allow override with a mandatory reason (per `OPEN_QUESTIONS.md` #5).
4. Handle: permission denied, GPS off, low accuracy, mock location detected (flag to backend).
5. Check-out requires a completed form (see F05) and captures GPS + time again.
6. Timestamps use device time plus server time on sync; backend decides the truth.
7. Both actions work offline and are queued.

## Business rules
- One active check-in per agent at a time (backend may enforce).
- Cannot check out without check-in.

## States
Locating, Located, Too far, Permission denied, GPS disabled, Submitting, Queued (offline), Success.

## API dependencies
`POST /visits/:id/check-in`, `POST /visits/:id/check-out` (see `07-api/modules/visits.md`). Must send an idempotency key.

## Analytics
`checkin_started`, `checkin_success`, `checkin_blocked{reason}`, `checkout_success`.

## Acceptance criteria
- [ ] Check-in works with only foreground location permission
- [ ] Clear instructions when permission is denied, with a button to open settings
- [ ] Offline check-in is stored and synced exactly once
- [ ] Distance message is accurate within GPS accuracy
