# Project Plan [DRAFT]

## 1. Objective
Ship a production-grade, offline-capable field agent app for iOS and Android from one Expo codebase, integrated with an existing backend API.

## 2. Guiding principles
1. **Feature-based modules.** Each feature lives in its own folder and can be built and tested alone.
2. **API-first.** The app never contains business rules the backend owns. Contracts live in `07-api/`.
3. **Offline-first.** Every write goes to local storage first, then syncs.
4. **Typed everywhere.** TypeScript strict, schema validation at API boundaries (Zod).
5. **Small, reviewable PRs.** One feature or screen per PR.

## 3. Team (suggested)
| Role | Count | Notes |
|---|---|---|
| Mobile developer (RN/Expo) | 1-2 | Owns the app |
| Backend developer | 1 | Provides APIs, fills `07-api/` |
| UI/UX designer | 1 | Figma, design system |
| QA | 1 (part time ok) | Real device testing |
| Product owner | 1 | Decisions, priorities |

## 4. Phases

| Phase | Name | Output | Exit criteria |
|---|---|---|---|
| 0 | Discovery | Final PRD, open questions answered, API contract started | Docs reviewed |
| 1 | Foundation | Repo, CI, design tokens, API client, auth skeleton | App boots on both OS, login mock works |
| 2 | Core flows | Home, visits, hospitals (read) | Real API data visible |
| 3 | Field actions | Check-in/out, visit form, camera, signature | Full visit cycle online |
| 4 | Offline + sync | Local DB, sync queue, conflict handling | Full visit cycle offline |
| 5 | Notifications + polish | Push, empty/error states, accessibility | UX review passed |
| 6 | Hardening | Security review, performance, QA regression | Zero P0/P1 bugs |
| 7 | Release | TestFlight + Play internal, then production | Store approved |

Detailed schedule: `08-project/ROADMAP.md`.

## 5. Milestones
- **M1** App skeleton + auth working (end of phase 1)
- **M2** Agent can see today's visits from real API (phase 2)
- **M3** Agent can complete a visit online (phase 3)
- **M4** Same visit works fully offline (phase 4)
- **M5** Beta build to 5-10 real agents (phase 6)
- **M6** Production release (phase 7)

## 6. Dependencies
- Backend API contract and a stable **staging** environment
- Apple Developer account, Google Play account
- Final designs (Figma) before phase 2 starts
- Legal sign-off on privacy policy

## 7. Definition of Done (per feature)
- [ ] Spec in `02-features/` is met, acceptance criteria pass
- [ ] Works on Android and iOS (real device)
- [ ] Loading, empty, error and offline states done
- [ ] Unit tests for logic, one happy-path integration test
- [ ] No TypeScript or lint errors
- [ ] Accessibility checked (labels, tap size, contrast)
- [ ] Analytics events added
- [ ] Docs updated
