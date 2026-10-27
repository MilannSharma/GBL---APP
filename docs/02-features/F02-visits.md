# F02 Today and Visits [DRAFT]

**Priority:** P0 | **Code:** `src/features/visits/` | **Screens:** Home (Today), Visit List, Visit Detail

## Goal
Show the agent what to do today and let them open any visit.

## User stories
- As an agent, I see today's visits sorted by planned time.
- As an agent, I see upcoming days and completed visits.
- As an agent, I open a visit to see hospital, time, instructions, status.

## Requirements
1. Home shows greeting, date, counters (Pending / In progress / Done), and today's visit cards.
2. Visit List has tabs: Today, Upcoming, Done.
3. Card shows: hospital name, area, time window, status chip, sync badge.
4. Pull to refresh. Pagination or infinite scroll for long lists.
5. Visit Detail shows all visit fields, instructions, contact, and the primary action (Check in / Continue / View).
6. Status values come from backend (e.g. Assigned, In progress, Completed, Cancelled).
7. Reassigned or cancelled visits update on refresh and via push.

## Business rules
- The agent cannot create or delete visits in v1.
- Primary action depends on status and check-in state.

## States
Loading skeleton, Empty ("No visits today"), Error with retry, Offline (cached data with "Last updated" time).

## Offline behavior
Today and upcoming visits are cached locally. Cache refreshes whenever online.

## API dependencies
`GET /visits`, `GET /visits/:id` (see `07-api/modules/visits.md`).

## Analytics
`home_viewed`, `visit_opened{id}`, `visits_refreshed`.

## Acceptance criteria
- [ ] List renders 100 visits smoothly
- [ ] Offline shows cached list with last updated time
- [ ] Status chip colors match design system
- [ ] Pull to refresh updates the list and cache
