# Build Guide (Android and iOS)

Task: TASK-025. Profiles are in [eas.json](../../eas.json).

## Profiles
| Profile | Command | Output | `EXPO_PUBLIC_ENV` | Android package |
|---|---|---|---|---|
| development | `eas build --profile development --platform android` | APK with dev client | development | `com.gblh.fieldagent.development` |
| preview | `eas build --profile preview --platform android` | APK for testers | staging | `com.gblh.fieldagent.staging` |
| production | `eas build --profile production --platform android` | AAB for Play | production | `com.gblh.fieldagent` |

All three call `https://salesapis.ayurmedicfuture.in` (the only backend). The env value only changes the app name and the app id, so builds can sit side by side on one phone.

## Local `.env` (git-ignored, not sent to EAS)
```
EXPO_PUBLIC_API_URL=https://salesapis.ayurmedicfuture.in
EXPO_PUBLIC_ENV=production
GOOGLE_MAPS_ANDROID_KEY=<key>
```
Local `expo run:android` reads this file. EAS builds do not read it: they take `env` from `eas.json` and secrets from EAS.

## One-time setup (needs your Expo account)
1. `npm i -g eas-cli` (or use `npx eas-cli@latest` in front of every command below).
2. `eas login`
3. `eas init` inside the repo. It links the project and writes `extra.eas.projectId` into the app config. Commit that change.
4. Google Maps key as an EAS secret, not in code:
   `eas secret:create --scope project --name GOOGLE_MAPS_ANDROID_KEY --value "<key>"`
5. First Android build asks to generate a keystore. Let EAS manage it.

## Google Maps key restrictions
- Enable only **Maps SDK for Android** on the key.
- Add one Android app restriction per package name in the table above, each with the SHA-1 of its keystore: `eas credentials -p android`, then pick the profile and read "SHA1 Fingerprint".
- iOS uses Apple Maps, so no key is needed there.

## Before every release
- `yarn typecheck`, `yarn lint` (0 errors) and `yarn test` pass.
- Walk through [QA_CHECKLIST.md](../08-project/QA_CHECKLIST.md) and [RELEASE_CHECKLIST.md](../08-project/RELEASE_CHECKLIST.md).
- Replace the test data problems listed in `docs/07-api/API_USAGE_MAP.md` (expenses list, mock notifications).
- iOS: `eas build --profile production --platform ios` needs an Apple Developer account.

## Notes
- A new native module (`react-native-maps`) was added in TASK-024, so older development builds will not run this code. Build a new development client first.
- `appVersionSource` is `remote`, so EAS increments the build number on production builds. Change `version` in `app.config.ts` by hand for a new release.
