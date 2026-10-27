# F05 Visit Form [DRAFT]

**Priority:** P0 | **Code:** `src/features/visit-form/` | **Screens:** Visit Form (multi-step), Review and Submit, Success

## Goal
Capture what the agent did during the visit in a structured way.

## User stories
- As an agent, I fill the form step by step without losing data.
- As an agent, I can leave the app and return to the same place.
- As an agent, I review everything before submitting.

## Requirements
1. Form schema is either fixed (decide in `OPEN_QUESTIONS.md` #2) or dynamic from backend.
2. Typical fields: status/outcome, notes, checklist items, contact met, next action, photos, signature.
3. Validation with React Hook Form + Zod, inline errors.
4. Autosave draft locally on every change (debounced).
5. Review screen shows summary before submit.
6. Submit queues a write; UI shows Pending sync or Synced.
7. After submit the form becomes read-only (unless backend allows edit).

## Business rules
- Required fields come from schema.
- Photo and signature requirements can be per visit type.

## States
Draft, Validation errors, Submitting, Queued, Synced, Failed (retry).

## Offline behavior
Fully usable offline. Drafts persist across app restarts.

## API dependencies
`PUT /visits/:id` or `POST /visits/:id/report`, `GET /forms/schema` if dynamic (see `07-api/modules/visits.md`).

## Analytics
`form_started`, `form_step_completed{n}`, `form_submitted`, `form_validation_error{field}`.

## Acceptance criteria
- [ ] Killing the app mid-form does not lose data
- [ ] Cannot submit with missing required fields
- [ ] Submit offline results in Pending sync and later Synced
- [ ] No duplicate submissions on retry
