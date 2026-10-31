# TASK-013: Integrate SalesCRM Agent App API Reference into API Documentation
- Feature: F01 Auth, F02 Visits/Worklog, F09 History/Expenses   Priority: P0
- Owner (human): Milan Sharma   Agent role(s): Planner, Docs agent
- Status: done

## Goal
Incorporate the provided official "SalesCRM — Agent App API Reference" into `docs/07-api/` in a clean, comprehensive, and properly formatted GitHub Markdown specification.

## In scope
1. **Consolidated Reference Document (`docs/07-api/SALES_CRM_API_REFERENCE.md`)**:
   - Provide the complete, pristine reference formatted with syntax-highlighted code blocks, parameter tables, and headers.
2. **Main API Index Update (`docs/07-api/README.md`)**:
   - Update base path to `/api/v1`, bearer token authorization scheme, and status of endpoints.
   - Link all corresponding module specifications.
3. **Module Breakdown**:
   - `docs/07-api/modules/auth.md`: Update with `POST /api/v1/auth/login/agent` (Option A & B, OTP note, 30-day token response).
   - `docs/07-api/modules/worklog.md`: Document `POST /api/v1/worklog` (start/end work with multipart/form-data odometer photos), `GET /api/v1/worklog`, and `GET /api/v1/worklog/user`.
   - `docs/07-api/modules/expenses.md`: Document `POST /api/v1/wallet-transaction/debit` (multipart/form-data bills, `MEAL` enum), `GET /api/v1/wallet-transaction`, `GET /api/v1/wallet-transaction/profile`, `PATCH`, and `DELETE`.

## Acceptance criteria
- [ ] Complete reference preserved with accurate types, parameters, enums (e.g. `MEAL`, `CAR`, `BIKE`), and multipart requirements.
- [ ] All tables, endpoints, and examples properly formatted in GitHub-Flavored Markdown.
- [ ] Cross-referenced cleanly in `docs/07-api/README.md`.
