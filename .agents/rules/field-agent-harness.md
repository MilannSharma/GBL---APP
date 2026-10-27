# Field Agent Harness & Rules

This repository operates under strict Agent Harness guardrails defined in [AGENTS.md](file:///z:/Personal/GBLH/AGENTS.md). All AI agents must adhere to the following rules:

## 1. Source of Truth
- The documentation in `docs/` is the authoritative specification.
- Never write code for undocumented behavior or unverified APIs. Always verify `docs/02-features/`, `docs/03-pages/`, and `docs/07-api/`.

## 2. Core Directives
- **Offline-First:** All mutations must write to local SQLite and the sync outbox with a UUID idempotency key in the same transaction before network transmission.
- **Data Privacy & Security:** Never log, store in plain text, or send sensitive credentials, patient data, auth tokens, or OTPs to logs, analytics, or Sentry. Secure tokens in `expo-secure-store`.
- **Backend Owns Rules:** Never invent API endpoints or fields. Use `docs/07-api/` or mock layers marked `// TODO(api)`.
- **Yarn Only:** Package manager is Yarn. Expo/native libraries use `npx expo install`. All other libraries use `yarn add`.

## 3. Mandatory Task Lifecycle
Every change must follow:
1. `INTAKE`: Ensure task file exists in `docs/08-project/tasks/TASK-<number>-<slug>.md`.
2. `PLAN`: Detail files to touch, acceptance criteria, and risks.
3. `APPROVAL`: Obtain human approval before starting any "risky" task (auth, DB schema/migrations, sync outbox, native config/app.config.ts, dependencies).
4. `IMPLEMENT`: Small, modular commits.
5. `VERIFY`: Run `yarn typecheck`, `yarn lint`, and `yarn test`. Show verification evidence.
6. `REVIEW`: Checklist pass against specs and security.
7. `DOCS`: Update specs, ADRs, or task files.
8. `PR`: Prepare reviewable PR under ~400 lines.

## 4. Session Hand-off
At the end of every agent interaction, provide the standardized hand-off summary:
```
Done: <files changed>
Verified: <commands run + results>
Not done / follow-ups: <items remaining>
Risks / assumptions: <risks noted>
Questions for human: <questions for human approval/clarification>
```
