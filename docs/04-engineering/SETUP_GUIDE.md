# Setup Guide: Expo + Yarn [DRAFT]

## 1. Prerequisites
- Node.js LTS (20 or 22). Check: `node -v`
- Yarn via Corepack: `corepack enable` then `corepack prepare yarn@stable --activate` (or `npm i -g yarn`)
- Git, VS Code (extensions: ESLint, Prettier, Expo Tools)
- Android Studio with an emulator (Android 8+), and/or Xcode on a Mac (iOS simulator)
- Expo account at expo.dev
- Physical test devices (one low-end Android, one iPhone)

## 2. Create the project
```bash
yarn create expo-app field-agent-app
cd field-agent-app
yarn start
```
Choose the default template (TypeScript + Expo Router). Commit the initial state to Git.

If Yarn creates a `.yarnrc.yml` or Plug'n'Play setup, set `nodeLinker: node-modules` in `.yarnrc.yml`. React Native tooling expects `node_modules`.

## 3. Install core packages
Expo-managed packages (use `npx expo install` so versions match the SDK):
```bash
npx expo install expo-router expo-secure-store expo-location expo-task-manager \
  expo-camera expo-image-picker expo-image-manipulator expo-notifications \
  expo-sqlite expo-constants expo-device expo-network expo-local-authentication \
  expo-file-system expo-linking expo-localization expo-updates \
  react-native-maps react-native-gesture-handler react-native-reanimated \
  react-native-safe-area-context react-native-screens
```
Other libraries (use `yarn add`):
```bash
yarn add axios @tanstack/react-query zustand react-hook-form zod @hookform/resolvers \
  i18next react-i18next date-fns react-native-signature-canvas @sentry/react-native
yarn add -D prettier eslint-config-prettier eslint-plugin-import jest jest-expo \
  @testing-library/react-native @types/jest husky lint-staged typescript
```
Rule: **Expo/native packages -> `npx expo install`. Everything else -> `yarn add`.**

## 4. TypeScript
`tsconfig.json`: `"strict": true`, path alias `"@/*": ["src/*"]`.

## 5. Environment variables
Create `.env.development`, `.env.staging`, `.env.production` (never commit real secrets):
```
EXPO_PUBLIC_API_URL=https://api-dev.example.com
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_SENTRY_DSN=
```
Anything with the `EXPO_PUBLIC_` prefix ships inside the app. Never put secrets there.

Use `app.config.ts` to read env and set name, bundle ID and package name per environment. See `ENVIRONMENTS.md`.

## 6. Development build (not Expo Go)
Expo Go does not support every native feature we need (push, background location, some plugins), so use a development build:
```bash
yarn global add eas-cli     # or: npx eas-cli
eas login
eas build:configure
eas build --profile development --platform android
eas build --profile development --platform ios
```
Install the build on a device, then run `yarn start --dev-client`.

## 7. Permissions
Configure in `app.config.ts` via plugins/`infoPlist`:
- Location when in use (reason string required for iOS)
- Camera, Photo library
- Notifications
- Face ID (if biometric lock)

Write honest, specific permission reasons. Vague text causes store rejection.

## 8. Code quality tooling
- ESLint + Prettier configs committed
- Husky pre-commit: `lint-staged` runs ESLint, Prettier, and `tsc --noEmit`
- Scripts in `package.json`:
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "format": "prettier --write ."
  }
}
```

## 9. Git workflow
- Branches: `main` (production), `develop` (integration), `feature/<name>`, `fix/<name>`
- PRs need one review, passing CI
- Commit style: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)

## 10. Accounts needed
Expo, Apple Developer (paid), Google Play Console (one-time fee), Sentry, Firebase (FCM for Android push), Apple Push key.

## 11. Verification checklist
- [ ] `yarn start` works, app opens on Android and iOS
- [ ] `yarn typecheck`, `yarn lint`, `yarn test` pass
- [ ] Dev build installs on a real device
- [ ] API base URL switches per environment
- [ ] A test call to the staging API succeeds
