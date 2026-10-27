# User Flows [DRAFT]

## Flow 1: Login
Splash -> (valid session?) yes -> Home; no -> Login -> (OTP if used) -> Home.

## Flow 2: Complete a visit (online)
1. Home shows today's visits.
2. Tap a visit -> Visit Detail.
3. Tap hospital -> Hospital Detail -> Directions (opens maps).
4. At location -> Check-in (GPS + time captured, validated).
5. Open Visit Form -> fill fields, add photos, capture signature.
6. Check-out -> review -> Submit.
7. Success screen -> back to Home. Visit moves to Done.

## Flow 3: Complete a visit (offline)
Same as Flow 2, but steps 4-7 are saved locally. A banner shows "Offline". Records get status `Pending sync`. When network returns, the queue syncs automatically and status changes to `Synced`.

## Flow 4: Sync failure
Sync fails -> retry with backoff -> after N failures the record shows `Failed` with a Retry button -> user taps Retry or contacts support.

## Flow 5: Notification
Push received -> tap -> deep link to the related Visit Detail. If the app was closed, it opens after the login check.

## Flow 6: Session expiry
API returns 401 -> app tries refresh token -> success: continue; fail: keep unsent work, show Login, keep queue after re-login.

## Flow 7: Logout
Profile -> Logout -> if unsynced data exists, warn user -> confirm -> clear tokens; local data handled per `05-security/SECURITY.md`.
