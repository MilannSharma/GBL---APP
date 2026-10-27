# F10 Profile and Settings [DRAFT]

**Priority:** P1 | **Code:** `src/features/profile/` | **Screens:** Profile, Settings, Sync status

## Requirements
1. Show agent name, ID, phone/email, photo (if any).
2. Settings: biometric lock, notification toggle, language (later), data usage (photo quality).
3. Sync status: last sync time, pending count, failed items with retry.
4. About: app version, build number, privacy policy, terms, support contact.
5. Logout with unsynced data warning.
6. Delete account request link, if required by store policy (confirm with legal).

## API dependencies
`GET /me`, `PUT /me/settings` (optional).

## Acceptance criteria
- [ ] Logout with pending items shows a warning with count
- [ ] Version and build number are correct on both OS
