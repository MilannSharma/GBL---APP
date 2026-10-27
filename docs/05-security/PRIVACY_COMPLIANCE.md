# Privacy and Compliance [DRAFT]

> Not legal advice. Have legal counsel review before launch.

## 1. Applicable frameworks (to confirm with legal)
- **India DPDP Act 2023** (Digital Personal Data Protection) for personal data of Indian individuals.
- Health data sensitivity: treat any patient information as highly sensitive.
- App Store and Google Play data policies.
- Hospital client contracts may impose extra rules.

## 2. Data inventory
| Data | Whose | Why | Stored where | Retention |
|---|---|---|---|---|
| Name, phone/email, agent ID | Agent | Account | Backend, device cache | Account life |
| GPS at check-in/out | Agent | Proof of visit | Backend | [TODO] |
| Photos | Hospital/patients possibly | Proof of work | Backend, device until upload | [TODO] |
| Signature | Hospital contact | Proof | Backend | [TODO] |
| Visit notes | Mixed | Reporting | Backend, device | [TODO] |
| Device ID, push token | Agent | Sessions, notifications | Backend | Until logout |

## 3. Principles
1. **Data minimization:** collect only what a feature needs. No patient names/IDs in free text unless required.
2. **Purpose limitation:** location only for visit verification.
3. **Consent and notice:** clear permission prompts and privacy policy in app.
4. **Retention:** define and enforce deletion periods (backend and device).
5. **Access control:** least privilege, audit trails.
6. **User rights:** access, correction, deletion requests handled via backend/process.
7. **Breach process:** notify as required by law.

## 4. Photos policy
Guidance in-app: avoid capturing patient faces or documents unless the visit type needs it. Remove location EXIF. Define who can view photos in the dashboard.

## 5. Location policy
v1: foreground location at check-in/out only. Background tracking is v2 and needs explicit consent, a visible in-app indicator, and store justification.

## 6. Store disclosures
- Apple: privacy nutrition labels, permission strings.
- Google Play: Data safety form, background location declaration (only if used).
- Public privacy policy URL, support contact, account deletion info if required.

## 7. Action items
- [ ] Legal review of data inventory
- [ ] Decide retention periods
- [ ] Draft privacy policy and terms
- [ ] Define consent screen content
- [ ] Decide if encrypted local DB is required
