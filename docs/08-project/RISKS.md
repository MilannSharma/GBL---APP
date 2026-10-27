# Risks [DRAFT]

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| 1 | Backend APIs delayed or change | High | High | Mocks (MSW), OpenAPI contract, versioning | |
| 2 | Weak hospital network | High | High | Offline-first, outbox, tests under bad network | |
| 3 | Sync bugs cause data loss or duplicates | Medium | High | Idempotency keys, extensive sync tests, failed-item UI | |
| 4 | Store rejection (permissions, privacy) | Medium | High | Clear permission text, privacy policy, early TestFlight | |
| 5 | Patient data compliance issue | Medium | High | Data minimization, legal review, encryption decision | |
| 6 | GPS inaccuracy indoors | High | Medium | Accuracy threshold, override with reason, backend review | |
| 7 | Battery or performance on low-end phones | Medium | Medium | Test on low-end devices, optimize lists/images | |
| 8 | Scope creep | High | Medium | Scope doc and change rule | |
| 9 | Expo SDK upgrade breaking changes | Medium | Medium | Pin versions, upgrade per quarter on a branch | |
| 10 | Key person dependency | Medium | Medium | Docs, code reviews, standards | |
