# Decision Log (ADR) [DRAFT]

Format: ID, date, decision, context, alternatives, consequences, status.

## ADR-001: Use Expo (React Native) with EAS
- **Status:** Accepted
- **Context:** Need iOS + Android from one codebase, fast delivery.
- **Alternatives:** Flutter, native Swift/Kotlin.
- **Consequences:** Use development builds, config plugins for native needs; fewer low-level controls than pure native.

## ADR-002: Yarn as package manager
- **Status:** Accepted
- **Consequences:** Commit `yarn.lock`; use `nodeLinker: node-modules` if Yarn Berry.

## ADR-003: Feature-based folder structure
- **Status:** Accepted
- **Consequences:** Features expose only `index.ts`; enforce with lint.

## ADR-004: Offline-first with SQLite + outbox
- **Status:** Accepted
- **Consequences:** More engineering up front; required by field conditions.

## ADR-005: Server wins on conflicts
- **Status:** Proposed (confirm with backend)

## ADR-006: Foreground location only in v1
- **Status:** Proposed (confirm in `OPEN_QUESTIONS.md` #3)

## ADR-007: Certificate pinning
- **Status:** Open

## ADR-008: Work day log (start/end shift) is online-only
- **Status:** Accepted (product owner, 2026-10-29)
- **Context:** `/api/v1/agent/worklog/start|end` require an odometer photo and GPS, and the server stamps the time. The owner wants no offline handling for this module.
- **Decision:** Start/End shift call the API directly with no local DB write or outbox item. Failures (network, 4xx) are shown inline in the modal and the agent retries manually.
- **Consequences:** An agent without connectivity cannot start or end a shift. This is a deliberate exception to AGENTS.md prime directive 2 and applies to the worklog module only.

## Template
```
## ADR-XXX: Title
- Status: Proposed | Accepted | Superseded
- Context:
- Decision:
- Alternatives:
- Consequences:
```
