# Security [DRAFT]

## 1. Assets to protect
Agent credentials and tokens, visit and hospital data, photos and signatures (may contain patient or staff info), location data.

## 2. Threats (summary)
Lost or stolen phone, rooted/jailbroken device, token theft, man-in-the-middle on hospital Wi-Fi, reverse engineering the app, leaked logs, malicious deep links, fake GPS, shared devices.

## 3. Controls

### Authentication and session
- Short-lived access token + refresh token. Rotate refresh tokens if backend supports it.
- Tokens only in `expo-secure-store` (Keychain / Keystore). Never in AsyncStorage, logs or URLs.
- Biometric / PIN lock when returning from background (optional setting, recommended default ON).
- Auto logout on refresh failure, remote session revocation honored on next call.
- Device binding / device ID sent to backend for session management.

### Network
- HTTPS only, no cleartext traffic (Android `usesCleartextTraffic: false`, iOS ATS on).
- Certificate pinning: evaluate for production (adds maintenance cost); decide in `DECISIONS.md`.
- Timeouts, no sensitive data in query strings.

### Data on device
- SQLite DB holds only needed fields. Evaluate encrypted DB (SQLCipher) if patient data is stored (see `OPEN_QUESTIONS.md` #13).
- Photos and signatures in app-private storage, deleted after upload.
- Disable OS backup of sensitive data (Android `allowBackup: false`, exclude from iCloud backup where possible).
- Clear sensitive data on logout; if unsynced items exist, warn first and keep the outbox encrypted or require re-login to sync.
- Mask sensitive screens in the app switcher; optional screenshot blocking on sensitive screens.

### Code and build
- No secrets in the bundle. `EXPO_PUBLIC_*` is public by definition.
- Hermes bytecode, release builds minified; ProGuard/R8 on Android.
- Dependencies audited (`yarn npm audit`), lockfile committed, Dependabot enabled.
- Signing credentials in EAS, not in Git.

### Device integrity
- Warn (or block per policy) on rooted/jailbroken devices.
- Detect mock location on Android and flag the check-in to backend.

### Logging and analytics
- No PII, tokens or payloads in logs, Sentry or analytics. Scrub before send.

### Deep links and push
- Validate deep link params (IDs only, check the user may access that visit via the API).
- Push payloads carry IDs, not sensitive content.

## 4. Backend expectations
Authorization checked on every request (agent can only access own visits), rate limiting, audit logs for check-in/out and edits, input validation, upload virus/type checks, signed URL expiry.

## 5. Security checklist before release
- [ ] Tokens only in secure store
- [ ] HTTPS enforced, no cleartext
- [ ] Logs reviewed for sensitive data
- [ ] Backups disabled for sensitive data
- [ ] Biometric lock tested
- [ ] Rooted device policy implemented
- [ ] Dependency audit clean (no high/critical)
- [ ] Permissions minimal and justified
- [ ] Penetration test or OWASP MASVS review done
- [ ] Incident response contact defined

## 6. Incident response
Report to security owner, revoke affected tokens, push forced-update or kill-switch via feature flag, notify per legal obligations (see `PRIVACY_COMPLIANCE.md`).
