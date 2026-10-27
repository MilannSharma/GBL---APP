# Testing Strategy [DRAFT]

| Level | Tool | What | Target |
|---|---|---|---|
| Static | TypeScript, ESLint | Types, style | 0 errors |
| Unit | Jest | Utils, repositories, sync engine, validators | 80%+ on core logic |
| Component | React Native Testing Library | Screens and components states | Key screens |
| Integration | Jest + mock API (MSW) | Feature flows with fake backend | Each P0 feature |
| E2E | Maestro (or Detox) | Login, full visit, offline visit | Smoke suite per release |
| Manual | Real devices | Camera, GPS, push, weak network | Every release |

## Mock backend
Use MSW or a local mock server from `07-api/` examples so the app can be built before real APIs are ready.

## Device matrix (minimum)
- Android: low-end (2-3 GB RAM, Android 8-10), mid-range (Android 13), one Samsung
- iOS: older iPhone (iOS 15), current iPhone

## Network conditions to test
Offline, 2G/slow 3G, flapping, captive portal, airplane mode toggling mid-action.

## Regression checklist
See `08-project/QA_CHECKLIST.md`.

## Bug severity
P0 data loss or crash on launch, P1 core flow broken, P2 degraded behavior, P3 cosmetic.
