# F11 App Shell [DRAFT]

**Priority:** P0 | **Code:** `app/`, `src/api/`, `src/components/`, `src/config/`

## Goal
Everything shared so features stay small.

## Requirements
1. Navigation with Expo Router: auth group, tabs group (Today, Visits, History, Profile), stack screens.
2. Global providers: QueryClient, theme, i18n, auth, network status, error boundary.
3. API client: base URL from env, auth header, refresh flow, error mapping, request ID, timeout.
4. Shared components: Button, Input, Card, StatusChip, EmptyState, ErrorState, Skeleton, Banner, Sheet.
5. Global error handling and crash reporting (Sentry).
6. Force-update gate: if app version is below the minimum from backend, show update screen.
7. Maintenance mode screen.
8. Feature flags from backend or remote config.
9. Environment config: dev, staging, prod.

## Acceptance criteria
- [ ] Unhandled errors show a friendly screen and are reported
- [ ] Switching environment needs only an env change and rebuild
- [ ] Force update screen blocks old versions
