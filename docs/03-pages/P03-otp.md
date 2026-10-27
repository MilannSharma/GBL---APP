# P03 OTP Verify [DRAFT]

| | |
|---|---|
| **Route** | `(auth)/otp.tsx` |
| **Feature** | F01 Auth |
| **Figma** | [TODO link] |
| **Code** | `app/(auth)/otp.tsx` |

## Purpose
Verify the one-time code (only if OTP login is chosen).

## UI elements
6-digit input, countdown timer, Resend button, Change number link.

## Actions
Enter code (auto-read SMS where possible), resend after timer.

## States
Idle, Verifying, Wrong code, Expired, Too many attempts.

## Navigation
Success -> P04 Home. Back -> P02.

## Acceptance criteria
- [ ] All states above are implemented
- [ ] Works offline where noted in the feature spec
- [ ] Accessible labels on all interactive elements
- [ ] Matches Figma at 360px and 430px widths
