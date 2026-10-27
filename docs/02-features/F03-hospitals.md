# F03 Hospitals [DRAFT]

**Priority:** P0 | **Code:** `src/features/hospitals/` | **Screens:** Hospital Detail (list optional)

## Goal
Give the agent all hospital info needed to reach it and meet the right person.

## User stories
- As an agent, I see address, contact person and phone.
- As an agent, I tap Directions and my maps app opens.
- As an agent, I tap the phone number to call.

## Requirements
1. Hospital Detail: name, address, department/contact, phone, notes, map preview.
2. Directions button opens Google Maps (Android) / Apple Maps (iOS) via deep link.
3. Call button uses the phone dialer.
4. Optional Hospital List with search (only if backend assigns many hospitals per agent).

## Business rules
- Read-only in v1.
- Coordinates come from backend and are used for check-in validation.

## States
Loading, Error, Offline (cached), Missing coordinates (hide map, show address only).

## Offline behavior
Hospitals for assigned visits are cached. The map preview may be blank offline; directions need network.

## API dependencies
`GET /hospitals`, `GET /hospitals/:id` (see `07-api/modules/hospitals.md`).

## Analytics
`hospital_viewed`, `directions_tapped`, `call_tapped`.

## Acceptance criteria
- [ ] Directions open the correct location on both OS
- [ ] Call opens the dialer with the number prefilled
- [ ] Missing data never crashes the screen
