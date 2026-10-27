# Environments [DRAFT]

| Env | API | App ID suffix | Purpose |
|---|---|---|---|
| development | dev API | `.dev` | Daily development |
| staging | staging API | `.staging` | QA, UAT |
| production | prod API | none | Real users |

Different bundle IDs let all three be installed side by side.

## Config rules
- Read `EXPO_PUBLIC_ENV` in `app.config.ts` to set name, icon badge, bundle ID, package name.
- Values: API URL, Sentry DSN, feature defaults. No secrets.
- Secrets (signing keys, Apple/Google credentials) live in EAS secrets / CI, never in Git.

## Example `app.config.ts` idea
```ts
const env = process.env.EXPO_PUBLIC_ENV ?? 'development';
const suffix = env === 'production' ? '' : `.${env}`;
export default {
  name: env === 'production' ? 'Field Agent' : `Field Agent (${env})`,
  slug: 'field-agent-app',
  ios: { bundleIdentifier: `com.yourcompany.fieldagent${suffix}` },
  android: { package: `com.yourcompany.fieldagent${suffix}` },
};
```
Replace `com.yourcompany` with the final company ID (decide early, hard to change).
