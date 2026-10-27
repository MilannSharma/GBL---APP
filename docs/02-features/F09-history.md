# F09 History [DRAFT]

**Priority:** P1 | **Code:** `src/features/history/` | **Screens:** History list, History detail

## Goal
Let the agent review past visits and proof submitted.

## Requirements
1. List of completed visits, newest first, with date filter and search by hospital.
2. Detail shows submitted form data, photos (thumbnails), signature, check-in/out times.
3. Pagination. Cache the most recent N days locally.
4. Read-only.

## API dependencies
`GET /visits?status=completed`, `GET /visits/:id` (see `07-api/modules/visits.md`).

## Acceptance criteria
- [ ] Opens quickly with cached recent history offline
- [ ] Photos load lazily and handle failures
