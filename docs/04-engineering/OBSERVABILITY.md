# Observability and Analytics [DRAFT]

## Crash and error reporting
Sentry: JS and native crashes, breadcrumbs for navigation and API calls, release + environment tags, user ID (no personal data).

## Logging
Levels: debug (dev only), info, warn, error. Never log tokens, passwords, patient data, or full payloads.

## Analytics (events listed in each feature spec)
Use one wrapper `src/core/analytics`. Provider can be swapped (PostHog, Firebase, Amplitude). Respect user consent and privacy policy.

## Key metrics
| Metric | Source |
|---|---|
| Crash-free sessions | Sentry |
| Sync success rate, average sync delay | Analytics event `sync_*` |
| Offline session share | `offline_session` |
| Time from check-in to submit | Event timestamps |
| API error rate and latency by endpoint | Sentry / backend |
| Cold start time | Performance monitoring |

## Alerts
Crash spike, sync failure rate above 2%, login failure spike, 5xx spike.
