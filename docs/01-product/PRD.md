# Product Requirements Document (PRD) [DRAFT]

## 1. Summary
A mobile app for field agents who visit multiple hospitals daily. Agents see their assigned visits, navigate to a hospital, check in, record the work (notes, photos, signature), check out, and everything syncs to the backend, even with poor network.

## 2. Problem
Today field work is tracked on paper, calls or chat. This causes missing records, no proof of visit, delayed reporting and no visibility for managers.

## 3. Goals
| # | Goal | Success metric |
|---|---|---|
| G1 | Every visit is recorded digitally | 95%+ visits logged in app |
| G2 | Proof of visit | GPS + time on 100% check-ins |
| G3 | Works with weak network | 99% of offline submissions sync successfully |
| G4 | Fast daily use | Check-in to submit in under 3 minutes |
| G5 | Reliable | Crash-free sessions above 99.5% |

## 4. Non-goals (v1)
See `SCOPE.md`.

## 5. Users
See `PERSONAS.md`. Primary user: **Field Agent**. Admin tasks happen in a separate web dashboard.

## 6. Scope summary (MVP)
1. Authentication
2. Today / assigned visits
3. Hospital list and detail
4. Visit check-in and check-out
5. Visit form (notes, checklist, photos, signature)
6. Offline mode and sync
7. Push notifications
8. History
9. Profile and settings

Full detail per feature: `02-features/`. Per screen: `03-pages/`.

## 7. Functional requirements (high level)
- FR1: Agent can log in and stay logged in securely.
- FR2: Agent sees visits assigned for today and upcoming days.
- FR3: Agent can view hospital details and open directions in a maps app.
- FR4: Agent can check in only at the visit location (rule configurable by backend).
- FR5: Agent can fill a visit form, attach photos, capture a signature.
- FR6: Agent can check out and submit; submission is queued if offline.
- FR7: Agent sees sync state per record.
- FR8: Agent receives push notifications for new or changed assignments.
- FR9: Agent can view past visits.

## 8. Non-functional requirements
| Area | Requirement |
|---|---|
| Performance | Cold start under 3s on mid-range Android; list scroll 60fps |
| Offline | All core flows usable without network |
| Security | See `05-security/` |
| Compatibility | Android 8+ (API 26), iOS 15+ |
| Accessibility | Tap target 44px+, WCAG AA contrast, dynamic font scaling |
| Localization | English v1, structure ready for Hindi (i18n from day one) |
| Observability | Crash reporting, API error logs, key analytics events |
| Battery | Location only when needed in v1 |

## 9. Assumptions
- Agents are created by admin. No self sign-up.
- Backend provides REST APIs with JWT access and refresh tokens.
- Backend owns business rules (visit assignment, geofence radius, form schema).
- Patient personal data is not stored on device beyond what the visit needs.

## 10. Dependencies and risks
See `00-plan/PROJECT_PLAN.md` and `08-project/RISKS.md`.

## 11. Release criteria
All MVP acceptance criteria met, QA regression passed, security checklist signed, privacy policy published, store listings ready.
