# P02 Login [DRAFT]

| | |
|---|---|
| **Route** | `(auth)/login.tsx` |
| **Feature** | F01 Auth |
| **Figma** | [TODO link] |
| **Code** | `app/(auth)/login.tsx` |

## Purpose
Let the agent sign in.

## UI elements
Logo, title, input(s) per login method (phone/email, password), primary Login button, support link, app version.

## Actions
Enter credentials, tap Login, toggle password visibility.

## States
Idle, Validation error, Submitting, Invalid credentials, Account locked, Network error.

## Navigation
Success -> P03 OTP (if OTP) or P04 Home.

## Acceptance criteria
- [ ] All states above are implemented
- [ ] Works offline where noted in the feature spec
- [ ] Accessible labels on all interactive elements
- [ ] Matches Figma at 360px and 430px widths
