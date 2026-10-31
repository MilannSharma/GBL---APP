# TASK-023: Enhance Visits Map with Routes, Pinch-to-Zoom, Collapsible Sheet & Center Button
- Feature: F01 Navigation, F04 Visits Map
- Page: P04 Tabs Layout, P15 Visits Map
- Priority: P0
- Owner (human): Human Owner
- Agent role(s): Planner / Implementer
- Status: done

## Goal (1-2 lines)
Enhance the bottom navigation center button to route directly to `/map`, clean all 3D assets to 100% transparent PNGs, simplify map markers to hospital names only, add multi-touch pinch-to-zoom, enable collapsible bottom sheet for full map view, and draw sequential activity timeline route paths (1 -> 2 -> 3 -> 4) in glowing blue.

## In scope
1. **Navigation Bar Center FAB (`app/(tabs)/_layout.tsx`):**
   - Update center button press handler to navigate to `/map`.
   - Update center button icon to `Ionicons name="map"` and label to "Visits Map".

2. **Asset Transparency & Quality:**
   - Hospital 3D asset ([`assets/hospital-3d-pin.png`](file:///z:/Personal/GBLH/assets/hospital-3d-pin.png)): Re-extracted with illuminated blue pedestal and pure 100% transparent background (zero white/grey shadows).
   - Agent toon marker avatar ([`assets/agent-marker-avatar.png`](file:///z:/Personal/GBLH/assets/agent-marker-avatar.png)): Cleaned with razor-sharp silhouette and zero fringe/shadows.

3. **Map Marker Cleanup (`app/map.tsx`):**
   - Remove "Visited" badge and repetitive address text from floating marker callouts.
   - Display ONLY the clean hospital name (e.g., *SMS Hospital*, *Apex Hospitals*, *Fortis Escorts*, *EHCC Hospital*).
   - Add chronological stop badges (`[1]`, `[2]`, `[3]`, `[4]`) corresponding to the daily visit sequence.

4. **Multi-Touch Pinch-to-Zoom:**
   - Support smooth finger pinch-to-zoom in/out directly on the map viewport.
   - Maintain floating `+` and `-` controls as quick alternatives.

5. **Collapsible Bottom Sheet:**
   - Allow sliding down or tapping the drag handle to collapse the bottom sheet into a sleek floating pill (`4 Visited Hospitals • Tap to expand ▲`).
   - Grants the user an unobstructed full-screen view of Jaipur roads, landmarks, and routes.
   - Slide up or tap expands back to full details.

6. **Sequential Timeline Route (Blue Path 1 -> 2 -> 3 -> 4):**
   - Connect visited hospitals along Jaipur roads in activity timeline sequence:
     - Live Agent Location -> Stop 1 (*SMS Hospital*) -> Stop 2 (*Apex Hospitals*) -> Stop 3 (*Fortis Escorts*) -> Stop 4 (*EHCC Hospital*).
   - Draw glowing blue line segments (`#0E70E3`) with animated pulse dots and directional arrows showing route progression.

## Out of scope
- Third-party native map SDKs requiring proprietary API keys.

## Acceptance criteria
- [x] Center FAB navigates to `/map` with map icon.
- [x] 3D hospital and agent assets are 100% transparent without background artifacts.
- [x] Hospital markers show only clean names with sequence numbers `[1]`, `[2]`, `[3]`, `[4]`.
- [x] Map supports finger pinch-to-zoom and pan.
- [x] Bottom sheet collapses on slide-down for full map view.
- [x] Glowing blue route line connects stops in timeline order (1 -> 2 -> 3 -> 4).
- [x] `yarn typecheck` passes with 0 errors.

## Evidence
- `yarn typecheck`: Passed with 0 errors in 5.55s.
