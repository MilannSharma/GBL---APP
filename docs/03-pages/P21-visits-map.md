# P21: Visits Map
- Route: `app/map.tsx` (centre button of the tab bar)
- Feature: F04 Visits
- Reference design: `Ui Refrence image/map.png`
- Task: TASK-024

## Purpose
Show today's hospital visits on a real map as a timeline route, and where the agent is right now.

## Data
- Visits: the same server visits as the Visits tab (`useHospitalVisits`). Only today's visits.
- Order: `visitedAt` ascending. The first visit added today is stop 1, the last is stop N.
- Position of a stop: the GPS point saved with the visit. A visit without a saved point is listed in the sheet only, not drawn.
- Agent position: device GPS (`expo-location`, foreground only).
- The server has no "not visited" state, so there is no Not Visited marker or legend.

## Layout
1. Header: back, title, subtitle, notifications, timeline pill (`N stops on today's route`), date pill.
2. Map: numbered hospital markers with Visited tag, name and area; blue route line from stop 1 to stop N; native live location dot; "You are here · <area>" chip.
3. Controls: locate me, zoom in, zoom out.
4. Bottom sheet "Visited Hospitals": count chip, one row per visit (name, area, time, date, chevron). Handle collapses the sheet.

## States
Loading, empty (no visits today), error with Retry, offline notice, location permission denied notice, visits without saved location notice.

## Config
Android uses Google Maps. The key is read from the `GOOGLE_MAPS_ANDROID_KEY` EAS secret in `app.config.ts`. iOS uses Apple Maps.
