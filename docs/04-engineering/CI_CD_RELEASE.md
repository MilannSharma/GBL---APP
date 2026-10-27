# CI/CD and Release [DRAFT]

## Pipeline (GitHub Actions + EAS)
**On every PR:** install (`yarn install --immutable`), `yarn typecheck`, `yarn lint`, `yarn test`.

**On merge to `develop`:** EAS Build `preview` profile (internal), EAS Update to `staging` channel.

**On merge to `main` / tag:** EAS Build `production`, EAS Submit to TestFlight and Play internal track.

## EAS profiles (`eas.json`)
| Profile | Purpose | Distribution |
|---|---|---|
| development | Dev client | Internal |
| preview | QA/staging builds | Internal (APK / TestFlight) |
| production | Store | Store |

## Versioning
- `version` = semantic (1.2.0), build numbers auto-incremented by EAS.
- Runtime version policy: `appVersion` so OTA updates only reach matching binaries.

## OTA updates
Use for JS and asset fixes only. Native changes (new permission, new native module) need a new store build.

## Release steps
1. Freeze `develop`, run full QA checklist.
2. Update changelog and version.
3. Build production, test on real devices.
4. Submit to TestFlight / Play internal, then beta group.
5. Staged rollout: Play 10% -> 50% -> 100%, App Store phased release.
6. Monitor Sentry, crash-free rate, sync failures for 48h.
7. Rollback plan: disable feature via flag, push OTA fix, or halt the staged rollout.

## Store requirements checklist
App icons, screenshots, description, privacy policy URL, data safety (Play) and privacy nutrition labels (Apple), permission reasons, test credentials for reviewers.
