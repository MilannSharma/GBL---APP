# Coding Standards [DRAFT]

## TypeScript
- `strict: true`. No `any` (use `unknown` and narrow). No `@ts-ignore` without a comment and ticket.
- Prefer `type` for data shapes, `interface` for extendable contracts.
- Validate external data with Zod, infer types from schemas.

## React Native
- Function components and hooks only.
- Styles: `StyleSheet.create` with theme tokens. No hard-coded colors or spacing.
- Every touchable has `accessibilityLabel` and min size 44x44.
- Use `FlashList` for lists longer than ~20 items.
- Avoid inline functions/objects in list items.

## Naming
- Booleans: `isLoading`, `hasError`, `canSubmit`.
- Event handlers: `onPress`, `handleSubmit`.
- Constants: `UPPER_SNAKE_CASE`.

## State
- Server data: TanStack Query. Local UI/session state: Zustand. Form state: React Hook Form.
- Do not copy server data into Zustand.

## Errors
- Throw `AppError(code, message, meta)`. Catch at hook level, map to UI messages.
- Never swallow errors silently. Log with context, no personal data.

## Comments and docs
- Comment why, not what. Public hooks/functions get a short doc comment.
- Update the relevant spec file when behavior changes.

## Pull requests
- Small and focused. Description lists what, why, screenshots/video, test steps.
- Checklist: types, lint, tests, accessibility, offline state, analytics, docs.

## Security basics in code
- No secrets in code or `EXPO_PUBLIC_` vars.
- No logging of tokens or patient data.
- Use secure storage wrapper only for tokens.
