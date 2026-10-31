# TASK-026: Generate Android APK Build
- Feature: Build & Release
- Page: N/A
- Priority: P0
- Owner (human): Human Owner
- Agent role(s): Planner / Implementer
- Status: planned

## Goal (1-2 lines)
Compile and generate a standalone installable Android APK (`.apk`) using local Gradle build tools and export the output file to the `Builds/` folder for direct device installation.

## In scope
1. **Pre-build Verification:**
   - Run `yarn typecheck` to confirm 0 TypeScript compilation errors.
2. **Build Execution:**
   - Navigate to `android/` directory.
   - Run Gradle task `.\gradlew.bat assembleRelease` (or `assembleDebug`) using local Android SDK and Java JDK.
3. **Artifact Export:**
   - Copy generated `.apk` from `android/app/build/outputs/apk/release/app-release.apk` to `Builds/Testing/FieldAgent-v1.0.0.apk`.
   - Provide file location and file size.

## Out of scope
- Production store deployment (Google Play Console).
- iOS IPA build.

## Spec links
- `android/app/build.gradle`
- `eas.json` (preview buildType: apk)

## Acceptance criteria
- [ ] TypeScript check passes with 0 errors.
- [ ] Gradle build succeeds without errors.
- [ ] Standalone `.apk` is generated and saved in `Builds/Testing/FieldAgent-v1.0.0.apk`.

## Test plan
- Run Gradle assemble command.
- Confirm `.apk` exists with non-zero file size.
