# Open Questions [TODO]

Please answer these. Update the docs after each answer.

| # | Question | Impacts | Answer | Owner |
|---|---|---|---|---|
| 1 | Login method: OTP, email+password, or SSO? | Auth, security | | |
| 2 | Exact visit form fields? Fixed or dynamic from backend? | Visit form, DB schema | | |
| 3 | Continuous background location, or only at check-in? | Battery, permissions, store review | | |
| 4 | How many days of data must be available offline? | DB size, sync | | |
| 5 | Geofence radius for check-in? Can agent override with a reason? | Check-in rules | | |
| 6 | Are agent phones company-managed or personal? | Security, MDM | | |
| 7 | Conflict rule: server wins or last write wins? | Sync | | |
| 8 | Photo limits (count, size) per visit? | Upload, storage | | |
| 9 | Languages needed at launch? | i18n | | |
| 10 | Brand: logo, colors, app name, bundle ID? | UI, store | | |
| 11 | Expected number of agents (100? 10,000?) | Scalability | | |
| 12 | Launch date and team size? | Roadmap | | |
| 13 | Is there patient data in the visit form? | Compliance (DPDP) | | |
| 14 | Unclosed shift at midnight (IST): closed by a backend job or API setting? App does nothing for this (owner decision 2026-10-29). | Worklog, backend | Backend developer to handle server-side; app only rolls the UI over to the new day. | Backend dev |
